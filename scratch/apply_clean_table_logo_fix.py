import os
import re

workspace = r"c:\DARKO\KalkulacijaPetric"
files_to_update = [
    'pola.html',
    'TENOVIS.html',
    'brosura.html',
    'blok.html',
    'kuverte.html',
    'etikete.html'
]

table_logo = (
    '<table cellpadding="0" cellspacing="0" style="border: none; margin: 0; padding: 0; font-family: Arial, sans-serif; border-collapse: collapse;">'
    '<tr><td style="color: #8c8f91; font-size: 20px; font-style: italic; font-weight: normal; margin: 0; padding: 0; line-height: 1.1; border: none;">tiskarna</td></tr>'
    '<tr><td style="color: #f99c26; font-size: 36px; font-style: italic; font-weight: bold; margin: 0; padding: 0; padding-left: 15px; line-height: 1.1; border: none;">petrič</td></tr>'
    '</table>'
)

div_pattern = re.compile(
    r'<div[^>]*style="[^"]*">\s*tiskarna\s*<\/div>\s*<div[^>]*style="[^"]*">\s*petrič\s*<\/div>',
    re.IGNORECASE
)

for fname in files_to_update:
    fpath = os.path.join(workspace, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    orig = content
    content = div_pattern.sub(table_logo, content)

    if content != orig:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Cleanly updated logo in: {fname}")
    else:
        print(f"Logo already updated in: {fname}")
