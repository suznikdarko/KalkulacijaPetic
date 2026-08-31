import os
import re

fpath = r"c:\DARKO\KalkulacijaPetric\etikete.html"

with open(fpath, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace backtick breakdown strings in JS functions
text = text.replace(
    "breakdown: `Priprava: ${ formatPrice(cPrep) } | Delo: ${ hourText } (${ formatPrice(cWork) })`",
    "breakdown: 'Priprava: ' + formatPrice(cPrep) + ' | Delo: ' + hourText + ' (' + formatPrice(cWork) + ')'"
)
text = text.replace(
    "breakdown: `Priprava: ${ formatPrice(zPrep) } | Delo: ${ workHours.toFixed(2) } h(${ formatPrice(zWork) })`",
    "breakdown: 'Priprava: ' + formatPrice(zPrep) + ' | Delo: ' + workHours.toFixed(2) + ' h(' + formatPrice(zWork) + ')'"
)
text = text.replace(
    "breakdown: `Priprava: ${ formatPrice(lPrep) } | Delo: ${ qty } kos(${ formatPrice(lWork) })`",
    "breakdown: 'Priprava: ' + formatPrice(lPrep) + ' | Delo: ' + qty + ' kos(' + formatPrice(lWork) + ')'"
)
text = text.replace(
    "breakdown: `Priprava: ${formatPrice(uPrep)} | Delo: ${totalSheetsNeeded} pol (${formatPrice(uWork)})`",
    "breakdown: 'Priprava: ' + formatPrice(uPrep) + ' | Delo: ' + totalSheetsNeeded + ' pol (' + formatPrice(uWork) + ')'"
)

with open(fpath, 'w', encoding='utf-8') as f:
    f.write(text)

print("Replaced backtick breakdown strings in etikete.html!")
