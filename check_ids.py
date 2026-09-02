import re

with open(r'c:\DARKO\KalkulacijaPetric\kuverte1.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Extract all getElementById IDs from the JS part
js_start = html.find('<script>')
js_part = html[js_start:]

ids = set(re.findall(r"getElementById\('([^']+)'\)", js_part))

html_part = html[:js_start]
missing_ids = []
for idx in ids:
    if f'id="{idx}"' not in html_part and f"id='{idx}'" not in html_part:
        missing_ids.append(idx)

print("Missing IDs:", missing_ids)
