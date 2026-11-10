import fitz, re, json

doc = fitz.open(r'C:\DARKO\KalkulacijaPetric\Tarife_Tiskarna_Petric_2026.pdf')

weight_brackets = [
    (0, 50), (51, 100), (101, 150), (151, 200), (201, 250), (251, 300),
    (301, 400), (401, 500), (501, 600), (601, 700), (701, 800), (801, 900),
    (901, 1000), (1001, 1100), (1101, 1200), (1201, 1300), (1301, 1400),
    (1401, 1500), (1501, 1600), (1601, 1700), (1701, 1800), (1801, 1900),
    (1901, 2000), (2001, 2100), (2101, 2200), (2201, 2300), (2301, 2400),
    (2401, 2500)
]

name_map = {
    0: 'Avstrija',
    1: 'Nemčija',
    2: 'Nizozemska',
    3: 'Francija',
    4: 'Belgija',
    5: 'Češka',
    6: 'Danska',
    7: 'Estonija',
    8: 'Madžarska',
    9: 'Italija',
    10: 'Irska',
    11: 'Švedska',
    12: 'Slovenija'
}

data = {}

for pno, page in enumerate(doc):
    words = page.get_text('words')
    cname = name_map[pno]
    
    cona_words = [w for w in words if w[4] == 'Cona']
    cona_words.sort(key=lambda w: w[0])
    num_zones = len(cona_words)
    
    price_words = [w for w in words if re.match(r'^\d+,\d{2}$', w[4].replace('€', '').strip())]
    price_words.sort(key=lambda w: (round(w[1]/5)*5, w[0]))
    
    first_price_y = min(w[1] for w in price_words)
    first_cona_y = min(w[1] for w in cona_words)
    
    zones = []
    for i, cw in enumerate(cona_words):
        x_min = cw[0] - 15
        x_max = (cw[0] + cona_words[i+1][0]) / 2 if i + 1 < len(cona_words) else 600
        col_words = [w for w in words if w[0] >= x_min and w[0] < x_max and w[1] >= first_cona_y and w[1] < first_price_y]
        col_words.sort(key=lambda w: (round(w[1]/5)*5, w[0]))
        text = ' '.join(w[4] for w in col_words if w[4] not in ['Cona', str(i+1)])
        text = re.sub(r'\s+', ' ', text).strip()
        zones.append({
            'zone': i + 1,
            'name': f'Cona {i+1}',
            'desc': text
        })
        
    rates = []
    for r_idx, (min_kg, max_kg) in enumerate(weight_brackets):
        row_prices = {}
        for z_idx in range(num_zones):
            p_item = price_words[r_idx * num_zones + z_idx]
            val = float(p_item[4].replace('€', '').replace(',', '.').strip())
            row_prices[z_idx + 1] = val
        rates.append({
            'minKg': min_kg,
            'maxKg': max_kg,
            'prices': row_prices
        })
        
    data[cname] = {
        'country': cname,
        'page': pno + 1,
        'numZones': num_zones,
        'zones': zones,
        'rates': rates
    }

preferred_order = ['Avstrija', 'Slovenija', 'Nemčija', 'Italija', 'Francija', 'Nizozemska', 'Belgija', 'Češka', 'Danska', 'Madžarska', 'Švedska', 'Irska', 'Estonija']
ordered_data = {k: data[k] for k in preferred_order if k in data}

