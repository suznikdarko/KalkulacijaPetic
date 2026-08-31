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
    'kuverte – kopija – kopija.html'
]

table_logo_html = (
    '<table cellpadding="0" cellspacing="0" style="border: none; margin: 0; padding: 0; font-family: Arial, sans-serif; border-collapse: collapse;">'
    '<tr><td style="color: #8c8f91; font-size: 20px; font-style: italic; font-weight: normal; margin: 0; padding: 0; line-height: 1.1; border: none;">tiskarna</td></tr>'
    '<tr><td style="color: #f99c26; font-size: 36px; font-style: italic; font-weight: bold; margin: 0; padding: 0; padding-left: 15px; line-height: 1.1; border: none;">petrič</td></tr>'
    '</table>'
)

for fname in files_to_fix:
    fpath = os.path.join(workspace, fname)
    if not os.path.exists(fpath):
        continue
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    orig = content
    # Find exportQuoteWord definition and inject fallback replacer
    pattern_eqw = re.compile(r'(function exportQuoteWord\s*\([^)]*\)\s*\{)')
    if 'function exportQuoteWord' in content:
        def replancer_func(m):
            return m.group(1) + f'\n            let _repl_logo = (s) => (s || "").replace(/<div[^>]*>\\s*tiskarna\\s*<\\/div>\\s*<div[^>]*>\\s*petrič\\s*<\\/div>/gi, `{table_logo_html}`);'

        if '_repl_logo' not in content:
            content = pattern_eqw.sub(replancer_func, content)
            # Also replace blob creation line if htmlContent or content is passed
            content = re.sub(
                r'new Blob\(\[\s*[\'"]\\ufeff[\'"]\s*,\s*(htmlContent|content)\s*\]',
                r'new Blob(["\\ufeff", _repl_logo(\1)]',
                content
            )

    if content != orig:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated exportQuoteWord in: {fname}")
    else:
        print(f"No change for exportQuoteWord in: {fname}")
