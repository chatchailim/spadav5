#!/usr/bin/env node
"use strict";

// ชุดทดสอบควันของ DMS (SPD-TST-002 ภาคผนวก B) ใช้ข้อมูลสังเคราะห์ทั้งหมด
//
// วิธีใช้ (ต้องมีสำเนา onemanos-setbox ที่ใช้ Node 22+ และไม่ต้องมีอินเทอร์เน็ต):
//   node smoke-dms.js <โฟลเดอร์ onemanos-setbox>
//
// สคริปต์ทำเอง: สร้างคลังชั่วคราว → ใส่ผู้ใช้และนิติบุคคลสมมติ → เปิดเซิร์ฟเวอร์ที่พอร์ตว่าง
// (DMS_DEV_AUTH=true เฉพาะในการทดสอบนี้ ห้ามใช้ในระบบจริง) → ยิงคำขอ → ปิดและลบทิ้ง
// ไม่แตะคลังจริง ไม่เขียนอะไรใน repo ที่ตรวจ
// พิมพ์ผลเป็นตาราง และคืน exit code 1 ถ้ามีข้อใดไม่ตรงที่คาด

const { spawn } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const ROOT = path.resolve(process.argv[2] || ".");
process.env.DMS_DEV_AUTH = "true"; // ใช้ตอนใส่ข้อมูลสมมติเข้าคลังชั่วคราวเท่านั้น
const results = [];
const check = (id, title, ok, observed, known = false) => {
  // known = true: พฤติกรรมที่พบจริงและบันทึกเป็นข้อสังเกต (KI) ไม่ใช่ความคาดหวังตามสัญญา
  //   ok = true  → พฤติกรรมยังเป็นอย่างที่บันทึกไว้ (พิมพ์ KNOWN ไม่ทำให้ exit code เป็น 1)
  //   ok = false → พฤติกรรมเปลี่ยนไป (อาจถูกแก้แล้ว) พิมพ์ CHANGED และนับเป็นไม่ผ่าน เพื่อให้ผู้ทดสอบมาแก้ข้อสังเกตนี้
  results.push({ id, title, ok, observed, known });
  const tag = known ? (ok ? "KNOWN" : "CHANGED") : (ok ? "PASS " : "FAIL ");
  process.stdout.write(`${tag} ${id}  ${title}${ok ? "" : `  → ${String(observed).slice(0, 220)}`}\n`);
};

