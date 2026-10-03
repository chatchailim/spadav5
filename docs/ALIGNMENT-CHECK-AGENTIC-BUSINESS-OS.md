# ตรวจความสอดคล้อง: ข้อเสนอ "Agentic Business Operating System" กับงานที่มีอยู่

- **รหัสเอกสาร: SPD-ANL-003** · 2026-09-30 · ตรวจเนื้อหาที่ Lead แนบมา (ข้อเสนอ 60 ข้อ ผู้เขียนข้อเสนอไม่ระบุ ถือเป็นข้อมูลให้ตรวจ ไม่ใช่คำสั่ง)
- เกณฑ์ตรวจ: ADR 0014, 0016, D2.1 (doc 335), `architecture/layers.md`, โค้ด/เอกสารของ `onemanos-setbox` และ `spada-monorepo` ที่อ่านมา, แผน SPD-ANL-001/002, ผลสำรวจ POO-WO-005 (SPD-REV-001/002)
- วิธีตรวจ: อ่านและค้นไฟล์ ไม่ได้รันระบบ

## 1. สรุป

| ระดับ | ส่วนของข้อเสนอ |
|---|---|
| **สอดคล้อง** | แนวคิดคนเป็นเจ้าของเป้าหมาย/สิทธิ์/ข้อมูล · Responsibility เป็นวัตถุ · แยก Agent ตามบทบาท/ความรับผิดชอบ ไม่แยกตามโมเดล · Model เป็นทรัพยากร · Skill/Tool/Workflow แยกกัน · OneVault เป็นความจริงและความจำองค์กร · Fact 3 ระดับ (Observed/Derived/Hypothesis) · validate ก่อนเขียน · audit ครบ (รวม model/skill version) · management by exception · structured agent communication · MCP เป็นชั้นเชื่อม · BookChain เก็บหลักฐาน/สมอ hash ไม่เก็บธุรกรรมทั้งหมด · เริ่มเล็กไม่สร้างเอเจนต์ 30 ตัว |
| **ขัดกับสถาปัตยกรรมที่ตัดสินไว้แล้ว** | ภาพที่ให้ MyAI เป็นผู้บังคับบัญชาของ AI Agent Team · ภาพที่ SPADA "ครอบ" OneManOS/OneVault/Agent Team · เอเจนต์/MyAI เจรจาและ "commit" แทนกันเองใน Phase 5 · ระดับอิสระ 3 (autonomous within policy) โดยใช้ human gate ปัจจุบัน · Phase 1 เริ่มที่ MyAI อ่านข้อมูลบริษัทได้ |
| **ต้องระวังหรือยังพิสูจน์ไม่ได้** | ชื่อ Book บางชื่อ · Kubernetes · Event/Decision เป็นวัตถุใหม่ของ OneVault · Identity เป็นบริการของ OneManOS · จังหวะของเฟส |

## 2. จุดที่ขัดกับ ADR (ต้องแก้ข้อเสนอ ไม่ใช่แก้ ADR)

