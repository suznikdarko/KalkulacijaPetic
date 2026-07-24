with open('pola.html', 'r', encoding='utf-8') as f:
    text = f.read()

for i, line in enumerate(text.split('\n')):
    if '"' in line and '</style>' in line and 'th {' in line:
        print(f"Line {i+1}: {line.strip()[:100]}")
