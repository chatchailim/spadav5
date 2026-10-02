# สารบัญเอกสารและทะเบียนงานค้าง (Document Index & Open Items Register)

- **รหัสเอกสาร: SPD-IDX-001**
- วันที่: 2026-09-29 · **อัปเดตทุกครั้งที่เพิ่ม/เปลี่ยนสถานะเอกสาร**
- ใช้อ้างอิงเอกสารด้วยรหัส `SPD-<ประเภท>-<เลข>` เช่น "ตาม SPD-DEC-002" · ประเภท: CUR สถานะปัจจุบัน · GAP ช่องว่าง · ECO เศรษฐกิจ · RDM แผนงาน · DEC การตัดสินใจ · ADR ร่าง ADR · PRC จัดซื้อ · WO ใบงาน · PRP ข้อเสนอ · IDX สารบัญ
- ระบบจริงและ ADR ต้นฉบับอยู่ใน `chatchailim/spada-monorepo` (private) เอกสารในนี้เป็นสรุป ข้อเสนอ และร่างเพื่อชี้ทาง ไม่ได้รันโค้ดหรือเทสต์ใดๆ

## 1. ทะเบียนเอกสาร

| รหัส | เอกสาร | สถานะ | ไฟล์ |
|---|---|---|---|
| SPD-CUR-001 | สถานะสถาปัตยกรรมปัจจุบัน (v0.4) | สรุปจากการอ่าน ไม่ใช่ต้นฉบับ | [CURRENT-STATE](CURRENT-STATE.md) |
| SPD-GAP-001 | Gap Analysis v0.4 | สรุปจากการอ่าน ยังไม่ยืนยันด้วยการรันโค้ด | [GAP-ANALYSIS](GAP-ANALYSIS.md) |
| SPD-ECO-001 | เศรษฐกิจดิจิทัลที่สมาชิกได้ประโยชน์สูงสุด | ข้อเสนอ v0.1 (Lead อนุมัติเป็นกรอบทดลอง ไม่ใช่นโยบายที่มีผล) | [MEMBER-ECONOMY](MEMBER-ECONOMY.md) |
| SPD-RDM-001 | Roadmap เชิงหลักการ | ร่าง v0.1 (เขียนก่อนเห็นระบบจริง) | [ARCHITECTURE-ROADMAP](ARCHITECTURE-ROADMAP.md) |
| SPD-PRP-000 | ข้อเสนอ PROP-0001..0010 | ร่างเก่า เทียบกับระบบจริงแล้ว | [proposals/README](proposals/README.md) |
| SPD-DEC-001 | บันทึกคำตัดสินเทคนิค 5 เรื่อง | Lead อนุมัติ 2026-09-29 | [DECISION-MEMO-2026-09-29](decisions/DECISION-MEMO-2026-09-29.md) |
| SPD-DEC-002 | บันทึกการอนุมัติของ Lead | บันทึกโดย Claude จากข้อความของ Lead | [APPROVAL-LOG](decisions/APPROVAL-LOG-2026-09-29.md) |
| SPD-DEC-003 | โมเดลเศรษฐกิจ doc 100 ขัดกับสถาปัตยกรรมและเอกสารอื่น | **Lead อนุมัติทางเลือก A แล้ว C (2026-09-29)** | [DECISION-MEMO-003](decisions/DECISION-MEMO-003-economic-model-reconciliation.md) |
| SPD-ADR-D01 | ร่าง ADR ขอบเขตการรับรองฮาร์ดแวร์ (ที่มาการตัดสินใจ) | Lead อนุมัติ | [ADR-DRAFT](decisions/ADR-DRAFT-hardware-qualification-scope.md) |
| SPD-ADR-D02 | ADR ขอบเขตการรับรองฮาร์ดแวร์ พร้อมนำเข้า monorepo | Accepted (ตามคำอนุมัติ) รอนำเข้า | [ADR-NEXT hardware](decisions/ADR-NEXT-hardware-qualification-scope-import-ready.md) |
| SPD-ADR-D03 | ADR ปรับโมเดลเศรษฐกิจให้สอดคล้อง พร้อมนำเข้า monorepo | **Accepted (ตามคำอนุมัติ 2026-09-29)** รอนำเข้า | [ADR-NEXT economic](decisions/ADR-NEXT-economic-model-reconciliation-import-ready.md) |
| SPD-PRC-001 | มาตรฐานการจัดซื้อ SetBox | Lead อนุมัติ มีผลกับการซื้อหลังระดมทุน | [SETBOX-PROCUREMENT-STANDARD](procurement/SETBOX-PROCUREMENT-STANDARD.md) |
| SPD-PRC-002 | แม่แบบจดหมายถึงผู้ขาย (RFQ) | Lead อนุมัติให้ใช้ ยังไม่ส่ง | [RFQ-VENDOR-LETTER-TH](procurement/RFQ-VENDOR-LETTER-TH.md) |
| SPD-PRC-003 | แบบกรอก ณ วันซื้อ | แม่แบบเปล่า | [PURCHASE-TIME-DECISION-SHEET](procurement/PURCHASE-TIME-DECISION-SHEET.md) |
| SPD-PRC-004 | แม่แบบทะเบียนฮาร์ดแวร์แบบเดี่ยว | แม่แบบเปล่า (ที่ตั้งจริงที่เสนอ: `onemanos-setbox`) | [HARDWARE-REGISTRY-STANDALONE-TEMPLATE](procurement/HARDWARE-REGISTRY-STANDALONE-TEMPLATE.md) |
| SPD-INV-001 | รายการตรวจเอกสารลงทุนก่อนเปิดห้องข้อมูล (Go/No-Go) | **ผลตรวจรอบแรก: NO-GO ในสถานะปัจจุบัน** | [INVESTOR-DATAROOM-REVIEW-CHECKLIST](investor-review/INVESTOR-DATAROOM-REVIEW-CHECKLIST.md) |
| SPD-DEC-004 | คำตัดสิน: ข้อเสนอระดมทุนฉบับปัจจุบัน เงื่อนไขเงินกู้แปลงสภาพ ทะเบียนการถอน และ SPD-DEC-003 | Lead อนุมัติทิศทาง; **Lead อนุมัติตัวเลข 2026-09-30; รอทนายร่างสัญญา** | [DECISION-004](decisions/DECISION-004-current-fundraising-offer-and-terms.md) |
| SPD-INV-003 | ร่าง Term Sheet เงินกู้แปลงสภาพ (สำหรับทนาย) | ร่าง ยังไม่ส่งนักลงทุน | [CONVERTIBLE-LOAN-TERM-SHEET-DRAFT](investor-review/CONVERTIBLE-LOAN-TERM-SHEET-DRAFT.md) |
| SPD-INV-002 | ทะเบียนข้ออ้างในเอกสารลงทุน (INV-C01..C38) | ผลตรวจรอบแรก (อ่านและค้นไฟล์ ไม่ได้รันระบบ) | [INVESTOR-CLAIM-REGISTER](investor-review/INVESTOR-CLAIM-REGISTER.md) |
| SPD-INV-004 | ร่างข้อความสไลด์ v1.1 ทีละหน้า + คำอธิบายโมเดลฉบับนักลงทุน | ร่างพร้อมใส่สไลด์ (Lead อนุมัติตัวเลข 2026-09-30) | [DECK-V1.1-SLIDE-TEXT](investor-review/DECK-V1.1-SLIDE-TEXT.md) |
| SPD-INV-005 | บันทึกผู้นำเสนอ v1.1 (**ภายในเท่านั้น ห้ามส่งนักลงทุน**) | ร่าง | [DECK-V1.1-INTERNAL-SPEAKER-NOTES](investor-review/DECK-V1.1-INTERNAL-SPEAKER-NOTES.md) |
| SPADA-DOC-FUND-003 v1.1 | โมเดลการเงินฉบับนักลงทุน (946 สูตร 0 error ตรวจกับการจำลองอิสระ) | Lead อนุมัติตัวเลข 2026-09-30; จำนวนหุ้นเป็น placeholder | [xlsx](investor-review/models/SPADA-DOC-FUND-003-v1.1-investor-model.xlsx) · [สคริปต์สร้าง](investor-review/models/build_model_v1.1.py) |
| SPD-ANL-001 | เทียบเคียง OpenAI dots กับ MyAI และ Team Agent พร้อมแนวทางปรับใช้ | ร่างวิเคราะห์ (ฝั่ง dots ยืนยันบางส่วน) | [DOT-VS-MYAI-TEAMAGENT-COMPARISON](DOT-VS-MYAI-TEAMAGENT-COMPARISON.md) |
| SPD-ANL-002 | รายการที่ต้องเพิ่มให้ MyAI/Team Agent ทำงานแบบเอเจนต์ต่อเนื่อง (12 ชิ้น 5 เฟส) | ร่าง รอ Lead ตัดสิน 5 ข้อ | [MYAI-TEAMAGENT-DOT-PARITY-BUILD-LIST](MYAI-TEAMAGENT-DOT-PARITY-BUILD-LIST.md) |
| SPD-ANL-003 | ตรวจความสอดคล้องข้อเสนอ Agentic Business OS (MyAI/OneManOS/OneVault/Agent Team) กับ ADR และงานปัจจุบัน | ตรวจแล้ว: สอดคล้องระดับแนวคิด, ขัด ADR 0014/0016 ในแผนภาพหลัก 5 จุด | [ALIGNMENT-CHECK-AGENTIC-BUSINESS-OS](ALIGNMENT-CHECK-AGENTIC-BUSINESS-OS.md) |
| SPD-ANL-004 | ผลค้นคว้าวิสัยทัศน์ ตัวตนดิจิทัล + MyAI/Soul.md ("DNA ดิจิทัล") พร้อมแผนที่สถานะจริงและประเด็นที่ต้อง Lead ตัดสิน | ร่างเพื่อทบทวน (อ่านเอกสารหลักราว 20 จากกว่า 150 ฉบับ) | [VISION-MYAI-DIGITAL-SELF-RESEARCH-TH](VISION-MYAI-DIGITAL-SELF-RESEARCH-TH.md) |
| SPD-EXC-001 | ข้อยกเว้นที่ Lead ยอมรับความเสี่ยง: S20-A ระดับต้นแบบ เก็บ ciphertext/identity/ภาพวลีในบัญชี Google เดียวกัน (ไม่ใช่มาตรฐาน ไม่ใช่การแยกที่เก็บที่ปลอดภัย) | บันทึกแล้ว 2026-10-02; เงื่อนไขทางเทคนิค S20-A ครบตามรายงาน Codex (ต้นแบบ) รอบันทึกปิดใน log ของ Cowork + รายการค้าง A–E | [EXCEPTION-S20A-LEAD-RISK-ACCEPTANCE](decisions/EXCEPTION-S20A-LEAD-RISK-ACCEPTANCE-2026-10-02.md) |
| SPD-MED-001 | บทวิดีโอสรุปงานที่ทำร่วมกัน: พิสูจน์อะไรได้/ประโยชน์ใช้งานจริง (14 นาที, สร้างโดยเอไอ) | ร่างเพื่อทบทวน ยังไม่ผ่านผู้ตรวจและยังไม่อนุมัติ | [VIDEO-STORY-SCRIPT-TH](media/VIDEO-STORY-SCRIPT-TH.md) |
| SPD-MED-002 | แผนการตลาดล่วงหน้าด้วยวิดีโอสั้น (Gen Z tone) + บทคลิปชุดแรก 3 คลิป | ร่างเพื่อทบทวน ยังไม่ผ่านผู้ตรวจและยังไม่อนุมัติ | [MARKETING-SHORTS-PLAN-TH](media/MARKETING-SHORTS-PLAN-TH.md) |
| SPD-MED-003 | บทวิดีโอ Use Case: ชุมชน และสำนักงานบัญชี (DID → SetBox) เรื่องสมมติ | ร่างเพื่อทบทวน ยังไม่ผ่านผู้ตรวจและยังไม่อนุมัติ | [USECASE-COMMUNITY-ACCOUNTING-SCRIPT-TH](media/USECASE-COMMUNITY-ACCOUNTING-SCRIPT-TH.md) |
| SPD-MED-004 | บทวิดีโอนักลงทุน: การขยายสเกลสู่ระดับโลก (ซื่อตรง: พิสูจน์แล้ว/ต้องพิสูจน์/เกณฑ์ขยาย) ไม่มีตัวเลขการลงทุน | ร่างเพื่อทบทวน รอ Lead อนุมัติ | [INVESTOR-GLOBAL-SCALE-SCRIPT-TH](media/INVESTOR-GLOBAL-SCALE-SCRIPT-TH.md) |
| SPD-MED-005 | บทวิดีโอวิสัยทัศน์: ตัวตนดิจิทัลและ MyAI "ธรรมชาติและค่านิยมของคุณ" (แนวนอน 7 นาที) แยกความฝัน/ความจริง | ร่างเพื่อทบทวน | [VISION-MYAI-SCRIPT-TH](media/VISION-MYAI-SCRIPT-TH.md) |
| SPD-WO-001 | ร่างใบงาน S1–S3 | Lead อนุมัติให้ออก ยังไม่ออกจริง | [WO-PROPOSAL-S1-S3](work-orders/WO-PROPOSAL-S1-S3.md) |
| SPD-WO-003a | ใบงาน POO-WO-005 ฉบับรายละเอียดพร้อมนำเข้า (วิธีทำ แม่แบบรายงาน เกณฑ์รับงาน) ร่างโดย Claude แทน Lead | ออกแล้ว รอ Lead ตรวจข้อความและมอบงาน | [POO-WO-005](work-orders/POO-WO-005-teamagent-mcp-scheduler-spike.md) |
| SPD-WO-003 | ใบงานสำรวจ onevault-mcp และตัวตั้งเวลา (spike, เสนอเลข POO-WO-005) | **Lead ตัดสินให้ออก 2026-09-30** นำเข้า `onemanos-setbox` แล้ว (branch `docs/poo-wo-005` ce692ca ยังไม่ merge) รอ Lead merge + มอบผู้ทำ | [WO-SPIKE-TEAMAGENT-MCP-SCHEDULER](work-orders/WO-SPIKE-TEAMAGENT-MCP-SCHEDULER.md) |
| SPD-REV-001 | ผลตรวจรับรอบกลางของรายงานสำรวจ POO-WO-005 (checkpoint ที่ commit 594d47e) | รอบกลาง: ยังไม่รับขั้นสุดท้าย รอผู้ทำทำงานค้างและส่งรอบสอง | [REVIEW-POO-WO-005-interim](work-orders/REVIEW-POO-WO-005-interim-2026-09-30.md) |
| SPD-REV-002 | ผลตรวจรับรอบที่ 2 ของรายงานสำรวจ POO-WO-005 (commit 4331192) | แก้ตามรอบกลางครบ; ยังไม่รับขั้นสุดท้าย รอ Lead กำหนด VM + บัญชีทดสอบ/วงเงิน | [REVIEW-POO-WO-005-round2](work-orders/REVIEW-POO-WO-005-round2-2026-09-30.md) |
| SPD-WO-002 | ใบงานสคริปต์รับรองฮาร์ดแวร์ (WO-HWQ-001) | ร่าง รอผู้ดูแลออกใบงาน | [WO-HWQ-001](work-orders/WO-HWQ-001-hardware-qualification-script.md) |

