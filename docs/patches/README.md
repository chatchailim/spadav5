# Patch สำหรับ `onemanos-setbox`: ให้ CI รันตอน push เข้า `master`

- วันที่: 2026-10-08 · ร่างโดย Claude ยังไม่ได้ใช้กับ repo จริง (ผมไม่มีสิทธิ์เขียน repo นั้น)
- สาเหตุ: `.github/workflows/ci.yml` ตั้ง `push: branches: [main]` แต่ branch หลักของ repo คือ `master` ใน 30 รอบล่าสุดที่ตรวจ ไม่มีรอบ `push` เข้า `master`
- การแก้: บรรทัดเดียว `branches: [main]` เป็น `branches: [main, master]` (คง `main` ไว้เผื่อเปลี่ยนชื่อ branch ภายหลัง)
- ตรวจแล้ว: `git apply --check` ผ่านกับ `master` ที่คอมมิต `e706ed1`

## วิธีใช้

```bash
git clone https://github.com/chatchailim/onemanos-setbox && cd onemanos-setbox
git switch -c ci/run-on-push-to-master
git apply /path/to/spadav5/docs/patches/setbox-ci-push-master.patch
git commit -s -am "ci: run CI on push to master"   # repo ใช้ DCO (Signed-off-by)
git push -u origin ci/run-on-push-to-master          # แล้วเปิด PR เข้า master
```

## ข้อความ PR ที่แนะนำ

> **ci: run CI on push to master.** ทริกเกอร์ `push` ระบุเฉพาะ `main` แต่ branch หลักคือ `master` จึงไม่มีรอบ CI หลัง merge เข้า `master` เพิ่ม `master` ในรายการ branch (บรรทัดเดียว) ไม่แตะงานหรือเวลา timeout ของ job ใด

## สิ่งที่ควรดูหลังใช้

หลัง merge ให้เปิดแท็บ Actions ว่ามีรอบ CI แบบ `push` บน `master` และผ่าน ถ้า repo ตั้ง branch protection แบบ required check ชื่อ check ไม่เปลี่ยน
