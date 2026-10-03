# สถาปัตยกรรม OneManOS SetBox (นำเสนอเป็นแผนภาพ)

**รหัสเอกสาร:** SPD-ARC-001 · **สถานะ:** ร่างเพื่อทบทวน v0.1 (รวบรวมจากเอกสารใน repo ไม่ได้อ่านซอร์สโค้ดของ SetBox ไม่ได้รันระบบ) · **วันที่:** 2026-10-03
**อ้างอิง:** SPD-CUR-001 (สถานะปัจจุบัน §4–§6, §9, §12), ADR 0014, 0015, 0016, 0017, 0020, 0021, 0022, 0023, **0026 (Proposed)**, SPD-PRC-001 (มาตรฐานจัดซื้อ), SPD-MED-008 (App Catalog/CIDER), doc 340–347 ตามที่ SPD-CUR-001 สรุป
**แผนภาพ:** เขียนด้วย Mermaid (ดูตัวอย่างบน GitHub ได้ทันที) และมีภาพ PNG/PDF ประกอบใน `docs/diagrams/setbox/`

> **ข้อควรรู้ก่อนอ่าน:** เอกสารนี้ "วาดภาพจากเอกสาร" ไม่ใช่ "วาดจากโค้ด" SPD-CUR-001 ระบุเองว่าไม่ได้อ่านโค้ดใน `services/`, `packages/`, `modules/` และซอร์สเครื่องมือเตรียมเครื่อง C# ของ SetBox และไม่ได้รันเทสต์ใดเลย ชื่อไฟล์หรือโมดูลที่ปรากฏ (เช่น `business-api.js`, `human-gate.js`) มาจากคำอธิบายในเอกสารเหล่านั้น ผลตรวจความพร้อมของ SetBox เมื่อ 2026-09-06 คือ **CONDITIONAL** (ใช้ซ้อมด้วยข้อมูลสังเคราะห์เท่านั้น ยังไม่รับรองสำหรับลูกค้าจริง) ภาพที่แสดงจึงเป็น "สถาปัตยกรรมเป้าหมายตามมาตรฐานที่บันทึกไว้" และไม่ได้ยืนยันว่าทุกส่วนทำงานแล้ว

**สัญลักษณ์สถานะ (ใช้ในทุกภาพ):**

- **[ม]** เอกสารบันทึกว่ามีโค้ดหรือเครื่องมือจริง (ยังไม่ได้ตรวจในรอบนี้)
- **[ก]** กำหนดเป็นมาตรฐาน/ADR ที่ Accepted แล้ว ยังต้องตรวจว่าสร้างตามนั้นหรือยัง
- **[ข]** ข้อเสนอ/Proposed (ADR 0024, 0025, 0026 รอ Lead)
- **[?]** ยังไม่ทราบหรือยังค้างตัดสินใจ

---

## ภาพที่ 1 บริบทระบบ: SetBox อยู่ตรงไหน

SetBox คือคลังเอกสารและเครื่องยนต์ธุรกิจของกิจการเดียว ทำงานบนเครื่องเดียว ไม่ต้องต่ออินเทอร์เน็ต ข้อมูลอยู่ในไฟล์เดียวที่เจ้าของหยิบไปได้ (SPD-CUR-001 §9) และอยู่ **นอก** SPADA Node/Network ตาม ADR 0014 SPADA ให้บริการตัวตน สิทธิ์ และหลักฐานผ่าน OIDC และ client access surface

