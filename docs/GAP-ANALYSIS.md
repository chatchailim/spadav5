# Gap Analysis v0.4: เป้าหมายใน Roadmap เทียบกับระบบจริง

- **รหัสเอกสาร: SPD-GAP-001**

> แทนที่ v0.3 · วันที่ 2026-09-29 (รอบอ่านที่ 3: เพิ่ม doc 335 ทั้งฉบับ, doc 340–347, `spada-specs`, ตรวจ P5 ในโค้ด — ดูข้อ 7)
> แหล่งข้อมูล: `spada-monorepo` @ `206d1f9`, `onemanos-setbox` @ `20471f6`, `onemanos` @ `321490e`, `spada-specs` @ `f795a9d` · รายละเอียดใน [CURRENT-STATE](CURRENT-STATE.md)
> **ระดับหลักฐาน**: **D** = มี ADR/เอกสารตัดสินแล้ว · **C** = พบโค้ด/เทสต์ (ตรวจระดับโฟลเดอร์หรือคำสำคัญ ยังไม่ได้รันหรืออ่านทั้งหมด) · **?** = ไม่พบหลักฐาน ต้องยืนยัน
> ผมไม่ได้รันโค้ดหรือเทสต์ใดเลย ทุกสถานะเป็นการอ่านเอกสารและตรวจไฟล์

## 1. สิ่งที่แก้จาก v0.2 (ข้อสรุปเดิมที่ผิดหรือหลวม)

| ข้อสรุปใน v0.2 | ข้อเท็จจริงที่พบเพิ่ม | ผลต่อสถานะ |
|---|---|---|
| "ยังไม่พบ threat model รวมศูนย์" | มี **doc 335 (AI-Adversary Hardening)** ลงวันที่ 2026-08-05 สถานะ **Proposed** ระบุ threat T1–T5 (human-pattern modeling, OSINT, deepfake, AI code audit, agent prompt injection) และช่องว่าง G1–G5 พร้อม decision D1–D3 (entropy integrity, แยก instruction/data ของ MyAI, passphrase) | Gap ลดเหลือ "ยังเป็น Proposed ไม่เป็นกฎเหล็ก และยังไม่ครอบคลุม SetBox/network" |
| "กลไกกู้กุญแจ (k-of-n) ยังไม่ยืนยัน" | ADR 0005 §9 ระบุชัด: threshold identity recovery, ไม่ reconstruct key เดิม, anti-collusion delay, revoke key เก่า, re-wrap data keys, challenge/appeal window, **emergency freeze เมื่อสงสัยการบีบบังคับหรือ guardian ร่วมมือกัน** · มี `tests/unit/place-recovery-r1.test.ts` | ครอบคลุมทั้งข้อ recovery และ duress ในระดับ D+C |
| "Offline/mesh เป็น Gap" | ADR 0026 กำหนดว่า **Setbox App ใช้งานได้เมื่อเน็ตหลุดและส่งหลักฐานตามมาภายหลัง** และ SetBox ทำงานบนเครื่องเดียวไม่ต้องต่ออินเทอร์เน็ต ส่วนที่ยังไม่พบคือ mesh ระดับ node (LoRa/sneakernet) | แยกเป็น: SetBox offline = D+C · mesh ระดับ node = ? (ความสำคัญต่ำ) |
| "Data dividend พบ 1 ไฟล์" | พบเพียง whitepaper (doc 228) และ **doc 100 ขัดกับสถาปัตยกรรมจริง** (ดูข้อ 3) | ยกเป็นประเด็นเชิงนโยบาย ไม่ใช่แค่ช่องว่างเทคนิค |
| "Crypto-agility/post-quantum ต้องตรวจ" | มีสิทธิบัตรแนวคิด (doc 075 Quantum-Resistant Identity) และ doc 335 อ้างถึง quantum-safe primitives แต่ไม่พบ ADR หรือโค้ดที่ระบุการสลับอัลกอริทึม | ยังเป็น ? |
| "ZK selective disclosure" | พบ 10 ไฟล์ที่กล่าวถึง (สคริปต์เดโม, doc 325, tests recovery) ไม่พบ service เฉพาะ · มีสิทธิบัตรแนวคิด doc 072/080 | ยังเป็น ? |

