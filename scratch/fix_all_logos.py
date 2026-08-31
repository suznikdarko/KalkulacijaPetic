import os
import re

workspace = r"c:\DARKO\KalkulacijaPetric"
files_to_fix = [
    'pola.html',
    'TENOVIS.html',
    'brosura.html',
    'blok.html',
    'kuverte.html',
    'etikete.html',
    'kuverte – kopija.html',
    'kuverte – kopija – kopija.html',
    'p_script_1.js',
    'temp_script_1.js',
    'k_script_0.js'
]

table_logo_html = (
    '<table cellpadding="0" cellspacing="0" style="border: none; margin: 0; padding: 0; font-family: Arial, sans-serif; border-collapse: collapse;">'
    '<tr><td style="color: #8c8f91; font-size: 20px; font-style: italic; font-weight: normal; margin: 0; padding: 0; line-height: 1.1; border: none;">tiskarna</td></tr>'
    '<tr><td style="color: #f99c26; font-size: 36px; font-style: italic; font-weight: bold; margin: 0; padding: 0; padding-left: 15px; line-height: 1.1; border: none;">petrič</td></tr>'
    '</table>'
)

# Pattern for div-based logo in defaultContent templates
div_logo_pattern = re.compile(
    r'<div[^>]*style="[^"]*">\s*tiskarna\s*<\/div>\s*<div[^>]*style="[^"]*">\s*petrič\s*<\/div>',
    re.IGNORECASE
)

for fname in files_to_fix:
    fpath = os.path.join(workspace, fname)
    if not os.path.exists(fpath):
        print(f"Skipping non-existent file: {fname}")
        continue
        
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    orig_content = content

    # 1. Replace div logo in template HTML with table logo
    content = div_logo_pattern.sub(table_logo_html, content)

    # 2. Update downloadWordDoc function to ensure broad replacement before saving
    if 'function downloadWordDoc' in content:
        pattern_dwd = re.compile(r'(function downloadWordDoc\s*\([^)]*\)\s*\{)')
        repl_code = r'\1\n            if (typeof htmlContent === "string" && htmlContent) { htmlContent = htmlContent.replace(/<div[^>]*>\\s*tiskarna\\s*<\\/div>\\s*<div[^>]*>\\s*petrič\\s*<\\/div>/gi, `' + table_logo_html + '`); }'
        if 'htmlContent.replace(/<div' not in content:
            content = pattern_dwd.sub(lambda m: m.group(1) + f'\n            if (typeof htmlContent === "string" && htmlContent) {{ htmlContent = htmlContent.replace(/<div[^>]*>\\s*tiskarna\\s*<\\/div>\\s*<div[^>]*>\\s*petrič\\s*<\\/div>/gi, `{table_logo_html}`); }}', content)

    if 'function saveQuoteToDisk' in content:
        pattern_sqd = re.compile(r'(function saveQuoteToDisk\s*\([^)]*\)\s*\{)')
        if 'content.replace(/<div' not in content:
            content = pattern_sqd.sub(lambda m: m.group(1) + f'\n            if (typeof content === "string" && content) {{ content = content.replace(/<div[^>]*>\\s*tiskarna\\s*<\\/div>\\s*<div[^>]*>\\s*petrič\\s*<\\/div>/gi, `{table_logo_html}`); }}', content)

    if content != orig_content:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated: {fname}")
    else:
        print(f"No changes needed: {fname}")