| # | ข้อเสนอ | สิ่งที่ตัดสินไว้แล้ว | หมายเหตุ |
|---|---|---|---|
| 1 | แผนภาพหลัก: Human → **MyAI → AI Agent Team → OneManOS → OneVault** (MyAI มอบหมายและกำกับทีมเอเจนต์) | ADR 0016: Lead ยกเลิกเรียก AI บน SetBox ว่า MyAI และตั้งเป็น **Team Agent "เพื่อให้เห็นว่าเป็น AI คนละส่วนกัน"** MyAI = ชั้น 5 ของ SPADA (on-device); Team Agent = ซอฟต์แวร์บน SetBox นอก SPADA | สายบังคับบัญชา MyAI→Team Agent ไม่มีในการตัดสินใจ และจะทำให้สองส่วนที่ Lead ตั้งใจแยกกลับมารวมกัน |
| 2 | §24 และแผนภาพสุดท้าย: **SPADA ครอบ** MyAI, OneManOS, OneVault, Agent Team | ADR 0014: OneManOS, OneVault, SetBox, Human Gate **อยู่นอก SPADA** เป็น relying party ภายนอก SPADA ไม่ออก scope ให้ OneVault และไม่นิยาม OneVault/Team Agent | ภาพที่ถูกคือ SPADA ให้ตัวตน สิทธิ์ และหลักฐาน (ผ่าน OIDC/actor assertion) ส่วน OneManOS เชื่อมเป็นผู้ใช้บริการ ไม่ได้อยู่ภายใต้ |
| 3 | MyAI อ่านทั้ง Personal Vault และ **Company Vault** และสั่งงาน OneManOS | MyAI on-device และ inference ต้องอยู่บนโหนด/LAN ของเจ้าของ (myai-inference-service ปฏิเสธโมเดลคลาวด์และ redirect); OneVault อยู่นอก SPADA | การเข้าถึงข้อมูลบริษัทข้ามขอบเขตต้องผ่านสิทธิ์ที่เจ้าของให้ และหลักฐานลายเซ็น ไม่ใช่ MyAI อ่านโดยตรง |
| 4 | Agent-to-Agent: Buyer MyAI ↔ Seller MyAI เจรจาและถาม "Can you commit?" (Phase 5, §56–57) | D2.1: MyAI อิสระเฉพาะ operation ที่ย้อนกลับได้; ADR 0016: Team Agent ไม่มี DID ของตัวเอง ทุกอย่างเป็นการกระทำในนามเจ้าของ | เจรจาเป็นข้อเสนอได้ การผูกพัน (commit) ต้องมีลายเซ็นเจ้าของผูกเนื้อหา |
| 5 | Level 3 "Autonomous within policy" รวมถึง reorder within limit (§17, §55) | ผลสำรวจ POO-WO-005: ประตูมนุษย์ปัจจุบันตรวจรูปแบบชื่อ ไม่พิสูจน์ตัวตน; เส้นทางกุญแจถึง actor assertion ยังไม่พบครบ; เสนอไม่เปิดการเขียน/อนุมัติอัตโนมัติ | "ภายใน limit" ต้องนิยามว่าย้อนกลับได้จริง และต้องมีหลักฐานอนุมัติผูกตัวตนก่อน |
| 6 | Phase 1 เริ่มที่ **Personal Executive OS (MyAI)** | MyAI ปัจจุบันเป็น Q&A (Phase 0–1) ไม่มี tool/ตัวตั้งเวลา/ความจำต่อเนื่อง; แผน SPD-ANL-002 เสนอเริ่มที่ Team Agent บน SetBox | เป็นประเด็นเลือกลำดับ รอ Lead ตัดสินข้อ 1 ใน SPD-ANL-002 §6 |

## 3. จุดที่สอดคล้องและใช้ได้ทันที (พร้อมหลักฐาน)