```mermaid
flowchart LR
  subgraph Owner["เจ้าของกิจการและทีม"]
    H["มนุษย์ผู้ใช้<br/>(เจ้าของ พนักงาน)"]
    KS["KeySign<br/>(อุปกรณ์ยืนยันตัวตน)<br/>ต้นแบบ RP2350"]
    MA["MyAI / Team Agent<br/>(ผู้ช่วยเอไอ)"]
  end
  subgraph Box["OneManOS SetBox (เครื่องของกิจการ นอก SPADA)"]
    SB["แกนธุรกิจ + คลังข้อมูล OneVault<br/>+ Human Gate + ตัวดูแลระบบ"]
  end
  subgraph SPADA["SPADA Node / Network"]
    ID["ตัวตน DID + OIDC<br/>id.spada.network"]
    CS["Consent / สิทธิ์"]
    BC["BookChain<br/>หลักฐาน append-only"]
    SR["Service Registry<br/>App Catalog (ข้อเสนอ)"]
  end
  EX["ผู้ให้บริการภายนอก<br/>(ธนาคาร ภาษี)"]
  H --> SB
  KS -. "ลายเซ็น/ยืนยันการมีอยู่ของมนุษย์" .-> SB
  MA --> SB
  SB <-- "OIDC / สัญญา C1 C2<br/>(เมื่อเชื่อมต่อ)" --> ID
  SB <--> CS
  SB --> BC
  SB <--> SR
  SB <--> EX
```

**ข้อสังเกต:** ระบบต้องทำงานพื้นฐานได้แม้ SPADA Bridge ปิด (doc 340 ตามที่ SPD-CUR-001 §12 สรุป) การเชื่อมต่อ SPADA เป็นความสามารถเสริม ไม่ใช่เงื่อนไขการทำงานของ SetBox

---

## ภาพที่ 2 โครงสร้างภายใน SetBox (ชั้นและโมดูล)

```mermaid
flowchart TB
  subgraph UI["ชั้นผู้ใช้"]
    WEB["เว็บ/แอปสำหรับสำนักงาน"]
    AGT["MyAI / Team Agent"]
  end
  subgraph Gate["ชั้นควบคุมสิทธิ์"]
    HG["Human Gate<br/>(human-gate.js: ปฏิเสธชื่อบัญชี agent) [ม]"]
    MCP["onevault-mcp<br/>เครื่องมือให้ agent 25 ตัว [ม]"]
    APPREG["App Catalog Registry + CIDER<br/>(app-catalog.js) [ม]"]
  end
  subgraph Core["แกนธุรกิจ (Node.js 22+ ไม่มี dependency ภายนอก)"]
    API["business-api.js<br/>171 เส้นทาง: ขาย ซื้อ สต็อก บัญชี ภาษี เงินเดือน [ม]"]
    TAX["โมดูลภาษีไทย<br/>vat-return / salary-withholding / allowance-declaration (ล.ย.01) [ม]"]
    CARE["onemanos-care.js<br/>สำรอง + ซ้อมกู้คืนอัตโนมัติ [ม]"]
  end
  subgraph Data["ชั้นข้อมูล"]
    VAULT[("OneVault<br/>ไฟล์เดียว เจ้าของหยิบไปได้ [ม]")]
    AUDIT[("บันทึกตรวจสอบ audit<br/>ทุก state change")]
  end
  subgraph Setup["เครื่องมือเตรียมเครื่อง (setup/)"]
    PROV["ติดตั้ง / ดูแล / ตรวจก่อนส่งมอบ H1–H7 [ม]<br/>(ซอร์ส C# ยังไม่ได้ตรวจ)"]
  end
  WEB --> API
  AGT --> MCP
  MCP --> HG
  WEB --> HG
  HG --> API
  APPREG -. "บัญชี SERVICE ของแอป<br/>ไม่ใช้ฐานข้อมูลตรง" .-> API
  API --> TAX
  API --> VAULT
  API --> AUDIT
  CARE --> VAULT
  PROV -. "สร้างและตรวจเครื่อง" .-> Core
```

**หลักที่บังคับ (ตามเอกสาร SPD-CUR-001 §9):** Human Gate ปฏิเสธชื่อบัญชี agent · การสำรองต้องซ้อมกู้คืนอัตโนมัติ · คำเตือนไม่มีปุ่มปิด · ตรวจก่อนส่งมอบ H1–H7 ("เครื่องนี้เป็นของเขาแล้วจริงหรือยัง")

---

## ภาพที่ 3 ผังติดตั้งทางกายภาพ (PC1 / PC1+PC2 / PC1+PC2+PCn)

