import os
import re

fpath = r"c:\DARKO\KalkulacijaPetric\etikete.html"
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

script_blocks = re.findall(r'<script[^>]*>(.*?)</script>', content, re.DOTALL)
block3 = script_blocks[2]

lines = block3.splitlines()
count = 0
for idx, line in enumerate(lines):
    b = line.count('`')
    count += b
    if b > 0:
        print(f"Line {idx+1}: {b} backticks (Total: {count}) | {line[:80]}")
