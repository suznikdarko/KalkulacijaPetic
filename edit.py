import sys
import re

with open("d:\\Git\\KalkulacijaPetric\\TENOVIS.html", "r", encoding="utf-8") as f:
    content = f.read()

# Adjust bleed and gripper to be slightly larger
content = re.sub(r'<div style="flex: 0\.5; min-width: 50px;">', '<div style="flex: 0.6; min-width: 70px;">', content)
content = re.sub(r'<div style="flex: 0\.6; min-width: 60px;">\s*<label>Prijemalec', '<div style="flex: 0.7; min-width: 80px;">\n                    <label>Prijemalec', content)
# We also need to adjust "Stavkov na poli" which is also flex 0.6 / 60px just in case, but let's leave it as is or bump it to 75px.
content = re.sub(r'<div style="flex: 0\.6; min-width: 60px;">\s*<label>Stavkov na poli', '<div style="flex: 0.7; min-width: 75px;">\n                    <label>Stavkov na poli', content)

with open("d:\\Git\\KalkulacijaPetric\\TENOVIS.html", "w", encoding="utf-8") as f:
    f.write(content)
print("Done editing using regex!")
