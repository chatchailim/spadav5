# สถานะสถาปัตยกรรมปัจจุบัน SPADA + OneManOS SetBox

> รวบรวมจาก `chatchailim/spada-monorepo` (private) ที่ commit `206d1f9` (merge PR #92, 2026-09-29) และประวัติ session ก่อนหน้า
> วันที่รวบรวม: 2026-09-29 · เอกสารนี้เป็น **สรุปเพื่อชี้ทาง** ไม่ใช่ต้นฉบับ ให้ยึดไฟล์ต้นทางที่อ้างถึงเป็นหลักเสมอ

## 1. ขอบเขตของการตรวจ (โปร่งใสว่าอ่านอะไร/ไม่ได้อ่านอะไร)

| แหล่ง | สถานะ |
|---|---|
| `spada-monorepo` ระดับโครงสร้าง, README, project-management, `architecture/`, หัวข้อของ ADR 0005–0027 (อ่านส่วนสถานะ/บริบท/คำตัดสิน) | อ่านแล้ว |
| `AGENT_NOTES.md` (ส่วนท้าย ประมาณ 90 บรรทัดล่าสุด) และ `AGENT_HANDOFF.md` | อ่านแล้ว |
| ADR 0001–0004, 0007, 0009–0011, 0013 และเนื้อหาเต็มของ ADR ทุกฉบับ | ยังไม่ได้อ่านละเอียด |
| โค้ดใน `services/`, `packages/`, `modules/` | **ยังไม่ได้อ่าน** ตรวจเพียงรายชื่อโฟลเดอร์และค้นคำสำคัญ |
| เอกสาร `docs/` (741 ไฟล์ .md) รวมถึง `.docx` ที่ราก repo | ยังไม่ได้อ่าน |
| Google Drive (พบ PDF/DOCX/PNG/โฟลเดอร์ที่เกี่ยวข้องหลายรายการ) | ค้นเจอรายชื่อ ยังไม่ได้อ่านเนื้อหา |
| repo `onemanos-setbox`, `OneManOS`, `spada-specs`, `ai-platform-kit`, `spada-onevault-community` | ยังไม่ได้เข้าถึง |
| ประวัติแชตของ session Opus 5.5 (`session_01YDpVPfbsSAAoLpbubGscCt`) | ไม่มีเครื่องมืออ่านบทสนทนา ใช้ได้เพียง metadata และผลงานที่ลงใน repo |

ดังนั้นข้อความในเอกสารนี้ที่ระบุว่า "มี service X" หมายถึงพบโฟลเดอร์ ไม่ได้แปลว่าตรวจแล้วว่าทำงานครบตามสเปก

## 2. โครงสร้างหลัก

- **5 ชั้นของ SPADA**: Place (ตัวตน/DID/สิทธิ์/consent) → Space (PersonSpace, WorkSpace, OfficeSpace) → Service → BookChain (บันทึกหลักฐาน append-only) → MyAI (`architecture/layers.md`)
- **5 Books** ของ BookChain: IdentityBook, TrustedBook, ServiceBook, EWalletBook, AIBook (ADR 0006)
- **OPOF/OMOF**: หนึ่งคนหนึ่งแฟ้ม / หนึ่งเรื่องหนึ่งแฟ้ม ไม่ทดแทนกัน (ADR 0006, 0007)
- **ขอบเขต SPADA ↔ OneManOS**: OneManOS, OneVault, SetBox, Human Gate และ Team Agent **อยู่นอก SPADA Node/Network** (ADR 0014, 0015, 0016) SPADA ให้บริการตัวตน/สิทธิ์/หลักฐาน ผ่าน OIDC และ client access surface
- **โทโพโลยี Node**: Hybrid Sovereign Federation, DID เป็น canonical address ส่วน tier/region เป็น attribute (ADR 0005, 0008, 0025)

## 3. ทะเบียน ADR (27 ฉบับ ใน `architecture/adr/`)

สถานะตามที่ระบุในหัวไฟล์ ณ วันที่รวบรวม

| ADR | เรื่อง | สถานะ |
|---|---|---|
| 0001 | บันทึกการตัดสินใจเชิงสถาปัตยกรรม | (ไม่ได้ตรวจสถานะ) |
| 0002–0004 | SPADAWallet contract v1.1 / TrustScore ฝั่ง server / referral binding / idempotency | (ไม่ได้ตรวจสถานะ) |
| 0005 | Sovereign Community Node Governance | Human Direction Recorded — safeguards รอ community ratification |
| 0006 | OPOF, OMOF, Five Books | Proposed for ratification |
| 0007 | OMOF/OPOF semantic equivalence | (ไม่ได้ตรวจสถานะ) |
| 0008 | Node addressing: DID เป็น canonical | Accepted (2026-08-26) |
| 0009 | DID type registry | (ไม่ได้ตรวจสถานะ) |
| 0010–0011 | Tier vocabulary / ลบหัวข้อ Web3 ใน naming guide | (ไม่ได้ตรวจสถานะ) |
| 0012 | External ledger/sidechain อยู่ที่ service layer เท่านั้น | Accepted (2026-08-26) |
| 0013 | Space taxonomy / OfficeSpace alias | (ไม่ได้ตรวจสถานะ) |
| 0014 | ขอบเขต SPADA ↔ OneManOS | Accepted (2026-08-26) |
| 0015 | Client access surface, deviceAssurance | Accepted (2026-08-30) |
| 0016 | Team Agent boundary | Accepted (2026-08-30) |
| 0017 | WorkPlace provisioning / ติดตั้ง SetBox | Accepted (2026-09-01) — **ห้ามเปิดค่า `APPLIANCE`** จนกว่า device attestation จบ |
| 0018 | Consent grantee เป็น discriminated union | Accepted (Cowork ลงนามแทน Lead) |
| 0019 | D4 สายผู้สืบทอด (Digital Will) | Accepted (Cowork ลงนามแทน Lead) |
| 0020 | รับรองรุ่น SetBox ด้วย EK certificate | Accepted (Cowork ลงนามแทน Lead) |
| 0021 | สัญญาร่วมข้ามโครงการ + canonical hash RFC 8785 (C2) | Accepted (2026-09-22) |
| 0022 | OneVault ใช้รหัสท้องถิ่น ผูก DID ภายหลังผ่าน OIDC (C1) | Accepted (2026-09-22) |
| 0023 | OIDC provider `https://id.spada.network` | Accepted (2026-09-26) |
| 0024 | Genesis ของ TrustScore | **Proposed** รอ Lead |
| 0025 | Home Node + Pointer Directory (>100 ล้านสมาชิก) | **Proposed** รอ Lead |
| 0026 | App model: Node App / Setbox App / Hybrid | **Proposed** รอ Lead |
| 0027 | Shared AI Host (DGX) แยกจาก node | Accepted (2026-09-28) |

ข้อสังเกต: ADR 0018–0020 อนุมัติโดย Cowork ภายใต้อำนาจที่ Lead มอบ ซึ่งระบุในไฟล์ว่า Lead กลับคำได้ทุกเมื่อ

## 4. บริการที่มีในโฟลเดอร์ `services/` (29 รายการ)

`api-gateway`, `identity-service`, `oidc-provider-service`, `consent-service`, `personspace-service`, `opof-service`, `member-service`, `recovery-service`, `digital-will-service`, `trust-score-service`, `ledger-anchor-service`, `federation-gateway`, `service-registry-service`, `service-subscription-service`, `data-share-broker-service`, `entitlement-service`, `finance-service`, `payment-adapter`, `billing-service`, `metering-service`, `shop-service`, `channel-hub-service`, `notification-service`, `support-service`, `journey-data-service`, `reclaim-connect-service`, `ai-host-gateway`, `myai-inference-service`

ข้อควรระวังจาก AGENT_NOTES: ณ 2026-09-22 **ยังไม่มี OIDC provider** ในโค้ด (ADR 0023 ตัดสินแล้ว เริ่ม K1/K2) โฟลเดอร์ `oidc-provider-service` พบแล้วแต่ยังไม่ได้ตรวจความครบถ้วน

## 5. สัญญาร่วมข้ามโครงการ (`architecture/contracts/`)

- **C1** subject-id (Accepted, ADR 0022): ระบบนอก SPADA ห้ามสร้าง `did:spada:*` ใช้ `onevault:<kind>:<id>` แล้วผูกด้วย `SubjectBinding` จาก OIDC
- **C2** fact-hash (Accepted, ADR 0021): `sha256:` + SHA-256 ของ JSON ตาม RFC 8785 มี test vectors และตัวอ้างอิง JS/Python
- **C3–C6**: ร่าง (ตามทะเบียน)

## 6. ฮาร์ดแวร์ SetBox และ KeySign

- ADR 0020 กำหนดเกณฑ์ผ่านคือ **EK certificate** ไม่ใช่ชนิด TPM และห้าม vTPM · เอกสารทะเบียนเครื่อง doc 344, ภาคผนวกเครือข่าย doc 342, คู่มือ firmware Personal Key Token doc 345
- 2026-09-13: firmware เซ็นจริง ตรวจครบ 12/12 และทำงานบนอุปกรณ์จริง (AGENT_NOTES)
- 2026-08-30: ส่ง RFQ แล้ว

## 7. งานที่ค้างและการตัดสินใจที่รอ Lead (จาก AGENT_NOTES/AGENT_HANDOFF)

| เรื่อง | สถานะที่พบ |
|---|---|
| **dTPM หรือ fTPM** | ค้าง 10–11 รอบ ต้องถามผู้ขาย SetBox เป็นลายลักษณ์อักษรก่อนรับใบเสนอราคา (D11) |
| **Road A**: rebuild pico-fido จากซอร์สด้วย board definition 2MB | รอ Lead |
| การแยกทายาท/ผู้พิทักษ์ + ผลประโยชน์ทับซ้อน + หน้าต่าง alive-check ของ D4 | รอ Lead |
| ADR 0024, 0025, 0026 | Proposed รอ Lead |
| WO-B2 ข้อ B2-b (ตาราง attestation ref), B2-c (prune claims), B2-e (ตัวนับความพยายาม) | เปิดอยู่ · ต้องเสร็จก่อนเปิด `APPLIANCE` |
| WO-N1 (agent key) | PR #92 merge แล้ว · session ก่อนหน้าสรุปว่าต้อง **ตั้งค่า N00-K ก่อน** agent จึงทำต่อได้ |
| `nextwaver.com` (ใช้ทดสอบ INET) | สำรวจ 13 ก.ค. ระบุหมดอายุ 2026-07-18 และ auto-renew ปิด ยังไม่ยืนยันสถานะล่าสุด |
| `spada-onevault-community` เป็น public ตั้งแต่ 1 ส.ค. | Lead ตัดสิน 2026-09-22 ว่าคงเดิม ไม่ต้องตรวจเทียบสิทธิบัตร |

หมายเหตุ: `AGENT_HANDOFF.md` ระบุเองว่าเป็น snapshot อัตโนมัติ ไม่ใช่ ground truth ให้ตรวจ `AGENT_NOTES.md` ก่อนลงมือ

## 8. Roadmap/Milestone ของระบบจริง

- Phase 0 Foundation → 1 Core Contracts → 2 MVP Node → 3 Federation (`project-management/roadmap.md`)
- M0 Repository Foundation, M1 Layer Contracts, M2 Community Pilot (5 จาก 8 บริการพื้นฐาน), M3 Node Federation (สอง node แลกเปลี่ยนบันทึกได้) และ M4 (WO-J, mTLS) (`milestones.md`, AGENT_NOTES)
- ความเสี่ยงที่ทีมลงทะเบียนไว้: R-005 การอ้างความพร้อมของ node เกินจริง, R-006 CI ผ่านเชิงโครงสร้างแต่ไม่ผ่านรันไทม์ (`risk-register.md`)

## 9. เอกสารอื่นที่พบ (ยังไม่ได้อ่านเนื้อหา)

- ใน monorepo: SPADA-STD-NET-001 (topology), SPADA-Security-Privacy-Whitepaper.docx, SPADA-Community-Node-Governance-v1.1.docx, SPADA-Roadmap-MVP-to-ASEAN.docx, ไดอะแกรม node-network `.svg` (ฉบับ current: `spada-node-network-circle-mesh-current.svg`, `...role-hierarchy.svg`)
- ใน Google Drive: SPADA Node Network Topology Diagram (v5.1 SAMTF).png, คู่มือสถาปัตยกรรมและการรวมระบบอธิปไตยดิจิทัล (SPADA Framework & Data Vault Patent Suite).docx, SPADA-OneVault-Prototype-Demo-and-Test-Guide (.pdf/.docx/.md), โน้ต Gemini เรื่อง onemanos (2026-09-10)
- Artifact เดโม: "เส้นทางเดโม SPADA" (`https://claude.ai/artifact/S4BdT8mMjSXEJVmneMp7by`)
