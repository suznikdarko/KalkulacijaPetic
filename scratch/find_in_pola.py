file_path = r'c:\DARKO\KalkulacijaPetric\pola.html'
with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.finditer(r'<h[1-3]\b[^>]*>', text, re.IGNORECASE)
for m in matches:
    start = max(0, m.start() - 10)
    end = min(len(text), m.end() + 100)
    print(text[start:end].strip())
    print("-" * 50)
