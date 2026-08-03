import glob

files = glob.glob('d:\\Git\\KalkulacijaPetric\\*.html')
for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    
    # Target files starting with the specific table
    start_tag = 'const defaultContent = `\n                        <table style="width: 100%; margin-bottom: 15px; border-bottom: 2px solid #f99c26; padding-bottom: 5px;"'
    end_tag = 'Kalkulacijo pripravil:\'} ${preparedBy}</div>\n                `;'
    
    if start_tag in content and end_tag in content:
        new_start = 'const defaultContent = `\n                        <div style="font-family: Arial, sans-serif; font-size: 11pt; color: #000;">\n                        <table style="width: 100%; margin-bottom: 15px; border-bottom: 2px solid #f99c26; padding-bottom: 5px;"'
        new_end = 'Kalkulacijo pripravil:\'} ${preparedBy}</div>\n                        </div>\n                `;'
        
        content = content.replace(start_tag, new_start)
        content = content.replace(end_tag, new_end)
        
    # Also handle kuverte.html which starts with <div class="header-line">
    start_kuverte = 'const defaultContent = `\n                    <div class="header-line">'
    end_kuverte = 'Kalkulacijo pripravil:\'} ${preparedBy}</div>\n                `;'
    if start_kuverte in content and end_kuverte in content:
        new_start_k = 'const defaultContent = `\n                    <div style="font-family: Arial, sans-serif; font-size: 11pt; color: #000;">\n                    <div class="header-line">'
        new_end_k = 'Kalkulacijo pripravil:\'} ${preparedBy}</div>\n                    </div>\n                `;'
        content = content.replace(start_kuverte, new_start_k)
        content = content.replace(end_kuverte, new_end_k)

    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {file_path}')
