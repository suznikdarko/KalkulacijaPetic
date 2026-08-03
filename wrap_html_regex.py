import glob
import re

files = glob.glob('d:\\Git\\KalkulacijaPetric\\*.html')
for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    
    # We want to replace 'const defaultContent = `' followed by optional whitespace and '<table' or '<div'
    # Wait, brosura.html already has the div, so we skip it if it already has <div style="font-family: Arial
    
    if '<div style="font-family: Arial, sans-serif; font-size: 11pt;"' in content or '<div style="font-family: Arial, sans-serif; font-size: 11pt; color: #000;">' in content:
        # Check if the wrapper is already there after defaultContent
        idx = content.find('const defaultContent = `')
        if idx != -1:
            snippet = content[idx:idx+150]
            if 'font-family: Arial' in snippet:
                print(f'{file_path} already wrapped.')
                continue

    # Regex to add wrapper to defaultContent
    # Find `const defaultContent = `\n(any whitespace)` and insert the div
    def repl_start(match):
        return f'{match.group(1)}<div style="font-family: Arial, sans-serif; font-size: 11pt; color: #000;">\n{match.group(2)}'

    content = re.sub(r'(const defaultContent = `\s*)(<table|<div class="header-line")', repl_start, content)
    
    # Regex to close the wrapper before `;
    def repl_end(match):
        return f'{match.group(1)}</div>\n{match.group(2)}'
    
    content = re.sub(r'(Kalkulacijo pripravil:\'} \${preparedBy}</div>\s*)(`;)', repl_end, content)
    
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {file_path}')
