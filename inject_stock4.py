with open(r'c:\DARKO\KalkulacijaPetric\pola.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

stock_logic = "".join(lines[8247:8880])

with open(r'c:\DARKO\KalkulacijaPetric\kuverte1.html', 'r', encoding='utf-8') as f:
    html = f.read()

idx = html.rfind("</script>\n</body>")
if idx != -1:
    html = html[:idx] + "\n" + stock_logic + "\n" + html[idx:]
    with open(r'c:\DARKO\KalkulacijaPetric\kuverte1.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Injected stock logic successfully!")
