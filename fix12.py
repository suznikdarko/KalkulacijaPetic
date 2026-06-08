import os

def fix_encoding(filepath):
    # Read as utf-16
    with open(filepath, 'rb') as f:
        b = f.read()
    
    # Try decoding
    try:
        s = b.decode('utf-16')
    except Exception:
        s = b.decode('utf-16-le', 'ignore')
        
    # Write as utf-8
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(s)
    print(f"Fixed {filepath}")

fix_encoding(r"C:\DARKO\KalkulacijaPetric\TISKOVNA POLA\tiskovna-pola-kalkulator.html")
fix_encoding(r"C:\DARKO\KalkulacijaPetric\TISKOVNA POLA\ročna tiskovna pola.html")
