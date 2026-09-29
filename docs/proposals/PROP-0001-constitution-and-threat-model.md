# PROP-0001: Constitution และ Threat model

- สถานะ: Partially covered — เหลือ threat model รวมศูนย์
- วันที่: 2026-09-29
- ระยะ: P0
- ผู้ตัดสินใจ: (รอกำหนด)

> **เทียบกับระบบจริง (monorepo `spada-monorepo` @ `206d1f9`, 2026-09-29):** หลักการอธิปไตยและขอบเขตมีใน ADR 0005 (Sovereign Community Node Governance) และ ADR 0014 (ขอบเขต SPADA↔OneManOS) · ยังไม่พบ threat model รวมศูนย์ (`specs/security/README.md` เป็นหน้าสารบัญ) จึงเป็นช่องว่างที่ต้องยืนยัน
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
