import re

def fix_workorder_spacing_and_fonts(filepath):
    try:
        with open(filepath, 'r', encoding='utf-16') as f:
            content = f.read()
    except Exception:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

    # 1. line-height: 1.4 -> 1.2
    content = content.replace("line-height: 1.4;", "line-height: 1.2;")

    # 2. .row-divider margin: 10px 0; -> 5px 0;
    content = content.replace("margin: 10px 0;", "margin: 5px 0;")

    # 3. customer font-size: 18px -> 20px
    content = content.replace('<div class="bold" style="font-size: 18px;">${customer}</div>', '<div class="bold" style="font-size: 20px;">${customer}</div>')

    # 4. deadline
    content = content.replace('<div><span class="bold">Rok izdelave:</span> ${deadline}</div>', '<div style="font-size: 18px;"><span class="bold">Rok izdelave:</span> ${deadline}</div>')

    # 5. dnNum
    content = content.replace('<div class="bold" style="font-size: 16px;">D.N.: ${dnNum}</div>', '<div class="bold" style="font-size: 20px;">D.N.: ${dnNum}</div>')

    # 6. dnOld
    content = content.replace('`<div>Stari D.N. (montaža): ${dnOld}</div>`', '`<div style="font-size: 18px; margin-top: 2px;">Stari D.N. (montaža): ${dnOld}</div>`')

    # 7. quoteNum
    content = content.replace('<td style="width: 50%; text-align: right;">Ponudba: ${quoteNum}</td>', '<td style="width: 50%; text-align: right; font-size: 18px;">Ponudba: ${quoteNum}</td>')

    # 8. product
    content = content.replace('<td class="bold" style="font-size: 15px; width: 50%;">${product}</td>', '<td class="bold" style="font-size: 20px; width: 50%;">${product}</td>')

    # 9. margins between tables
    content = content.replace('<table style="margin-top: 15px; width: 100%;">', '<table style="margin-top: 5px; width: 100%;">')
    # the first table is already margin-top: 10px, maybe reduce it to 5px
    # Need to be careful not to replace ALL margin-top: 10px;
    content = content.replace('<table style="margin-top: 10px;">\n                    <tr>\n                        <td style="width: 50%;">\n                            ${urgent', '<table style="margin-top: 5px;">\n                    <tr>\n                        <td style="width: 50%;">\n                            ${urgent')

    with open(filepath, 'w', encoding='utf-16') as f:
        f.write(content)
    print(f"Fixed {filepath}")

fix_workorder_spacing_and_fonts(r"C:\DARKO\KalkulacijaPetric\TISKOVNA POLA\tiskovna-pola-kalkulator.html")
fix_workorder_spacing_and_fonts(r"C:\DARKO\KalkulacijaPetric\TISKOVNA POLA\ročna tiskovna pola.html")
