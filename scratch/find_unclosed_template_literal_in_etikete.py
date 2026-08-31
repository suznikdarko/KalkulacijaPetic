import os

fpath = r"c:\DARKO\KalkulacijaPetric\etikete.html"

with open(fpath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

stack = [] # (line_number, character_index, line_snippet)

for line_idx, line in enumerate(lines):
    line_num = line_idx + 1
    # Strip single line comments for checking
    comment_pos = line.find('//')
    code = line[:comment_pos] if comment_pos != -1 else line
    
    for i, char in enumerate(code):
        if char == '`':
            if stack:
                opened_line, _, snippet = stack.pop()
            else:
                stack.append((line_num, i, line.strip()[:60]))
                print(f"Opened template literal at line {line_num}: {line.strip()[:60]}")

print("\n--- UNCLOSED TEMPLATE LITERALS AT END ---")
for item in stack:
    print(f"Unclosed template literal from line {item[0]}: {item[2]}")
