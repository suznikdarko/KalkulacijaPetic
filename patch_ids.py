import re

with open(r'c:\DARKO\KalkulacijaPetric\kuverte1.html', 'r', encoding='utf-8') as f:
    html = f.read()

missing_ids = ['calc-cover-desc', 'calc-leaves-material', 'calc-cardboard-weight', 'calc-material-desc', 'calc-qty-ordered', 'calc-paper-type', 'calc-cover-material-code']

# Replace document.getElementById('ID').value with (document.getElementById('ID') ? document.getElementById('ID').value : '')
for m_id in missing_ids:
    # Match both .value and .checked if any
    html = re.sub(
        rf"document\.getElementById\('{m_id}'\)\.value",
        f"(document.getElementById('{m_id}') ? document.getElementById('{m_id}').value : '')",
        html
    )
    html = re.sub(
        rf'document\.getElementById\("{m_id}"\)\.value',
        f'(document.getElementById("{m_id}") ? document.getElementById("{m_id}").value : "")',
        html
    )
    
with open(r'c:\DARKO\KalkulacijaPetric\kuverte1.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Patched missing IDs in kuverte1.html")
