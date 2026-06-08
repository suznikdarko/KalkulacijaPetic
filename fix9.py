import os

def fix_callee(filepath):
    try:
        with open(filepath, 'r', encoding='utf-16') as f:
            content = f.read()
    except Exception:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
    content = content.replace("arguments.callee.name", '"Function"')
    
    with open(filepath, 'w', encoding='utf-16') as f:
        f.write(content)

fix_callee(r"C:\DARKO\KalkulacijaPetric\TISKOVNA POLA\tiskovna-pola-kalkulator.html")
fix_callee(r"C:\DARKO\KalkulacijaPetric\TISKOVNA POLA\ročna tiskovna pola.html")
print("Done")
