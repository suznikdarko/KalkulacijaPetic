import os

file_path = "c:/DARKO/KalkulacijaPetric/TISKOVNA POLA/tiskovna-pola-kalkulator.html"

with open(file_path, "rb") as f:
    data = f.read()

# Let's decode intelligently: 
# If a byte sequence is valid UTF-8, decode it.
# Otherwise, decode it as CP1250.
# We can do this by finding all \xef\xbf\xbd that the user entered... wait!
# No, \xef\xbf\xbd is literal U+FFFD if the user saved it as UTF-8.
# But wait, python said: UnicodeDecodeError: 'utf-8' codec can't decode byte 0xe8
# That means there is NO literal \xef\xbf\xbd where 0xe8 is. 
# There is LITERALLY the byte 0xe8.
# So the file contains actual CP1250 bytes!
# Let's just decode it as CP1250 and write it back as UTF-8!
try:
    text = data.decode("cp1250")
    print("Successfully decoded as cp1250")
    # Write back as UTF-8
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(text)
    print("Saved as UTF-8")
except Exception as e:
    print(e)
