# Gap Analysis: สถาปัตยกรรมปัจจุบัน vs เป้าหมายใน Roadmap

> สถานะ: ร่าง v0.1 · 2026-09-29
> **ข้อจำกัดสำคัญ**: repo นี้ยังไม่มีเอกสารหรือโค้ดของสถาปัตยกรรมปัจจุบัน คอลัมน์ "สถานะปัจจุบัน" จึงเป็น **"ต้องยืนยัน"** ทั้งหมด ยกเว้นข้อที่ทราบจากบริบทและระบุที่มาไว้ ห้ามใช้ตารางนี้เป็นข้อสรุปจนกว่าทีมกรอกสถานะจริง

## วิธีใช้
1. ทีมเจ้าของระบบกรอกคอลัมน์ "สถานะปัจจุบัน" พร้อมหลักฐาน (ลิงก์เอกสาร/โค้ด)
2. ประเมิน Gap: **None / Partial / Full / Unknown**
3. ปรับลำดับความสำคัญ แล้วอัปเดตสถานะของ ADR ที่เกี่ยวข้อง

## ตาราง Gap

| # | หัวข้อ | เป้าหมาย (Roadmap) | สถานะปัจจุบัน | Gap | ความสำคัญ | ระยะ | ADR |
|---|---|---|---|---|---|---|---|
| 1 | Constitution + Threat model | เผยแพร่หลักการและ threat model | ต้องยืนยัน | Unknown | สูงมาก | P0 | [0001](adr/0001-constitution-and-threat-model.md) |
| 2 | Identity (DID/VC + KeySign) | DID, VC, ZK selective disclosure | มี KeySign (SPADA Personal Key Token บน RP2350, ทะเบียน append-only) ตามบริบท; DID/VC ต้องยืนยัน | Partial? | สูงมาก | P0–P1 | [0002](adr/0002-identity-did-vc-keysign.md) |
| 3 | Consent Ledger | บันทึกและเพิกถอน consent ตามวัตถุประสงค์ | ต้องยืนยัน | Unknown | สูงมาก | P0 | [0003](adr/0003-consent-ledger.md) |
| 4 | Personal Data Vault (OPOF) | แฟ้มรายบุคคล พิสูจน์ไม่มีข้อมูลข้ามเจ้าของ | มีแนวคิด OPOF/OneVault ตามบริบท; ระดับการ implement ต้องยืนยัน | Partial? | สูงมาก | P0 | [0004](adr/0004-personal-data-vault-opof.md) |
| 5 | Key recovery | Shamir social recovery + time-lock | ต้องยืนยัน | Unknown | สูง | P1 | [0005](adr/0005-social-key-recovery.md) |
| 6 | Node roles + consensus + governance | Validator/Witness/Relay, BFT, จำกัด 1/3 | ต้องยืนยัน | Unknown | สูง | P1 | [0006](adr/0006-node-roles-consensus-governance.md) |
| 7 | Personal AI Agent + sandbox | on-device, capability-based, human-in-the-loop | ต้องยืนยัน | Unknown | สูง | P1–P2 | [0007](adr/0007-personal-agent-and-sandbox.md) |
| 8 | Marketplace + data dividend + payments | escrow, dispute, dividend, gateway | ต้องยืนยัน | Unknown | กลาง | P2 | [0008](adr/0008-digital-economy-layer.md) |
| 9 | Resilience (offline/mesh) | store-and-forward, mesh | ต้องยืนยัน | Unknown | กลาง | P2 | [0009](adr/0009-offline-and-mesh-resilience.md) |
| 10 | Open standards + exit | W3C/ISO 20022, export/exit ครบ | ต้องยืนยัน | Unknown | สูง | P0–P2 | [0010](adr/0010-open-standards-and-exit.md) |

## ข้อสังเกตเชิงลำดับ
- ข้อ 1–4 เป็นรากฐาน ควรจบก่อนเริ่มข้อ 8
- ข้อ 10 ต้องกำหนดตั้งแต่ P0 เพราะกระทบทุกข้อ

## คำถามที่ต้องตอบก่อนสรุป Gap
1. เอกสาร/โค้ดสถาปัตยกรรม SPADA Node/Network และ OneManOS SetBox ปัจจุบันอยู่ที่ไหน
2. Node ปัจจุบันมีกี่บทบาท ใช้ consensus แบบใด
3. ข้อมูลผู้ใช้เก็บที่ใด ใครถือกุญแจถอดรหัส
4. มีข้อกำหนดกฎหมายที่บังคับแล้วหรือไม่ (PDPA, ภาคการเงิน)
