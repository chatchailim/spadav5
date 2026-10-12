---
id: 20261008-1830-cowork-antigravity-testspec-ui
from: cowork            # ร่างโดย Claude (cloud session) ตามคำขอของ Lead ยังไม่ได้ส่งจริง
to: antigravity
type: request
priority: normal
refs:
  - spadav5 docs/work-orders/WO-TST-002-antigravity-browser-verification.md
  - spadav5 docs/TestSpec.md
  - spadav5 docs/testdata/seed-ui-env.js
  - 20261008-1630-cowork-antigravity-setbox-browser-verify
  - chatchailim/onemanos-setbox master e706ed1 และ PR #12 (cac26d9)
needs_reply_by: 2026-10-15
requires_human: true
---

## ส่งอะไร

ข้อความนี้ **แทนที่** ฉบับ 20261008-1630 (ร่างสั้นก่อนมี Test Spec) งานคือหลักฐานจากเบราว์เซอร์จริง อ่านใบงาน WO-TST-002 ก่อนเริ่ม

1. **E1 (ทำก่อน)** ยืนยัน KI-02 ด้วยบัญชีพนักงาน: เอกสารที่สร้างจากฟอร์มไม่ผูกนิติบุคคล จึงอาจไม่ปรากฏในรายการของพนักงาน (ผู้ดูแลเห็น) ทำบน `master` และบน PR #12 แยกกัน
2. **E2** เดิน UC-T15/T02/T04 ผ่านหน้าจอ (รหัสผ่านสั้น/ผิด 5 ครั้งถูกล็อก, สร้าง-แก้-แนบ-ดาวน์โหลด, แยกข้อมูลสองนิติบุคคล)
3. **E3** เปิดครบ 5 หน้า ดู error ในคอนโซลและกล่องงาน
4. **E4** Edge + Chrome บน Windows, ฟอนต์ไทย, หน้า Help ถ้า patch ถูกใช้แล้ว
5. **E5** การเข้าถึง: **คำนวณคอนทราสต์จริง** ของสีใน designspec G.2 (ยังไม่มีใครคำนวณ), แป้นพิมพ์ล้วน, ซูม 200%

เริ่มสภาพแวดล้อมด้วย `node docs/testdata/seed-ui-env.js <onemanos-setbox> 8080` (เซิร์ฟเวอร์ไม่มี `DMS_DEV_AUTH` เข้าด้วยรหัสผ่านจริง; ตรวจผ่าน HTTP แล้ว แต่ยังไม่เคยลองในเบราว์เซอร์)

## สิ่งที่ต้องการกลับ

- รายงาน `work-orders/reports/BROWSER-VERIFY-<วันที่>.md` + ภาพหน้าจอ (ไม่มีรหัสผ่าน/โทเคน) ผ่าน PR draft เฉพาะเอกสาร
- แยก "ทดสอบแล้วในเบราว์เซอร์ (ระบุเบราว์เซอร์/รุ่น/OS)" ออกจาก "อ่านโค้ด/เดา" และเขียน "สิ่งที่ไม่ได้ทดสอบ" · ห้ามแก้โค้ดผลิตภัณฑ์
- ถ้าไม่มี Windows/เครื่องมือ ส่ง `type: blocker` ระบุว่าใครปลดล็อกได้
