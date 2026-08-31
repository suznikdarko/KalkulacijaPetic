import os

fpath = r"c:\DARKO\KalkulacijaPetric\etikete.html"

with open(fpath, 'rb') as f:
    raw_data = f.read()

# Try reading as UTF-8, if double-encoded or CP1252, fix common corruptions
text = raw_data.decode('utf-8', errors='ignore')

# Common double-encoded UTF-8 / CP1252 corruptions:
replacements = {
    'â–Ľ': '▼',
    'Ĺ tevilka': 'Številka',
    'Ĺˇ': 'š',
    'ÄŤ': 'č',
    'Ĺľ': 'ž',
    'Ĺ': 'Š',
    'ÄŚ': 'Č',
    'Ĺ˝': 'Ž',
    'Â˛': '²',
    'đź“‚': '📁',
    'đź“¤': '📤',
    'đź“„': '📄',
    'đźľ': '🔍'
}

for k, v in replacements.items():
    text = text.replace(k, v)

# Fix line 2725 template literal to use string concatenation
old_line = "let hourText = isAuto ? `${workHours.toFixed(2)} h(avto)` : `${workHours.toFixed(2)} h(ročno)`;"
new_line = "let hourText = isAuto ? (workHours.toFixed(2) + ' h(avto)') : (workHours.toFixed(2) + ' h(rocno)');"

if old_line in text:
    text = text.replace(old_line, new_line)
else:
    # Match any hourText line with regex
    import re
    text = re.sub(
        r'let\s+hourText\s*=\s*isAuto\s*\?.*?;',
        "let hourText = isAuto ? (workHours.toFixed(2) + ' h(avto)') : (workHours.toFixed(2) + ' h(rocno)');",
        text
    )

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed etikete.html encoding and hourText line!")