ตาม doc 341/342 ที่ SPD-CUR-001 สรุป: topology มี 3 แบบ เครือข่ายแบ่ง VLAN สเปกเครื่อง `SB-S1`/`SB-D2` และพอร์ต 4105/4106/4107 (ความหมายของแต่ละพอร์ตดู doc 342 ผู้ร่างไม่ได้ตรวจ)

```mermaid
flowchart TB
  subgraph T1["แบบที่ 1: PC1 (เครื่องเดียว)"]
    A1["PC1: เครื่องเดียวทำงานครบ (ตามเอกสาร)"]
  end
  subgraph T2["แบบที่ 2: PC1 + PC2"]
    B1["PC1"]
    B2["PC2 (บทบาทดู doc 341/342)"]
    B1 <--> B2
  end
  subgraph T3["แบบที่ 3: PC1 + PC2 + PCn (Physical Worker Fleet)"]
    C1["PC1 (หลัก)"]
    C2["PC2"]
    Cn["PCn (Windows/Linux slot)"]
    C1 <--> C2
    C1 <--> Cn
  end
  NET["เครือข่ายสำนักงาน: VLAN แยกโซน<br/>firewall / VLAN switch / NAS สำรอง (doc 342) [ม]"]
  T1 --> NET
  T2 --> NET
  T3 --> NET
  NOTE["ข้อควรระวัง: Linux ผ่านเพียง contract test<br/>Windows PC1 ตรวจกับเครื่องจริง (README ของ onemanos) [?]"]
  T3 -.-> NOTE
```

**สถานะที่ต้องยืนยัน:** dTPM หรือ fTPM ค้างตัดสินใจ 10–11 รอบ (D11) ต้องถามผู้ขายเป็นลายลักษณ์อักษรก่อนรับใบเสนอราคา · เกณฑ์ผ่านคือ EK certificate ไม่ใช่ชนิด TPM และห้าม vTPM (ADR 0020)

---

## ภาพที่ 4 โหมดการเชื่อมต่อ: Track S (ไม่เชื่อม SPADA) กับ Track C (เชื่อม SPADA)

SPD-PRC-001 §2 ระบุว่าการติดตั้งมีสองเส้นทางที่เป็นไปได้ทั้งคู่

```mermaid
flowchart LR
  subgraph S["Track S: ติดตั้งแบบไม่เชื่อม SPADA"]
    S1["SetBox ทำงานเต็มความสามารถธุรกิจ<br/>บนเครื่องของกิจการ"]
    S2["ตัวตนท้องถิ่น onevault:kind:id (สัญญา C1)"]
  end
  subgraph C["Track C: ติดตั้งแบบเชื่อม SPADA"]
    C1["SetBox + SPADA Bridge"]
    C2["ผูก DID ภายหลังผ่าน OIDC<br/>SubjectBinding (ADR 0022) [ม]"]
    C3["ProvisioningClaim TrustScore ≥ 500 (doc 340) [ม]"]
    C4["บันทึกหลักฐานลง BookChain"]
  end
  S1 --> S2
  S2 -. "อัปเกรดภายหลังได้" .-> C2
  C1 --> C2
  C1 --> C3
  C1 --> C4
```

**หลัก:** ระบบนอก SPADA ห้ามสร้าง `did:spada:*` เอง ใช้ `onevault:<kind>:<id>` แล้วผูกด้วย `SubjectBinding` จาก OIDC (สัญญา C1, ADR 0022) · แฮชข้อเท็จจริงใช้ `sha256:` ของ JSON ตาม RFC 8785 (สัญญา C2, ADR 0021)

---

## ภาพที่ 5 ลำดับการติดตั้งและเปิดใช้เครื่อง (Provisioning)

อิงขั้น 0–7 ในคู่มือสมาชิก doc 341 และเส้นทาง `ProvisioningClaim → api-gateway → WorkSpace → Place` ของ doc 340 (ตามที่ SPD-CUR-001 §12 สรุป) ADR 0017 ห้ามเปิดค่า `APPLIANCE` จนกว่า device attestation จะเสร็จ

