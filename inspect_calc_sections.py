import os
import re
import sys

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

files = ['blok2.html', 'brosura2.html', 'TENOVIS2.html', 'kuverte2.html', 'etikete2.html', 'koledar2.html']
base_dir = r'c:\DARKO\KalkulacijaPetric'

for fname in files:
    fpath = os.path.join(base_dir, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        c = f.read()
    print('==================== ' + fname + ' ====================')
    calc_match = re.search(r'(<div[^>]*class="[^"]*calculation[^"]*"[\s\S]*?)(?=<script|<div id="modal|$)', c)
    if calc_match:
        calc_content = calc_match.group(1)
        h2s = re.findall(r'<h2[^>]*>([\s\S]*?)</h2>', calc_content)
        h3s = re.findall(r'<h3[^>]*>([\s\S]*?)</h3>', calc_content)
        print('  H2s:', [re.sub(r'<[^>]+>', '', h).strip() for h in h2s])
        for i, h in enumerate(h3s):
            clean_h = re.sub(r'<[^>]+>', '', h).strip()
            print(f'    [{i+1}] {clean_h}')
    else:
        # Check what panels exist
        panels = re.findall(r'<div[^>]*class="[^"]*panel[^"]*"[^>]*>', c)
        print('  No .calculation panel! Found panels:', panels)
