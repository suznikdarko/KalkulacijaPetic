import os

workspace = r"c:\DARKO\KalkulacijaPetric"
files_to_test = ['pola.html', 'TENOVIS.html', 'brosura.html', 'blok.html', 'kuverte.html', 'etikete.html']

for fname in files_to_test:
    fpath = os.path.join(workspace, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if table logo is present in defaultContent
    table_logo_count = content.count('color: #8c8f91; font-size: 20px; font-style: italic')
    print(f"File: {fname}")
    print(f"  Table logo occurrences: {table_logo_count}")
    assert table_logo_count > 0, f"Table logo missing in {fname}!"

print("\nAll files verified successfully!")