```mermaid
sequenceDiagram
  autonumber
  actor Staff as เจ้าหน้าที่ติดตั้ง
  participant HW as เครื่อง SetBox (TPM + EK cert)
  participant Setup as เครื่องมือเตรียมเครื่อง
  participant Reg as ทะเบียนฮาร์ดแวร์ (doc 344)
  participant GW as api-gateway (SPADA)
  participant WS as WorkSpace / Place
  Staff->>HW: เตรียมเครื่องและเปิดใช้
  Staff->>Setup: ติดตั้งและตั้งค่าเครือข่าย
  Setup->>HW: วัด EK certificate (ไม่ใช่ vTPM)
  HW-->>Reg: ตรวจรุ่น + BIOS/firmware ในทะเบียน
  alt รุ่นไม่อยู่ในทะเบียนหรือข้อมูลไม่ครบ
    Reg-->>Staff: ปฏิเสธ (fail closed)
  else ผ่านการรับรอง
    Staff->>GW: ProvisioningClaim (ขั้น 0 ต้องมีอินเทอร์เน็ต, TrustScore ≥ 500)
    GW->>WS: สร้าง WorkSpace → Place
    WS-->>Staff: ตรวจก่อนส่งมอบ H1–H7
  end
  Note over Staff,WS: ห้ามเปิด APPLIANCE จนกว่า attestation จบ (ADR 0017)
```

---

## ภาพที่ 6 ขั้นตอนจัดซื้อและรับรองรุ่นฮาร์ดแวร์ (D0–D8)

ตาม SPD-PRC-001 (Lead อนุมัติเป็นมาตรฐาน 2026-09-29 มีผลกับการซื้อหลังได้รับเงินระดมทุน)

```mermaid
flowchart TB
  D0["D0 สเปกขั้นต่ำ"] --> D1["D1 RFQ + คำถามบังคับ<br/>(ลายลักษณ์อักษร)"]
  D1 --> D2["D2 ประเมินคำตอบ"]
  D2 --> D3["D3 ซื้อตัวอย่าง 1–2 เครื่อง"]
  D3 --> D4["D4 วัดและรับรองรุ่น<br/>Steward บันทึกทะเบียน"]
  D5["D5 ออก PO ล็อต"]
  D5 --> D6["D6 ตรวจรับ + สุ่มวัดซ้ำ"]
  D6 --> D7["D7 provision + ติดตั้ง + H1–H7"]
  D7 --> D8["D8 ดูแลหลังขาย<br/>อัปเดต BIOS = รับรองใหม่"]
  D4 -->|"ไม่ผ่าน"| REJ["REJECTED (ทะเบียน append-only)"]
  D4 -->|"ผ่าน"| OK["APPLIANCE-CANDIDATE / NATIVE-ELIGIBLE"]
  OK --> D5
```

**หลัก:** ไม่ผ่านการรับรอง ไม่ออก PO ล็อต · วัดจากเครื่องจริง ไม่เชื่อเอกสารผู้ขายอย่างเดียว · หนึ่งรุ่น + หนึ่งเวอร์ชัน BIOS/firmware = หนึ่งรายการในทะเบียน · แยกหน้าที่ผู้ขอซื้อ ผู้รับรอง ผู้อนุมัติจ่าย

---

## ภาพที่ 7 เส้นทางของ MyAI/Agent และ Human Gate (ภาพแนวคิด ไม่ใช่ลำดับเรียกฟังก์ชันจริง)

