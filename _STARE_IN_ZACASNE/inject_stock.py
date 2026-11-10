import re

with open(r'c:\DARKO\KalkulacijaPetric\pola.html', 'r', encoding='utf-8') as f:
    pola_html = f.read()

# Extract stock logic
match = re.search(r'(// --- LOGIKA ZA SAMODEJNO PREVERJANJE ZALOGE SIMON ---.*?function initStockData\(\) \{.*?\})', pola_html, re.DOTALL)
if match:
    stock_logic = match.group(1)
    
    # We need to append the DOMContentLoaded to call initStockData
    stock_logic += '''

        document.addEventListener('DOMContentLoaded', () => {
            initStockData();
        });
'''

    with open(r'c:\DARKO\KalkulacijaPetric\kuverte1.html', 'r', encoding='utf-8') as f:
        kuverte_html = f.read()
        
    idx = kuverte_html.rfind("</script>\n</body>")
    if idx != -1:
        kuverte_html = kuverte_html[:idx] + "\n" + stock_logic + "\n" + kuverte_html[idx:]
        with open(r'c:\DARKO\KalkulacijaPetric\kuverte1.html', 'w', encoding='utf-8') as f:
            f.write(kuverte_html)
        print("Injected stock logic successfully!")
else:
    print("Could not find stock logic in pola.html")
