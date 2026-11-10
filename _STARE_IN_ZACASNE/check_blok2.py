import html.parser

def check_file(filepath):
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
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()
        p.feed(text)
    print(f'{filepath}: total script tags={p.script_count}, unclosed/extra={p.open_scripts}')

    # Find script contents and test basic syntax
    import re
    scripts = re.findall(r'<script[^>]*>(.*?)</script>', text, re.DOTALL)
    print(f'{filepath}: found {len(scripts)} script blocks')

for fname in ['blok.html', 'blok1.html', 'blok2.html']:
    check_file(fname)
