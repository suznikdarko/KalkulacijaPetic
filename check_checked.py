import re
with open(r'c:\DARKO\KalkulacijaPetric\kuverte1.html', 'r', encoding='utf-8') as f:
    html = f.read()

ids = set(re.findall(r"getElementById\('([^']+)'\)", html))

missing = []
for idx in ids:
    if f'id="{idx}"' not in html and f"id='{idx}'" not in html:
        missing.append(idx)

for m in missing:
    matches = re.findall(rf"getElementById\('{m}'\)\.[a-zA-Z]+", html)
    if matches:
        print(f"Missing ID {m} has accesses: {matches}")