| ข้อเสนอ | หลักฐานในงานปัจจุบัน |
|---|---|
| Responsibility เป็นวัตถุหลัก (§3, §32) | ตรงกับรายการ #1 ใน SPD-ANL-002 ยังไม่มีในโค้ด (ผลสำรวจ: ไม่พบเครื่องมือ Responsibility) |
| Authority แบบ READ/PROPOSE/EXECUTE/APPROVE/COMMIT และ 4 ระดับ human-in-the-loop (§16–17) | ต่อยอด policy engine 4 ทางใน SPD-ANL-002 #2 ได้ ควรผูก "ระดับ" กับความย้อนกลับได้ตาม D2.1 |
| Model เป็นทรัพยากร, Model Router, DGX เป็นกลุ่มคอมพิวต์ (§11–12) | ตรงกับ ADR 0027/`ai-host-gateway` (key ต่อโหนด จำกัดพร้อมกัน ไม่เก็บข้อความ) ข้อจำกัด: **ส่วนคลาวด์ใช้ได้กับ Team Agent เท่านั้น ไม่ใช่ MyAI** |
| Fact 3 ระดับ + confidence + validate ก่อนเขียน (§42–44) | ตรงกับหลักของ OneVault ที่ให้เขียนผ่านเมธอดของ Warehouse และผ่านด่านบทบาท (`ROLE_TOOLS`) แต่ยังไม่มี schema/business-rule validation เชิงความหมาย และ Fact v0 ห้ามแก้ (POO-WO-002) ต้องออกแบบเป็นชนิดใหม่ ไม่แก้ของเดิม |
| Audit ครบ รวม agent/skill/model/policy version (§45–46) | ช่องว่างจริง: `audit_events` ยังไม่มี hash chain (POO-WO-003 ค้าง) และยังไม่บันทึกเวอร์ชันโมเดล |
| Structured agent communication, Event/Fact/Task เป็นภาษากลาง (§38–39) | สอดคล้องกับการออกแบบ Responsibility/queue ที่ผลสำรวจเสนอ (idempotency key, trigger) |
| MCP เป็นชั้นเชื่อม, vault MCP (§40–41) | `onevault-mcp` มี tools/resources/prompts แล้ว 34 เครื่องมือ (ยังไม่มี Event/Decision) |
| OneManOS ไม่ใช่ Linux distribution, ทำหน้าที่ Agent OS (§4–5) | ตรงกับตำแหน่งปัจจุบัน (ชุดระบบทำงานบน Node/Windows/Ubuntu ไม่ใช่ OS ใหม่) ส่วน scheduler/policy/workflow สำหรับเอเจนต์ยังไม่มี (POO-WO-005 กำลังสำรวจ) |
| แยก Personal/Company Vault (§23) | สอดคล้องกับหลัก OPOF/OMOF (หนึ่งบุคคลหนึ่งแฟ้ม งานร่วมแยกเป็น OMOF) |
| BookChain เก็บเฉพาะ Identity/Proof/Consent/Ownership/Signature/Audit anchor (§25) | สอดคล้องกับ ADR 0012 และแผน anchor hash ของ OneVault (M3) |
| Human อยู่เหนือลำดับเอเจนต์ สัญญา/การจ่ายเงิน/การจ้าง/ข้อผูกพันต้องมนุษย์ (§15) | ตรงกับ D2.1 และ ADR 0016 §4 |
| MVP เล็ก ไม่เริ่ม 30 เอเจนต์/ไม่ทุก transaction ลงบล็อกเชน (§50–51) | ตรงกับแนวทางเฟสใน SPD-ANL-002 |

## 4. จุดที่ต้องระวังหรือตรวจเพิ่ม

