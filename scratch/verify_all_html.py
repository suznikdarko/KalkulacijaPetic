import os

workspace = r"c:\DARKO\KalkulacijaPetric"
files_to_check = [
    'pola.html',
    'TENOVIS.html',
    'brosura.html',
    'blok.html',
    'kuverte.html',
    'etikete.html'
]

for fname in files_to_check:
    fpath = os.path.join(workspace, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    has_table_logo = '<table cellpadding="0" cellspacing="0" style="border: none; margin: 0; padding: 0; font-family: Arial, sans-serif;' in content
    has_download_word_fix = 'if (typeof htmlContent === "string"' in content or 'if (typeof content === "string"' in content
    has_div_logo = '<div style="color: #8c8f91; font-size: 22px' in content or '<div style="font-size: 24px; color: #475569' in content
    
    print(f"=== {fname} ===")
    print(f"  has_table_logo: {has_table_logo}")
    print(f"  has_download_word_fix: {has_download_word_fix}")
    print(f"  has_old_div_logo: {has_div_logo}")
