import os

workspace = r"c:\DARKO\KalkulacijaPetric"
files_to_check = [f for f in os.listdir(workspace) if f.endswith(('.html', '.js'))]

for fname in sorted(files_to_check):
    fpath = os.path.join(workspace, fname)
    with open(fpath, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()
    
    logo_lines = []
    isword_lines = []
    for idx, line in enumerate(lines):
        if 'tiskarna' in line.lower() and ('petrič' in line.lower() or (idx + 1 < len(lines) and 'petrič' in lines[idx+1].lower())):
            logo_lines.append(idx + 1)
        if 'isword' in line.lower():
            isword_lines.append(idx + 1)
            
    print(f"=== File: {fname} ===")
    print(f"  Logo lines: {logo_lines}")
    print(f"  isWord lines: {isword_lines[:10]} (total {len(isword_lines)})")
