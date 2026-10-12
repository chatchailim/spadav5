---
id: 20261008-1800-cowork-codex-testspec-followup
from: cowork            # ร่างโดย Claude (cloud session) ตามคำขอของ Lead ยังไม่ได้ส่งจริง
to: codex
type: request
priority: normal
refs:
  - spadav5 docs/work-orders/WO-TST-001-codex-test-data-and-matrices.md
  - spadav5 docs/TestSpec.md
  - spadav5 docs/testdata/smoke-dms.js
  - chatchailim/onemanos-setbox master e706ed1
needs_reply_by: 2026-10-15
requires_human: true
---

## ส่งอะไร

Claude ทำ Test Spec (SPD-TST-002) เสร็จ พร้อมสคริปต์ควัน DMS 40 ข้อที่รันผ่านบน Linux (40 ผ่าน + KI 2) ยังมีช่องว่าง 4 ข้อที่เหมาะกับขอบเขตของ Codex (backend/tests) รายละเอียดอยู่ในใบงาน WO-TST-001 (อ่านก่อนเริ่ม)

1. **D1** ตัวอย่างข้อมูล body ของโมดูลธุรกิจ (sales/accounting/stock/purchase/payroll/tax/leave/time) ให้รันครบวงจรบน Linux และ Windows
2. **D2** แมตทริกซ์สิทธิ์จากโค้ด: บทบาท MCP 4 × เครื่องมือ `onevault_*` และบทบาทเอกสาร 10 × การกระทำ DMS พร้อมเทสต์ยืนยัน และอธิบายว่าทำไมเอกสารบอก 25 เครื่องมือแต่ซอร์สมี 34
3. **D3** ตามรอยรายเส้นทางของ 171 เส้นทางธุรกิจ (แทนฮิวริสติกที่นับต่ำกว่าจริง)
4. **D4** สืบสวน KI-01 (Idempotency-Key ของการสร้างเอกสารไม่ถูกใช้) และ KI-02 (เอกสารไม่ผูกนิติบุคคลไม่อยู่ในรายการของพนักงาน) **รายงาน+ข้อเสนอเท่านั้น ห้ามแก้โค้ดผลิตภัณฑ์** (ส่วนยืนยันในเบราว์เซอร์เป็นของ Antigravity: WO-TST-002)

## สิ่งที่ต้องการกลับ

- PR แบบ draft ใน onemanos-setbox (ห้าม merge; DCO ให้ Lead ลงนาม) และรายงานใน `work-orders/reports/` ต่อชิ้น
- แยก "รันจริงแล้ว" ออกจาก "อ่านโค้ดอย่างเดียว" ทุกข้อ และเขียน "สิ่งที่ไม่ได้ทดสอบ"
- ถ้าจะแก้ KI-01/KI-02 จริง ส่ง `type: blocker` ขออนุมัติ Lead ก่อน (`requires_human: true`)
- ข้อมูลสังเคราะห์เท่านั้น และ `scan-before-release.js` ต้องยัง exit 0
