# ผลเทียบโค้ดกับสถาปัตยกรรม SetBox: gap และแผนปิด

**รหัสเอกสาร:** SPD-ARC-002 · **สถานะ:** ร่างเพื่อทบทวน v0.3 (ข้อ 7 ผลการดำเนินการ + ข้อ 8 ส่งต่อ Codex + แก้ข้อความเรื่อง C1/C2) · **วันที่:** 2026-10-03
**เทียบกับ:** SPD-ARC-001 (แผนภาพสถาปัตยกรรม SetBox 11 ภาพ), SPD-CUR-001 (สถานะปัจจุบัน), ADR 0014/0015/0017/0020/0021/0022/0023/0026
**ผู้ตรวจ:** Claude (อ่านโค้ดจริงและรันชุดทดสอบ ไม่ใช่ผู้ตรวจอิสระ ยังไม่มีมนุษย์ทวนผล)

## 0. ขอบเขตและวิธีตรวจ (อ่านก่อน)

| รายการ | ค่า |
|---|---|
| repo ที่ตรวจ | `onemanos-setbox` @ `20471f6`, `spada-monorepo` @ `206d1f9`, `onemanos` @ `321490e` (shallow clone ของ branch หลักตามที่ session นี้เข้าถึง) |
| สิ่งที่ทำ | อ่านซอร์สส่วนที่ภาพแต่ละภาพอ้างถึง · นับเส้นทาง/เครื่องมือด้วย grep · รันชุดทดสอบของทั้งสามโปรเจกต์ · เทียบกับ ADR/มาตรฐานในเอกสาร |
| สิ่งที่ **ไม่ได้** ทำ | ไม่ได้ติดตั้งบนเครื่องจริง/VM สะอาด · ไม่ได้ทดสอบกับ TPM จริง · ไม่ได้ทดสอบเจาะระบบ · ไม่ได้อ่านซอร์สทุกบรรทัด (มี `business-api.js` 924 บรรทัด, `server.js` 868, `onevault-mcp/src/tools.js` 1,085 ฯลฯ อ่านเฉพาะส่วนที่เกี่ยวกับข้ออ้าง) · ไม่ได้ตรวจ branch อื่นหรือ working tree ที่ยังไม่ commit ของผู้พัฒนา |
| ข้อจำกัดสำคัญ | ผลตรวจ 2026-09-06 (CONDITIONAL) ชี้ P1 สี่ข้อใน **เครื่องมือเตรียมเครื่องภาษา C#** (`tools/pc12-prep-assistant`) **ไม่พบซอร์ส C# ในทั้งสาม repo** จึงยืนยันสถานะการแก้ไม่ได้ |

**สัญลักษณ์:** ✔ ยืนยันจากโค้ด · ⚠ มีแต่ต่างจากที่ภาพ/เอกสารระบุ · ✖ ไม่พบในโค้ด · ? ตรวจไม่ได้ในรอบนี้

## 1. ผลชุดทดสอบ (รันจริงในรอบนี้)

| โปรเจกต์ | คำสั่ง | ผล | ข้อที่ไม่ผ่าน |
|---|---|---|---|
| `onemanos-setbox` | `node --require ./test-setup.js --test "*.test.js"` (Node 22.22) | **847 ทดสอบ ผ่าน 845 ไม่ผ่าน 2** (~57 วินาที) | #428 `mac5-column-names.test.js` "ไม่พบ artifacts/*/columns.csv — เทสต์นี้ตรวจอะไรไม่ได้เลย" (ข้อมูลทดสอบไม่ได้อยู่ใน repo ไม่ใช่บั๊กของโค้ด แต่เทสต์ควร skip หรือมี fixture) · #686 `purchase-engine.test.js` "สายเอกสารวงจรซื้อตามรอยได้ครบ" ล้มด้วย `UNIQUE constraint failed: document_participants...` (อาจเป็นบั๊กจริงหรือข้อมูลชนกัน ยังไม่ได้หาสาเหตุ) |
| `spada-monorepo` | `npm install && npm run build` แล้ว `node --test "tests/**/*.test.ts"` | **487 ทดสอบ ผ่าน 482 ไม่ผ่าน 4 ข้าม 1** | 4 ข้อของ MyAI P1 (โควตารายเดือน: คาดว่าได้ 429 แต่ได้ 200) ยังไม่ได้หาสาเหตุ · หมายเหตุ: รันครั้งแรกโดยไม่ build ล้ม 85 ข้อเพราะไม่มี `dist/` ซึ่งเป็นข้อกำหนดของการรัน ไม่ใช่บั๊ก |
| `onemanos` | `npm test` | **195 ทดสอบ ผ่าน 194 ไม่ผ่าน 1** | "local machine probe minimizes physical host and network identifiers" (ผลอาจขึ้นกับสภาพแวดล้อมคอนเทนเนอร์ ยังไม่ได้ตรวจ) |

ผลนี้บอกว่า **โค้ดส่วนใหญ่มีเทสต์และผ่าน** แต่ไม่ได้พิสูจน์ว่าเทสต์ครอบคลุมข้ออ้างทุกข้อ และไม่ใช่การรับรองการใช้งานจริง

## 2. เทียบทีละภาพของ SPD-ARC-001

