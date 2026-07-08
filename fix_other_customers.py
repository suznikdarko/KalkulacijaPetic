import os

files = [
    r'c:\DARKO\KalkulacijaPetric\brosura.html',
    r'c:\DARKO\KalkulacijaPetric\etikete.html',
    r'c:\DARKO\KalkulacijaPetric\kuverte.html'
]

old_logic = """                    var customers = [];
                    for (var i = 0; i < arhiv.length; i++) {
                        var p = arhiv[i];
                        if (p && p.customer) {
                            var c = p.customer.trim();
                            if (c && customers.indexOf(c) === -1) {
                                customers.push(c);
                            }
                        }
                    }
                    customers.sort();"""

new_logic = """                    var customers = [];
                    for (var i = 0; i < arhiv.length; i++) {
                        var p = arhiv[i];
                        if (p && p.customer) {
                            var c = p.customer.trim();
                            if (c && customers.indexOf(c) === -1) {
                                customers.push(c);
                            }
                        }
                    }
                    var cache = JSON.parse(localStorage.getItem('petric_customers_cache') || '[]');
                    for (var j = 0; j < cache.length; j++) {
                        var c2 = cache[j].trim();
                        if (c2 && customers.indexOf(c2) === -1) {
                            customers.push(c2);
                        }
                    }
                    customers.sort();"""

for file_path in files:
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        if old_logic in content:
            content = content.replace(old_logic, new_logic)
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Patched {file_path}")
        else:
            print(f"Logic not found in {file_path}")
