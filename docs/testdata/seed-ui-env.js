#!/usr/bin/env node
"use strict";

// เตรียมสภาพแวดล้อมสำหรับทดสอบหน้าจอในเบราว์เซอร์ (SPD-TST-002 ภาคผนวก D) ด้วยข้อมูลสังเคราะห์
//
// ต่างจาก smoke-dms.js ตรงที่ **เซิร์ฟเวอร์ที่เปิดไม่มี DMS_DEV_AUTH** จึงต้องเข้าสู่ระบบด้วยรหัสผ่านจริง
// ผ่านหน้าจอเหมือนผู้ใช้จริง (DMS_DEV_AUTH ถูกตั้งเฉพาะในโปรเซสที่ใส่ข้อมูลเริ่มต้นเท่านั้น แล้วเซิร์ฟเวอร์
// ที่เปิดเป็นโปรเซสลูกที่ไม่ได้รับค่านี้)
//
// ใช้:  node seed-ui-env.js <โฟลเดอร์ onemanos-setbox> [พอร์ต=8080]
// หยุดและล้างข้อมูลชั่วคราว: กด Ctrl+C
//
// ผู้ใช้ที่ได้ (รหัสผ่านพิมพ์ออกหน้าจอ ไม่ได้อยู่ในไฟล์):
//   admin-user     ผู้ดูแลระบบ        รหัสผ่านปกติ
//   alpha-staff    พนักงาน co-alpha   รหัสผ่าน "เริ่มต้น" (ต้องถูกบังคับให้เปลี่ยนตอนเข้าครั้งแรก)
//   beta-staff     พนักงาน co-beta    รหัสผ่านปกติ
// เอกสารเริ่มต้น 2 ฉบับของ co-alpha: ฉบับที่ผูกนิติบุคคล และฉบับที่ไม่ผูก (ใช้ยืนยัน KI-02 ในเบราว์เซอร์)

const { spawn } = require("node:child_process");
const crypto = require("node:crypto");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const ROOT = path.resolve(process.argv[2] || ".");
const PORT = String(process.argv[3] || "8080");
process.env.DMS_DEV_AUTH = "true"; // เฉพาะโปรเซสนี้ ใช้ใส่ข้อมูลเริ่มต้น

const fixture = name => JSON.parse(fs.readFileSync(path.join(__dirname, name), "utf8"));
const pw = () => `ทดสอบ-${crypto.randomBytes(6).toString("hex")}-ok`; // ยาวกว่า 12 ตัวอักษรเสมอ

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "setbox-ui-"));
const { Warehouse } = require(path.join(ROOT, "warehouse"));
const wpath = path.join(tmp, "w.db");
const w = new Warehouse(wpath);
const admin = w.loginDevelopment({}).subjectId;
for (const e of fixture("legal-entities.json").entities) w.registerLegalEntity(e, admin);
const { people } = fixture("users.json");
const accounts = [
  { subjectId: admin, name: "admin-user", role: "ผู้ดูแลระบบ", password: pw(), mustChange: false },
  { subjectId: people[0].subjectId, name: "alpha-staff", role: "พนักงาน co-alpha (รหัสเริ่มต้น)", password: pw(), mustChange: true },
  { subjectId: people[1].subjectId, name: "beta-staff", role: "พนักงาน co-beta", password: pw(), mustChange: false },
];
for (const p of people) {
  w.createIdentity({ subjectId: p.subjectId, displayName: p.displayName }, admin);
  w.grantLegalEntityAccess(p.subjectId, p.legalEntity, admin);
}
for (const a of accounts) w.setLocalPassword(a.subjectId, a.password, admin, { mustChange: a.mustChange });
w.createManagedDocument({ type: "GeneralDocument", title: "เอกสารเริ่มต้น (ผูก co-alpha)", documentNumber: "SEED-001",
  payload: { description: "ผูกนิติบุคคลแล้ว", legalEntityId: "co-alpha" } }, people[0].subjectId);
w.createManagedDocument({ type: "GeneralDocument", title: "เอกสารเริ่มต้น (ไม่ผูกนิติบุคคล)", documentNumber: "SEED-002",
  payload: { description: "ไม่ระบุ legalEntityId" } }, people[0].subjectId);
w.close();

const env = { ...process.env, PORT, WAREHOUSE_PATH: wpath, FILE_VAULT_PATH: path.join(tmp, "files") };
delete env.DMS_DEV_AUTH; // เซิร์ฟเวอร์ที่ทดสอบต้องไม่มีการเข้าสู่ระบบแบบพัฒนา
const server = spawn(process.execPath, [path.join(ROOT, "server.js")], { cwd: ROOT, env, stdio: ["ignore", "pipe", "pipe"] });
let started = false;
server.stdout.on("data", chunk => {
  const m = /listening on :(\d+)/.exec(String(chunk));
  if (m && !started) {
    started = true;
    const lines = [`\nเซิร์ฟเวอร์ทดสอบพร้อมที่ http://127.0.0.1:${m[1]}/  (ไม่มี DMS_DEV_AUTH)\n`, "ผู้ใช้สำหรับเข้าสู่ระบบ (หน้า \"ระบบบริหารเอกสาร\"):"];
    for (const a of accounts) lines.push(`  ${a.name.padEnd(12)} รหัสผู้ใช้ (Subject ID): ${a.subjectId}\n               รหัสผ่าน: ${a.password}   [${a.role}]`);
    lines.push("\nกด Ctrl+C เพื่อหยุดและล้างข้อมูลชั่วคราว\n");
    process.stdout.write(lines.join("\n"));
  }
});
server.stderr.on("data", chunk => process.stderr.write(chunk));
const cleanup = () => {
  server.kill();
  setTimeout(() => { fs.rmSync(tmp, { recursive: true, force: true, maxRetries: 20, retryDelay: 100 }); process.exit(0); }, 500);
};
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
