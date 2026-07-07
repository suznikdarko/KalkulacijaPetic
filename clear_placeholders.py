import os
import re
import glob

# List of IDs to clear placeholders for
target_ids = [
    'calc-quote-number',
    'calc-customer-code',
    'calc-dn-number',
    'calc-dn-old',
    'calc-dn-deadline',
    'calc-dn-packaging',
    'calc-delivery-address',
    'calc-product-code',
    'calc-material-code',
    'calc-paper-type',
    'calc-tenovis-order',
    'ordered-quantity',
    'calc-project-version',
    'orderNumber',
    'quantity' # in odpis_materiala it had placeholder="npr. 500"
]

for filepath in glob.glob('*.html'):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for tid in target_ids:
        # Regex to match the input/textarea with this ID and replace its placeholder
        # We need to match the element that has id="tid" and placeholder="..."
        # Since HTML attributes can be in any order, we can use a function to replace placeholder inside the tag.
        
        def replacer(match):
            tag_content = match.group(0)
            # Replace placeholder="..." with placeholder="" inside this tag
            tag_content = re.sub(r'placeholder=["\'][^"\']*["\']', 'placeholder=""', tag_content)
            return tag_content
            
        # Match <input ... id="tid" ...> or <textarea ... id="tid" ...>
        # This regex looks for <input or <textarea, then anything until id="tid", then anything until >
        # A better way: just find id="tid" and then the placeholder in the same line or element.
        # Let's just find placeholder="..." on the same line as id="tid" or nearby?
        # Actually, since the files are formatted nicely, we can just replace placeholder="XYZ" if it's on the same line as the id, OR we can parse it carefully.
        
        # A simpler regex that matches the whole tag containing id="tid":
        # <(?:input|textarea)\b[^>]*id=["\']tid["\'][^>]*>
        pattern = r'<(?:input|textarea)\b[^>]*id=["\']' + re.escape(tid) + r'["\'][^>]*>'
        new_content = re.sub(pattern, replacer, new_content)
        
        # What if id is after placeholder? The above regex matches the whole tag regardless of order, as long as it doesn't contain > inside attributes.
        
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")
