# PROP-0006: Node roles, consensus และ governance

- สถานะ: Mostly covered — ต้องยืนยันเพดาน 1/3 และ Sybil
- วันที่: 2026-09-29
- ระยะ: P1
- ผู้ตัดสินใจ: (รอกำหนด)

> **เทียบกับระบบจริง (monorepo `spada-monorepo` @ `206d1f9`, 2026-09-29):** ADR 0005 (Hybrid Sovereign Federation, §15 กันการยึดระบบ), ADR 0008, ADR 0025 (Home Node + pointer directory สำหรับ >100 ล้านสมาชิก), `services/federation-gateway` (WO-J N1–N4 + mTLS merge แล้ว), รายงาน BookChain CometBFT probe ใน `reports/`
> ข้อเสนอนี้ร่างก่อนเห็นระบบจริง เนื้อหาด้านล่างคงไว้เป็นบันทึกตั้งต้น ให้ยึด ADR จริงเป็นหลัก ดู [CURRENT-STATE](../CURRENT-STATE.md) และ [GAP-ANALYSIS](../GAP-ANALYSIS.md)

## บริบท
เครือข่ายต้องตรวจสอบย้อนหลังได้และไม่ถูกยึดโดยผู้เล่นรายเดียว

## ทางเลือกที่พิจารณา
1. Node เดียวบทบาท ตัดสินโดยผู้ดูแล
2. แยก Validator/Witness/Relay + BFT + transparency log + จำกัดสัดส่วน

## การตัดสินใจ (ข้อเสนอ)
เลือกข้อ 2: Validator รวมข้อตกลง (BFT), Witness ตรวจและลงนาม checkpoint ของ Merkle log, Relay ส่งต่อ ไม่มีผู้ควบคุมเกิน 1/3; เปลี่ยนโปรโตคอลผ่านการลงคะแนนพร้อม time-lock

## ผลที่ตามมา
ข้อดี: ทนต่อ node ผิดปกติ ตรวจสอบได้ ข้อเสีย: ความซับซ้อนสูง ต้องมีวิธีพิสูจน์ความเป็นอิสระของ node (Sybil/collusion)

## เกณฑ์ตรวจรับ
- ไม่มีผู้ควบคุม node เกิน 1/3 (วัดได้)
- ทดสอบความผิดพลาด/ไม่ซื่อสัตย์ในสัดส่วนที่ออกแบบ
- เปลี่ยนโปรโตคอลผ่านการลงคะแนนจริงอย่างน้อย 1 ครั้ง (P3)

## คำถามที่ยังเปิดอยู่
- ใครมีสิทธิ์เป็น node/ลงคะแนน
- ความสัมพันธ์กับกฎหมายและผู้กำกับดูแล

อ้างอิง: [Roadmap](../ARCHITECTURE-ROADMAP.md), [Gap Analysis](../GAP-ANALYSIS.md)
