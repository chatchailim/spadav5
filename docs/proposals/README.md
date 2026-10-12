# ข้อเสนอสถาปัตยกรรม (PROP)

- **รหัสเอกสาร: SPD-PRP-000**

ชุดนี้ร่างก่อนเห็นระบบจริง จึงใช้ prefix **PROP** เพื่อไม่ให้ชนกับ ADR จริงใน `spada-monorepo/architecture/adr/` (0001–0027)
แต่ละไฟล์มีกล่อง "เทียบกับระบบจริง" ระบุ ADR/service ที่ครอบคลุมแล้ว ให้ยึด ADR จริงเป็นหลัก

| PROP | หัวข้อ | สถานะเทียบกับระบบจริง |
|---|---|---|
| [0001](PROP-0001-constitution-and-threat-model.md) | Constitution และ Threat model | Partially covered (doc 335 Proposed) |
| [0002](PROP-0002-identity-did-vc-keysign.md) | Identity: DID/VC + KeySign | Mostly covered |
| [0003](PROP-0003-consent-ledger.md) | Consent Ledger | Mostly covered |
| [0004](PROP-0004-personal-data-vault-opof.md) | Personal Data Vault (OPOF) | Covered |
| [0005](PROP-0005-social-key-recovery.md) | Social key recovery | Covered |
| [0006](PROP-0006-node-roles-consensus-governance.md) | Node roles, consensus, governance | Mostly covered |
| [0007](PROP-0007-personal-agent-and-sandbox.md) | Personal AI Agent และ sandbox | Covered |
| [0008](PROP-0008-digital-economy-layer.md) | Digital economy layer | Superseded โดย [MEMBER-ECONOMY](../MEMBER-ECONOMY.md) |
| [0009](PROP-0009-offline-and-mesh-resilience.md) | Offline และ mesh resilience | Split (SetBox offline covered; mesh = gap) |
| [0010](PROP-0010-open-standards-and-exit.md) | Open standards และ exit | Partially covered |

ดู [GAP-ANALYSIS](../GAP-ANALYSIS.md) สำหรับช่องว่างที่แท้จริง หากข้อเสนอใดจะเดินหน้า ให้เปิดเป็น ADR ใน monorepo ด้วยเลขถัดไป (0028 เป็นต้นไป) ตามขั้นตอนของทีม