## 2. ตารางเทียบข้อเสนอเดิม (10 หัวข้อ)

| # | หัวข้อ | หลักฐาน | ระดับ | Gap ที่เหลือ |
|---|---|---|---|---|
| 1 | Constitution + Threat model | ADR 0005, 0014 · **doc 335 (Proposed)** · ทะเบียนความเสี่ยง R-001..R-006 | D | ยกกฎเหล็กข้อ 8–9 จาก doc 335 ให้เป็นทางการ (D1 ยังไม่มีโค้ด) · threat model รวม SetBox/KeySign/network · `specs/security/README.md` ยังเป็นสารบัญ · ดูข้อ 7.1 |
| 2 | Identity | ADR 0008/0009/0015/0022/0023 · `identity-service`, `oidc-provider-service` | D+C | ZK ยังเป็น ? · ต้องตรวจว่า OIDC (K1/K2) เสร็จขั้นใด |
| 3 | Consent | `consent-service`, ADR 0018, `data-share-broker-service` (default-deny, scoped, time-boxed, revocable, ไม่ copy ถาวร) | D+C | Launch gate: DPIA + legal review ก่อนเปิดจริง (ระบุใน README ของ broker) |
| 4 | Vault/OPOF | ADR 0006/0007, ADR 0005 §13 (ลบข้อมูล/legal hold) · `opof-service` · SetBox ตรวจ H1–H7 "ข้อมูลเป็นของกิจการ" | D+C | ADR 0006 ยัง Proposed · ตัวตรวจ "ไม่มีข้อมูลข้ามเจ้าของ" ระดับ network ต้องยืนยัน |
| 5 | Key recovery + duress | ADR 0005 §9, 0019 · `recovery-service`, `digital-will-service` | D+C | การแยกทายาท/ผู้พิทักษ์ + ผลประโยชน์ทับซ้อนของ D4 **รอ Lead** |
| 6 | Node/consensus/governance | ADR 0005 (§14 ไม่ผูกขาดโดย Foundation, §15 กันรัฐ/องค์กรยึดระบบ), 0008, 0025 · `federation-gateway` (WO-J) · CometBFT probe | D+C | ADR 0025 (Home Node + pointer directory) รอ Lead · ขนาดที่ระบุ (30 GB/90 MB ต่อ node) "ยังไม่ได้วัด" ตามที่ ADR ระบุเอง |
| 7 | Agent/sandbox | ADR 0015/0016/0027, doc 335 D2 · SetBox `human-gate.js` ปฏิเสธชื่อบัญชี agent ที่ตัวโค้ด | D+C | doc 335 D2 (แยก instruction/data, irreversible ต้องมนุษย์ยืนยันทุกระดับ) ยัง Proposed ส่วน D2.1 (L5 = อิสระเฉพาะ reversible) **Accepted** แล้ว |
| 8 | Digital economy | ADR 0012, 0024 (Proposed), 0026 (Proposed) · `finance-service`, `billing-service`, `metering-service`, `payment-adapter`, `shop-service` | D+C แต่ **ขัดกัน** | ดูข้อ 3 |
| 9 | Offline/mesh | ADR 0026 (Setbox offline) | D | mesh ระดับ node = ? |
| 10 | Open standards + exit | ADR 0021 (RFC 8785 + test vectors), ADR 0026 (manifest ต้องมี `export`), SetBox no-dependency + handover H1–H7 | D+C | reproducible build ไม่พบ · sunset plan ไม่พบ · `spada-specs` ยังไม่มีสเปกเผยแพร่ (ข้อ 7.6) |

## 3. ข้อค้นพบใหม่ที่สำคัญที่สุด: เอกสารเศรษฐกิจขัดกับสถาปัตยกรรม

