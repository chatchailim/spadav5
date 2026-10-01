# SPD-HND-007 — ขั้นตอน S14: ออกและส่งใบรับรอง federation (Lead ทำเอง)

- สถานะ: **ร่าง** · ผู้ทำ: Lead เท่านั้น (WO-N R3: agent ห้ามแตะ CA) · อ้างอิง: `scripts/ops/wo-n-agent-node-install.md` S14 · `scripts/ops/federation-ca.mjs` ที่ commit `206d1f9`
- ตรวจกับโค้ดจริงแล้ว: คำสั่ง `init`/`issue`/`show`, ชื่อไฟล์ที่ออก, รูปแบบ SAN
- ห้ามใส่ IP จริง อีเมล หรือรหัสผ่านในเอกสารนี้ (repo สาธารณะ) · ใช้ชื่อโฮสต์ DNS สาธารณะได้
- คำสั่งเป็น PowerShell (เครื่อง CA = notebook Windows) ตัวแปรในวงเล็บเหลี่ยมให้แทนค่าเอง

## ค่าที่ใช้

| ตัวแปร | ค่า |
|---|---|
| NODE_A_ID / HOST | `th-bkk-001` / `a.spada.network` |
| NODE_B_ID / HOST | `th-bkk-002` / `b.spada.network` |
| CA_DIR | โฟลเดอร์บน USB เข้ารหัส เช่น `E:\spada-ca` (ใช้ path เต็มเสมอ ห้ามใช้ `~`) |

## P0 ก่อนเริ่ม

1. สั่งหยุด agent ทุกตัวบน notebook (Codex, Anti) และปิด session ที่ค้างอยู่
2. เปิด BitLocker กับ USB (ถ้ายังไม่ได้ทำ) แล้วปลดล็อก
3. ตรวจ OpenSSL และ Node:
   ```powershell
   openssl version
   node --version
   ```
   ต้องเห็นเวอร์ชัน OpenSSL 3.x และ Node 22 ถ้า `openssl` ไม่พบ ให้ติดตั้งและเพิ่มใน PATH ก่อน (โค้ดเรียก `openssl` จาก PATH)
4. เข้าโฟลเดอร์ repo ที่มี `scripts\ops\federation-ca.mjs` (commit `206d1f9`)

## P1 สร้าง CA (ทำครั้งเดียว ข้ามถ้ามี CA แล้ว)

```powershell
node scripts\ops\federation-ca.mjs init --ca-dir "E:\spada-ca" --name "SPADA Network TH"
```
ผลที่ต้องเห็น: `CA created` และพาธ `ca.key`, `ca.crt` · ถ้าขึ้น `refusing to overwrite` แปลว่ามี CA แล้ว ห้ามลบ
บน Windows `chmod 600` ไม่คุมสิทธิ์ไฟล์ จึงต้องพึ่งการเข้ารหัส USB และการไม่ทิ้ง `ca.key` ไว้ในดิสก์เครื่อง

## P2 สำรอง `ca.key` ทันที (สองชุด ที่ต่างกัน)

1. คัดลอก `E:\spada-ca\ca.key` และ `ca.crt` ไป USB เข้ารหัสตัวที่สอง เก็บคนละที่กัน
2. บันทึกค่า hash ไว้ในที่ส่วนตัวของท่าน (ไม่ใส่ repo):
   ```powershell
   Get-FileHash "E:\spada-ca\ca.crt" -Algorithm SHA256
   ```

## P3 ออกใบรับรอง 2 ใบ

```powershell
node scripts\ops\federation-ca.mjs issue --ca-dir "E:\spada-ca" --node th-bkk-001 --host a.spada.network
node scripts\ops\federation-ca.mjs issue --ca-dir "E:\spada-ca" --node th-bkk-002 --host b.spada.network
```
ผล: `Issued <id>` และ `names:` ต้องมี `URI:did:spada:node:<id>`, `DNS:<id>`, `DNS:<host>` · ถ้า `already has a certificate` ให้หยุด อย่าลบโฟลเดอร์ก่อนตรวจว่าใบเดิมถูกใช้ไปแล้วหรือไม่

