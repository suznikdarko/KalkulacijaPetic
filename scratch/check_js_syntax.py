import os
import re

workspace = r"c:\DARKO\KalkulacijaPetric"
files = ['pola.html', 'TENOVIS.html', 'brosura.html', 'blok.html', 'kuverte.html', 'etikete.html']

for fname in files:
    fpath = os.path.join(workspace, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all <script> blocks
    script_blocks = re.findall(r'<script[^>]*>(.*?)</script>', content, re.DOTALL)
    print(f"=== {fname}: {len(script_blocks)} script blocks ===")
    
    for idx, sblock in enumerate(script_blocks):
        # Check backtick balance
        backticks = sblock.count('`')
        if backticks % 2 != 0:
            print(f"  [ERROR] Script block {idx+1}: UNBALANCED BACKTICKS ({backticks})")
            
        # Check parenthesis / brace balance (rough check ignoring strings)
        # Check for invalid characters or regex errors
        if '_repl_logo' in sblock:
            # Print injected _repl_logo line
            for line in sblock.splitlines():
                if '_repl_logo' in line:
                    print(f"  Injected line: {line.strip()}")
        if 'typeof htmlContent' in sblock or 'typeof content' in sblock:
            for line in sblock.splitlines():
                if 'typeof htmlContent === "string"' in line or 'typeof content === "string"' in line:
                    print(f"  Injected line: {line.strip()}")
