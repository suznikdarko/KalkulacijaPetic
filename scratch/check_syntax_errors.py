import os
import subprocess

workspace = r"c:\DARKO\KalkulacijaPetric"
files = ['pola.html', 'TENOVIS.html', 'brosura.html', 'blok.html', 'kuverte.html', 'etikete.html']

for fname in files:
    fpath = os.path.join(workspace, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract script tags and check syntax with node
    scripts = []
    pos = 0
    while True:
        s_idx = content.find('<script', pos)
        if s_idx == -1:
            break
        body_start = content.find('>', s_idx)
        if body_start == -1:
            break
        body_start += 1
        e_idx = content.find('</script>', body_start)
        if e_idx == -1:
            break
        script_content = content[body_start:e_idx]
        scripts.append(script_content)
        pos = e_idx + 9

    full_js = "\n".join(scripts)
    temp_js_path = os.path.join(workspace, 'scratch', f'temp_check_{fname}.js')
    with open(temp_js_path, 'w', encoding='utf-8') as f:
        f.write(full_js)

    try:
        res = subprocess.run(['node', '--check', temp_js_path], capture_output=True, text=True, check=True)
        print(f"{fname}: JS Syntax OK")
    except subprocess.CalledProcessError as err:
        print(f"!!! {fname}: JS Syntax ERROR !!!")
        print(err.stderr)
