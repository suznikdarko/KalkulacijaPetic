
        function logDebug(msg, isError = false) {
            console.log(msg);
            const logDiv = document.getElementById('debug-log');
            if (logDiv) {
                const entry = document.createElement('div');
                entry.style.color = isError ? '#f87171' : '#94a3b8';
                entry.style.fontSize = '0.7rem';
                entry.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
                entry.style.padding = '2px 0';
                entry.innerText = new Date().toLocaleTimeString() + ": " + msg;
                logDiv.prepend(entry);
            }
        }

        // Funkcija za vizualno označevanje polj z vsebino
        function updateInputStyles(el) {
            if (!el || (el.tagName !== 'INPUT' && el.tagName !== 'SELECT' && el.tagName !== 'TEXTAREA')) return;

            let hasValue = false;
            const val = el.value.trim();

            if (el.type === 'checkbox') {
                hasValue = false; // Checkboxov ne barvamo
            } else if (el.tagName === 'SELECT') {
                hasValue = val !== "" && val !== "auto";
            } else {
                const num = parseFloat(val);
                // Barvamo če ni prazno, ni "0", ni "0.00" in je številka različna od 0
                hasValue = val !== "" && val !== "0" && val !== "0.00" && !isNaN(num) && num !== 0;
            }

            if (hasValue) {
                el.classList.add('has-content');
            } else {
                el.classList.remove('has-content');
            }
        }

        document.addEventListener('input', (e) => updateInputStyles(e.target));
        document.addEventListener('change', (e) => updateInputStyles(e.target));
        let g_editedQuoteHTML = '';
        let g_editedWorkOrderHTML = '';
        let quoteBasket = JSON.parse(localStorage.getItem('petric_quote_basket')) || [];
        renderBasket();
        updateWarnings();

        // Osveževanje košarice med zavihki
        window.addEventListener('storage', (e) => {
            if (e.key === 'petric_quote_basket') {
                quoteBasket = JSON.parse(e.newValue) || [];
                renderBasket();
            }
        });

        function getActiveFinishingList() {
            const list = [];
            if (document.getElementById('f-cilinder-active').checked) list.push('Cilinder');
            if (document.getElementById('f-zgibanje-active').checked) {
                const f = document.getElementById('f-zgibanje-folds').value;
                list.push(`Zgibanje (${f}x)`);
            }
            
            if (document.getElementById('f-razrez-format-active').checked) list.push('Razrez na format');
            
            
            
            if (document.getElementById('f-extra-active').checked) list.push('Ročno delo');
            if (document.getElementById('f-tool-active').checked) list.push('Orodje');
            
            
            
            if (document.getElementById('f-del-fixed-active').checked) list.push('Dostava (Ostalo)');
            if (document.getElementById('f-precut-active') && document.getElementById('f-precut-active').checked) list.push('Razrez pred tiskom');
            return list.join(', ');
        }

        function addToBasket() {
            try {
                // Prepričaj se, da je izračun posodobljen
                calculate();

                const projectName = document.getElementById('calc-project-name').value || 'Brez imena';
                const qtyStr = document.getElementById('quantity').value || '0';
                const qtyArr = qtyStr.split(',').map(x => parseFloat(x.trim().replace(/\./g, ''))).filter(x => !isNaN(x) && x > 0);

                if (qtyArr.length === 0) {
                    alert("Prosimo vnesite vsaj eno naklado.");
                    return;
                }

                // Pripravimo podatke za vsako naklado
                const results = [];
                qtyArr.forEach(q => {
                    const res = calculateForSingleQty(q);
                    if (res) results.push(res);
                });

                if (results.length === 0) {
                    alert("Napaka pri izračunu cen. Preverite vnose.");
                    return;
                }

                const basketItem = {
                    id: Date.now(),
                    type: 'Tiskovna pola',
                    name: projectName,
                    customer: document.getElementById('calc-customer').value || '',
                    materialCode: document.getElementById('calc-material-code').value || '/',
                    spec: {
                        format: document.getElementById('width').value + ' x ' + document.getElementById('height').value + ' mm',
                        paper: document.getElementById('calc-paper-weight').value + 'g ' + (document.getElementById('calc-paper-type').value || ''),
                        colors: (() => { const f = parseInt(document.getElementById('calc-color-front').value) || 0; const b = parseInt(document.getElementById('calc-color-back').value) || 0; const isOb = document.getElementById('calc-is-obrat') && document.getElementById('calc-is-obrat').checked; const isSV = document.getElementById('calc-is-sv') && document.getElementById('calc-is-sv').checked; return (isOb || isSV) ? (f + '/' + f) : (f + '/' + b); })(),
                        finishing: getActiveFinishingList()
                    },
                    quantities: results.map(r => ({
                        qty: r.qty,
                        priceTotal: r.totalPrice,
                        pricePerUnit: r.perItemFinal
                    }))
                };

                quoteBasket.push(basketItem);
                localStorage.setItem('petric_quote_basket', JSON.stringify(quoteBasket));
                renderBasket();

                // Povratna informacija uporabniku
                const btn = document.querySelector('button[onclick="addToBasket()"]');
                if (btn) {
                    const originalText = btn.innerHTML;
                    btn.innerHTML = "✅ DODANO";
                    setTimeout(() => { btn.innerHTML = originalText; }, 1500);
                } else {
                    alert("Dodano v košarico!");
                }
            } catch (e) {
                console.error("addToBasket error:", e);
                alert("Napaka pri dodajanju v košarico: " + e.message);
            }
        }

        function removeFromBasket(id) {
            quoteBasket = quoteBasket.filter(item => item.id !== id);
            localStorage.setItem('petric_quote_basket', JSON.stringify(quoteBasket));
            renderBasket();
        }

        function clearBasket() {
            if (confirm("Izbrišem vse elemente iz košarice?")) {
                quoteBasket = [];
                localStorage.setItem('petric_quote_basket', JSON.stringify(quoteBasket));
                renderBasket();
            }
        }

        function renderBasket() {
            try {
                const container = document.getElementById('basket-items-list');
                const basketContainer = document.getElementById('basket-container');
                if (!container || !basketContainer) return;

                if (!quoteBasket || quoteBasket.length === 0) {
                    container.innerHTML = '<div style="padding: 10px; color: #94a3b8; font-size: 0.8rem; text-align: center;">Košarica je prazna.</div>';
                    basketContainer.style.display = 'none';
                    return;
                }

                basketContainer.style.display = 'block';
                container.innerHTML = quoteBasket.map(item => {
                    if (!item || !item.spec || !item.quantities) return '';
                    return `
                    <div style="padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: flex-start; border-left: 3px solid #3b82f6;">
                        <div style="flex: 1;">
                            <div style="font-weight: bold; color: white; font-size: 0.9rem;">${item.name}</div>
                            <div style="font-size: 0.75rem; color: #94a3b8;">${item.type} | ${item.spec.format}</div>
                            <div style="margin-top: 4px;">
                                ${item.quantities.map(q => `<span style="font-size: 0.7rem; background: rgba(59, 130, 246, 0.2); color: #60a5fa; padding: 2px 5px; border-radius: 4px; margin-right: 4px;">${formatQty(q.qty)}: ${formatPrice(q.priceTotal)}</span>`).join('')}
                            </div>
                        </div>
                        <button onclick="removeFromBasket(${item.id})" style="background: none; border: none; color: #ef4444; cursor: pointer; padding: 5px; font-size: 1rem;">✕</button>
                    </div>
                    `;
                }).join('');
            } catch (e) {
                console.error("renderBasket error:", e);
            }
        }

        window.onerror = function (msg, url, lineNo, columnNo, error) {
            console.error("ERROR:", msg, "at line", lineNo);
            return false;
        };

        function handleFormatChange(val) {
            if (!val) return;
            const standardFormats = {
                'a2': [420, 594],
                'a3': [297, 420],
                'a4': [210, 297],
                'a5': [148, 210],
                'a6': [105, 148],
                'a7': [74, 105],
                'b4': [250, 353],
                'b5': [176, 250],
                'b6': [125, 176],
                'vizitka': [90, 50],
                'vizitka85': [85, 54]
            };
            const cleaned = val.trim().toLowerCase();
            let w = null, h = null;
            if (standardFormats[cleaned]) {
                [w, h] = standardFormats[cleaned];
            } else {
                const match = val.match(/\((\d+)\s*[xX*×,]\s*(\d+)\s*(?:mm)?\)/);
                if (match) {
                    w = parseInt(match[1]);
                    h = parseInt(match[2]);
                }
            }
            if (w && h) {
                const widthEl = document.getElementById('width');
                const heightEl = document.getElementById('height');
                if (widthEl && heightEl) {
                    widthEl.value = w;
                    heightEl.value = h;
                    const itemsPerSheet = document.getElementById('items-per-sheet');
                    if (itemsPerSheet) {
                        itemsPerSheet.value = '';
                    }

                    if (typeof calculate === 'function') {
                        calculate();
                    }
                }
            }
        }

        const sheets = [
            { name: "B1", w: 1000, h: 700 },
            { name: "A1", w: 841, h: 594 },
            { name: "B2", w: 698, h: 498 },
            { name: "6 iz B1", w: 349, h: 332 },
            { name: "638x448", w: 638, h: 448 },
            { name: "B3", w: 498, h: 348 },
            { name: "Riba", w: 698, h: 332 },
            { name: "498x232", w: 498, h: 232 },
            { name: "B4", w: 348, h: 248 },
            { name: "A2", w: 592, h: 418 },
            { name: "A3", w: 418, h: 295 },
            { name: "SRA3", w: 448, h: 318 },
            { name: "A4", w: 295, h: 208 },
            { name: "Digital (480x320)", w: 480, h: 320 }
        ];

        const prepRules = {
            '0/0': { passes: 0, wasteImpressions: 0 },
            '1/0': { passes: 1, wasteImpressions: 175 },
            '2/0': { passes: 1, wasteImpressions: 200 },
            '3/0': { passes: 1, wasteImpressions: 250 },
            '4/0': { passes: 2, wasteImpressions: 480 },
            '5/0': { passes: 2, wasteImpressions: 850 },
            '6/0': { passes: 2, wasteImpressions: 1050 },
            '7/0': { passes: 2, wasteImpressions: 1250 },
            '1/1': { passes: 2, wasteImpressions: 240 },
            '1/OB': { passes: 2, wasteImpressions: 250 },
            '2/1': { passes: 2, wasteImpressions: 750 },
            '3/1': { passes: 2, wasteImpressions: 850 },
            '4/1': { passes: 2, wasteImpressions: 690 },
            '4/4': { passes: 2, wasteImpressions: 800 },
            '4/OB': { passes: 2, wasteImpressions: 800 },
            '8/0': { passes: 1, wasteImpressions: 450 }
        };

        const machineProfiles = {
            'S4': { rate: 120, speed: 6900, prep: 10, useDynamic: true, maxW: 518, maxH: 348, defaultFormat: 'B3' },
            'S8': { rate: 150, speed: 6900, prep: 10, useDynamic: true, maxW: 698, maxH: 498, defaultFormat: 'B2' },
            'CD': { rate: 180, speed: 8000, prep: 10, useDynamic: false, maxW: 698, maxH: 498, defaultFormat: 'B2' },
            'SM4+lak': { rate: 160, speed: 7000, prep: 10, useDynamic: false, maxW: 698, maxH: 498, defaultFormat: 'B2' },
            'CD UV': { rate: 280, speed: 6000, prep: 10, useDynamic: false, maxW: 698, maxH: 498, defaultFormat: 'B2' },
            'digital': { rate: 40, speed: 2000, prep: 10, useDynamic: false, defaultFormat: 'Digital (480x320)', maxW: 480, maxH: 320 },
            'cooperation': { rate: 0, speed: 6000, prep: 0, useDynamic: false, defaultFormat: 'B1', maxW: 1000, maxH: 707 }
        };

        let g_lastBestLayout = null;
        let g_lastSheetW = 0, g_lastSheetH = 0, g_lastG = 0;
        let g_autoCount = 0;

        function getBossTables(machineType) {
            let mType = machineType || (document.getElementById('calc-machine-type') ? document.getElementById('calc-machine-type').value : 'S4');
            if (mType === 'S4') {
                return {
                    "8/0": [
                        { q: 1000, waste: 720, s150: 3460, s250: 3200, s350: 3100 },
                        { q: 5000, waste: 720, s150: 6350, s250: 5960, s350: 5300 },
                        { q: 10000, waste: 720, s150: 6400, s250: 5960, s350: 5450 },
                        { q: 50000, waste: 1250, s150: 6800, s250: 6300, s350: 5700 },
                        { q: 100000, waste: 1250, s150: 6800, s250: 6300, s350: 5700 },
                        { q: 300000, waste: 1500, s150: 7100, s250: 6600, s350: 6000 },
                        { q: 500000, waste: 1500, s150: 7100, s250: 6600, s350: 6000 }
                    ],
                    "4/0": [
                        { q: 1000, waste: 320, s150: 3100, s250: 3100, s350: 2900 },
                        { q: 5000, waste: 320, s150: 6600, s250: 6600, s350: 5480 },
                        { q: 10000, waste: 320, s150: 6600, s250: 6000, s350: 5480 },
                        { q: 50000, waste: 320, s150: 6800, s250: 6800, s350: 5700 },
                        { q: 100000, waste: 500, s150: 6800, s250: 6300, s350: 5700 },
                        { q: 300000, waste: 320, s150: 7140, s250: 6600, s350: 6060 },
                        { q: 500000, waste: 625, s150: 7140, s250: 6600, s350: 6060 }
                    ],
                    "4/4": [
                        { q: 1000, waste: 1280, s150: 3800, s250: 3800, s350: 3300 },
                        { q: 5000, waste: 1280, s150: 6600, s250: 6600, s350: 5400 },
                        { q: 10000, waste: 1280, s150: 6900, s250: 6900, s350: 5700 },
                        { q: 50000, waste: 1280, s150: 7140, s250: 7140, s350: 6050 },
                        { q: 100000, waste: 1280, s150: 7140, s250: 7140, s350: 6050 },
                        { q: 300000, waste: 1500, s150: 7140, s250: 7140, s350: 6050 },
                        { q: 500000, waste: 2500, s150: 7140, s250: 7140, s350: 6050 }
                    ],
                    "4/OB": [
                        { q: 1000, waste: 540, s150: 4200, s250: 4200, s350: 3600 },
                        { q: 5000, waste: 540, s150: 6600, s250: 6600, s350: 5400 },
                        { q: 10000, waste: 540, s150: 6900, s250: 6900, s350: 5700 },
                        { q: 50000, waste: 540, s150: 7140, s250: 7140, s350: 6000 },
                        { q: 100000, waste: 1000, s150: 7140, s250: 7140, s350: 6000 },
                        { q: 300000, waste: 1000, s150: 7140, s250: 7140, s350: 6000 },
                        { q: 500000, waste: 1250, s150: 7140, s250: 7140, s350: 6000 }
                    ],
                    "4/OB + mutacija 1x": [
                        { q: 1000, waste: 940, s150: 4600, s250: 4600, s350: 3900 },
                        { q: 5000, waste: 940, s150: 6600, s250: 6600, s350: 5400 },
                        { q: 10000, waste: 940, s150: 6900, s250: 6900, s350: 5700 },
                        { q: 50000, waste: 940, s150: 7140, s250: 7140, s350: 6000 },
                        { q: 100000, waste: 940, s150: 7140, s250: 7140, s350: 6000 },
                        { q: 300000, waste: 1150, s150: 7140, s250: 7140, s350: 6000 },
                        { q: 500000, waste: 1650, s150: 7140, s250: 7140, s350: 6000 }
                    ],
                    "4/OB + mutacija 2x": [
                        { q: 1000, waste: 1340, s150: 4600, s250: 4600, s350: 3900 },
                        { q: 5000, waste: 1340, s150: 6600, s250: 6600, s350: 5400 },
                        { q: 10000, waste: 1340, s150: 6900, s250: 6900, s350: 5700 },
                        { q: 50000, waste: 1340, s150: 7140, s250: 7140, s350: 6000 },
                        { q: 100000, waste: 1340, s150: 7140, s250: 7140, s350: 6000 },
                        { q: 300000, waste: 1550, s150: 7140, s250: 7140, s350: 6000 },
                        { q: 500000, waste: 2050, s150: 7140, s250: 7140, s350: 6000 }
                    ],
                    "4/OB + mutacija 3x": [
                        { q: 1000, waste: 1740, s150: 5070, s250: 5070, s350: 4200 },
                        { q: 5000, waste: 1740, s150: 6600, s250: 6600, s350: 5400 },
                        { q: 10000, waste: 1740, s150: 6900, s250: 6900, s350: 5700 },
                        { q: 50000, waste: 1740, s150: 7140, s250: 7140, s350: 6050 },
                        { q: 100000, waste: 1740, s150: 7140, s250: 7140, s350: 6050 },
                        { q: 300000, waste: 1950, s150: 7140, s250: 7140, s350: 6050 },
                        { q: 500000, waste: 2450, s150: 7140, s250: 7140, s350: 6050 }
                    ],
                    "4/4 + mutacija 1x": [
                        { q: 1000, waste: 3680, s150: 6600, s250: 6600, s350: 5450 },
                        { q: 5000, waste: 3680, s150: 6600, s250: 6600, s350: 5450 },
                        { q: 10000, waste: 3680, s150: 6900, s250: 6900, s350: 5700 },
                        { q: 50000, waste: 3680, s150: 7140, s250: 6900, s350: 5700 },
                        { q: 100000, waste: 3680, s150: 7140, s250: 6900, s350: 5700 },
                        { q: 300000, waste: 3900, s150: 7140, s250: 6900, s350: 5700 },
                        { q: 500000, waste: 4900, s150: 7140, s250: 6900, s350: 5700 }
                    ],
                    "4/4 + mutacija 2x": [
                        { q: 1000, waste: 6080, s150: 6600, s250: 6600, s350: 5450 },
                        { q: 5000, waste: 6080, s150: 6900, s250: 6600, s350: 5450 },
                        { q: 10000, waste: 6080, s150: 6900, s250: 6600, s350: 5700 },
                        { q: 50000, waste: 6080, s150: 7140, s250: 6600, s350: 6050 },
                        { q: 100000, waste: 6080, s150: 7140, s250: 6600, s350: 6050 },
                        { q: 300000, waste: 6300, s150: 7140, s250: 6600, s350: 6050 },
                        { q: 500000, waste: 7300, s150: 7140, s250: 6600, s350: 6050 }
                    ],
                    "4/4 + mutacija 3x": [
                        { q: 1000, waste: 8480, s150: 6600, s250: 6600, s350: 5450 },
                        { q: 5000, waste: 8480, s150: 6900, s250: 6600, s350: 5450 },
                        { q: 10000, waste: 8480, s150: 6900, s250: 6600, s350: 5700 },
                        { q: 50000, waste: 8480, s150: 7140, s250: 6600, s350: 6050 },
                        { q: 100000, waste: 8480, s150: 7140, s250: 6600, s350: 6050 },
                        { q: 300000, waste: 8700, s150: 7140, s250: 6600, s350: 6050 },
                        { q: 500000, waste: 9700, s150: 7140, s250: 6600, s350: 6050 }
                    ]
                };
            } else {
                return {
                    "8/0": [
                        { q: 1000, waste: 720, s150: 3460, s250: 3200, s350: 3100 },
                        { q: 5000, waste: 720, s150: 6350, s250: 5960, s350: 5300 },
                        { q: 10000, waste: 720, s150: 6400, s250: 5960, s350: 5450 },
                        { q: 50000, waste: 1250, s150: 6800, s250: 6300, s350: 5700 },
                        { q: 100000, waste: 1250, s150: 6800, s250: 6300, s350: 5700 },
                        { q: 300000, waste: 1500, s150: 7100, s250: 6600, s350: 6000 },
                        { q: 500000, waste: 1500, s150: 7100, s250: 6600, s350: 6000 }
                    ],
                    "4/0": [
                        { q: 1000, waste: 320, s150: 3100, s250: 3000, s350: 2900 },
                        { q: 5000, waste: 320, s150: 5070, s250: 4750, s350: 4250 },
                        { q: 10000, waste: 320, s150: 6400, s250: 6000, s350: 5400 },
                        { q: 50000, waste: 320, s150: 6800, s250: 6300, s350: 5700 },
                        { q: 100000, waste: 320, s150: 6800, s250: 6300, s350: 5700 },
                        { q: 300000, waste: 320, s150: 7140, s250: 6600, s350: 6060 },
                        { q: 500000, waste: 625, s150: 7140, s250: 6600, s350: 6060 }
                    ],
                    "4/4": [
                        { q: 1000, waste: 1280, s150: 3600, s250: 3200, s350: 3000 },
                        { q: 5000, waste: 1280, s150: 5070, s250: 5600, s350: 5150 },
                        { q: 10000, waste: 1280, s150: 6400, s250: 6000, s350: 5450 },
                        { q: 50000, waste: 1280, s150: 6800, s250: 6300, s350: 5700 },
                        { q: 100000, waste: 1280, s150: 6800, s250: 6600, s350: 6050 },
                        { q: 300000, waste: 1500, s150: 7140, s250: 6600, s350: 6050 },
                        { q: 500000, waste: 2500, s150: 7140, s250: 6600, s350: 6050 }
                    ],
                    "4/OB": [
                        { q: 1000, waste: 540, s150: 3580, s250: 3300, s350: 3250 },
                        { q: 5000, waste: 540, s150: 4400, s250: 4400, s350: 4400 },
                        { q: 10000, waste: 540, s150: 5050, s250: 6000, s350: 5450 },
                        { q: 50000, waste: 540, s150: 6800, s250: 6300, s350: 5700 },
                        { q: 100000, waste: 540, s150: 6800, s250: 6600, s350: 6060 },
                        { q: 300000, waste: 750, s150: 7140, s250: 6600, s350: 6060 },
                        { q: 500000, waste: 1250, s150: 7140, s250: 6600, s350: 6060 }
                    ],
                    "4/OB + mutacija 1x": [
                        { q: 1000, waste: 940, s150: 4000, s250: 3800, s350: 3600 },
                        { q: 5000, waste: 940, s150: 5500, s250: 5100, s350: 4700 },
                        { q: 10000, waste: 940, s150: 6450, s250: 6000, s350: 5450 },
                        { q: 50000, waste: 940, s150: 6800, s250: 6300, s350: 5700 },
                        { q: 100000, waste: 940, s150: 6800, s250: 6600, s350: 6050 },
                        { q: 300000, waste: 1150, s150: 7140, s250: 6600, s350: 6050 },
                        { q: 500000, waste: 1650, s150: 7140, s250: 6600, s350: 6050 }
                    ],
                    "4/OB + mutacija 2x": [
                        { q: 1000, waste: 1340, s150: 4100, s250: 3800, s350: 3600 },
                        { q: 5000, waste: 1340, s150: 4800, s250: 5100, s350: 4700 },
                        { q: 10000, waste: 1340, s150: 6200, s250: 6000, s350: 5450 },
                        { q: 50000, waste: 1340, s150: 6800, s250: 6300, s350: 5700 },
                        { q: 100000, waste: 1340, s150: 6800, s250: 6600, s350: 6050 },
                        { q: 300000, waste: 1550, s150: 7140, s250: 6600, s350: 6050 },
                        { q: 500000, waste: 2050, s150: 7140, s250: 6600, s350: 6050 }
                    ],
                    "4/OB + mutacija 3x": [
                        { q: 1000, waste: 1740, s150: 4100, s250: 3800, s350: 3600 },
                        { q: 5000, waste: 1740, s150: 4800, s250: 5100, s350: 4700 },
                        { q: 10000, waste: 1740, s150: 6200, s250: 6000, s350: 5450 },
                        { q: 50000, waste: 1740, s150: 6800, s250: 6300, s350: 5700 },
                        { q: 100000, waste: 1740, s150: 6800, s250: 6600, s350: 6050 },
                        { q: 300000, waste: 1950, s150: 7140, s250: 6600, s350: 6050 },
                        { q: 500000, waste: 2450, s150: 7140, s250: 6600, s350: 6050 }
                    ],
                    "4/4 + mutacija 1x": [
                        { q: 1000, waste: 3680, s150: 6400, s250: 5900, s350: 5450 },
                        { q: 5000, waste: 3680, s150: 6400, s250: 6000, s350: 5490 },
                        { q: 10000, waste: 3680, s150: 6200, s250: 6000, s350: 5490 },
                        { q: 50000, waste: 3680, s150: 6800, s250: 6300, s350: 5700 },
                        { q: 100000, waste: 3680, s150: 6800, s250: 6600, s350: 6050 },
                        { q: 300000, waste: 3900, s150: 7140, s250: 6600, s350: 6050 },
                        { q: 500000, waste: 4900, s150: 7140, s250: 6600, s350: 6050 }
                    ],
                    "4/4 + mutacija 2x": [
                        { q: 1000, waste: 6080, s150: 6400, s250: 6000, s350: 5450 },
                        { q: 5000, waste: 6080, s150: 6400, s250: 6000, s350: 5450 },
                        { q: 10000, waste: 6080, s150: 6800, s250: 6300, s350: 5700 },
                        { q: 50000, waste: 6080, s150: 6800, s250: 6300, s350: 5700 },
                        { q: 100000, waste: 6080, s150: 7140, s250: 6600, s350: 6050 },
                        { q: 300000, waste: 6300, s150: 7140, s250: 6600, s350: 6050 },
                        { q: 500000, waste: 7300, s150: 7140, s250: 6600, s350: 6050 }
                    ],
                    "4/4 + mutacija 3x": [
                        { q: 1000, waste: 8480, s150: 6400, s250: 6000, s350: 5450 },
                        { q: 5000, waste: 8480, s150: 6800, s250: 6000, s350: 5450 },
                        { q: 10000, waste: 8480, s150: 6200, s250: 6300, s350: 5700 },
                        { q: 50000, waste: 8480, s150: 6800, s250: 6300, s350: 5700 },
                        { q: 100000, waste: 8480, s150: 6800, s250: 6600, s350: 6050 },
                        { q: 300000, waste: 8700, s150: 7140, s250: 6600, s350: 6050 },
                        { q: 500000, waste: 9700, s150: 7140, s250: 6600, s350: 6050 }
                    ]
                };
            }
        }

        function parseLocaleFloat(val) {
            if (val == null) return 0;
            if (typeof val === 'number') return val;
            let clean = val.toString().trim();
            if (!clean) return 0;
            if (clean.includes('.') && clean.includes(',')) {
                clean = clean.replace(/\./g, '').replace(/,/g, '.');
            } else if (clean.includes(',')) {
                clean = clean.replace(/,/g, '.');
            }
            const num = parseFloat(clean);
            return isNaN(num) ? 0 : num;
        }

        function getFloatValue(id, defaultVal = 0) {
            const el = document.getElementById(id);
            if (!el) return defaultVal;
            return parseLocaleFloat(el.value);
        }

        function getIntValue(id, defaultVal = 0) {
            const el = document.getElementById(id);
            if (!el) return defaultVal;
            const val = parseInt(el.value);
            return isNaN(val) ? defaultVal : val;
        }

        function formatPrice(num, decimals = 2) {
            if (num == null || isNaN(num)) return "0,00";
            let parts = Number(num).toFixed(decimals).split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            return parts.join(',') + " €";
        }

        function formatQty(num) {
            if (num == null || isNaN(num)) return "0";
            return Math.floor(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }

        function formatInputQty(el) {
            let cursor = el.selectionStart;
            let oldVal = el.value;
            let clean = el.value.replace(/[^\d,]/g, "");
            let parts = clean.split(",");
            let formatted = parts.map(p => {
                if (!p) return "";
                return p.trim().replace(/\./g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            }).join(", ");
            el.value = formatted;
            let diff = el.value.length - oldVal.length;
            el.setSelectionRange(cursor + diff, cursor + diff);
        }

        function applyDimPreset(val) {
            if (!val) return;
            const dims = val.split('x');
            if (dims.length === 2) {
                document.getElementById('width').value = dims[0];
                document.getElementById('height').value = dims[1];
                document.getElementById('items-per-sheet').value = '';

                // Če naklada ni vpisana, vpišemo 1000, da se izriše shema
                const qInput = document.getElementById('quantity');
                if (!qInput.value || qInput.value.trim() === "0") {
                    qInput.value = "1.000";
                }

                calculate();
            }
        }

        function applySourcePreset(val) {
            if (!val) return;
            const dims = val.split('x');
            if (dims.length === 2) {
                document.getElementById('calc-source-w').value = dims[0];
                document.getElementById('calc-source-h').value = dims[1];
                filterAvailableFormats();
                calculate();
            }
        }

        function applyMachineDefaults() {
            const itemsInp = document.getElementById('items-per-sheet');
            if (itemsInp) itemsInp.value = "";
            const mType = document.getElementById('calc-machine-type').value;
            const profile = machineProfiles[mType];
            const isCoop = (mType === 'cooperation');
            
            const machineInputs = document.getElementById('machine-inputs-group');
            const coopInputs = document.getElementById('cooperation-inputs-group');
            if (machineInputs) machineInputs.style.display = isCoop ? 'none' : 'block';
            if (coopInputs) coopInputs.style.display = isCoop ? 'flex' : 'none';
            
            if (profile) {
                document.getElementById('calc-machine-rate').value = profile.rate;
                document.getElementById('calc-machine-speed').value = profile.speed;
                document.getElementById('calc-machine-prep-time').value = profile.prep;

                const mFormatSelect = document.getElementById('machine-format');
                if (mFormatSelect) {
                    mFormatSelect.value = isCoop ? 'B1' : 'auto';
                }
            }
            filterAvailableFormats();
        }

        function filterAvailableFormats() {
            const sw = parseFloat(document.getElementById('calc-source-w').value) || 1000;
            const sh = parseFloat(document.getElementById('calc-source-h').value) || 700;
            const select = document.getElementById('machine-format');
            const options = select.options;
            const mType = document.getElementById('calc-machine-type').value;
            const profile = machineProfiles[mType];

            for (let i = 0; i < options.length; i++) {
                const val = options[i].value;
                if (val === 'auto') continue;
                const sheet = sheets.find(s => s.name === val);
                if (sheet) {
                    let fitsSource = (sw >= sheet.w && sh >= sheet.h) || (sw >= sheet.h && sh >= sheet.w);
                    let fitsMachine = true;
                    if (profile && profile.maxW) {
                        fitsMachine = (sheet.w <= profile.maxW && sheet.h <= profile.maxH) || (sheet.h <= profile.maxW && sheet.w <= profile.maxH);
                    }
                    const fits = fitsSource && fitsMachine;
                    options[i].disabled = !fits;
                    if (!fits && select.value === val) select.value = 'auto';
                }
            }
            updateSourceYield();
            calculate();
        }

        function updateSourceYield() {
            const sw = parseFloat(document.getElementById('calc-source-w').value) || 1000;
            const sh = parseFloat(document.getElementById('calc-source-h').value) || 700;
            const mFormat = document.getElementById('machine-format').value;
            let sheetW = 700, sheetH = 500;
            let sheet = sheets.find(s => s.name === mFormat);
            if (sheet) { sheetW = sheet.w; sheetH = sheet.h; }
            const y1 = Math.floor(sw / sheetW) * Math.floor(sh / sheetH);
            const y2 = Math.floor(sw / sheetH) * Math.floor(sh / sheetW);
            // If auto format, calculate will overwrite this anyway with the actual best layout's yield.
            if (mFormat !== 'auto') {
                document.getElementById('calc-source-yield').value = Math.max(y1, y2, 1);
            }
        }

        function optimizeLayout(sheetW, sheetH, itemW, itemH, gripper, forceMode) {
            const isObrat = document.getElementById('calc-is-obrat') ? document.getElementById('calc-is-obrat').checked : false;
            let best = null;

            const baseConfigs = [
                { iw: itemW, ih: itemH, rot: false, edge: 'H' },
                { iw: itemH, ih: itemW, rot: true, edge: 'H' }
            ];

            baseConfigs.forEach(cfg => {
                let usableW = cfg.edge === 'W' ? sheetW - gripper : sheetW;
                let usableH = cfg.edge === 'H' ? sheetH - gripper : sheetH;
                if (usableW <= 0 || usableH <= 0) return;

                let cols = Math.floor(usableW / cfg.iw);
                let rows = Math.floor(usableH / cfg.ih);

                let isPlacedLandscape = cfg.iw >= cfg.ih;
                if (forceMode === 'landscape' && !isPlacedLandscape) return;
                if (forceMode === 'portrait' && isPlacedLandscape && cfg.iw !== cfg.ih) return;

                let count = cols * rows;
                let finalCount = count;
                let isMixed = false;

                if (forceMode === 'auto' && !isObrat && count > 0) {
                    let remW = usableW - (cols * cfg.iw);
                    let addRight = (remW >= cfg.ih) ? Math.floor(remW / cfg.ih) * Math.floor(usableH / cfg.iw) : 0;

                    let remH = usableH - (rows * cfg.ih);
                    let addBottom = (remH >= cfg.iw) ? Math.floor(remH / cfg.iw) * Math.floor(usableW / cfg.ih) : 0;

                    if (addRight > 0 || addBottom > 0) {
                        finalCount = count + Math.max(addRight, addBottom);
                        isMixed = true;
                    }
                }

                if (isObrat) {
                    let maxColsEven = Math.floor(cols / 2) * 2;
                    let maxRowsEven = Math.floor(rows / 2) * 2;
                    let obratCount = Math.max(maxColsEven * rows, cols * maxRowsEven);
                    finalCount = obratCount > 0 ? obratCount : 0;
                }

                if (finalCount > 0 && (!best || finalCount > best.count)) {
                    best = {
                        count: finalCount,
                        cols: cols,
                        rows: rows,
                        itemW: cfg.iw,
                        itemH: cfg.ih,
                        rot: cfg.rot,
                        gripEdge: cfg.edge,
                        isMixed: isMixed
                    };
                }
            });
            return best;
        }

        function calculatePrice() {
            calculate();
        }

        function updateWarnings() {
            const qtyBox = document.getElementById('quantity');
            const qVal = qtyBox ? qtyBox.value.trim() : "";
            if (qtyBox) {
                if (qVal === '' || qVal === '0') {
                    qtyBox.style.animation = 'blinkRequired 1.5s infinite';
                } else {
                    qtyBox.style.animation = 'none';
                }
            }

            const front = parseInt(document.getElementById('calc-color-front').value) || 0;
            const back = parseInt(document.getElementById('calc-color-back').value) || 0;
            const colorFrontEl = document.getElementById('calc-color-front');
            const colorBackEl = document.getElementById('calc-color-back');

            if (colorFrontEl && colorBackEl) {
                if (front === 0 && back === 0) {
                    colorFrontEl.style.animation = 'blinkRequired 1.5s infinite';
                    colorBackEl.style.animation = 'blinkRequired 1.5s infinite';
                } else {
                    colorFrontEl.style.animation = 'none';
                    colorBackEl.style.animation = 'none';
                }
            }
        }

        

        let g_lastW_calc = 0, g_lastH_calc = 0;

        function calculate(isManual = false) {
            updateWarnings();
            try {
                const w = getFloatValue('width');
                const h = getFloatValue('height');
                const b = getFloatValue('bleed');
                const g = getFloatValue('gripper');
                const qStr = document.getElementById('quantity').value || "0";
                const qArr = qStr.split(',').map(x => parseLocaleFloat(x.trim().replace(/\./g, ''))).filter(x => !isNaN(x) && x > 0);
                const q = qArr[0] || 0;
                const fMode = document.getElementById('item-orientation').value;
                const mFormat = document.getElementById('machine-format').value;

                const sw = getFloatValue('calc-source-w', 1000);
                const sh = getFloatValue('calc-source-h', 700);
                const mType = document.getElementById('calc-machine-type').value;
                const profile = machineProfiles[mType];

                if (w <= 0 || h <= 0 || q <= 0) return;

                g_lastW_calc = w;
                g_lastH_calc = h;

                const itemW = w + 2 * b;
                const itemH = h + 2 * b;

                // Preberi ročni vnos stavkov
                const itemsInp = document.getElementById('items-per-sheet');
                let targetCount = parseInt(itemsInp.value) || 0;

                // Če je isManual ali če so se dimenzije spremenile, ne vsiljujemo starega števila stavkov
                if (isManual || targetCount === g_autoCount) {
                    targetCount = 0;
                }

                let bestSheet = null;
                let bestLayout = null;
                let bestScore = -1;

                const checkSheet = (s) => {
                    let fitsSource = (sw >= s.w && sh >= s.h) || (sw >= s.h && sh >= s.w);
                    let fitsMachine = true;
                    if (profile && profile.maxW) {
                        fitsMachine = (s.w <= profile.maxW && s.h <= profile.maxH) || (s.h <= profile.maxW && s.w <= profile.maxH);
                    }
                    if (!fitsSource || !fitsMachine) return;

                    let currLayout = optimizeLayout(s.w, s.h, itemW, itemH, g, fMode);
                    if (!currLayout) return;

                    const y1 = Math.floor(sw / s.w) * Math.floor(sh / s.h);
                    const y2 = Math.floor(sw / s.h) * Math.floor(sh / s.w);
                    const sYield = Math.max(y1, y2, 1);

                    let score;
                    let isSatisfied = (targetCount > 0 && currLayout.count >= targetCount);

                    if (targetCount > 0) {
                        if (isSatisfied) {
                            // Če dosegamo želeno število, optimiziramo sYield in porabo papirja
                            const sheetArea = s.w * s.h;
                            score = (sYield * 1000000000) + (1000000000000 / sheetArea) + currLayout.count;
                        } else {
                            // Če ne dosegamo, gremo na max stavke
                            score = currLayout.count;
                        }
                    } else {
                        // Standardna optimizacija: čimveč kosov iz osnovne pole (sYield * count)
                        score = sYield * currLayout.count;
                    }

                    if (score > bestScore) {
                        bestScore = score;
                        bestSheet = s;
                        bestLayout = currLayout;
                    }
                };

                if (mFormat === 'auto') {
                    for (let s of sheets) {
                        checkSheet(s);
                    }
                    if (!bestSheet) {
                        bestSheet = sheets.find(s => {
                            let fM = true;
                            if (profile && profile.maxW) fM = (s.w <= profile.maxW && s.h <= profile.maxH) || (s.h <= profile.maxW && s.w <= profile.maxH);
                            return ((sw >= s.w && sh >= s.h) || (sw >= s.h && sh >= s.w)) && fM;
                        }) || sheets[0];
                        bestLayout = optimizeLayout(bestSheet.w, bestSheet.h, itemW, itemH, g, fMode);
                    }
                } else {
                    bestSheet = sheets.find(s => s.name === mFormat) || sheets[0];
                    bestLayout = optimizeLayout(bestSheet.w, bestSheet.h, itemW, itemH, g, fMode);
                }

                if (bestSheet) {
                    const y1 = Math.floor(sw / bestSheet.w) * Math.floor(sh / bestSheet.h);
                    const y2 = Math.floor(sw / bestSheet.h) * Math.floor(sh / bestSheet.w);
                    document.getElementById('calc-source-yield').value = Math.max(y1, y2, 1);
                }

                if (!bestLayout) {
                    // Poskusimo samodejno preklopiti na stroj, ki podpira ta format
                    let foundMachine = null;
                    for (let mKey in machineProfiles) {
                        if (mKey === mType) continue;
                        const prof = machineProfiles[mKey];
                        // Preverimo, ali ta stroj in njegove razpoložljive pole podpirajo format izdelka
                        for (let s of sheets) {
                            let fitsSource = (sw >= s.w && sh >= s.h) || (sw >= s.h && sh >= s.w);
                            let fitsMachine = true;
                            if (prof && prof.maxW) {
                                fitsMachine = (s.w <= prof.maxW && s.h <= prof.maxH) || (s.h <= prof.maxW && s.w <= prof.maxH);
                            }
                            if (fitsSource && fitsMachine) {
                                let lay = optimizeLayout(s.w, s.h, itemW, itemH, g, fMode);
                                if (lay && lay.count > 0) {
                                    foundMachine = mKey;
                                    break;
                                }
                            }
                        }
                        if (foundMachine) break;
                    }

                    if (foundMachine) {
                        document.getElementById('calc-machine-type').value = foundMachine;
                        applyMachineDefaults();
                        return; // Prekinemo trenutni izračun, saj bo applyMachineDefaults sprožil novega
                    }

                    if (isManual) alert("Izdelek ne gre na polo!");
                    return;
                }

                document.getElementById('empty-state').style.display = 'none';
                document.getElementById('stats').style.display = 'grid';
                document.getElementById('res-sheet').innerText = bestSheet.name;
                document.getElementById('res-count').innerText = bestLayout.count;
                document.getElementById('res-sheet-mini').innerText = bestSheet.name;
                document.getElementById('res-count-mini').innerText = bestLayout.count;

                // Samodejno posodobi polje za vnos stavkov, če je bilo v "auto" načinu
                if (isManual || itemsInp.value == "0" || itemsInp.value == "" || parseInt(itemsInp.value) === g_autoCount || targetCount === 0) {
                    itemsInp.value = bestLayout.count;
                    g_autoCount = bestLayout.count;
                }

                g_lastBestLayout = bestLayout;

                const currentCount = parseInt(itemsInp.value) || bestLayout.count;
                let usage = (currentCount * itemW * itemH) / (bestSheet.w * bestSheet.h);
                document.getElementById('res-usage').innerText = (usage * 100).toFixed(1) + "%";
                document.getElementById('res-usage-mini').innerText = (usage * 100).toFixed(1) + "%";
                document.getElementById('res-size').innerText = bestSheet.w + " x " + bestSheet.h;

                const isOverride = currentCount !== bestLayout.count;
                drawAllLayouts(bestSheet.w, bestSheet.h, bestLayout, g, w, h, b, sw, sh, isOverride, currentCount);

                updateWasteAndPrice(Math.ceil(q / currentCount), q, bestSheet.w, bestSheet.h);

            } catch (e) { console.error(e); }
        }


        function updateWasteAndPrice(needed, q, dw, dh) {
            const mType = document.getElementById('calc-machine-type').value;
            const profile = machineProfiles[mType];

            const front = parseInt(document.getElementById('calc-color-front').value) || 0;
            const back = parseInt(document.getElementById('calc-color-back').value) || 0;

            if (back > 0) {
                document.getElementById('obrat-container').style.display = 'block';
            } else {
                document.getElementById('obrat-container').style.display = 'none';
                document.getElementById('calc-is-obrat').checked = false;
            }

            const isObrat = document.getElementById('calc-is-obrat').checked;
            const mutPlates = parseInt(document.getElementById('calc-mut-plates') ? document.getElementById('calc-mut-plates').value : 0) || 0;
            const totalPlates = front + (isObrat ? 0 : back) + mutPlates;
            document.getElementById('calc-plates-num').value = totalPlates;

            // Samodejno posodobi makulaturo glede na izbran barvni način
            const colorMode = front + '/' + (isObrat ? 'OB' : back);
            const rule = prepRules[colorMode] || { passes: 1, wasteImpressions: (front + back) * 150 };
            document.getElementById('calc-paper-waste').value = rule.wasteImpressions;

            const qStr = document.getElementById('quantity').value || "0";
            const qArr = qStr.split(',').map(x => parseFloat(x.trim().replace(/\./g, ''))).filter(x => !isNaN(x) && x > 0);
            const totalItemsFormArr = qArr.length ? qArr : [q || 1000];

            let results = [];
            let r = null;

            totalItemsFormArr.forEach(qty => {
                let currentNeeded = Math.ceil(qty / (parseInt(document.getElementById('items-per-sheet').value) || 1));
                let res = calculateForSingleQty(qty, currentNeeded, dw, dh);
                results.push(res);
                if (qty === q) r = res;
            });
            if (!r && results.length > 0) r = results[0];

            if (!r) return;



            document.getElementById('res-count').innerText = r.itemsPerSheet;
            document.getElementById('res-count-mini').innerText = r.itemsPerSheet;
            document.getElementById('res-sheets-needed').innerText = r.sheetsNeeded;
            if (document.getElementById('res-dodatek-sheets')) {
                document.getElementById('res-dodatek-sheets').innerText = document.getElementById('f-dodatek-sheets').value || '0';
            }
            document.getElementById('res-price-paper').innerText = r.paperCost.toFixed(2) + " €";
            document.getElementById('res-price-prep').innerText = r.totalPrepCost.toFixed(2) + " €";
            document.getElementById('res-price-print').innerText = r.totalPrintCost.toFixed(2) + " €";
            document.getElementById('res-price-finish').innerText = r.totalFinishCost.toFixed(2) + " €";
            document.getElementById('res-price-total').innerText = r.totalPrice.toFixed(2) + " €";
            document.getElementById('res-price-per-item-stat-quick').innerText = r.perItemFinal.toFixed(3) + " €";
            document.getElementById('res-price-per-item-stat-final').innerText = r.perItemFinal.toFixed(3) + " €";
            if (document.getElementById('res-price-1000-stat')) {
                document.getElementById('res-price-1000-stat').innerText = (r.perItemFinal * 1000).toFixed(2) + " €";
            }

            const stickyTotal = document.getElementById('sticky-price-total');
            const stickyPerItem = document.getElementById('sticky-price-per-item');
            const sticky1000 = document.getElementById('sticky-price-1000');
            const stickyQty = document.getElementById('sticky-qty');

            if (totalItemsFormArr.length > 1) {
                if (stickyQty) stickyQty.innerHTML = results.map(x => formatQty(x.qty)).join('<br>');
                if (stickyTotal) stickyTotal.innerHTML = results.map(x => x.totalPrice.toFixed(2) + " €").join('<br>');
                if (stickyPerItem) stickyPerItem.innerHTML = results.map(x => x.perItemFinal.toFixed(3) + " €").join('<br>');
                if (sticky1000) sticky1000.innerHTML = results.map(x => (x.perItemFinal * 1000).toFixed(2) + " €").join('<br>');
            } else {
                if (stickyQty) stickyQty.innerText = formatQty(r.qty);
                if (stickyTotal) stickyTotal.innerText = r.totalPrice.toFixed(2) + " €";
                if (stickyPerItem) stickyPerItem.innerText = r.perItemFinal.toFixed(3) + " €";
                if (sticky1000) sticky1000.innerText = (r.perItemFinal * 1000).toFixed(2) + " €";
            }

            const spPaper = document.getElementById('sticky-p-paper');
            const spPrep = document.getElementById('sticky-p-prep');
            const spPrint = document.getElementById('sticky-p-print');
            const spFinish = document.getElementById('sticky-p-finish');

            if (spPaper) spPaper.innerText = r.paperCost.toFixed(2) + " €";
            if (spPrep) spPrep.innerText = r.totalPrepCost.toFixed(2) + " €";
            if (spPrint) spPrint.innerText = r.totalPrintCost.toFixed(2) + " €";
            if (spFinish) spFinish.innerText = r.totalFinishCost.toFixed(2) + " €";

            renderDetailedSpec(r);
        }

        function renderDetailedSpec(r) {
            const container = document.getElementById('detailed-spec-container');
            const content = document.getElementById('detailed-spec-content');
            if (!container || !content || !r.details) return;

            container.style.display = 'block';
            const d = r.details;

            let html = `
                <!-- PAPER -->
                <div style="padding: 10px; background: rgba(59, 130, 246, 0.05); border-radius: 8px;">
                    <div style="font-weight: bold; color: #60a5fa; margin-bottom: 5px;">1. Material (Papir)</div>
                    <div style="display: grid; grid-template-columns: 1fr auto; gap: 5px; color: #cbd5e1;">
                        <span>Tiskovne pole po razrezu:</span> <span style="font-weight: bold;">${formatQty(d.paper.totalSheets)} pol</span>
                        <span style="color: #93c5fd;">Nerazrezane pole (${d.paper.sourceW}×${d.paper.sourceH} → ${d.paper.sourceYield}x razrez):</span>
                        <span style="font-weight: bold; color: #93c5fd;">${formatQty(d.paper.sourceSheets)} pol</span>
                        ${d.paper.kg > 0 ? `<span>Teža papirja:</span> <span>${d.paper.kg.toFixed(1)} kg</span>` : ''}
                        <div style="grid-column: 1/-1; height: 1px; background: rgba(255,255,255,0.1); margin: 3px 0;"></div>
                        <span>Strošek materiala:</span> <span>${formatPrice(d.paper.cost)}</span>
                    </div>
                </div>

                <!-- PREP -->
                <div style="padding: 10px; background: rgba(167, 139, 250, 0.05); border-radius: 8px;">
                    <div style="font-weight: bold; color: #a78bfa; margin-bottom: 5px;">2. Priprava in Plošče</div>
                    <div style="display: grid; grid-template-columns: 1fr auto; gap: 5px; color: #cbd5e1;">
                        <span>Cena plošč (${d.prep.plates} kos):</span> <span>${formatPrice(d.prep.platesCost)}</span>
                        <span>Pavšalna priprava:</span> <span>${formatPrice(d.prep.setup)}</span>
                        ${d.prep.changes > 0 ? `<span>Menjava plošč:</span> <span>${formatPrice(d.prep.changesCost)}</span>` : ''}
                        ${d.prep.washCost > 0 ? `<span>Pranje stroja:</span> <span>${formatPrice(d.prep.washCost)}</span>` : ''}
                    </div>
                </div>

                <!-- PRINT -->
                <div style="padding: 10px; background: rgba(245, 158, 11, 0.05); border-radius: 8px;">
                    <div style="font-weight: bold; color: #f59e0b; margin-bottom: 5px;">3. Tisk (Strojno delo)</div>
                    <div style="display: grid; grid-template-columns: 1fr auto; gap: 5px; color: #cbd5e1;">
                        ${d.print.prepTime > 0 ? `<span>Priprava stroja (${(d.print.prepTime * 60).toFixed(0)} min):</span> <span>${formatPrice(d.print.prepTime * d.print.mRate)}</span>` : ''}
                        <span>Neto čas tiska (${(d.print.hours * 60).toFixed(0)} min):</span> <span>${formatPrice(d.print.hours * d.print.mRate)}</span>
                        <span>Prijemalec (gripper):</span> <span style="color: #fbbf24; font-weight: bold;">${d.print.gripper} mm</span>
                        <div style="grid-column: 1/-1; height: 1px; background: rgba(255,255,255,0.1); margin: 3px 0;"></div>
                        <span style="font-style: italic;">Skupaj strojno delo:</span> <span style="font-weight: bold;">${formatPrice(d.print.cost)}</span>
                    </div>
                </div>

                <!-- FINISH -->
                <div style="padding: 10px; background: rgba(16, 185, 129, 0.05); border-radius: 8px;">
                    <div style="font-weight: bold; color: #10b981; margin-bottom: 5px;">4. Dodelava in Usluge</div>
                    <div style="display: flex; flex-direction: column; gap: 8px; color: #cbd5e1;">
                        ${d.finish.items.length > 0 ? d.finish.items.map(it => `
                            <div style="display: grid; grid-template-columns: 1fr auto; gap: 5px;">
                                <span style="font-weight: 600;">${it.name}</span>
                                <span style="font-weight: 700; color: #34d399;">${formatPrice(it.cost)}</span>
                                <div style="grid-column: 1 / -1; font-size: 0.75rem; color: #94a3b8; margin-top: -2px;">${it.breakdown}</div>
                            </div>
                        `).join('') : '<span>Brez dodatne dodelave</span>'}
                    </div>
                </div>

                <!-- MARGIN -->
                ${parseFloat(document.getElementById('calc-margin').value) > 0 ? `
                <div style="padding: 10px; background: rgba(236, 72, 153, 0.05); border-radius: 8px;">
                    <div style="font-weight: bold; color: #ec4899; margin-bottom: 5px;">RVC / Marža</div>
                    <div style="display: grid; grid-template-columns: 1fr auto; gap: 5px; color: #cbd5e1;">
                        <span>Marža (${document.getElementById('calc-margin').value}%):</span> <span>${formatPrice(r.totalPrice - (r.paperCost + r.totalPrepCost + r.totalPrintCost + r.totalFinishCost))}</span>
                    </div>
                </div>
                ` : ''}

                <div style="padding: 10px; border-top: 2px solid #10b981; margin-top: 5px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 1rem; font-weight: bold; color: #10b981;">SKUPAJ PROIZVODNJA:</span>
                    <span style="font-size: 1.25rem; font-weight: 800; color: #10b981;">${formatPrice(r.totalPrice)}</span>
                </div>

                <!-- KOMERCIALA -->
                ${r.commercialCost > 0 ? `
                <div style="padding: 10px; background: rgba(59, 130, 246, 0.05); border-radius: 8px; margin-top: 5px;">
                    <div style="font-weight: bold; color: #60a5fa; margin-bottom: 5px;">Komerciala / Admin</div>
                    <div style="display: grid; grid-template-columns: 1fr auto; gap: 5px; color: #cbd5e1;">
                        <span>Strošek komerciale:</span> <span>${formatPrice(r.commercialCost)}</span>
                    </div>
                </div>
                ` : ''}
            `;
            content.innerHTML = html;
        }

        function calculateForSingleQty(qty, sheetsNeededIn, drawW, drawH) {
            function getDynamicSpeed(baseSpeed, grammage, qty) {
                let _front = parseInt(document.getElementById('calc-color-front').value) || 0;
                let _back = parseInt(document.getElementById('calc-color-back').value) || 0;
                let _isObrat = document.getElementById('calc-is-obrat').checked;
                let mutPlatesVal = parseInt(document.getElementById('calc-mut-plates').value) || 0;
                let mutSuffix = "";
                if (mutPlatesVal === 1) mutSuffix = " + mutacija 1x";
                else if (mutPlatesVal === 2) mutSuffix = " + mutacija 2x";
                else if (mutPlatesVal >= 3) mutSuffix = " + mutacija 3x";
                let isSV = document.getElementById('calc-is-sv') ? document.getElementById('calc-is-sv').checked : false;
                let baseColorMode = isSV ? '8/0' : (_isObrat ? '4/OB' : (_back > 0 ? '4/4' : '4/0'));
                let speedTableMode = baseColorMode + mutSuffix;
                let bossTable = getBossTables()[speedTableMode] || getBossTables()[baseColorMode];
                if (bossTable) {
                    let getS = (obj) => {
                        if (paperWeight <= 150) return obj.s150;
                        if (paperWeight <= 250) {
                            let f = (paperWeight - 150) / 100;
                            return obj.s150 + f * (obj.s250 - obj.s150);
                        }
                        if (paperWeight <= 350) {
                            let f = (paperWeight - 250) / 100;
                            return obj.s250 + f * (obj.s350 - obj.s250);
                        }
                        return obj.s350;
                    };
                    let s = getS(bossTable[0]);
                    if (qty <= bossTable[0].q) {
                        s = getS(bossTable[0]);
                    } else if (qty >= bossTable[bossTable.length - 1].q) {
                        s = getS(bossTable[bossTable.length - 1]);
                    } else {
                        for (let i = 0; i < bossTable.length - 1; i++) {
                            if (qty >= bossTable[i].q && qty <= bossTable[i + 1].q) {
                                let rangeQ = bossTable[i + 1].q - bossTable[i].q;
                                let speed1 = getS(bossTable[i]);
                                let speed2 = getS(bossTable[i + 1]);
                                let rangeS = speed2 - speed1;
                                let fraction = (qty - bossTable[i].q) / rangeQ;
                                s = speed1 + fraction * rangeS;
                                break;
                            }
                        }
                    }
                    return Math.round(s);
                }
                return Math.min(baseSpeed, 6100);
            }

            let itemsPerSheet = getIntValue('items-per-sheet');
            let sheetsNeeded = sheetsNeededIn;

            // TEN LOGIKA: Naklada se ne deli več na pol (ustrezno popravljeno na polno količino)
            const effectiveQty = qty;

            if (itemsPerSheet > 0) {
                sheetsNeeded = Math.ceil(effectiveQty / itemsPerSheet);
            } else {
                let autCount = g_lastBestLayout ? g_lastBestLayout.count : (parseInt(document.getElementById('res-count').innerText) || 1);
                itemsPerSheet = autCount;
                sheetsNeeded = Math.ceil(effectiveQty / autCount);
            }

            if (sheetsNeeded === 0) sheetsNeeded = 1;

            if (drawW === undefined || drawH === undefined) {
                let sizeStr = document.getElementById('res-size').innerText.split('x');
                if (sizeStr.length === 2) {
                    drawW = parseLocaleFloat(sizeStr[0].trim());
                    drawH = parseLocaleFloat(sizeStr[1].trim());
                } else {
                    drawW = getFloatValue('width');
                    drawH = getFloatValue('height');
                }
            }

            let paperPrice = getFloatValue('calc-paper-price');
            let paperUnit = document.getElementById('calc-paper-unit').value;
            let paperWeight = getFloatValue('calc-paper-weight');
            let paperWasteSheets = getIntValue('calc-paper-waste');
            let dodatekSheets = getIntValue('f-dodatek-sheets');
            let totalSheetsNeeded = sheetsNeeded + paperWasteSheets;

            let paperCost = 0;
            let sourceW = getFloatValue('calc-source-w', 1000);
            let sourceH = getFloatValue('calc-source-h', 700);
            let sourceYield = getFloatValue('calc-source-yield', 1);

            // Izračunamo koliko OSNOVNIH pol potrebujemo (bruto, z dodatkom/makulativo)
            let netSourceSheetsNeeded = Math.ceil(sheetsNeeded / sourceYield);
            let totalSourceSheetsNeeded = Math.ceil(totalSheetsNeeded / sourceYield);

            if (paperUnit === 'ton') {
                let areaM2 = (sourceW / 1000) * (sourceH / 1000);
                let weightKg = areaM2 * (paperWeight / 1000) * totalSourceSheetsNeeded;
                paperCost = (weightKg / 1000) * paperPrice;
            } else if (paperUnit === '1000') {
                // Cena na 1000 osnovnih pol
                paperCost = (totalSourceSheetsNeeded / 1000) * paperPrice;
            } else {
                paperCost = totalSourceSheetsNeeded * paperPrice;
            }

            let front = getIntValue('calc-color-front');
            let back = getIntValue('calc-color-back');
            let isObrat = document.getElementById('calc-is-obrat').checked;
            let colorMode = front + '/' + (isObrat ? 'OB' : back);
            let prepPasses = Math.ceil(front / 4) + (back > 0 ? Math.ceil(back / 4) : 0);
            let defaultWaste = (front + back) * 150;
            let rule = prepRules[colorMode] || { passes: prepPasses, wasteImpressions: defaultWaste };
            let mPasses = rule.passes;

            let mutPlates = getIntValue('calc-mut-plates');
            let platesNum = getIntValue('calc-plates-num', front + (isObrat ? 0 : back) + mutPlates);
            let platesPrice = getFloatValue('calc-plates-price');
            let prepPrice = getFloatValue('calc-prep-price');
            let changePrice = getFloatValue('calc-change-price');
            let numberOfChanges = Math.max(0, platesNum - 1);
            let washesNum = getIntValue('calc-color-washes');
            let washPrice = getFloatValue('calc-wash-price', 25);
            let washCost = washesNum * washPrice;

            let totalPrepCost = (platesNum * platesPrice) + prepPrice + (numberOfChanges * changePrice) + washCost;

            let mRate = getFloatValue('calc-machine-rate', 120);
            let mProfile = machineProfiles[mType] || { speed: 6900 };
            let mSpeed = mProfile.speed;
            if (mProfile.useDynamic) {
                mSpeed = getDynamicSpeed(mProfile.speed, paperWeight, qty);
            }
            const mSpeedEl = document.getElementById('calc-machine-speed');
            let qStr = document.getElementById('quantity').value || "0";
            let qArr = qStr.split(',').map(x => parseLocaleFloat(x.trim().replace(/\./g, ''))).filter(x => !isNaN(x) && x > 0);
            let activeQ = qArr[0] || 0;
            if (mSpeedEl && qty === activeQ) {
                mSpeedEl.value = Math.round(mSpeed);
            }
            let mPrepInp = document.getElementById('calc-machine-prep-time').value;
            let mPrepTime = (mPrepInp === "" ? 10 : parseLocaleFloat(mPrepInp)) / 60;

            let printHours = (sheetsNeeded + paperWasteSheets) * mPasses / mSpeed;
            let totalPrintCost = 0;
            if (mType === 'cooperation') {
                let coopPrice = getFloatValue('calc-cooperation-price', 150);
                let coopUnit = document.getElementById('calc-cooperation-unit') ? document.getElementById('calc-cooperation-unit').value : 'flat';
                if (coopUnit === 'sheet') {
                    totalPrintCost = (sheetsNeeded + paperWasteSheets) * coopPrice;
                } else {
                    totalPrintCost = coopPrice;
                }
            } else {
                totalPrintCost = printHours * mRate;
            }

            let totalFinishCost = 0;
            if (document.getElementById('f-cilinder-active').checked) {
                let cPrep = getFloatValue('f-cilinder-prep', 20.80);
                let cRate = getFloatValue('f-cilinder-rate', 40);
                let cSpeed = 2000;
                if (paperWeight >= 300) {
                    cSpeed = 1400;
                } else if (paperWeight > 150) {
                    cSpeed = 2000 - ((paperWeight - 150) / 150) * (2000 - 1400);
                }
                cSpeed = Math.round(cSpeed);
                totalFinishCost += cPrep + (sheetsNeeded / cSpeed) * cRate;
            }
            if (document.getElementById('f-zgibanje-active').checked) {
                let zFolds = getIntValue('f-zgibanje-folds', 4);
                let zSpeed = getFloatValue('f-zgibanje-speed', 6800);
                let prepMap = { 1: 16.80, 2: 25.20, 3: 33.60, 4: 42.00, 5: 50.40 };
                let rateMap = { 1: 50.80, 2: 55.35, 3: 66.23, 4: 71.94, 5: 71.94 };
                let zPrep = prepMap[zFolds] || 10.50;
                let zRate = rateMap[zFolds] || 50.80;
                totalFinishCost += zPrep + (effectiveQty / zSpeed) * zRate;
            }
            
            if (document.getElementById('f-razrez-format-active').checked) {
                const spd = getFloatValue('f-razrez-format-speed', 5800);
                const rte = getFloatValue('f-razrez-format-rate', 20);
                totalFinishCost += (totalSheetsNeeded / spd) * rte;
            }
            
            
            
            if (document.getElementById('f-extra-active').checked) {
                const spd = getFloatValue('f-extra-speed', 1);
                const rte = getFloatValue('f-extra-rate', 20);
                totalFinishCost += (effectiveQty / spd) * rte;
            }
            if (document.getElementById('f-tool-active').checked) {
                totalFinishCost += getFloatValue('f-tool-cost');
            }
            
            if (document.getElementById('f-precut-active') && document.getElementById('f-precut-active').checked) {
                let prePrep = getFloatValue('f-precut-prep', 2.50);
                let prePer1000 = getFloatValue('f-precut-per1000', 3.60);
                totalFinishCost += prePrep + (totalSourceSheetsNeeded / 1000) * prePer1000;
            }
            
            let deliveryCost = 0;
            
            if (document.getElementById('f-del-fixed-active').checked) {
                deliveryCost += getFloatValue('f-del-fixed-price');
            }

            let commercialCost = getFloatValue('calc-commercial');
            let subtotalWithoutDelivery = paperCost + totalPrepCost + totalPrintCost + (totalFinishCost - deliveryCost) + commercialCost;

            if (document.getElementById('calc-minus-price').checked) {
                subtotalWithoutDelivery = subtotalWithoutDelivery * 0.952; // -4.8%
            }

            let subtotal = subtotalWithoutDelivery + deliveryCost;
            let marginPercent = getFloatValue('calc-margin');
            let totalPrice = subtotal * (1 + marginPercent / 100);
            let perItemFinal = totalPrice / qty;

            // DETAILED SPECS OBJECT
            let details = {
                paper: {
                    totalSheets: totalSheetsNeeded,
                    sourceSheets: totalSourceSheetsNeeded,
                    sourceYield: sourceYield,
                    sourceW: sourceW,
                    sourceH: sourceH,
                    kg: paperUnit === 'ton' ? ((sourceW / 1000) * (sourceH / 1000) * (paperWeight / 1000) * totalSourceSheetsNeeded) : 0,
                    cost: paperCost
                },
                prep: {
                    plates: platesNum,
                    platesPrice: platesPrice,
                    platesCost: platesNum * platesPrice,
                    setup: prepPrice,
                    changes: numberOfChanges,
                    changePrice: changePrice,
                    changesCost: numberOfChanges * changePrice,
                    washes: washesNum,
                    washPrice: washPrice,
                    washCost: washCost,
                    cost: totalPrepCost
                },
                print: {
                    hours: printHours,
                    prepTime: mPrepTime,
                    mRate: mRate,
                    cost: totalPrintCost,
                    gripper: getFloatValue('gripper')
                },
                finish: {
                    items: [],
                    cost: totalFinishCost
                }
            };

            // Collect finishing items
            if (document.getElementById('f-cilinder-active').checked) {
                let cPrep = getFloatValue('f-cilinder-prep', 20);
                let cRate = getFloatValue('f-cilinder-rate', 40);
                let cSpeed = 2000;
                if (paperWeight >= 300) {
                    cSpeed = 1400;
                } else if (paperWeight > 150) {
                    cSpeed = 2000 - ((paperWeight - 150) / 150) * (2000 - 1400);
                }
                cSpeed = Math.round(cSpeed);
                let workHours = sheetsNeeded / cSpeed;
                let cWork = workHours * cRate;
                let cCost = cPrep + cWork;
                details.finish.items.push({
                    name: 'Cilinder (izsek)',
                    cost: cCost,
                    breakdown: `Priprava: ${formatPrice(cPrep)} | Delo: ${workHours.toFixed(1)}h (${formatPrice(cWork)})`
                });
            }
            if (document.getElementById('f-zgibanje-active').checked) {
                let prepMap = { 1: 16.80, 2: 25.20, 3: 33.60, 4: 42.00, 5: 50.40 };
                let rateMap = { 1: 50.80, 2: 55.35, 3: 66.23, 4: 71.94, 5: 71.94 };
                let zSpeed = getFloatValue('f-zgibanje-speed', 6800);
                let workHours = effectiveQty / zSpeed;
                let zFolds = getIntValue('f-zgibanje-folds', 4);
                let zPrep = prepMap[zFolds] || 10.50;
                let zRate = rateMap[zFolds] || 50.80;
                let zWork = workHours * zRate;
                let zCost = zPrep + zWork;
                details.finish.items.push({
                    name: `Zgibanje (${zFolds}x)`,
                    cost: zCost,
                    breakdown: `Priprava: ${formatPrice(zPrep)} | Delo: ${workHours.toFixed(1)}h (${formatPrice(zWork)})`
                });
            }
            
            if (document.getElementById('f-razrez-format-active').checked) {
                const spd = getFloatValue('f-razrez-format-speed', 5800);
                const rte = getFloatValue('f-razrez-format-rate', 20);
                const hrs = totalSheetsNeeded / spd;
                let cost = hrs * rte;
                details.finish.items.push({
                    name: 'Razrez na format',
                    cost: cost,
                    breakdown: `Norma: ${spd} pol/h | Čas: ${hrs.toFixed(2)} h (${formatPrice(cost)})`
                });
            }
            
            
            

            if (document.getElementById('f-extra-active').checked) {
                const spd = getFloatValue('f-extra-speed', 1);
                const rte = getFloatValue('f-extra-rate', 20);
                const hrs = effectiveQty / spd;
                let eMan = hrs * rte;
                details.finish.items.push({
                    name: `Ročno delo (Norma: ${spd} kos/h)`,
                    cost: eMan,
                    breakdown: `Čas: ${hrs.toFixed(2)} h po ${formatPrice(rte)}/h = ${formatPrice(eMan)}`
                });
            }
            if (document.getElementById('f-tool-active').checked) {
                let tCost = getFloatValue('f-tool-cost');
                details.finish.items.push({
                    name: 'Orodje (izsek)',
                    cost: tCost,
                    breakdown: `Strošek izdelave orodja`
                });
            }
            
            
            
            if (document.getElementById('f-del-fixed-active').checked) {
                let fPrice = getFloatValue('f-del-fixed-price');
                details.finish.items.push({
                    name: 'Dostava (Fiksno)',
                    cost: fPrice,
                    breakdown: `Fiksna cena dostave`
                });
            }

            let itemBreakdown = null;

            return {
                qty: qty,
                itemsPerSheet: itemsPerSheet,
                sheetsNeeded: sheetsNeeded,
                paperCost: paperCost,
                totalPrepCost: totalPrepCost,
                totalPrintCost: totalPrintCost,
                totalFinishCost: totalFinishCost,
                commercialCost: commercialCost,
                totalPrice: totalPrice,
                perItemFinal: perItemFinal,
                itemBreakdown: itemBreakdown,
                details: details
            };
        }

        function updatePriceFromManualCount() {
            let manualCount = parseInt(document.getElementById('items-per-sheet').value) || 0;
            if (manualCount > 0) {
                // Samodejno preklopimo na 'auto' format, da sistem najde najboljšo polo za to število
                const mFormatEl = document.getElementById('machine-format');
                if (mFormatEl.value !== 'auto') {
                    mFormatEl.value = 'auto';
                }
                calculatePrice();
            }
        }

        function toggleFinishRow(type) {
            const row = document.getElementById('row-finish-' + type);
            if (!row) return;
            const active = document.getElementById('f-' + type + '-active').checked;
            if (active) {
                row.classList.add('active');
                // Če je pošta in je število 0, daj na 1 za lažji izračun
                if (type === 'delivery') {
                    if (cnt && (cnt.value === '0' || cnt.value === '')) {
                        cnt.value = '1';
                        updateInputStyles(cnt);
                    }
                }
            } else {
                row.classList.remove('active');
            }
            calculatePrice();
        }

        function drawAllLayouts(sheetW, sheetH, layout, gripper, origW, origH, bleed, sourceW, sourceH, isOverride = false, currentCount = 0) {
            g_lastSheetW = sheetW;
            g_lastSheetH = sheetH;
            g_lastG = gripper;
            document.getElementById('source-layout-container').style.display = 'block';
            document.getElementById('machine-layout-container').style.display = 'block';
            document.getElementById('source-dim-label').innerText = `${sourceW} x ${sourceH} mm`;
            document.getElementById('machine-dim-label').innerText = `${sheetW} x ${sheetH} mm`;

            drawSourceCanvas(sourceW, sourceH, sheetW, sheetH);
            drawMachineCanvas(sheetW, sheetH, layout, gripper, origW, origH, bleed, isOverride, currentCount);
        }

        function drawSourceCanvas(sw, sh, mw, mh) {
            const canvas = document.getElementById('canvas-source');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');

            // Calculate best fit (source yield)
            const y1 = Math.floor(sw / mw) * Math.floor(sh / mh);
            const y2 = Math.floor(sw / mh) * Math.floor(sh / mw);
            const useRotated = y2 > y1;
            const cols = useRotated ? Math.floor(sw / mh) : Math.floor(sw / mw);
            const rows = useRotated ? Math.floor(sh / mw) : Math.floor(sh / mh);
            const itemW = useRotated ? mh : mw;
            const itemH = useRotated ? mw : mh;

            const maxW = 400;
            const maxH = 250;
            const scale = Math.min(maxW / sw, maxH / sh);

            canvas.width = sw * scale;
            canvas.height = sh * scale;

            // Background
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 2;
            ctx.strokeRect(0, 0, canvas.width, canvas.height);

            // Draw machine pulses inside
            ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 1;

            const startX = (sw - cols * itemW) / 2;
            const startY = (sh - rows * itemH) / 2;

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    ctx.fillRect((startX + c * itemW) * scale, (startY + r * itemH) * scale, itemW * scale, itemH * scale);
                    ctx.strokeRect((startX + c * itemW) * scale, (startY + r * itemH) * scale, itemW * scale, itemH * scale);
                }
            }

            // Labels
            ctx.fillStyle = '#94a3b8';
            ctx.font = '10px Inter';
            ctx.fillText(`${sw} mm`, canvas.width / 2 - 15, canvas.height - 5);
            ctx.save();
            ctx.translate(10, canvas.height / 2 + 15);
            ctx.rotate(-Math.PI / 2);
            ctx.fillText(`${sh} mm`, 0, 0);
            ctx.restore();

            // Grain direction indicator (always in direction of height 'sh')
            ctx.strokeStyle = '#ef4444';
            ctx.setLineDash([8, 4]);
            ctx.lineWidth = 2;
            const grainX = canvas.width - 15;
            ctx.beginPath();
            ctx.moveTo(grainX, 20);
            ctx.lineTo(grainX, canvas.height - 20);
            ctx.stroke();
            ctx.setLineDash([]);

            // Arrowheads for grain direction
            ctx.fillStyle = '#ef4444';
            // Top arrow
            ctx.beginPath();
            ctx.moveTo(grainX, 10);
            ctx.lineTo(grainX - 4, 20);
            ctx.lineTo(grainX + 4, 20);
            ctx.fill();
            // Bottom arrow
            ctx.beginPath();
            ctx.moveTo(grainX, canvas.height - 10);
            ctx.lineTo(grainX - 4, canvas.height - 20);
            ctx.lineTo(grainX + 4, canvas.height - 20);
            ctx.fill();

            // Label for grain direction
            ctx.save();
            ctx.translate(grainX - 5, canvas.height / 3);
            ctx.rotate(-Math.PI / 2);
            ctx.textAlign = 'center';
            ctx.font = 'bold 9px Inter';
            ctx.fillText('SMER VLAKEN', 0, 0);
            ctx.restore();

            // Yield label
            ctx.fillStyle = '#34d399';
            ctx.font = 'bold 12px Inter';
            ctx.fillText(`Izkoristek: ${cols * rows}x`, 10, 20);
        }

        function drawMachineCanvas(sheetW, sheetH, layout, gripper, origW, origH, bleed, isOverride = false, currentCount = 0) {
            const canvas = document.getElementById('canvas-machine');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');

            const maxW = 600;
            const maxH = 400;
            const scale = Math.min(maxW / sheetW, maxH / sheetH);

            canvas.width = sheetW * scale;
            canvas.height = sheetH * scale;

            // 1. Draw Printing Sheet
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 2;
            ctx.strokeRect(0, 0, canvas.width, canvas.height);

            // Gripper
            ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
            ctx.font = 'bold 10px Inter, sans-serif';
            if (layout && layout.gripEdge === 'W') {
                ctx.fillRect(0, 0, gripper * scale, canvas.height);
                ctx.strokeStyle = '#f43f5e';
                ctx.beginPath();
                ctx.moveTo(gripper * scale, 0);
                ctx.lineTo(gripper * scale, canvas.height);
                ctx.stroke();

                // Label for W gripper
                ctx.save();
                ctx.fillStyle = '#f43f5e';
                ctx.translate(10, canvas.height / 2);
                ctx.rotate(-Math.PI / 2);
                ctx.textAlign = 'center';
                ctx.fillText(`Prijemalec: ${gripper} mm`, 0, 0);
                ctx.restore();
            } else {
                ctx.fillRect(0, (canvas.height - gripper * scale), canvas.width, gripper * scale);
                ctx.strokeStyle = '#f43f5e';
                ctx.beginPath();
                ctx.moveTo(0, canvas.height - gripper * scale);
                ctx.lineTo(canvas.width, canvas.height - gripper * scale);
                ctx.stroke();

                // Label for H gripper
                ctx.fillStyle = '#f43f5e';
                ctx.textAlign = 'center';
                ctx.fillText(`Prijemalec: ${gripper} mm`, canvas.width / 2, canvas.height - (gripper * scale) / 2 + 4);
            }

            // Sheet dimension labels (Moved up so they always draw)
            ctx.fillStyle = '#64748b';
            ctx.font = '11px Inter';
            ctx.fillText(`${sheetW} mm`, canvas.width / 2 - 20, canvas.height - 10);
            ctx.save();
            ctx.translate(15, canvas.height / 2 + 20);
            ctx.rotate(-Math.PI / 2);
            ctx.fillText(`${sheetH} mm`, 0, 0);
            ctx.restore();

            // Grain direction indicator - HIGH VISIBILITY BADGE
            const sw_v = parseFloat(document.getElementById('calc-source-w').value) || 1000;
            const sh_v = parseFloat(document.getElementById('calc-source-h').value) || 700;
            const y1_v = Math.floor(sw_v / sheetW) * Math.floor(sh_v / sheetH);
            const y2_v = Math.floor(sw_v / sheetH) * Math.floor(sh_v / sheetW);
            const isGrainV = y1_v >= y2_v;

            ctx.save();
            const midX = canvas.width / 3;
            const midY = canvas.height / 3;

            if (isGrainV) {
                // White shadow for contrast
                ctx.strokeStyle = 'rgba(255,255,255,0.8)';
                ctx.lineWidth = 4;
                ctx.beginPath(); ctx.moveTo(midX, 40); ctx.lineTo(midX, canvas.height - 40); ctx.stroke();

                // Main red dashed line
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 2;
                ctx.setLineDash([12, 6]);
                ctx.beginPath(); ctx.moveTo(midX, 40); ctx.lineTo(midX, canvas.height - 40); ctx.stroke();

                // Arrow heads
                ctx.setLineDash([]);
                ctx.fillStyle = '#ef4444';
                const drawArrV = (y, rot) => {
                    ctx.save();
                    ctx.translate(midX, y);
                    ctx.rotate(rot);
                    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-6, 12); ctx.lineTo(6, 12); ctx.fill();
                    ctx.restore();
                };
                drawArrV(25, 0);
                drawArrV(canvas.height - 25, Math.PI);

                // Text Badge
                ctx.save();
                ctx.translate(midX, midY);
                ctx.rotate(-Math.PI / 2);
                ctx.fillStyle = 'white';
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 1;
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(-45, -10, 90, 20, 10); else ctx.rect(-45, -10, 90, 20);
                ctx.fill(); ctx.stroke();
                ctx.fillStyle = '#ef4444';
                ctx.font = 'bold 10px Inter';
                ctx.textAlign = 'center';
                ctx.fillText('SMER VLAKEN', 0, 4);
                ctx.restore();
            } else {
                // White shadow
                ctx.strokeStyle = 'rgba(255,255,255,0.8)';
                ctx.lineWidth = 4;
                ctx.beginPath(); ctx.moveTo(40, midY); ctx.lineTo(canvas.width - 40, midY); ctx.stroke();

                // Main red dashed line
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 2;
                ctx.setLineDash([12, 6]);
                ctx.beginPath(); ctx.moveTo(40, midY); ctx.lineTo(canvas.width - 40, midY); ctx.stroke();

                // Arrow heads
                ctx.setLineDash([]);
                ctx.fillStyle = '#ef4444';
                const drawArrH = (x, rot) => {
                    ctx.save();
                    ctx.translate(x, midY);
                    ctx.rotate(rot);
                    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-6, 12); ctx.lineTo(6, 12); ctx.fill();
                    ctx.restore();
                };
                drawArrH(25, -Math.PI / 2);
                drawArrH(canvas.width - 25, Math.PI / 2);

                // Text Badge
                ctx.save();
                ctx.translate(midX, midY);
                ctx.fillStyle = 'white';
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 1;
                ctx.beginPath();
                if (ctx.roundRect) ctx.roundRect(-45, -10, 90, 20, 10); else ctx.rect(-45, -10, 90, 20);
                ctx.fill(); ctx.stroke();
                ctx.fillStyle = '#ef4444';
                ctx.font = 'bold 10px Inter';
                ctx.textAlign = 'center';
                ctx.fillText('SMER VLAKEN', 0, 4);
                ctx.restore();
            }
            ctx.restore();

            // Prikaz opozorila za ročni vnos (namesto roza barve)
            if (isOverride) {
                // Glow obroba
                ctx.strokeStyle = '#3b82f6';
                ctx.lineWidth = 4;
                ctx.strokeRect(0, 0, canvas.width, canvas.height);

                // Elegantna značka (Glassmorphism effect)
                ctx.save();
                ctx.fillStyle = 'rgba(59, 130, 246, 0.9)';
                ctx.shadowBlur = 10;
                ctx.shadowColor = 'rgba(0,0,0,0.5)';
                const badgeWidth = 120;
                const badgeHeight = 24;
                const bx = (canvas.width - badgeWidth) / 2;
                const by = 10;

                // Narišemo zaobljen pravokotnik
                ctx.beginPath();
                ctx.roundRect(bx, by, badgeWidth, badgeHeight, 6);
                ctx.fill();

                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 10px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('ROČNI VNOS', canvas.width / 2, by + 15);
                ctx.restore();
                ctx.textAlign = 'left';
            }



            if (!layout) return;

            // Grid
            const offsetX = layout.gripEdge === 'W' ? gripper : 0;
            const usableW = layout.gripEdge === 'W' ? sheetW - gripper : sheetW;
            const usableH = layout.gripEdge === 'H' ? sheetH - gripper : sheetH;

            const targetCount = currentCount || layout.count;

            // Simplified grid calculation for drawing
            let usedCols = layout.cols;
            let usedRows = layout.rows;

            // If we are drawing fewer items than the full grid, try to balance them
            if (!layout.isMixed && targetCount < (layout.cols * layout.rows)) {
                for (let tempC = 1; tempC <= layout.cols; tempC++) {
                    let tempR = Math.ceil(targetCount / tempC);
                    if (tempR <= layout.rows) {
                        usedCols = tempC;
                        usedRows = tempR;
                        // For better visualization, try to keep it square-ish
                        if (tempC >= tempR) break;
                    }
                }
            }

            let gridH = usedRows * layout.itemH;
            let gridW = usedCols * layout.itemW;

            // Če je mešana postavitev, prilagodimo skupno širino in višino glede na dodatne rotirane kose
            if (layout.isMixed && !isObratChecked && targetCount > (layout.cols * layout.rows)) {
                let remW = usableW - (layout.cols * layout.itemW);
                let remH = usableH - (layout.rows * layout.itemH);

                if (remW >= layout.itemH) { // Rotirani kosi desno
                    let addCols = Math.floor(remW / layout.itemH);
                    let addRows = Math.floor(usableH / layout.itemW);
                    gridW = (layout.cols * layout.itemW) + (addCols * layout.itemH);
                    gridH = Math.max(layout.rows * layout.itemH, addRows * layout.itemW);
                } else if (remH >= layout.itemW) { // Rotirani kosi spodaj
                    let addRows = Math.floor(remH / layout.itemW);
                    let addCols = Math.floor(usableW / layout.itemH);
                    gridW = Math.max(layout.cols * layout.itemW, addCols * layout.itemH);
                    gridH = (layout.rows * layout.itemH) + (addRows * layout.itemW);
                }
            }

            // Izračun simetričnih odmikov (startX, startY) na celotni poli
            let startX, startY;
            if (layout.gripEdge === 'W') {
                // Če je prijemalec na levi (W), poskusimo centrirati simetrično na celo polo
                const idealMargin = (sheetW - gridW) / 2;
                if (idealMargin >= gripper) {
                    startX = idealMargin;
                } else {
                    // Če ni dovolj prostora za idealno centriranje, potisnemo tik za prijemalec
                    startX = gripper;
                }
                startY = (usableH - gridH) / 2;
            } else { // gripEdge === 'H' (prijemalec na dnu)
                startX = (usableW - gridW) / 2;
                // Če je prijemalec na dnu, mora biti spodnji rob vsaj velikosti gripper
                const idealMargin = (sheetH - gridH) / 2;
                if (idealMargin >= gripper) {
                    startY = idealMargin;
                } else {
                    // Če ni dovolj prostora, potisnemo čim višje, da spodaj ostane prostora za prijemalec
                    startY = Math.min(idealMargin, sheetH - gridH - gripper);
                    if (startY < 0) startY = 0;
                }
            }

            let slotsToDraw = [];
            let itemsToDraw = targetCount;

            function drawOneItem(ctx, x, y, iw, ih, innerW, innerH, b, sc) {
                ctx.fillStyle = 'rgba(96, 165, 250, 0.3)';
                ctx.strokeStyle = '#3b82f6';
                ctx.lineWidth = 1;
                ctx.fillRect(x, y, iw * sc, ih * sc);
                ctx.strokeRect(x, y, iw * sc, ih * sc);

                ctx.setLineDash([2, 3]);
                ctx.strokeStyle = '#1e3a8a';
                ctx.strokeRect(x + (b * sc), y + (b * sc), innerW * sc, innerH * sc);
                ctx.setLineDash([]);

                ctx.fillStyle = '#1e3a8a';
                ctx.font = 'bold 9px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const dimLabel = `${Math.round(innerW)}x${Math.round(innerH)}`;
                if (iw * sc > 30 && ih * sc > 15) {
                    ctx.fillText(dimLabel, x + (iw * sc) / 2, y + (ih * sc) / 2);
                }
            }

            const isObratChecked = document.getElementById('calc-is-obrat') ? document.getElementById('calc-is-obrat').checked : false;

            if (isObratChecked) {
                let midC = Math.floor(usedCols / 2);
                let hasCenter = usedCols % 2 !== 0;
                for (let r = 0; r < usedRows; r++) {
                    for (let c = midC - 1; c >= 0; c--) {
                        slotsToDraw.push({ c: c, r: r });
                        slotsToDraw.push({ c: usedCols - 1 - c, r: r });
                    }
                }
                if (hasCenter) {
                    for (let r = 0; r < usedRows; r++) {
                        slotsToDraw.push({ c: midC, r: r });
                    }
                }
                slotsToDraw = slotsToDraw.slice(0, itemsToDraw);
            } else {
                let tempCount = 0;
                let rowsToFill = layout.isMixed ? layout.rows : usedRows;
                let colsToFill = layout.isMixed ? layout.cols : usedCols;
                for (let r = 0; r < rowsToFill && tempCount < itemsToDraw; r++) {
                    for (let c = 0; c < colsToFill && tempCount < itemsToDraw; c++) {
                        slotsToDraw.push({ c: c, r: r });
                        tempCount++;
                    }
                }
            }

            slotsToDraw.forEach(slot => {
                const x = (startX + slot.c * layout.itemW) * scale;
                const y = (startY + slot.r * layout.itemH) * scale;
                const innerW = (layout.rot ? origH : origW);
                const innerH = (layout.rot ? origW : origH);
                drawOneItem(ctx, x, y, layout.itemW, layout.itemH, innerW, innerH, bleed, scale);
            });

            // Mešana postavitev (Mixed) - nariši preostale kose
            let drawnSoFar = slotsToDraw.length;
            if (layout.isMixed && drawnSoFar < itemsToDraw && !isObratChecked) {
                // Preveri kje je več prostora za ostale kose (desno ali spodaj)
                let remW = usableW - (layout.cols * layout.itemW);
                let remH = usableH - (layout.rows * layout.itemH);

                if (remW >= layout.itemH) { // Rotirani kosi desno
                    let addCols = Math.floor(remW / layout.itemH);
                    let addRows = Math.floor(usableH / layout.itemW);
                    for (let r = 0; r < addRows && drawnSoFar < itemsToDraw; r++) {
                        for (let c = 0; c < addCols && drawnSoFar < itemsToDraw; c++) {
                            const x = (startX + (layout.cols * layout.itemW) + c * layout.itemH) * scale;
                            const y = (startY + r * layout.itemW) * scale;
                            drawOneItem(ctx, x, y, layout.itemH, layout.itemW, (layout.rot ? origW : origH), (layout.rot ? origH : origW), bleed, scale);
                            drawnSoFar++;
                        }
                    }
                } else if (remH >= layout.itemW) { // Rotirani kosi spodaj
                    let addRows = Math.floor(remH / layout.itemW);
                    let addCols = Math.floor(usableW / layout.itemH);
                    for (let r = 0; r < addRows && drawnSoFar < itemsToDraw; r++) {
                        for (let c = 0; c < addCols && drawnSoFar < itemsToDraw; c++) {
                            const x = (startX + c * layout.itemH) * scale;
                            const y = (startY + (layout.rows * layout.itemH) + r * layout.itemW) * scale;
                            drawOneItem(ctx, x, y, layout.itemH, layout.itemW, (layout.rot ? origW : origH), (layout.rot ? origH : origW), bleed, scale);
                            drawnSoFar++;
                        }
                    }
                }
            }
        }

        // INITIAL CALLS ON LOAD (MOVED TO BOTTOM)


        // --- KONSTANTE IN SHRANJEVANJE ---
        var STORAGE_KEY = 'tisk_kalkulator_arhiv';

        // --- CUSTOMER LOGIC (Ultra-Safe) ---
        var lastSearch = "";

        function toggleEmailDropdown() {
            var list = document.getElementById('email-dropdown-list');
            if (list.style.display === 'block') {
                list.style.display = 'none';
            } else {
                renderEmailList();
                list.style.display = 'block';
            }
        }

        function renderEmailList() {
            var listDiv = document.getElementById('email-dropdown-list');
            if (!listDiv) return;
            listDiv.innerHTML = "";

            var datalist = document.getElementById('email-list');
            if (!datalist || datalist.options.length === 0) {
                listDiv.innerHTML = '<div style="padding: 10px; color: #94a3b8; font-size: 0.8rem;">Ni shranjenih e-mailov.</div>';
                return;
            }

            for (var i = 0; i < datalist.options.length; i++) {
                var em = datalist.options[i].value;
                var item = document.createElement('div');
                item.style.padding = "8px 12px";
                item.style.cursor = "pointer";
                item.style.borderBottom = "1px solid #334155";
                item.style.fontSize = "0.9rem";
                item.innerText = em;
                item.onclick = (function (emailVal) {
                    return function () {
                        document.getElementById('calc-cust-email').value = emailVal;
                        document.getElementById('email-dropdown-list').style.display = 'none';
                    };
                })(em);

                item.onmouseover = function () { this.style.background = "#334155"; };
                item.onmouseout = function () { this.style.background = "transparent"; };
                listDiv.appendChild(item);
            }
        }

        function toggleCustomerDropdown() {
            var list = document.getElementById('cust-dropdown-list');
            if (list.style.display === 'block') {
                list.style.display = 'none';
            } else {
                renderCustomerList();
                list.style.display = 'block';
            }
        }

        function renderCustomerList() {
            try {
                var raw = localStorage.getItem(STORAGE_KEY);
                var arhiv = [];
                if (raw) arhiv = JSON.parse(raw);
                if (!Array.isArray(arhiv)) arhiv = [];

                var customers = [];
                for (var i = 0; i < arhiv.length; i++) {
                    var p = arhiv[i];
                    if (p && p.customer) {
                        var c = p.customer.trim();
                        if (c && customers.indexOf(c) === -1) {
                            customers.push(c);
                        }
                    }
                }
                customers.sort();

                var listDiv = document.getElementById('cust-dropdown-list');
                if (!listDiv) return;
                listDiv.innerHTML = "";

                if (customers.length === 0) {
                    listDiv.innerHTML = '<div style="padding: 10px; color: #94a3b8; font-size: 0.8rem;">Arhiv strank je prazen.</div>';
                    return;
                }

                for (var j = 0; j < customers.length; j++) {
                    var item = document.createElement('div');
                    item.style.padding = "8px 12px";
                    item.style.cursor = "pointer";
                    item.style.borderBottom = "1px solid #334155";
                    item.style.fontSize = "0.9rem";
                    item.innerText = customers[j];
                    item.onclick = (function (name) {
                        return function () {
                            document.getElementById('calc-customer').value = name;
                            document.getElementById('cust-dropdown-list').style.display = 'none';
                            handleCustomerUpdate(name);
                        };
                    })(customers[j]);

                    item.onmouseover = function () { this.style.background = "#334155"; };
                    item.onmouseout = function () { this.style.background = "transparent"; };
                    listDiv.appendChild(item);
                }
            } catch (e) { logDebug("Napaka renderCustomerList: " + e.message, true); }
        }

        function updateCustomerDatalist() {
            try {
                var raw = localStorage.getItem(STORAGE_KEY);
                var arhiv = [];
                if (raw) arhiv = JSON.parse(raw);
                if (!Array.isArray(arhiv)) arhiv = [];

                var customers = [];
                for (var i = 0; i < arhiv.length; i++) {
                    var p = arhiv[i];
                    if (p && p.customer) {
                        var c = p.customer.trim();
                        if (c && customers.indexOf(c) === -1) {
                            customers.push(c);
                        }
                    }
                }
                customers.sort();

                // 1. Posodobi standardni datalist
                var dl = document.getElementById('customer-list');
                if (dl) {
                    dl.innerHTML = "";
                    for (var j = 0; j < customers.length; j++) {
                        var opt = document.createElement('option');
                        opt.value = customers[j];
                        dl.appendChild(opt);
                    }
                }

                // 2. Posodobi naš novi dropdown (če je odprt)
                renderCustomerList();

                logDebug("Arhiv posodobljen (" + customers.length + " strank).");
            } catch (e) { logDebug("Napaka updateCustomerDatalist: " + e.message, true); }
        }

        function handleCustomerUpdate(val) {
            try {
                if (!val) return;
                var search = val.trim().toLowerCase();
                if (!search) return;

                logDebug("Iščem šifro za: " + search);
                var raw = localStorage.getItem(STORAGE_KEY);
                var arhiv = [];
                if (raw) arhiv = JSON.parse(raw);
                if (!Array.isArray(arhiv)) return;

                var foundMaterialCode = false;
                var uniqueEmails = new Set();

                // Iščemo od ZAČETKA (index 0)
                for (var i = 0; i < arhiv.length; i++) {
                    var p = arhiv[i];
                    if (p && p.customer && p.customer.trim().toLowerCase() === search) {
                        // 1. Zbiranje e-mailov
                        if (p.custEmail && p.custEmail.trim() !== "") {
                            uniqueEmails.add(p.custEmail.trim());
                        }

                        // 2. Avtomatsko izpolnjevanje šifre
                        if (!foundMaterialCode && p.materialCode && p.materialCode.trim().length > 1) {
                            var target = document.getElementById('calc-material-code');
                            if (target && (!target.value || target.value.trim() === "" || target.value.indexOf("npr.") !== -1)) {
                                target.value = p.materialCode;
                                logDebug("AVTOMATIKA: Dodeljena PRVA najdena šifra " + p.materialCode);
                                foundMaterialCode = true;
                            }
                        }
                    }
                }

                // Posodobi spustni seznam za e-maile in avtomatsko izpolni, če je samo en
                var emailTarget = document.getElementById('calc-cust-email');
                var emailDatalist = document.getElementById('email-list');
                if (emailTarget && emailDatalist) {
                    emailDatalist.innerHTML = "";
                    var emailsArray = Array.from(uniqueEmails);

                    emailsArray.forEach(function (em) {
                        var opt = document.createElement('option');
                        opt.value = em;
                        emailDatalist.appendChild(opt);
                    });

                    // Če je izključno en e-mail v zgodovini in je polje prazno, ga avtomatsko izpolni
                    if (emailsArray.length === 1 && (!emailTarget.value || emailTarget.value.trim() === "")) {
                        emailTarget.value = emailsArray[0];
                        logDebug("AVTOMATIKA: Dodeljen edini najdeni e-mail " + emailsArray[0]);
                    }
                }
            } catch (e) { logDebug("Napaka v handleCustomerUpdate: " + e.message, true); }
        }

        // Attach events safely
        try {
            var custInput = document.getElementById('calc-customer');
            if (custInput) {
                custInput.addEventListener('input', function (e) { handleCustomerUpdate(e.target.value); });
                custInput.addEventListener('change', function (e) { handleCustomerUpdate(e.target.value); });
                custInput.addEventListener('blur', function (e) { handleCustomerUpdate(e.target.value); });
            }
        } catch (e) { logDebug("Napaka pri povezovanju dogodkov: " + e.message, true); }

        function saveCurrentProject(btn = null) {
            try {
                let name = document.getElementById('calc-project-name').value.trim();
                if (!name) {
                    alert("Prosimo vnesite izdelek (polje 'Vnesite izdelek' zgoraj levo)!");
                    return;
                }

                function gv(id) { var el = document.getElementById(id); return el ? el.value : ''; }
                function gc(id) { var el = document.getElementById(id); return el ? el.checked : false; }

                const data = {
                    id: Date.now(),
                    name: name,
                    _source: 'pola',
                    date: new Date().toLocaleString('sl-SI'),
                    customer: gv('calc-customer'),
                    custAddress: gv('calc-cust-address'),
                    deliveryAddress: gv('calc-delivery-address'),
                    custEmail: gv('calc-cust-email'),
                    custId: gv('calc-cust-id'),
                    quoteNum: gv('calc-quote-number'),
                    dnNumber: gv('calc-dn-number'),
                    dnOld: gv('calc-dn-old'),
                    dnDeadline: gv('calc-dn-deadline'),
                    dnPackaging: gv('calc-dn-packaging'),
                    customerCode: gv('calc-customer-code'),
                    preparedBy: gv('calc-prepared-by'),
                    materialCode: gv('calc-material-code'),
                    notes: gv('calc-notes'),
                    editedQuoteHTML: g_editedQuoteHTML,
                    editedWorkOrderHTML: g_editedWorkOrderHTML,
                    inputs: {
                        machine_format: gv('machine-format'),
                        item_w: gv('width'),
                        item_h: gv('height'),
                        quantity: gv('quantity'),
                        bleed: gv('bleed'),
                        pPrice: gv('calc-paper-price'),
                        pUnit: gv('calc-paper-unit'),
                        pWeight: gv('calc-paper-weight'),
                        pType: gv('calc-paper-type'),
                        pWaste: gv('calc-paper-waste'),
                        platesPrice: gv('calc-plates-price'),
                        prepPrice: gv('calc-prep-price'),
                        changePrice: gv('calc-change-price'),
                        machineType: gv('calc-machine-type'),
                        machineRate: gv('calc-machine-rate'),
                        machineSpeed: gv('calc-machine-speed'),
                        machinePrepTime: gv('calc-machine-prep-time'),
                        colorFront: gv('calc-color-front'),
                        colorBack: gv('calc-color-back'),
                        isObrat: gc('calc-is-obrat'),
                        commercial: gv('calc-commercial'),
                        margin: gv('calc-margin'),
                        itemsPerSheet: gv('items-per-sheet'),
                        itemOrientation: gv('item-orientation'),
                        minusPrice: gc('calc-minus-price'),
                        sourceW: gv('calc-source-w'),
                        sourceH: gv('calc-source-h'),
                        finish: {
                            cilinder: { active: gc('f-cilinder-active'), prep: gv('f-cilinder-prep'), rate: gv('f-cilinder-rate') },
                            zgibanje: { active: gc('f-zgibanje-active'), folds: gv('f-zgibanje-folds'), speed: gv('f-zgibanje-speed') },
                            razrezFormat: { active: gc('f-razrez-format-active'), speed: gv('f-razrez-format-speed'), rate: gv('f-razrez-format-rate') },
                            extra: { active: gc('f-extra-active'), speed: gv('f-extra-speed'), rate: gv('f-extra-rate') },
                            tool: { active: gc('f-tool-active'), cost: gv('f-tool-cost') },
                            deliveryFixed: { active: gc('f-del-fixed-active'), price: gv('f-del-fixed-price') },
                            dodatek: { sheets: gv('f-dodatek-sheets') }
                        }
                    },
                    results: {
                        total: (document.getElementById('res-price-total') || {}).innerText || '',
                        perItem: (document.getElementById('res-price-per-item-stat-final') || {}).innerText || '',
                        sheets: (document.getElementById('res-sheets-needed') || {}).innerText || ''
                    }
                };

                let arhiv = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
                arhiv.push(data);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(arhiv));

                renderSavedProjects();
                updateCustomerDatalist();

                if (btn) {
                    const oldHTML = btn.innerHTML;
                    btn.innerHTML = "✅ SHRANJENO";
                    btn.style.background = "#10b981";
                    setTimeout(() => {
                        btn.innerHTML = oldHTML;
                        btn.style.background = "#8b5cf6";
                    }, 2000);
                } else {
                    alert("Projekt '" + name + "' uspešno shranjen v arhiv!");
                }
            } catch (err) {
                alert("Napaka pri shranjevanju: " + err.message);
                console.error("saveCurrentProject error:", err);
            }
        }

        async function saveProjectToFile() {
            try {
                let name = document.getElementById('calc-project-name').value.trim() || "Ponudba";
                function gv(id) { var el = document.getElementById(id); return el ? el.value : ''; }
                function gc(id) { var el = document.getElementById(id); return el ? el.checked : false; }

                const data = {
                    name: name,
                    _source: 'pola',
                    date: new Date().toLocaleString('sl-SI'),
                    customer: gv('calc-customer'),
                    custAddress: gv('calc-cust-address'),
                    deliveryAddress: gv('calc-delivery-address'),
                    custEmail: gv('calc-cust-email'),
                    custId: gv('calc-cust-id'),
                    quoteNum: gv('calc-quote-number'),
                    dnNumber: gv('calc-dn-number'),
                    dnOld: gv('calc-dn-old'),
                    dnDeadline: gv('calc-dn-deadline'),
                    dnPackaging: gv('calc-dn-packaging'),
                    customerCode: gv('calc-customer-code'),
                    preparedBy: gv('calc-prepared-by'),
                    materialCode: gv('calc-material-code'),
                    notes: gv('calc-notes'),
                    editedQuoteHTML: g_editedQuoteHTML,
                    editedWorkOrderHTML: g_editedWorkOrderHTML,
                    inputs: {
                        machine_format: gv('machine-format'),
                        item_w: gv('width'),
                        item_h: gv('height'),
                        quantity: gv('quantity'),
                        bleed: gv('bleed'),
                        pPrice: gv('calc-paper-price'),
                        pUnit: gv('calc-paper-unit'),
                        pWeight: gv('calc-paper-weight'),
                        pType: gv('calc-paper-type'),
                        pWaste: gv('calc-paper-waste'),
                        platesPrice: gv('calc-plates-price'),
                        prepPrice: gv('calc-prep-price'),
                        changePrice: gv('calc-change-price'),
                        machineType: gv('calc-machine-type'),
                        machineRate: gv('calc-machine-rate'),
                        machineSpeed: gv('calc-machine-speed'),
                        machinePrepTime: gv('calc-machine-prep-time'),
                        colorFront: gv('calc-color-front'),
                        colorBack: gv('calc-color-back'),
                        isObrat: gc('calc-is-obrat'),
                        commercial: gv('calc-commercial'),
                        margin: gv('calc-margin'),
                        itemsPerSheet: gv('items-per-sheet'),
                        itemOrientation: gv('item-orientation'),
                        minusPrice: gc('calc-minus-price'),
                        sourceW: gv('calc-source-w'),
                        sourceH: gv('calc-source-h'),
                        finish: {
                            cilinder: { active: gc('f-cilinder-active'), prep: gv('f-cilinder-prep'), rate: gv('f-cilinder-rate') },
                            zgibanje: { active: gc('f-zgibanje-active'), folds: gv('f-zgibanje-folds'), speed: gv('f-zgibanje-speed') },
                            razrezFormat: { active: gc('f-razrez-format-active'), speed: gv('f-razrez-format-speed'), rate: gv('f-razrez-format-rate') },
                            extra: { active: gc('f-extra-active'), speed: gv('f-extra-speed'), rate: gv('f-extra-rate') },
                            tool: { active: gc('f-tool-active'), cost: gv('f-tool-cost') },
                            deliveryFixed: { active: gc('f-del-fixed-active'), price: gv('f-del-fixed-price') }
                        }
                    },
                    results: {
                        total: (document.getElementById('res-price-total') || {}).innerText || '',
                        perItem: (document.getElementById('res-price-per-item-stat-final') || {}).innerText || '',
                        sheets: (document.getElementById('res-sheets-needed') || {}).innerText || ''
                    }
                };

                const jsonStr = JSON.stringify(data, null, 2);
                const suggestedName = name.replace(/\s+/g, '_') + '.pola.json';

                if (window.showSaveFilePicker) {
                    try {
                        const handle = await window.showSaveFilePicker({
                            suggestedName: suggestedName,
                            types: [{ description: 'Pola JSON', accept: { 'application/json': ['.json'] } }],
                        });
                        const writable = await handle.createWritable();
                        await writable.write(jsonStr);
                        await writable.close();
                        return;
                    } catch (e) { if (e.name === 'AbortError') return; }
                }

                const blob = new Blob([jsonStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = suggestedName;
                document.body.appendChild(a); a.click();
                setTimeout(() => { document.body.removeChild(a); window.URL.revokeObjectURL(url); }, 100);
            } catch (err) { alert("Napaka pri shranjevanju: " + err.message); }
        }

        var g_projectsDirHandle = null;
        var g_diskProjects = [];

        async function syncWithFolder() {
            try {
                g_projectsDirHandle = await window.showDirectoryPicker();
                await refreshDiskProjects();
                renderSavedProjects();
                alert("Mapa uspešno povezana!");
            } catch (err) {
                if (err.name !== 'AbortError') alert("Napaka: " + err.message);
            }
        }

        async function refreshDiskProjects() {
            if (!g_projectsDirHandle) return;
            g_diskProjects = [];
            try {
                for await (const entry of g_projectsDirHandle.values()) {
                    if (entry.kind === 'file' && entry.name.endsWith('.json')) {
                        g_diskProjects.push(entry);
                    }
                }
            } catch (err) { console.error(err); }
        }

        async function loadProjectFromDisk(fileName) {
            const entry = g_diskProjects.find(e => e.name === fileName);
            if (!entry) return;
            try {
                const file = await entry.getFile();
                const content = await file.text();
                const data = JSON.parse(content);
                loadProjectData(data);
                alert("Datoteka '" + fileName + "' naložena!");
            } catch (err) { alert("Napaka: " + err.message); }
        }

        function handleFileSelect(event) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function (e) {
                try {
                    const data = JSON.parse(e.target.result);
                    loadProjectData(data);
                    alert("Projekt uspešno uvožen!");
                } catch (err) { alert("Napaka pri branju datoteke: " + err.message); }
            };
            reader.readAsText(file);
        }

        function renderSavedProjects() {
            const listContent = document.getElementById('projects-list-content');
            if (!listContent) return;

            const searchInput = document.getElementById('project-search-input');
            const filter = searchInput ? searchInput.value.toLowerCase().trim() : "";

            let arhiv = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            let html = "";

            // 1. DODAJ DATOTEKE Z DISKA
            if (g_diskProjects.length > 0) {
                html += '<div style="padding: 5px 12px; background: rgba(16, 185, 129, 0.1); color: #10b981; font-size: 0.7rem; font-weight: bold; border-bottom: 1px solid rgba(16, 185, 129, 0.2);">📁 DATOTEKE NA DISKU</div>';
                let diskFiltered = g_diskProjects;
                if (filter) diskFiltered = g_diskProjects.filter(e => e.name.toLowerCase().includes(filter));
                diskFiltered.forEach(entry => {
                    html += `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; border-bottom: 1px solid #334155; transition: background 0.2s;" class="project-item-row" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">
                            <div style="cursor: pointer; flex: 1; min-width: 0;" onclick="loadProjectFromDisk('${entry.name}'); toggleProjectsDropdown();">
                                <div style="font-weight: bold; color: #10b981; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.85rem;">
                                    📄 ${entry.name}
                                </div>
                                <div style="font-size: 0.7rem; color: #94a3b8; margin-top: 2px;">Lokalna datoteka</div>
                            </div>
                        </div>`;
                });
            }

            // 2. DODAJ ARHIV
            let filtered = arhiv;
            if (filter) {
                filtered = arhiv.filter(proj => {
                    const name = (proj.name || "").toLowerCase();
                    const customer = (proj.customer || "").toLowerCase();
                    const code = (proj.materialCode || "").toLowerCase();
                    return name.includes(filter) || customer.includes(filter) || code.includes(filter);
                });
            }
            filtered.sort((a, b) => b.id - a.id);

            if (filtered.length > 0) {
                html += '<div style="padding: 5px 12px; background: rgba(59, 130, 246, 0.1); color: #60a5fa; font-size: 0.7rem; font-weight: bold; border-bottom: 1px solid rgba(59, 130, 246, 0.2);">⭐ ARHIV (Baza)</div>';
                filtered.forEach(proj => {
                    const codeDisplay = proj.materialCode ? `<span style="color:#60a5fa; margin-left:5px;">[${proj.materialCode}]</span>` : "";
                    const custDisplay = proj.customer ? `<div style="font-size: 0.7rem; color: #6ee7b7;">${proj.customer}</div>` : "";
                    html += `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; border-bottom: 1px solid #334155; transition: background 0.2s;" class="project-item-row" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">
                            <div style="cursor: pointer; flex: 1; min-width: 0;" onclick="loadProject(${proj.id}); toggleProjectsDropdown();">
                                <div style="font-weight: bold; color: #f8fafc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.85rem;">
                                    ${proj.name} ${codeDisplay}
                                </div>
                                ${custDisplay}
                                <div style="font-size: 0.7rem; color: #94a3b8; margin-top: 2px;">${proj.date} | ${proj.results ? proj.results.total : '-'}</div>
                            </div>
                            <div style="display: flex; gap: 6px; margin-left: 10px;">
                                 <button onclick="exportSingleProject(${proj.id}); event.stopPropagation();" style="background: none; border: none; color: #3b82f6; cursor: pointer; padding: 4px; font-size: 0.9rem;" title="Izvozi">📥</button>
                                 <button onclick="deleteProject(${proj.id}); event.stopPropagation();" style="background: none; border: none; color: #ef4444; cursor: pointer; padding: 4px; font-size: 1rem;" title="Briši">✕</button>
                            </div>
                        </div>`;
                });
            }

            if (html === "") {
                let msg = 'Arhiv je prazen.';
                if (!g_projectsDirHandle) {
                    msg = '<div style="color:#10b981; font-weight:bold; margin-bottom:10px;">Mapa ni povezana!</div>Kliknite zgornji gumb <br><b style="color:#10b981;">📂 POVEŽI Z MAPO</b><br>da vidite datoteke na disku.';
                } else {
                    msg = 'V mapi ni bilo najdenih projektov.';
                }
                listContent.innerHTML = '<div style="padding: 20px; text-align: center; color: #94a3b8; font-size: 0.8rem; line-height:1.4;">' + msg + '</div>';
            } else {
                listContent.innerHTML = html;
            }
        }

        async function toggleProjectsDropdown() {
            const list = document.getElementById('projects-dropdown-list');
            if (list.style.display === 'block') {
                list.style.display = 'none';
            } else {
                if (!g_projectsDirHandle) {
                    try {
                        const handle = await getHandleFromIndexedDB('pola_dir_handle');
                        if (handle) {
                            if ((await handle.queryPermission({ mode: 'readwrite' })) === 'granted') {
                                g_projectsDirHandle = handle;
                            } else if ((await handle.requestPermission({ mode: 'readwrite' })) === 'granted') {
                                g_projectsDirHandle = handle;
                            }
                        }
                    } catch (e) { console.error("IndexedDB error:", e); }
                }

                if (g_projectsDirHandle) await refreshDiskProjects();
                renderSavedProjects();
                list.style.display = 'block';
                // Zapri customer dropdown če je odprt
                const clist = document.getElementById('cust-dropdown-list');
                if (clist) clist.style.display = 'none';
            }
        }

        // Pomožna funkcija za izvoz enega projekta iz arhiva
        function exportSingleProject(id) {
            let arhiv = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            let proj = arhiv.find(p => p.id === id);
            if (!proj) return;

            const jsonStr = JSON.stringify(proj, null, 2);
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = proj.name.replace(/\s+/g, '_') + '.tiskovna-pola-kalkulator.json';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => { document.body.removeChild(a); window.URL.revokeObjectURL(url); }, 100);
        }

        // Pomožna funkcija za nalaganje podatkov v polja (skupna za Arhiv in File Import)
        function loadProjectData(proj) {
            if (!proj || !proj.inputs) return;
            g_editedQuoteHTML = proj.editedQuoteHTML || '';
            g_editedWorkOrderHTML = proj.editedWorkOrderHTML || '';
            const inp = proj.inputs;

            document.getElementById('calc-customer').value = proj.customer || "";
            document.getElementById('calc-cust-address').value = proj.custAddress || "";
            if (document.getElementById('calc-delivery-address')) {
                document.getElementById('calc-delivery-address').value = proj.deliveryAddress || "";
            }
            document.getElementById('calc-cust-email').value = proj.custEmail || "";
            if (document.getElementById('calc-mut-type')) {
                document.getElementById('calc-mut-type').value = proj.mutType || "";
                document.getElementById('calc-mut-plates').value = proj.mutPlates || 0;
            }
            document.getElementById('calc-cust-id').value = proj.custId || "";
            document.getElementById('calc-quote-number').value = proj.quoteNum || "";
            if (document.getElementById('calc-dn-number')) document.getElementById('calc-dn-number').value = proj.dnNumber || "";
            if (document.getElementById('calc-dn-old')) document.getElementById('calc-dn-old').value = proj.dnOld || "";
            if (document.getElementById('calc-dn-deadline')) document.getElementById('calc-dn-deadline').value = proj.dnDeadline || "";
            if (document.getElementById('calc-dn-packaging')) document.getElementById('calc-dn-packaging').value = proj.dnPackaging || "";
            document.getElementById('calc-customer-code').value = proj.customerCode || "";
            if (proj.preparedBy) document.getElementById('calc-prepared-by').value = proj.preparedBy;
            document.getElementById('calc-material-code').value = proj.materialCode || "";
            if (document.getElementById('calc-notes')) {
                document.getElementById('calc-notes').value = proj.notes || "";
            }

            document.getElementById('machine-format').value = inp.machine_format;
            document.getElementById('width').value = inp.item_w;
            document.getElementById('height').value = inp.item_h;
            document.getElementById('quantity').value = inp.quantity;
            document.getElementById('bleed').value = inp.bleed;
            document.getElementById('calc-paper-price').value = inp.pPrice;
            document.getElementById('calc-paper-unit').value = inp.pUnit;
            document.getElementById('calc-paper-weight').value = inp.pWeight;
            if (inp.pType !== undefined) document.getElementById('calc-paper-type').value = inp.pType;
            document.getElementById('calc-paper-waste').value = inp.pWaste;
            document.getElementById('calc-plates-price').value = inp.platesPrice;
            document.getElementById('calc-prep-price').value = inp.prepPrice;
            document.getElementById('calc-change-price').value = inp.changePrice;
            document.getElementById('calc-machine-type').value = inp.machineType;
            document.getElementById('calc-machine-rate').value = inp.machineRate;
            document.getElementById('calc-machine-speed').value = inp.machineSpeed;
            if (inp.machinePrepTime !== undefined) document.getElementById('calc-machine-prep-time').value = inp.machinePrepTime;
            document.getElementById('calc-color-front').value = inp.colorFront;
            document.getElementById('calc-color-back').value = inp.colorBack;
            document.getElementById('calc-is-obrat').checked = inp.isObrat;
            if (document.getElementById('calc-commercial')) document.getElementById('calc-commercial').value = inp.commercial || 10;
            if (document.getElementById('calc-margin')) document.getElementById('calc-margin').value = inp.margin || 0;
            if (inp.itemsPerSheet !== undefined) document.getElementById('items-per-sheet').value = inp.itemsPerSheet;
            if (inp.itemOrientation !== undefined) document.getElementById('item-orientation').value = inp.itemOrientation;
            if (document.getElementById('calc-minus-price')) document.getElementById('calc-minus-price').checked = inp.minusPrice || false;
            if (inp.sourceW !== undefined) document.getElementById('calc-source-w').value = inp.sourceW;
            if (inp.sourceH !== undefined) document.getElementById('calc-source-h').value = inp.sourceH;

            // Load Finishing
            if (inp.finish) {
                const f = inp.finish;
                if (f.cilinder) {
                    document.getElementById('f-cilinder-active').checked = f.cilinder.active;
                    document.getElementById('f-cilinder-prep').value = f.cilinder.prep;
                    document.getElementById('f-cilinder-rate').value = f.cilinder.rate;
                    toggleFinishRow('cilinder');
                }
                if (f.zgibanje) {
                    document.getElementById('f-zgibanje-active').checked = f.zgibanje.active;
                    document.getElementById('f-zgibanje-folds').value = f.zgibanje.folds;
                    document.getElementById('f-zgibanje-speed').value = f.zgibanje.speed;
                    toggleFinishRow('zgibanje');
                }
                
                if (f.razrezFormat) {
                    document.getElementById('f-razrez-format-active').checked = f.razrezFormat.active;
                    document.getElementById('f-razrez-format-speed').value = f.razrezFormat.speed || 5800;
                    document.getElementById('f-razrez-format-rate').value = f.razrezFormat.rate || 20.00;
                    toggleFinishRow('razrez-format');
                }
                
                
                
                if (f.extra) {
                    document.getElementById('f-extra-active').checked = f.extra.active;
                    if (f.extra.speed) document.getElementById('f-extra-speed').value = f.extra.speed;
                    if (f.extra.rate) document.getElementById('f-extra-rate').value = f.extra.rate;
                    toggleFinishRow('extra');
                }
                if (f.precut) {
                    if (document.getElementById('f-precut-active')) document.getElementById('f-precut-active').checked = f.precut.active;
                    if (document.getElementById('f-precut-prep')) document.getElementById('f-precut-prep').value = f.precut.prep || 2.50;
                    if (document.getElementById('f-precut-per1000')) document.getElementById('f-precut-per1000').value = f.precut.per1000 || 3.60;
                    toggleFinishRow('precut');
                }
                if (f.tool) {
                    document.getElementById('f-tool-active').checked = f.tool.active;
                    document.getElementById('f-tool-cost').value = f.tool.cost;
                    toggleFinishRow('tool');
                }
                
                
                
                if (f.deliveryFixed) {
                    document.getElementById('f-del-fixed-active').checked = f.deliveryFixed.active;
                    document.getElementById('f-del-fixed-price').value = f.deliveryFixed.price || 0;
                    toggleFinishRow('del-fixed');
                }
                if (f.dodatek) {
                    if (document.getElementById('f-dodatek-sheets')) {
                        document.getElementById('f-dodatek-sheets').value = f.dodatek.sheets || 0;
                    }
                }
            }

            if (proj.name) document.getElementById('calc-project-name').value = proj.name;

            // Recalculate everything
            calculate();
        }

        function loadProject(id) {
            let arhiv = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            let proj = arhiv.find(p => p.id === id);
            if (!proj) return;
            // Prikaži samo projekte pola (ali stare brez tipa)
            arhiv = arhiv.filter(p => !p.calcType || p.calcType === 'tiskovna-pola' || p._source === 'pola');
            loadProjectData(proj);
            alert("Projekt '" + proj.name + "' je uspešno naložen!");
        }

        function deleteProject(id) {
            if (!confirm("Ali ste prepričani, da želite izbrisati ta projekt?")) return;
            let arhiv = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            arhiv = arhiv.filter(p => p.id !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(arhiv));
            renderSavedProjects();
            updateCustomerDatalist();
        }

        // FILE EXPORT / IMPORT LOGIC
        async function exportToFile() {
            try {
                let name = document.getElementById('calc-project-name').value.trim() || "Ponudba";
                const data = {
                    name: name,
                    _source: 'tiskovna-pola-kalkulator',
                    customer: document.getElementById('calc-customer').value,
                    materialCode: document.getElementById('calc-material-code').value,
                    timestamp: Date.now(),
                    inputs: {
                        machine_format: document.getElementById('machine-format').value,
                        item_w: document.getElementById('width').value,
                        item_h: document.getElementById('height').value,
                        quantity: document.getElementById('quantity').value,
                        bleed: document.getElementById('bleed').value,
                        pPrice: document.getElementById('calc-paper-price').value,
                        pUnit: document.getElementById('calc-paper-unit').value,
                        pWeight: document.getElementById('calc-paper-weight').value,
                        pType: document.getElementById('calc-paper-type').value,
                        pWaste: document.getElementById('calc-paper-waste').value,
                        platesPrice: document.getElementById('calc-plates-price').value,
                        prepPrice: document.getElementById('calc-prep-price').value,
                        changePrice: document.getElementById('calc-change-price').value,
                        colorWashes: parseInt(document.getElementById('calc-color-washes').value) || 0,
                        washPrice: parseFloat(document.getElementById('calc-wash-price').value) || 25,
                        machineType: document.getElementById('calc-machine-type').value,
                        machineRate: document.getElementById('calc-machine-rate').value,
                        machineSpeed: document.getElementById('calc-machine-speed').value,
                        machinePrepTime: document.getElementById('calc-machine-prep-time').value,
                        colorFront: document.getElementById('calc-color-front').value,
                        colorBack: document.getElementById('calc-color-back').value,
                        isObrat: document.getElementById('calc-is-obrat').checked,
                        margin: document.getElementById('calc-margin').value,
                        finish: {
                            cilinder: { active: document.getElementById('f-cilinder-active').checked, prep: document.getElementById('f-cilinder-prep').value, rate: document.getElementById('f-cilinder-rate').value },
                            zgibanje: { active: document.getElementById('f-zgibanje-active').checked, folds: document.getElementById('f-zgibanje-folds').value, speed: document.getElementById('f-zgibanje-speed').value },
                            extra: { active: document.getElementById('f-extra-active').checked, speed: document.getElementById('f-extra-speed').value, rate: document.getElementById('f-extra-rate').value },
                            precut: { active: document.getElementById('f-precut-active') ? document.getElementById('f-precut-active').checked : false, prep: document.getElementById('f-precut-prep') ? document.getElementById('f-precut-prep').value : 2.50, per1000: document.getElementById('f-precut-per1000') ? document.getElementById('f-precut-per1000').value : 3.60 },
                            tool: { active: document.getElementById('f-tool-active').checked, cost: document.getElementById('f-tool-cost').value },
                            deliveryFixed: { active: document.getElementById('f-del-fixed-active').checked, price: document.getElementById('f-del-fixed-price').value },
                            dodatek: { sheets: document.getElementById('f-dodatek-sheets') ? document.getElementById('f-dodatek-sheets').value : 0 }
                        }
                    }
                };

                const jsonStr = JSON.stringify(data, null, 2);
                const suggestedName = name.replace(/\s+/g, '_') + '.tiskovna-pola-kalkulator.json';
                if (window.showSaveFilePicker) {
                    try {
                        const handle = await window.showSaveFilePicker({
                            suggestedName: suggestedName,
                            types: [{ description: 'Tiskovna Pola JSON', accept: { 'application/json': ['.json'] } }],
                        });
                        const writable = await handle.createWritable();
                        await writable.write(jsonStr);
                        await writable.close();
                        alert("Datoteka uspešno shranjena!");
                        return;
                    } catch (e) { if (e.name === 'AbortError') return; }
                }
                const blob = new Blob([jsonStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = suggestedName;
                document.body.appendChild(a); a.click();
                setTimeout(() => { document.body.removeChild(a); window.URL.revokeObjectURL(url); }, 100);
            } catch (err) { alert("Napaka pri shranjevanju: " + err.message); }
        }

        // --- TISKANJE PONUDBE ---
        function getQuoteHTML(isWord = false, canvasImage = '', isInternal = false) {
            const preparedBy = document.getElementById('calc-prepared-by').value || 'Darko Sužnik';
            const date = new Date().toLocaleDateString('sl-SI');
            const quoteNum = document.getElementById('calc-quote-number').value || '/';
            const customer = document.getElementById('calc-customer').value || '';
            const customerCode = document.getElementById('calc-customer-code') ? document.getElementById('calc-customer-code').value : '/';
            const custAddress = document.getElementById('calc-cust-address').value || '';
            const deliveryAddress = document.getElementById('calc-delivery-address') ? document.getElementById('calc-delivery-address').value : '';
            const custEmail = document.getElementById('calc-cust-email').value || '';

            // Če imamo košarico in ne tiskamo internega dokumenta, tiskamo vse elemente
            let itemsToPrint = [];
            if (!isInternal && quoteBasket.length > 0) {
                itemsToPrint = quoteBasket;
            } else {
                // Če je košarica prazna ali tiskamo interno, vzamemo trenutni izračun
                const projectName = document.getElementById('calc-project-name').value || 'Tiskovina';
                const qtyStr = document.getElementById('quantity').value || '0';
                const qtyArr = qtyStr.split(',').map(x => parseFloat(x.trim().replace(/\./g, ''))).filter(x => !isNaN(x) && x > 0);

                const results = [];
                qtyArr.forEach(q => results.push(calculateForSingleQty(q)));

                itemsToPrint = [{
                    name: projectName,
                    type: 'Tiskovna pola',
                    customer: customer,
                    materialCode: document.getElementById('calc-material-code').value,
                    spec: {
                        format: document.getElementById('width').value + ' x ' + document.getElementById('height').value + ' mm',
                        paper: document.getElementById('calc-paper-weight').value + 'g ' + (document.getElementById('calc-paper-type').value || ''),
                        colors: (() => { const f = parseInt(document.getElementById('calc-color-front').value) || 0; const b = parseInt(document.getElementById('calc-color-back').value) || 0; const isOb = document.getElementById('calc-is-obrat') && document.getElementById('calc-is-obrat').checked; const isSV = document.getElementById('calc-is-sv') && document.getElementById('calc-is-sv').checked; return (isOb || isSV) ? (f + '/' + f) : (f + '/' + b); })(),
                        finishing: getActiveFinishingList()
                    },
                    quantities: results.map(r => ({
                        qty: r.qty,
                        priceTotal: r.totalPrice,
                        pricePerUnit: r.perItemFinal
                    })),
                    // Dodatni podatki za interno tiskovino
                    internal: {
                        w: document.getElementById('width').value,
                        h: document.getElementById('height').value,
                        bleed: document.getElementById('bleed').value,
                        sheetSize: document.getElementById('res-size').innerText,
                        sheetName: document.getElementById('res-sheet').innerText
                    }
                }];
            }

            const htmlHeader = isWord ? `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>` : `<html>`;

            if (isInternal) {
                const item = itemsToPrint[0];
                let dimensionDisplay = `${item.internal.w} x ${item.internal.h} mm (+${item.internal.bleed} mm bleed)`;
                let totalItemsCountStr = '';



                return `
                    ${htmlHeader}
                    <head><meta charset="utf-8"><title>MONTAŽA</title><style>body { font-family: 'Arial', sans-serif; padding: 40px; color: #000; text-align: center; } h1 { font-size: 28px; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; } .info { font-size: 20px; margin-bottom: 30px; line-height: 1.5; } .schema-box { border: 1px solid #000; padding: 20px; display: inline-block; background: #fff; } .footer { margin-top: 50px; font-size: 12px; color: #666; font-style: italic; }</style></head>
                    <body>
                        <h1>MONTAŽNI LIST</h1>
                        <div class="info">
                            <strong>STRANKA:</strong> ${customer}<br>
                            <strong>IZDELEK:</strong> ${item.name}<br>
                            <div style="margin: 10px 0; border: 1px dashed #ccc; padding: 10px; display: inline-block; text-align: left;">
                                <strong>DIMENZIJE NA POLI:</strong><br>${dimensionDisplay}
                            </div><br>
                            <strong>TISKOVNA POLA:</strong> ${item.internal.sheetName} (${item.internal.sheetSize} mm)<br>
                            <strong>MATERIAL:</strong> ${item.spec.paper}<br>
                            <strong>ŠIFRA:</strong> ${item.materialCode || '/'}
                        </div>
                        <div class="schema-box">
                            <div style="font-size: 12px; font-weight: bold; margin-bottom: 10px; text-align: left;">SHEMA RAZDELITVE:</div>
                            <img src="${canvasImage}" style="max-width: 100%; height: auto; max-height: 600px;">
                        </div>
                        <div class="footer">Datum: ${date} | Pripravil: ${preparedBy}<br><span style="color: red; font-weight: bold; font-size: 14px;">INTERNI DOKUMENT - TISKARNA PETRIČ</span></div>
                    </body></html>`;
            }

            // GENERATE MULTI-ITEM QUOTE
            let itemsHtml = itemsToPrint.map(item => {
                let priceRowsHTML = (item.quantities && Array.isArray(item.quantities)) ? item.quantities.map(q => `
                    <tr>
                        <td style="font-weight: bold; padding: 4px;">${formatQty(q.qty)} kos</td>
                        <td style="padding: 4px;">${formatPrice(q.pricePerUnit !== undefined ? q.pricePerUnit : (q.perItem || 0), 3)}</td>
                        <td style="font-weight: bold; text-align: right; padding: 4px;">${formatPrice(q.priceTotal !== undefined ? q.priceTotal : (q.total || 0), 2)}</td>
                    </tr>
                `).join('') : '<tr><td colspan="3" style="padding:4px; color:red;">Manjkajoči podatki o ceni</td></tr>';

                return `
                    <div style="margin-bottom: 25px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
                        <table style="width: 100%; border-collapse: collapse;" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="width: 15%; vertical-align: top; border-right: 1px solid #ddd; padding-right: 5px;">
                                    <span style="font-size: 8px; color: #555; text-transform: uppercase;">Šifra izdelka:</span><br>
                                    <span style="font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; margin-top: 5px; display: block;">${item.materialCode || '/'}</span>
                                </td>
                                <td style="width: 85%; vertical-align: top; padding-left: 10px;">
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <tr><td style="width: 90px; font-weight: bold;">Izdelek:</td><td>${item.name || '/'}</td></tr>
                                        <tr><td style="font-weight: bold;">Format:</td><td>${(item.spec && item.spec.format) ? item.spec.format : '/'}</td></tr>
                                        ${(item.spec && item.spec.paper) ? `<tr><td style="font-weight: bold;">Papir:</td><td>${item.spec.paper}</td></tr>` : ''}
                                        <tr><td style="font-weight: bold;">Tisk:</td><td>${(item.spec && item.spec.colors) ? item.spec.colors : '/'}</td></tr>
                                        ${(item.spec && item.spec.finishing) ? `<tr><td style="font-weight: bold;">Dodel.:</td><td>${item.spec.finishing}</td></tr>` : ''}
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; text-align: center; border-top: 1px solid #000; border-bottom: 1px solid #000;">
                            <tr><th style="padding: 4px; border-bottom: 1px solid #000; font-size: 11px;">Naklada</th><th style="padding: 4px; border-bottom: 1px solid #000; font-size: 11px;">Cena/Kom.</th><th style="padding: 4px; border-bottom: 1px solid #000; font-size: 11px; text-align: right;">Cena skupno:</th></tr>
                            ${priceRowsHTML}
                        </table>
                    </div>
                `;
            }).join('');

            const defaultContent = `
                    <table style="width: 100%; margin-bottom: 15px; border-bottom: 2px solid #f99c26; padding-bottom: 5px;" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="width: 32%; vertical-align: top;">
                                <div style="color: #8c8f91; font-size: 22px; font-weight: 300; font-style: italic; line-height: 0.9;">tiskarna</div>
                                <div style="color: #f99c26; font-size: 40px; font-weight: 900; font-style: italic; line-height: 0.7; padding-left: 20px;">petrič</div>
                            </td>
                            <td style="width: 25%; vertical-align: middle; border-left: 2px solid #f99c26; padding-left: 15px; font-size: 9px; color: #8c8f91; font-style: italic;"><strong>Tiskarna Petrič d.o.o.</strong><br>Tovarniška cesta 8<br>3210 Slovenske Konjice<br>ID za DDV: SI50694014</td>
                            <td style="width: 20%; vertical-align: middle; border-left: 2px solid #f99c26; padding-left: 15px; font-size: 9px; color: #8c8f91; font-style: italic;">T: 03 757 25 56<br>F: 03 757 25 63<br>Mat. št.: 6889433</td>
                            <td style="width: 23%; vertical-align: bottom; border-left: 2px solid #f99c26; padding-left: 15px; padding-bottom: 5px; font-size: 18px; font-weight: bold; color: #f99c26; font-style: italic;">vse stiska</td>
                        </tr>
                    </table>
                    <table style="width: 100%; margin-bottom: 5px;" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="width: 50%; vertical-align: top;"><span style="font-size: 13px;"><strong>${customer}</strong></span><br>${custAddress ? custAddress.replace(/\n/g, '<br>') + '<br>' : ''}${custEmail ? custEmail + '<br>' : ''}${deliveryAddress ? '<br><strong>Dostava na naslov:</strong><br>' + deliveryAddress.replace(/\n/g, '<br>') : ''}</td>
                            <td style="width: 50%; vertical-align: top;" align="right"><table class="info-table" cellpadding="0" cellspacing="0"><tr><td>Datum</td><td>${date}</td></tr><tr><td>Šifra stranke</td><td>${customerCode}</td></tr><tr><td>Ponudba</td><td>${quoteNum}</td></tr></table></td>
                        </tr>
                    </table>
                    <h1>PONUDBA</h1>
                    <p style="margin: 5px 0;">Zahvaljujemo se Vam za Vaše povpraševanje in Vam ponujamo naslednje:</p>
                    ${itemsHtml}
                    <p style="margin: 5px 0;"><strong>Predloga:</strong> Naročnik dostavi visokoresolucijski PDF z dodatkom za obrez!</p>
                    <p class="notes">Opcijski rok ponudbe je 30 dni. V ceni ni vračunan DDV. Rok plačila 30 dni po prejemu tiskovin. Ponudba je izdelana na osnovi znanih tehničnih podatkov in cen repromaterialov. V primeru odstopanja od zgoraj navedenih parametrov se cena izdelave lahko kadarkoli naknadno popravi.</p>
                    <div style="margin-top: 10px; font-size: 10px; font-style: italic;">Kalkulacijo pripravil: ${preparedBy}</div>
            `;
            const contentToRender = g_editedQuoteHTML ? g_editedQuoteHTML : defaultContent;

            return `
                ${htmlHeader}
                <head><meta charset="utf-8"><title>Ponudba</title>
                <style>
                    body { font-family: 'Arial', sans-serif; padding: ${isWord ? '10px' : '0'}; color: #000; line-height: 1.1; font-size: 11px; margin: 0; }
                    .info-table { border-collapse: collapse; margin-left: auto; margin-right: 0; }
                    .info-table td { padding: 1px 0 1px 15px; text-align: right; }
                    .info-table td:first-child { font-weight: normal; color: #555; }
                    .info-table td:last-child { font-weight: bold; }
                    h1 { font-size: 14px; font-weight: bold; margin-top: 10px; margin-bottom: 5px; letter-spacing: 1px; border-bottom: 1px solid #000; padding-bottom: 3px; }
                    .notes { margin-top: 10px; text-align: justify; font-size: 9px; line-height: 1.1; color: #444; }
                    @media print { .no-print { display: none !important; } }
                    .editable-area:focus { outline: 2px dashed #f99c26; background-color: #fffbeb; }
                    .editable-area p, .editable-area div:not(.header-top) { margin: 0; padding: 0; }
                </style>
                </head>
                <body>
                    ${!isWord ? `
                    <div class="no-print" contenteditable="false" style="background: #f1f5f9; padding: 10px; border-bottom: 1px solid #cbd5e1; display: flex; gap: 10px; align-items: center; justify-content: start; font-family: sans-serif; box-sizing: border-box; width: 100%;">
                        <button onclick="window.print()" style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px;">NATISNI PONUDBO</button>
                        <button onclick="window.close()" style="background: #64748b; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px;">ZAPRI</button>
                        <button onclick="if(confirm('Ali želite ponastaviti ponudbo na privzete vrednosti? (Spremembe besedila bodo izgubljene)')){ if(window.opener){window.opener.g_editedQuoteHTML='';} window.location.reload(); }" style="background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px;">PONASTAVI</button>
                        <div style="font-size: 12px; color: #475569; margin-left: 10px;">💾 Spremembe besedila se samodejno shranjujejo v kalkulacijo.</div>
                    </div>
                    ` : ''}
                    <div class="editable-area" ${!isWord ? 'contenteditable="true"' : ''} style="padding: ${isWord ? '10px' : '30px'};">
                        ${contentToRender}
                    </div>
                    <script>
                        // Sync changes to parent window
                        const area = document.querySelector('.editable-area');
                        if (area) {
                            const sync = () => {
                                if (window.opener && !window.opener.closed) {
                                    window.opener.g_editedQuoteHTML = area.innerHTML;
                                }
                            };
                            area.addEventListener('input', sync);
                            area.addEventListener('blur', sync);
                            window.addEventListener('beforeunload', sync);
                        }

                        document.addEventListener('keydown', function(e) {
                            if (e.key === 'Enter') {
                                let selection = window.getSelection();
                                if (!selection.rangeCount) return;
                                let container = selection.getRangeAt(0).commonAncestorContainer;
                                while (container && container !== document.body) {
                                    if (container.nodeType === 1 && container.getAttribute('contenteditable') === 'true') {
                                        break;
                                    }
                                    container = container.parentNode;
                                }
                                if (container && container !== document.body) {
                                    e.preventDefault();
                                    document.execCommand('insertLineBreak', false, null);
                                }
                            }
                        });
                    <\/script>
                </body></html>`;
        }

        function printQuote() {
            try {
                const html = getQuoteHTML(false, '', false);
                const printWindow = window.open('', '', 'width=800,height=900');
                if (!printWindow) {
                    alert("Prosimo omogočite pojavna okna (pop-ups) za ta zavihek.");
                    return;
                }
                printWindow.document.write(html);
                printWindow.document.close();
                printWindow.focus();
                setTimeout(() => { printWindow.print(); }, 500);
            } catch (e) {
                alert("Napaka pri pripravi ponudbe: " + e.message);
                console.error(e);
            }
        }

        function printProductionOrder() {
            try {
                const canvas = document.getElementById('canvas-machine');
                let canvasImage = '';
                if (canvas && canvas.style.display !== 'none') {
                    canvasImage = canvas.toDataURL('image/png');
                }
                const html = getQuoteHTML(false, canvasImage, true);
                const printWindow = window.open('', '', 'width=800,height=900');
                if (!printWindow) {
                    alert("Prosimo omogočite pojavna okna (pop-ups) za ta zavihek.");
                    return;
                }
                printWindow.document.write(html);
                printWindow.document.close();
                printWindow.focus();
                setTimeout(() => { printWindow.print(); }, 500);
            } catch (e) {
                alert("Napaka pri pripravi montažnega lista: " + e.message);
                console.error(e);
            }
        }

        function exportQuoteWord() {
            try {
                const htmlContent = getQuoteHTML(true, '', false);
                const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                const projectName = document.getElementById('calc-project-name').value || 'Ponudba';
                link.href = url;
                link.download = "Ponudba_" + projectName.replace(/\s+/g, '_') + ".doc";
                document.body.appendChild(link);
                link.click();
                setTimeout(() => { document.body.removeChild(link); window.URL.revokeObjectURL(url); }, 100);
            } catch (e) {
                alert("Napaka pri pripravi Word dokumenta: " + e.message);
                console.error(e);
            }
        }

        function getWorkOrderHTML() {
            const qtyStr = document.getElementById('quantity').value || '0';
            const qtyArr = qtyStr.split(',').map(x => parseFloat(x.trim().replace(/\./g, ''))).filter(x => !isNaN(x) && x > 0);
            const q = qtyArr[0] || 0;
            let calcRes = calculateForSingleQty(q);
            if (!calcRes) return "Napaka pri generiranju naloga.";
            let d = calcRes.details;

            let customer = document.getElementById('calc-customer').value || "Ni vpisano";
            let customerCode = document.getElementById('calc-customer-code') ? document.getElementById('calc-customer-code').value : "";
            let custAddress = document.getElementById('calc-cust-address').value || "";
            let custEmail = document.getElementById('calc-cust-email') ? document.getElementById('calc-cust-email').value : "";
            let deliveryAddress = document.getElementById('calc-delivery-address') ? document.getElementById('calc-delivery-address').value : "";
            let dnNum = document.getElementById('calc-dn-number') ? document.getElementById('calc-dn-number').value : "";
            let dnOld = document.getElementById('calc-dn-old') ? document.getElementById('calc-dn-old').value : "";
            let deadline = document.getElementById('calc-dn-deadline') ? document.getElementById('calc-dn-deadline').value : "";
            let packaging = document.getElementById('calc-dn-packaging') ? document.getElementById('calc-dn-packaging').value : "";
            let quoteNum = document.getElementById('calc-quote-number').value || "";
            let product = document.getElementById('calc-project-name').value || "Ni vpisano";
            let materialDesc = document.getElementById('calc-material-desc') ? document.getElementById('calc-material-desc').value : "";
            let paperType = document.getElementById('calc-paper-type').value || "";
            let paperWeight = document.getElementById('calc-paper-weight').value || "";
            let date = new Date().toLocaleDateString('sl-SI');

            let front = parseInt(document.getElementById('calc-color-front').value) || 0;
            let back = parseInt(document.getElementById('calc-color-back').value) || 0;
            let isObrat = document.getElementById('calc-is-obrat').checked;
            let isSV = document.getElementById('calc-is-sv') ? document.getElementById('calc-is-sv').checked : false;
            let colors = (isObrat || isSV) ? (front + '/' + front) : (front + '/' + back);
            let tiskMode = "1 prehod";
            if (isObrat) { tiskMode = "obračanje"; } else if (back > 0) { tiskMode = "prvi/drugi (2 prehoda)"; }

            let sourceW = d.paper.sourceW || 0;
            let sourceH = d.paper.sourceH || 0;
            let resSizeTxt = document.getElementById('res-size') ? document.getElementById('res-size').innerText.split('x') : [];
            let sheetW = resSizeTxt.length === 2 ? parseFloat(resSizeTxt[0].trim()) : 0;
            let sheetH = resSizeTxt.length === 2 ? parseFloat(resSizeTxt[1].trim()) : 0;
            let sourceYield = d.paper.sourceYield || 1;
            let sourceSheets = d.paper.sourceSheets || 0;
            let totalSheets = d.paper.totalSheets || 0;
            let itemsPerSheet = document.getElementById('items-per-sheet').value || "1";
            let formatW = document.getElementById('width').value || 0;
            let formatH = document.getElementById('height').value || 0;
            let finishList = getActiveFinishingList();
            let hasTool = document.getElementById('f-tool-active') && document.getElementById('f-tool-active').checked;
            let physicalWasteSheets = totalSheets - calcRes.sheetsNeeded;
            let givenDodatekInput = document.getElementById('f-dodatek-sheets') ? parseInt(document.getElementById('f-dodatek-sheets').value) : NaN;
            let finalDodatek = physicalWasteSheets;
            let finalTotalSheets = totalSheets;
            let finalSourceSheets = sourceSheets;
            if (!isNaN(givenDodatekInput) && givenDodatekInput >= 0) {
                finalDodatek = givenDodatekInput;
                finalTotalSheets = calcRes.sheetsNeeded + givenDodatekInput;
                finalSourceSheets = Math.ceil(finalTotalSheets / sourceYield);
            }
            let prepPasses = front > 0 ? (Math.ceil(front / 4) + (back > 0 ? Math.ceil(back / 4) : 0)) : 1;
            let colorMode = front + '/' + (isObrat ? 'OB' : back);
            let rule = prepRules[colorMode] || { passes: prepPasses };
            let mPasses = rule.passes;
            let dnPrintHours = (finalTotalSheets * mPasses) / 6000;
            let roundedPrepTime = Math.round(d.print.prepTime * 4) / 4;
            let roundedPrintTime = Math.round(dnPrintHours * 4) / 4;
            let sourceWCm = (sourceW / 10).toLocaleString('de-DE', { maximumFractionDigits: 2 });
            let sourceHCm = (sourceH / 10).toLocaleString('de-DE', { maximumFractionDigits: 2 });
            let sheetWCm = (sheetW / 10).toLocaleString('de-DE', { maximumFractionDigits: 2 });
            let sheetHCm = (sheetH / 10).toLocaleString('de-DE', { maximumFractionDigits: 2 });

            const defaultContent = `
                <div class="header-top">
                    <div style="width: 50%;">
                        <div class="bold" style="font-size: 14px;">${customer} &nbsp;&nbsp;&nbsp; (Šifra stranke: ${customerCode})</div>
                        <div>${custAddress.replace(/\n/g, '<br>')}</div>
                        <div>${custEmail ? custEmail + '<br>' : ''}</div>
                    </div>
                    <div style="width: 50%; text-align: right; font-size: 16px; font-weight: bold;">
                        Tiskarna PETRIČ
                    </div>
                </div>
                <table style="margin-top: 10px;">
                    <tr>
                        <td style="width: 50%;">
                            <div style="font-size: 18px;"><span class="bold">Rok izdelave:</span> ${deadline}</div>
                        </td>
                        <td style="width: 50%; text-align: right;">
                            <div class="bold" style="font-size: 20px;">D.N.: ${dnNum}</div>
                            ${dnOld ? `<div style="font-size: 18px; margin-top: 2px;">Stari D.N. (montaža): ${dnOld}</div>` : ''}
                            <div>Datum naloga: ${date}</div>
                        </td>
                    </tr>
                </table>
                <table style="margin-top: 10px; width: 100%;">
                    <tr>
                        <td class="bold" style="font-size: 20px; width: 50%;">${product}</td>
                        <td style="width: 50%; text-align: right; font-size: 18px;">Ponudba: ${quoteNum}</td>
                    </tr>
                </table>
                <table style="margin-top: 5px; width: 100%;">
                    <tr><td style="width: 15%;">Količina:</td><td class="bold" style="font-size: 15px;">${q.toLocaleString('de-DE')} kos</td></tr>
                    <tr><td>Format:</td><td class="bold">${formatW} x ${formatH} mm</td></tr>
                    <tr><td>Tisk:</td><td class="bold">${colors}</td></tr>
                    <tr><td>Material:</td><td class="bold">${paperWeight}g ${paperType} ${materialDesc}</td></tr>
                </table>
                <div class="row-divider"></div>
                <table>
                    <tr>
                        <td style="width: 15%;">06 razrez:</td>
                        <td class="bold">${finalSourceSheets.toLocaleString('de-DE')} pol &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${sourceWCm} x ${sourceHCm} cm &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; na &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${finalTotalSheets.toLocaleString('de-DE')} pol ${sheetWCm} x ${sheetHCm} cm &nbsp;&nbsp; (${sourceYield} iz pole)</td>
                    </tr>
                </table>
                <table style="margin-top: 5px; width: 100%;">
                    <tr>
                        <td style="width: 15%; font-weight: bold;"><strong>${d.print.mType || 'S4'}</strong> priprava:</td>
                        <td class="bold" style="width: 55%;">${tiskMode}</td>
                        <td style="width: 30%; text-align: right;" class="bold" colspan="2"><span class="bold">priprava:</span> ${roundedPrepTime.toFixed(2)} h</td>
                    </tr>
                    <tr>
                        <td>Tisk:</td>
                        <td class="bold" style="width: 55%; white-space: nowrap;">${calcRes.sheetsNeeded.toLocaleString('de-DE')} + ${finalDodatek.toLocaleString('de-DE')} = ${finalTotalSheets.toLocaleString('de-DE')} tisk. pol &nbsp;&nbsp; (${mPasses}x skozi stroj)</td>
                        <td style="width: 30%; text-align: right;" class="bold" colspan="2"><span class="bold">tisk:</span> ${roundedPrintTime.toFixed(2)} h</td>
                    </tr>
                </table>
                <div class="row-divider"></div>
                <table>
                    <tr>
                        <td style="width: 15%;">Dodelava:</td>
                        <td class="bold">${finishList ? finishList : 'Brez posebne dodelave'}</td>
                    </tr>
                    ${hasTool ? `
                    <tr>
                        <td style="width: 15%; padding-top: 10px; color: #ef4444; font-weight: bold;">Orodje:</td>
                        <td class="bold" style="padding-top: 10px; color: #ef4444; font-weight: bold;">izdelava novega orodja Smole Branko</td>
                    </tr>
                    ` : ''}
                    <tr>
                        <td style="width: 15%; padding-top: 10px;">Pakiranje:</td>
                        <td class="bold" style="padding-top: 10px;">${packaging}</td>
                    </tr>
                </table>
                <div class="row-divider"></div>
                <div class="bold" style="margin-bottom: 5px;">Poraba materiala:</div>
                <table>
                    <tr>
                        <td>of. plošče (<strong>${d.print.mType || 'S4'}</strong>):</td>
                        <td style="text-align: right;" class="bold">${d.prep.plates} kos</td>
                    </tr>
                    <tr>
                        <td>Papir (${sourceWCm} x ${sourceHCm} cm) - ${paperWeight}g ${paperType}:</td>
                        <td style="text-align: right;" class="bold">${finalSourceSheets.toLocaleString('de-DE')} pol</td>
                    </tr>
                </table>
                <div class="row-divider"></div>
                <table>
                    <tr>
                        <td style="width: 50%;" class="bold">Izdobaviti točno naročeno količino!</td>
                        <td style="width: 50%; text-align: right;" class="bold">${deliveryAddress ? 'Dostava na naslov!' : 'Naša dostava!'}</td>
                    </tr>
                    <tr>
                        <td>Obvezno par vzorcev tiskovine v nalog:</td>
                        <td style="text-align: right;">Pred dostavo pokliči!</td>
                    </tr>
                </table>
                <div class="row-divider"></div>
                <table style="width: 100%; margin-bottom: 5px; font-size: 11px;">
                    <tr>
                        <td style="width: 25%;"><span class="bold">Št. ponudbe:</span> ${quoteNum || '/'}</td>
                        <td style="width: 25%; text-align: center;"><span class="bold">Cena za kos:</span> ${formatPrice(calcRes.perItemFinal, 4)} €</td>
                        <td style="width: 25%; text-align: center;"><span class="bold">Cena za 1000 kos:</span> ${formatPrice(calcRes.perItemFinal * 1000, 2)} €</td>
                        <td style="width: 25%; text-align: right;"><span class="bold">Skupaj:</span> ${formatPrice(calcRes.totalPrice, 2)} €</td>
                    </tr>
                </table>
            `;
            const contentToRender = g_editedWorkOrderHTML ? g_editedWorkOrderHTML : defaultContent;

            let html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Delovni Nalog - ${dnNum || product}</title>
                <style>
                    body { font-family: Arial, sans-serif; font-size: 13px; line-height: 1.25; color: #000; margin: 0; padding: 0; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 6px; }
                    td, th { padding: 4px; vertical-align: top; }
                    .main-table th { background: #eee; border: 1px solid #ccc; font-size: 11px; }
                    .main-table td { border: 1px solid #ccc; }
                    .header-top { display: flex; justify-content: space-between; border-bottom: 1px solid #000; padding-bottom: 4px; margin-bottom: 8px; }
                    .bold { font-weight: bold; }
                    .row-divider { border-top: 1px dashed #000; margin: 10px 0; }
                    @media print { .no-print { display: none !important; } }
                    .editable-area:focus { outline: 2px dashed #3b82f6; background-color: #eff6ff; }
                    .editable-area p, .editable-area div:not(.header-top) { margin: 0; padding: 0; }
                </style>
            </head>
            <body>
                <div class="no-print" contenteditable="false" style="background: #f1f5f9; padding: 10px; border-bottom: 1px solid #cbd5e1; display: flex; gap: 10px; align-items: center; justify-content: start; font-family: sans-serif; box-sizing: border-box; width: 100%;">
                    <button onclick="window.print()" style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px;">NATISNI DN</button>
                    <button onclick="window.close()" style="background: #64748b; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px;">ZAPRI</button>
                    <button onclick="if(confirm('Ali želite ponastaviti delovni nalog na privzete vrednosti? (Spremembe besedila bodo izgubljene)')){ if(window.opener){window.opener.g_editedWorkOrderHTML='';} window.location.reload(); }" style="background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px;">PONASTAVI</button>
                    <div style="font-size: 12px; color: #475569; margin-left: 10px;">💾 Spremembe besedila se samodejno shranjujejo v kalkulacijo.</div>
                </div>
                <div class="editable-area" contenteditable="true" style="padding: 20px;">
                    ${contentToRender}
                </div>
                <script>
                    const area = document.querySelector('.editable-area');
                    if (area) {
                        const sync = () => {
                            if (window.opener && !window.opener.closed) {
                                window.opener.g_editedWorkOrderHTML = area.innerHTML;
                            }
                        };
                        area.addEventListener('input', sync);
                        area.addEventListener('blur', sync);
                        window.addEventListener('beforeunload', sync);
                    }

                    document.addEventListener('keydown', function(e) {
                        if (e.key === 'Enter') {
                            let selection = window.getSelection();
                            if (!selection.rangeCount) return;
                            let container = selection.getRangeAt(0).commonAncestorContainer;
                            while (container && container !== document.body) {
                                if (container.nodeType === 1 && container.getAttribute('contenteditable') === 'true') {
                                    break;
                                }
                                container = container.parentNode;
                            }
                            if (container && container !== document.body) {
                                e.preventDefault();
                                document.execCommand('insertLineBreak', false, null);
                            }
                        }
                    });
                <\/script>
            </body>
            </html>
            `;
            return html;
        }
        function printWorkOrder() {
            try {
                const html = getWorkOrderHTML();
                const printWindow = window.open('', '', 'width=850,height=900');
                if (printWindow) {
                    printWindow.document.write(html);
                    printWindow.document.close();
                    printWindow.focus();
                } else {
                    alert("Pojavno okno je blokirano. Prosimo, dovolite pojavna okna za to stran.");
                }
            } catch (e) {
                console.error("Napaka pri tisku delovnega naloga:", e);
                alert("Napaka pri generiranju delovnega naloga: " + e.message);
            }
        }

        function printDN() {
            printWorkOrder();
        }

        function handleFileSelect(event) {
            const file = event.target.files[0];
            if (!file) return;
            // Preveri, da je to datoteka tega kalkulatorja
            if (!file.name.includes('.pola.')) {
                alert("Napaka: Ta datoteka ne pripada Tiskovna Pola kalkulatorju!\nPričakovana datoteka: *.pola.json");
                event.target.value = "";
                return;
            }
            const reader = new FileReader();
            reader.onload = function (e) {
                try {
                    const data = JSON.parse(e.target.result);
                    if (!data.inputs) throw new Error("Neveljavna datoteka!");
                    if (data._source && data._source !== 'pola') {
                        throw new Error("Ta datoteka pripada drugemu kalkulatorju (" + data._source + ")!");
                    }
                    loadProjectData(data);
                    alert("Ponudba '" + (data.name || "Brez imena") + "' uspešno uvožena!");
                } catch (err) { alert("Napaka pri uvozu: " + err.message); }
                event.target.value = "";
            };
            reader.readAsText(file);
        }



        // FINAL AUTO-RUN
        try {
            applyMachineDefaults();
            renderSavedProjects();
            updateCustomerDatalist();
            renderBasket();
            setTimeout(calculate, 200); // Give it a moment to stabilize
        } catch (e) {
            console.error("Startup failed:", e);
        }
    