**doc 100 "Sustainable Economics & Revenue Model v5.0" (2026-01-02, ระบุว่า "Official - Authoritative")** อธิบายโมเดลที่ขัดกับ ADR ที่ตัดสินภายหลัง:

| doc 100 | ระบบจริง/ADR | ปัญหา |
|---|---|---|
| Smart contract เก็บค่าธรรมเนียม, treasury, staking 2% APY, โทเคน SPADA, DAO กำหนดค่าธรรมเนียม | **ADR 0012 (Accepted 2026-08-26)**: ความสามารถแบบ chain/โทเคนอยู่ที่ service layer เท่านั้น ไม่ใช่ Core · ตรวจโค้ดแล้ว **0 hit** สำหรับ sidechain/web3/token/nft/bridge | โมเดลรายได้ผูกกับกลไกที่ระบบตัดสินแล้วว่าไม่อยู่ใน Core และยังไม่มีโค้ด · โทเคนและ staking มีความเสี่ยงด้านกฎหมายหลักทรัพย์/สินทรัพย์ดิจิทัล ต้องปรึกษาผู้เชี่ยวชาญก่อน |
| ตลาดข้อมูล "Anonymized Data Insights" ค่าคอมมิชชัน 15% | `data-share-broker-service`: default-deny, ไม่ copy ข้อมูลถาวร, เจ้าของอนุมัติรายคำขอ · ADR 0005 §8 (ข้อมูลที่ห้ามออกนอกประเทศ) | ขายข้อมูลรวมแบบ anonymized เป็นคนละโมเดลกับ share-on-request และเสี่ยงต่อหลัก "แพลตฟอร์มขายต่อไม่ได้" ใน doc 247 |
| Node operator ได้ 40% ของค่าธรรมเนียมทุกประเภท + bonus + ตัวอย่างรายได้ ~฿32.8M/ปี, ROI 200%+ | ADR 0005: node เป็นผู้ให้บริการ/ผู้ดูแล ไม่เป็นเจ้าของสมาชิก · doc 189: **user/LOI = 0, MVP ~20%** | แรงจูงใจให้ node เก็บค่าธรรมเนียมสูงสุด ตัวเลขตัวอย่างไม่มีฐานข้อมูลจริง ห้ามใช้กับนักลงทุนตาม doc 189 |
| ประมาณการผู้ใช้ 100K (ปี 2569) ถึง 100M (ปี 2573), break-even ปี 3 | doc 189: 🔴 Financial Model 0%, Series A readiness 72% (ไม่ใช่ 91) | ต้องมีโมเดลการเงินที่ตรวจสอบได้ก่อนอ้างตัวเลข |
| ไฟล์ตัวเองเสียหายด้านการเข้ารหัสตัวอักษร (ภาษาไทยเป็นอักขระเพี้ยนในหลายบรรทัด) | – | ควรแปลงไฟล์ใหม่จากต้นฉบับ |

การแบ่งรายได้ตาม ADR 0026 §4 (metering ระบุ `appId` + `hostNodeId`) **ยังไม่พบโค้ดแบ่งรายได้** ใน finance/billing/metering ที่ตรวจ (พบเฉพาะกระเป๋า `finance:fee-revenue`) จึงถือว่าเป็นข้อกำหนดที่ยังไม่ได้ implement (ระดับ ? เพราะตรวจด้วยคำสำคัญ)

> **อัปเดต 2026-09-29**: พบว่า **ประมาณการรายได้ใน doc 100, 228 และ 248 ขัดกันเอง** (รายได้ปี 1 ต่างกันหลายสิบเท่า, คอมมิชชันแอป 10% เทียบ 30%, จุดคุ้มทุนปี 1 เทียบปี 3) ดูรายละเอียดและทางเลือกใน [SPD-DEC-003](decisions/DECISION-MEMO-003-economic-model-reconciliation.md) (รอ Lead ตัดสิน)

