with open(r'c:\DARKO\KalkulacijaPetric\pola.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
match = re.search(r'<div id="modal-stock-search".*?</div>\s*</div>\s*</div>', text, re.DOTALL)
if match:
    print("Found modal:")
    print(match.group(0))
else:
    print("Not found with this regex")
