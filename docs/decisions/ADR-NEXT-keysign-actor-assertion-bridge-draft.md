# ร่าง ADR: ตัวเชื่อม KeySign (PKT-v1) กับ SPADA actor assertion

- **รหัสเอกสาร: SPD-ADR-D05** · ร่างโดย Claude ตามที่ Lead อนุมัติให้ร่างตามทางเลือก 1 (2026-10-01) · **ร่าง ยังไม่ใช่การตัดสิน ยังไม่นำเข้า monorepo ยังไม่แก้โค้ดผลิตภัณฑ์**
- เลขที่เสนอ: ถัดจาก ADR ล่าสุดของ monorepo (ผู้ดูแลตรวจเลขที่ว่างก่อนนำเข้า)
- ที่มา: [SPD-REV-006](../work-orders/REVIEW-POO-WO-005-round5-2026-10-01.md) §3 · A6-lite ผ่านเฉพาะอุปกรณ์ → CLI
- สถานะ: **Lead ตอบ Q1–Q5 ตามข้อเสนอเริ่มต้นแล้ว (2026-10-01, ดู §6) · ยังเป็นร่าง รอผู้ดูแล monorepo นำเข้าและรับ** ยังไม่แก้โค้ดผลิตภัณฑ์ · ใบงานคู่กัน: [SPD-WO-008](../work-orders/WO-SPADA-KEYSIGN-ASSERTION-VERIFIER.md)

## 1. บริบท

KeySign เซ็นข้อความ PKT-v1 = `"SPADA-PKT-v1" ‖ 0x00 ‖ counter(4 BE) ‖ challenge(32) ‖ contextHash(32)` (81 ไบต์, Ed25519) ส่วน SPADA ตรวจลายเซ็นเหนือ `encodeSPADAActorAssertion` (`"SPADA-ACTOR-ASSERTION-V1"` + actor/device/request/route/payloadDigest/issuedAt/nonce/algorithm) กับ `signingPublicKey` ของ device record (`packages/auth/src/index.ts`, `service-device-manager.ts` @206d1f9) ไบต์ที่เซ็นต่างกัน จึงใช้ลายเซ็น KeySign เป็น actor assertion ตรง ๆ ไม่ได้

## 2. ข้อเสนอ (ทางเลือก 1: ผูกที่ฝั่ง host)

ไม่แก้เฟิร์มแวร์ ไม่แก้ `encodeSPADAActorAssertion` เดิม

1. host ประกอบ assertion ตามเดิมทุกฟิลด์ (actor, device, request, route, payloadDigest, issuedAt, nonce) โดยใช้ algorithm ใหม่ **`ed25519-pkt-v1`**
2. **`contextHash` = SHA-256 ของไบต์ที่ `encodeSPADAActorAssertion` คืน** (รวม algorithm และ payloadDigest) ลายเซ็นจึงผูกกับ actor, device, request, route, payloadDigest, เวลา และ nonce ครบ ไม่ใช่เฉพาะ payload ธุรกิจ และ `payloadDigest` ยังคำนวณจาก payload ด้วย canonicalization เดิม (ไม่ต้องเพิ่มรูปแบบ hash ใหม่)
3. host ส่งให้อุปกรณ์เซ็น: `challenge` + `contextHash` อุปกรณ์ตอบ `counter` + ลายเซ็น (มนุษย์กดปุ่มตามเดิม)
4. assertion ที่ส่งไป SPADA เพิ่มฟิลด์ `pkt = { counter, challenge }` (เฉพาะ algorithm ใหม่)
5. ตัวตรวจฝั่ง SPADA ทำตามลำดับ **ก่อนยอมรับ**: อุปกรณ์ ACTIVE และ algorithm ตรงกับ device record → ช่วงอายุ issuedAt → payloadDigest ตรง → ประกอบข้อความ PKT-v1 ใหม่จาก `counter`/`challenge`/SHA-256(assertion bytes) → ตรวจ Ed25519 กับ `signingPublicKey` → **counter ต้องมากกว่า counter ล่าสุดที่รับของอุปกรณ์นั้น** → claim nonce (กัน replay เดิม) → บันทึก counter ล่าสุดแบบ atomic เมื่อผ่านเท่านั้น
6. algorithm เดิมทุกตัว **พฤติกรรมเดิมไม่เปลี่ยน** (additive)

## 3. กฎที่ต้องคงไว้

| ข้อ | กฎ |
|---|---|
| 1 | ไม่แก้เฟิร์มแวร์ (PKT-R7 domain separation คงอยู่) ไม่ย้าย domain string |
| 2 | `deviceAssurance` สูงสุด `NATIVE` (PKT-R10) ห้ามเปิด `APPLIANCE` |
| 3 | ไม่แก้ Fact v0 และสัญญา C2 · ไม่ออก DID ให้ Team Agent (ADR 0016) |
| 4 | ไม่เปิดการเขียนหรืออนุมัติอัตโนมัติของเอเจนต์ (SPD-DEC-005 ข้อ 6) มนุษย์กดปุ่มเองทุกลายเซ็น |
| 5 | ตัวตรวจ **fail-closed**: ฟิลด์ขาด/ชนิดผิด/algorithm ไม่รู้จัก = ปฏิเสธ ไม่ถอยไปใช้ทางเดิม |
| 6 | การเพิกถอนกุญแจ/อุปกรณ์มีผลทันทีกับ assertion ใหม่ (อ่านสถานะ device ทุกครั้ง ไม่ cache ข้ามคำขอ) |