(async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "setbox-smoke-"));
  const { Warehouse } = require(path.join(ROOT, "warehouse"));
  const wpath = path.join(tmp, "w.db");
  // ข้อมูลทดสอบมาจากไฟล์ในโฟลเดอร์เดียวกัน (ดู README.md ของโฟลเดอร์นี้)
  const expand = v => Array.isArray(v) ? v.map(expand)
    : v && typeof v === "object" ? (v.$repeat ? v.$repeat.text.repeat(v.$repeat.times) : Object.fromEntries(Object.entries(v).map(([k, x]) => [k, expand(x)])))
    : v;
  const fixture = name => expand(JSON.parse(fs.readFileSync(path.join(__dirname, name), "utf8")));
  const { entities } = fixture("legal-entities.json");
  const { people, adminCreatedUser } = fixture("users.json");
  const docs = fixture("documents.json");
  const seed = new Warehouse(wpath);
  const admin = seed.loginDevelopment({}).subjectId;
  for (const e of entities) seed.registerLegalEntity(e, admin);
  for (const p of people) {
    seed.createIdentity({ subjectId: p.subjectId, displayName: p.displayName }, admin);
    seed.grantLegalEntityAccess(p.subjectId, p.legalEntity, admin);
  }
  seed.close();

  const server = spawn(process.execPath, [path.join(ROOT, "server.js")], {
    cwd: ROOT, stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, PORT: "0", WAREHOUSE_PATH: wpath, FILE_VAULT_PATH: path.join(tmp, "files"), DMS_DEV_AUTH: "true" },
  });
  const port = await new Promise((resolve, reject) => {
    let out = ""; const timer = setTimeout(() => reject(new Error(`server timeout: ${out}`)), 30000);
    server.stdout.on("data", c => { out += c; const m = /listening on :(\d+)/.exec(out); if (m) { clearTimeout(timer); resolve(Number(m[1])); } });
    server.stderr.on("data", c => { out += c; });
  });
  const base = `http://127.0.0.1:${port}`;
  const call = async (method, url, { token, body, headers = {}, raw = false } = {}) => {
    const res = await fetch(base + url, { method, headers: { ...(body !== undefined ? { "content-type": "application/json" } : {}),
      ...(token ? { authorization: `Bearer ${token}` } : {}), ...headers }, ...(body !== undefined ? { body: JSON.stringify(body) } : {}) });
    if (raw) return res;
    const text = await res.text(); let json = null; try { json = JSON.parse(text); } catch {}
    return { status: res.status, json, text, headers: res.headers };
  };
  const login = async subjectId => (await call("POST", "/api/dms/login/development", { body: subjectId ? { subjectId } : {} })).json;
  try {
    // --- ความปลอดภัยพื้นฐาน
    let r = await call("GET", "/api/dms/documents");
    check("TC-SEC-001", "เรียก DMS โดยไม่มีโทเคน ต้องถูกปฏิเสธ", r.status === 401 || r.status === 403, `${r.status} ${r.text.slice(0, 80)}`);
    r = await call("GET", "/", { raw: true });
    const csp = r.headers.get("content-security-policy") || "";
    check("TC-SEC-002", "หน้าแรกส่ง CSP script-src 'self' และ X-Frame-Options DENY", /script-src 'self'/.test(csp) && r.headers.get("x-frame-options") === "DENY", csp);
    r = await call("GET", "/..%2f..%2fpackage.json", { raw: true });
    check("TC-SEC-003", "พยายามอ่านไฟล์นอก public/ ด้วย ../ ต้องไม่สำเร็จ", r.status !== 200 || !(await r.text()).includes('"engines"'), r.status);

    const a = await login(), alpha = await login(people[0].subjectId), beta = await login(people[1].subjectId);
    check("TC-AUTH-001", "เข้าสู่ระบบแบบพัฒนา (เฉพาะทดสอบ) ได้โทเคน", Boolean(a?.token && alpha?.token && beta?.token), JSON.stringify(a).slice(0, 80));
    r = await call("GET", "/api/dms/me", { token: alpha.token });
    check("TC-AUTH-002", "GET /api/dms/me ตอบตัวตนของผู้เข้าสู่ระบบ", r.status === 200 && r.json?.subjectId === "did:test:alpha-staff", `${r.status} ${r.text.slice(0, 80)}`);
    r = await call("GET", "/api/dms/capabilities", { token: alpha.token });
    check("TC-DMS-000", "GET /api/dms/capabilities ตอบ 200", r.status === 200, r.status);

    // --- สร้างเอกสาร + idempotency
    const doc = docs.base;
    r = await call("POST", "/api/dms/documents", { token: alpha.token, body: doc });
    check("TC-DMS-001", "สร้างเอกสารโดยไม่มี Idempotency-Key ต้องถูกปฏิเสธ", r.status >= 400 && /IDEMPOTENCY_KEY_REQUIRED/.test(r.text), `${r.status} ${r.text.slice(0, 100)}`);
    r = await call("POST", "/api/dms/documents", { token: alpha.token, body: doc, headers: { "Idempotency-Key": "smoke-key-1" } });
    const docId = r.json?.documentId || r.json?.id || r.json?.document?.id;
    check("TC-DMS-002", "สร้างเอกสารพร้อม Idempotency-Key ได้ 201 และได้ id", r.status === 201 && Boolean(docId), `${r.status} ${r.text.slice(0, 160)}`);
    const first = r.json;
    r = await call("POST", "/api/dms/documents", { token: alpha.token, body: doc, headers: { "Idempotency-Key": "smoke-key-1" } });
    const replayId = r.json?.documentId || r.json?.id || r.json?.document?.id;
    // KI-01: เส้นทางสร้างเอกสารบังคับให้มีหัว Idempotency-Key แต่ไม่ได้ส่งคีย์ต่อให้ createManagedDocument จึงสร้างเอกสารใหม่ทุกครั้ง
    check("TC-DMS-003", "KI-01 ส่งคำขอสร้างซ้ำด้วยคีย์เดิม → ปัจจุบันได้เอกสารใหม่ (id ต่าง) ตามสัญญาควรเป็นเอกสารเดิม", replayId !== docId, `${r.status} replayId=${replayId} docId=${docId}`, true);

    // --- อ่านและสิทธิ์
    r = await call("GET", `/api/dms/documents/${docId}`, { token: alpha.token });
    check("TC-DMS-004", "เจ้าของอ่านเอกสารของตนได้", r.status === 200, `${r.status} ${r.text.slice(0, 100)}`);
    r = await call("GET", `/api/dms/documents/${docId}`, { token: beta.token });
    check("TC-ACC-001", "ผู้ใช้ต่างนิติบุคคลอ่านเอกสารไม่ได้", r.status === 403 || r.status === 404, `${r.status} ${r.text.slice(0, 100)}`);
    r = await call("GET", "/api/dms/documents", { token: beta.token });
    check("TC-ACC-002", "รายการเอกสารของผู้ใช้ต่างนิติบุคคลไม่มีเอกสารนี้", r.status === 200 && !JSON.stringify(r.json).includes(docId), `${r.status} ${r.text.slice(0, 100)}`);
    r = await call("GET", "/api/dms/documents?limit=25", { token: alpha.token });
    check("TC-DMS-005", "รายการเอกสารของเจ้าของมีเอกสารนี้ (policyFiltered)", r.status === 200 && JSON.stringify(r.json).includes(docId) && r.json?.policyFiltered === true, `${r.status} ${r.text.slice(0, 100)}`);

    // --- เวอร์ชัน + optimistic concurrency
    const v2 = { expectedVersion: 1, changeReason: "แก้คำอธิบาย", payload: { ...doc.payload, id: docId, type: "GeneralDocument", title: doc.title, documentNumber: doc.documentNumber, description: "แก้ไขครั้งที่ 1" } };
    r = await call("POST", `/api/dms/documents/${docId}/versions`, { token: alpha.token, body: v2, headers: { "Idempotency-Key": "smoke-v2" } });
    const verId = r.json?.versionId;
    check("TC-VER-001", "บันทึกเวอร์ชัน 2 ด้วย expectedVersion=1 สำเร็จ (201, versionNo 2)", r.status === 201 && r.json?.versionNo === 2, `${r.status} ${r.text.slice(0, 140)}`);
    r = await call("POST", `/api/dms/documents/${docId}/versions`, { token: alpha.token,
      body: { ...v2, changeReason: "ชนกัน", payload: { ...v2.payload, description: "อีกคนแก้พร้อมกัน" } }, headers: { "Idempotency-Key": "smoke-v2-conflict" } });
    check("TC-VER-002", "เนื้อหาต่างแต่ expectedVersion เดิม (1) ต้องถูกปฏิเสธเพราะเวอร์ชันชน", r.status >= 400, `${r.status} ${r.text.slice(0, 160)}`);
    r = await call("POST", `/api/dms/documents/${docId}/versions`, { token: alpha.token, body: v2, headers: { "Idempotency-Key": "smoke-v2" } });
    check("TC-VER-003", "ส่งคำขอเวอร์ชัน 2 เดิมซ้ำด้วยคีย์เดิม ไม่สร้างเวอร์ชันใหม่ (200 idempotent)", r.status === 200 && r.json?.versionId === verId, `${r.status} ${r.text.slice(0, 140)}`);
    r = await call("POST", `/api/dms/documents/${docId}/versions`, { token: beta.token, body: { ...v2, expectedVersion: 2 }, headers: { "Idempotency-Key": "smoke-v3-x" } });
    check("TC-ACC-003", "ผู้ใช้ต่างนิติบุคคลสร้างเวอร์ชันไม่ได้", r.status === 403 || r.status === 404, `${r.status} ${r.text.slice(0, 100)}`);

    // --- ไฟล์แนบ
    const bytes = Buffer.from("%PDF-1.4\n% synthetic test file\n", "utf8");
    r = await call("POST", `/api/dms/documents/${docId}/attachments`, { token: alpha.token, body: { versionId: verId, filename: "ตัวอย่าง.pdf", mediaType: "application/pdf", contentBase64: bytes.toString("base64") } });
    const attId = r.json?.attachmentId || r.json?.id || r.json?.item?.id || r.json?.attachment?.id;
    check("TC-ATT-001", "แนบไฟล์ PDF สังเคราะห์ได้ 201", r.status === 201, `${r.status} ${r.text.slice(0, 160)}`);
    r = await call("GET", `/api/dms/documents/${docId}/attachments`, { token: alpha.token });
    const listedId = r.json?.items?.[0]?.id || r.json?.items?.[0]?.attachmentId || attId;
    check("TC-ATT-002", "รายการไฟล์แนบมี 1 รายการ", r.status === 200 && r.json?.items?.length === 1, `${r.status} ${r.text.slice(0, 160)}`);
    if (listedId) {
      const res = await call("GET", `/api/dms/attachments/${listedId}/content`, { token: alpha.token, raw: true });
      const got = Buffer.from(await res.arrayBuffer());
      check("TC-ATT-003", "ดาวน์โหลดไฟล์แนบได้ไบต์ตรงกับที่อัปโหลด + nosniff", res.status === 200 && got.equals(bytes) && res.headers.get("x-content-type-options") === "nosniff", `${res.status} ${got.length}B`);
      const res2 = await call("GET", `/api/dms/attachments/${listedId}/content`, { token: beta.token, raw: true });
      check("TC-ACC-004", "ผู้ใช้ต่างนิติบุคคลดาวน์โหลดไฟล์แนบไม่ได้", res2.status === 403 || res2.status === 404, res2.status);
    }

    // --- ตรวจเวอร์ชัน / ถือครองทางกฎหมาย
    r = await call("POST", `/api/dms/documents/${docId}/validate`, { token: alpha.token, body: { version: 2 } });
    check("TC-DMS-006", "ตรวจเวอร์ชันของเอกสาร (validate) ตอบ 200", r.status === 200, `${r.status} ${r.text.slice(0, 140)}`);
    r = await call("GET", "/api/dms/work-queue", { token: alpha.token });
    check("TC-WFQ-001", "กล่องงาน (work-queue) ตอบ 200", r.status === 200, `${r.status} ${r.text.slice(0, 100)}`);
    r = await call("GET", "/api/dms/search?q=TST-0001", { token: alpha.token });
    check("TC-SRCH-001", "ค้นหา TST-0001 ตอบ 200", r.status === 200, `${r.status} ${r.text.slice(0, 100)}`);

    // --- KI-02: เอกสารที่ไม่ผูกนิติบุคคลไม่ปรากฏในรายการของพนักงาน (แต่เปิดด้วย id ได้)
    r = await call("POST", "/api/dms/documents", { token: alpha.token, body: { type: "GeneralDocument", title: "ไม่ผูกนิติบุคคล", payload: { description: "x" } }, headers: { "Idempotency-Key": "smoke-noentity" } });
    const noEntityId = r.json?.document?.id;
    const list = await call("GET", "/api/dms/documents?limit=100", { token: alpha.token });
    const open = await call("GET", `/api/dms/documents/${noEntityId}`, { token: alpha.token });
    check("TC-DMS-007", "KI-02 เอกสารที่สร้างโดยไม่ระบุ legalEntityId: เปิดด้วย id ได้ แต่ไม่อยู่ในรายการของพนักงานนิติบุคคล", open.status === 200 && !JSON.stringify(list.json).includes(noEntityId), `open=${open.status} listed=${JSON.stringify(list.json).includes(noEntityId)}`, true);
    const adminList = await call("GET", "/api/dms/documents?limit=100", { token: a.token });
    check("TC-DMS-008", "ผู้ดูแลระบบ (dev admin) เห็นเอกสารที่ไม่ผูกนิติบุคคลในรายการ", adminList.status === 200 && JSON.stringify(adminList.json).includes(noEntityId), `${adminList.status}`);

    // --- ถือครองทางกฎหมาย / งานของผู้ดูแล
    r = await call("POST", `/api/dms/documents/${docId}/legal-holds`, { token: alpha.token, body: { reason: "ทดสอบการระงับการลบ (ข้อมูลสังเคราะห์)" } });
    check("TC-LGL-001", "วางการระงับทางกฎหมาย (legal hold) ตอบ 201", r.status === 201, `${r.status} ${r.text.slice(0, 140)}`);
    r = await call("POST", `/api/dms/documents/${docId}/search-rebuild`, { token: alpha.token });
    check("TC-ADM-001", "พนักงานทั่วไปสั่งสร้างดัชนีค้นหาใหม่ไม่ได้ (ต้องเป็นผู้ดูแลระบบ)", r.status === 403 || /ACCESS_DENIED/.test(r.text), `${r.status} ${r.text.slice(0, 100)}`);
    r = await call("POST", `/api/dms/documents/${docId}/search-rebuild`, { token: a.token });
    check("TC-ADM-002", "ผู้ดูแลระบบสั่งสร้างดัชนีค้นหาใหม่ได้ (200)", r.status === 200, `${r.status} ${r.text.slice(0, 140)}`);

    // --- บัญชีรหัสผ่านในเครื่อง
    r = await call("POST", "/api/business/admin/users", { token: a.token, body: { subjectId: adminCreatedUser.subjectId, displayName: adminCreatedUser.displayName, legalEntityIds: adminCreatedUser.legalEntityIds, password: adminCreatedUser.initialPassword } });
    check("TC-AUTH-004", "ผู้ดูแลสร้างผู้ใช้พร้อมรหัสผ่านเริ่มต้น (201/200)", r.status === 200 || r.status === 201, `${r.status} ${r.text.slice(0, 140)}`);
    r = await call("POST", "/api/dms/login/password", { body: { subjectId: adminCreatedUser.subjectId, password: adminCreatedUser.wrongPassword } });
    check("TC-AUTH-005", "เข้าสู่ระบบด้วยรหัสผ่านผิดต้องถูกปฏิเสธ ด้วยรหัสข้อผิดพลาด LOCAL_CREDENTIALS_INVALID (ปัจจุบันตอบ HTTP 422)", r.status >= 400 && /LOCAL_CREDENTIALS_INVALID/.test(r.text), `${r.status} ${r.text.slice(0, 100)}`);
    r = await call("POST", "/api/dms/login/password", { body: { subjectId: adminCreatedUser.subjectId, password: adminCreatedUser.initialPassword } });
    check("TC-AUTH-006", "เข้าสู่ระบบด้วยรหัสเริ่มต้นสำเร็จและระบบบังคับให้เปลี่ยนรหัส (mustChangePassword=true)", r.status === 200 && r.json?.mustChangePassword === true, `${r.status} ${r.text.slice(0, 140)}`);
    const pwTok = r.json?.token;
    r = await call("POST", "/api/dms/password/change", { token: pwTok, body: { currentPassword: adminCreatedUser.initialPassword, newPassword: adminCreatedUser.newPassword } });
    check("TC-AUTH-007", "เปลี่ยนรหัสผ่านเริ่มต้นสำเร็จ", r.status === 200 || r.status === 204, `${r.status} ${r.text.slice(0, 140)}`);
    r = await call("POST", "/api/dms/login/password", { body: { subjectId: adminCreatedUser.subjectId, password: adminCreatedUser.newPassword } });
    check("TC-AUTH-008", "เข้าสู่ระบบด้วยรหัสใหม่สำเร็จและไม่ถูกบังคับเปลี่ยนอีก", r.status === 200 && r.json?.mustChangePassword === false, `${r.status} ${r.text.slice(0, 140)}`);

    // --- ข้อมูลทดสอบแบบกำหนดจากไฟล์ (documents.json): ค่าปกติ ค่าขอบ และค่าที่ต้องถูกปฏิเสธ
    for (const [i, v] of docs.valid.entries()) {
      r = await call("POST", "/api/dms/documents", { token: alpha.token, body: v.body, headers: { "Idempotency-Key": `smoke-valid-${i}` } });
      const vid = r.json?.document?.id;
      const back = vid ? await call("GET", `/api/dms/documents/${vid}`, { token: alpha.token }) : null;
      const roundTrip = back && back.status === 200 && JSON.stringify(back.json).includes(JSON.stringify(v.body.title).slice(1, -1).slice(0, 40));
      check(`TC-DAT-00${i + 1}`, `ข้อมูลที่ถูกต้อง: ${v.name} สร้างได้ (201) และอ่านกลับได้ตรงเดิม`, r.status === 201 && Boolean(roundTrip), `${r.status} ${r.text.slice(0, 120)}`);
    }
    for (const [i, n] of docs.negative.entries()) {
      r = await call("POST", "/api/dms/documents", { token: alpha.token, body: n.body, headers: { "Idempotency-Key": `smoke-neg-${i}` } });
      check(`TC-NEG-00${i + 1}`, `ข้อมูลที่ต้องถูกปฏิเสธ: ${n.name}`, r.status >= 400, `${r.status} ${r.text.slice(0, 120)}`);
    }

    // --- ออกจากระบบ
    r = await call("POST", "/api/dms/logout", { token: alpha.token });
    const after = await call("GET", "/api/dms/me", { token: alpha.token });
    check("TC-AUTH-003", "หลังออกจากระบบ โทเคนเดิมใช้ไม่ได้", r.status < 400 && after.status >= 400, `${r.status}/${after.status}`);
  } catch (error) {
    check("RUN", "สคริปต์ทดสอบทำงานจนจบ", false, error.stack || error.message);
  } finally {
    server.kill();
    await new Promise(resolve => { server.once("exit", resolve); setTimeout(resolve, 5000); });
    fs.rmSync(tmp, { recursive: true, force: true, maxRetries: 20, retryDelay: 100 });
  }
  const failed = results.filter(x => !x.ok).length;
  const known = results.filter(x => x.known && x.ok).length;
  process.stdout.write(`\nรวม ${results.length} ข้อ ผ่าน ${results.length - failed - known} ไม่ผ่าน ${failed} ข้อสังเกตที่ทราบ(KI) ${known}\n`);
  process.exit(failed ? 1 : 0);
})();
