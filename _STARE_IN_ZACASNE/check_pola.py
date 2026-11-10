with open(r'c:\DARKO\KalkulacijaPetric\pola.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('SAVE/LOAD PROJECT FUNCTIONS')
if idx != -1:
    print(f"Found at position {idx}")
    # Print the line
    start = text.rfind('\n', 0, idx)
    end = text.find('\n', idx)
    print(text[start:end])
else:
    print("NOT FOUND")
