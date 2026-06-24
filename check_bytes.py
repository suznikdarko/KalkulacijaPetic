import os

file_path = "c:/DARKO/KalkulacijaPetric/TISKOVNA POLA/tiskovna-pola-kalkulator.html"

with open(file_path, "rb") as f:
    data = f.read()

# Let's see bytes near 2752
start = max(0, 2752 - 20)
end = min(len(data), 2752 + 20)
print(data[start:end])
