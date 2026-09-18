import re

with open(r'c:\DARKO\KalkulacijaPetric\kuverte2.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find all element IDs in HTML
ids_in_html = set(re.findall(r'id=["\']([a-zA-Z0-9_-]+)["\']', html))

scripts = re.findall(r'<script.*?>(.*?)</script>', html, re.DOTALL)
all_js = "\n".join(scripts)

# Find all document.getElementById('...') occurrences
all_get_ids = re.findall(r'document\.getElementById\(["\']([a-zA-Z0-9_-]+)["\']\)', all_js)

print("Checking all document.getElementById calls in JS:")
missing = set()
for gid in all_get_ids:
    if gid not in ids_in_html:
        missing.add(gid)

print(f"Total unique IDs referenced in getElementById: {len(set(all_get_ids))}")
print(f"Total missing IDs (not in HTML): {len(missing)}")
for m in sorted(missing):
    # check how many times it's called
    count = all_js.count(f"getElementById('{m}')") + all_js.count(f'getElementById("{m}")')
    print(f"  Missing ID: '{m}' (referenced {count} times)")
