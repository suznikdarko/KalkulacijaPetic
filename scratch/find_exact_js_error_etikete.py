import os
import re
import subprocess

fpath = r"c:\DARKO\KalkulacijaPetric\etikete.html"
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract script blocks
scripts = re.findall(r'<script[^>]*>(.*?)</script>', content, re.DOTALL)

for idx, script in enumerate(scripts):
    temp_path = f"scratch/temp_script_etikete_{idx}.js"
    with open(temp_path, 'w', encoding='utf-8') as f_out:
        f_out.write(script)
        
    try:
        # Use python syntax check or check lines
        print(f"Script block {idx+1} length: {len(script)} chars")
    except Exception as e:
        print(e)
