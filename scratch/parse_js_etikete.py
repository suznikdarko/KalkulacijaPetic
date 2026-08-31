import os
import re

fpath = r"c:\DARKO\KalkulacijaPetric\etikete.html"
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract script tag #3
scripts = re.findall(r'<script[^>]*>(.*?)</script>', content, re.DOTALL)
s3 = scripts[2] # 3rd script tag

lines = s3.splitlines()
in_template = False
in_string_single = False
in_string_double = False

for idx, line in enumerate(lines):
    line_num = idx + 1
    # Check for backticks
    for char in line:
        if char == '`' and not in_string_single and not in_string_double:
            in_template = not in_template
        elif char == "'" and not in_template and not in_string_double:
            in_string_single = not in_string_single
        elif char == '"' and not in_template and not in_string_single:
            in_string_double = not in_string_double
            
    if in_string_single or in_string_double:
        print(f"Line {line_num} left string unclosed! Single: {in_string_single}, Double: {in_string_double} | {line[:60]}")
        in_string_single = False
        in_string_double = False
