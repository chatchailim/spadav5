# สถานะสถาปัตยกรรมปัจจุบัน SPADA + OneManOS SetBox

> รวบรวมจาก `spada-monorepo` @ `206d1f9` (merge PR #92, 2026-09-29), `onemanos-setbox` @ `20471f6` (2026-09-22), `onemanos` @ `321490e` (snapshot 2026-07-23) และประวัติ session ก่อนหน้า
> วันที่รวบรวม: 2026-09-29 · ปรับเป็น v0.3 · เอกสารนี้เป็น **สรุปเพื่อชี้ทาง** ไม่ใช่ต้นฉบับ ให้ยึดไฟล์ต้นทางที่อ้างถึงเป็นหลักเสมอ

## 1. ขอบเขตของการตรวจ (โปร่งใสว่าอ่านอะไร/ไม่ได้อ่านอะไร)

| แหล่ง | สถานะ |
|---|---|
| `spada-monorepo`: README, project-management, `architecture/`, ADR 0005–0008, 0012, 0014–0027 (ส่วนสถานะ/บริบท/คำตัดสิน), AGENT_NOTES (ส่วนท้าย), AGENT_HANDOFF | อ่านแล้ว |
| doc 335 (AI-Adversary Hardening) ถึง D3, doc 189 (Actual Status), doc 100 (Revenue Model: ส่วนสรุป รายได้ operator ตารางค่าธรรมเนียม), doc 247 (Member Value), doc 263 (OPB OS) ส่วนต้น | อ่านแล้ว บางส่วน |
| บริการ `data-share-broker`, `reclaim-connect` (README) และรายชื่อไฟล์ของ `finance`, `metering`, `billing`, `payment-adapter` | อ่าน README/รายชื่อไฟล์ ไม่ได้อ่านโค้ด |
| `onemanos-setbox`: README, ROADMAP, ผลตรวจความพร้อม 2026-09-06, หัวไฟล์ handover | อ่านแล้ว |
| `onemanos`: README ส่วนต้น และรายชื่อไฟล์ | อ่านเล็กน้อย |
| ADR 0001–0004, 0009–0011, 0013 และเนื้อหาเต็มของ ADR ทุกฉบับ · doc 340–345 · SAMTF (219) · Security Whitepaper | ยังไม่ได้อ่านละเอียด |
| โค้ดใน `services/`, `packages/`, `modules/` และซอร์สเครื่องมือเตรียมเครื่อง C# ของ SetBox | **ไม่ได้อ่าน/ไม่พบใน repo ที่โคลน** ไม่ได้รันเทสต์ใดเลย |
| Google Drive (พบรายการที่เกี่ยวข้อง) · repo `spada-specs`, `ai-platform-kit` | ยังไม่ได้อ่าน |
| ประวัติแชตของ session Opus 5.5 | ไม่มีเครื่องมืออ่านบทสนทนา ได้เพียง metadata และผลงานที่ลง repo |

ดังนั้นข้อความที่ระบุว่า "มี service X" หมายถึงพบโฟลเดอร์หรือไฟล์ ไม่ได้แปลว่าตรวจแล้วว่าทำงานครบตามสเปก

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
| doc 335: กฎเหล็กข้อ 8 (Entropy Integrity) และข้อ 9 (แยก instruction/data ของ MyAI) | Proposed ยังไม่บังคับใช้ (D2.1 Accepted แล้ว: L5 อิสระเฉพาะ operation ที่ย้อนกลับได้) |
| SetBox ผลตรวจ 2026-09-06 = CONDITIONAL (P1 สี่ข้อ) | ไม่ทราบสถานะการแก้ ต้องยืนยันก่อนส่งมอบลูกค้าจริง |
| doc 100 ขัดกับ ADR 0012 | ต้อง reconcile (ดู GAP-ANALYSIS ข้อ 3) |
| `spada-onevault-community` เป็น public ตั้งแต่ 1 ส.ค. | Lead ตัดสิน 2026-09-22 ว่าคงเดิม ไม่ต้องตรวจเทียบสิทธิบัตร |

หมายเหตุ: `AGENT_HANDOFF.md` ระบุเองว่าเป็น snapshot อัตโนมัติ ไม่ใช่ ground truth ให้ตรวจ `AGENT_NOTES.md` ก่อนลงมือ

## 8. Roadmap/Milestone ของระบบจริง

- Phase 0 Foundation → 1 Core Contracts → 2 MVP Node → 3 Federation (`project-management/roadmap.md`)
- M0 Repository Foundation, M1 Layer Contracts, M2 Community Pilot (5 จาก 8 บริการพื้นฐาน), M3 Node Federation (สอง node แลกเปลี่ยนบันทึกได้) และ M4 (WO-J, mTLS) (`milestones.md`, AGENT_NOTES)
- ความเสี่ยงที่ทีมลงทะเบียนไว้: R-005 การอ้างความพร้อมของ node เกินจริง, R-006 CI ผ่านเชิงโครงสร้างแต่ไม่ผ่านรันไทม์ (`risk-register.md`)

## 9. OneManOS SetBox (repo `onemanos-setbox` และ `onemanos`)

- **คืออะไร**: คลังเอกสารและเครื่องยนต์ธุรกิจของกิจการเดียว ทำงานบนเครื่องเดียว ไม่ต้องต่ออินเทอร์เน็ต ไม่มี dependency ภายนอก (ต้องการเพียง Node.js 22+) ข้อมูลอยู่ในไฟล์เดียวที่เจ้าของหยิบไปได้
- **ขอบเขต**: `business-api.js` 171 เส้นทาง (ขาย ซื้อ สต็อก บัญชี ภาษี เงินเดือน), โมดูลภาษีไทย (`vat-return.js`, `salary-withholding.js`, `allowance-declaration.js` แบบ ล.ย.01), `onevault-mcp` ให้ AI agent ใช้เครื่องมือที่กำหนด 25 ตัว, `setup/` ติดตั้ง/ดูแล/ตรวจก่อนส่งมอบ
- **หลักการที่บังคับที่โค้ด**: Human Gate (`human-gate.js` ปฏิเสธชื่อบัญชี agent), การสำรองต้องซ้อมกู้คืนอัตโนมัติ (`onemanos-care.js`), คำเตือนไม่มีปุ่มปิด, ตรวจก่อนส่งมอบ H1–H7 ("เครื่องนี้เป็นของเขาแล้วจริงหรือยัง")
- **สถานะ**: ROADMAP แยกสองเส้นทาง: (ก) ขายเป็นบริการ (ยังขาด: ส่งมอบลูกค้านอกกิจการผู้พัฒนา ≥ 1 ราย, ตัวเลขจริงในเอกสารเชิงพาณิชย์, รอบดูแลจริง 1 ไตรมาส) (ข) เปิดสาธารณะ (ยังขาด: เจ้าของยืนยันสิทธิบัตร/เครื่องหมายการค้า, ผู้ดูแลโครงการ, branch protection, สแกนประวัติ git)
- **ผลตรวจ 2026-09-06**: **CONDITIONAL** ใช้ซ้อมด้วยข้อมูลสังเคราะห์เท่านั้น ยังไม่รับรองเป็นชุดมาตรฐานสำหรับลูกค้าจริง พบ P1 สี่ข้อในเครื่องมือเตรียมเครื่อง C# (signature/manifest ไม่ fail-closed, export ไม่บังคับ preflight, ผล encryption/release PASS เกินหลักฐาน, network policy ปฏิเสธแล้วยังเชื่อมต่อ) และ P2 อีกหลายข้อ · **ยังไม่ทราบว่าแก้แล้วหรือไม่**
- `onemanos` (snapshot 2026-07-23): โปรเจกต์ TypeScript (`src/`, `runbooks/`, `work-orders/`) มี Physical Worker Fleet (Windows/Linux slot PC1..PCn), Governed Installation Control Plane, Digital Twin e-bike (ข้อมูลสังเคราะห์) · README ระบุว่า Windows PC1 ตรวจกับเครื่องจริงแล้ว ส่วน Linux ผ่านเพียง contract test

## 10. เอกสารเศรษฐกิจและสถานะโครงการที่ขัดกัน (สรุป)

- **doc 189 (Actual Status SSoT)** ทะเบียนความขัดแย้ง: MVP 100% vs 20%, patents 73 vs filing 50%, ทีม 23 คน vs 40%, Series A readiness 91 vs 72%, **user/LOI = 0**, Financial Model 0%, BookChain 65/100, MyAI 60/100 (ณ พ.ค.–มิ.ย. 2569 ตัวเลขอาจเปลี่ยนแล้ว)
- **doc 100 (Revenue Model, ม.ค. 2569)**: smart contract เก็บค่าธรรมเนียม, treasury, โทเคน + staking 2% APY, DAO กำหนดค่าธรรมเนียม, operator ได้ 40% ของทุกค่าธรรมเนียม, ตลาดข้อมูล anonymized 15%, ประมาณการผู้ใช้ 100K→100M และ break-even ปีที่ 3 · **ขัดกับ ADR 0012** และควร reconcile (ดู [GAP-ANALYSIS](GAP-ANALYSIS.md) ข้อ 3)
- **doc 247 (Member Value Catalog)**: สมาชิกเป็นเจ้าของตัวตน ข้อมูล และ AI · บริการ 🟢 ใน MVP มีเพียง Identity, PersonSpace (stub), TrustScore ส่วน 🟡 เป็น roadmap ห้ามสัญญาเป็นของวันแรก
- **doc 263 (One Person Business OS)**: รวมแนวคิด OMC→OPB ระบุเองว่าเป็น concept SSoT ไม่ใช่หลักฐานว่าระบบรันได้

## 11. เอกสารอื่นที่พบ (ยังไม่ได้อ่านเนื้อหา)

- ใน monorepo: SPADA-STD-NET-001 (topology), SPADA-Security-Privacy-Whitepaper.docx, SPADA-Community-Node-Governance-v1.1.docx, SPADA-Roadmap-MVP-to-ASEAN.docx, ไดอะแกรม node-network `.svg` (ฉบับ current: `spada-node-network-circle-mesh-current.svg`, `...role-hierarchy.svg`)
- ใน Google Drive: SPADA Node Network Topology Diagram (v5.1 SAMTF).png, คู่มือสถาปัตยกรรมและการรวมระบบอธิปไตยดิจิทัล (SPADA Framework & Data Vault Patent Suite).docx, SPADA-OneVault-Prototype-Demo-and-Test-Guide (.pdf/.docx/.md), โน้ต Gemini เรื่อง onemanos (2026-09-10)
- Artifact เดโม: "เส้นทางเดโม SPADA" (`https://claude.ai/artifact/S4BdT8mMjSXEJVmneMp7by`)
