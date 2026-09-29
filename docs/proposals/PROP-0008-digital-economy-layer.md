# PROP-0008: Digital economy layer: marketplace, data dividend, payments

- สถานะ: Partially covered — data dividend เป็นช่องว่าง
- วันที่: 2026-09-29
- ระยะ: P2
- ผู้ตัดสินใจ: (รอกำหนด)

> **เทียบกับระบบจริง (monorepo `spada-monorepo` @ `206d1f9`, 2026-09-29):** ADR 0012 (external ledger/sidechain อยู่ที่ service layer), ADR 0026 (App model), ADR 0024 (TrustScore genesis) · services `finance-service`, `payment-adapter`, `shop-service`, `billing-service`, `metering-service` · data dividend พบเพียง 1 ไฟล์ที่กล่าวถึง (ต้องยืนยัน)
> ข้อเสนอนี้ร่างก่อนเห็นระบบจริง เนื้อหาด้านล่างคงไว้เป็นบันทึกตั้งต้น ให้ยึด ADR จริงเป็นหลัก ดู [CURRENT-STATE](../CURRENT-STATE.md) และ [GAP-ANALYSIS](../GAP-ANALYSIS.md)

## บริบท
ต้องการให้มูลค่าที่เกิดจากข้อมูลและแรงงานไหลกลับสู่เจ้าของ และให้ SME เข้าถึงตลาด/สินเชื่อจากประวัติที่พกพาได้

## ทางเลือกที่พิจารณา
1. แพลตฟอร์มปิดของผู้ให้บริการ
2. ตลาดเปิด + escrow + dispute resolution + data dividend + reputation พกพาได้ + public goods fund

## การตัดสินใจ (ข้อเสนอ)
เลือกข้อ 2 หลัง ADR 0002–0004 มั่นคง: เชื่อมชำระเงินผ่าน gateway (PromptPay/ISO 20022) ก่อนพิจารณา programmable money; แบ่งส่วนแบ่งอัตโนมัติจาก consent ledger; หักส่วนเล็กน้อยเข้ากองทุนสาธารณะ

## ผลที่ตามมา
ข้อดี: กระจายมูลค่า ลดผู้คุมประตู ข้อเสีย: ความเสี่ยงด้านกฎหมายการเงิน/ภาษี การฉ้อโกง และการตีมูลค่าข้อมูลที่ยาก ต้องปรึกษาผู้เชี่ยวชาญก่อนเริ่ม

## เกณฑ์ตรวจรับ
- ธุรกรรม offline สำเร็จตามเป้า
- ผ่าน audit อิสระ
- ผู้ใช้ export ตัวตน/ชื่อเสียง/ข้อมูลและย้ายออกได้ครบ

## คำถามที่ยังเปิดอยู่
- โมเดลตีมูลค่าและแบ่งส่วนแบ่งข้อมูล
- สถานะทางกฎหมายของ dividend และ token (ถ้ามี)

อ้างอิง: [Roadmap](../ARCHITECTURE-ROADMAP.md), [Gap Analysis](../GAP-ANALYSIS.md)
