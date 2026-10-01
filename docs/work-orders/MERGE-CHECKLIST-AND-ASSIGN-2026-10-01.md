# เช็กลิสต์ merge PR นำเข้า และข้อความมอบ POO-WO-006

- **รหัสเอกสาร: SPD-HND-004** · ร่างโดย Claude ตามที่ Lead สั่ง "ดำเนินการตามข้อเสนอแนะ" · **Claude ไม่ได้ merge ไม่ได้ส่งข้อความ และไม่ได้แก้ repo ใด** (สิทธิ์อ่านอย่างเดียวบน `onemanos-setbox`/`spada-monorepo`; การ merge เป็นการตัดสินของ Lead) · ข้อมูลอ้างอิง [SPD-REV-007](REVIEW-IMPORT-PRS-2026-10-01.md) §2.1–2.4

> **อัปเดต 2026-10-01 (หลัง Lead รายงาน):** PR #1 **merge แล้ว** · PR #93 ยัง Draft/Blocked รอคำตอบข้อถ้อยคำ ADR 0024–0026 และผู้อนุมัติ 1 คน + required checks · ข้อความมอบ POO-WO-006 (ข้อ 2) **ยังไม่ได้ส่ง/ยังไม่เริ่มงาน** ตามที่ Lead แจ้ง · ดู [SPD-REV-007 §2.5](REVIEW-IMPORT-PRS-2026-10-01.md)

## 1. เช็กลิสต์ก่อน merge (Lead ทำเอง)

### PR #1 — `onemanos-setbox` (head `88e49ab`, Draft)
- [ ] เปิดดู diff 5 ไฟล์ (ADR-008 อยู่ `docs/drafts/`, POO-WO-006/007/008, README) ตรงกับที่ต้องการ
- [ ] รับทราบว่า **CI ยังแดงเท่า base** (Ubuntu/Windows/kit ล้มบน base ด้วย) และความล้มไม่ได้มาจาก PR ตาม [รายงาน `befbd39`](https://github.com/chatchailim/onemanos-setbox/commit/befbd39) และ `5f5f37a`
- [ ] รับทราบว่าผล kit ไม่คงที่ (889/1, 890/0, 879/11 จากซอร์สชุดเดียวกัน) kit ไม่ใช่เกณฑ์ตัดสิน merge
- [ ] ตั้ง Ready for review เองและ merge ตามนโยบาย branch protection ของ repo (Claude ไม่ทราบเงื่อนไขที่ repo บังคับ)

### PR #93 — `spada-monorepo` (head `4dc1839`, Draft)
- [ ] **ตอบคำถามเดียว:** ยอมรับถ้อยคำ "Accepted (delegated decision, SPD-DEC-006) … Lead may reverse" ของ ADR 0024–0026 หรือไม่ (ใช่ / ขอแก้ถ้อยคำเป็น ______) — *ผมไม่ได้ถือคำสั่งล่าสุดเป็นการตอบข้อนี้*
- [ ] รับทราบว่า CI ของ #93 ล้มเหมือน base (เทสต์ MyAI ผูกเดือน, [run 36586813474](https://github.com/chatchailim/spada-monorepo/actions/runs/36586813474)) ไม่ใช่ผลของ PR
- [ ] รับทราบว่า ADR 0028 และ SPD-WO-008 เป็นร่าง **ห้ามเริ่มงาน** และผู้ตรวจอิสระของ ADR 0028 ยังไม่ได้ตั้ง (การ merge เอกสารร่างไม่ใช่การรับ ADR)
- [ ] merge หลัง #1

## 2. หลัง #1 merge: ข้อความมอบ POO-WO-006 ให้ Codex (Lead ส่ง)

> **ถึง Codex:** Lead มอบ **POO-WO-006** (ตรวจ PID ก่อน `isAlive` แก้บั๊ก PID 0) ให้ทำ ตามใบงานใน `onemanos-setbox/work-orders/POO-WO-006-supervisor-pid-validation.md`
> - branch แยกจาก master ห้ามปนกับ `codex/poo-wo-005-spike` · DCO ทุก commit
> - ต้องมี negative test ตามตารางเกณฑ์รับงาน ทดสอบทั้ง Windows และ Linux
> - เทสต์ที่รัน: ชุดของใบงานนี้ และ `npm test` ที่ราก **เทียบกับ base ที่ commit เดียวกัน** (อย่าอ้าง "5 ข้อเดิม" โดยไม่รัน base เพราะ CI และเครื่องให้ผลต่างกัน) · ห้ามข้ามหรือปิดเทสต์
> - ส่งรายงานแยก "ลองแล้ว / อ่านแล้ว / ไม่ทราบ" พร้อม hash ก่อน–หลังของ `supervisor.js`/`lib.js` และข้อจำกัด PID reuse
> - ยังไม่เริ่ม POO-WO-007 จนกว่า 006 ผ่านการตรวจ · ไม่เริ่ม POO-WO-008 และไม่เริ่มงานตาม ADR-008/0028, SPD-WO-008 · ไม่ merge เอง

## 3. ที่ยังค้าง (ไม่อยู่ในเช็กลิสต์ข้างบน)

| งาน | ผู้ตัดสิน/ทำ |
|---|---|
| นำเข้าและมอบ [SPD-WO-009 A–E](WO-PROPOSAL-CI-STABILITY-2026-10-01.md) (CI ไม่เสถียร) | Lead |
| ผู้ตรวจความปลอดภัยอิสระของ ADR 0028 | Lead/ผู้ดูแล |
| ข้อความเก่าในไฟล์ที่นำเข้า (SPD-REV-007 ข้อ 2) | Lead ตัดสินว่าแก้หรือยอมรับตามป้ายหัวไฟล์ |
| raw log VM Server Core เดิม, prepaid key B4, หน่วย/ผู้กดปุ่มของ SPD-WO-008 ข้อ 9 | Lead/Codex |