**ข้อเสนอ**: ออก ADR ในงาน monorepo เพื่อ reconcile ตาม doc 244 (Consistency Resolution Standard) ว่า doc 100 เป็น "aspirational, superseded ในส่วนโทเคน/staking/data marketplace" แล้วใช้ [MEMBER-ECONOMY](MEMBER-ECONOMY.md) เป็นกรอบทางเลือก

## 4. ประเด็นที่ต้องปิดก่อนเพิ่มฟีเจอร์ใหม่

| # | ประเด็น | แหล่ง |
|---|---|---|
| 1 | **SetBox ผลตรวจ 2026-09-06 = CONDITIONAL** (ซ้อมด้วยข้อมูลสังเคราะห์เท่านั้น) พบ P1 4 ข้อในเครื่องมือเตรียมเครื่อง C#: signature/manifest ไม่ fail-closed, export ไม่บังคับ preflight, ผล encryption/release PASS เกินหลักฐาน, network policy ปฏิเสธแล้วยังเชื่อมต่อ · ผมไม่พบซอร์ส C# ใน repo ที่โคลน จึงยืนยันไม่ได้ว่าแก้แล้วหรือไม่ | `OneManOS-SetBox-Readiness-Review-2026-09-06.md` |
| 2 | ROADMAP SetBox: ยังไม่ส่งมอบให้ลูกค้านอกกิจการผู้พัฒนาอย่างน้อย 1 ราย · ยังไม่ผ่านรอบดูแลจริง 1 ไตรมาส · เส้นทางเปิดสาธารณะรอเจ้าของยืนยันสิทธิบัตร/เครื่องหมายการค้า | `onemanos-setbox/ROADMAP.md` |
| 3 | dTPM/fTPM ค้าง 10–11 รอบ · Road A pico-fido · การแยกทายาท/ผู้พิทักษ์ · ADR 0024–0026 รอ Lead | AGENT_NOTES |
| 4 | ADR 0018–0020 (กระทบความปลอดภัย SetBox) ลงนามโดย Cowork แทน Lead ควรให้ Lead ยืนยันย้อนหลัง | ADR ต้นฉบับ |
| 5 | WO-B2 (B2-b/c/e) ต้องปิดก่อนเปิด `APPLIANCE` · N00-K ต้องตั้งค่าก่อน WO-N1 | AGENT_NOTES, session ก่อนหน้า |
| 6 | doc 189 ระบุ 🔴 ขัดแย้งหลายรายการ (MVP 100% vs 20%, patents 73 vs 50%, ทีม 23 คน vs 40%) ตัวเลขในเอกสารลงทุนต้องอ้างเฉพาะที่ verify | `docs/00-admin-ai/189-...` |
| 7 | โดเมน `nextwaver.com` อาจหมดอายุ (ต้องตรวจ) · `spada-onevault-community` เป็น public (Lead ตัดสินคงเดิม) | AGENT_NOTES |

## 5. ช่องว่างที่แท้จริง (เรียงตามลำดับ)

| ลำดับ | ช่องว่าง | ทำอะไร |
|---|---|---|
| 1 | Reconcile โมเดลเศรษฐกิจ (doc 100 vs ADR 0012/0005/0026) | ออก ADR + ปรับ doc 100 · ปรึกษากฎหมายเรื่องโทเคน/staking/ตลาดข้อมูล |
| 2 | ปิดผลตรวจ SetBox P1 และเงื่อนไข `APPLIANCE` เป็นเอกสารเดียว | ยืนยันสถานะการแก้ · รวมเงื่อนไขที่กระจายใน ADR 0017/0020, WO-B2, dTPM/fTPM |
| 3 | ยกกฎเหล็กข้อ 8–9 (doc 335 D1/D2) ให้เป็นทางการ | ให้ Lead ตัดสิน · เพิ่ม adversarial test ใน CI |
| 4 | Implement การแบ่งรายได้และ fee schedule ที่ตรวจสอบได้ | ตาม ADR 0026 §4 และแนวใน [MEMBER-ECONOMY](MEMBER-ECONOMY.md) |
| 5 | ทดสอบ Exit จริง (ลูกค้าเลิกใช้แล้วได้ข้อมูลและหลักฐานคืนครบ) | ต่อยอด H1–H7 ของ SetBox ไปยัง node app |
| 6 | Reproducible build, sunset plan, crypto-agility | ตัดสินขอบเขตก่อน (SetBox, KeySign, SPADA) |
| 7 | Mesh ระดับ node | ความสำคัญต่ำ รอหลัง M3 |

