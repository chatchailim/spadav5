# ข้อความขอให้ผู้ดูแลนำเข้าเอกสาร (2026-10-01)

- **รหัสเอกสาร: SPD-HND-002** · ร่างโดย Claude ให้ Lead คัดลอกส่งผู้ดูแล · **ยังไม่ได้ส่ง** Claude ไม่มีสิทธิ์เขียน monorepo/`onemanos-setbox` และไม่ส่งข้อความเอง
- ต้นทางทุกไฟล์: repo `chatchailim/spadav5` branch `claude/upbeat-hopper-xzvp2s` (public ห้ามนำตัวระบุอุปกรณ์จริงใด ๆ ไปใส่ในไฟล์ที่นำเข้า)

---

**ถึงผู้ดูแล:** Lead อนุมัติให้ขอนำเข้าเอกสารร่างต่อไปนี้ ทุกรายการเป็น **ร่างที่ Claude เขียนแทน Lead** กรุณาตรวจข้อความก่อนรวม และตรวจเลขที่ว่างที่ remote ก่อนใช้เลขที่เสนอ

## A. นำเข้าได้เลย (ลำดับแนะนำ)

| ลำดับ | ไฟล์ต้นทาง (`docs/…`) | ปลายทาง | หมายเหตุ |
|---|---|---|---|
| 1 | `work-orders/POO-WO-006-supervisor-pid-validation.md` | `onemanos-setbox/work-orders/` (เลข 006) | ใบงานเล็ก แก้บั๊ก PID 0 เริ่มได้ก่อน เพิ่มแถวใน `work-orders/README.md` |
| 2 | `work-orders/POO-WO-007-supervisor-restart-backoff-enforcement.md` | `onemanos-setbox/work-orders/` (เลข 007) | ใบงานกลาง ทำหลัง 006 ได้ |
| 3 | `decisions/PATCH-M4-relabel-WO-J.md` | `spada-monorepo/AGENT_NOTES.md` | เปลี่ยนบรรทัด WO-J จาก `M4 (R2)` เป็น `M3 (R2)` เพราะ `milestones.md` นิยามเพียง M0–M3 |
| 4 | `decisions/DECISION-MEMO-006-adr-0024-0026-and-doc340-s10.md` §ข้อความปรับสถานะ | ADR 0024/0025/0026 และ doc 340 §10 | Lead อนุมัติ: 0024 รับ (มีเงื่อนไข), 0025 รับเฉพาะทิศทาง, 0026 รับเฉพาะข้อ A1–A2 · **ข้อความ patch อยู่ในบันทึก ผู้ดูแลเป็นผู้ใช้** |

## B. นำเข้าเป็นร่าง รอการรับ (ห้ามเริ่มงานตามใบงาน)

| ไฟล์ต้นทาง | ปลายทางที่เสนอ | เงื่อนไข |
|---|---|---|
| `decisions/ADR-NEXT-keysign-actor-assertion-bridge-draft.md` (SPD-ADR-D05) | `spada-monorepo` ADR ถัดไปที่ว่าง | Lead ตอบ Q1–Q5 แล้ว (ตามข้อเสนอเริ่มต้น) · **ต้องมีผู้ตรวจความปลอดภัยอิสระ** · ผู้ดูแลรับ/แก้เป็นผู้ตัดสินสุดท้าย |
| `work-orders/WO-SPADA-KEYSIGN-ASSERTION-VERIFIER.md` (SPD-WO-008) | `spada-monorepo` ใบงานฝั่ง SPADA | **ห้ามเริ่มจน ADR-D05 ถูกรับ** · ข้อ 9 ยังมี `[●]` (หน่วยอุปกรณ์/ผู้กดปุ่ม Lead ต้องระบุ) |
| `decisions/ADR-NEXT-responsibility-record-draft.md` (SPD-ADR-D04) | `onemanos-setbox` ADR-008 (005–007 มีแล้ว) หรือ monorepo 0028 | **Lead อนุมัติเฉพาะทิศทาง ยังไม่ได้ตรวจเต็ม** · ผู้ดูแลเลือกที่ตั้ง |
| `work-orders/POO-WO-008-durable-job-idempotency.md` | `onemanos-setbox/work-orders/` (เลข 008) | **ห้ามเริ่มจน ADR-D04 ถูกรับ** |

## C. ห้ามนำเข้า / ไม่ต้องทำ

- `docs/work-orders/REVIEW-*` และบันทึกอนุมัติ เป็นบันทึกภายใน ไม่ใช่เอกสารผลิตภัณฑ์
- หลักฐาน A6 (มี public key ที่เชื่อมโยงอุปกรณ์ได้) อยู่ใน `onemanos-setbox` branch `codex/poo-wo-005-spike` (private) เท่านั้น
- แพตช์ SPD-WO-004 ฉบับเก่าของ Codex (จาก `dbba741`) **เลิกใช้ ไม่ apply**
- ไม่แก้ Fact v0, สัญญา C1/C2, ไม่เปิดการเขียนหรืออนุมัติอัตโนมัติของเอเจนต์

## D. ที่ยังค้างและต้องการจากผู้ดูแลหรือทีม

- raw log VM Server Core เดิม 4 ไฟล์ (`b2-evidence-final.zip`, `b2-summary.json`, `B2-result-report.md`, `readiness.json`) ยังไม่ได้รับ
- ผู้ตรวจความปลอดภัยอิสระสำหรับ ADR-D05
- ยืนยันเลข ADR/ใบงานที่ว่างก่อนนำเข้า แล้วแจ้งเลขจริงกลับให้ Lead เพื่ออัปเดตเอกสารต้นทาง

กรุณาตอบกลับว่ารายการใดนำเข้าแล้ว (พร้อม commit) รายการใดมีข้อแก้
