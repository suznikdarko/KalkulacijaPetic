import re

with open('blok.html', 'r', encoding='utf-8') as f:
    html = f.read()

scripts = re.findall(r'<script>(.*?)</script>', html, re.DOTALL)
print(f"Found {len(scripts)} script blocks.")

for idx, script in enumerate(scripts):
    print(f"Script block {idx+1}: {len(script)} characters.")
    
    stack = []
    lines = script.split('\n')
    for line_num, line in enumerate(lines, 1):
        for char_num, char in enumerate(line, 1):
            if char in '([{':
                stack.append((char, line_num, char_num))
            elif char in ')]}':
                if not stack:
                    print(f"Error: Mismatched closing char '{char}' at line {line_num}, column {char_num}")
                else:
                    top_char, top_line, top_col = stack.pop()
                    if (char == ')' and top_char != '(') or \
                       (char == ']' and top_char != '[') or \
                       (char == '}' and top_char != '{'):
                        print(f"Error: Mismatched closing char '{char}' at line {line_num}, col {char_num} matching '{top_char}' from line {top_line}, col {top_col}")
                        
    if stack:
        print(f"Error: Unclosed brackets remaining at end of script:")
        for char, line_num, char_num in stack[:10]:
            print(f"  '{char}' at line {line_num}, col {char_num}")
            
print("Syntax check completed.")
