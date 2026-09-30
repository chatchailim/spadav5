# ร่าง ADR: Responsibility record ของ Team Agent (ฝั่ง OneManOS/OneVault)

- **รหัสเอกสาร: SPD-ADR-D04**
- **สถานะ: ร่าง (Draft)** · 2026-09-30 · Lead อนุมัติ **ทิศทาง** (เริ่มที่ Team Agent + ออก ADR Responsibility) ใน [SPD-DEC-005](APPROVAL-LOG-2026-09-30-FINAL-ADJUSTMENT.md) ข้อ 2 · **ข้อความนี้ Lead ยังไม่ได้ตรวจและยังไม่ใช่ ADR ที่ Accepted** · ยังไม่ได้นำเข้า repo ปลายทาง (ผู้ดูแล ADR ต้องกำหนดเลขที่ว่าง)
- ที่ตั้งที่เสนอ: `onemanos-setbox` (ฝั่ง OneManOS ตาม ADR 0014 ที่ OneManOS/OneVault/SetBox อยู่นอก SPADA)
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
2. **เพดานอิสระ** `Steward` ใช้ได้เฉพาะ operation ที่ย้อนกลับได้จริง (D2.1) การกระทำที่ย้อนไม่ได้ (เงิน สัญญา การเผยแพร่ออกนอก การลบ) ต้องมีลายเซ็นเจ้าของ ผูก `payloadDigest` และ `nonce` ผ่าน actor assertion ตาม ADR 0016
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

## คำถามเปิดสำหรับ Lead

1. ยืนยันชื่อและนิยามระดับ `Assistant` / `Agent` / `Steward` ให้ตรงกับคำศัพท์มาตรฐาน (ตรวจรายการคำต้องห้าม เช่น `AI Assistant`)
2. ตำแหน่งจัดเก็บ: ตารางใหม่ใน OneVault หรือบริการแยก
3. ใครมีสิทธิ์สร้าง/ต่ออายุ/ยกเลิก Responsibility (เจ้าของคนเดียว หรือมีผู้สำรอง ตาม SPD-ADR-D02 ข้อ 7)
4. ตัดสิน doc 335 ข้อ 9 เป็นกฎเหล็กก่อนหรือพร้อม ADR นี้
