---
id: 20261008-1630-cowork-antigravity-setbox-browser-verify
from: cowork            # ร่างโดย Claude (cloud session) ตามคำขอของ Lead ยังไม่ได้ส่งจริง
to: antigravity
type: request
priority: normal
refs:
  - chatchailim/onemanos-setbox PR #12 (codex/document-operator-form)
  - chatchailim/onemanos-setbox PR #11 (login entry, merged)
  - spadav5 docs/DELIVERY-READINESS-TH.md
needs_reply_by: 2026-10-10
requires_human: false
---

## ส่งอะไร

เพื่อเตรียมส่งมอบ/นำเสนอ ต้องมีหลักฐานว่าหน้าจอที่ลูกค้าเห็นใช้งานได้จริงในเบราว์เซอร์ ไม่ใช่แค่เทสต์ผ่าน ขอบเขตตามแนวถนัดของ Antigravity (UI + browser-verified)

## งาน

1. รัน setbox ตาม README (หรือ `docker run` จาก Dockerfile) แล้วเปิดเบราว์เซอร์ตรวจ: เข้าสู่ระบบด้วยรหัสผ่านภายใน (PR #11), ฟอร์มเอกสารของเจ้าหน้าที่ และป้ายเตือนข้อมูลสาธิตการย้ายระบบ (PR #12)
2. จับภาพหน้าจอเส้นทางหลัก + กรณีล้มเหลว (รหัสผิด ฟอร์มไม่ครบ) ว่ามีข้อความแสดงชัด
3. บันทึกสิ่งที่ผิดปกติ ไม่แก้โค้ดนอก claim ของตน และขอ Work Claim ก่อนแก้ไฟล์ใด ๆ

## สิ่งที่ต้องการกลับ

รายงานสั้น + ภาพหน้าจอ แยก "ผ่านในเบราว์เซอร์" ออกจาก "ไม่ได้ทดสอบ" ระบุเวอร์ชัน/commit ที่ใช้ทดสอบ อย่าอ้างว่าผ่านถ้าไม่ได้รันจริง
