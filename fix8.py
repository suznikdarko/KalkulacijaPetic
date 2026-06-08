import re

def fix_sheetw_in_getworkorderhtml(filepath):
    try:
        with open(filepath, 'r', encoding='utf-16') as f:
            content = f.read()
    except Exception:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

    # 1. Popravi definicijo sheetW in sheetH
    old_sheetW = """let sheetW = d.paper.sheetW || 0;
            let sheetH = d.paper.sheetH || 0;"""
            
    new_sheetW = """let resSizeTxt = document.getElementById('res-size') ? document.getElementById('res-size').innerText.split('x') : [];
            let sheetW = resSizeTxt.length === 2 ? parseFloat(resSizeTxt[0].trim()) : 0;
            let sheetH = resSizeTxt.length === 2 ? parseFloat(resSizeTxt[1].trim()) : 0;"""
            
    content = content.replace(old_sheetW, new_sheetW)

    # 2. Dodaj presledke okrog 'x' pri izpisu (npr. 59,2 x 41,8 cm namesto 59,2x41,8 cm)
    content = content.replace("${sourceWCm}x${sourceHCm} cm", "${sourceWCm} x ${sourceHCm} cm")
    content = content.replace("${sheetWCm}x${sheetHCm} cm", "${sheetWCm} x ${sheetHCm} cm")

    with open(filepath, 'w', encoding='utf-16') as f:
        f.write(content)
    print(f"Fixed {filepath}")

fix_sheetw_in_getworkorderhtml(r"C:\DARKO\KalkulacijaPetric\TISKOVNA POLA\tiskovna-pola-kalkulator.html")
fix_sheetw_in_getworkorderhtml(r"C:\DARKO\KalkulacijaPetric\TISKOVNA POLA\ročna tiskovna pola.html")
