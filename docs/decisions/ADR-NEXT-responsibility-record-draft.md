# ร่าง ADR: Responsibility record ของ Team Agent (ฝั่ง OneManOS/OneVault)

- **รหัสเอกสาร: SPD-ADR-D04**
- **สถานะ: ร่าง (Draft)** · 2026-09-30 · Lead อนุมัติ **ทิศทาง** (เริ่มที่ Team Agent + ออก ADR Responsibility) ใน [SPD-DEC-005](APPROVAL-LOG-2026-09-30-FINAL-ADJUSTMENT.md) ข้อ 2 · **ข้อความนี้ Lead ยังไม่ได้ตรวจและยังไม่ใช่ ADR ที่ Accepted** · ยังไม่ได้นำเข้า repo ปลายทาง (ผู้ดูแล ADR ต้องกำหนดเลขที่ว่าง)
- ที่ตั้งที่เสนอ: `onemanos-setbox` (ฝั่ง OneManOS ตาม ADR 0014 ที่ OneManOS/OneVault/SetBox อยู่นอก SPADA) · **เลขที่ว่างที่ตรวจแล้ว (2026-09-30):** ชุด ADR ของ `onemanos-setbox` มี `docs/ADR-005`..`ADR-007` จึงเสนอ **`ADR-008`** (ตรวจที่ `ce692ca`) · ส่วน `spada-monorepo/architecture/adr/` ล่าสุดคือ 0027 (เลขถัดไป 0028 หากผู้ดูแลเห็นว่าควรอยู่ฝั่ง monorepo) · การนำเข้าต้องทำโดยผู้ดูแล repo (DCO, branch protection) ผมมีสิทธิ์อ่านอย่างเดียว
- **ผลทบทวนรอบ 2 (2026-09-30):** เทียบกับ ADR 0016 ฉบับเต็มแล้ว พบ 4 จุดที่ต้องปรับ ดูหัวข้อ "ผลทบทวนรอบ 2" ท้ายเอกสาร (ปรับกติกาข้อ 2 แล้ว)
- ที่มา: [SPD-ANL-002](../MYAI-TEAMAGENT-DOT-PARITY-BUILD-LIST.md) ชิ้นงานที่ 1 · [SPD-ANL-003](../ALIGNMENT-CHECK-AGENTIC-BUSINESS-OS.md) · [SPD-REV-002](../work-orders/REVIEW-POO-WO-005-round2-2026-09-30.md)
- ข้อจำกัด: เขียนจากเอกสารสรุปใน repo นี้ ยังไม่ได้อ่านโค้ด `onevault-mcp` หรือ ADR 0014/0016 ฉบับเต็ม ผู้ตรวจต้องเทียบต้นฉบับก่อนรับ

## บริบท

Team Agent ปัจจุบันเป็นเอเจนต์ภายนอก (Claude Code, Claude Desktop, Codex) ที่ผูกกับ MCP server `onevault` ตามบทบาท architect / secretary / builder / operator สิทธิ์เป็น **บทบาทสิทธิ์ของโทเคน** ไม่ใช่ "ภาระรับผิดชอบต่อเนื่อง" ระบบยังไม่มีวัตถุที่บอกว่า เอเจนต์ดูแลอะไร ภายใต้ขอบเขตใด เมื่อไรต้องถาม และหมดอายุเมื่อใด (ผลสำรวจ POO-WO-005: ไม่พบเครื่องมือ Responsibility) จึงยังทำงานต่อเนื่องเองไม่ได้อย่างควบคุมได้

## ข้อเสนอ (Decision — รอ Lead ตรวจ)

เพิ่มชนิดข้อมูล **Responsibility record** ใน OneVault/OneManOS ฝั่ง SetBox เป็นหน่วยของ "งานที่เจ้าของมอบให้ Team Agent ดูแลต่อเนื่อง"

| ฟิลด์ | ความหมาย |
|---|---|
| `responsibilityId` | รหัสท้องถิ่น (รูปแบบ C1 `onevault:<kind>:<id>`) ห้ามออก `did:spada:*` |
| `owner` | เจ้าของที่มอบหมาย (อ้างตัวตนท้องถิ่นที่ผูก DID ผ่าน OIDC) |
| `goal` | เป้าหมายเป็นข้อความที่ตรวจได้ |
| `dataScope` | ขอบเขตข้อมูลที่อ่านได้ (ผูกกับสิทธิ์ของเจ้าของ) |
| `triggers` | เวลา (cron) หรือเหตุการณ์ที่ปลุกเอเจนต์ |
| `autonomyLevel` | `Assistant` / `Agent` / `Steward` (ตามการแบ่งใน SPD-ANL-002) |
| `policyRules` | กติกา 4 ทางต่อประเภท action: `allow` / `pre-approved` / `ask` / `handoff` |
| `handoffConditions` | เงื่อนไขส่งต่อให้มนุษย์ |
| `expiresAt` | วันหมดอายุ (ต้องต่ออายุโดยเจ้าของ) |
| `status` | ร่าง / ใช้งาน / หยุดชั่วคราว / ยกเลิก |
| `version`, `policyVersion` | เวอร์ชันเพื่อการตรวจย้อนหลัง |