## 4. ผลกระทบและความเสี่ยง

- **สถานะ counter ต่ออุปกรณ์ฝั่ง SPADA** ต้องเพิ่ม (ไม่มีอยู่ตอนนี้) และต้อง atomic กับการ claim nonce; กรณีลายเซ็นถูกสร้างแล้วไม่ถูกส่ง counter จะมีช่องว่างได้ ซึ่งยอมรับ (ต้อง `>` ไม่ต้อง `+1`)
- **เซ็นแล้วนำไปใช้กับคำขออื่น:** กันโดยผูก requestId/routeId/nonce เข้า contextHash (ข้อ 2) และ nonce claim
- **reset อุปกรณ์ (FACTORY_RESET) ทำให้ counter กลับ:** อุปกรณ์เดิมที่ถูก reset ต้องถือเป็นอุปกรณ์ใหม่ (ออก device record ใหม่) ไม่ใช่ใช้ต่อ ต้องเขียนในใบงาน
- **ความสัมพันธ์ระหว่าง public key ของ KeySign กับ `signingPublicKey` ใน device record:** ต้องยืนยันว่าเป็นกุญแจเดียวกันและรูปแบบตรงกัน (ทดสอบในสไปก์ก่อนยอมรับ ADR)
- ลายเซ็นยืนยันเพียงว่า "อุปกรณ์นี้ถูกกดปุ่มกับ assertion นี้" ไม่ใช่เหตุผลขยาย `deviceAssurance` ไม่ใช่ attestation ของฮาร์ดแวร์
- ตัวตรวจใหม่อยู่ใน identity path จึงเป็นงานเสี่ยงสูง ต้องมี review ความปลอดภัยแยก

## 5. ทางเลือกที่ไม่เลือก

- **ทางเลือก 2 (เฟิร์มแวร์เซ็น assertion bytes ตรง ๆ):** ขัด PKT-R7 และเสี่ยงเฟิร์มแวร์
- **ทางเลือก 3 (session key):** ลดการผูกต่อคำขอ ไม่เหมาะกับการกระทำที่ย้อนไม่ได้ (ADR 0016 §7)

## 6. คำถามเปิดให้ Lead/ผู้ดูแลตัดสิน

| # | คำถาม | ข้อเสนอเริ่มต้น | ผล |
|---|---|---|---|
| Q1 | `challenge` มาจากไหน | host สร้างสุ่ม 32 ไบต์ต่อคำขอ แล้วส่งมากับ assertion (ไม่ต้องมี round-trip จาก SPADA) · ทางเลือก: SPADA ออก challenge ก่อน (ปลอดภัยกว่าแต่เพิ่ม round-trip) | **Lead ตัดสิน: ตามข้อเสนอเริ่มต้น** |
| Q2 | ใช้ชื่อ algorithm ใหม่ `ed25519-pkt-v1` หรือไม่ | ใช่ เพื่อแยกเส้นทางและ fail-closed | **Lead ตัดสิน: ตามข้อเสนอเริ่มต้น** |
| Q3 | ช่วงอายุ assertion สำหรับเส้นทางนี้ (มนุษย์ต้องกดปุ่ม) | ใช้ค่าเดิมของ `_maximumAssertionAgeMilliseconds` ก่อน ปรับเมื่อมีหลักฐานเวลาจริง | **Lead ตัดสิน: ตามข้อเสนอเริ่มต้น** |
| Q4 | การเพิ่ม counter ในที่เก็บ device record ต้องมี migration หรือไม่ | ให้ใบงานตรวจและเสนอ | **Lead ตัดสิน: ตามข้อเสนอเริ่มต้น** |
| Q5 | ต้องมีผู้ตรวจความปลอดภัยอิสระก่อน merge หรือไม่ | ใช่ (identity path) | **Lead ตัดสิน: ตามข้อเสนอเริ่มต้น** |

## 7. เกณฑ์ทดสอบ (สรุป รายละเอียดอยู่ในใบงาน)

แก้ข้อมูล (payload/route/request/actor/device/เวลา/nonce) · ใช้ซ้ำ (nonce เดิม, counter เดิมหรือต่ำกว่า) · เพิกถอนกุญแจ/อุปกรณ์ · algorithm ไม่ตรง device record · ฟิลด์ `pkt` ขาด/ผิดรูป · ลายเซ็นจากอุปกรณ์อื่น · counter ของอุปกรณ์จริงเพิ่มหลังเซ็น · algorithm เดิมทุกตัวผ่านชุดทดสอบเดิมโดยไม่เปลี่ยนผล