```mermaid
sequenceDiagram
  autonumber
  actor Owner as เจ้าของ
  participant MyAI as MyAI / Team Agent
  participant MCP as onevault-mcp (เครื่องมือที่กำหนด 25 ตัว)
  participant HG as Human Gate
  participant API as business-api
  participant LOG as audit / BookChain
  Owner->>MyAI: สั่งงาน
  MyAI->>MCP: เรียกเครื่องมือที่ได้รับสิทธิ์
  alt ขั้นงาน Tier A (ทำเองได้)
    MCP->>API: ดำเนินการผ่านสัญญา (ไม่ต่อฐานข้อมูลตรง)
  else ขั้นงาน Tier B (ต้องคนอนุมัติ)
    MCP->>HG: ขออนุมัติ
    HG-->>Owner: คำขอ (ไม่มีปุ่มอนุมัติบนจอล็อก)
    Owner->>HG: อนุมัติด้วยชื่อบัญชีมนุษย์ (+ KeySign เมื่อกำหนด)
    HG->>API: ปล่อยให้ดำเนินการ
  else ขั้นงาน Tier C (ห้ามทำเอง)
    MCP-->>MyAI: ปฏิเสธ
  end
  Note over HG: ชื่อบัญชี agent ถูกปฏิเสธเสมอ (human-gate.js)
  API->>LOG: บันทึกการเปลี่ยนแปลงทุกครั้ง
```

**หมายเหตุ:** Tier A/B/C ตาม doc 263 (SPD-MED-008) · D2.1 Accepted: L5 อิสระเฉพาะ operation ที่ย้อนกลับได้ · กฎเหล็กข้อ 8–9 ของ doc 335 (Entropy Integrity, แยก instruction/data ของ MyAI) **Proposed ยังไม่บังคับใช้ [ข]**

---

## ภาพที่ 8 วงจรชีวิตแอป (CIDER) และประตูมนุษย์ 2 บาน

ตาม SPD-MED-008 §3.2 ที่บันทึกว่าบังคับในโค้ด `app-catalog.js` ข้ามขั้นไม่ได้

```mermaid
stateDiagram-v2
  [*] --> C_ลงทะเบียน: register (ต้องมีชื่อเจ้าของ + เหตุผล)
  C_ลงทะเบียน --> I_ยื่นสัญญา: submitVersion (directStorageAccess = false)
  I_ยื่นสัญญา --> Gate1: ประตูมนุษย์ 1 (approveVersion)
  Gate1 --> D_สร้าง
  D_สร้าง --> E_ตรวจ: beginEvaluation
  E_ตรวจ --> D_สร้าง: returnToDevelop (พร้อมเหตุผล)
  E_ตรวจ --> Gate2: ผลทดสอบสัญญา + ต้านไซโล
  Gate2 --> R_ใช้จริง: ประตูมนุษย์ 2 (activateVersion + bindService)
  R_ใช้จริง --> I_ยื่นสัญญา: เปลี่ยนสัญญา
  R_ใช้จริง --> [*]: retire (คนตัดสิน + เหตุผล)
```

**ด่านเรียกคลัง:** บัญชี SERVICE ของแอปที่ไม่อยู่ในทะเบียนหรือยังไม่ live ถูกปฏิเสธ (`APP_NOT_REGISTERED`, `APP_NOT_LIVE`) ข้อจำกัด: กัน "แอป" ไม่กัน "คนที่เอาบัญชีตัวเองให้แอปใช้"

---

## ภาพที่ 9 ชนิดแอปและเส้นทางขึ้นสโตร์ [ข: ADR 0026 Proposed]

```mermaid
flowchart LR
  subgraph Kinds["ชนิดแอป (ข้อเสนอ)"]
    NA["Node App<br/>รันที่ SPADA Node ชั้น L3<br/>เน็ตหลุดใช้ไม่ได้"]
    SA["Setbox App<br/>รันที่ SetBox ในธุรกิจ<br/>เน็ตหลุดใช้ได้ ส่งหลักฐานตามมา"]
    HY["Hybrid<br/>หน้าบ้าน Setbox + หลังบ้าน Node"]
  end
  M["App Manifest [ข]<br/>appId publisherDid kind version artifactHash<br/>dataScopes trustGates pricing sla export"]
  REV["รีวิว (APP_REVIEWED) [ข]"]
  CAT["Node Catalog<br/>LISTING_PUBLISHED"]
  INST["ติดตั้งโดยสมาชิก (APP_INSTALLED) [ข]<br/>+ consent รายวัตถุประสงค์"]
  NA --> M
  SA --> M
  HY --> M
  M --> REV --> CAT --> INST
```

