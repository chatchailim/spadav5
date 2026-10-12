# ร่างใบงาน S1–S3 (สำหรับคัดลอกไปใช้ใน `spada-monorepo`)

- **รหัสเอกสาร: SPD-WO-001**

> สถานะ: **Lead อนุมัติให้ออกใบงาน 2026-09-29 ([APPROVAL-LOG](../decisions/APPROVAL-LOG-2026-09-29.md)) แต่ยังไม่ได้ออกใบงานจริงใน monorepo** ต้องมีผู้ดูแลนำไปออกและตรวจ ACTIVE CLAIMS · วันที่ 2026-09-29 · เกิดจาก [DECISION-MEMO-2026-09-29](../decisions/DECISION-MEMO-2026-09-29.md) ข้อ 4–5
> ผมมีสิทธิ์อ่านอย่างเดียวใน `spada-monorepo` จึงเขียนร่างไว้ที่นี่ ให้ผู้ดูแลตรวจและนำไปออกใบงานตามขั้นตอนของทีม (AGENT_NOTES, claim-based ownership)
> **ก่อนเริ่มทุกใบงาน**: ตรวจ `AGENT_NOTES.md` หมวด ACTIVE CLAIMS ว่าไฟล์ที่จะแตะมีใครถือ claim อยู่หรือไม่ (ล่าสุดที่เห็น: hermes ถือ `infra/**` และ `scripts/ops/**`; codex ถือ `services/identity-service/**`, `packages/auth/**`; antigravity ถือ `services/consent-service/**`) และต้องยืนยันสถานะ ณ วันที่เริ่ม เพราะข้อมูลอาจล้าสมัย

---

## S1: เลิกใช้ `Math.random` ในตัวสร้าง ID (ความเสี่ยงต่ำ แก้ได้เร็ว)

**ที่มา**: doc 335 D1/P5 · ผลตรวจเบื้องต้น: การสร้างกุญแจไม่ใช้ `Math.random` (WebCrypto Ed25519) แต่ตัวสร้าง ID ค่าเริ่มต้นใช้ `Math.random` และ `packages/events` ถอยไปใช้ `Math.random` แบบเงียบเมื่อไม่มี `crypto.randomUUID`

**ไฟล์ที่พบ (ค้นด้วยคำสำคัญ ณ `206d1f9`):**

| ไฟล์ | บรรทัดโดยประมาณ |
|---|---|
| `services/opof-service/src/space-opof-service.ts` | 50 |
| `services/opof-service/src/space-opof-writer.ts` | 51 |
| `services/data-share-broker-service/src/service-data-share-broker.ts` | 56 |
| `services/reclaim-connect-service/src/service-reclaim-connect.ts` | 54 |
| `packages/events/src/index.ts` | 47 (`cryptoSafeId`) |
| `modules/myai/src/myai-demand-capture.ts` | 98 (`options.random ?? Math.random` ตรวจว่าใช้เพื่ออะไร) |
| `scripts/ops/incident.mjs` | 35 (รหัสเหตุการณ์) |
| `apps/member-portal/app.js` | หลายจุด (โหมดจำลอง) |

**งาน**
1. ตรวจแต่ละจุดว่า ID ถูกใช้เป็นสิทธิ์เข้าถึง (bearer capability) หรือแค่ตัวระบุ · **broker ตรวจแล้ว: ไม่ใช่ bearer** (ตรวจ `requesterDid`/`ownerDid`) · reclaim, opof และ myai-demand-capture ยังไม่ตรวจ
2. เปลี่ยนตัวสร้าง ID เป็นฟังก์ชันร่วมหนึ่งเดียวที่ใช้ `crypto.randomUUID()` และ **ถ้าไม่มีให้โยนข้อผิดพลาด (fail loud)** ห้ามถอยเงียบ
3. เพิ่มกฎ lint หรือเทสต์ที่ล้มเมื่อพบ `Math.random` ในโค้ดที่ไม่ใช่เทสต์/เดโม (อนุญาตรายการยกเว้นที่ระบุเหตุผล)
4. ขยายการตรวจ P5 ไปที่ `scripts/`, `apps/` และ repo `onemanos-setbox` (มี `crypto` ของตัวเอง ยังไม่ได้ตรวจ)

**เกณฑ์ตรวจรับ**: `grep` ไม่พบ `Math.random` ในโค้ดผลิตภัณฑ์นอกรายการยกเว้น · เทสต์เดิมผ่าน · มีเทสต์ว่า ID ที่สร้างสองครั้งไม่ซ้ำและไม่ถอยเงียบเมื่อไม่มี crypto · `npm run verify` ผ่าน

**ผู้รับผิดชอบที่เสนอ**: agent/ผู้ดูแลที่ถือ claim ของแต่ละโฟลเดอร์ (ไม่ทราบตัวจริง) · **ขนาด**: ครึ่งวันถึงหนึ่งวัน (ประมาณ)

---

## S2: ปิด GAP-04 guardian share ตัวอย่างคงที่

