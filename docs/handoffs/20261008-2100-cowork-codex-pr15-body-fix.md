---
id: 20261008-2100-cowork-codex-pr15-body-fix
from: cowork            # ร่างโดย Claude (cloud session) ตามคำขอของ Lead ยังไม่ได้ส่งจริง
to: codex
type: request
priority: normal
refs:
  - chatchailim/onemanos-setbox PR #15 (head 89a1d92, base master e706ed1)
  - 20261008-1900-cowork-codex-reply-pr15
needs_reply_by: 2026-10-10   # <LEAD: ยืนยันหรือแก้วันที่>
requires_human: true
---

## ผลตรวจของ Cowork (2026-10-08)

CI ของ head `89a1d92` เขียวครบ 8/8 (core ubuntu/windows ทั้ง 2 ชุด, kit, docker-smoke, test ubuntu/windows) · mergeable clean · ไม่มี review thread ค้าง · master ยังเป็น `e706ed1` · ไฟล์ทั้ง 6 อยู่ใต้ `work-orders/reports/` ไม่แตะโค้ดผลิตภัณฑ์

## ให้ทำ

1. **แก้ข้อความ PR #15:** บรรทัด "New-head CI is pending, not claimed green" ล้าสมัยแล้ว ให้แก้เป็นผลจริง (8/8 เขียวบน `89a1d92` พร้อมลิงก์ run) ห้ามเขียนเกินกว่านั้น
2. **ยืนยันกลับ** (ตอบเป็น `type: answer` หรือคอมเมนต์ใน PR) ว่า
   - หลังแก้ข้อความ head ยังเป็น `89a1d92` (ถ้ามี commit ใหม่ ให้ระบุและรอ CI ใหม่)
   - รัน `node work-orders/reports/testspec-evidence/preflight.cjs` ซ้ำแล้วผลยังเป็น 171 routes / 34 tools / 136 cells / 36 denied และ hash ใน `source-hashes.json` ตรงกับไฟล์ที่ใช้จริง
   - ข้อความ "ไม่ผ่าน/ยังไม่ได้ทดสอบ" (D1–D4, 100 เซลล์ที่แค่แสดงรายการ) ยังอยู่ครบหลังแก้

## ห้ามทำ

- ห้ามปลด draft ห้าม merge และห้ามใส่ DCO sign-off แทน Lead
- ห้ามกำหนดเลข `POO-WO-009` หรือผู้ตรวจรับเอง ยังเป็นข้อเสนอจนกว่า Lead ตัดสิน
- ห้ามแก้โค้ดผลิตภัณฑ์ใน PR นี้

## ค้างที่ Lead (ไม่ใช่งานของ Codex)

DCO sign-off · ยืนยันเลข POO-WO-009 และผู้ตรวจรับ · ตัดสินปลด draft/merge
