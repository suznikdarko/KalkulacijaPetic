import re
import glob

def check_html_js_syntax(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find script tags, but make sure we don't break on escaped </script>
    # Simple HTML script tag parser
    script_blocks = []
    idx = 0
    while True:
        m_start = re.search(r'<script\b[^>]*>', content[idx:], re.IGNORECASE)
        if not m_start:
            break
        s_start = idx + m_start.end()
        # Find matching </script> that is NOT inside a JS string or escaped
        m_end = re.search(r'</script>', content[s_start:], re.IGNORECASE)
        if not m_end:
            break
        s_end = s_start + m_end.start()
        script_blocks.append((s_start, s_end, content[s_start:s_end]))
        idx = s_start + m_end.end()

    print(f"\n==========================================")
    print(f"File: {filename} ({len(script_blocks)} script tags)")
    print(f"==========================================")

    for b_idx, (s_start, s_end, js) in enumerate(script_blocks):
        start_line = content[:s_start].count('\n') + 1

        stack = [] # stack of ('(' | '{' | '[' | '`' | '${', line, col)
        
        i = 0
        n = len(js)
        state = 'NORMAL' # NORMAL, STRING_SINGLE, STRING_DOUBLE, COMMENT_LINE, COMMENT_BLOCK, REGEX

        line_num = start_line
        col_num = 1

        while i < n:
            ch = js[i]
            nxt = js[i+1] if i + 1 < n else ''

            if ch == '\n':
                line_num += 1
                col_num = 1
                if state == 'COMMENT_LINE':
                    state = 'NORMAL'
                i += 1
                continue

            if state == 'COMMENT_LINE':
                i += 1
                col_num += 1
                continue

            if state == 'COMMENT_BLOCK':
                if ch == '*' and nxt == '/':
                    state = 'NORMAL'
                    i += 2
                    col_num += 2
                else:
                    i += 1
                    col_num += 1
                continue

            if state in ('STRING_SINGLE', 'STRING_DOUBLE'):
                if ch == '\\':
                    i += 2
                    col_num += 2
                    continue
                elif (state == 'STRING_SINGLE' and ch == "'") or (state == 'STRING_DOUBLE' and ch == '"'):
                    state = 'NORMAL'
                i += 1
                col_num += 1
                continue

            if state == 'REGEX':
                if ch == '\\':
                    i += 2
                    col_num += 2
                    continue
                elif ch == '/':
                    state = 'NORMAL'
                i += 1
                col_num += 1
                continue

            # In NORMAL state
            top_symbol = stack[-1][0] if stack else None

            # Check if we are inside a template string
            if top_symbol == '`':
                if ch == '\\':
                    i += 2
                    col_num += 2
                    continue
                elif ch == '`':
                    stack.pop() # close template string
                    i += 1
                    col_num += 1
                    continue
                elif ch == '$' and nxt == '{':
                    stack.append(('${', line_num, col_num))
                    i += 2
                    col_num += 2
                    continue
                else:
                    i += 1
                    col_num += 1
                    continue

            # NORMAL JS parsing (or inside ${ ... })
            if ch == '/' and nxt == '/':
                state = 'COMMENT_LINE'
                i += 2
                col_num += 2
                continue

            if ch == '/' and nxt == '*':
                state = 'COMMENT_BLOCK'
                i += 2
                col_num += 2
                continue

            if ch in ("'", '"'):
                state = 'STRING_SINGLE' if ch == "'" else 'STRING_DOUBLE'
                i += 1
                col_num += 1
                continue

            if ch == '`':
                stack.append(('`', line_num, col_num))
                i += 1
                col_num += 1
                continue

            # Heuristic for REGEX vs division
            if ch == '/':
                p = i - 1
                while p >= 0 and js[p] in ' \t\r\n':
                    p -= 1
                prev_ch = js[p] if p >= 0 else ''
                if prev_ch in '=(:,;!&|?{[}:+-%^*~<>':
                    state = 'REGEX'
                    i += 1
                    col_num += 1
                    continue

            if ch in '({[':
                stack.append((ch, line_num, col_num))
            elif ch in ')}]' :
                if not stack:
                    print(f"  [ERROR] Line {line_num}:{col_num} Unmatched closing '{ch}'")
                else:
                    top, t_line, t_col = stack.pop()
                    if top == '${' and ch == '}':
                        pass # matched ${ ... }
                    else:
                        expected = {'(':')', '{':'}', '[':']'}[top] if top in '({[' else None
                        if expected is None or ch != expected:
                            print(f"  [ERROR] Line {line_num}:{col_num} Mismatched '{ch}', expected '{expected}' for '{top}' from line {t_line}:{t_col}")

            i += 1
            col_num += 1

        if stack:
            print(f"  [ERROR] Script #{b_idx+1} at line {start_line}: {len(stack)} unclosed items!")
            for top, t_line, t_col in stack:
                print(f"     Unclosed '{top}' from line {t_line}:{t_col}")

for fn in ['pola.html', 'brosura.html', 'blok.html', 'kuverte.html', 'etikete.html', 'TENOVIS.html']:
    check_html_js_syntax(fn)
