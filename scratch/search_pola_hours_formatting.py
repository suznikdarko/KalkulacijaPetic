with open(r'c:\DARKO\KalkulacijaPetric\pola.html', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

import re

# Search for " h" or "hours" or "toFixed" in pola.html
matches = [m.start() for m in re.finditer(r'\s+h\b|\.toFixed', content)]
print("Hour formatting occurrences in pola.html:", len(matches))
for m in matches:
    print(content[m-40:m+150])
    print("-" * 60)
