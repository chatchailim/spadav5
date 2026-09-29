# PROP-0007: Personal AI Agent และ capability-based sandbox

- สถานะ: Covered — ใช้ ADR 0015/0016/0027 เป็นหลัก
- วันที่: 2026-09-29
- ระยะ: P1–P2
- ผู้ตัดสินใจ: (รอกำหนด)

> **เทียบกับระบบจริง (monorepo `spada-monorepo` @ `206d1f9`, 2026-09-29):** ADR 0016 (Team Agent เป็น relying party ภายนอก, human-in-the-loop เป็น UX ของ client, หลักฐานคือ actor assertion), ADR 0015 (device assurance), ADR 0027 (AI Host DGX แยกจาก node) · ข้อเสนอเรื่อง on-device และ capability ตรงกับทิศทางเดิม
> ข้อเสนอนี้ร่างก่อนเห็นระบบจริง เนื้อหาด้านล่างคงไว้เป็นบันทึกตั้งต้น ให้ยึด ADR จริงเป็นหลัก ดู [CURRENT-STATE](../CURRENT-STATE.md) และ [GAP-ANALYSIS](../GAP-ANALYSIS.md)

## บริบท
Agent ที่ทำงานแทนเจ้าของมีความเสี่ยงต่อการทำเกินสิทธิ์ ถูกชักจูง (prompt injection) หรือย้ายทรัพย์สินโดยไม่ตั้งใจ

## ทางเลือกที่พิจารณา
1. Agent บนคลาวด์ของผู้ให้บริการ สิทธิ์กว้าง
2. Agent on-device สิทธิ์ตาม capability + human-in-the-loop

## การตัดสินใจ (ข้อเสนอ)
เลือกข้อ 2: ไม่มีสิทธิ์เริ่มต้น ขอทีละ capability ตาม policy-as-code ของเจ้าของ ธุรกรรมเกินเกณฑ์ต้องยืนยันด้วย KeySign มี audit log และ kill switch; แอปภายนอกรันใน sandbox

## ผลที่ตามมา
ข้อดี: จำกัดความเสียหาย เจ้าของคุมได้ ข้อเสีย: ความสามารถโมเดลบนอุปกรณ์จำกัด อาจต้องเรียกโมเดลภายนอกซึ่งกระทบความเป็นส่วนตัว ต้องกำหนดขอบเขตข้อมูลที่ส่งออก

## เกณฑ์ตรวจรับ
- agent เกินสิทธิ์ไม่ได้ (ทดสอบแบบ red team รวม prompt injection)
- ธุรกรรมเกินเกณฑ์ไม่ผ่านโดยไม่มีการยืนยัน
- kill switch ตัดการทำงานได้ทันที

## คำถามที่ยังเปิดอยู่
- เกณฑ์มูลค่า/ความเสี่ยงที่ต้องยืนยัน
- นโยบายการเรียกโมเดลภายนอก

อ้างอิง: [Roadmap](../ARCHITECTURE-ROADMAP.md), [Gap Analysis](../GAP-ANALYSIS.md)
