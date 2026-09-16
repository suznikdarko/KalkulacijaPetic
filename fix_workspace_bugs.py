import re

def fix_all_issues():
    # 1. Fix invalid (if(document.getElementById...)) in blok.html, blok1.html, blok2.html, etikete.html, etikete2.html
    for fname in ['blok.html', 'blok1.html', 'blok2.html', 'etikete.html', 'etikete2.html']:
        with open(fname, 'r', encoding='utf-8') as f:
            content = f.read()

        # Replace (if(document.getElementById('calc-machine-prep-time-leaves')) document.getElementById('calc-machine-prep-time-leaves').value === "" ? 10 : parseFloat(document.getElementById('calc-machine-prep-time-leaves')?.value || 10))
        old_pattern_leaves = r"\(if\(document\.getElementById\('calc-machine-prep-time-leaves'\)\) document\.getElementById\('calc-machine-prep-time-leaves'\)\.value === \"\" \? 10 : parseFloat\(document\.getElementById\('calc-machine-prep-time-leaves'\)\?\:\.value \|\| 10\)\)"
        # Regex or simple string replacement:
        repl_leaves = "((document.getElementById('calc-machine-prep-time-leaves') && document.getElementById('calc-machine-prep-time-leaves').value !== '') ? parseFloat(document.getElementById('calc-machine-prep-time-leaves').value) : 10)"
        repl_cover = "((document.getElementById('calc-machine-prep-time-cover') && document.getElementById('calc-machine-prep-time-cover').value !== '') ? parseFloat(document.getElementById('calc-machine-prep-time-cover').value) : 10)"

        content = re.sub(r'\(if\(document\.getElementById\(\'calc-machine-prep-time-leaves\'\)\).*?\)\)', repl_leaves, content)
        content = re.sub(r'\(if\(document\.getElementById\(\'calc-machine-prep-time-cover\'\)\).*?\)\)', repl_cover, content)

        with open(fname, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Fixed invalid JS if expressions in {fname}')

    # 2. Fix kuverte files (kuverte.html, kuverte1.html, kuverte2.html)
    for fname in ['kuverte.html', 'kuverte1.html', 'kuverte2.html']:
        with open(fname, 'r', encoding='utf-8') as f:
            content = f.read()

        # Check formatQty
        if 'function formatQty' not in content:
            format_qty_code = """
        function formatQty(num) {
            if (num === null || num === undefined || isNaN(num)) return '0';
            return Number(num).toLocaleString('de-DE');
        }
"""
            # Insert after function formatPrice
            content = content.replace('function formatPrice(num) {', format_qty_code + '\n        function formatPrice(num) {')

        # Guard autoConnectFolder()
        content = content.replace('autoConnectFolder();', 'if (typeof autoConnectFolder === "function") autoConnectFolder();')

        with open(fname, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Added formatQty & guarded autoConnectFolder in {fname}')

fix_all_issues()
