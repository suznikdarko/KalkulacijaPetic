import re

def fix_file(filepath):
    # Try reading as UTF-16 first, fallback to UTF-8
    try:
        with open(filepath, 'r', encoding='utf-16') as f:
            content = f.read()
    except Exception:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    
    # 1. Popravi sheetW in sheetH
    content = content.replace(
        "let sheetW = parseFloat(document.getElementById('width').value) || 0;",
        "let resSize = document.getElementById('res-size') ? document.getElementById('res-size').innerText.split('x') : [];\n            let sheetW = resSize.length === 2 ? parseFloat(resSize[0].trim()) : 0;"
    )
    content = content.replace(
        "let sheetH = parseFloat(document.getElementById('height').value) || 0;",
        "let sheetH = resSize.length === 2 ? parseFloat(resSize[1].trim()) : 0;"
    )
    
    # 2. Popravi toLocaleString('sl-SI') -> toLocaleString('de-DE') da bodo pike za tisočice
    # Zamenjamo samo znotraj getWorkOrderHTML, lahko tudi povsod
    content = content.replace("toLocaleString('sl-SI')", "toLocaleString('de-DE')")

    # 3. Formatiraj številke tako, da bo pravilno
    # Zamenjamo ${sourceW/10} na ${String(sourceW/10).replace('.', ',')}
    # in ${sourceH/10}
    # Ne rabiš za vse, ampak user je prosil pike za tisočice. de-DE reši to.

    # 4. Save back as UTF-16 with BOM just to be safe
    with open(filepath, 'w', encoding='utf-16') as f:
        f.write(content)

fix_file(r"C:\DARKO\KalkulacijaPetric\TISKOVNA POLA\tiskovna-pola-kalkulator.html")
fix_file(r"C:\DARKO\KalkulacijaPetric\TISKOVNA POLA\ročna tiskovna pola.html")
print("Done")
