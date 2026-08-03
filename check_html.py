import glob

files = glob.glob('d:\\Git\\KalkulacijaPetric\\*.html')
for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    start_tag = '<table style="width: 100%; margin-bottom: 15px; border-bottom: 2px solid #f99c26; padding-bottom: 5px;"'
    if start_tag in content:
        if 'Kalkulacijo pripravil:' in content:
            print(f'{file_path}: Both parts found')
        else:
            print(f'{file_path}: Missing end part')
    else:
        print(f'{file_path}: Missing start part')
