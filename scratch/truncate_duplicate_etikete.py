import os

fpath = r"c:\DARKO\KalkulacijaPetric\etikete.html"

with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# Find first occurrence of </html>
end_idx = content.find('</html>')
if end_idx != -1:
    clean_content = content[:end_idx + 7] + "\n"
    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(clean_content)
    print(f"Truncated duplicate content in etikete.html! New length: {len(clean_content.splitlines())} lines.")
else:
    print("</html> not found in etikete.html!")