ดูเส้นทางของสมาชิกสร้างแอปเอง และเกณฑ์ผ่านแต่ละขั้น ที่ SPD-PLN-004

---

## ภาพที่ 10 การสำรอง การกู้คืน และการส่งมอบ ("เครื่องนี้เป็นของเขาแล้วจริงหรือยัง")

```mermaid
flowchart TB
  subgraph Run["การดูแลต่อเนื่อง (onemanos-care.js) [ม]"]
    B["สำรองข้อมูล"] --> R["ซ้อมกู้คืนอัตโนมัติ"]
    R --> W{"ผ่านไหม?"}
    W -->|"ไม่ผ่าน"| ALERT["คำเตือนไม่มีปุ่มปิด<br/>ต้องแก้ก่อน"]
    W -->|"ผ่าน"| B
  end
  subgraph Handover["ตรวจก่อนส่งมอบ H1–H7 [ม]"]
    H1["ตรวจ 7 ข้อ H1–H7<br/>(เนื้อหาแต่ละข้อดูเอกสาร handover)"]
  end
  Run --> Handover
  Handover --> OWN["เจ้าของพร้อมใช้ด้วยตัวเอง<br/>เลิกใช้ได้และเอาข้อมูลกลับ"]
```

รายละเอียดของข้อ H1–H7 ดูเอกสารส่งมอบ (handover) ของ `onemanos-setbox` ผู้ร่างอ่านเพียงหัวไฟล์ จึงไม่ระบุเนื้อหาแต่ละข้อ

---

## ภาพที่ 11 สถานะความพร้อมของแต่ละส่วน (ตามเอกสาร ณ 2026-10-03)

```mermaid
flowchart LR
  subgraph Ready["มีโค้ดตามเอกสาร [ม] (ยังไม่ตรวจในรอบนี้)"]
    R1["business-api 171 เส้นทาง"]
    R2["โมดูลภาษีไทย"]
    R3["Human Gate / CIDER Registry"]
    R4["onevault-mcp 25 เครื่องมือ"]
    R5["สำรอง + ซ้อมกู้คืน"]
  end
  subgraph Cond["เงื่อนไขก่อนใช้กับลูกค้าจริง [?]"]
    C1["ผลตรวจ 2026-09-06 = CONDITIONAL<br/>P1 สี่ข้อในเครื่องมือเตรียมเครื่อง C#"]
    C2["ยังไม่เคยส่งมอบลูกค้านอกกิจการผู้พัฒนา"]
    C3["ฮาร์ดแวร์: dTPM/fTPM ค้าง · ทะเบียนฮาร์ดแวร์ว่าง"]
  end
  subgraph Prop["ข้อเสนอรอ Lead [ข]"]
    P1["ADR 0026 App Manifest + แบ่งรายได้"]
    P2["ADR 0024 TrustScore genesis"]
    P3["ADR 0025 Home Node (>100 ล้านสมาชิก)"]
  end
```

**P1 สี่ข้อของผลตรวจ 2026-09-06 (ตามที่ SPD-CUR-001 §9 บันทึก):** (1) signature/manifest ไม่ fail-closed (2) export ไม่บังคับ preflight (3) ผล encryption/release แสดง PASS เกินหลักฐาน (4) network policy ปฏิเสธแล้วยังเชื่อมต่อ · ไม่ทราบสถานะการแก้ ต้องยืนยันก่อนส่งมอบลูกค้าจริง

---

## ตารางสรุปองค์ประกอบ

