import glob
import re

files = glob.glob('d:\\Git\\KalkulacijaPetric\\*.html')
for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    
    # We want to change the font size in the DN style block
    # Look for: body { font-family: Arial, sans-serif; font-size: 13px;
    content = content.replace('body { font-family: Arial, sans-serif; font-size: 13px;', 'body { font-family: Arial, sans-serif; font-size: 11pt;')
    
    # Also in DN, there might be other inline styles with 14px or 13px that need changing
    # Let's replace button fonts if any
    content = content.replace('font-size: 13px;">NATISNI DN</button>', 'font-size: 11pt;">NATISNI DN</button>')
    content = content.replace('font-size: 13px;">ZAPRI</button>', 'font-size: 11pt;">ZAPRI</button>')
    content = content.replace('font-size: 13px;">PONASTAVI</button>', 'font-size: 11pt;">PONASTAVI</button>')
    content = content.replace('font-size: 13px;" title="Premakni', 'font-size: 11pt;" title="Premakni')
    content = content.replace('font-size: 13px;" title="Shrani ta delovni nalog', 'font-size: 11pt;" title="Shrani ta delovni nalog')
    
    # Replace some other 14px occurrences in the DN block that might be hardcoded
    # Specifically, <div class="bold" style="font-size: 14px;
    # Let's do it with regex if we can be specific, but it's easier to just find the DN block 
    # and replace specific strings.
    
    # Actually let's just do targeted replaces for known strings that contain 13px or 14px in the DN.
    # From the user's snippet, we see things like 'font-size: 14px;' in 'Količina ovitkov:' and '📄 LISTI (NOTRANJOST)'
    # Those were in getQuoteHTML, but maybe similar ones exist in getWorkOrderHTML
    
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {file_path}')