## 6. สิ่งที่ยังไม่ได้อ่านและข้อจำกัด

- ยังไม่ได้อ่านเต็ม: ADR 0001–0004/0007/0009–0011/0013, SAMTF (doc 219), Security Whitepaper, Community Node Governance v1.1, เอกสาร Google Drive, repo `ai-platform-kit`, โค้ดเกือบทั้งหมด
- ยังตรวจไม่ได้: สถานะการทำงานจริงของ service (ต้องรัน `npm run verify` และอ่านโค้ด) และซอร์สเครื่องมือเตรียมเครื่อง C# ของ SetBox
- ลำดับแนะนำ: (1) ให้ Lead ตัดสินข้อ 3 และ 4 ในหัวข้อที่ 4 และเรื่อง doc 335 (2) ให้ผู้ดูแลระบบยืนยันแถวระดับ C ด้วยการรันเทสต์ (3) เปิด ADR reconcile เศรษฐกิจ

## 7. ผลการอ่านรอบที่ 3 (doc 335 ทั้งฉบับ, doc 340–347, `spada-specs`)

### 7.1 doc 335 — AI-Adversary Hardening (Proposed, 2026-08-05)

| รายการ | สถานะ | หมายเหตุ |
|---|---|---|
| D1 Entropy Integrity (ยกเป็นกฎเหล็กข้อ 8) | Proposed | ห้าม software PRNG fallback, fail loud (`SPADAEntropyError`), บันทึก `ENTROPY_ATTESTATION` ลง IdentityBook |
| D2 แยก instruction/data ของ MyAI (กฎเหล็กข้อ 9) | Proposed | **D2.1 Accepted**: L5 อิสระเฉพาะ operation ที่ย้อนกลับได้ |
| D3 Passphrase ที่ระบบสร้าง (diceware ไทย 6 คำ ~77 บิต), Recovery แบบ SLIP-39 3-of-5 | Proposed | ต้องตัดสินเรื่อง wordlist ภาษาไทย (P2) |
| D4 Anti-deepfake: biometric ต้องคู่กับ device-bound key + liveness | Proposed | ระดับ spec ไม่ใช่กฎเหล็ก |
| D5 Anomaly → TrustScore freeze | Proposed (P2) | ต้องมีเส้นทาง unfreeze ที่ไม่พึ่งศูนย์กลาง |
| P1–P5 เงื่อนไขก่อนบังคับใช้ | ค้าง | P1 สำรวจ TRNG อุปกรณ์เป้าหมาย · P2 wordlist · P3 3-Tier Harness กัน approval fatigue · P4 ชุดทดสอบ prompt injection · P5 ตรวจ software PRNG ในโค้ด |

**ผมตรวจ P5 เบื้องต้นในโค้ด (ค้นคำสำคัญ ไม่ได้รัน):**
- การสร้างกุญแจตัวตน (`modules/place/src/place-crypto-provider.ts`) ใช้ `crypto.subtle.generateKey` แบบ Ed25519 ของ WebCrypto **ไม่พบเส้นทาง fallback ไปใช้ `Math.random`** ในจุดนี้ (สอดคล้องกับ D1 แต่ยังไม่มีการตรวจ TRNG หรือ attestation)
- **ไม่พบ** `SPADAEntropyError` หรือ `ENTROPY_ATTESTATION` ในโค้ดเลย จึงถือว่า D1 ยังไม่ได้ implement
- พบ `Math.random()` ใน **ตัวสร้าง ID ค่าเริ่มต้น** ของ `opof-service`, `data-share-broker-service`, `reclaim-connect-service` และ `packages/events` (ID = `prefix_เวลา_สุ่ม`, inject ตัวสร้างอื่นได้) ต้องตรวจว่า ID เหล่านี้ถูกใช้เป็นสิทธิ์เข้าถึง (bearer capability) หรือไม่ ถ้าใช่ ทายได้ง่ายเกินไป · ส่วน `apps/member-portal/app.js` ใช้กับโหมดจำลอง
- ข้อสังเกต: การสร้างกุญแจส่งออก private key เป็น JWK string ที่ชั้น provider การเก็บรักษาอยู่ที่ชั้นอื่น (ยังไม่ได้ตรวจ)

