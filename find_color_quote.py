with open("brosura2.html", "r", encoding="utf-8", errors="ignore") as f:
    txt = f.read()

import re
idx = txt.find("function getQuoteHTML")
end_idx = txt.find("function printQuote", idx)
quote_body = txt[idx:end_idx]

# find all places with color or barv or isAT
for m in re.finditer(r'([^\n]*?(?:barv|color|tisk|farb|isAT)[^\n]*)', quote_body, re.IGNORECASE):
    print("MATCH:", m.group(1).strip()[:150])
