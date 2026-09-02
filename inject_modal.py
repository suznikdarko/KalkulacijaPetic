import re

with open(r'c:\DARKO\KalkulacijaPetric\pola.html', 'r', encoding='utf-8') as f:
    pola_text = f.read()

# Extract the modal
# It starts with <div id="modal-stock-search"
# Let's find its start and end by matching the outer div tag manually
start_idx = pola_text.find('<div id="modal-stock-search"')

# The modal ends right before the closing </body> tag
# Wait, let's just find the exact block.
# We can find the end of the modal by looking for the next major block or just using a robust regex.
match = re.search(r'<div id="modal-stock-search".*?<!-- KONEC MODAL ZALOGA -->', pola_text, re.DOTALL)
if match:
    modal_html = match.group(0)
else:
    # If there is no comment, let's extract it carefully
    # Find the next sibling or something. Let's just find the start and then count divs
    div_count = 0
    in_div = False
    for i in range(start_idx, len(pola_text)):
        if pola_text[i:i+4] == '<div':
            div_count += 1
        elif pola_text[i:i+5] == '</div':
            div_count -= 1
            if div_count == 0:
                end_idx = i + 6
                modal_html = pola_text[start_idx:end_idx]
                break

with open(r'c:\DARKO\KalkulacijaPetric\kuverte1.html', 'r', encoding='utf-8') as f:
    kuverte_text = f.read()

# Inject it right before the first <script> tag if possible, or right before </body>.
# But kuverte1.html has <script> in the middle, and then the main JS script block.
# The safest place is right before the main <script> tag that we added, or just at the end of the HTML body.
# In kuverte1.html, there is </div>... <script> (at line 919).
# Let's inject it right before the <script> at line 919.
script_idx = kuverte_text.find('<script>')
if script_idx != -1:
    kuverte_text = kuverte_text[:script_idx] + modal_html + "\n\n    " + kuverte_text[script_idx:]
    with open(r'c:\DARKO\KalkulacijaPetric\kuverte1.html', 'w', encoding='utf-8') as f:
        f.write(kuverte_text)
    print("Modal injected successfully!")
else:
    print("Could not find <script> in kuverte1.html")

