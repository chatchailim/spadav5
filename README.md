# spadav5

เอกสารสถาปัตยกรรมและแผนงาน SPADA Node/Network + OneManOS SetBox

- **[สารบัญเอกสารและทะเบียนงานค้าง (เริ่มที่นี่)](docs/INDEX.md)** รหัส SPD-IDX-001
- **[สรุปความพร้อมส่งมอบ (SPD-RDY-001)](docs/DELIVERY-READINESS-TH.md)** · [ผลเทียบโค้ดกับสถาปัตยกรรม SetBox (SPD-ARC-002)](docs/SETBOX-CODE-GAP-ANALYSIS-TH.md)
- **[Design Spec & Project Framework (SPD-SPC-001)](docs/designspec.md)** · [แผนทดสอบรับงานและใบคะแนน (SPD-TST-001)](docs/ACCEPTANCE-TEST-PLAN-TH.md)
- **[คู่มือผู้ใช้งานผู้เริ่มต้น (SPD-HLP-001)](docs/help/readme.md)** · หน้า View ปุ่ม Help: `docs/help/index.html` (เปิดผ่าน web server)
- [สถานะปัจจุบัน v0.4 (สรุปจาก spada-monorepo, onemanos-setbox, onemanos, spada-specs)](docs/CURRENT-STATE.md)
- [Gap Analysis v0.4 (เทียบกับระบบจริง)](docs/GAP-ANALYSIS.md)
- [เศรษฐกิจดิจิทัลที่สมาชิกได้ประโยชน์สูงสุด (ข้อเสนอ v0.1)](docs/MEMBER-ECONOMY.md)
- [Roadmap เชิงหลักการ](docs/ARCHITECTURE-ROADMAP.md)
- [บันทึกการอนุมัติของ Lead 2026-09-29 (อนุมัติอะไร/ยังต้องทำอะไร)](docs/decisions/APPROVAL-LOG-2026-09-29.md)
- [บันทึกคำตัดสินสำหรับ Lead (5 เรื่องเทคนิคที่ค้าง)](docs/decisions/DECISION-MEMO-2026-09-29.md) · [ADR พร้อมนำเข้า monorepo](docs/decisions/ADR-NEXT-hardware-qualification-scope-import-ready.md)
- [มาตรฐานการจัดซื้อ SetBox (ร่าง)](docs/procurement/SETBOX-PROCUREMENT-STANDARD.md) · [แม่แบบจดหมายถึงผู้ขาย](docs/procurement/RFQ-VENDOR-LETTER-TH.md) · [แบบกรอก ณ วันซื้อ](docs/procurement/PURCHASE-TIME-DECISION-SHEET.md)
- [แม่แบบทะเบียนฮาร์ดแวร์แบบเดี่ยว (Track S)](docs/procurement/HARDWARE-REGISTRY-STANDALONE-TEMPLATE.md)
- [ร่าง ADR: ขอบเขต ADR 0020 (Track S ไม่เชื่อม SPADA / Track C เชื่อม SPADA)](docs/decisions/ADR-DRAFT-hardware-qualification-scope.md)
- [ร่างใบงาน S1–S3](docs/work-orders/WO-PROPOSAL-S1-S3.md) · [ใบงานสคริปต์รับรองฮาร์ดแวร์ WO-HWQ-001](docs/work-orders/WO-HWQ-001-hardware-qualification-script.md)
- **[รายการตรวจเอกสารลงทุนก่อนเปิดห้องข้อมูล (SPD-INV-001)](docs/investor-review/INVESTOR-DATAROOM-REVIEW-CHECKLIST.md)** · [ทะเบียนข้ออ้าง (SPD-INV-002)](docs/investor-review/INVESTOR-CLAIM-REGISTER.md)
- **[คำตัดสิน: ข้อเสนอระดมทุนฉบับปัจจุบัน เงื่อนไขเงินกู้ และทะเบียนการถอน (SPD-DEC-004)](docs/decisions/DECISION-004-current-fundraising-offer-and-terms.md)** · [ร่าง Term Sheet (SPD-INV-003)](docs/investor-review/CONVERTIBLE-LOAN-TERM-SHEET-DRAFT.md) · [ข้อความสไลด์ v1.1 (SPD-INV-004)](docs/investor-review/DECK-V1.1-SLIDE-TEXT.md) · [โมเดลนักลงทุน v1.1](docs/investor-review/models/SPADA-DOC-FUND-003-v1.1-investor-model.xlsx)
- [โมเดลเศรษฐกิจ doc 100 (SPD-DEC-003, อนุมัติทางเลือก A แล้ว C)](docs/decisions/DECISION-MEMO-003-economic-model-reconciliation.md)
- [ข้อเสนอ PROP-0001..0010](docs/proposals/README.md)

หมายเหตุ: ระบบจริงและ ADR ต้นฉบับอยู่ใน `chatchailim/spada-monorepo` (private) เอกสารในนี้เป็นสรุปเพื่อชี้ทาง เอกสารส่วนใหญ่ไม่ได้รันโค้ด ยกเว้น SPD-ARC-002 ที่รันเทสต์ของ 3 โปรเจกต์แล้ว (ดูข้อจำกัดในเอกสาร)
