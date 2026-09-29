# PROP-0001: Constitution และ Threat model

- สถานะ: Partially covered — doc 335 เป็น Proposed, ยังไม่ครอบคลุมทั้งระบบ
- วันที่: 2026-09-29
- ระยะ: P0
- ผู้ตัดสินใจ: (รอกำหนด)

> **เทียบกับระบบจริง (อัปเดต v0.3, 2026-09-29):** หลักการอยู่ใน ADR 0005/0014 · **doc 335 (AI-Adversary Hardening, Proposed)** ระบุ threat T1–T5 และ decision D1–D3 (entropy integrity, แยก instruction/data ของ MyAI, passphrase) · ยังขาด threat model รวม SetBox/KeySign/network และการยกกฎเหล็กข้อ 8–9 ให้เป็นทางการ
> ข้อเสนอนี้ร่างก่อนเห็นระบบจริง เนื้อหาด้านล่างคงไว้เป็นบันทึกตั้งต้น ให้ยึด ADR จริงเป็นหลัก ดู [CURRENT-STATE](../CURRENT-STATE.md) และ [GAP-ANALYSIS](../GAP-ANALYSIS.md)

## บริบท
ระบบที่ให้มนุษย์เป็นเจ้าของอำนาจต้องมีหลักการที่ผูกมัดการออกแบบ และรู้ว่ากำลังป้องกันใคร/อะไร

## ทางเลือกที่พิจารณา
1. ไม่มีเอกสารหลักการ ตัดสินตามรายฟีเจอร์
2. Constitution 5 ข้อ + threat model เผยแพร่สาธารณะ

## การตัดสินใจ (ข้อเสนอ)
เลือกข้อ 2: ใช้หลัก Human sovereignty, Verifiable not trusted, Graceful degradation, Least data, Inclusion by default; จัดทำ threat model (ผู้โจมตี ทรัพย์สิน ขอบเขตความเชื่อถือ) และทบทวนทุกครั้งที่เปลี่ยน ADR สำคัญ

## ผลที่ตามมา
ข้อดี: ตัดสินใจสอดคล้องกัน ตรวจสอบได้ ข้อเสีย: ใช้เวลาเพิ่มช่วงต้น และการเปิดเผย threat model ต้องระวังรายละเอียดที่เป็นช่องโหว่ปฏิบัติการ

## เกณฑ์ตรวจรับ
- เผยแพร่ Constitution และ threat model
- ผู้ทบทวนภายนอกอย่างน้อย 1 ราย
- ทุก ADR ใหม่อ้างอิงหลักการที่เกี่ยวข้อง

## คำถามที่ยังเปิดอยู่
- ระดับรายละเอียดที่เปิดเผยได้คือเท่าใด
- ใครเป็นเจ้าของการแก้ Constitution

อ้างอิง: [Roadmap](../ARCHITECTURE-ROADMAP.md), [Gap Analysis](../GAP-ANALYSIS.md)
