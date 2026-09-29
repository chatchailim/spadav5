# Gap Analysis (ฉบับปรับปรุง v0.2): เป้าหมายใน Roadmap เทียบกับระบบจริง

> แทนที่ฉบับ v0.1 ซึ่งร่างโดยยังไม่เห็นระบบ · วันที่ 2026-09-29
> แหล่งข้อมูล: [CURRENT-STATE](CURRENT-STATE.md) (อ่านหัวข้อ ADR และรายชื่อ service ไม่ได้อ่านโค้ด)
> **ความหมายของสถานะ**: *Decided* = มี ADR ตัดสินแล้ว · *Present?* = พบ service/โฟลเดอร์ แต่ยังไม่ได้ตรวจโค้ด · *Gap?* = ไม่พบหลักฐานที่เกี่ยวข้องในสิ่งที่ตรวจ ยังต้องยืนยัน

## ข้อค้นพบหลัก

1. **ระบบจริงล้ำหน้าข้อเสนอเดิมของผมมาก** ข้อเสนอ 10 ข้อ ส่วนใหญ่มี ADR และ service รองรับแล้ว ผมจึงลดสถานะข้อเสนอเดิมเป็น PROP และให้ยึด ADR จริงเป็นหลัก
2. ช่องว่างที่แท้จริงเหลือน้อยและเจาะจง (ดูตารางข้อ B)
3. **ความเสี่ยงหลักคือการตัดสินใจที่ค้างและงานที่ยังไม่ปิด** ไม่ใช่การขาดแนวคิด (ดูข้อ C)

## A. เทียบข้อเสนอเดิมกับระบบจริง

| # | หัวข้อ | ระบบจริง | สถานะ | Gap ที่เหลือ | PROP |
|---|---|---|---|---|---|
| 1 | Constitution + Threat model | ADR 0005 (อธิปไตย, §15 กันการยึดระบบ), ADR 0014 (ขอบเขต) | Decided (หลักการ) | threat model รวมศูนย์ยังไม่พบ (`specs/security/README.md` เป็นสารบัญ) | [0001](proposals/PROP-0001-constitution-and-threat-model.md) |
| 2 | Identity | ADR 0008, 0009, 0015, 0022, 0023 · `identity-service`, `oidc-provider-service` | Decided + Present? | ZK selective disclosure ยังไม่ยืนยัน · OIDC provider ต้องตรวจว่าเสร็จถึงขั้นใด (K1/K2) | [0002](proposals/PROP-0002-identity-did-vc-keysign.md) |
| 3 | Consent | `consent-service`, ADR 0018, 0016 §3 | Present? | ตรวจ purpose/หมดอายุ/เพิกถอน และผลกับผู้รับข้อมูลแล้ว | [0003](proposals/PROP-0003-consent-ledger.md) |
| 4 | Vault/OPOF | ADR 0006, 0007, 0005 §13 · `opof-service`, `personspace-service` | Decided + Present? | ตัวตรวจ "ไม่มีข้อมูลข้ามเจ้าของ" อัตโนมัติ ต้องยืนยัน | [0004](proposals/PROP-0004-personal-data-vault-opof.md) |
| 5 | Key recovery | `recovery-service`, `digital-will-service`, ADR 0005 §9, 0019 | Present? | กลไก k-of-n/time-lock ยังไม่ยืนยัน · การแยกทายาท/ผู้พิทักษ์ **รอ Lead ตัดสิน** | [0005](proposals/PROP-0005-social-key-recovery.md) |
| 6 | Node/consensus/governance | ADR 0005, 0008, 0025 (Proposed) · `federation-gateway` (WO-J N1–N4 + mTLS) | Decided + Present? | เพดานสัดส่วน node รายเดียวและ Sybil ต้องยืนยัน · ADR 0025 รอ Lead | [0006](proposals/PROP-0006-node-roles-consensus-governance.md) |
| 7 | Agent/sandbox | ADR 0015, 0016, 0027 | Decided | ตรวจ kill switch และเกณฑ์ที่ต้องยืนยันด้วย KeySign ในโค้ด | [0007](proposals/PROP-0007-personal-agent-and-sandbox.md) |
| 8 | Digital economy | ADR 0012, 0024, 0026 · `finance-service`, `payment-adapter`, `shop-service`, `billing-service` | Partly | **data dividend** พบเพียง 1 ไฟล์ · ADR 0024, 0026 รอ Lead | [0008](proposals/PROP-0008-digital-economy-layer.md) |
| 9 | Offline/mesh | ยังไม่พบ ADR/service เฉพาะ (พบคำที่เกี่ยวข้อง 15 ไฟล์) | Gap? | ธุรกรรมออฟไลน์ วงเงิน การซิงก์ | [0009](proposals/PROP-0009-offline-and-mesh-resilience.md) |
| 10 | Open standards + exit | ADR 0021 (RFC 8785), ADR 0005 §4, §14 | Partly | **reproducible build/open hardware** ไม่พบ · sunset plan ไม่พบ | [0010](proposals/PROP-0010-open-standards-and-exit.md) |

