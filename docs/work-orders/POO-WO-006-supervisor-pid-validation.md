# POO-WO-006 — ตรวจ PID ให้ถูกต้องก่อนเรียก `isAlive` ใน supervisor (แก้บั๊ก "PID 0")

> **ฉบับพร้อมนำเข้า `onemanos-setbox/work-orders/`** · รหัสต้นทางใน repo spadav5: SPD-WO-005 · **ร่างโดย Claude แทน Lead** ตามที่ Lead อนุมัติให้แยกใบงานแก้ออกจากสไปก์ในบทสนทนา 2026-10-01 ([SPD-DEC-005](../decisions/APPROVAL-LOG-2026-09-30-FINAL-ADJUSTMENT.md) รอบ 4) · **Lead ยังไม่ได้ตรวจข้อความ**
> ก่อนนำเข้า: ตรวจว่าเลข 006 ว่างที่ remote (ตรวจแล้ว 2026-10-01 ที่ `ce692ca`: มี 001–005) และเพิ่มแถวในตาราง `work-orders/README.md`

- ผู้ทำ: **Codex** · ผู้ตรวจรับ: **Cowork** · ผู้ตัดสิน: **Lead**
- ขนาด: **เล็ก** · Priority: **P1** (ขวางการเริ่มบน state ใหม่) · Milestone: M2
- ประเภท: **แก้โค้ดผลิตภัณฑ์ขนาดเล็ก + เทสต์** · ต้องทำบน branch แยกของใบงานนี้ ห้ามปนกับ `codex/poo-wo-005-spike`
- ที่มา: [SPD-REV-004](REVIEW-POO-WO-005-round3-2026-10-01.md) ข้อค้นพบ F1 · หลักฐาน B2 กรณี 01 (`docs/spike/b2-win10-summary.json`)
- สถานะ: **ร่าง รอ Lead ตรวจ นำเข้า และมอบผู้ทำ**

## ปัญหา

`optimus-edition/package-files/operations/supervisor.js:27–28` อ่านไฟล์ PID แล้วใช้ `0` เมื่อไม่มีไฟล์ จากนั้นเรียก `isAlive(0)` ซึ่ง `lib.js:16` ใช้ `process.kill(Number(pid), 0)` PID 0 ไม่ใช่โปรเซสจริงแต่การเรียกคืนค่าจริงได้ (พบบน Windows ทั้ง Server Core VM และ Windows 10) ผลคือ supervisor เริ่มบน state ใหม่ไม่ได้ ("Supervisor already running: PID 0", exit 2)

## ขอบเขต

ทำ: ตรวจรูปแบบ PID ก่อนตรวจโปรเซส · ทำให้ `isAlive` ปฏิเสธค่าที่ไม่ใช่ PID จริง
ไม่ทำ: ไม่แก้ปัญหา PID reuse (PID เก่าถูกโปรเซสอื่นใช้) ซึ่งเป็นข้อจำกัดคนละเรื่องและต้องบันทึกไว้ในรายงาน · ไม่แตะ backoff (POO-WO-007) หรือ job (POO-WO-008)

## แนวทางแก้ที่เสนอ (ผู้ทำปรับได้ ต้องคงพฤติกรรมตามเกณฑ์รับงาน)

```js
// lib.js
function isAlive(pid) {
  const n = Number(pid);
  if (!Number.isInteger(n) || n <= 0) return false;       // 0, ติดลบ, NaN, ทศนิยม = ไม่ใช่โปรเซสจริง
  try { process.kill(n, 0); return true; } catch { return false; }
}

// supervisor.js
const rawPid = fs.existsSync(PID) ? fs.readFileSync(PID, "utf8").trim() : "";
const oldPid = /^[1-9]\d*$/.test(rawPid) ? Number(rawPid) : 0;
if (rawPid && !oldPid) event("pid-file-invalid", { rawLength: rawPid.length }); // ไม่บันทึกค่าดิบ
if (oldPid && oldPid !== process.pid && isAlive(oldPid)) { console.error(`Supervisor already running: PID ${oldPid}`); process.exit(2); }
```

ข้อสังเกต: `event()` เรียก `ensureRuntimeDirs()` อยู่แล้ว ตรวจลำดับการเรียกก่อนใช้

## เกณฑ์รับงาน (ต้องมี negative test ทุกข้อ)

| กรณี | ผลที่ต้องได้ |
|---|---|
| ไม่มีไฟล์ PID | เริ่มได้ ไม่พิมพ์ "already running" |
| ไฟล์ว่าง / `0` / `-1` / `abc` / `1.5` / `007x` | เริ่มได้ และบันทึก `pid-file-invalid` (ยกเว้นไฟล์ว่าง) |
| `2147483647` (ไม่มีโปรเซสนี้) | เริ่มได้ (stale PID) |
| PID ของโปรเซสที่ยังมีชีวิตอยู่จริง (child ของเทสต์) | ตัวที่สอง exit 2 และพิมพ์ PID นั้น |
| PID เท่า `process.pid` ของตัวเอง | ไม่ถือว่าซ้ำ |
| รันบน **Windows และ Linux** | ผลเหมือนกัน |
| `npm test` ที่ราก | เท่าเดิมบน master: ผ่าน 842 ล้ม 5 ข้อเดิม (ไม่เพิ่มข้อที่ล้ม) |

หลักฐานที่ต้องส่ง: diff, ผลเทสต์ใหม่, ผล `npm test`, hash ของ `supervisor.js`/`lib.js` ก่อนและหลัง, ข้อความระบุข้อจำกัด PID reuse

## ความเสี่ยง

- แก้ `lib.js` กระทบผู้เรียก `isAlive` อื่น ให้ค้นการใช้งานทั้งหมดก่อนแก้ และบันทึกผล
- ห้ามใช้ข้อมูลหรือเครื่องจริงของลูกค้าในการทดสอบ
