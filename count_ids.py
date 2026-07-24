with open('blok.html', 'r', encoding='utf-8') as f:
    text = f.read()

count1 = text.count('id="res-price-total"')
count2 = text.count('id="res-price-per-item"')
print('res-price-total count:', count1)
print('res-price-per-item count:', count2)
