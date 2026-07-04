import sys
import re

with open("d:\\Git\\KalkulacijaPetric\\TENOVIS.html", "r", encoding="utf-8") as f:
    content = f.read()

content = re.sub(r'<div style="flex: 0\.8; min-width: 80px;">\s*<label>Bleed', '<div style="flex: 0.5; min-width: 60px;">\n                    <label>Bleed', content)
content = re.sub(r'<div style="flex: 1; min-width: 100px;">\s*<label>Prijemalec', '<div style="flex: 0.6; min-width: 70px;">\n                    <label>Prijemalec', content)
content = re.sub(r'<div style="flex: 1\.2; min-width: 140px;">\s*<label>Naklade', '<div style="flex: 2.5; min-width: 250px;">\n                    <label>Naklade', content)
content = re.sub(r'<div style="flex: 1; min-width: 120px;">\s*<label>Stavkov na poli', '<div style="flex: 0.6; min-width: 80px;">\n                    <label>Stavkov na poli', content)

with open("d:\\Git\\KalkulacijaPetric\\TENOVIS.html", "w", encoding="utf-8") as f:
    f.write(content)
print("Done editing using regex!")
