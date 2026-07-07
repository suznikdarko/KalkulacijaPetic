import os
import glob
import re

for filepath in glob.glob('*.html'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content

    # In kuverte.html, fix formatPrice definition
    if 'kuverte.html' in filepath:
        old_fn = """function formatPrice(val, decimals = 2) {
            return val.toFixed(decimals).replace('.', ',') + " €";
        }"""
        new_fn = """function formatPrice(num, decimals = 2) {
            if (num == null || isNaN(num)) return "0,00";
            let parts = Number(num).toFixed(decimals).split('.');
            parts[0] = parts[0].replace(/\\B(?=(\\d{3})+(?!\\d))/g, ".");
            return parts.join(',') + " €";
        }"""
        new_content = new_content.replace(old_fn, new_fn)

    # In brosura.html and blok.html getQuoteHTML:
    
    # 1:
    old_1 = "${(q.perItem !== undefined ? q.perItem : (q.pricePerUnit || 0)).toFixed(4)} €"
    new_1 = "${formatPrice((q.perItem !== undefined ? q.perItem : (q.pricePerUnit || 0)), 4)}"
    new_content = new_content.replace(old_1, new_1)
    
    # 2:
    old_2 = "${(q.total !== undefined ? q.total : (q.priceTotal || 0)).toFixed(2)} €"
    new_2 = "${formatPrice((q.total !== undefined ? q.total : (q.priceTotal || 0)), 2)}"
    new_content = new_content.replace(old_2, new_2)

    # 3: kuverte.html
    new_content = new_content.replace("${res.materialCost.toFixed(2)} €", "${formatPrice(res.materialCost, 2)}")
    new_content = new_content.replace("${res.platesCost.toFixed(2)} €", "${formatPrice(res.platesCost, 2)}")
    new_content = new_content.replace("${(res.printCost + res.colorChangeCost).toFixed(2)} €", "${formatPrice((res.printCost + res.colorChangeCost), 2)}")
    new_content = new_content.replace("${res.additionalCost.toFixed(2)} €", "${formatPrice(res.additionalCost, 2)}")
    new_content = new_content.replace("${res.finalTotal.toFixed(2)} €", "${formatPrice(res.finalTotal, 2)}")
    new_content = new_content.replace("${res.pricePerItem.toFixed(4)} €", "${formatPrice(res.pricePerItem, 4)}")
    
    # Replace ? with € in regex replacements just in case
    # Not needed because we matched exact strings from code
    
    # Fix broken formatPrice symbols if they have " ?"
    new_content = new_content.replace('return parts.join(\',\') + " ?";', 'return parts.join(\',\') + " €";')

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")
