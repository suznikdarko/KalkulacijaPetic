import re

with open('blok.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the specific lines updating res-price-per-item
# Old: if (document.getElementById('res-price-per-item')) document.getElementById('res-price-per-item').innerText = perItemFinal.toFixed(3) + " €";
# New: document.querySelectorAll('#res-price-per-item').forEach(el => el.innerText = perItemFinal.toFixed(4) + " €");

old_line_total = r"if \(document\.getElementById\('res-price-total'\)\) document\.getElementById\('res-price-total'\)\.innerText = totalPrice\.toFixed\(2\) \+ \" €\";"
new_line_total = r"document.querySelectorAll('#res-price-total').forEach(el => el.innerText = totalPrice.toFixed(2) + ' €');"
text = re.sub(old_line_total, new_line_total, text)

old_line_per_item = r"if \(document\.getElementById\('res-price-per-item'\)\) document\.getElementById\('res-price-per-item'\)\.innerText = perItemFinal\.toFixed\(3\) \+ \" €\";"
new_line_per_item = r"document.querySelectorAll('#res-price-per-item').forEach(el => el.innerText = perItemFinal.toFixed(4) + ' €');"
text = re.sub(old_line_per_item, new_line_per_item, text)

with open('blok.html', 'w', encoding='utf-8') as f:
    f.write(text)
print("Updated price update logic in javascript")