### 7.2 doc 340 — มาตรฐาน SetBox บน SPADA (SSoT, Lead อนุมัติ 2026-09-01)

- **§6 Trusted Service Gate**: บริการต้องมีเจ้าของบริการและผู้รับ incident, service contract แบบมีเวอร์ชัน, data classification/purpose, residency/retention, consent + least-privilege scopes, package provenance + signature, สถานะช่องโหว่, **ราคาและเงื่อนไขก่อนยืนยัน**, ขั้นตอน suspension/revocation, **export/offboarding**, backup/recovery และโปรไฟล์คู่ค้า/ภาครัฐ (ตรงกับข้อเสนอ M3/M7 ใน MEMBER-ECONOMY)
- **§5 Command contract**: ทุกคำสั่งเปลี่ยนสถานะมี `idempotencyKey`, `expectedVersion`, `packageHash`, `signatureReference`, `policyDecisionReference` และ default deny · **§8** idempotent, outbox, DLQ, replay ด้วย approval, ทดสอบ restore ตาม RPO/RTO
- **ข้อห้ามใช้ `T1/T2/T4-S` ในโค้ด SPADA** (เป็นคำของ OneManOS) ตาราง mapping → `deviceAssurance` สูงสุด: T2 → `APPLIANCE`, T1/T4-S → `NATIVE`
- **ยังบล็อก `APPLIANCE`**: device attestation (ADR 0015 §8 งานที่ 2) และกุญแจรายคน (TPM hierarchy) ยังไม่ครบ · เพดานปัจจุบัน `NATIVE`
- **§10 เรื่องที่ยังไม่ตัดสิน**: Business/Data/Technical/Support Owner, **SLA/RPO/RTO**, retention/residency, trust tiers ของ Trusted Service, ผู้มีอำนาจพักใช้บริการ, **Pricing และความรับผิดเมื่อบริการภายนอกล้มเหลว**, transaction profile ของหน่วยงานรัฐ · ตัดสินแล้ว: เจ้าของ `did:spada:org` ของ SetBox Factory WorkSpace = NextWaver.Net Co., Ltd.

### 7.3 doc 342–344 — เครือข่ายและทะเบียนฮาร์ดแวร์ SetBox

- **สถาปัตยกรรมเครือข่าย**: VLAN แยก (Management / SetBox / Evidence-Backup / Member / Guest-IoT), ห้าม SetBox รับ inbound จากอินเทอร์เน็ต, บริหารจากภายนอกผ่าน VPN + MFA, ต่อ SPADA ด้วย TLS 1.3/mTLS, egress เริ่มจาก deny, ห้าม fail open
- **🔴 dTPM/fTPM**: เครื่องใน RFQ (AMD Ryzen 7 PRO) น่าจะเป็น fTPM ซึ่งบางรุ่นไม่มี EK certificate · ถ้าไม่มี `APPLIANCE` เปิดไม่ได้ · ต้องถามผู้ขายเป็นลายลักษณ์อักษรก่อนรับใบเสนอราคา (D11 ค้าง)
- **doc 344 ทะเบียนเครื่องที่ผ่านรับรอง: ว่างเปล่า** กฎ ADR 0020: **ห้ามติดตั้ง SetBox บนรุ่นที่ไม่อยู่ในทะเบียน** จึงติดตั้งบนเครื่องใดไม่ได้จนกว่าจะมีรายการแรก และสคริปต์รับรองฮาร์ดแวร์ยังไม่มี (ต้องมี WO) · vTPM = REJECTED เสมอ · ทะเบียน append-only
- ผลต่อธุรกิจ: กฎนี้ใช้กับการติดตั้งที่ SPADA ออกสิทธิ์ (ADR 0017) ส่วนเส้นทางติดตั้ง OneManOS แบบไม่เชื่อม SPADA ผมยังไม่ได้ยืนยันว่าอยู่ภายใต้กฎเดียวกันหรือไม่
- พอร์ตชนกัน 4106 แก้แล้ว (recovery → 4107) · **ยังเปิดอยู่**: `docker-compose.dev.yml` ผูก `4105:4105` ทุก interface (ควรเป็น `127.0.0.1:4105:4105`) อยู่ในโซนที่ยังไม่มีเจ้าของ claim

