#!/usr/bin/env node
"use strict";

// สร้างหน้า Help แบบออฟไลน์ (ไฟล์ HTML ไฟล์เดียว ไม่มี JavaScript ไม่เรียกอะไรจากภายนอก)
// จากคู่มือ docs/help/readme.md โดยแปลง Markdown และ Mermaid เป็น HTML/SVG ล่วงหน้า
//
// ทำไมต้องสร้างล่วงหน้า
//   Setbox ยึดหลัก "ไม่มี dependency ภายนอก ใช้ออฟไลน์ได้" และ CSP ของเซิร์ฟเวอร์ปิด script จากภายนอก
//   หน้า Help จึงต้องเป็นไฟล์นิ่ง ไลบรารีแปลง (marked, mermaid) ใช้เฉพาะตอนสร้างไฟล์นี้บนเครื่องผู้พัฒนา
//   ไม่ถูกส่งไปกับ Setbox
//
// ฉบับในผลิตภัณฑ์ vs ฉบับภายใน
//   - บรรทัดที่ลงท้ายด้วย <!--internal--> และช่วงระหว่าง <!--internal:start--> ... <!--internal:end-->
//     เป็นหมายเหตุภายใน (เลข PR ผู้ร่าง ฯลฯ) จะถูกตัดออกจากหน้าที่ฝังใน Setbox
//     บน GitHub ป้ายเหล่านี้มองไม่เห็นเพราะเป็นคอมเมนต์ HTML
//
// ต้องมี (ติดตั้งเฉพาะตอนสร้าง ไม่ commit):  npm i marked@12.0.2 mermaid@10.9.1 playwright-core
// และเบราว์เซอร์ Chromium สำหรับเรนเดอร์แผนภาพ
//
// ใช้:
//   NODE_PATH=<โฟลเดอร์ node_modules> CHROME_PATH=<chrome> \
//   node scripts/build-offline-help.js --md docs/help/readme.md --out <public/help.html>

const fs = require("node:fs");
const path = require("node:path");

