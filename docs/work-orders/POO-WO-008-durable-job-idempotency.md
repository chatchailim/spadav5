# POO-WO-008 — Durable job และ idempotency key ผูกกับ Responsibility (ออกแบบ + ต้นแบบ)

> **ฉบับพร้อมนำเข้า `onemanos-setbox/work-orders/`** · รหัสต้นทางใน repo spadav5: SPD-WO-007 · **ร่างโดย Claude แทน Lead** ตามที่ Lead อนุมัติให้แยกใบงานแก้ในบทสนทนา 2026-10-01 · **Lead ยังไม่ได้ตรวจข้อความ**
> **ห้ามเริ่มจนกว่า Lead ตรวจและรับ [SPD-ADR-D04](../decisions/ADR-NEXT-responsibility-record-draft.md)** (Responsibility record) เพราะใบงานนี้ออกแบบบนวัตถุนั้น
> ก่อนนำเข้า: ตรวจว่าเลข 008 ว่างที่ remote และเพิ่มแถวใน `work-orders/README.md`

- ผู้ทำ: **Codex** (ออกแบบ+ต้นแบบ) · ผู้ตรวจรับ: **Cowork** · ผู้ตัดสิน: **Lead**
- ขนาด: **ใหญ่** · Priority: **P1** (เงื่อนไขของเฟส F1) · Milestone: M2
- ประเภท: **ออกแบบและต้นแบบบนข้อมูลสังเคราะห์** ยังไม่เปิดให้ใช้งานจริง · branch แยก
- ที่มา: [SPD-REV-004](REVIEW-POO-WO-005-round3-2026-10-01.md) F3/F4 · หลักฐาน B2 กรณี 07 (crash หลัง effect ก่อน complete: 2 effects, 1 complete) และกรณี 05 (ไม่มี catch-up ของรอบที่พลาด)
- สถานะ: **ร่าง รอ Lead ตรวจ (และรับ SPD-ADR-D04) นำเข้า และมอบผู้ทำ**

## ปัญหา

supervisor + worker ปัจจุบันไม่มีกลไกกันผลข้างเคียงซ้ำเมื่อเริ่มใหม่หลังล้ม และไม่ชดเชยรอบที่พลาด Responsibility ที่มี `triggers` (SPD-ADR-D04) หมายถึงการทำงานตอนเจ้าของไม่อยู่ จึงต้องมีงานที่ทนการล้มโดยไม่ทำซ้ำสิ่งที่ย้อนไม่ได้ และตรวจย้อนหลังได้

## ขอบเขต

ทำ: ออกแบบวัตถุ job/attempt/effect และกติกา idempotency · ต้นแบบบนข้อมูลสังเคราะห์ · เทสต์ crash ทุกจุด
ไม่ทำ: ไม่เปิดการเขียนหรืออนุมัติอัตโนมัติของเอเจนต์ (กฎถาวร SPD-DEC-005 ข้อ 6) · ไม่แก้ Fact v0 (POO-WO-002) หรือสัญญา C2 (fact hash) · ไม่ออก DID ให้ Team Agent (ADR 0016) · ไม่เรียก SPADA ในต้นแบบ

## ข้อเสนอการออกแบบ (ผู้ทำปรับได้ แต่ต้องตอบเกณฑ์รับงาน)