header_part = """/**
 * TARIFE PREVOZOV - Tiskarna Petrič 2026
 * Vir podatkov: Tarife_Tiskarna_Petric_2026.pdf
 * Avtomatski izračun prevozov glede na težo in destinacijo ter vmesnik za kalkulatorje.
 */

window.TARIFE_PREVOZOV = """ + json.dumps(ordered_data, ensure_ascii=False, indent=2) + """;

/**
 * Poišče ceno prevoza po teži (kg), državi in coni.
 */
window.izracunajCenoPrevoza = function(drzava, cona, tezaKg) {
    if (!drzava || !window.TARIFE_PREVOZOV[drzava]) {
        drzava = 'Avstrija';
    }
    const dData = window.TARIFE_PREVOZOV[drzava];
    const cNum = parseInt(cona, 10) || 6;
    const kg = Math.max(0, parseFloat(tezaKg) || 0);

    let matchedRate = null;
    let opomba = '';

    if (kg > 2500) {
        matchedRate = dData.rates[dData.rates.length - 1];
        opomba = 'Teža presega 2.500 kg (obračunana osnova za 2.500 kg, preverite PDF za tovor nad 2,5t)';
    } else {
        for (let i = 0; i < dData.rates.length; i++) {
            const r = dData.rates[i];
            if (kg >= r.minKg && kg <= r.maxKg) {
                matchedRate = r;
                break;
            }
        }
        if (!matchedRate && dData.rates.length > 0) {
            matchedRate = dData.rates[0];
        }
    }

    const cena = (matchedRate && matchedRate.prices[cNum] !== undefined) ? matchedRate.prices[cNum] : 0;
    return {
        cena: cena,
        minKg: matchedRate ? matchedRate.minKg : 0,
        maxKg: matchedRate ? matchedRate.maxKg : 50,
        cona: cNum,
        drzava: drzava,
        page: dData.page || 1,
        opomba: opomba
    };
};

/**
 * Odpre uradni PDF cenik prevozov v novem zavihku.
 */
window.odpriCenikPDF = function() {
    window.open('Tarife_Tiskarna_Petric_2026.pdf', '_blank');
};

/**
 * Poskusi uganiti cono glede na vpisano poštno številko ali regijo.
 */
window.najdiConoPoPostni = function(drzava, postna) {
    if (!drzava || !window.TARIFE_PREVOZOV[drzava]) return 1;
    if (!postna) return 1;
    const dData = window.TARIFE_PREVOZOV[drzava];
    const cleanP = String(postna).trim().replace(/\\D/g, '');
    if (cleanP.length >= 2) {
        const prefix2 = parseInt(cleanP.substring(0, 2), 10);
        for (let z of dData.zones) {
            const desc = z.desc;
            const parts = desc.split(/[\\s,]+/);
            for (let i = 0; i < parts.length; i++) {
                if (parts[i] === '-') {
                    const start = parseInt(parts[i-1], 10);
                    const end = parseInt(parts[i+1], 10);
                    if (!isNaN(start) && !isNaN(end) && prefix2 >= start && prefix2 <= end) {
                        return z.zone;
                    }
                } else {
                    const val = parseInt(parts[i], 10);
                    if (!isNaN(val) && val === prefix2) {
                        return z.zone;
                    }
                }
            }
        }
    }
    return 1;
};

/**
 * Inicializira ali ustvari UI pripomoček za prevoz v kalkulatorju.
 * @param {string} containerId - ID vsebnika, kamor se vstavi kartica
 * @param {object} opts - nastavitve { priceInputId, activeCheckboxId, getWeightFn, onPriceApplied }
 */
window.initPrevozUI = function(containerId, opts) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    opts = opts || {};
    const priceInputId = opts.priceInputId || 'f-del-fixed-price';
    const activeCheckboxId = opts.activeCheckboxId || 'f-del-fixed-active';
    const getWeightFn = opts.getWeightFn || function() {
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
    };
    const onPriceApplied = opts.onPriceApplied || function() {
        if (typeof calculatePrice === 'function') calculatePrice();
        else if (typeof calculate === 'function') calculate();
    };

    container.innerHTML = `
        <div class="transport-tariff-card" style="margin-top: 0.5rem; padding: 0.65rem 0.85rem; background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(59, 130, 246, 0.4); border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
                <span style="font-size: 0.88rem; font-weight: bold; color: #60a5fa; display: flex; align-items: center; gap: 0.4rem;">
                    🚚 Izračun prevoza po teži (Cenik 2026)
                </span>
                <button type="button" onclick="odpriCenikPDF()" title="Odpri celoten uradni PDF cenik v novem zavihku"
                    style="background: rgba(59, 130, 246, 0.2); border: 1px solid #3b82f6; color: #93c5fd; padding: 3px 10px; border-radius: 5px; font-size: 0.78rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px; transition: 0.2s;">
                    📄 Odpri PDF cenik
                </button>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.5rem; align-items: flex-end;">
                <div>
                    <label style="font-size: 0.75rem; color: #94a3b8; display: block; margin-bottom: 2px;">Država dostave</label>
                    <select id="tariff-country-select" style="width: 100%; height: 32px; font-size: 0.82rem; background: #0f172a; color: white; border: 1px solid #475569; border-radius: 4px; padding: 2px 6px;">
                    </select>
                </div>
                <div>
                    <label style="font-size: 0.75rem; color: #94a3b8; display: block; margin-bottom: 2px;">Cona / Območje</label>
                    <select id="tariff-zone-select" style="width: 100%; height: 32px; font-size: 0.82rem; background: #0f172a; color: white; border: 1px solid #475569; border-radius: 4px; padding: 2px 6px;">
                    </select>
                </div>
                <div>
                    <label style="font-size: 0.75rem; color: #94a3b8; display: block; margin-bottom: 2px;">Teža naročila (kg)</label>
                    <div style="display: flex; gap: 4px;">
                        <input type="number" id="tariff-weight-input" step="0.1" min="0" placeholder="0 kg"
                            style="width: 100%; height: 32px; font-size: 0.85rem; font-weight: bold; background: #0f172a; color: #fcd34d; border: 1px solid #475569; border-radius: 4px; padding: 2px 6px;">
                        <button type="button" id="tariff-weight-sync-btn" title="Osveži / prevzemi težo iz trenutne kalkulacije"
                            style="background: #334155; border: 1px solid #64748b; color: white; border-radius: 4px; padding: 0 8px; cursor: pointer; font-size: 0.85rem;">🔄</button>
                    </div>
                </div>
                <div>
                    <label style="font-size: 0.75rem; color: #94a3b8; display: block; margin-bottom: 2px;">Izračunana cena</label>
                    <div style="display: flex; gap: 4px;">
                        <input type="text" id="tariff-price-display" readonly
                            style="width: 100%; height: 32px; font-size: 0.95rem; font-weight: 800; background: #1e293b; color: #34d399; border: 1px solid #059669; border-radius: 4px; padding: 2px 8px; text-align: right;" value="0,00 €">
                        <button type="button" id="tariff-apply-btn" title="Vstavi to ceno v dostavo kalkulacije"
                            style="background: #10b981; border: none; color: white; border-radius: 4px; padding: 0 10px; font-size: 0.8rem; font-weight: bold; cursor: pointer; white-space: nowrap; transition: 0.2s;">
                            Vstavi
                        </button>
                    </div>
                </div>
            </div>
            <div id="tariff-info-text" style="font-size: 0.75rem; color: #94a3b8; margin-top: 5px; min-height: 16px;"></div>
        </div>
    `;

    const countrySelect = container.querySelector('#tariff-country-select');
    const zoneSelect = container.querySelector('#tariff-zone-select');
    const weightInput = container.querySelector('#tariff-weight-input');
    const syncBtn = container.querySelector('#tariff-weight-sync-btn');
    const priceDisplay = container.querySelector('#tariff-price-display');
    const applyBtn = container.querySelector('#tariff-apply-btn');
    const infoText = container.querySelector('#tariff-info-text');

    const countries = Object.keys(window.TARIFE_PREVOZOV);
    const sortedCountries = ['Avstrija'].concat(countries.filter(c => c !== 'Avstrija'));
    countrySelect.innerHTML = sortedCountries.map(c => 
        '<option value="' + c + '"' + (c === 'Avstrija' ? ' selected' : '') + '>' + c + '</option>'
    ).join('');
    countrySelect.value = 'Avstrija';

    function updateZones() {
        const cname = countrySelect.value;
        const dData = window.TARIFE_PREVOZOV[cname];
        if (!dData) return;
        // Pustimo samo Cono 6 (če cona 6 v določeni državi ne obstaja, vzamemo zadnjo/najvišjo cono)
        let relevantZones = dData.zones.filter(z => z.zone === 6);
        if (relevantZones.length === 0) {
            relevantZones = [dData.zones[dData.zones.length - 1]];
        }
        zoneSelect.innerHTML = relevantZones.map(z => {
            const shortDesc = z.desc.length > 30 ? (z.desc.substring(0, 30) + '...') : z.desc;
            return '<option value="' + z.zone + '" title="' + z.desc + '" selected>' + z.name + (shortDesc ? ' (' + shortDesc + ')' : '') + '</option>';
        }).join('');
        recalcTariff();
    }

    function recalcTariff() {
        const cname = countrySelect.value;
        const zone = parseInt(zoneSelect.value, 10) || 6;
        const w = parseFloat(weightInput.value) || 0;
        const res = window.izracunajCenoPrevoza(cname, zone, w);

        priceDisplay.value = res.cena.toFixed(2).replace('.', ',') + ' €';
        if (res.opomba) {
            infoText.innerHTML = '<span style="color: #f87171;">⚠️ ' + res.opomba + '</span> (PDF str. ' + res.page + ')';
        } else if (w > 0) {
            infoText.innerHTML = 'Razred: <strong style="color: #e2e8f0;">' + res.minKg + ' - ' + res.maxKg + ' kg</strong> (Cenik str. ' + res.page + ')';
        } else {
            infoText.innerHTML = 'Vnesite težo ali kliknite 🔄 za prevzem teže iz kalkulacije (PDF str. ' + res.page + ')';
        }
    }

    function syncWeight() {
        const calcWeight = getWeightFn();
        if (calcWeight > 0) {
            weightInput.value = calcWeight.toFixed(1);
        }
        recalcTariff();
    }

    countrySelect.addEventListener('change', updateZones);
    zoneSelect.addEventListener('change', recalcTariff);
    weightInput.addEventListener('input', recalcTariff);
    syncBtn.addEventListener('click', syncWeight);

    applyBtn.addEventListener('click', function() {
        const cname = countrySelect.value;
        const zone = parseInt(zoneSelect.value, 10) || 6;
        const w = parseFloat(weightInput.value) || 0;
        const res = window.izracunajCenoPrevoza(cname, zone, w);

        const targetInput = document.getElementById(priceInputId);
        if (targetInput) {
            targetInput.value = res.cena.toFixed(2);
            if (typeof updateInputStyles === 'function') updateInputStyles(targetInput);
        }

        const activeChk = document.getElementById(activeCheckboxId);
        if (activeChk && !activeChk.checked) {
            activeChk.checked = true;
            if (typeof toggleFinishRow === 'function') {
                toggleFinishRow(activeCheckboxId.replace('f-', '').replace('-active', ''));
            }
        }

        onPriceApplied();

        const origHtml = applyBtn.innerHTML;
        applyBtn.innerHTML = "✓ Vstavljeno";
        applyBtn.style.background = "#059669";
        setTimeout(() => {
            applyBtn.innerHTML = origHtml;
            applyBtn.style.background = "#10b981";
        }, 1500);
    });

    updateZones();
    syncWeight();

    let userEditedWeight = false;
    weightInput.addEventListener('keydown', function() { userEditedWeight = true; });

    window.syncTariffWeightExternal = function() {
        if (!userEditedWeight) {
            const w = getWeightFn();
            if (w > 0 && Math.abs(parseFloat(weightInput.value || 0) - w) > 0.05) {
                weightInput.value = w.toFixed(1);
                recalcTariff();
            }
        }
    };
};

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
                    const m = text.match(/Skupna teža[^:]*:\s*([\d.,]+)\s*kg/i);
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

with open('tarife_prevozov.js', 'w', encoding='utf-8') as f:
    f.write(header_part)

print("Generated complete tarife_prevozov.js! Size:", len(header_part))
