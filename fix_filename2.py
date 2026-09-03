import re

with open(r'c:\DARKO\KalkulacijaPetric\kuverte1.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Let's find the line with "const fileName = name.replace("
html = re.sub(
    r"const fileName = name\.replace\([^;]+;\n",
    '''const quote = gv('calc-quote-number');
                const cust = gv('calc-customer');
                const qty = gv('calc-quantities');
                const colF = gv('calc-colors-front') || '0';
                const colB = gv('calc-colors-back') || '0';
                
                const parts = [quote, cust, name, qty, colF + '-' + colB].filter(p => p && p.trim() !== '');
                let rawName = parts.join('_');
                const fileName = rawName.replace(/[^a-z0-9\\u0100-\\u017F_-]/gi, '_') + '.kuverte.json';\n''',
    html
)

with open(r'c:\DARKO\KalkulacijaPetric\kuverte1.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated via regex")