function arg(name, fallback = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const MD = path.resolve(arg("md", "docs/help/readme.md"));
const OUT = path.resolve(arg("out", "help.html"));
const CHROME = process.env.CHROME_PATH;
const keepInternal = process.argv.includes("--keep-internal");

/** ตัดหมายเหตุภายในออก */
function stripInternal(text) {
  return text
    .replace(/<!--internal:start-->[\s\S]*?<!--internal:end-->\n?/g, "")
    .split("\n").filter(line => !line.trimEnd().endsWith("<!--internal-->")).join("\n");
}

/** รูปแบบ id เดียวกับ GitHub: ตัวพิมพ์เล็ก ตัดเครื่องหมาย เก็บอักษร/วรรณยุกต์/ตัวเลข/ขีด แทนช่องว่างทีละตัวด้วยขีด */
function slug(text) {
  return text.toLowerCase().replace(/<[^>]*>/g, "").replace(/[^\p{L}\p{M}\p{N}\s_-]/gu, "").trim().replace(/\s/g, "-");
}

const escapeHtml = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function renderDiagrams(diagrams) {
  const { chromium } = require("playwright-core");
  const mermaidPath = require.resolve("mermaid/dist/mermaid.min.js");
  const browser = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setContent("<!doctype html><html><body></body></html>");
  await page.addScriptTag({ path: mermaidPath });
  await page.evaluate(() => mermaid.initialize({
    startOnLoad: false, securityLevel: "strict", theme: "default", fontFamily: "sans-serif",
    // ใช้ข้อความ SVG แทน foreignObject: ขนาดกล่องวัดตอนสร้างด้วยฟอนต์ของเครื่องที่สร้าง
    // ถ้าใช้ foreignObject ฟอนต์ไทยบนเครื่องผู้ใช้ที่กว้าง/สูงกว่าจะถูกตัดขอบ แต่ข้อความ SVG ไม่ถูกตัด
    flowchart: { htmlLabels: false, padding: 18 },
  }));
  const out = [];
  for (let i = 0; i < diagrams.length; i += 1) {
    const svg = await page.evaluate(async ({ code, id }) => (await mermaid.render(id, code)).svg,
      { code: diagrams[i], id: `dg-${i}` });
    out.push(svg);
  }
  await browser.close();
  // ปัดทศนิยมพิกเซลของ SVG เหลือ 2 ตำแหน่ง: ลดขนาดไฟล์ และกันตัวเลขยาว 13 หลักที่สแกนก่อนปล่อยของ Setbox
  // อ่านเป็นเลขประจำตัวผู้เสียภาษี (ดู scripts/scan-before-release.js)
  return out.map(svg => svg.replace(/-?\d+\.\d{3,}/g, m => String(Math.round(parseFloat(m) * 100) / 100)));
}

const STYLE = `
:root{--bg:#F7F5EF;--panel:#fff;--line:#d4d9dd;--text:#14212c;--muted:#4c5e6c;--accent:#0e7c66;--link:#1f5e94;--code:#e8eef3}
@media (prefers-color-scheme:dark){:root{--bg:#0b1b2b;--panel:#122535;--line:#294252;--text:#f5f1e7;--muted:#9eb0bf;--accent:#51d9be;--link:#72b8f5;--code:#1c3447}}
*{box-sizing:border-box}html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--text);font:16px/1.7 "Noto Sans Thai","Leelawadee UI",Tahoma,system-ui,sans-serif}
.bar{position:sticky;top:0;z-index:5;display:flex;gap:12px;align-items:center;padding:10px 16px;background:var(--panel);border-bottom:1px solid var(--line)}
.bar strong{font-size:17px}.bar .sp{flex:1}
.bar a.back{color:var(--text);border:1px solid var(--line);border-radius:8px;padding:6px 14px;text-decoration:none;min-height:40px;display:inline-flex;align-items:center}
.bar a.back:hover,.bar a.back:focus-visible{border-color:var(--accent);outline:none}
.wrap{display:flex;align-items:flex-start}
nav.side{position:sticky;top:61px;width:300px;flex:none;max-height:calc(100vh - 61px);overflow:auto;padding:16px;border-right:1px solid var(--line);background:var(--panel);font-size:14px}
nav a{display:block;color:var(--muted);text-decoration:none;padding:4px 8px;border-radius:6px}
nav a:hover{color:var(--text);background:rgba(114,184,245,.14)}nav a.h3{padding-left:22px;font-size:13px}
details.mob{display:none;margin:12px 16px;border:1px solid var(--line);border-radius:8px;background:var(--panel);padding:6px 10px}
details.mob summary{cursor:pointer;min-height:40px;display:flex;align-items:center}
main{flex:1;min-width:0;padding:24px 32px 80px}main .in{max-width:880px;margin:0 auto}
h1,h2,h3,h4{line-height:1.35;scroll-margin-top:76px}h2{border-bottom:1px solid var(--line);padding-bottom:6px;margin-top:2em}
a{color:var(--link)}code{background:var(--code);padding:1px 6px;border-radius:4px;font-size:.92em}
pre{background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:12px 14px;overflow:auto}pre code{background:none;padding:0}
table{border-collapse:collapse;width:100%;display:block;overflow-x:auto;margin:12px 0}
th,td{border:1px solid var(--line);padding:6px 10px;text-align:left;vertical-align:top}th{background:var(--panel)}
blockquote{margin:12px 0;padding:4px 14px;border-left:4px solid #b8860b;background:var(--panel);color:var(--muted)}
figure.dg{margin:14px 0;background:#fff;border:1px solid var(--line);border-radius:10px;padding:12px;overflow:auto}
figure.dg svg{max-width:100%;height:auto}
@media (max-width:900px){nav.side{display:none}details.mob{display:block}main{padding:16px}}
@media print{.bar,nav.side,details.mob{display:none}main{padding:0}}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
`;

async function main() {
  if (!CHROME) throw new Error("ต้องตั้ง CHROME_PATH เป็นที่อยู่ของ Chromium/Chrome (ใช้เรนเดอร์แผนภาพเท่านั้น)");
  const { marked } = require("marked");
  let text = fs.readFileSync(MD, "utf8");
  if (!keepInternal) text = stripInternal(text);

  const diagrams = [];
  text = text.replace(/```mermaid\n([\s\S]*?)```/g, (_, code) => {
    diagrams.push(code);
    return `\n<!--DIAGRAM:${diagrams.length - 1}-->\n`;
  });

  const used = {};
  const renderer = new marked.Renderer();
  renderer.heading = (htmlText, level, raw) => {
    let id = slug(raw) || "h";
    if (used[id]) { used[id] += 1; id += `-${used[id]}`; } else used[id] = 1;
    return `<h${level} id="${id}">${htmlText}</h${level}>`;
  };
  let html = marked.parse(text, { renderer, gfm: true });
  // หน้านี้ต้องไม่ชี้ออกนอกเครื่อง: ลิงก์ภายนอกที่ marked สร้างอัตโนมัติจากข้อความเปล่า ให้เหลือเป็นข้อความธรรมดา
  html = html.replace(/<a href="https?:\/\/[^"]*"[^>]*>([\s\S]*?)<\/a>/g, "$1");

  const svgs = await renderDiagrams(diagrams);
  html = html.replace(/<!--DIAGRAM:(\d+)-->/g, (_, i) => `<figure class="dg" role="img" aria-label="แผนภาพที่ ${Number(i) + 1}">${svgs[Number(i)]}</figure>`);

  // สารบัญจาก h2/h3
  const heads = [...html.matchAll(/<h([23]) id="([^"]+)">([\s\S]*?)<\/h\1>/g)];
  const links = heads.map(m => `<a class="h${m[1]}" href="#${m[2]}">${escapeHtml(m[3].replace(/<[^>]*>/g, ""))}</a>`).join("\n");

  const page = `<!doctype html>
<html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>คู่มือการใช้งาน — OneManOS Setbox</title>
<style>${STYLE}</style></head>
<body>
<header class="bar"><strong>คู่มือการใช้งาน</strong><span class="sp"></span><a class="back" href="/">กลับหน้าหลัก</a></header>
<details class="mob"><summary>สารบัญ</summary><nav>${links}</nav></details>
<div class="wrap"><nav class="side" aria-label="สารบัญคู่มือ">${links}</nav>
<main><div class="in">
${html}
</div></main></div>
</body></html>
`;
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, page, "utf8");
  process.stdout.write(`สร้าง ${OUT}\n  แผนภาพ ${diagrams.length} · หัวข้อในสารบัญ ${heads.length} · ขนาด ${(Buffer.byteLength(page) / 1024).toFixed(0)} KB\n`);
}

main().catch(error => { process.stderr.write(`ล้มเหลว: ${error.message}\n`); process.exit(1); });
