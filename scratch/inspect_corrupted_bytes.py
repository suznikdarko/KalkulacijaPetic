import os

workspace = r"c:\DARKO\KalkulacijaPetric"
files = ['pola.html', 'TENOVIS.html', 'brosura.html', 'blok.html', 'kuverte.html', 'etikete.html']

for fname in files:
    fpath = os.path.join(workspace, fname)
    with open(fpath, 'r', encoding='utf-8', errors='replace') as f:
        lines = f.readlines()
    
    corrupted_lines = []
    for idx, line in enumerate(lines):
        if '\ufffd' in line:
            corrupted_lines.append((idx + 1, line.strip()))
            
    print(f"=== {fname}: {len(corrupted_lines)} corrupted lines ===")
    for line_num, lcontent in corrupted_lines[:15]:
        print(f"  Line {line_num}: {lcontent[:120]}")
