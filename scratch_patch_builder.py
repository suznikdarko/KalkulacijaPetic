with open('build_tarife_js.py', 'r', encoding='utf-8') as f:
    c = f.read()

# Let's check what needs to be added before the end of tarife_prevozov.js
auto_init_code = """
// Samodejna inicializacija ob naložitvi strani, če obstaja vsebnik
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('tarife-prevoz-container')) {
        let priceInputId = 'f-del-fixed-price';
        if (document.getElementById('f-del-fixed-cost')) {
            priceInputId = 'f-del-fixed-cost';
        } else if (document.getElementById('f-del-fixed-price')) {
            priceInputId = 'f-del-fixed-price';
        }

        let activeChkId = 'f-del-fixed-active';

        window.initPrevozUI('tarife-prevoz-container', {
            priceInputId: priceInputId,
            activeCheckboxId: activeChkId,
            getWeightFn: function() {
                if (typeof window.g_currentTotalWeightKg === 'number' && window.g_currentTotalWeightKg > 0) {
                    return window.g_currentTotalWeightKg;
                }
                const specEl = document.getElementById('detailed-spec-content');
                if (specEl) {
                    const text = specEl.innerText || '';
                    const m = text.match(/Skupna teža[^:]*:\\s*([\\d.,]+)\\s*kg/i);
                    if (m) return parseFloat(m[1].replace(',', '.'));
                }
                return 0;
            },
            onPriceApplied: function() {
                if (typeof calculatePrice === 'function') calculatePrice();
                else if (typeof calculate === 'function') calculate();
            }
        });
    }
});
"""

# Replace the end
if 'auto_init_code' not in c:
    c = c.replace('window.syncTariffWeightExternal = function() {', 'window.syncTariffWeightExternal = function() {')
    c = c.replace('};\n};\n"""', '};\n};\n' + auto_init_code + '"""')
    with open('build_tarife_js.py', 'w', encoding='utf-8') as f:
        f.write(c)
    print("Updated build_tarife_js.py with auto_init")
else:
    print("Already present")