| วัตถุ | ใจความ |
|---|---|
| `job` | `jobId`, `responsibilityId` (+`version`), เหตุกระตุ้น (เวลา/เหตุการณ์), สถานะ: `scheduled → started → effect_recorded → completed` หรือ `failed`/`abandoned` |
| `attempt` | `attemptId` ต่อการเริ่มแต่ละครั้ง ผูก `jobId` ผู้ทำ (PID/โฮสต์) เวลา |
| `idempotencyKey` | กำหนดจาก `(responsibilityId, ช่องเวลา/เหตุการณ์, ชนิด action)` ไม่ใช่จาก attempt ทำให้ attempt ใหม่ได้ key เดิม |
| `effect ledger` | ตาราง append-only บันทึกผลข้างเคียงที่ทำแล้วพร้อม key **ตรวจก่อนทำ** ถ้ามี key นี้แล้วให้ข้ามและรายงานว่าซ้ำ |
| ลำดับ | บันทึก "จะทำ" → ทำ effect → บันทึก "ทำแล้ว" ใน transaction เดียวกันกับผลที่ควบคุมได้ · effect ภายนอกที่ควบคุมไม่ได้ต้องมีขั้นตรวจสอบสถานะก่อนทำซ้ำ (compensation/lookup) หรือจัดเป็นงานที่ **ต้องมีลายเซ็นเจ้าของ** |
| นโยบายรอบที่พลาด | ต่อ Responsibility: `skip` / `run-once-on-recovery` / `run-all` (ค่าเริ่มต้นเสนอ: `skip` ร่วมกับการแจ้งเจ้าของ) ไม่ชดเชยเงียบ ๆ |
| ต่ออายุ | งานที่เรียก SPADA ผูกกับ grant ที่ยังมีอายุ (ADR 0016 §7) หมดแล้วหยุดและรอเจ้าของต่ออายุ |
| audit | ทุกการเปลี่ยนสถานะเข้า audit พร้อมเวอร์ชัน agent/skill/policy/โมเดล (ผูกกับ POO-WO-003 audit hash chain ที่ยังค้าง) |

## เกณฑ์รับงาน

1. **ซ้ำ B2 กรณี 07 ด้วยต้นแบบ:** crash หลัง effect ก่อน complete ต้องได้ **1 effect** (ไม่ใช่ 2) เมื่อเริ่มใหม่
2. crash ทุกจุดของลำดับ (ก่อนบันทึก "จะทำ", หลังบันทึก, หลัง effect ก่อนบันทึก "ทำแล้ว", หลัง complete) แต่ละจุดมีเทสต์และผลที่กำหนดล่วงหน้า
3. สองตัวประมวลผล job เดียวกันพร้อมกัน (จังหวะควบคุมได้) → effect เดียว · ระบุกลไกกัน (lock/unique constraint) และเทสต์ที่บังคับจังหวะ ไม่ใช่เพียงทดลองซ้ำหลายรอบ
4. นโยบายรอบที่พลาดทั้ง 3 แบบมีเทสต์ และแจ้งเจ้าของเมื่อข้ามรอบ
5. ไม่แก้ตาราง/สัญญาเดิม (Fact v0, C2) พิสูจน์ด้วยการรันชุดทดสอบเดิมไม่เปลี่ยนผล
6. รายงานแยก "ลองแล้ว / อ่านแล้ว / ไม่ทราบ" และระบุข้อจำกัด (ข้อมูลสังเคราะห์, ยังไม่ใช่ network จริง)

## เกณฑ์เพิ่มจากร่างของผู้ทำ (`follow-up-fix-drafts.md` รับเข้าแล้ว 2026-10-01)

- **atomic claim + lease + fencing token:** worker เก่า (stale) ที่ lease หมดแล้วต้องเขียนผลไม่ได้
- identity ของ trigger/job และ idempotency key ผูก **Responsibility + trigger + operation digest**
- การจัดการ **ผลไม่แน่ชัด** (effect อาจเกิดแล้วแต่ไม่ได้รับ ack): outbox และ reconciliation
- **ไม่อ้าง exactly-once** สำหรับ effect ภายนอกที่ปลายทางไม่มี idempotency
- cancellation, revoke ระหว่างงาน, budget exhaustion, clock shift, offline recovery
- เกณฑ์ตรวจ: crash ก่อน effect / หลัง effect ก่อน ack / หลัง ack · trigger ซ้ำ · lease หมดอายุ · ใช้ข้อมูลสังเคราะห์พร้อม **independent verifier**
- ข้อกำหนดตั้งต้น: policy authorization, หลักฐานมนุษย์ผูก identity/content ตาม ADR 0016, เงื่อนไข TLS/audit-chain ของ POO-WO-003 และ D2.1 · autonomous writes ยังปิด

## ข้อกำหนดสภาพแวดล้อม

ใช้เครื่อง/บัญชีทดสอบตาม [SPD-WO-004](SPIKE-TEST-ENVIRONMENT-SPEC-POO-WO-005.md) · ไม่ใช้ข้อมูลลูกค้า · ไม่เรียกโมเดลเสียเงินเกินวงเงินที่ระบุ
