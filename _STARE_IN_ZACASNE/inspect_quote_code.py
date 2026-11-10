with open("brosura2.html", "r", encoding="utf-8", errors="ignore") as f:
    txt = f.read()

import re
# find getQuoteHTML definition
idx = txt.find("function getQuoteHTML")
if idx != -1:
    print("=== getQuoteHTML ===")
    print(txt[idx:idx+2500])

idx_at = txt.find("function printQuoteAT")
if idx_at != -1:
    print("=== printQuoteAT ===")
    print(txt[idx_at:idx_at+2500])
