# POO-WO-007 — บังคับ `nextRestartAt` ทุกทางเข้า และไม่นับการเริ่มก่อนกำหนดเข้าโควตา restart

> **ฉบับพร้อมนำเข้า `onemanos-setbox/work-orders/`** · รหัสต้นทางใน repo spadav5: SPD-WO-006 · **ร่างโดย Claude แทน Lead** ตามที่ Lead อนุมัติให้แยกใบงานแก้ในบทสนทนา 2026-10-01 · **Lead ยังไม่ได้ตรวจข้อความ**
> ก่อนนำเข้า: ตรวจว่าเลข 007 ว่างที่ remote และเพิ่มแถวใน `work-orders/README.md`

- ผู้ทำ: **Codex** · ผู้ตรวจรับ: **Cowork** · ผู้ตัดสิน: **Lead**
- ขนาด: **กลาง** · Priority: **P1** · Milestone: M2 · ควรทำ **หลัง** POO-WO-006 (ไม่บังคับ แต่ทดสอบง่ายกว่าเมื่อเริ่มบน state ใหม่ได้)
- ประเภท: **แก้โค้ดผลิตภัณฑ์ + เทสต์เวลาจริง** · branch แยก
- ที่มา: [SPD-REV-004](REVIEW-POO-WO-005-round3-2026-10-01.md) ข้อค้นพบ F2 · หลักฐาน B2 กรณี 06 (restart-scheduled 2,000 ms แต่ service-start ถัดไปห่าง 102 ms; 5,000 ms แต่ 76 ms)
- สถานะ: **ร่าง รอ Lead ตรวจ นำเข้า และมอบผู้ทำ**

## ปัญหา

ใน `optimus-edition/package-files/operations/supervisor.js`:

1. `scheduleRestart` (บรรทัด 19) ตั้ง `nextRestartAt` และตั้ง `setTimeout` รอ backoff
2. แต่ `startService` (บรรทัด 18) **ไม่ตรวจ `nextRestartAt`** และ `startEligible()` ถูกเรียกจาก `healthCheck` ทุกรอบ monitor (บรรทัด 22) และหลังบริการอื่นพร้อม (ใน `startService`) บริการที่กำลังรอ backoff จึงถูกเริ่มก่อนกำหนด
3. `startService` เรียก `s.restarts.push(Date.now())` ทุกครั้งที่เริ่ม การเริ่มก่อนกำหนดจึงนับเข้า `maxAttemptsInWindow` เร็วกว่าที่ออกแบบ และ `delayFor` ใช้จำนวน restart เป็นดัชนี backoff จึงกระโดดขั้นเร็วกว่าที่ตั้งใจ

ผลที่เห็นขึ้นกับความถี่ของ `healthCheck` (monitor 200 ms ในการทดลอง, 15 วินาทีใน production) ผลบน production จริงต้องวัด

## ขอบเขต

ทำ: บังคับ backoff ในจุดเริ่มบริการจุดเดียว · นับโควตาเฉพาะการเริ่มจริงที่ผ่าน backoff · เทสต์วัดเวลาจริง
ไม่ทำ: ไม่เปลี่ยนค่า backoff/limit ไม่เพิ่ม scheduler หรือ job (POO-WO-008) ไม่แก้พฤติกรรม `restart-limit` ที่บริการหยุดถาวร (บันทึกเป็นข้อสังเกตหากเห็นว่าควรมี)

## แนวทางแก้ที่เสนอ

```js
// startService ต้นฟังก์ชัน
if (s.nextRestartAt && Date.now() < Date.parse(s.nextRestartAt)) return;

// scheduleRestart: ใน callback ของ setTimeout ล้างค่าก่อนเรียก
setTimeout(() => {
  if (mode === "running" && !s.child) { s.nextRestartAt = null; startService(s.def.name); }
}, delay);
```

**ข้อควรระวังสำคัญ:** `setTimeout` อาจทำงานก่อน `nextRestartAt` เล็กน้อย (ความละเอียดของตัวจับเวลา) ถ้าไม่ล้าง `nextRestartAt` ใน callback ก่อนเรียก `startService` บริการอาจไม่ถูกเริ่มเลยจนกว่ารอบ monitor ถัดไป และทำให้ผลเทสต์ผันผวน

## เกณฑ์รับงาน

| กรณี | ผลที่ต้องได้ |
|---|---|
| monitor สั้น (เช่น 200 ms) backoff `[1000, 2000]` | เวลาจาก `restart-scheduled` ถึง `service-start` ถัดไป ≥ `delayMs` ลบความคลาดเคลื่อนที่กำหนดล่วงหน้า (เสนอ ≤ 50 ms) ทุกครั้ง |
| monitor ยาว (เช่น 15,000 ms ตามค่า production) | ไม่เริ่มก่อนกำหนด และเริ่มภายในหนึ่งรอบ monitor หลังครบ backoff หรือตรงเวลาจาก timer |
| มีบริการอื่นพร้อมระหว่างรอ backoff | บริการที่รอ ไม่ถูกเริ่มก่อนกำหนด |
| ล้มซ้ำจนครบ `maxAttemptsInWindow` | `restart-limit` เกิดหลังการเริ่ม **จริง** ครบจำนวนที่ตั้ง (ไม่เกิดเร็วกว่า) |
| ดัชนี backoff | เลื่อนขั้นตามจำนวนการเริ่มจริงเท่านั้น |
| `npm test` ที่ราก | เท่าเดิมบน master (842/847 ล้ม 5 ข้อเดิม) |

เก็บหลักฐานเป็นไฟล์ `operations-events.jsonl` ดิบ พร้อมตารางเวลา scheduled เทียบ start จริง ทดสอบทั้ง Windows และ Linux และบันทึกค่า config ที่ใช้

### กรณีเพิ่มจากร่างของผู้ทำ (`follow-up-fix-drafts.md` ใน `f1927b5`..`03fbed1`, รับเข้ามาแล้ว 2026-10-01)

- policy เริ่ม/restart **จุดเดียว** ครอบคลุม timer, health loop, dependency และ control resume
- หลาย trigger ในเวลาเดียวกัน (timer + health + dependency พร้อมกัน) ต้องเริ่มบริการได้ไม่เกินหนึ่งครั้ง
- dependency flap (ขึ้น/ล้มซ้ำ) ระหว่างรอ backoff
- stop/maintenance/resume: **callback เก่าหลัง stop ต้องไม่ปลุกบริการกลับมา**
- process spawn ล้มเหลว (ไม่ใช่เฉพาะ process ที่ exit): นับโควตาอย่างไรต้องกำหนดและทดสอบ
- พฤติกรรมเมื่อนาฬิการะบบเปลี่ยน (clock shift) และเทียบ timestamps จริงกับขอบเขตเวลา ไม่อ่านเฉพาะ `delayMs` ในเหตุการณ์
- ห้ามแก้ด้วยการเพิ่มความถี่ monitor แทนการบังคับ policy

## ความเสี่ยง

- เทสต์ที่อิงเวลาจริงอาจผันผวน ให้ใช้ความคลาดเคลื่อนที่กำหนดล่วงหน้าและทำซ้ำหลายรอบ ไม่ใช้ sleep เปล่า
- ห้ามอ้างว่าแก้ "ปัญหา retry" ทั้งหมด การ retry ที่ไม่ซ้ำผลข้างเคียง (idempotency) เป็นเรื่องของ POO-WO-008
