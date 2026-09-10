import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open(r'c:\DARKO\KalkulacijaPetric\TENOVIS.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(2730, 2775):
    print(f"{i}: {lines[i-1].rstrip()}")
