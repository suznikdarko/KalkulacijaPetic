import os

files = [
    r'c:\DARKO\KalkulacijaPetric\blok.html',
    r'c:\DARKO\KalkulacijaPetric\brosura.html',
    r'c:\DARKO\KalkulacijaPetric\pola.html',
    r'c:\DARKO\KalkulacijaPetric\TENOVIS.html'
]

replacements = [
    (
        "score = (bestForThisSheet.count * sYield * 1000000) + (bestForThisSheet.count * 1000) - ((sheet.w * sheet.h) / 1000.0);",
        "score = (bestForThisSheet.count * 1000000) + (sYield * 1000) - ((sheet.w * sheet.h) / 1000.0);"
    ),
    (
        "score = (bL.count * sY * 1000000) + (bL.count * 1000) - ((sheet.w * sheet.h) / 1000.0);",
        "score = (bL.count * 1000000) + (sY * 1000) - ((sheet.w * sheet.h) / 1000.0);"
    ),
    (
        "score = (currLayout.count * sYield * 1000000) + (currLayout.count * 1000) - (sheetArea / 1000.0);",
        "score = (currLayout.count * 1000000) + (sYield * 1000) - (sheetArea / 1000.0);"
    )
]

for file_path in files:
    if not os.path.exists(file_path):
        continue
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False
    for old, new in replacements:
        if old in content:
            content = content.replace(old, new)
            modified = True
            
    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Reverted {file_path}")
    else:
        print(f"No changes needed in {file_path}")
