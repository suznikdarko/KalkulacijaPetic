import re

with open("brosura2.html", "r", encoding="utf-8", errors="ignore") as f:
    txt = f.read()

# search for functions related to quote or ponudba
funcs = re.findall(r'function\s+([a-zA-Z0-9_]*(?:quote|ponudba|at|offer)[a-zA-Z0-9_]*)\s*\(', txt, re.IGNORECASE)
print("Matching functions in brosura2.html:", set(funcs))

# also search for where "AT" or "ANG" or German quote is generated
for m in re.finditer(r'(openQuote[a-zA-Z0-9_]*|showQuote[a-zA-Z0-9_]*|printQuote[a-zA-Z0-9_]*|generate[a-zA-Z0-9_]*)', txt):
    print("Match:", m.group(1))
