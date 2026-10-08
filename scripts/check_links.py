#!/usr/bin/env python3
"""ตรวจลิงก์ภายใน (relative links) ในไฟล์ Markdown ว่าชี้ไปยังไฟล์ที่มีอยู่จริง

ไม่ตรวจลิงก์ภายนอก (http/https/mailto) และไม่ตรวจ anchor ภายในไฟล์
คืนค่า exit code 1 ถ้าพบลิงก์เสีย
"""
import re
import sys
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parent.parent
LINK = re.compile(r"(?<!!)\[[^\]]*\]\(([^)\s]+)(?:\s+\"[^\"]*\")?\)|!\[[^\]]*\]\(([^)\s]+)\)")
FENCE = re.compile(r"^\s*(```|~~~)")


def targets(path):
    in_fence = False
    for no, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if FENCE.match(line):
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        line = re.sub(r"`[^`]*`", "", line)
        for m in LINK.finditer(line):
            yield no, (m.group(1) or m.group(2)).strip("<>")


def main():
    bad = []
    files = sorted(p for p in ROOT.rglob("*.md") if ".git" not in p.parts)
    for md in files:
        for no, tgt in targets(md):
            if re.match(r"^([a-z][a-z0-9+.-]*:|#)", tgt, re.I):
                continue
            rel = unquote(tgt.split("#", 1)[0])
            if rel and not (md.parent / rel).exists():
                bad.append(f"{md.relative_to(ROOT)}:{no}: ลิงก์เสีย -> {tgt}")
    print(f"ตรวจ {len(files)} ไฟล์ Markdown")
    for b in bad:
        print(b)
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