### 7.4 doc 343 — คู่มือเจ้าหน้าที่ Node/Network (สำรวจ 2026-09-07, main `39384672`)

> **อัปเดตหลังตรวจโค้ดที่ `206d1f9`**: GAP-04 **ยังเปิด** (`infra/docker/docker-compose.node.yml:90` ฝัง guardian share ตัวอย่าง) · GAP-05 **โค้ดน่าจะแก้แล้ว** (`scripts/ops/backup.mjs` v2/v3 อ่าน volume จาก compose + `sqlite3 .backup`, มี restore drill) ยังขาดหลักฐานการซ้อมบนของจริง · ดู [WO-PROPOSAL-S1-S3](work-orders/WO-PROPOSAL-S1-S3.md)

ช่องว่างก่อนเปิดบริการ (จากซอร์สและเอกสาร ไม่ใช่ pen-test, **สถานะปัจจุบันไม่ทราบ**):

| ID | เรื่อง | ความสำคัญเชิงเศรษฐกิจ/ความเชื่อถือ |
|---|---|---|
| GAP-01 | ชื่อตัวแปร federation peers ไม่ตรงกัน (runbook vs Compose) และ runtime ที่ตรวจไม่อ่าน peers | กระทบ M3 (สอง node แลกเปลี่ยนได้) |
| GAP-02 | ลำดับทดสอบ key login ก่อนปิด password | ล็อกตัวเองออกจากเครื่อง |
| GAP-03 | bootstrap เปิด SSH/8443 ไม่จำกัดต้นทาง | ความปลอดภัย |
| GAP-04 | **Compose ของ recovery มี guardian share ตัวอย่างคงที่** | ต้องใช้ ceremony จริงก่อนใช้กับสมาชิก (เกี่ยวกับ ADR 0005 §9) |
| GAP-05 | `backup.mjs` คัดลอกเฉพาะไฟล์ตรงใต้ `data/` (รวม SQLite) ไม่ครบ volume | ข้อมูลสมาชิกกู้คืนไม่ครบ |
| GAP-06 | healthcheck ของ proxy ไม่ตรวจ TLS/routing จริง | ปฏิบัติการ |
| GAP-07 | WorkSpace และ Bridge ยังไม่มี release ครบที่พิสูจน์ได้ (WO-D ยังเป็นร่าง) | ห้ามอ้างว่า self-service พร้อม |
| GAP-08 | attestation verifier เริ่มต้นเป็น null (ปฏิเสธ) และ `APPLIANCE` ถูกบล็อก | ตาม ADR 0017 |

### 7.5 doc 345–347 — SPADA KeySign (Personal Key Token, RP2350)

