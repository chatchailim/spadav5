# Gap Analysis v0.3: เป้าหมายใน Roadmap เทียบกับระบบจริง

> แทนที่ v0.2 · วันที่ 2026-09-29
> แหล่งข้อมูล: `spada-monorepo` @ `206d1f9`, `onemanos-setbox` @ `20471f6`, `onemanos` @ `321490e` · รายละเอียดใน [CURRENT-STATE](CURRENT-STATE.md)
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
| 1 | Constitution + Threat model | ADR 0005, 0014 · **doc 335 (Proposed)** · ทะเบียนความเสี่ยง R-001..R-006 | D | ยกกฎเหล็กข้อ 8–9 จาก doc 335 ให้เป็นทางการ · threat model รวม SetBox/KeySign/network · `specs/security/README.md` ยังเป็นสารบัญ |
| 2 | Identity | ADR 0008/0009/0015/0022/0023 · `identity-service`, `oidc-provider-service` | D+C | ZK ยังเป็น ? · ต้องตรวจว่า OIDC (K1/K2) เสร็จขั้นใด |
| 3 | Consent | `consent-service`, ADR 0018, `data-share-broker-service` (default-deny, scoped, time-boxed, revocable, ไม่ copy ถาวร) | D+C | Launch gate: DPIA + legal review ก่อนเปิดจริง (ระบุใน README ของ broker) |
| 4 | Vault/OPOF | ADR 0006/0007, ADR 0005 §13 (ลบข้อมูล/legal hold) · `opof-service` · SetBox ตรวจ H1–H7 "ข้อมูลเป็นของกิจการ" | D+C | ADR 0006 ยัง Proposed · ตัวตรวจ "ไม่มีข้อมูลข้ามเจ้าของ" ระดับ network ต้องยืนยัน |
| 5 | Key recovery + duress | ADR 0005 §9, 0019 · `recovery-service`, `digital-will-service` | D+C | การแยกทายาท/ผู้พิทักษ์ + ผลประโยชน์ทับซ้อนของ D4 **รอ Lead** |
| 6 | Node/consensus/governance | ADR 0005 (§14 ไม่ผูกขาดโดย Foundation, §15 กันรัฐ/องค์กรยึดระบบ), 0008, 0025 · `federation-gateway` (WO-J) · CometBFT probe | D+C | ADR 0025 (Home Node + pointer directory) รอ Lead · ขนาดที่ระบุ (30 GB/90 MB ต่อ node) "ยังไม่ได้วัด" ตามที่ ADR ระบุเอง |
| 7 | Agent/sandbox | ADR 0015/0016/0027, doc 335 D2 · SetBox `human-gate.js` ปฏิเสธชื่อบัญชี agent ที่ตัวโค้ด | D+C | doc 335 D2 (แยก instruction/data, irreversible ต้องมนุษย์ยืนยันทุกระดับ) ยัง Proposed ส่วน D2.1 (L5 = อิสระเฉพาะ reversible) **Accepted** แล้ว |
| 8 | Digital economy | ADR 0012, 0024 (Proposed), 0026 (Proposed) · `finance-service`, `billing-service`, `metering-service`, `payment-adapter`, `shop-service` | D+C แต่ **ขัดกัน** | ดูข้อ 3 |
| 9 | Offline/mesh | ADR 0026 (Setbox offline) | D | mesh ระดับ node = ? |
| 10 | Open standards + exit | ADR 0021 (RFC 8785 + test vectors), ADR 0026 (manifest ต้องมี `export`), SetBox no-dependency + handover H1–H7 | D+C | reproducible build ไม่พบ · sunset plan ไม่พบ |

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

## 6. ขั้นถัดไปและสิ่งที่ยังไม่ได้อ่าน

- ยังไม่ได้อ่านเต็ม: ADR 0001–0004/0007/0009–0011/0013, doc 335 ส่วน D4 ขึ้นไป, doc 340/341/342/344/345, SAMTF doc 219, Security Whitepaper, Community Node Governance v1.1, เอกสาร Google Drive, repo `spada-specs`, `ai-platform-kit`
- ยังตรวจไม่ได้: สถานะการทำงานจริงของ service (ต้องรัน `npm run verify` และอ่านโค้ด) และซอร์สเครื่องมือเตรียมเครื่อง C# ของ SetBox
- ลำดับแนะนำ: (1) ให้ Lead ตัดสินข้อ 3 และ 4 ในหัวข้อที่ 4 (2) ให้ผู้ดูแลระบบยืนยันแถวระดับ C ด้วยการรันเทสต์ (3) เปิด ADR reconcile เศรษฐกิจ
