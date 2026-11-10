import html.parser
import sys

def fix_file(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    modified = False
    for i in range(len(lines)):
        if '<script>' in lines[i] and 'editable-area' in lines[i-3] if i>=3 else False:
            lines[i] = lines[i].replace('<script>', '<' + "' + 'script'>")
            modified = True
        elif '                    <script>' in lines[i]:
            lines[i] = lines[i].replace('<script>', '<' + "' + 'script'>")
            modified = True

    # Remove trailing double </script> if any
    for i in range(len(lines)-1, max(0, len(lines)-10), -1):
        if lines[i].strip() == '</script>' and lines[i-1].strip() == '</script>':
            print(f'Removing duplicate </script> at line {i+1} in {filename}')
            lines.pop(i)
            modified = True
            break
            
    if modified:
        with open(filename, 'w', encoding='utf-8') as f:
            f.writelines(lines)

    # Verify HTML parser
    class TestParser(html.parser.HTMLParser):
        def __init__(self):
            super().__init__()
            self.script_count = 0
            self.open_scripts = 0
        def handle_starttag(self, tag, attrs):
            if tag == 'script':
                self.open_scripts += 1
                self.script_count += 1
        def handle_endtag(self, tag):
            if tag == 'script':
                self.open_scripts -= 1

    p = TestParser()
    with open(filename, 'r', encoding='utf-8') as f:
        p.feed(f.read())
    print(f'{filename}: total script tags={p.script_count}, unclosed/extra={p.open_scripts}')

for fname in ['kuverte.html', 'kuverte1.html', 'kuverte2.html']:
    fix_file(fname)
