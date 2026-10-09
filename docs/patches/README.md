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

---

# Patch 2: workflow ปล่อยชุดส่งมอบเป็นร่าง Release (`setbox-release-kit-workflow.patch`)

- Lead เลือกปลายทาง CD เป็น GitHub Release + checksum (2026-10-08) ไฟล์ใหม่ `.github/workflows/release-kit.yml` ใน `onemanos-setbox`
- รันเฉพาะเมื่อสั่งเอง (`workflow_dispatch`) รับ `release_id` ประกอบชุดด้วย `scripts/build-kit.js` (รวมขั้นตรวจในตัว) แล้ว tar.gz + `sha256sum` และสร้าง **draft pre-release** ที่ระบุว่ายังไม่ลงลายมือชื่อ
- ไม่ลงลายมือชื่อและไม่เผยแพร่ให้: `sign-kit.js` เป็นขั้นที่ Release Owner ทำที่ออฟฟิศ (ข้อความท้าย `build-kit.js`) ให้สิทธิ์ `contents: write` เฉพาะ job นี้
- ทดสอบแล้วในเครื่อง: `build-kit.js --out <scratch>` ประกอบสำเร็จ (356 ไฟล์ ผ่านขั้นตรวจ) → tar.gz → `sha256sum -c` ผ่าน, YAML อ่านได้, `git apply --check` ผ่านกับ `master` `e706ed1`
- **ยังไม่ได้ทดสอบ:** การรันบน GitHub Actions จริงและขั้น `gh release create` (ต้องรันหลัง merge) ถ้า repo ตั้งนโยบายจำกัดสิทธิ์ `GITHUB_TOKEN` เป็นอ่านอย่างเดียว ขั้นสุดท้ายจะล้ม ต้องเปิดสิทธิ์เขียนของ workflow
- ใช้: `git apply docs/patches/setbox-release-kit-workflow.patch` แล้วคอมมิตด้วย `-s` เปิด PR เข้า `master`

---

# Patch 3: หน้า Help ออฟไลน์ + ปุ่ม Help (`setbox-offline-help.patch`)

- **ทำอะไร:** เพิ่ม `public/help.html` (คู่มือผู้ใช้เป็นไฟล์ HTML นิ่งไฟล์เดียว 295 KB: ไม่มี JavaScript ไม่เรียกอะไรออกนอกเครื่อง แผนภาพ Mermaid 13 ภาพเป็น SVG ฝังในไฟล์) และ `public/help-link.css` พร้อมปุ่ม **Help** ใน 5 หน้า (`index`, `admin`, `business`, `executive`, `me`) ที่เปิดคู่มือในแท็บใหม่ และเทสต์ `public-help-ui.test.js` (6 ข้อ)
- **เหตุที่ออฟไลน์:** Setbox ต้องใช้ได้โดยไม่มีอินเทอร์เน็ต และ CSP ของเซิร์ฟเวอร์ปิด script ภายนอก (`script-src 'self'`) หน้า Help จึงไม่มี script เลย
- **ฉบับในผลิตภัณฑ์:** สร้างจาก `docs/help/readme.md` โดยตัดหมายเหตุภายใน (เลข PR, ข้อความของผู้ร่าง) ออกอัตโนมัติ เทสต์จะล้มถ้ามี `PR #n`, `Claude`, `<script>`, ลิงก์ภายนอก หรือลิงก์สารบัญเสียหลุดเข้ามา
- **ทดสอบแล้ว (Linux, Node 22.22.0, กับ `master` คอมมิต `e706ed1`):**
  - `git apply --check` ผ่าน และหลัง apply เทสต์ใหม่ผ่าน 6/6 (ทดลองใส่ `<script src=...>` เข้าไป เทสต์ข้อ 1 ล้มตามที่ควร)
  - ชุดทดสอบเต็มแบบ CI 2 ส่วน: 1,147 ชุด ผ่าน 1,144 ล้ม 0 ข้าม 3 (เดิม 1,141 เพิ่มจากเทสต์ใหม่ 6 ข้อ)
  - `scan-before-release.js` exit 0 (**รอบแรกล้ม** เพราะทศนิยมพิกเซลของ SVG ยาว 13 หลักถูกอ่านเป็นเลขผู้เสียภาษี ตัวสร้างจึงปัดเป็น 2 ตำแหน่งแล้ว)
  - `build-kit.js --from-working-tree`: ประกอบชุดสำเร็จ 359 ไฟล์ (เดิม 356) ชุดทดสอบในชุดผ่าน 1,016 รายการ และไฟล์ Help ติดไปกับชุดจริง · `kit-integrity.test.js` ผ่าน 30/30
  - เปิดหน้า Help ใน Chromium แบบ **ปิดเครือข่าย**: แผนภาพ 13/13 แสดงครบ ไม่มีคำขอออกนอกเครื่อง ลิงก์สารบัญไม่เสีย หน้าจอ 390px ไม่เลื่อนแนวนอน
