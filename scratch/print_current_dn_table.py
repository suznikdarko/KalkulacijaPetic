with open(r'c:\DARKO\KalkulacijaPetric\brosura.html', 'r', encoding='utf-8') as f:
    content = f.read()

import re

idx = content.find('VLOŽEK')
if idx != -1:
    print(content[idx-100:idx+800])
else:
    print("Not found!")