## 2. การตัดสินใจที่รอ Lead

| # | เรื่อง | เอกสาร | หมายเหตุ |
|---|---|---|---|
| 1 | **ยืนยันตัวเลขเฉพาะของเงินกู้แปลงสภาพ** (3%, 24 เดือน, pre-money 15 ลบ., แบ่งงวด 2.0/1.0, ช่วงต่อรอง) | SPD-DEC-004 ข้อ 3–4 | ทนายต้องร่างสัญญาต่อ |
| 2 | ADR 0024, 0025, 0026 (Proposed) | monorepo | ปลดบล็อกข้อเสนอ M2, M7 |
| 3 | doc 340 §10: SLA/RPO/RTO, ราคาและความรับผิดเมื่อบริการภายนอกล้มเหลว | monorepo doc 340 | จำเป็นต่อ Fee Constitution |
| 4 | การแยกทายาท/ผู้พิทักษ์ + ผลประโยชน์ทับซ้อน + alive-check (ADR 0019 / D4) | monorepo | ค้างจาก AGENT_NOTES |
| 5 | ยืนยันย้อนหลัง ADR 0018–0020 (Cowork ลงนามแทน Lead) | monorepo | กระทบความปลอดภัย SetBox |
| 6 | ยืนยันสถานะ INCOMPLETE เพิ่มเติมในเกณฑ์รับรองฮาร์ดแวร์ | SPD-WO-002 §6 | ช่องว่างของ ADR 0020 |
| 7 | ผู้สำรอง/ผู้ตรวจ evidence คนที่สอง ของผู้ลงนามฮาร์ดแวร์ | SPD-ADR-D02 | ลดการรวมอำนาจ |
| 9 | ระบุผู้ตรวจเอกสารลงทุนก่อนเปิดห้องข้อมูลและกำหนดวัน | SPD-DEC-003 / SPD-DEC-004 ข้อ 8 | ก่อนเปิดห้องข้อมูล |
| 8 | ล็อก OTP/secure boot ของ KeySign | SPD-DEC-001 ข้อ 3 | **ห้ามทำ** จนครบ 6 เงื่อนไข |

