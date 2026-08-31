import os
import re

workspace = r"c:\DARKO\KalkulacijaPetric"
files_to_clean = [
    'pola.html',
    'TENOVIS.html',
    'brosura.html',
    'blok.html',
    'kuverte.html',
    'etikete.html',
    'kuverte – kopija.html',
    'kuverte – kopija – kopija.html',
    'p_script_1.js',
    'temp_script_1.js',
    'k_script_0.js'
]

pattern = re.compile(
    r'if\s*\(\s*isWord\s*\)\s*\{\s*contentToRender\s*=\s*contentToRender\.replace\(\s*/<div[^>]*>.*?/gi\s*,\s*`.*?`\s*\);\s*\}',
    re.DOTALL
)

for fname in files_to_clean:
    fpath = os.path.join(workspace, fname)
    if not os.path.exists(fpath):
        continue
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    orig = content
    content = pattern.sub('', content)

    if content != orig:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Removed obsolete isWord replace from: {fname}")
    else:
        print(f"No obsolete isWord replace pattern match in: {fname}")