- **สถานะ**: ต้นแบบที่ใช้ได้จริง conformance ผ่าน 10 ข้อ (PKT-R1..R10) เมื่อ 2026-09-13 · ชิป revision A4 (แก้ errata E16/E20/E21/E24 แล้ว)
- **ทำได้**: พิสูจน์ *user presence* (มีคนกดปุ่มตอนนั้น) · **ทำไม่ได้**: พิสูจน์ว่าอุปกรณ์เป็นของแท้ (ไม่มี vendor attestation root) TPM ในเครื่อง SetBox เป็นตัวพิสูจน์เครื่อง คนละหน้าที่และไม่แทนกัน
- **ข้อจำกัดที่ต้องบอกผู้ใช้** (doc 346 §9): ยังไม่ล็อก secure boot, debug เปิดอยู่, OTP ยังไม่เขียน (ย้อนไม่ได้ รอ Lead), **ยังไม่ออกแบบ PIN**, ผู้เชี่ยวชาญที่ได้อุปกรณ์นานพออาจอ่านกุญแจได้, อายุราว 100,000 ลายเซ็น, **ไม่ใช่ FIDO2** (ห้ามเรียกว่า FIDO2), เพดาน `NATIVE`
- OTP bit array vulnerability ของ RP2350 ยังไม่แก้ใน A4 · flash เป็นชิปนอกที่คลิปอ่านได้
- ผลต่อเอกสารนี้: PROP-0005 (duress/coercion) และข้อเสนอ M8 (คุ้มครองการฉ้อโกง) ต้องไม่พึ่ง KeySign เป็นกลไกป้องกันการขโมยจนกว่าจะมี PIN และผ่านการทบทวนความปลอดภัย

### 7.6 `spada-specs` (private, commit `f795a9d`, 2026-06-12)

- มีเพียง `README.md` (สถานะ DRAFT) ยังไม่มีสเปกใดเข้า repo · ตั้งใจเปิดสาธารณะ: Federation Protocol (sanitized จาก doc 099), Naming Convention Guide, OPOF schema · ทุกฉบับต้อง sanitize + Human approve รายไฟล์ · **ห้ามนำ** `12-business-strategy/`, `14-patents-ip/`, `18-founder-profile/` เข้า repo
- ผลต่อข้อ 10 (Open standards): ข้ออ้าง "มาตรฐานเปิด" ยังไม่มีสเปกที่เผยแพร่จริงรองรับ (มีเพียง canonical hash C2 พร้อม test vectors ใน monorepo) เป็นช่องว่างที่ชัดเจนและแก้ได้เป็นขั้นๆ
- doc 100 อยู่ใน `12-business-strategy/` จึงอยู่ในกลุ่มที่ห้ามเปิดสาธารณะ

### 7.7 ช่องว่างที่เพิ่มหรือปรับลำดับหลังรอบนี้

| ลำดับใหม่ | ช่องว่าง | เหตุผล |
|---|---|---|
| 1 | Reconcile เศรษฐกิจ (doc 100 vs ADR 0012/0005/0026) | เดิม |
| 2 | ปิดเงื่อนไขก่อนติดตั้ง SetBox จริง: ทะเบียนฮาร์ดแวร์ว่าง + dTPM/fTPM + P1 ผลตรวจ 2026-09-06 + GAP-01..08 | ตอนนี้ติดตั้งตามกติกาไม่ได้เลย จึงเป็นคอขวดของ E1 |
| 3 | ตัดสิน doc 335 (D1/D2/D3/D5) และมอบ P1–P5 | ยังเป็น Proposed ทั้งหมดยกเว้น D2.1 · D1 ยังไม่มีโค้ด |
| 4 | KeySign: PIN, การล็อก secure boot/OTP (ย้อนไม่ได้), review ความปลอดภัย | ก่อนอ้างเป็นกลไกป้องกันมูลค่าจริง |
| 5 | ตรวจ ID ที่ใช้ `Math.random` ว่าเป็น capability หรือไม่ | ความเสี่ยงต่ำ–กลาง ตรวจได้เร็ว |
| 6 | ตัดสิน §10 ของ doc 340: SLA/RPO/RTO, ราคาและความรับผิดเมื่อบริการภายนอกล้มเหลว | จำเป็นต่อ Fee Constitution (MEMBER-ECONOMY M3) |
| 7 | เผยแพร่สเปกแรกใน `spada-specs` (sanitized) | รองรับข้ออ้างมาตรฐานเปิดและ exit |
| 8 | การแบ่งรายได้, reproducible build, sunset plan, mesh ระดับ node | เดิม |
