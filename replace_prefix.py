import os

file_path = "c:/DARKO/KalkulacijaPetric/TISKOVNA POLA/tiskovna-pola-kalkulator.html"

with open(file_path, "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace("'po._'", "'pon._'")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(text)

print("Replaced 'po._' with 'pon._'")
