# ข้อความแก้สำหรับผู้ดูแล monorepo: ติดป้าย WO-J ใหม่จาก "M4 (R2)" เป็น "M3 (R2)"

- **รหัสเอกสาร: SPD-PATCH-001** · 2026-10-01 · ที่มา: เทียบ [SPD-RDM-002](../UNIFIED-TIMELINE-M0-M4.md) กับ `project-management/milestones.md` (`spada-monorepo` @ `206d1f9`)
- **สถานะ: ข้อความรอผู้ดูแลนำไปใช้ ยังไม่ได้แก้ใน monorepo** (Claude มีสิทธิ์อ่านอย่างเดียว และต้องตรวจ ACTIVE CLAIMS ของ `AGENT_NOTES.md` ก่อนแก้)
- คำตัดสิน: ทางเลือก (ข) ตาม SPD-DEC-005 รอบ 3 · Lead กลับคำได้ทุกเมื่อ

## ปัญหา

`milestones.md` นิยามเพียง M0–M3 (M3 = สอง node แลกเปลี่ยนบันทึกที่เชื่อถือได้ภายใต้กติกา governance) แต่ `AGENT_NOTES.md` (ตารางใบงาน 2026-09-22 รอบ 3) ติดป้าย **WO-J (federation N1–N4 + mTLS)** ว่า **"M4 (R2)"** ซึ่งไม่มีนิยามรองรับ ทั้งที่งานนี้เป็นเงื่อนไขโดยตรงของเกณฑ์ M3

## ข้อความแก้ (เสนอ)

1. ใน `AGENT_NOTES.md` ตารางใบงาน (บรรทัด ~2954) เปลี่ยน
   `| SPADA:WO-J | federation N1–N4 + mTLS | Codex + Hermes | M4 (R2) |`
   เป็น
   `| SPADA:WO-J | federation N1–N4 + mTLS | Codex + Hermes | M3 (R2) |`
2. ค้นหา "M4" ในเอกสารอื่นที่อ้างถึง WO-J และแก้ให้ตรงกัน (การค้นของ Claude พบ "M4" ใน `AGENT_NOTES.md` เพียงบรรทัดข้างต้น ไม่ได้ค้นเอกสารนอก `*.md`)
3. ไม่ต้องแก้ `milestones.md` (ไม่เพิ่ม M4)

## ถ้า Lead ต้องการทางเลือก (ก) แทน

เพิ่มใน `milestones.md`:
```text
## M4 Federation Hardening
- Owner: Node Team
- Done when: [ให้ Lead กำหนด เช่น mTLS data plane ใช้งานครบทุก peer และผ่านการทดสอบ]
```
ผมไม่ได้กำหนดเกณฑ์ "Done when" ของ M4 แทน Lead
