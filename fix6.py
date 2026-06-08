import re

def fix_razrez_and_input(filepath):
    try:
        with open(filepath, 'r', encoding='utf-16') as f:
            content = f.read()
    except Exception:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
    # 1. Zamenjamo input placeholder in text
    old_input_html = """<div class="stat-card full-width" style="margin-top: 5px; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3);">
                        <input type="number" id="calc-given-sheets" placeholder="Vpiši..." style="width: 100%; text-align: center; font-size: 1.25rem; font-weight: bold; border: none; background: transparent; padding: 5px; color: #1e293b;">
                        <div class="label" style="text-align: center;">Dejansko danih pol tiskarju (za D. NALOG)</div>
                    </div>"""
    
    new_input_html = """<div class="stat-card full-width" style="margin-top: 5px; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3);">
                        <input type="number" id="calc-given-sheets" placeholder="Vpiši dodatek..." style="width: 100%; text-align: center; font-size: 1.25rem; font-weight: bold; border: none; background: transparent; padding: 5px; color: #1e293b;">
                        <div class="label" style="text-align: center;">Dodatne pole tiskarju (samo za nalog)</div>
                    </div>"""
    
    content = content.replace(old_input_html, new_input_html)

    # 2. V getWorkOrderHTML spremeni logiko za finalDodatek in finalTotalSheets
    old_logic = """let givenSheetsInput = document.getElementById('calc-given-sheets') ? parseInt(document.getElementById('calc-given-sheets').value) : NaN;
            let finalDodatek = physicalWasteSheets;
            let finalTotalSheets = totalSheets;
            if (!isNaN(givenSheetsInput) && givenSheetsInput > 0) {
                finalDodatek = givenSheetsInput - calcRes.sheetsNeeded;
                finalTotalSheets = givenSheetsInput;
            }"""
            
    new_logic = """let givenDodatekInput = document.getElementById('calc-given-sheets') ? parseInt(document.getElementById('calc-given-sheets').value) : NaN;
            let finalDodatek = physicalWasteSheets;
            let finalTotalSheets = totalSheets;
            let finalSourceSheets = sourceSheets;
            
            if (!isNaN(givenDodatekInput) && givenDodatekInput >= 0) {
                finalDodatek = givenDodatekInput;
                finalTotalSheets = calcRes.sheetsNeeded + givenDodatekInput;
                finalSourceSheets = Math.ceil(finalTotalSheets / sourceYield);
            }"""
            
    content = content.replace(old_logic, new_logic)

    # 3. Posodobi razrez text z finalTotalSheets in finalSourceSheets
    old_razrez = "${sourceSheets.toLocaleString('de-DE')} pol &nbsp;&nbsp; ${sourceW / 10} x ${sourceH / 10} cm &nbsp;&nbsp; na &nbsp;&nbsp; ${totalSheets.toLocaleString('de-DE')} pol ${sheetW}x${sheetH} mm (${sourceYield} iz pole)"
    new_razrez = "${finalSourceSheets.toLocaleString('de-DE')} pol &nbsp;&nbsp; ${sourceW / 10} x ${sourceH / 10} cm &nbsp;&nbsp; na &nbsp;&nbsp; ${finalTotalSheets.toLocaleString('de-DE')} pol ${sheetW}x${sheetH} mm (${sourceYield} iz pole)"
    
    content = content.replace(old_razrez, new_razrez)

    # Posodobi Poraba materiala (sourceSheets -> finalSourceSheets)
    # <td>${sourceSheets.toLocaleString('de-DE')} pol (${sourceW / 10}x${sourceH / 10} cm) - ${paperWeight}g ${paperType}</td>
    old_material = "${sourceSheets.toLocaleString('de-DE')} pol (${sourceW / 10}x${sourceH / 10} cm) - ${paperWeight}g ${paperType}"
    new_material = "${finalSourceSheets.toLocaleString('de-DE')} pol (${sourceW / 10}x${sourceH / 10} cm) - ${paperWeight}g ${paperType}"
    
    content = content.replace(old_material, new_material)

    with open(filepath, 'w', encoding='utf-16') as f:
        f.write(content)
    print(f"Fixed {filepath}")

fix_razrez_and_input(r"C:\DARKO\KalkulacijaPetric\TISKOVNA POLA\tiskovna-pola-kalkulator.html")
fix_razrez_and_input(r"C:\DARKO\KalkulacijaPetric\TISKOVNA POLA\ročna tiskovna pola.html")
