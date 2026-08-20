from bs4 import BeautifulSoup

file_path = r'c:\DARKO\KalkulacijaPetric\pola.html'
with open(file_path, 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

print("--- BUTTONS ---")
for btn in soup.find_all('button'):
    print(f"ID: {btn.get('id')}, Class: {btn.get('class')}, Text: {btn.text.strip()}, OnClick: {btn.get('onclick')}")

print("\n--- INPUTS ---")
for inp in soup.find_all('input'):
    if inp.get('type') in ['button', 'submit']:
        print(f"ID: {inp.get('id')}, Name: {inp.get('name')}, Value: {inp.get('value')}, OnClick: {inp.get('onclick')}")

print("\n--- LINKS ---")
for a in soup.find_all('a'):
    if a.get('href') and a.get('href').startswith('javascript:'):
        print(f"ID: {a.get('id')}, Text: {a.text.strip()}, Href: {a.get('href')}")
