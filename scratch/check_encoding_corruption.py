import os

workspace = r"c:\DARKO\KalkulacijaPetric"
files = ['pola.html', 'TENOVIS.html', 'brosura.html', 'blok.html', 'kuverte.html', 'etikete.html']

for fname in files:
    fpath = os.path.join(workspace, fname)
    with open(fpath, 'rb') as f:
        data = f.read()
    
    # Check if file has invalid UTF-8 bytes or replacement character
    try:
        text = data.decode('utf-8')
        print(f"{fname}: Valid UTF-8. Replacements count (\ufffd): {text.count('\ufffd')}")
        if 'petri' in text:
            print(f"  FOUND petri\\ufffd in {fname}")
    except Exception as e:
        print(f"{fname}: UTF-8 decode error: {e}")
