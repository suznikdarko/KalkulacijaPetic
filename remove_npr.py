import os
import re
import glob

for filepath in glob.glob('*.html'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace placeholder="npr. something" with placeholder="something"
    new_content = re.sub(r'placeholder=["\'](?:npr\.?\s*|Npr\.?\s*)(.*?)["\']', r'placeholder="\1"', content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")
