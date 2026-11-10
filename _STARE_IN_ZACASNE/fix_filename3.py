import re

with open(r'c:\DARKO\KalkulacijaPetric\kuverte1.html', 'r', encoding='utf-8') as f:
    html = f.read()

old_code = '''                const quote = gv('calc-quote-number');
                const cust = gv('calc-customer');
                const qty = gv('calc-quantities');
                const colF = gv('calc-colors-front') || '0';
                const colB = gv('calc-colors-back') || '0';
                
                const parts = [quote, cust, name, qty, colF + '-' + colB].filter(p => p && p.trim() !== '');
                let rawName = parts.join('_');
                const fileName = rawName.replace(/[^a-z0-9\\u0100-\\u017F_-]/gi, '_') + '.kuverte.json';'''

new_code = '''                let quote = gv('calc-quote-number');
                if (quote) quote = 'pon.' + quote.replace(/[\\/\\\\]/g, '-').trim();
                const cust = gv('calc-customer').trim();
                let qty = gv('calc-quantities').replace(/\\s+/g, '').replace(/,/g, '-');
                if (qty) qty = 'nakl.' + qty;
                const colF = gv('calc-colors-front') || '0';
                const colB = gv('calc-colors-back') || '0';
                const colors = (colF === '0' && colB === '0') ? '' : 'b' + colF + colB;
                
                const parts = [quote, cust, name, qty, colors].filter(p => p && p.trim() !== '');
                let rawName = parts.join('_');
                const fileName = rawName.replace(/[^a-z0-9\\u0100-\\u017F_-]/gi, '_').replace(/_+/g, '_') + '.kuverte.json';'''

if old_code in html:
    html = html.replace(old_code, new_code)
    with open(r'c:\DARKO\KalkulacijaPetric\kuverte1.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Updated filename structure successfully!")
else:
    print("Could not find old_code")
