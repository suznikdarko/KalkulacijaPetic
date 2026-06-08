import re

def fix_renderDetailedSpec(filepath):
    try:
        with open(filepath, 'r', encoding='utf-16') as f:
            content = f.read()
    except Exception:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

    # The block that was accidentally injected into renderDetailedSpec:
    bad_block = """            let sourceWCm = (sourceW / 10).toLocaleString('de-DE', { maximumFractionDigits: 2 });
            let sourceHCm = (sourceH / 10).toLocaleString('de-DE', { maximumFractionDigits: 2 });
            let sheetWCm = (sheetW / 10).toLocaleString('de-DE', { maximumFractionDigits: 2 });
            let sheetHCm = (sheetH / 10).toLocaleString('de-DE', { maximumFractionDigits: 2 });

            let html = `
                <!-- PAPER -->"""

    good_block = """            let html = `
                <!-- PAPER -->"""

    content = content.replace(bad_block, good_block)

    with open(filepath, 'w', encoding='utf-16') as f:
        f.write(content)
    print(f"Fixed {filepath}")

fix_renderDetailedSpec(r"C:\DARKO\KalkulacijaPetric\TISKOVNA POLA\tiskovna-pola-kalkulator.html")
fix_renderDetailedSpec(r"C:\DARKO\KalkulacijaPetric\TISKOVNA POLA\ročna tiskovna pola.html")