## 3. งานที่รอผู้ลงมือ (ผมทำแทนไม่ได้)

| # | งาน | ผู้ทำ | เอกสาร |
|---|---|---|---|
| 1 | ส่งจดหมาย RFQ ให้ผู้ขาย (ไม่ต้องใช้เงิน) | ผู้จัดซื้อ | SPD-PRC-002 |
| 2 | ออกใบงาน S1–S3 และ WO-HWQ-001 ใน monorepo (ตรวจ ACTIVE CLAIMS) | ผู้ดูแล/agent | SPD-WO-001, SPD-WO-002 |
| 3 | นำ ADR (D02, D03) เข้า `architecture/adr/` ด้วยเลขที่ว่าง | ผู้ดูแล ADR | SPD-ADR-D02, D03 |
| 4 | ตั้งทะเบียนฮาร์ดแวร์แบบเดี่ยวใน `onemanos-setbox` | ผู้ดูแล repo | SPD-PRC-004 |
| 5 | ใส่ banner SUPERSEDED/WITHDRAWN ตามทะเบียนการถอน และตรวจเอกสารลงทุนที่ยังไม่ได้อ่านเต็ม | ผู้ดูแลเอกสาร/ผู้ระดมทุน | SPD-DEC-004 ข้อ 1 |
| 5.1 | แก้ deck/โมเดลออก v1.1 ตาม SPD-DEC-004 ข้อ 6 และทำฉบับนักลงทุน | ผู้ระดมทุน | SPD-DEC-004 ข้อ 6 |
| 5.2 | ให้ทนายร่างสัญญาจาก Term Sheet | ที่ปรึกษากฎหมาย | SPD-INV-003 |
| 5.3 | แทนจำนวนหุ้น placeholder ด้วยตัวเลข บอจ.5 จริง, กรอกเงินสดตั้งต้นและวันออกเอกสารในโมเดล, ตรวจว่า SPD-INV-005 ไม่ถูกแนบ | ผู้ระดมทุน | SPD-INV-004 ข้อ 4 |
| 5.4 | ~~นำ SPD-WO-003 เข้า onemanos-setbox~~ **เสร็จแล้ว 2026-09-30**: branch `docs/poo-wo-005` commit `ce692ca` (DCO) ยังไม่ merge · **เหลือ**: Lead ตรวจ diff และ merge, กรอกตารางมอบงาน (วันที่มอบ/รับงาน/กำหนดส่ง), มอบ Codex/Cowork | Lead / ผู้ดูแล repo | SPD-WO-003 |
| 5.5 | กำหนด VM ทดสอบแบบใช้แล้วทิ้ง (B2) และบัญชีทดสอบ+วงเงิน (B4, A6) ให้ผู้ทำใบงาน POO-WO-005 | Lead | SPD-REV-002 |
| 6 | กรอกชื่อผู้รับผิดชอบและวันกำหนด (P1–P5, S1–S3, WO-HWQ-001) | Lead | SPD-DEC-001 |
| 7 | ปรึกษากฎหมาย: จัดซื้อ/ภาษี/ศุลกากร, โทเคน/staking/ตลาดข้อมูล/เครดิต | ที่ปรึกษากฎหมาย | SPD-PRC-001, SPD-DEC-003 |
| 9 | ทำ PDF ฉบับนักลงทุนของ deck (ลบ speaker notes) และโมเดลฉบับนักลงทุน (ลบหมายเหตุเชิงต่อรอง) | ผู้ระดมทุน | SPD-INV-001 §3 |
| 10 | ขอใบเสนอราคา pen-test (อย่างน้อย 2 ราย) และฮาร์ดแวร์ แล้วปรับโมเดล | ผู้จัดซื้อ | SPD-INV-002 INV-C10 |
| 11 | ให้ที่ปรึกษากฎหมายตรวจ: เงินกู้แปลงสภาพ, IP ของโค้ด AI, ข้ออ้างกฎหมายภายนอก | ที่ปรึกษากฎหมาย | SPD-INV-002 INV-C27–C31 |
| 12 | วิศวกรอิสระทำ evidence pack ข้ออ้างเชิงเทคนิคในสไลด์ 4 และแก้ข้ออ้าง quantum-safe | วิศวกรอิสระ + ผู้ดูแลความปลอดภัย | SPD-INV-002 INV-C17, C23 |
| 13 | สแกนความลับ/ข้อมูลภายในของไฟล์ที่จะเปิด และสแกนประวัติ git | ผู้ดูแลความปลอดภัย | SPD-INV-002 INV-C33–C34 |
| 8 | กรอกแบบ Purchase-Time Decision Sheet ณ วันซื้อ | ผู้จัดซื้อ/ผู้อนุมัติจ่าย | SPD-PRC-003 |

