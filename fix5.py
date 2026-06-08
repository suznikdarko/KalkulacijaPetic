import re

def fix_razrez_and_input(filepath):
    try:
        with open(filepath, 'r', encoding='utf-16') as f:
            content = f.read()
    except Exception:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
    # 1. Dodaj vnosno polje pod "Potrebno število pol za tisk"
    old_input_html = """<div class="stat-card full-width">
                        <div class="value" id="res-sheets-needed">0</div>
                        <div class="label">Potrebno število pol za tisk</div>
                    </div>"""
    
    new_input_html = """<div class="stat-card full-width">
                        <div class="value" id="res-sheets-needed">0</div>
                        <div class="label">Potrebno število pol za tisk</div>
                    </div>
                    <div class="stat-card full-width" style="margin-top: 5px; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3);">
                        <input type="number" id="calc-given-sheets" placeholder="Vpiši..." style="width: 100%; text-align: center; font-size: 1.25rem; font-weight: bold; border: none; background: transparent; padding: 5px; color: #1e293b;">
                        <div class="label" style="text-align: center;">Dejansko danih pol tiskarju (za D. NALOG)</div>
                    </div>"""
    
    if 'calc-given-sheets' not in content:
        content = content.replace(old_input_html, new_input_html)

    # 2. V getWorkOrderHTML dodaj branje tega inputa
    old_waste = "let physicalWasteSheets = totalSheets - calcRes.sheetsNeeded;"
    new_waste = """let physicalWasteSheets = totalSheets - calcRes.sheetsNeeded;
            let givenSheetsInput = document.getElementById('calc-given-sheets') ? parseInt(document.getElementById('calc-given-sheets').value) : NaN;
            let finalDodatek = physicalWasteSheets;
            let finalTotalSheets = totalSheets;
            if (!isNaN(givenSheetsInput) && givenSheetsInput > 0) {
                finalDodatek = givenSheetsInput - calcRes.sheetsNeeded;
                finalTotalSheets = givenSheetsInput;
            }"""
    
    if 'let finalDodatek' not in content:
        content = content.replace(old_waste, new_waste)

    # 3. Zamenjaj izpis tiska v getWorkOrderHTML
    old_print_text = "${calcRes.sheetsNeeded.toLocaleString('de-DE')} + ${physicalWasteSheets.toLocaleString('de-DE')} (dodatek) = ${totalSheets.toLocaleString('de-DE')} tisk. pol"
    new_print_text = "${calcRes.sheetsNeeded.toLocaleString('de-DE')} + ${finalDodatek.toLocaleString('de-DE')} (dodatek) = ${finalTotalSheets.toLocaleString('de-DE')} tisk. pol"
    
    content = content.replace(old_print_text, new_print_text)

    # 4. Zamenjaj ${sheetW / 10} x ${sheetH / 10} cm z ${sheetW}x${sheetH} mm
    # Original is: ${sheetW / 10} x ${sheetH / 10} cm
    content = re.sub(r"\$\{sheetW\s*/\s*10\}\s*x\s*\$\{sheetH\s*/\s*10\}\s*cm", r"${sheetW}x${sheetH} mm", content)

    with open(filepath, 'w', encoding='utf-16') as f:
        f.write(content)
    print(f"Fixed {filepath}")

fix_razrez_and_input(r"C:\DARKO\KalkulacijaPetric\TISKOVNA POLA\tiskovna-pola-kalkulator.html")
fix_razrez_and_input(r"C:\DARKO\KalkulacijaPetric\TISKOVNA POLA\ročna tiskovna pola.html")
