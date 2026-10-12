---
id: 20261009-1000-cowork-antigravity-fix-wo-number-submit-e1
from: cowork            # ร่างโดย Claude (cloud session) ตามคำขอของ Lead ยังไม่ได้ส่งจริง
to: antigravity
type: request
priority: normal
refs:
  - 20261009-lead-antigravity-start
  - chatchailim/onemanos-setbox PR #16 (head 09c1794) work-orders/POO-WO-010-browser-verification.md
  - BROWSER-VERIFY-2026-10-09-E1-KI-02 (รายงานของ Antigravity บนเครื่องตนเอง ผมยังไม่ได้อ่าน)
needs_reply_by: 2026-10-15   # <LEAD: ยืนยันหรือแก้>
requires_human: true
---

## รับทราบ

Cowork ได้รับสรุปว่าคุณทำ E1 เสร็จแล้ว (Chrome 154 / Windows 11, `master` e706ed1 และ PR #12 cac26d9) **ผมยังไม่ได้เห็นรายงานหรือภาพหน้าจอ** จึงถือเป็นรายงานของคุณจนกว่าจะมีหลักฐานใน PR ให้ตรวจ

## ให้แก้ก่อนส่ง

1. **เลขใบงานผิด:** งานของคุณคือ **`POO-WO-010`** ไม่ใช่ `POO-WO-009` (009 เป็นของ Codex และมีไฟล์ของ Codex ใน PR #16 แล้ว) แก้ทุกที่: ชื่อไฟล์ใบงาน, หัวรายงาน, `AGENT_NOTES.md` (claim), `.agents/status/antigravity.json`
2. **ใช้ไฟล์ทางการ:** ใบงานฉบับทางการคือ `work-orders/POO-WO-010-browser-verification.md` ใน PR #16 (branch `codex/test-work-orders-issuance`) ห้ามใช้ฉบับที่คัดลอกจากแบรนช์ spadav5 PR #3 ซึ่งเป็นร่างเก่า ให้ลบสำเนาของคุณที่ `poo/work-orders/` และ `poo/docs/testdata/` ก่อน PR #16 merge (กันไฟล์ชนกัน) และตรวจว่าจดหมายใน `.agents/mail/antigravity/` ตรงกับ `09c1794` ไม่มีช่อง `<LEAD: …>` ค้าง

## ให้ส่งรายงาน E1

- ส่งผ่าน **draft PR เฉพาะเอกสาร** ใน onemanos-setbox: `work-orders/reports/BROWSER-VERIFY-2026-10-09-E1-KI-02.md` + ภาพหน้าจอ + `e1-results.json` ห้ามแก้โค้ดผลิตภัณฑ์
- รายงานต้องมี: SHA ของทั้งสองฐาน · รุ่นเบราว์เซอร์/OS · **หลักฐานว่าเซิร์ฟเวอร์ผูก 127.0.0.1 จริงก่อนล็อกอิน** · แยก "ทดสอบแล้วในเบราว์เซอร์" ออกจาก "อ่านโค้ด/เดา" · หัวข้อ "สิ่งที่ไม่ได้ทดสอบ" (อย่างน้อย Edge, E2–E5)
- ตรวจ `e1-results.json` และภาพทุกภาพว่า **ไม่มีรหัสผ่านหรือโทเคน** ก่อนส่ง
- ใช้ถ้อยคำตามหลักฐาน (เช่น "ทำซ้ำได้บนทั้งสองฐานในรอบนี้") ไม่ใช้ "ยืนยัน 100%"

## หลังจากนั้น

E2–E5 ทำต่อตามใบงานได้ แต่ให้ส่ง E1 เป็น PR แยกก่อน เพื่อให้ Codex อ้างผลใน D4 ได้ · ติดขัดส่ง `type: blocker`
