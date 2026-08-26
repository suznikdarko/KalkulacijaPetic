import re
import glob

def check_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    script_matches = list(re.finditer(r'<script\b[^>]*>(.*?)</script>', content, re.DOTALL | re.IGNORECASE))
    print(f"\n=== {filename}: {len(script_matches)} script tags found ===")

    for idx, match in enumerate(script_matches):
        js = match.group(1)
        start_line = content[:match.start()].count('\n') + 1
        
        stack = []
        in_str = None
        in_multiline_comment = False

        lines = js.split('\n')
        for l_idx, line in enumerate(lines):
            line_num = start_line + l_idx
            i = 0
            while i < len(line):
                ch = line[i]
                nxt = line[i+1] if i + 1 < len(line) else ''

                if in_multiline_comment:
                    if ch == '*' and nxt == '/':
                        in_multiline_comment = False
                        i += 1
                elif in_str:
                    if ch == '\\':
                        i += 1
                    elif ch == in_str:
                        in_str = None
                else:
                    if ch == '/' and nxt == '/':
                        break
                    elif ch == '/' and nxt == '*':
                        in_multiline_comment = True
                        i += 1
                    elif ch in ['"', "'", '`']:
                        in_str = ch
                    elif ch in '({[':
                        stack.append((ch, line_num, i+1))
                    elif ch in ')}]' :
                        if not stack:
                            print(f'Line {line_num}:{i+1} Unmatched closing {ch}')
                        else:
                            top, t_line, t_col = stack.pop()
                            expected = {'(':')', '{':'}', '[':']'}[top]
                            if ch != expected:
                                print(f'Line {line_num}:{i+1} Mismatched {ch}, expected {expected} for {top} from line {t_line}:{t_col}')
                i += 1

        if stack:
            top, t_line, t_col = stack[-1]
            print(f'Script #{idx+1} at line {start_line}: Unclosed {top} from line {t_line}:{t_col} (total unclosed: {len(stack)})')
            for s_item in stack[-5:]:
                print(f'   stack item: {s_item[0]} at line {s_item[1]}:{s_item[2]}')

for fn in glob.glob("*.html"):
    check_file(fn)