## 4. วิธีใช้สารบัญนี้ต่อไป

- **อ้างอิง**: ใช้รหัสและวันที่ เช่น "SPD-DEC-002 (2026-09-29)" เอกสารเปลี่ยนสถานะให้แก้ที่ตารางข้อ 1 และเพิ่มบรรทัดในข้อ 2–3
- **เมื่อเรื่องใดปิดแล้ว** ให้ย้ายลงหัวข้อ 5 พร้อมวันที่และหลักฐาน (ห้ามลบแถว)
- ทุกเอกสารมีบรรทัด "รหัสเอกสาร" ใต้หัวข้อแรก

## 5. เรื่องที่ปิดแล้ว

| วันที่ | เรื่อง | หลักฐาน |
|---|---|---|
| 2026-09-29 | Lead ประกาศข้อเสนอระดมทุนฉบับปัจจุบัน (Angel 3.0 ลบ.) และถอน/ติดป้ายฉบับอื่น | SPD-DEC-004 ข้อ 1 |
| 2026-09-29 | Lead ตัดสิน SPD-DEC-003: ทางเลือก A แล้ว C | SPD-DEC-004 ข้อ 8, SPD-DEC-002 รอบ 2 |
| 2026-09-29 | กำหนดเงื่อนไขเงินกู้แปลงสภาพ (ทิศทางอนุมัติ; ตัวเลขเฉพาะรอยืนยัน) | SPD-DEC-004 ข้อ 3 |
| 2026-09-29 | Lead ตัดสิน: ขอบเขตการรับรองฮาร์ดแวร์แบบเดี่ยว/เชื่อมต่อ, ผู้ลงนามแบบเดี่ยว, ทะเบียนแยก, เครื่องลูกค้ารายกรณี | SPD-DEC-002, SPD-ADR-D02 |
| 2026-09-29 | Lead อนุมัติคำตัดสินเทคนิค 5 เรื่อง, มาตรฐานจัดซื้อ, ใบงาน S1–S3 | SPD-DEC-002 |