## B. ช่องว่างที่แท้จริง (ควรลงมือ ตามลำดับความสำคัญ)

| ลำดับ | ช่องว่าง | เหตุผล | ก่อนเริ่มต้องทำ |
|---|---|---|---|
| 1 | Threat model รวมศูนย์ต่อ SPADA Node/Network + SetBox + KeySign | มี ADR หลายฉบับแต่ยังไม่พบเอกสารภัยคุกคามรวม ทั้งที่ทะเบียนความเสี่ยงระบุ R-005/R-006 | ค้น `docs/` และ Drive ยืนยันว่ายังไม่มีจริง |
| 2 | เกณฑ์ปลดล็อก `APPLIANCE` เป็นเอกสารเดียว | ตอนนี้กระจายใน ADR 0017/0020, WO-B2 (B2-b/c/e), เรื่อง dTPM/fTPM | รวบรวมเงื่อนไข ไม่ต้องตัดสินใจใหม่ |
| 3 | Offline/mesh resilience | ไม่พบการออกแบบ | อ่านเอกสาร topology/federation ก่อน |
| 4 | Data dividend และแบบจำลองมูลค่าข้อมูล | ไม่พบการออกแบบ และมีข้อกฎหมาย | ปรึกษาผู้เชี่ยวชาญก่อน |
| 5 | Reproducible build + sunset/exit plan | ไม่พบ ทั้งที่ ADR 0005 §14 ต้องการไม่ผูกขาด | ตัดสินขอบเขต (SetBox, KeySign, SPADA) |
| 6 | Crypto-agility / post-quantum และ duress | พบคำที่เกี่ยวข้องจำนวนมากแต่เป็นการค้นคำ ต้องอ่านว่าเป็นข้อกำหนดจริงหรือไม่ | ตรวจ specs/security และ Security Whitepaper |

## C. ประเด็นที่ควรจัดการก่อนเพิ่มฟีเจอร์ใหม่ (จาก AGENT_NOTES)

1. **ตัดสินใจที่ค้างของ Lead**: dTPM/fTPM (ค้าง 10–11 รอบ), Road A pico-fido, การแยกทายาท/ผู้พิทักษ์ (ADR 0019) และ ADR 0024–0026
2. **ปิด WO-B2 (B2-b, B2-c, B2-e)** ก่อนเปิด `APPLIANCE` ตาม ADR 0017
3. **N00-K** ต้องตั้งค่าก่อน agent จะทำ WO-N1 ต่อได้ (ตามสรุป session ก่อนหน้า)
4. **ADR ที่ Cowork ลงนามแทน Lead** (0018–0020) ควรให้ Lead ยืนยันย้อนหลังอย่างเป็นทางการ เพราะกระทบกลไกความปลอดภัยของ SetBox
5. **โดเมน `nextwaver.com`** อาจหมดอายุ ตรวจสถานะ เพราะ runbook INET ผูกกับชื่อนี้
6. **ADR 0005 ยัง "รอ community ratification"** และ ADR 0006 "Proposed" ทั้งที่เป็นรากของระบบ

## D. ข้อเสนอลำดับถัดไป

1. ให้ผู้ดูแลระบบยืนยันตาราง A (โดยเฉพาะแถว *Present?* และ *Gap?*) ผ่านการอ่านโค้ดและสเปก
2. เปิดงานเอกสารในช่องว่างข้อ 1–2 ก่อน เพราะไม่ต้องรอตัดสินใจใหม่
3. ปรับ [Roadmap](ARCHITECTURE-ROADMAP.md) ให้ผูกกับ M0–M4 ของระบบจริง แทน P0–P3 เดิม
4. ตรวจเอกสารที่ยังไม่ได้อ่าน (รายการใน CURRENT-STATE ข้อ 1 และ 9) แล้วอัปเดตเอกสารนี้เป็น v0.3
