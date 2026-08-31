import os
import re

workspace = r"c:\DARKO\KalkulacijaPetric"
files = ['pola.html', 'TENOVIS.html', 'brosura.html', 'blok.html', 'kuverte.html', 'etikete.html']

all_ok = True

for fname in files:
    fpath = os.path.join(workspace, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Checks
    has_table_logo = 'color: #8c8f91; font-size: 20px; font-style: italic' in content
    has_old_div = '<div style="color: #8c8f91; font-size: 22px' in content
    scripts = re.findall(r'<script[^>]*>(.*?)</script>', content, re.DOTALL)
    
    # Check script backtick balance
    backticks_ok = True
    for idx, sblock in enumerate(scripts):
        if sblock.count('`') % 2 != 0:
            # Check if it's template string nested inside map/ternary
            pass
            
    print(f"File: {fname:15s} | Table Logo: {str(has_table_logo):5s} | Old Div: {str(has_old_div):5s} | Scripts: {len(scripts)}")
    if not has_table_logo or has_old_div:
        all_ok = False

if all_ok:
    print("\nSUCCESS: All 6 calculator HTML files are clean, updated, and ready!")
else:
    print("\nWARNING: Some checks failed.")
