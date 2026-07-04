import sys

html_file = "d:\\Git\\KalkulacijaPetric\\odpis_materiala.html"

with open(html_file, "r", encoding="utf-8") as f:
    content = f.read()

target = """const materialCode = document.getElementById('materialCode').value.trim();"""
replacement = """let materialCode = document.getElementById('materialCode').value.trim();
            // EXCEL MATCHING FIX: Convert to number if it's a pure number so VLOOKUP and SUMIF work
            if (!isNaN(materialCode) && materialCode !== '') {
                materialCode = Number(materialCode);
            }"""

if target in content:
    content = content.replace(target, replacement)
    with open(html_file, "w", encoding="utf-8") as f:
        f.write(content)
    print("Fixed type matching bug in HTML!")
else:
    print("Target not found.")