- **ยังไม่ได้ทดสอบ:** บน Windows จริง/Edge และฟอนต์ไทยของเครื่องลูกค้า (แผนภาพใช้ข้อความ SVG เพื่อไม่ให้ตัวหนังสือถูกตัดขอบเมื่อฟอนต์ต่างกัน แต่ยังไม่เห็นผลบนเครื่องจริง) · การอ่านเนื้อหาคู่มือโดยมนุษย์ว่าตรงกับพฤติกรรมระบบ
- **หน้านี้เปิดได้โดยไม่ต้องเข้าสู่ระบบ** เหมือนไฟล์นิ่งอื่นใน `public/` (เนื้อหาไม่มีความลับ แต่ถ้าไม่ต้องการให้เห็นก่อนเข้าสู่ระบบ ต้องเพิ่มด่านในเซิร์ฟเวอร์ ซึ่งไม่อยู่ใน patch นี้)
- **ความเข้ากันกับ PR #12:** PR #12 แก้บรรทัดหัวหน้าของ `public/index.html` ผมจึงวางปุ่ม Help ของหน้าหลักไว้ที่แถบเมนูซ้าย (ไม่แตะบรรทัดนั้น) ทดสอบแล้วว่า `git apply --check` ผ่านทั้งกับ `master` (`e706ed1`) และกับ branch ของ PR #12 (`cac26d9`) และเทสต์ของ patch + `public-dms-form.test.js` ผ่าน 12/12 บน branch นั้น
- **ใช้:** `git apply docs/patches/setbox-offline-help.patch` แล้วคอมมิตด้วย `-s` เปิด PR เข้า `master` (ใช้ก่อนหรือหลัง merge PR #12 ก็ได้)

## สร้างหน้า Help ใหม่เมื่อแก้คู่มือ

คู่มือต้นฉบับอยู่ที่ `docs/help/readme.md` (repo `spadav5`) แก้แล้วสร้าง `help.html` ใหม่ด้วย `scripts/build-offline-help.js`:

```bash
npm i marked@12.0.2 mermaid@10.9.1 playwright-core      # ติดตั้งนอกโฟลเดอร์ Setbox ใช้เฉพาะตอนสร้าง
NODE_PATH=<โฟลเดอร์ node_modules> CHROME_PATH=<ที่อยู่ Chromium> \
  node scripts/build-offline-help.js --md docs/help/readme.md --out <onemanos-setbox>/public/help.html
```

ผลลัพธ์ต้องผ่าน `public-help-ui.test.js` และ `node scripts/scan-before-release.js` ก่อน commit บรรทัดที่ลงท้าย `<!--internal-->` และช่วง `<!--internal:start-->…<!--internal:end-->` ในคู่มือจะไม่ถูกใส่ในหน้าที่ฝังใน Setbox (ใส่ `--keep-internal` ถ้าต้องการฉบับเต็ม)
