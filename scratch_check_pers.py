import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r'c:\DARKO\KalkulacijaPetric\pola1.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(1415, 1490):
    print(f"{i}: {lines[i-1].rstrip()}")
