def check_balance(s):
    stack = []
    pairs = {'}': '{', ')': '(', ']': '['}
    for i, c in enumerate(s):
        if c in '{[(': 
            stack.append((c, i))
        elif c in '}])':
            if not stack:
                return f'Unmatched {c} at {i}'
            top, _ = stack.pop()
            if top != pairs[c]:
                return f'Mismatched {top} and {c} at {i}'
    if stack:
        return f'Unclosed {stack}'
    return 'Balanced'

with open('k_script_0.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
text = re.sub(r'//.*', '', text)
text = re.sub(r'/\*.*?\*/', '', text, flags=re.DOTALL)
text = re.sub(r'\"(?:\\\\.|[^\"])*\"', '\"\"', text)
text = re.sub(r"\'(?:\\\\.|[^\'])*\'", "''", text)
text = re.sub(r'\`(?:\\\\.|[^\`])*\`', '\`\`', text)
print("JS Balance:", check_balance(text))