| ภาพ | ข้ออ้างในภาพ | ผลตรวจโค้ด | หลักฐาน |
|---|---|---|---|
| 1 บริบท | SetBox ทำงานโดดเดี่ยวได้ ไม่ต้องต่อ SPADA | ✔ | ไม่มี dependency ภายนอกใน `package.json`; `Dockerfile.new` / `server.js` ไม่เรียก SPADA; ผูก SPADA ผ่าน OIDC ทั่วไปเท่านั้น (ดู ภาพ 4) |
| 1 | เชื่อม OIDC / สัญญา C1 C2 กับ SPADA เมื่อเชื่อมต่อ | ✖ ฝั่ง SetBox | ดูข้อ G2 |
| 2 | `business-api.js` 171 เส้นทาง | ✔ | `route(` ถูกเรียก 171 ครั้ง (จาก `grep` ใน `business-api.js`) |
| 2 | `onevault-mcp` เครื่องมือ 25 ตัว | ⚠ **31 ตัว** | `onevault-mcp/src/tools.js` นิยาม 31 ชื่อ รวมกลุ่ม `onevault_app_*` 9 ตัว (เพิ่มภายหลังตัวเลข 25) |
| 2 | Human Gate ปฏิเสธชื่อบัญชี agent | ✔ (มีข้อจำกัดที่โค้ดระบุเอง) | `human-gate.js`: ปฏิเสธคำนำหน้า `agent:`/`service:`/`bot:`/`mcp:`/`session:`/`token:`, ชื่อบทบาทโทเคน, ชื่อตรงกับ actor ของ session, identity ชนิด SERVICE, ข้อความไร้ตัวอักษร · คอมเมนต์ในไฟล์ระบุว่า "พิสูจน์ไม่ได้ว่าคนนั้นอยู่ตรงนั้นและกดเอง" |
| 2 | App Catalog Registry + CIDER | ✔ | `app-catalog.js` (729 บรรทัด): `STAGES`, `STAGE_TRANSITIONS`, `VERSION_STATES`; บังคับ `integration.directStorageAccess === false` (บรรทัด 273); มีเทสต์ `app-catalog.test.js` · เครื่องมือ MCP `onevault_app_register/submit_version/approve_version/begin_evaluation/return_to_develop/activate_version/bind_service/retire` ✔ ตรงกับภาพ 8 |
| 2, 8 | บัญชี SERVICE ของแอปที่ไม่อยู่ทะเบียน/ไม่ live ถูกปฏิเสธ | ✔ | `app-catalog.js:596–610` (`APP_NOT_REGISTERED`, `APP_NOT_LIVE` พร้อมบันทึก `APP_ACCESS_DENIED`); `server.js` แปลงเป็น HTTP 403 |
| 2 | โมดูลภาษีไทย (vat-return, salary-withholding, allowance-declaration) | ✔ มีไฟล์และเทสต์ | `vat-return.js`, `salary-withholding.js`, `allowance-declaration.js` + `*.test.js` (ความถูกต้องทางกฎหมายภาษี **ไม่ได้ตรวจ**) |
| 2, 10 | `onemanos-care.js` สำรอง + ซ้อมกู้คืนอัตโนมัติ | ✔ | `setup/onemanos-care.js`: `commandVerifyRestore` กู้คืนลงไฟล์ชั่วคราวและตรวจ, เทียบลายนิ้วมือสำเนา, `raiseAlert("restore", …)`, `commandSchedule` |
| 10 | ตรวจก่อนส่งมอบ H1–H7 | ✔ | `setup/onemanos-handover.js`: H1 โปรเจกต์/นิติบุคคลเป็นของลูกค้า · H2 ไม่มีข้อมูลรายอื่นในคลัง · H3 ไม่มีร่องรอยรายอื่นในชุดไฟล์ · H4 ไม่มีโทเคนเครื่องอื่นที่ยังใช้ได้ · H5 ไม่มีบัญชีทางลัดและมีผู้ดูแลของลูกค้า · H6 สำรองมีจริงและเคยกู้คืนได้ · H7 บันทึกครบและกุญแจอยู่ที่เครื่องนี้ |
| 3 | พอร์ต 4105/4106/4107, VLAN | ? | ไม่พบพอร์ตเหล่านี้ในโค้ด (server ใช้ `PORT` ค่าเริ่มต้น 8080, MCP HTTP มี listener แยก) พอร์ตเหล่านี้อยู่ในเอกสาร doc 342 ซึ่งไม่ได้ตรวจ |
| 3 | PC2/PCn ผ่าน bridge | ✔ | `onevault-mcp/src/bridge.js` (MCP stdio → PC1 ผ่านโทเคน, ไม่มีกุญแจ/คลังของตัวเอง) |
| 4 | Track C: ผูก DID ภายหลังผ่าน OIDC (SubjectBinding, C1) | ✖ ฝั่ง SetBox | ไม่พบ `SubjectBinding`; `oidc-login.js` เป็น OIDC ทั่วไป (Entra/Google/Keycloak/Okta) ไม่ได้ชี้ `id.spada.network`; SetBox สร้าง `did:spada:person:*` เอง (ขัด C1) |
| 4 | ฝั่ง SPADA: ProvisioningClaim TrustScore ≥ 500 | ✔ (ในโมโนรีโป) | `services/identity-service/src/service-device-manager.ts: issueProvisioningClaim` ปฏิเสธเมื่อไม่มี provider/ไม่ได้คะแนน/ต่ำกว่าเกณฑ์ + บันทึก audit ทุกกรณี |
| 5 | วัด EK certificate รับรองเครื่อง | ✖ | มีเพียง interface `ISPADADeviceAttestationVerifier` และ `SPADANullDeviceAttestationVerifier` (ปฏิเสธเสมอ = fail closed) ไม่พบตัวตรวจ EK/TPM จริงใน monorepo หรือ `onemanos` (ดู G1) |
| 5 | ห้ามเปิด `APPLIANCE` จนกว่า attestation จบ | ✔ | `tests/unit/identity-device-attestation-adr0017.test.ts` ยืนยันว่า client ตั้ง `APPLIANCE`/`hostAttestationRef` เองไม่ได้ · `oidc-provider-wo-k3` ปฏิเสธ `actorDeviceAssurance: "APPLIANCE"` ที่ไม่ผ่านด่าน |
| 6 | ทะเบียนฮาร์ดแวร์ append-only (doc 344) | ✖ | ไม่พบโค้ดทะเบียน (doc 344 ว่างตามเอกสาร) |
| 7 | MyAI/Agent → onevault-mcp → Human Gate → business-api → audit | ⚠ บางส่วน | ✔ ท่อ MCP และ Human Gate; ⚠ Tier A/B/C ไม่ใช่ตัวแปรในโค้ด SetBox (เป็นแนวคิดของ doc 263/Harness) ด่านจริงคือ Human Gate เฉพาะเครื่องมือที่ต้องมีชื่อผู้รับผิดชอบ (decommission, exceptions, app approve/activate) ไม่ใช่ทุกการเรียก |
| 7 | KeySign เสริมการอนุมัติ | ✖ | SetBox ไม่มีตัวตรวจ KeySign/PKT; มีเพียง `signature-provider.js` ที่เรียกสัญญา `spada.remote-sign.v1` ขณะที่ `onevault-integration.json` ประกาศ `trust.remote-sign.v1` (ชื่อไม่ตรงกัน) |
| 9 | App Manifest (Node/Setbox/Hybrid), APP_REVIEWED/INSTALLED, แบ่งรายได้ | ✖ (ตรงกับที่ระบุว่าเป็นข้อเสนอ) | ไม่พบ `dataScopes`, `artifactHash`, `trustGates`, `publisherDid`, `hostNodeId` ในโค้ดใด; `ISPADAServiceListing` ของ `service-registry-service` มีแค่ `serviceId`, `ownerDid`, `layer`, `apiEndpoint`, `status`, `version`, `price` |
| 11 | OIDC provider ของ SPADA | ⚠ **ดีกว่าเอกสาร** | `services/oidc-provider-service` มีซอร์ส ~1,040 บรรทัด พร้อมเทสต์ `oidc-provider-wo-k2` และ `wo-k3` (ผ่านในรอบนี้) ข้อความ "ยังไม่มี OIDC provider ในโค้ด" ใน SPD-CUR-001 ล้าสมัย |
| 11 | ผลตรวจ CONDITIONAL P1 ×4 (เครื่องมือเตรียมเครื่อง C#) | ? ไม่พบซอร์ส | ดู G3 |

## 3. Gap ที่พบ (เรียงตามความสำคัญ)

ระดับ: **สูง** = ขวางการส่งมอบ/การอ้างความปลอดภัย · **กลาง** = ต้องปิดก่อนขยาย · **ต่ำ** = ปรับปรุง

| # | Gap | ระดับ | หลักฐาน | ผลกระทบ |
|---|---|---|---|---|
| G1 | **ไม่มีตัวตรวจ attestation ฮาร์ดแวร์จริง** (EK certificate/TPM/PCR, ทะเบียนรุ่น) มีเพียง interface + Null verifier | สูง | `packages/auth/src/index.ts:106–122`; ไม่พบ x509/EK/TPM ใน identity-service และ `onemanos/src` | เปิด `APPLIANCE` ไม่ได้ (ถูกต้องตาม ADR 0017 ที่ fail-closed) แต่หมายความว่า "เครื่อง SetBox ที่ติดตั้งแล้วถูกรับรองโดย SPADA" ยังเกิดไม่ได้ในซอฟต์แวร์ |
| G2 | **SetBox ไม่ได้ผูกกับสัญญา SPADA**: ไม่มี SubjectBinding/ตัวตรวจ OIDC ของ SPADA · SetBox สร้าง `did:spada:*` เอง (ขัด C1/ADR 0022) · `content_hash` ใช้ `JSON.stringify` + SHA-256 ไม่ใช่ RFC 8785 JCS (ขัด C2/ADR 0021) · ไม่มีไคลเอนต์เรียก `provisionHost` | สูง (สำหรับ Track C) | `warehouse.js:337–339` (`JSON.stringify(record)`); `ownership-foundation.js:21`, `transform-engine.js:16` (`did:spada:person:pending-owner-resolution`); `scripts/*.js` ใช้ `did:spada:person:*`; monorepo มี `packages/core/src/canonical-json.ts` (C2) และเทสต์ conformance ครบแต่ SetBox ไม่ใช้ | Track S ไม่กระทบ แต่ Track C ทำไม่ได้: แฮชของ SetBox เทียบกับ BookChain ไม่ได้ ข้อมูลที่มี DID ปลอมๆ ต้อง migrate |
| G3 | **ผลตรวจ P1 ×4 ของเครื่องมือเตรียมเครื่อง C# ยืนยันไม่ได้**: ไม่พบซอร์ส `tools/pc12-prep-assistant` ใน repo ใดเลย (รายงานอ้างเส้นทาง `D:\codexspace\...`) | สูง | `OneManOS-SetBox-Readiness-Review-2026-09-06.md`; `find` ไม่พบ `*.cs` ทั้งสาม repo | ไม่รู้ว่า signature/manifest ยัง fail-open, export ไม่บังคับ preflight, PASS เกินหลักฐาน, network policy ปฏิเสธแล้วยังเชื่อมต่อ หรือไม่ ห้ามส่งมอบลูกค้าจริงจนกว่าจะยืนยัน |
| G4 | **Human Gate พิสูจน์ "มนุษย์อยู่ตรงนั้น" ไม่ได้** และ SetBox ไม่มีการผูก KeySign (ชื่อสัญญา `spada.remote-sign.v1` กับ `trust.remote-sign.v1` ไม่ตรง) | กลาง–สูง | `human-gate.js` ส่วน "สิ่งที่ไฟล์นี้ทำไม่ได้"; `signature-provider.js:190`; `onevault-integration.json:37` | การอนุมัติระดับ B/C ยังเป็นเพียงชื่อ ไม่ใช่การยืนยันตัวบุคคล (ขัดเจตนา PKT-R5/R7 ของ KeySign) |
| G5 | **ยังไม่มี App Manifest/ร้านแอป/แบ่งรายได้ในโค้ด** (ADR 0026 Proposed) และ CIDER ของ SetBox เป็นทะเบียนในเครื่อง ไม่เชื่อม service-registry ของ SPADA | กลาง | ไม่พบ `dataScopes/artifactHash/trustGates`; `service-service-registry-types.ts` | ทำตามบันได SPD-PLN-004 ขั้น 3–5 ไม่ได้จนกว่าจะตัดสิน ADR และสร้างสะพาน |
| G6 | **`Dockerfile` ค้างยุค migration workbench**: COPY ระบุชื่อ 16 ไฟล์ ไม่มี `business-api.js`, `http-guard.js`, `oidc-login.js` ที่ `server.js` เรียกใช้ → อิมเมจนี้เริ่มระบบไม่ได้ (`Dockerfile.new` แก้เป็น `COPY *.js` แล้ว) | กลาง | เทียบ `require("./…")` ของ `server.js` กับ COPY ใน `Dockerfile` | ใครใช้ Dockerfile เดิมจะได้ระบบที่ไม่ทำงาน |
| G7 | **ชุดทดสอบมี 7 ข้อที่ไม่ผ่าน** (SetBox 2, monorepo 4, onemanos 1) และ 1 ข้อเป็นเทสต์ที่ "ตรวจอะไรไม่ได้" แต่ถูกนับเป็นล้ม | กลาง | ข้อ 1 | CI ที่แดงลดความเชื่อมั่น; #686 อาจเป็นบั๊กข้อมูลชนกันจริง |
| G8 | **เอกสารล้าสมัย/ไม่ตรงโค้ด**: MCP 25→31 เครื่องมือ · "ไม่มี OIDC provider" · พอร์ต 4105–4107 ไม่อยู่ในโค้ด · Dockerfile ใน README | ต่ำ | ข้อ 2 | ภาพที่เสนอภายนอกอาจผิด |
| G9 | **ข้อมูลเฉพาะบุคคลฝังในสคริปต์**: `did:spada:person:chatchai-limrasertsiri` ใน `scripts/*.js` | ต่ำ–กลาง | `grep` ใน `scripts/` | ต้องล้างก่อนเปิดเผยสาธารณะ/ส่งมอบ (มีขั้นตอนในโครงการ PUBLICATION-READINESS แล้ว) |
| G10 | **ยังไม่เคยส่งมอบลูกค้านอกกิจการผู้พัฒนา** และยังไม่มีตัวเลขจริง/รอบดูแลจริง 1 ไตรมาส | สูง (เชิงพาณิชย์) | `ROADMAP.md` เส้นทาง ก ข้อสุดท้าย 3 ข้อยังไม่ติ๊ก | ขวางการขอขึ้นบัญชีนวัตกรรม (SPD-PLN-005 เกณฑ์ข้อ 5) |

**สิ่งที่ดีกว่าที่คาด:** ท่อ Human Gate + CIDER + ด่านแอปเรียกคลัง + สำรอง/กู้คืน + H1–H7 มีโค้ดและเทสต์จริงตรงกับภาพ · `ProvisioningClaim` fail-closed พร้อม audit · C2 มีตัวอ้างอิง JCS ใน monorepo พร้อมเทสต์ · OIDC provider ของ SPADA มีโค้ดและเทสต์ผ่าน

## 4. แผนปิด gap

หลักการ: แก้ตามลำดับที่ปลดล็อกการส่งมอบก่อน ไม่ใส่ตัวเลขเวลา เพราะยังไม่ทราบทรัพยากรของทีม (ช่อง [●] ให้ Lead/ทีมกรอก)

### ลำดับที่เสนอ

```
เฟส 0 (ทำได้ทันที ไม่ต้องรอการตัดสินใจ)  → WP1 WP2 WP3 WP4
เฟส 1 (ปลดล็อกส่งมอบลูกค้าแรก, Track S) → WP5 WP6
เฟส 2 (ปลดล็อก Track C เชื่อม SPADA)    → WP7 WP8 WP9
เฟส 3 (ต้องรอ Lead ตัดสิน)               → WP10 WP11 WP12
```

### เฟส 0: ทำความจริงให้ตรวจสอบได้

| WP | งาน | ปิด gap | เกณฑ์รับงาน | ผู้รับผิดชอบ |
|---|---|---|---|---|
| WP1 | แก้เอกสารให้ตรงโค้ด: อัปเดต SPD-ARC-001 (MCP 31 ตัว, OIDC provider มีโค้ด, พอร์ต) และ SPD-CUR-001 | G8 | ผู้ตรวจอีกคนทวนกับโค้ดแล้วเซ็น | [●] |
| WP2 | ทำให้ชุดทดสอบเขียวหรือเหตุผลชัด: (ก) `mac5-column-names` ให้ skip อย่างมีสถานะเมื่อไม่มีข้อมูล หรือเพิ่ม fixture สังเคราะห์ (ข) สืบหา `UNIQUE constraint failed` ใน `purchase-engine` ว่าบั๊กหรือเทสต์ผิด (ค) สืบ MyAI quota 4 ข้อ (ง) สืบ machine-probe 1 ข้อ | G7 | CI สามโปรเจกต์ผ่านบน Linux และ Windows (ตาม ROADMAP) ไม่มีข้อที่ถูก skip โดยไม่มีเหตุผลเขียนไว้ | [●] |
| WP3 | หาและนำซอร์ส `pc12-prep-assistant` (C#) เข้า repo ที่ควบคุมได้ หรือยืนยันว่าถูกแทนที่แล้ว | G3 | พบซอร์สและ commit ที่ตรงกับ release ที่ตรวจ หรือมีบันทึกเป็นลายลักษณ์อักษรว่าเลิกใช้ | [●] |
| WP4 | แทนที่ `Dockerfile` ด้วย `Dockerfile.new` และเพิ่มขั้น CI: `docker build` + รัน + ตรวจ `/health` (หรือจุดตรวจที่มี) | G6 | อิมเมจเริ่มได้และ endpoint ตอบ ใน CI ทุกครั้ง | [●] |

### เฟส 1: พร้อมส่งมอบลูกค้ารายแรก (Track S ไม่เชื่อม SPADA)

| WP | งาน | ปิด gap | เกณฑ์รับงาน |
|---|---|---|---|
| WP5 | แก้ P1 ×4 + P2 ของเครื่องมือเตรียมเครื่อง ตามข้อแก้และ "ทดสอบรับงาน" ที่รายงาน 2026-09-06 ระบุไว้ (signature/manifest fail-closed · export ผูก preflight · ประเมิน encryption/release จากสถานะจริง · network policy return ก่อนเชื่อมต่อ · path containment) | G3 | negative test ทุกข้อผ่าน · ทดสอบบน Windows สะอาด (ไม่มี runtime, standard user, offline, reboot, ติดตั้งซ้ำ, กู้จากความล้มเหลว) · เจ้าหน้าที่คนใหม่ติดตั้งจากคู่มือสำเร็จ และผู้ตรวจอีกคนตรวจ evidence |
| WP6 | ส่งมอบลูกค้ารายแรกนอกกิจการผู้พัฒนา พร้อมจับเวลาจริง ผ่านรอบดูแล 1 ไตรมาส แล้วตั้งตัวเลขเชิงพาณิชย์จากข้อมูลจริง | G10 | ลูกค้าลงนามรับมอบ + ผ่าน UAT + ผลซ้อมกู้คืนจริง + H1–H7 ผ่านทั้งเจ็ดข้อ + บันทึกเวลา |

### เฟส 2: เชื่อม SPADA (Track C)

| WP | งาน | ปิด gap | เกณฑ์รับงาน |
|---|---|---|---|
| WP7 | **สัญญา C1:** เปลี่ยนตัวตนในคลังเป็น `onevault:<kind>:<id>` และสร้างตัวผูก `SubjectBinding` จากผล OIDC ของ `id.spada.network` (ใช้ `oidc-login.js` + ตัวตรวจ ID token ที่มีอยู่) ย้ายข้อมูลเดิมที่มี `did:spada:*` โดยมีแผน migration ย้อนกลับได้ | G2 | ไม่มี `did:spada:*` ที่ SetBox สร้างเองในคลังใหม่ · เทสต์ผูกตัวตน (ผูกสำเร็จ/ปฏิเสธ binding ซ้ำ/ปฏิเสธ issuer ผิด) · migration มีทางกู้คืน |
| WP8 | **สัญญา C2:** ใช้ตัวอ้างอิง JCS (`packages/core/src/canonical-json.ts` หรือไฟล์ reference) แทน `JSON.stringify` ในการคำนวณ `content_hash` โดยติดป้ายเวอร์ชันของอัลกอริทึม เก็บแฮชเดิมไว้เทียบ | G2 | ผ่าน test vectors ของ C2 เดียวกับ monorepo · แฮชเดิมและใหม่อยู่ร่วมกันได้พร้อมป้ายเวอร์ชัน |
| WP9 | **ไคลเอนต์ provisioning:** ฝั่ง SetBox เรียก `issueProvisioningClaim → provisionHost` ผ่าน gateway (ขั้น 0 ต้องมีอินเทอร์เน็ต) พร้อมเก็บ evidence; ปฏิเสธเมื่อ TrustScore ต่ำกว่าเกณฑ์ | G2 | เทสต์ end-to-end ผ่านทั้งทางผ่านและทางปฏิเสธ (ไม่มี verifier จริงจะได้ `ATTESTATION_UNSUPPORTED` ซึ่งคือพฤติกรรมที่ถูกต้องจนกว่า WP10 เสร็จ) |

### เฟส 3: ต้องรอ Lead ตัดสิน

| WP | งาน | ปิด gap | ต้องตัดสินก่อน |
|---|---|---|---|
| WP10 | **ตัวตรวจ attestation จริง:** ตรวจสาย EK certificate กับ vendor-root allowlist, ตรวจ PCR policy, ปฏิเสธ vTPM, ทะเบียนรุ่นแบบ append-only (doc 344), ชุดเทสต์ที่มีหลักฐานจากเครื่องจริง | G1 | dTPM หรือ fTPM (ค้างหลายรอบ ต้องมีคำตอบผู้ขายเป็นลายลักษณ์อักษร) · รุ่นเครื่องที่รับรอง · ผู้ดูแลนโยบาย (Attestation Policy Steward) ตัวจริงและตัวสำรอง |
| WP11 | **KeySign กับ Human Gate:** นิยามสัญญาเดียว (ตกลงระหว่าง `spada.remote-sign.v1` กับ `trust.remote-sign.v1`), ตัวตรวจลายเซ็นผูกกับแฮชของคำขอ (PKT-R7), ให้ขั้น Tier B ใน production ต้องมี assertion จาก KeySign | G4 | ตัดสินชิป RP2350 เทียบ ESP32-C3 · ว่าขั้นไหนบังคับ KeySign |
| WP12 | **App Manifest/ร้านแอป:** หลัง ADR 0026 ตัดสิน → กำหนด schema manifest, ขยาย service-registry, ผูก `activateVersion` ของ CIDER กับการเผยแพร่ Catalog, บันทึกเหตุการณ์ `APP_REVIEWED/INSTALLED`, metering ต่อ `appId`, แบ่งรายได้ตาม fee schedule | G5 | ADR 0026 · fee schedule/การแบ่งรายได้ (GAP-ANALYSIS) |

### สิ่งที่ทำคู่ขนาน (ไม่ผูกเฟส)
- **G9:** ล้าง DID ส่วนบุคคลและค่า hardcode ในสคริปต์ (ใช้ตัวแปรสภาพแวดล้อม/อาร์กิวเมนต์) ก่อนส่งมอบหรือเปิดเผยใดๆ
- **การตรวจอิสระ:** ให้ผู้ตรวจที่ไม่ใช่ผู้เขียนโค้ดทวนผลเอกสารนี้ และทดสอบเจาะระบบโดยบุคคลที่สามก่อนขอขึ้นบัญชีนวัตกรรม (SPD-PLN-005 เกณฑ์ข้อ 3)

### สิ่งที่แต่ละ gap ปลดล็อก

| เป้าหมาย | ต้องปิด |
|---|---|
| ส่งมอบลูกค้ารายแรก (Track S) | WP2 WP3 WP4 WP5 WP6 + G9 |
| ใช้ในนำร่องหาดใหญ่ระยะ 1 (SPD-PLN-001) กับข้อมูลสังเคราะห์ | พร้อมแล้วในระดับซ้อม ตามสถานะ CONDITIONAL แต่ห้ามใช้ข้อมูลจริงจนกว่า WP5 |
| ขึ้นบัญชีนวัตกรรมไทย (SPD-PLN-005 เกณฑ์ 3, 5) | WP5 WP6 + pen-test บุคคลที่สาม |
| เชื่อม SPADA (Track C) | WP7 WP8 WP9 และ WP10 สำหรับ `APPLIANCE` |
| ขึ้น App Store (SPD-PLN-004 ขั้น 3–5) | WP12 (ต้องรอ ADR 0026) |

## 5. ความเสี่ยงของผลตรวจนี้เอง
1. **ผู้ตรวจเป็น AI ไม่ใช่ผู้ตรวจอิสระ:** อ่านเฉพาะส่วนที่เกี่ยวกับข้ออ้าง อาจพลาดข้อบกพร่องอื่น
2. **shallow clone ของ branch หลัก:** ไม่ได้ตรวจ branch อื่นหรืองานที่ยังไม่ commit ผลอาจต่างจากเครื่องของผู้พัฒนา (รายงาน 2026-09-06 เองก็ระบุว่า working tree มีไฟล์ที่ยังไม่ commit จำนวนมาก)
3. **เทสต์ผ่านไม่เท่ากับถูกต้อง:** ไม่ได้ประเมินความครอบคลุมของเทสต์ และไม่ได้ตรวจความถูกต้องทางกฎหมายของโมดูลภาษีและเงินเดือน
4. **สาเหตุของเทสต์ที่ล้ม 7 ข้อยังไม่ได้วิเคราะห์ราก** (ระบุเฉพาะอาการ)
5. **ตัวเลข (171 เส้นทาง, 31 เครื่องมือ, จำนวนเทสต์)** เป็นของ commit ที่ระบุเท่านั้น

## 6. สิ่งที่ต้องขอจาก Lead
1. มอบผู้รับผิดชอบ WP1–WP4 (เฟส 0)
2. ที่อยู่ซอร์สของเครื่องมือเตรียมเครื่อง C# (WP3) หรือคำยืนยันว่าเลิกใช้
3. เลือกลูกค้ารายแรกสำหรับ WP6 (และยืนยันว่าเป็น Track S)
4. กำหนดวันตัดสิน ADR 0024/0025/0026, dTPM/fTPM, ชิป KeySign
5. อนุมัติให้ผู้ตรวจอิสระทวนผลนี้

## 7. ผลการดำเนินการ (อัปเดต 2026-10-03 หลัง Lead สั่งให้ปิด gap และสร้างเครื่องมือ C# ใหม่แทน)

**วิธีทำ:** เขียนโค้ดบน **branch ใหม่** ของแต่ละ repo (ไม่แตะ `main`/branch หลัก ยังไม่เปิด PR) รันชุดทดสอบเต็มก่อน push ทุกครั้ง ไม่มีการ merge โดย Claude

| repo | branch | commit | สิ่งที่ส่งมอบ |
|---|---|---|---|
| `onemanos-setbox` | `claude/prep-assistant-node` | `154f2ab` | เครื่องมือเตรียมเครื่องเขียนใหม่เป็น Node (`setup/onemanos-prep.js`, คำสั่ง `prep`) + 55 เทสต์ + คู่มือ `docs/OneManOS-Setbox-Prep-TH.md` · ปิดช่องของ `verify-kit` · แก้บั๊กให้สิทธิ์ซ้ำชน UNIQUE · เปลี่ยน Dockerfile/.dockerignore · engines `>=22.13` · เทสต์ mac5 ข้ามอย่างมีเหตุผล |
| `spada-monorepo` | `claude/fix-myai-time-dependent-tests` | `b106591` | แก้เทสต์ MyAI 4 ข้อที่ล้มเพราะผูกกับเดือนกันยายน 2026 (นาฬิกาจริงเลยเดือนไปแล้ว) |
| `onemanos` | `claude/skip-windows-only-probe-test` | `3a114c0` | เทสต์ probe ที่ยืนยัน Windows ถูกข้ามบนแพลตฟอร์มอื่น |

### คำตอบ: "สร้างเครื่องมือ C# ขึ้นใหม่แทนได้ไหม" → ได้ และทำแล้วเป็น Node
เหตุผลที่เลือก Node แทนเขียน C# ซ้ำ: SetBox มีตัวติดตั้งเป็น Node อยู่แล้ว (`setup/onemanos-setup.js`) ด้วยหลักการ "เขียนครั้งเดียวใช้ได้ทุกระบบ" และมีตัวตรวจชุดส่งมอบ (`kit-manifest.js`, `kit-signing.js`, `verify-kit.js`) ที่แข็งแรงกว่าตัว C# ในหลายจุด จึงต่อยอดแทนการสร้างตัวตรวจชุดตัวที่สอง ผลคือไม่มีภาษาที่สองให้ดูแล และข้อค้นพบ P1/P2 ทั้งหมดมีเทสต์ปิดไว้ (ตาราง "ข้อค้นพบ → ที่ทำ → เทสต์" อยู่ในคู่มือ prep)

**ข้อจำกัดที่ต้องบอกตรง ๆ:**
- เขียนจาก "ข้อแก้" และ "ทดสอบรับงาน" ในรายงาน 2026-09-06 เท่านั้น ไม่ได้พอร์ตจากซอร์สเดิม (ไม่มีซอร์ส) พฤติกรรมที่ C# เดิมทำและรายงานไม่ได้กล่าวถึง (เช่นหน้าจอ WinForms, ด่าน P5–P9) **ไม่ได้ถูกสร้างซ้ำ** ต้องให้เจ้าหน้าที่ที่เคยใช้เครื่องมือเดิมระบุว่ายังต้องการอะไรต่อ
- เป็น CLI ไม่มีหน้าจอ (ถ้าต้องการหน้าจอสำหรับช่างต้องออกแบบเพิ่ม)
- ตัวตนเครื่อง = รหัสติดตั้งของระบบปฏิบัติการ ไม่ใช่ TPM/EK (ระบุในผลทุกครั้ง) · ยังไม่ได้ทดสอบบนวินโดวส์สะอาด/เครื่องจริง · การตรวจ BitLocker ต้องรันด้วยสิทธิ์ผู้ดูแล (มิฉะนั้นผลเป็น REVIEW)
- ผู้ตรวจเป็น AI ยังไม่มีมนุษย์ทวนโค้ด และยังไม่ได้ทดสอบเจาะระบบ

### สถานะ gap หลังดำเนินการ

| Gap | สถานะ | หมายเหตุ |
|---|---|---|
| G3 เครื่องมือเตรียมเครื่อง P1×4/P2 | **ปิดในระดับโค้ดและเทสต์** (WP3+WP5 โดยการเขียนใหม่) | ยังเหลือเกณฑ์ที่เป็นของคน: ทดสอบ Windows สะอาด, เจ้าหน้าที่คนใหม่ทำตามคู่มือ, ผู้ตรวจอีกคนตรวจ evidence |
| G6 Dockerfile ค้างยุคเก่า | **ปิด** (WP4 บางส่วน) | จำลองการเริ่มระบบด้วยชุดไฟล์ตาม COPY ใหม่แล้วเริ่มได้และ `/api/warehouse/summary` ตอบ 200 · **ยังไม่ได้ `docker build` จริง** (ไม่มี Docker daemon ในเครื่องนี้) และยังไม่ได้เพิ่มขั้น build ใน CI |
| G7 เทสต์ที่ไม่ผ่าน | **ปิด** (WP2) | SetBox 903 ผ่าน/0 ล้ม/2 ข้าม (ชุดเต็มแบบ CI) · MCP 92/92 · monorepo 486 ผ่าน/0 ล้ม/1 ข้าม · onemanos 194 ผ่าน/0 ล้ม/1 ข้าม · พบรากสาเหตุจริง 2 ข้อ: (ก) บั๊กในโค้ดผลิตภัณฑ์ `addParticipant` ชน UNIQUE แบบสุ่ม (ข) เทสต์ MyAI ผูกเดือน (ข้อ ค/ง ของ mac5 และ machine-probe เป็นเงื่อนไขสภาพแวดล้อม จึงเปลี่ยนเป็นข้ามอย่างมีเหตุผล) |
| G8 เอกสารล้าสมัย | **ปิดบางส่วน** (WP1) | แก้ errata ใน SPD-ARC-001 แล้ว · ยังไม่ได้แก้ SPD-CUR-001 และเอกสารใน repo อื่น |
| — พบเพิ่ม: `engines` ใน `package.json` ระบุ `>=20` แต่คลังใช้ `node:sqlite` | **ปิด** | แก้เป็น `>=22.13` (เวอร์ชันที่ไม่ต้องใช้ flag) |
| G1 ตัวตรวจ attestation (EK/TPM) | **ยังไม่ปิด** | ต้องการคำตอบ dTPM/fTPM เป็นลายลักษณ์อักษรและรุ่นเครื่อง จึงตัดสินว่าจะตรวจอะไรได้ (เขียนโดยไม่มีหลักฐานจากเครื่องจริงจะเป็นการเดา) |
| G2 ผูกสัญญา SPADA (C1 ตัวตน, C2 แฮช, provisioning client) | **ยังไม่ปิด — แต่มีใบงานแล้ว** | C1 = `POO-WO-001`, C2 (ของ Fact ใน `fact-vault.js`) = `POO-WO-002` ออกแล้วโดย Cowork แทน Lead เมื่อ 2026-09-22 ให้ Codex ทำ (แผนละเอียด `architecture/contracts/c1-subject-id/MIGRATION-poo.md`) ยังไม่ทราบความคืบหน้าจริง · **แก้ข้อความ v0.2:** เดิมเขียนว่า "ต้องรอ Lead อนุมัติ migration" ซึ่งไม่ถูก เพราะผู้ร่างยังไม่ได้เปิด `work-orders/` ตอนเขียน · ส่วน provisioning client (WP9) ยังไม่มีใบงาน |
| G4 KeySign กับ Human Gate | **ยังไม่ปิด** | ติดการตัดสินชิป RP2350 เทียบ ESP32-C3 |
| G5 App Manifest/ร้านแอป | **ยังไม่ปิด** | ติด ADR 0026 (Proposed) |
| G9 DID ส่วนบุคคลในสคริปต์ | **ยังไม่ปิด — มีใบงานแล้ว** | ข้อ 4 ของ `POO-WO-001` (สคริปต์ 13 ไฟล์ → รับ actor จาก argument/ผู้ login) |
| G10 ส่งมอบลูกค้ารายแรก | **ยังไม่ปิด** | เป็นงานของคน/ธุรกิจ (WP6) |

### สิ่งที่ Lead ต้องทำต่อ
1. **ตรวจโค้ดและตัดสินใจ merge** ทั้งสาม branch (ผมไม่ได้เปิด PR และไม่ได้ merge) ถ้าต้องการให้ผมเปิด PR ตามแม่แบบของแต่ละ repo บอกได้
2. ระบุว่าฟังก์ชันของเครื่องมือ C# เดิมที่ต้องการนอกเหนือจากที่รายงานระบุ (รวมหน้าจอ) เพื่อสร้างเพิ่ม
3. ทดสอบ `prep` บนวินโดวส์สะอาด และเจ้าหน้าที่คนใหม่ทำตามคู่มือ (เกณฑ์ก่อนส่งลูกค้าของรายงาน 2026-09-06)
4. ตัดสิน dTPM/fTPM, ชิป KeySign, ADR 0026 และอนุมัติแผน migration C1/C2 เพื่อให้ผมทำ WP7–WP12 ต่อ

## 8. ส่งต่อให้ Codex (2026-10-03, ตามคำสั่ง Lead)

- ใบงาน: **`POO-WO-006`** ที่ `onemanos-setbox` branch `claude/prep-assistant-node` (commit `be59a2f`) ไฟล์ `work-orders/POO-WO-006-gap-closure-handoff-from-claude.md` + แถวใน `work-orders/README.md`
- บันทึกส่งต่อ (D-E-R) ที่ `spada-monorepo` branch `claude/fix-myai-time-dependent-tests` (commit `eabfd17`) ใน `AGENT_NOTES.md`
- ลำดับ: เฟส A ตรวจรับ branch ของ Claude แบบ adversarial + CI บน Windows + ขั้น docker build + เปิด PR (ไม่ merge) ของสาม repo → เฟส B ต่อยอด prep ให้ใช้หน้างาน (ฟังก์ชันของ C# เดิมที่ขาด, launcher, คู่มือ, Windows สะอาด) → เฟส C ใบงานเดิม 001–004 → เฟส D เตรียมงานที่ติดการตัดสินใจ (attestation verifier, สัญญา KeySign, คำถามของ ADR 0026) **โดยห้ามต่อสาย ห้ามแตะ `APPLIANCE`**
- ข้อจำกัด: Claude ไม่มีอำนาจอนุมัติแทน Lead จึงเป็นสถานะ "ออกแล้ว" ไม่ใช่ "อนุมัติโดย Lead" · ผมไม่มีช่องทางสั่ง Codex โดยตรง ใบงานจะมีผลเมื่อ Codex อ่านจาก repo (หรือ Lead/Cowork ส่งต่อ) · ไม่มีการเปิด PR และไม่มีการ merge โดย Claude

*ฉบับร่าง v0.3 เขียนโดย Claude เพื่อให้ Lead ตรวจ ยังไม่ผ่านการลงนามหรือรับรอง ไม่มีการแก้ไขโค้ดใน repo อื่นใด (เปิดอ่านและรันเทสต์เท่านั้น; `npm install/build` สร้างไฟล์ใน working tree ของ clone ชั่วคราว ไม่ได้ commit)*
