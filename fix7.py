import re

def fix_dimensions_format(filepath):
    try:
        with open(filepath, 'r', encoding='utf-16') as f:
            content = f.read()
    except Exception:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

    # Dodajmo spremenljivke v getWorkOrderHTML pred "let html ="
    vars_injection = """
            let sourceWCm = (sourceW / 10).toLocaleString('de-DE', { maximumFractionDigits: 2 });
            let sourceHCm = (sourceH / 10).toLocaleString('de-DE', { maximumFractionDigits: 2 });
            let sheetWCm = (sheetW / 10).toLocaleString('de-DE', { maximumFractionDigits: 2 });
            let sheetHCm = (sheetH / 10).toLocaleString('de-DE', { maximumFractionDigits: 2 });

            let html = `"""
            
    content = content.replace("let html = `", vars_injection)

    # Sedaj popravimo "06 razrez:"
    # Oziroma string: ${finalSourceSheets.toLocaleString('de-DE')} pol &nbsp;&nbsp; ${sourceW / 10} x ${sourceH / 10} cm &nbsp;&nbsp; na &nbsp;&nbsp; ${finalTotalSheets.toLocaleString('de-DE')} pol ${sheetW}x${sheetH} mm (${sourceYield} iz pole)
    old_razrez = "${finalSourceSheets.toLocaleString('de-DE')} pol &nbsp;&nbsp; ${sourceW / 10} x ${sourceH / 10} cm &nbsp;&nbsp; na &nbsp;&nbsp; ${finalTotalSheets.toLocaleString('de-DE')} pol ${sheetW}x${sheetH} mm (${sourceYield} iz pole)"
    new_razrez = "${finalSourceSheets.toLocaleString('de-DE')} pol ${sourceWCm}x${sourceHCm} cm na ${finalTotalSheets.toLocaleString('de-DE')} pol ${sheetWCm}x${sheetHCm} cm (${sourceYield} iz pole)"
    
    if old_razrez in content:
        content = content.replace(old_razrez, new_razrez)
    else:
        # Poglejmo z regexom, e je kaj drugae
        content = re.sub(
            r"\$\{finalSourceSheets\.toLocaleString\('de-DE'\)\} pol.*?iz pole\)",
            new_razrez,
            content
        )

    # Popravimo tudi "Poraba materiala:"
    # <td>${finalSourceSheets.toLocaleString('de-DE')} pol (${sourceW / 10}x${sourceH / 10} cm) - ${paperWeight}g ${paperType}</td>
    old_material = "${finalSourceSheets.toLocaleString('de-DE')} pol (${sourceW / 10}x${sourceH / 10} cm) - ${paperWeight}g ${paperType}"
    new_material = "${finalSourceSheets.toLocaleString('de-DE')} pol (${sourceWCm}x${sourceHCm} cm) - ${paperWeight}g ${paperType}"
    
    if old_material in content:
        content = content.replace(old_material, new_material)
    else:
        content = re.sub(
            r"\$\{finalSourceSheets\.toLocaleString\('de-DE'\)\} pol \(\$\{sourceW / 10\}x\$\{sourceH / 10\} cm\) - \$\{paperWeight\}g \$\{paperType\}",
            new_material,
            content
        )

    with open(filepath, 'w', encoding='utf-16') as f:
        f.write(content)
    print(f"Fixed {filepath}")

fix_dimensions_format(r"C:\DARKO\KalkulacijaPetric\TISKOVNA POLA\tiskovna-pola-kalkulator.html")
fix_dimensions_format(r"C:\DARKO\KalkulacijaPetric\TISKOVNA POLA\ročna tiskovna pola.html")