| องค์ประกอบ | บทบาท | อยู่ในภาพ | สถานะ |
|---|---|---|---|
| OneVault | คลังข้อมูลฝั่งกล่อง ไฟล์เดียว เจ้าของหยิบไปได้ | 2, 10 | [ม] |
| business-api | ขาย ซื้อ สต็อก บัญชี ภาษี เงินเดือน (171 เส้นทาง) | 2 | [ม] |
| โมดูลภาษีไทย | vat-return, salary-withholding, ล.ย.01 | 2 | [ม] |
| Human Gate | ประตูมนุษย์ ปฏิเสธชื่อบัญชี agent | 2, 7, 8 | [ม] |
| onevault-mcp | เครื่องมือ 25 ตัวให้ agent ใช้ | 2, 7 | [ม] |
| App Catalog Registry + CIDER | วงจรชีวิตแอป ประตูมนุษย์ 2 บาน | 2, 8 | [ม] |
| onemanos-care | สำรองและซ้อมกู้คืน | 2, 10 | [ม] |
| เครื่องมือเตรียมเครื่อง (setup/) | ติดตั้ง ดูแล ตรวจก่อนส่งมอบ H1–H7 | 2, 5, 10 | [ม] แต่ P1 สี่ข้อ |
| ทะเบียนฮาร์ดแวร์ (doc 344) | รับรองรุ่นด้วย EK cert append-only | 5, 6 | [ก] แต่ทะเบียนว่าง |
| KeySign | ยืนยันการมีอยู่ของมนุษย์ ลายเซ็น | 1, 7 | ต้นแบบ RP2350 · ชิปยังไม่ตัดสิน |
| App Manifest / สโตร์ | Node App / Setbox App / Hybrid | 9 | [ข] |
| SPADA Bridge / OIDC | ตัวตน DID, consent, BookChain | 1, 4, 5 | OIDC ตัดสินแล้ว (ADR 0023) แต่ผู้ร่างพบว่ายังไม่มี provider ในโค้ด ณ 2026-09-22 |

---

## คำถามที่ต้องตรวจก่อนนำไปเสนอภายนอก
1. ชื่อไฟล์ จำนวนเส้นทาง (171) และจำนวนเครื่องมือ (25) ยังตรงกับโค้ดล่าสุดหรือไม่ (ตัวเลขมาจากสแนปช็อตเดือนกันยายน)
2. พอร์ต 4105/4106/4107 แต่ละตัวทำอะไร (ผู้ร่างไม่ได้เปิด doc 342)
3. สถานะการแก้ P1 สี่ข้อ และผลตรวจซ้ำ
4. ความหมายของ H1–H7 แต่ละข้อ เพื่อใส่ในภาพที่ 10
5. SetBox รุ่นที่ขายหรือส่งมอบเป็นแบบ Track S หรือ Track C ก่อน
6. เนื้อหาที่ห้ามเผยแพร่ภายนอก: อย่าส่งเอกสารกลุ่ม business-strategy/patents/founder-profile (ตามข้อกำหนดของ `spada-specs`) ก่อน Lead อนุมัติ

## ข้อแก้ไข (errata) หลังเทียบโค้ด 2026-10-03
ดู SPD-ARC-002 สำหรับรายละเอียดทั้งหมด ข้อที่กระทบภาพในเอกสารนี้
- ภาพที่ 2, 7: `onevault-mcp` มีเครื่องมือ **31 ตัว** (ไม่ใช่ 25) รวมกลุ่ม `onevault_app_*` 9 ตัว
- ภาพที่ 1, 4, 11: OIDC provider ของ SPADA **มีโค้ดและเทสต์แล้ว** ใน `spada-monorepo` (ข้อความ "ยังไม่มี provider" ล้าสมัย) แต่ **SetBox ยังไม่ได้เชื่อม** (OIDC ฝั่ง SetBox เป็นแบบทั่วไป ไม่มี SubjectBinding)
- ภาพที่ 5: ฝั่ง SPADA มี `ProvisioningClaim` (ต้อง TrustScore ≥ 500) แต่ **ตัวตรวจ EK certificate ยังไม่มี** (มีเฉพาะ interface และ Null verifier)
- ภาพที่ 3: พอร์ต 4105/4106/4107 ไม่พบในโค้ด (อยู่ใน doc 342)

*ฉบับร่าง v0.1 เขียนโดย Claude เพื่อให้ Lead ตรวจ ยังไม่ผ่านการลงนามหรือรับรอง*