ตรวจซ้ำ:
```powershell
node scripts\ops\federation-ca.mjs show --cert "E:\spada-ca\issued\th-bkk-001\th-bkk-001.crt"
node scripts\ops\federation-ca.mjs show --cert "E:\spada-ca\issued\th-bkk-002\th-bkk-002.crt"
openssl verify -CAfile "E:\spada-ca\ca.crt" "E:\spada-ca\issued\th-bkk-001\th-bkk-001.crt"
openssl verify -CAfile "E:\spada-ca\ca.crt" "E:\spada-ca\issued\th-bkk-002\th-bkk-002.crt"
```
ต้องได้ `OK` สองครั้ง

## P4 ส่งใบรับรองไป node (ผ่าน Tailscale เท่านั้น)

ส่งเฉพาะโฟลเดอร์ `issued\<id>` ของ node นั้น **ห้ามส่ง `ca.key`** ผู้ใช้ `onemanadmin`

1. สร้างโฟลเดอร์ปลายทางบนแต่ละ node (ยังไม่มีจนกว่า S17):
   ```powershell
   ssh onemanadmin@node-a "mkdir -p ~/spada-monorepo/infra/docker/.certs/federation"
   ssh onemanadmin@node-b "mkdir -p ~/spada-monorepo/infra/docker/.certs/federation"
   ```
2. ส่งไฟล์:
   ```powershell
   scp "E:\spada-ca\issued\th-bkk-001\*" onemanadmin@node-a:spada-monorepo/infra/docker/.certs/federation/
   scp "E:\spada-ca\issued\th-bkk-002\*" onemanadmin@node-b:spada-monorepo/infra/docker/.certs/federation/
   ```
3. ล็อกสิทธิ์ไฟล์กุญแจบน node (ไม่ให้อ่านได้ทุกคน):
   ```powershell
   ssh onemanadmin@node-a "chmod 600 ~/spada-monorepo/infra/docker/.certs/federation/*.key"
   ssh onemanadmin@node-b "chmod 600 ~/spada-monorepo/infra/docker/.certs/federation/*.key"
   ```
   (S17 ของ agent จะ `chown` เป็น 65532 และ `chmod` ภายหลังตามใบงาน)

## P5 ล้างและปิดงาน

1. หลังตรวจว่าส่งครบ ลบสำเนาไฟล์ `*.key` ของ node ออกจาก `E:\spada-ca\issued\...` (ไม่ลบ `ca.key`, `ca.crt`, `*.crt`) หรือยืนยันว่าเก็บใน USB เข้ารหัสเท่านั้น
2. ถอด USB แล้วเก็บในที่ปลอดภัย
3. แจ้ง agent: "ส่งใบรับรองแล้ว" agent จะตรวจตาม S14 (ครบ 3 ไฟล์ต่อ node, SAN, `openssl verify`, hash ของ `ca.crt` ตรงกัน, จำนวน `ca.key` บน node = 0)

## ข้อสังเกตที่ควรแก้ก่อน/ระหว่างทำ (ของ Claude ไม่ใช่คำตัดสิน)

1. **ขัดแย้งในใบงาน:** S17 รัน `generate-dev-certs.sh` ซึ่งสร้าง `ca.key` ของ "Stage 0 Test CA" ไว้ใน `.certs/` บน node (ตรวจกับโค้ดแล้ว: สคริปต์ลบเฉพาะไฟล์ระดับบนของ `.certs/` ไม่ลบ `federation/`) ดังนั้นเช็ก "จำนวน `ca.key` = 0" ของ S14 ผ่านก่อน S17 แต่จะไม่ผ่านถ้ารันซ้ำหลัง S17 · ไฟล์นี้เป็น CA ทดสอบ ไม่ใช่ CA ของ federation · ควรให้ Lead ตัดสินว่าจะแก้ใบงานหรือบันทึกเป็นข้อยกเว้น
2. **ความลับเดินทาง:** กุญแจส่วนตัวของ node ถูกสร้างบน notebook แล้วส่งไป node (ตามใบงาน) จึงต้องไม่ผ่านช่องทางอื่นนอกจาก Tailscale และต้องล้างสำเนาตาม P5
3. **หลังส่งใบรับรอง Node A อาจต้องตรวจ SAN ว่ามี host `a.spada.network`** ส่วน `id.spada.network` เป็น OIDC ผ่าน reverse-proxy ไม่ใช่ federation จึงไม่ต้องอยู่ใน SAN ของใบนี้
4. หากไม่ใช้ ACL/tag ของ Tailscale ใน node ยังเปิด `tailscale0` ทั้งหมด ควรตั้งก่อนส่งกุญแจ
