import re

with open(r'c:\DARKO\KalkulacijaPetric\kuverte1.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Update saveProjectToFile
old_save_proj = "const fileName = name.replace(/[^a-z0-9\\u0100-\\u017F]/gi, '_') + '.kuverte.json';"

new_save_proj = '''const quote = gv('calc-quote-number');
                const cust = gv('calc-customer');
                const qty = gv('calc-quantities');
                const colF = gv('calc-colors-front') || '0';
                const colB = gv('calc-colors-back') || '0';
                
                const parts = [quote, cust, name, qty, colF + '-' + colB].filter(p => p && p.trim() !== '');
                let rawName = parts.join('_');
                const fileName = rawName.replace(/[^a-z0-9\\u0100-\\u017F_-]/gi, '_') + '.kuverte.json';'''

if old_save_proj in html:
    html = html.replace(old_save_proj, new_save_proj)
    print("Updated saveProjectToFile filename logic.")
else:
    print("Could not find old_save_proj")

with open(r'c:\DARKO\KalkulacijaPetric\kuverte1.html', 'w', encoding='utf-8') as f:
    f.write(html)
