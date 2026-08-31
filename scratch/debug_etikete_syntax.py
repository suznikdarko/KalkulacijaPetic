import os
import re

fpath = r"c:\DARKO\KalkulacijaPetric\etikete.html"
with open(fpath, 'r', encoding='utf-8') as f:
    content = f.read()

scripts = re.findall(r'<script[^>]*>(.*?)</script>', content, re.DOTALL)
s3 = scripts[2] # Main script block

lines = s3.splitlines()

# Track brace levels and template literal depth
template_depth = 0
in_single = False
in_double = False
stack = [] # stack of ('`', depth) or ('{', depth)

for line_idx, line in enumerate(lines):
    line_num = line_idx + 1
    # Ignore single-line comments
    code = line.split('//')[0]
    
    i = 0
    while i < len(code):
        c = code[i]
        if c == "'" and not in_double and template_depth == 0:
            in_single = not in_single
        elif c == '"' and not in_single and template_depth == 0:
            in_double = not in_double
        elif c == '`' and not in_single and not in_double:
            if stack and stack[-1] == '`':
                stack.pop()
                template_depth -= 1
            else:
                stack.append('`')
                template_depth += 1
        elif c == '$' and i + 1 < len(code) and code[i+1] == '{':
            if template_depth == 0:
                print(f"Line {line_num}: Unexpected '${{' outside template literal! Code: {code.strip()[:60]}")
            stack.append('${')
            i += 1
        elif c == '{' and not in_single and not in_double:
            stack.append('{')
        elif c == '}' and not in_single and not in_double:
            if stack and stack[-1] == '${':
                stack.pop()
            elif stack and stack[-1] == '{':
                stack.pop()
            else:
                print(f"Line {line_num}: Unmatched '}}' ! Code: {code.strip()[:60]}")
        i += 1

print(f"Final stack state (empty is good): {stack}")
