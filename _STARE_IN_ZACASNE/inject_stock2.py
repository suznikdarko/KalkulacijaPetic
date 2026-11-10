with open(r'c:\DARKO\KalkulacijaPetric\pola.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start = -1
end = -1
for i, l in enumerate(lines):
    if '// --- LOGIKA ZA SAMODEJNO PREVERJANJE ZALOGE SIMON ---' in l:
        start = i
    if start != -1 and 'document.addEventListener(\'DOMContentLoaded\', () => {' in l:
        end = i + 3
        break

if start != -1 and end != -1:
    stock_logic = "".join(lines[start:end])
    
    with open(r'c:\DARKO\KalkulacijaPetric\kuverte1.html', 'r', encoding='utf-8') as f:
        html = f.read()
        
    idx = html.rfind("</script>\n</body>")
    if idx != -1:
        html = html[:idx] + "\n" + stock_logic + "\n" + html[idx:]
        with open(r'c:\DARKO\KalkulacijaPetric\kuverte1.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print("Injected stock logic successfully!")
