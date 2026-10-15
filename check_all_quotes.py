import glob, re

for fn in sorted(glob.glob("*2.html")):
    with open(fn, "r", encoding="utf-8", errors="ignore") as f:
        txt = f.read()
    
    matches = []
    if "printQuoteAT" in txt: matches.append("printQuoteAT")
    if "getQuoteHTML" in txt: matches.append("getQuoteHTML")
    if "getQuoteATHTML" in txt or "getQuoteHTMLAT" in txt: matches.append("getQuoteATHTML")
    print(f"{fn}: {matches}")
