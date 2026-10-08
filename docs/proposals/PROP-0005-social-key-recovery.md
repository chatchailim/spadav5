# PROP-0005: Social key recovery

- สถานะ: Covered (D+C) — เหลือเรื่องทายาท/ผู้พิทักษ์ที่รอ Lead
- วันที่: 2026-09-29
- ระยะ: P1
- ผู้ตัดสินใจ: (รอกำหนด)

> **เทียบกับระบบจริง (อัปเดต v0.3, 2026-09-29):** ADR 0005 §9 กำหนด threshold identity recovery, ไม่ reconstruct key เดิม, anti-collusion delay, revoke key เก่า, re-wrap data keys, challenge/appeal window และ emergency freeze เมื่อสงสัยการบีบบังคับ · `recovery-service`, `digital-will-service`, ADR 0019 · มี `tests/unit/place-recovery-r1.test.ts` · การแยกทายาท/ผู้พิทักษ์และผลประโยชน์ทับซ้อนรอ Lead
> ข้อเสนอนี้ร่างก่อนเห็นระบบจริง เนื้อหาด้านล่างคงไว้เป็นบันทึกตั้งต้น ให้ยึด ADR จริงเป็นหลัก ดู [CURRENT-STATE](../CURRENT-STATE.md) และ [GAP-ANALYSIS](../GAP-ANALYSIS.md)

## บริบท
การสูญหายของอุปกรณ์/กุญแจไม่ควรทำให้ผู้ใช้สูญทรัพย์สินหรือตัวตน และไม่ควรมีผู้ให้บริการรายเดียวกู้ได้ตามใจ

## ทางเลือกที่พิจารณา
1. ไม่มี recovery (ปลอดภัยแต่เสี่ยงสูญถาวร)
2. Custodial recovery
3. Shamir k-of-n (เช่น 3-of-5) + time-lock + dead-man switch

## การตัดสินใจ (ข้อเสนอ)
เลือกข้อ 3: แบ่งชิ้นส่วนให้ผู้ไว้ใจ (ญาติ เพื่อน สถาบัน) การกู้มี time-lock ให้เจ้าของคัดค้านได้ และรองรับมรดกดิจิทัลผ่าน dead-man switch

## ผลที่ตามมา
ข้อดี: ไม่มีจุดล้มเหลวเดียว ข้อเสีย: ผู้ใช้ต้องจัดการผู้ไว้ใจ เสี่ยง collusion และ social engineering ต้องมี UX ที่ทดสอบกับผู้ใช้จริง

## เกณฑ์ตรวจรับ
- ทดสอบกู้กุญแจกับผู้ใช้จริงใน pilot ตามเป้าที่ตกลง
- ผู้ไว้ใจต่ำกว่า k ชิ้นกู้ไม่ได้
- การกู้ที่ไม่ชอบถูกคัดค้านได้ภายใน time-lock

## คำถามที่ยังเปิดอยู่
- ค่า k/n และ time-lock ที่เหมาะสม
- ผู้ใช้ที่ไม่มีผู้ไว้ใจทำอย่างไร

อ้างอิง: [Roadmap](../ARCHITECTURE-ROADMAP.md), [Gap Analysis](../GAP-ANALYSIS.md)