ตัวอย่างข้างต้นเป็นโครงเสนอ ชื่อฟิลด์และชนิดข้อมูลต้องตัดสินตอนออกแบบรายละเอียด

### กติกาที่ต้องบังคับ

1. **ไม่มี DID ของ Team Agent** ทุกอย่างเป็นการกระทำในนามเจ้าของ (ADR 0016)
2. **เพดานอิสระแยกตามเขตอำนาจ** (ปรับตาม ADR 0016 §7 ในรอบ 2):
   - **การกระทำภายใน OneVault/SetBox** (ไม่เรียก SPADA): `Steward` ใช้ได้เฉพาะ operation ที่ย้อนกลับได้จริง (D2.1) การกระทำที่ย้อนไม่ได้ (เงิน สัญญา การเผยแพร่ออกนอก การลบ) ต้องมีลายเซ็นเจ้าของ
   - **การกระทำที่เรียก SPADA** (ADR 0016 §7 บังคับ): การ **อ่าน** ที่ TrustScore ของเจ้าของ < 500 ทำผ่าน *delegated grant* ได้ (มี `purpose`, `expiresAt` แนะนำ ≤ 24 ชม., ผูก `client_id` และ scope เดียว, เพิกถอนได้ทันที, บันทึกว่าใช้ grant ไม่ใช่ลายเซ็นสด) · **เขียน แชร์ และ operation sensitive (TrustScore ≥ 500) ต้องมีลายเซ็นสดของเจ้าของเสมอ** ผูก `payloadDigest` และ `nonce` ผ่าน actor assertion ห้ามใช้ grant แทน
   - grant ไม่ยกระดับสิ่งที่เจ้าของเองทำไม่ได้ และ Team Agent ที่ถือ grant ของสมาชิกเข้า **WorkSpace** ไม่ได้ถ้าองค์กรเจ้าของไม่อนุญาต delegation (ADR 0016 §5)
3. **ไม่เปิดอนุมัติอัตโนมัติ** จนกว่าเส้นทางกุญแจครบ (A6) และ human gate พิสูจน์ตัวตนได้ (SPD-DEC-005 ข้อ 6)
4. **ทุก action** ผ่าน policy engine ก่อนเรียก tool ของ `onevault` MCP และก่อนส่งข้ามไป SPADA · default deny
5. **Audit** บันทึก agent, responsibility, action, input/output (เท่าที่จำเป็น), tool, **เวอร์ชัน skill/policy/โมเดล**, ผลลัพธ์ และผู้อนุมัติ (ช่องว่างปัจจุบัน: `audit_events` ยังไม่มี hash chain POO-WO-003 และไม่บันทึกเวอร์ชันโมเดล)
6. **Kill switch** หยุดเอเจนต์ทันทีและยกเลิก Responsibility ทั้งชุด พร้อมรายงาน "ทำอะไรไปบ้าง"
7. **แยก instruction กับ data** ข้อความจากอีเมล/เว็บ/เอกสารสั่ง tool โดยตรงไม่ได้ (doc 335 ข้อ 9 ยัง Proposed ต้องตัดสินก่อนบังคับ)
8. **ไม่แตะ Fact v0 และสัญญา C2 (fact hash)** ชนิดใหม่ (Responsibility, Event, Decision) เป็นตารางแยกและผ่านใบงาน/ADR ฝั่ง OneManOS

### สิ่งที่ไม่ทำใน ADR นี้

ไม่ออกแบบ MyAI Responsibility บนอุปกรณ์ (เลื่อนไป F4 เมื่อรูปแบบนิ่ง) · ไม่กำหนด scheduler/work memory (ชิ้นงาน 4–5) · ไม่เปิดการเขียนโดยเอเจนต์ · ไม่ย้ายฟังก์ชัน Team Agent เข้า SPADA

## ผลที่ตามมา