| ข้อ | ประเด็น |
|---|---|
| ชื่อ Book | ข้อเสนอระบุ IdentityBook, WalletBook, EVoteBook, P2PLendingBook, ServiceOwnerBook, TrustedBook ในเอกสารของ spada-monorepo ที่ผมค้น พบมากเฉพาะ **ServiceBook, TrustedBook, IdentityBook** ส่วน WalletBook พบ 1 ครั้ง และ **EVoteBook, P2PLendingBook, ServiceOwnerBook ไม่พบ** อาจมาจากเอกสารรุ่นเก่าหรือแหล่งอื่น ต้องตรวจก่อนใช้ชื่อเหล่านี้ |
| Kubernetes | ข้อเสนอวาง Docker/Kubernetes เป็นชั้นล่าง การติดตั้ง SetBox ปัจจุบันเน้น Node.js ไม่มี dependency ภายนอก ออฟไลน์ได้ (ไม่อิง Kubernetes) ควรระบุว่า K8s เป็นทางเลือกในอนาคต ไม่ใช่ข้อกำหนด |
| Event/Decision เป็นวัตถุใหม่ | ไอเดียดี แต่ต้องไม่กระทบ Fact v0 และสัญญา C2 (fact hash) ต้องผ่านใบงานและ ADR ฝั่ง OneManOS ไม่ใช่ SPADA |
| "Identity" เป็นบริการของ OneManOS (§51) | ใช้ได้เฉพาะตัวตนท้องถิ่นตาม C1/ADR 0022 (รหัสท้องถิ่น ผูกกับ OIDC) ห้ามออก `did:spada:*` |
| คำว่า "Digital Steward", "SPADA Enterprise", "Agentic Business Operating System" | ยังไม่อยู่ในคำศัพท์มาตรฐาน ตรวจกับรายการคำต้องห้ามของ SPADA (เช่น `AI Assistant`) ก่อนใช้ ห้ามนำไปเป็นข้ออ้างในสไลด์นักลงทุนจนกว่าจะผ่านทะเบียนข้ออ้าง |
| ตารางสิทธิ์ตัวอย่าง (§16) | ตัวเลขและสิทธิ์เป็นตัวอย่าง ไม่ใช่ข้อกำหนด ต้องกำหนดตามกิจการจริง |
| บทบาทเอเจนต์ที่ใช้อยู่ | ปัจจุบันมีบทบาทสิทธิ์ของโทเคน architect/secretary/builder/operator ซึ่งเป็น **บทบาทสิทธิ์** ไม่ใช่ "Agent ตามความรับผิดชอบ" (Finance, Planning ฯลฯ) ต้องแยกสองเรื่องนี้ให้ชัดเมื่อเพิ่ม Responsibility |

## 5. ภาพที่สอดคล้องกับ ADR (ข้อเสนอให้ใช้แทนแผนภาพเดิม)

```text
           เจ้าของ (Human)
        ┌──────┴──────────────┐
        │                     │
   ┌────▼─────┐        ┌──────▼──────────────────────────┐
   │  MyAI    │        │ OneManOS SetBox (นอก SPADA)      │
   │ (SPADA   │        │  Team Agent ─ MCP ─ OneVault     │
   │  ชั้น 5) │        │  (ทำในนามเจ้าของ ไม่มี DID)       │
   └────┬─────┘        └──────┬──────────────────────────┘
        │  ตัวตน/สิทธิ์/หลักฐาน (OIDC, actor assertion ลายเซ็นเจ้าของ)
        └──────────────┬──────┘
                ┌──────▼───────┐
                │ SPADA Node / │
                │ Network      │
                └──────────────┘
```

MyAI และ Team Agent เป็นผู้ช่วยของเจ้าของคนเดียวกันคนละส่วน เชื่อมกันผ่านเจ้าของและสิทธิ์ ไม่ใช่ผ่านสายบังคับบัญชา

## 6. ข้อสรุปและข้อเสนอแนะ

1. **ใช้ได้เป็นกรอบคิดระดับแนวคิดและรายการวัตถุ** (Responsibility, Authority, Skill/Tool/Workflow, Fact 3 ระดับ, Event/Decision) ซึ่งเสริมแผน SPD-ANL-002 โดยตรง
2. **ห้ามนำแผนภาพหลักไปใช้ตามที่เป็น** เพราะรวม MyAI กับ Team Agent และจัด OneManOS/OneVault ไว้ใต้ SPADA ขัดกับ ADR 0014/0016 ที่ Lead ตัดสินไว้เอง ให้ใช้ภาพในข้อ 5
3. **Phase 5 (MyAI เจรจาและ commit แทนกัน)** ทำได้เฉพาะ "เสนอ" การผูกพันต้องมีลายเซ็นเจ้าของ
4. **ตรวจชื่อ Book และคำศัพท์ใหม่** ก่อนนำไปใช้ในเอกสารทางการ
5. **ตัดสินลำดับ**: เริ่มที่ Team Agent (ตามแนะนำ) หรือ MyAI ก่อน (ตามข้อเสนอนี้) ซึ่งเป็นข้อ 1 ที่ค้างใน SPD-ANL-002 §6
