with open(r'c:\DARKO\KalkulacijaPetric\TENOVIS.html', 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if 'localStorage.getItem' in line or 'localStorage.setItem' in line:
        print(f"line {idx+1}: {line.strip()}")