- ปลดบล็อกชิ้นงาน 2–4 และ 11 ของ SPD-ANL-002 (policy engine, approval→assertion, scheduler, kill switch)
- ต้องมีใบงานสำรวจ/ออกแบบรายละเอียดต่อจาก POO-WO-005 และ Lead ต้องกำหนด VM/บัญชีทดสอบ (SPD-REV-002)
- เพิ่มภาระตรวจสอบ: ต้องระวังความเหนื่อยจากการกดอนุมัติ (SPD-ANL-002 ความเสี่ยง 2) โดยรวมคำขอเป็นชุดและใช้ `pre-approved` เฉพาะความเสี่ยงต่ำ

## เกณฑ์ตรวจรับ (จาก SPD-ANL-002 เฟส F1)

- กรณีที่ต้องถามเจ้าของ 20 กรณีผ่านหมด
- ทดสอบว่า action ย้อนไม่ได้ไม่ผ่านโดยไม่มี actor assertion ที่ตรวจตัวตนได้
- ทดสอบ kill switch และรายงานย้อนหลัง
- ตัวเลขและเกณฑ์อื่นต้องตกลงร่วมกันก่อนเริ่ม ผมไม่ได้กำหนดเพิ่ม

## ผลทบทวนรอบ 2 (เทียบ ADR 0016 ฉบับเต็ม, 2026-09-30)

| # | ข้อค้นพบ | ผลต่อร่าง |
|---|---|---|
| R1 | ADR 0016 §7 กำหนดแล้วว่า unattended operation = delegated grant แคบและมีอายุ เฉพาะความเสี่ยงต่ำ ส่วนเขียน/แชร์/sensitive ต้องลายเซ็นสดเสมอ ร่างรอบแรกเขียนเพดานตาม D2.1 อย่างเดียว | แก้กติกาข้อ 2 ให้แยกเขตอำนาจ (ทำแล้ว) |
| R2 | Responsibility ที่มี `triggers` แบบ cron/เหตุการณ์ หมายถึงการทำงานตอนเจ้าของไม่อยู่ แต่อายุ grant แนะนำ ≤ 24 ชม. | **เพิ่มข้อกำหนด:** Responsibility ที่เรียก SPADA ต้องผูกกับ grant ที่ยังมีอายุ และมีขั้น **ต่ออายุโดยเจ้าของ** เมื่อ grant หมด ไม่ทำงานต่อเงียบ ๆ · `expiresAt` ของ Responsibility ไม่เท่ากับอายุ grant (Responsibility อายุยาวได้ แต่การใช้สิทธิ์ต่อ SPADA ต้องอยู่ในอายุ grant) |
| R3 | consent model ปัจจุบัน `granteeDid` รับเฉพาะ `did:spada:person:*` ไม่มี purpose/expiry/recipient (ADR 0016 §6, ADR 0018 แก้ให้เป็น discriminated union แล้วตามทะเบียน) | **dependency:** ต้องตรวจว่า ADR 0018 implement แล้วเพียงใดก่อนเริ่ม F1 (ผมยังไม่ได้ตรวจโค้ด consent-service) |
| R4 | นโยบาย delegation ระดับ WorkSpace ของ `did:spada:org` ยังเป็นงานค้าง (ADR 0016 "ต้องทำ" ข้อ 2) | **dependency** ของ Responsibility ที่แตะข้อมูลองค์กร |
| R5 | ADR 0016 §4 ห้ามนับ Human Gate/UX บน Setbox เป็นหลักฐานของ SPADA ต้อง materialize เป็น actor assertion ผูก payload | ตรงกับกติกาข้อ 3 ของร่างอยู่แล้ว |
| R6 | ชื่อ "Steward" ในระดับ autonomy อาจชนกับบทบาท Steward ของโครงการ (Lead ถือบทบาท Steward ฝั่ง SPADA) | คำถามเปิดข้อ 1 มีผลจริง ควรเลือกชื่อระดับที่ไม่ชนบทบาทบุคคล |

## คำถามเปิดสำหรับ Lead

1. ยืนยันชื่อและนิยามระดับ `Assistant` / `Agent` / `Steward` ให้ตรงกับคำศัพท์มาตรฐาน (ตรวจรายการคำต้องห้าม เช่น `AI Assistant`)
2. ตำแหน่งจัดเก็บ: ตารางใหม่ใน OneVault หรือบริการแยก
3. ใครมีสิทธิ์สร้าง/ต่ออายุ/ยกเลิก Responsibility (เจ้าของคนเดียว หรือมีผู้สำรอง ตาม SPD-ADR-D02 ข้อ 7)
4. ตัดสิน doc 335 ข้อ 9 เป็นกฎเหล็กก่อนหรือพร้อม ADR นี้
