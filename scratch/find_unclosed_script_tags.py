import os
import re

workspace = r"c:\DARKO\KalkulacijaPetric"
files = ['pola.html', 'TENOVIS.html', 'brosura.html', 'blok.html', 'kuverte.html', 'etikete.html', 'kuverte – kopija.html', 'kuverte – kopija – kopija.html']

for fname in files:
    fpath = os.path.join(workspace, fname)
    if not os.path.exists(fpath):
        continue
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find script tags and check if HTML tags like <div or <!-- are inside script blocks
    script_blocks = re.findall(r'<script[^>]*>(.*?)</script>', content, re.DOTALL)
    for idx, sblock in enumerate(script_blocks):
        # Look for suspicious HTML markup inside JS script block
        suspicious = re.findall(r'(\s*<div\s+|\s*<!--\s*MODAL|\s*<span\s+|\s*<table\s+)', sblock, re.IGNORECASE)
        if suspicious:
            print(f"!!! {fname}: Script block {idx+1} contains suspicious HTML markup: {suspicious[:5]}")

print("Check completed!")
