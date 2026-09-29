# PROP-0002: Identity: DID/VC ร่วมกับ KeySign

- สถานะ: Mostly covered — เหลือ ZK selective disclosure (ต้องยืนยัน)
- วันที่: 2026-09-29
- ระยะ: P0–P1
- ผู้ตัดสินใจ: (รอกำหนด)

> **เทียบกับระบบจริง (monorepo `spada-monorepo` @ `206d1f9`, 2026-09-29):** ADR 0008 (DID เป็น canonical address), 0009 (DID type registry), 0015 (deviceAssurance), 0022 (รหัสท้องถิ่น OneVault + ผูก DID ผ่าน OIDC), 0023 (OIDC provider `id.spada.network`) · services `identity-service`, `oidc-provider-service` · KeySign มี firmware guide (doc 345)
> ข้อเสนอนี้ร่างก่อนเห็นระบบจริง เนื้อหาด้านล่างคงไว้เป็นบันทึกตั้งต้น ให้ยึด ADR จริงเป็นหลัก ดู [CURRENT-STATE](../CURRENT-STATE.md) และ [GAP-ANALYSIS](../GAP-ANALYSIS.md)

## บริบท
KeySign (Personal Key Token บน RP2350) ให้การยืนยันด้วยฮาร์ดแวร์ ต้องเชื่อมกับตัวตนที่พกพาได้และไม่รวมโปรไฟล์ข้ามบริบท

## ทางเลือกที่พิจารณา
1. ตัวตนแบบรวมศูนย์ผูกผู้ให้บริการ
2. DID + Verifiable Credentials โดย KeySign เป็น root of trust
3. ข้อ 2 + ZK selective disclosure

## การตัดสินใจ (ข้อเสนอ)
เลือกข้อ 3 แบบทยอย: P0 ทำ DID/VC บน KeySign และหลาย persona; P1 เพิ่ม ZK proof (เช่น พิสูจน์อายุหรือคุณสมบัติโดยไม่เปิดข้อมูล) ใช้มาตรฐาน W3C DID/VC

## ผลที่ตามมา
ข้อดี: ป้องกันการสอดแนมและ lock-in ข้อเสีย: ZK เพิ่มความซับซ้อนและต้นทุนคำนวณบนอุปกรณ์จำกัด ต้องประเมินความเหมาะกับ RP2350 หรือใช้คำนวณนอกอุปกรณ์

## เกณฑ์ตรวจรับ
- ออก/ตรวจ VC ได้จริงกับ KeySign
- persona สองบริบทเชื่อมโยงกันไม่ได้โดยผู้สังเกตภายนอก
- ผ่านการทบทวนการเข้ารหัสจากผู้เชี่ยวชาญ

## คำถามที่ยังเปิดอยู่
- DID method ใด
- ZK คำนวณที่ใด
- ขั้นตอนเมื่อกุญแจอุปกรณ์ถูกเพิกถอน (ดู PROP-0005)

อ้างอิง: [Roadmap](../ARCHITECTURE-ROADMAP.md), [Gap Analysis](../GAP-ANALYSIS.md)
