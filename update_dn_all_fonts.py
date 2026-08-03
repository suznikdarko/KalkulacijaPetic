import glob
import re

files = glob.glob('d:\\Git\\KalkulacijaPetric\\*.html')
for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content
    
    # We want to find the <title>Delovni Nalog... block and update its <style> block
    # It might have font-size: 13px; font-size: 14px; or font-size: 15px;
    # So we can just use regex for `body { ... }` inside the style after Delovni Nalog
    
    def repl_body_font(m):
        # m.group(1) is the <style> part or before, m.group(2) is the font-size value
        return m.group(0).replace(m.group(2), '11pt')
    
    # Replace body { ... font-size: XXpx; ... }
    content = re.sub(r'(body\s*{[^}]*?font-size:\s*)(\d+px|\d+pt)(;)', repl_body_font, content)
    
    # Replace table { ... font-size: XXpx; ... } in the same way, but wait, some tables shouldn't be touched globally.
    # We can just change all 'font-size: 13px', 'font-size: 14px', 'font-size: 15px' inside the getWorkOrderHTML function string.
    # But that might break other things. Let's just do it for 'getWorkOrderHTML' or 'Delovni Nalog' style block.
    
    idx_wo = content.find('function getWorkOrderHTML')
    if idx_wo != -1:
        # replace 13px, 14px, 15px with 11pt in the getWorkOrderHTML section
        wo_content = content[idx_wo:]
        wo_content = wo_content.replace('font-size: 13px;', 'font-size: 11pt;')
        wo_content = wo_content.replace('font-size: 14px;', 'font-size: 11pt;')
        wo_content = wo_content.replace('font-size: 15px;', 'font-size: 11pt;')
        
        # also the user mentioned buttons:
        wo_content = wo_content.replace('font-size: 13px;"', 'font-size: 11pt;"')
        wo_content = wo_content.replace('font-size: 14px;"', 'font-size: 11pt;"')
        wo_content = wo_content.replace('font-size: 15px;"', 'font-size: 11pt;"')
        
        content = content[:idx_wo] + wo_content

    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {file_path}')
