import html.parser

def clean_kuverte_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Remove rogue </body></html> in the middle around line 3566
    # Find pattern </script>\s*</body>\s*</html
    import re
    
    # Replace mid-file </body></html>
    pattern = re.compile(r'</script>\s*</body>\s*</html\s*', re.IGNORECASE)
    content = pattern.sub('\n', content)

    # 2. Make sure template literals don't use raw <script> or </script>
    # In template literal around editable-area:
    content = content.replace('<script>\n                        // Sync changes', '<' + "' + 'script'>\n                        // Sync changes")
    content = content.replace('<script>\r\n                        // Sync changes', '<' + "' + 'script'>\r\n                        // Sync changes")

    # 3. Clean trailing script/html tags at the very end of file
    # We want exactly one closing </script>, </body>, </html> at end.
    # Split content at </html> or clean up end
    idx = content.rfind('</body>')
    if idx != -1:
        # Keep content up to end of script, then add clean </body></html>
        pass

    # Let's write back and test parser
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    # Clean up double </script> at end
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    cleaned_lines = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if line.strip() in ['</body>', '</html', '</html>'] and i < len(lines) - 50:
            # Drop mid-file body/html close tags
            i += 1
            continue
        cleaned_lines.append(line)
        i += 1

    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(cleaned_lines)

    # Verify script tags matching
    class TestParser(html.parser.HTMLParser):
        def __init__(self):
            super().__init__()
            self.script_count = 0
            self.open_scripts = 0
            self.errors = []
        def handle_starttag(self, tag, attrs):
            if tag == 'script':
                self.open_scripts += 1
                self.script_count += 1
        def handle_endtag(self, tag):
            if tag == 'script':
                self.open_scripts -= 1

    p = TestParser()
    with open(filepath, 'r', encoding='utf-8') as f:
        p.feed(f.read())
    print(f'{filepath}: total script tags={p.script_count}, unclosed/extra={p.open_scripts}')

for fname in ['kuverte.html', 'kuverte1.html', 'kuverte2.html']:
    clean_kuverte_file(fname)