**ที่มา**: doc 343 GAP-04 · **ยังเปิดอยู่จริง**: `infra/docker/docker-compose.node.yml:90` ฝังค่า `PLX_RECOVERY_GUARDIAN_SHARE_JSON` เป็น JSON คงที่ (version 1, index 3, threshold 2, total 3, payload/checksum ตัวอย่าง) ขณะที่ `services/recovery-service` (README, runbook, `.env.example`, `docker-compose.dev.yml`, `runtime/start.mjs`) กำหนดให้รับจาก secret manager และห้ามใส่ share จริงใน source/Compose/log/BookChain

**งาน**
1. เอาค่าคงที่ออกจาก `infra/docker/docker-compose.node.yml` ให้อ่านจากตัวแปรสภาพแวดล้อมที่มาจาก secret manager เหมือน dev compose (ไม่มีค่าเริ่มต้น)
2. ตรวจว่าค่าตัวอย่างเป็น share ที่ใช้ได้จริงหรือไม่ (ผมไม่ได้ตรวจ) หากเคยถูกใช้บน node ที่มีข้อมูลจริง ให้ถือว่า share ชุดนั้นรั่วและหมุนใหม่
3. เพิ่มตัวตรวจใน CI: ห้ามมี JSON ที่รูปแบบ share (`"role":"guardian"`, `"payload"`, `"checksum"`) ในไฟล์ compose, source หรือ `.env.example` (ยกเว้นค่าว่าง)
4. ตรวจให้ start-up ปฏิเสธเมื่อค่าเป็นค่าตัวอย่างที่รู้จัก (ต่อยอด `start.mjs` ที่ปฏิเสธเมื่อไม่ตั้งค่า)
5. จัดทำขั้นตอน ceremony สร้าง share จริงต่อ environment (ผู้ถือ, ช่องทางส่ง, การเก็บ, การกู้) **ก่อนสมาชิกจริงพึ่งพา recovery**

**เกณฑ์ตรวจรับ**: ไม่พบค่า share ใน repo (CI ผ่าน) · node compose ไม่สตาร์ทเมื่อไม่มี share · มีเอกสาร ceremony · แจ้งผลในหัวข้อ GAP-04 ของ doc 343

**ผู้รับผิดชอบที่เสนอ**: Hermes (claim `infra/**`) ร่วมกับผู้ดูแล recovery-service · ตรวจ claim ก่อนเริ่ม · **ขนาด**: หนึ่งวัน สำหรับข้อ 1–4 ส่วน ceremony ขึ้นกับการนัดผู้ถือ

---

## S3: ยืนยันปิด GAP-05 ด้วยการซ้อมกู้คืนบน node จริง

**ที่มา**: doc 343 GAP-05 (สำรวจ 2026-09-07) · **โค้ดน่าจะแก้แล้ว**: `scripts/ops/backup.mjs` เวอร์ชัน v2/v3 อ่านรายชื่อ volume จาก compose (`readSPADAComposeVolumes`) พร้อม prefix ของ project และใช้ `sqlite3 .backup` · มี `scripts/ops/restore-drill.mjs` และ `backup-restore-drill.mjs` · ยังไม่ทราบว่าเคยรันซ้อมบนสภาพแวดล้อมจริงและมี evidence หรือไม่

**งาน (ไม่ต้องเขียนโค้ดใหม่ ถ้าซ้อมผ่าน)**
1. รัน `backup.mjs` และ restore drill บน node ทดสอบที่มีข้อมูลตัวอย่างในทุก named volume
2. เทียบ: จำนวน volume ที่สำรอง = จำนวน volume ใน compose · SQLite ผ่าน consistency check · restore แล้วแอปเปิดและอ่านข้อมูลได้
3. บันทึก evidence (คำสั่ง ผลลัพธ์ เวลา ขนาด hash) ตามรูปแบบที่ทีมใช้ และวัด RPO 24 ชม./RTO 4 ชม. ตาม SLO v1.0 (`specs/slo`)
4. อัปเดตสถานะ GAP-05 ใน doc 343 (สำรวจ ณ 2026-09-07 ล้าสมัย) และระบุวันที่ตรวจล่าสุด
5. ถ้าพบช่องโหว่ (เช่น volume ที่ไม่อยู่ใน compose หลัก อย่าง cometbft/ai-host) ให้ลงทะเบียนเป็น GAP ใหม่

**เกณฑ์ตรวจรับ**: มี evidence การซ้อมกู้คืนที่ผ่านอย่างน้อยหนึ่งรอบ · GAP-05 ถูกปิดหรือเปิดใหม่ตามหลักฐาน · เอกสารตรงกับโค้ด

**ผู้รับผิดชอบที่เสนอ**: Hermes (claim `scripts/ops/**`) · **ขนาด**: ครึ่งวัน (ประมาณ)

---

## ลำดับที่แนะนำ

S1 และ S3 ทำได้ทันทีและความเสี่ยงต่ำ → S2 ก่อนมี node ที่สมาชิกจริงใช้ recovery → เมื่อ P1/P5 ของ doc 335 ปิดแล้ว จึงยกกฎเหล็กข้อ 8–9 เป็นทางการ
