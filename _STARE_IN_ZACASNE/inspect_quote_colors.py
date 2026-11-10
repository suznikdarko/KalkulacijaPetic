import glob, re

for fn in sorted(glob.glob("*2.html")):
    with open(fn, "r", encoding="utf-8", errors="ignore") as f:
        txt = f.read()
    
    print("=" * 60)
    print("FILE:", fn)
    
    # search for Tisk: or Druck: or getTisk or getFormattedColorsString
    matches = re.findall(r'function\s+([a-zA-Z0-9_]*(?:Tisk|Color)[a-zA-Z0-9_]*)\s*\(', txt)
    print("  Functions:", matches)
    
    # Search for lines containing Druck: or Tisk: in getQuoteHTML
    idx = txt.find("function getQuoteHTML")
    if idx != -1:
        end_idx = txt.find("function printQuote", idx)
        if end_idx == -1: end_idx = idx + 10000
        q_code = txt[idx:end_idx]
        for line in q_code.splitlines():
            if ("Druck" in line or "Tisk" in line or "Barve" in line) and ("td" in line or "tr" in line or "let " in line or "const " in line):
                print("   ", line.strip()[:140])
