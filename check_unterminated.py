with open('pola.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re
scripts = re.findall(r'<script>(.*?)</script>', text, re.DOTALL)

for i, script in enumerate(scripts):
    print(f'Script {i} length:', len(script))
    in_string = False
    string_char = ''
    line = 1
    for idx, c in enumerate(script):
        if c == '\n':
            if in_string and string_char in ["'", '"']:
                print(f'Unterminated string {string_char} at line {line}:', repr(script[idx-50:idx+10]))
                in_string = False
            line += 1
        elif c in ["'", '"', '`'] and not in_string:
            in_string = True
            string_char = c
        elif c == string_char and in_string:
            escape_count = 0
            j = idx - 1
            while j >= 0 and script[j] == '\\':
                escape_count += 1
                j -= 1
            if escape_count % 2 == 0:
                in_string = False
