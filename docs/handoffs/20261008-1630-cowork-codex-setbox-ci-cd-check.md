---
id: 20261008-1630-cowork-codex-setbox-ci-cd-check
from: cowork            # ร่างโดย Claude (cloud session) ตามคำขอของ Lead ยังไม่ได้ส่งจริง
to: codex
type: request
priority: normal
refs:
  - chatchailim/onemanos-setbox .github/workflows/ci.yml
  - spadav5 docs/DELIVERY-READINESS-TH.md (ข้อ 3.1)
  - spadav5 docs/patches/README.md
needs_reply_by: 2026-10-10
requires_human: false
---

## ส่งอะไร

Lead บอกว่าใช้ patch แล้ว (`push: branches: [main, master]` ใน `ci.yml` ของ `onemanos-setbox`) แต่ ณ 2026-10-08 Claude ยังไม่เห็น branch/PR ของ patch บน GitHub และ `master` ยังอยู่ที่ `e706ed1` กับ 30 รอบ CI ล่าสุดไม่มีรอบ `push` เข้า `master`

## งาน (อ่านและรายงานก่อน ห้ามแก้ workflow ที่ไม่เกี่ยว)

1. ยืนยันว่า patch อยู่ที่ไหน (branch/PR) และหลัง merge เข้า `master` มีรอบ CI แบบ `push` จริงและผ่าน แนบลิงก์ run
2. ถ้ามี branch protection แบบ required check ตรวจว่าชื่อ check ยังตรงหลังแก้
3. ร่างทางเลือก CD ของ setbox (เอกสาร ไม่ลงมือ): ปล่อยชุดส่งมอบ (`scripts/build-kit.js`) เป็น GitHub Release พร้อม checksum, หรือ push อิมเมจ พร้อมข้อดีข้อเสียและความเสี่ยง ปลายทางใดต้องให้ Lead เลือกก่อน

## สิ่งที่ต้องการกลับ

ไฟล์รายงานสั้น (≤1 หน้า) + ลิงก์ run หลักฐาน ระบุ "ตรวจแล้ว" แยกจาก "อ่านอย่างเดียว" ข้อ 3 ส่งเป็น `type: answer` ที่มี `requires_human: true` เพื่อให้ Lead เลือกปลายทาง
