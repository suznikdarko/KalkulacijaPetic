import os

file_path = "c:/DARKO/KalkulacijaPetric/TISKOVNA POLA/tiskovna-pola-kalkulator.html"

# Try reading as latin1 / cp1252 so we don't get decode errors
with open(file_path, "r", encoding="cp1252", errors="replace") as f:
    text = f.read()

# When PowerShell read UTF-8 as ANSI and wrote it as ANSI, bytes were preserved except when
# user saved it again. Let's see if replacing the specific ANSI sequences works.
# Wait, let's just do a blanket replace of the garbled patterns that we found in regex.
# Since we read it as cp1252, \ufffd might show up as literal `` (U+FFFD) if it was saved as UTF-8 by the user's editor, 
# or if it was ANSI, U+FFFD is not in ANSI so it might be `?`.
# Let's print out what's in the text around 'Darko'.
idx = text.find("Darko")
if idx != -1:
    print(repr(text[idx:idx+50]))

