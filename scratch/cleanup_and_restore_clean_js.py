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

for fname in files_to_clean:
    fpath = os.path.join(workspace, fname)
    if not os.path.exists(fpath):
        continue
        
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    orig = content

    # Remove all injected helper lines
    lines = content.splitlines(True)
    new_lines = []
    for line in lines:
        if '_repl_logo' in line:
            continue
        if 'typeof htmlContent === "string"' in line and 'tiskarna' in line:
            continue
        if 'typeof content === "string"' in line and 'tiskarna' in line:
            continue
        new_lines.append(line)
        
    content = "".join(new_lines)
    
    # Restore standard Blob creation line if it was modified
    content = content.replace('_repl_logo(htmlContent)', 'htmlContent')
    content = content.replace('_repl_logo(content)', 'content')
    
    if content != orig:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Cleaned: {fname}")
    else:
        print(f"No injected lines found in: {fname}")
