import os

workspace = r"c:\DARKO\KalkulacijaPetric"
files = ['pola.html', 'TENOVIS.html', 'brosura.html', 'blok.html', 'kuverte.html', 'etikete.html']

for fname in files:
    fpath = os.path.join(workspace, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    print(f"=== {fname} ===")
    for idx, line in enumerate(lines):
        if 'typeof htmlContent' in line or 'typeof content' in line or '_repl_logo' in line:
            print(f"Line {idx+1}: {line.strip()}")
