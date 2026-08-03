import glob
import os

files = glob.glob('d:\\Git\\KalkulacijaPetric\\*.html')
for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    
    # In itemsHtml and defaultContent, replace specific font sizes
    # Replace 'font-size: 11px;' with 'font-size: 11pt;' in tables and cells
    content = content.replace('font-size: 11px;', 'font-size: 11pt; font-family: Arial, sans-serif;')
    
    # Replace the 14px font size for product code (matCode)
    content = content.replace('font-size: 14px;', 'font-size: 11pt;')
    
    # Replace 13px (customer name) with 11pt just in case
    content = content.replace('font-size: 13px;', 'font-size: 11pt;')
    
    # Change 'font-size: 8px;' to 'font-size: 8pt;' for labels like 'Šifra izdelka:'
    content = content.replace('font-size: 8px;', 'font-size: 8pt;')
    
    # Make sure itemsHtml div has Arial 11pt
    content = content.replace('<div style="margin-bottom: 25px; border-bottom: 1px solid #eee; padding-bottom: 15px;">', '<div style="font-family: Arial, sans-serif; font-size: 11pt; margin-bottom: 25px; border-bottom: 1px solid #eee; padding-bottom: 15px;">')
    
    # Add an Arial 11pt wrapper inside defaultContent just after the first <table
    # Actually it's easier to just ensure global font-family is Arial and size is 11pt in the main styles of the quote.
    # The defaultContent usually starts with <table style="width: 100%; margin-bottom: 15px; border-bottom: 2px solid #f99c26; padding-bottom: 5px;"
    # Let's replace 'const defaultContent = `' with 'const defaultContent = `\n<div style="font-family: Arial, sans-serif; font-size: 11pt; color: #000;">'
    # And then we need to close the div... but the simplest is just injecting it at the start. Since it's HTML, an unclosed <div> might be forgiving, or we can just append </div> to the end of defaultContent.
    
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {file_path}')
