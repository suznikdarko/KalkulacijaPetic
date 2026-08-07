
        function extractGrammage(sourceEl, targetId) {
            const val = sourceEl.value;
            const match = val.match(/(\d+)\s*g/i);
            if (match) {
                const target = document.getElementById(targetId);
                if (target) {
                    target.value = match[1];
                    if (typeof calculate === 'function') calculate();
                }
            }
        }
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
        document.addEventListener('input', (e) => {
            updateInputStyles(e.target);
            if (!window.g_loadingProject) {
                g_editedQuoteHTML = '';
                g_editedQuoteATHTML = '';
                g_editedWorkOrderHTML = '';
                if (typeof updateCustomDocsPreview === 'function') updateCustomDocsPreview();
            }
        });
        document.addEventListener('change', (e) => {
            updateInputStyles(e.target);
            if (!window.g_loadingProject) {
                g_editedQuoteHTML = '';
                g_editedQuoteATHTML = '';
                g_editedWorkOrderHTML = '';
                if (typeof updateCustomDocsPreview === 'function') updateCustomDocsPreview();
            }
        });
        var g_editedQuoteHTML = '';
        var g_editedQuoteATHTML = '';
        var g_editedWorkOrderHTML = '';
        var currentLoadedProjectId = null;
        var prevQuoteHTML = null;
        var prevQuoteATHTML = null;
        var prevDNHTML = null;
        function updateCustomDocsPreview() {
            var container = document.getElementById('custom-docs-preview');
            if (!container) return;
            container.innerHTML = "";
            // Ponudba
            var hasQuote = (typeof g_editedQuoteHTML !== 'undefined' && g_editedQuoteHTML.trim() !== "");
            var qCard = document.createElement('div');
            qCard.style.width = "70px";
            qCard.style.height = "99px"; // A4 aspect ratio
            qCard.style.border = hasQuote ? "2px solid #10b981" : "1px dashed #64748b";
            qCard.style.background = hasQuote ? "#ecfdf5" : "transparent";
            qCard.style.borderRadius = "4px";
            qCard.style.cursor = "pointer";
            qCard.style.display = "flex";
            qCard.style.flexDirection = "column";
            qCard.style.alignItems = "center";
            qCard.style.justifyContent = "center";
            qCard.style.boxShadow = hasQuote ? "0 4px 6px rgba(0,0,0,0.1)" : "none";
            qCard.style.position = "relative";
            qCard.style.transition = "all 0.2s";
            qCard.title = hasQuote ? "Ponudba (prilagojena) - Klikni za odpiranje" : "Ponudba (avtomatska) - Klikni za odpiranje";
            qCard.onclick = function () { printQuote(); };
            qCard.onmouseover = function () { this.style.transform = "scale(1.05)"; };
            qCard.onmouseout = function () { this.style.transform = "scale(1)"; };
            var qLabel = document.createElement('div');
            qLabel.style.fontSize = "10px";
            qLabel.style.fontWeight = "bold";
            qLabel.style.color = hasQuote ? "#047857" : "#94a3b8";
            qLabel.innerText = "PONUDBA";
            if (hasQuote) {
                var check = document.createElement('div');
                check.innerHTML = "✏️";
                check.style.fontSize = "20px";
                check.style.color = "#10b981";
                qCard.appendChild(check);
            } else {
                var fileIcon = document.createElement('div');
                fileIcon.innerHTML = "??";
                fileIcon.style.fontSize = "20px";
                fileIcon.style.color = "#94a3b8";
                fileIcon.style.opacity = "0.5";
                qCard.appendChild(fileIcon);
            }
            qCard.appendChild(qLabel);
            container.appendChild(qCard);
            // Ponudba AT
            var hasQuoteAT = (typeof g_editedQuoteATHTML !== 'undefined' && g_editedQuoteATHTML.trim() !== "");
            var qaCard = document.createElement('div');
            qaCard.style.width = "70px";
            qaCard.style.height = "99px";
            qaCard.style.border = hasQuoteAT ? "2px solid #ef4444" : "1px dashed #64748b";
            qaCard.style.background = hasQuoteAT ? "#fef2f2" : "transparent";
            qaCard.style.borderRadius = "4px";
            qaCard.style.cursor = "pointer";
            qaCard.style.display = "flex";
            qaCard.style.flexDirection = "column";
            qaCard.style.alignItems = "center";
            qaCard.style.justifyContent = "center";
            qaCard.style.boxShadow = hasQuoteAT ? "0 4px 6px rgba(0,0,0,0.1)" : "none";
            qaCard.style.position = "relative";
            qaCard.style.transition = "all 0.2s";
            qaCard.title = hasQuoteAT ? "Ponudba AT (prilagojena) - Klikni za odpiranje" : "Ponudba AT (avtomatska) - Klikni za odpiranje";
            qaCard.onclick = function () { printQuoteAT(); };
            qaCard.onmouseover = function () { this.style.transform = "scale(1.05)"; };
            qaCard.onmouseout = function () { this.style.transform = "scale(1)"; };
            var qaLabel = document.createElement('div');
            qaLabel.style.fontSize = "10px";
            qaLabel.style.fontWeight = "bold";
            qaLabel.style.color = hasQuoteAT ? "#b91c1c" : "#94a3b8";
            qaLabel.innerText = "PON. AT";
            if (hasQuoteAT) {
                var checkAT = document.createElement('div');
                checkAT.innerHTML = "✏️";
                checkAT.style.fontSize = "20px";
                checkAT.style.color = "#ef4444";
                qaCard.appendChild(checkAT);
            } else {
                var fileIconAT = document.createElement('div');
                fileIconAT.innerHTML = "??";
                fileIconAT.style.fontSize = "20px";
                fileIconAT.style.color = "#94a3b8";
                fileIconAT.style.opacity = "0.5";
                qaCard.appendChild(fileIconAT);
            }
            qaCard.appendChild(qaLabel);
            container.appendChild(qaCard);
            // Delovni nalog
            var hasDN = (typeof g_editedWorkOrderHTML !== 'undefined' && g_editedWorkOrderHTML.trim() !== "");
            var dCard = document.createElement('div');
            dCard.style.width = "70px";
            dCard.style.height = "99px";
            dCard.style.border = hasDN ? "2px solid #8b5cf6" : "1px dashed #64748b";
            dCard.style.background = hasDN ? "#f5f3ff" : "transparent";
            dCard.style.borderRadius = "4px";
            dCard.style.cursor = "pointer";
            dCard.style.display = "flex";
            dCard.style.flexDirection = "column";
            dCard.style.alignItems = "center";
            dCard.style.justifyContent = "center";
            dCard.style.boxShadow = hasDN ? "0 4px 6px rgba(0,0,0,0.1)" : "none";
            dCard.style.position = "relative";
            dCard.style.transition = "all 0.2s";
            dCard.title = hasDN ? "Delovni Nalog (prilagojen) - Klikni za odpiranje" : "Delovni Nalog (avtomatski) - Klikni za odpiranje";
            dCard.onclick = function () { printWorkOrder(); };
            dCard.onmouseover = function () { this.style.transform = "scale(1.05)"; };
            dCard.onmouseout = function () { this.style.transform = "scale(1)"; };
            var dLabel = document.createElement('div');
            dLabel.style.fontSize = "10px";
            dLabel.style.fontWeight = "bold";
            dLabel.style.color = hasDN ? "#6d28d9" : "#94a3b8";
            dLabel.innerText = "D. NALOG";
            if (hasDN) {
                var dcheck = document.createElement('div');
                dcheck.innerHTML = "✏️";
                dcheck.style.fontSize = "20px";
                dcheck.style.color = "#8b5cf6";
                dCard.appendChild(dcheck);
            } else {
                var dIcon = document.createElement('div');
                dIcon.innerHTML = "??";
                dIcon.style.fontSize = "20px";
                dIcon.style.color = "#94a3b8";
                dIcon.style.opacity = "0.5";
                dCard.appendChild(dIcon);
            }
            dCard.appendChild(dLabel);
            container.appendChild(dCard);
            var changed = false;
            if (prevQuoteHTML !== null && g_editedQuoteHTML !== prevQuoteHTML) changed = true;
            if (prevQuoteATHTML !== null && g_editedQuoteATHTML !== prevQuoteATHTML) changed = true;
            if (prevDNHTML !== null && g_editedWorkOrderHTML !== prevDNHTML) changed = true;
            prevQuoteHTML = g_editedQuoteHTML;
            prevQuoteATHTML = g_editedQuoteATHTML;
            prevDNHTML = g_editedWorkOrderHTML;
            if (changed && currentLoadedProjectId) {
                saveCurrentProject(null, true);
            }
        }
        // Osvežuj predogled vsako sekundo (ker se podatki urejajo v drugem oknu)
        setInterval(updateCustomDocsPreview, 1000);
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
            const isChecked = (id) => document.getElementById(id) && document.getElementById(id).checked;
            if (isChecked('f-cilinder-active')) list.push('Cilinder');
            if (isChecked('f-zgibanje-active')) {
                const folds = document.getElementById('f-zgibanje-folds') ? document.getElementById('f-zgibanje-folds').value : '1';
                list.push(`${folds}x zgibano`);
            }
            if (isChecked('f-razrez-format-active') || isChecked('f-precut-active')) {
                if (!list.includes('Razrez')) list.push('Razrez');
            }
            if (isChecked('f-lepljenje-active')) list.push('Lepljenje');
            if (isChecked('f-spiral-active')) list.push('Špiraljenje / Vrvice');
            if (isChecked('f-extra-active')) list.push('Ročno delo');
            if (isChecked('f-tool-active')) list.push('Orodje');
            if (isChecked('f-uv-active')) list.push('UV lak');
            if (isChecked('f-personalization-active')) {
                const persSidesEl = document.getElementById('f-personalization-sides');
                const persSides = persSidesEl ? persSidesEl.value : '1/0';
                list.push(`Personalizacija ${persSides}`);
            }
            if (isChecked('f-lam-active')) {
                const lamTypeEl = document.getElementById('f-lam-type');
                const lamTypeName = lamTypeEl ? lamTypeEl.options[lamTypeEl.selectedIndex].text : 'Mat';
                const lamSidesEl = document.getElementById('f-lam-sides');
                const lamSidesText = lamSidesEl ? lamSidesEl.options[lamSidesEl.selectedIndex].text : '1/0';
                list.push(`Plastifikacija (${lamTypeName} ${lamSidesText})`);
            }
            if (isChecked('f-delivery-active') || isChecked('f-del-fixed-active')) list.push('Dostava');
            return list.join(', ');
        }
        function addToBasket() {
            try {
                // Prepričaj se, da je izračun posodobljen
                calculate();
                const projectName = (document.getElementById('calc-project-name') ? document.getElementById('calc-project-name').value : '') || 'Brez imena';
                const qtyStr = (document.getElementById('quantity') ? document.getElementById('quantity').value : '') || '0';
                const qtyArr = qtyStr.split(',').map(x => parseFloat(x.trim().replace(/\./g, ''))).filter(x => !isNaN(x) && x > 0);
                const oqStr = (document.getElementById('ordered-quantity') ? document.getElementById('ordered-quantity').value : '') || "";
                const oqArr = oqStr.split(',').map(x => parseFloat(x.trim().replace(/\./g, ''))).filter(x => !isNaN(x) && x > 0);
                if (qtyArr.length === 0) {
                    alert("Prosimo vnesite vsaj eno naklado.");
                    return;
                }
                // Pripravimo podatke za vsako naklado
                const results = [];
                qtyArr.forEach((q, idx) => {
                    const oqVal = oqArr[idx] || q;
                    const res = calculateForSingleQty(q, undefined, undefined, undefined, oqVal);
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
                    customer: (document.getElementById('calc-customer') ? document.getElementById('calc-customer').value : '') || '',
                    productCode: (document.getElementById('calc-product-code') ? document.getElementById('calc-product-code').value : '') || '/',
                    materialCode: (document.getElementById('calc-material-code') ? document.getElementById('calc-material-code').value : '') || '/',
                    spec: {
                        usePersonalization: document.getElementById('calc-use-personalization') ? document.getElementById('calc-use-personalization').checked : false,
                        useManualWork: document.getElementById('calc-use-manual-work') ? document.getElementById('calc-use-manual-work').checked : false,
                        wasteManual: document.getElementById('calc-paper-waste-manual') ? document.getElementById('calc-paper-waste-manual').value : '',
                        mutPlates: document.getElementById('calc-mut-plates') ? document.getElementById('calc-mut-plates').value : '',
                        format: (document.getElementById('width') ? document.getElementById('width').value : '') + ' x ' + (document.getElementById('height') ? document.getElementById('height').value : '') + ' mm',
                        paper: (document.getElementById('calc-paper-weight') ? document.getElementById('calc-paper-weight').value : '') + 'g ' + (document.getElementById('calc-paper-type') ? document.getElementById('calc-paper-type').value : ''),
                        colors: getFormattedColorsString(),
                        finishing: getActiveFinishingList()
                    },
                    quantities: results.map((r, idx) => {
                        const oqVal = oqArr[idx] || r.qty;
                        return {
                            qty: oqVal,
                            priceTotal: r.totalPrice,
                            pricePerUnit: r.perItemFinal
                        };
                    })
                };
                quoteBasket.push(basketItem);
                localStorage.setItem('petric_quote_basket', JSON.stringify(quoteBasket));
                renderBasket();
                // Povratna informacija uporabniku
                const btn = document.querySelector('button[onclick="addToBasket()"]');
                if (btn) {
                    const originalText = btn.innerHTML;
                    btn.innerHTML = "' DODANO";
                    setTimeout(() => { btn.innerHTML = originalText; }, 1500);
                } else {
                    alert("Dodano v košarico!");
                }
            } catch (e) {
                alert("Exception in " + "Function" + ": " + e.message + "\n" + e.stack);
                console.error("addToBasket error:", e);
                alert("Napaka pri dodajanju v košarico: " + e.message);
            }
        }
        function removeFromBasket(id) {
            quoteBasket = quoteBasket.filter(item => item.id !== id);
            localStorage.setItem('petric_quote_basket', JSON.stringify(quoteBasket));
            g_editedQuoteHTML = '';
            g_editedQuoteATHTML = '';
            renderBasket();
        }
        function clearBasket() {
            if (confirm("Izbrišem vse elemente iz košarice?")) {
                quoteBasket = [];
                localStorage.setItem('petric_quote_basket', JSON.stringify(quoteBasket));
                g_editedQuoteHTML = '';
                g_editedQuoteATHTML = '';
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
                        <button onclick="removeFromBasket(${item.id})" style="background: none; border: none; color: #ef4444; cursor: pointer; padding: 5px; font-size: 1rem;">'</button>
                    </div>
                    `;
                }).join('');
            } catch (e) {
                alert("Exception in " + "Function" + ": " + e.message + "\n" + e.stack);
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
                'b1': [700, 1000],
                'a1': [594, 841],
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
                let match = val.match(/\((\d+(?:\.\d+)?)\s*[xX*×,]\s*(\d+(?:\.\d+)?)\s*(?:mm)?\)/);
                if (match) {
                    w = parseFloat(match[1]);
                    h = parseFloat(match[2]);
                } else {
                    match = val.match(/(\d+(?:\.\d+)?)\s*[xX*×,]\s*(\d+(?:\.\d+)?)/);
                    if (match) {
                        w = parseFloat(match[1]);
                        h = parseFloat(match[2]);
                    }
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
                    const cleaned = val.trim().toLowerCase();
                    if (cleaned.startsWith('a1') || cleaned.startsWith('b1')) {
                        const mTypeSelect = document.getElementById('calc-machine-type');
                        if (mTypeSelect) {
                            mTypeSelect.value = 'cooperation';
                            if (typeof applyMachineDefaults === 'function') {
                                applyMachineDefaults();
                            }
                        }
                    } else {
                        if (typeof calculate === 'function') {
                            calculate();
                        }
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
            '4/0': { passes: 1, wasteImpressions: 350 },
            '5/0': { passes: 2, wasteImpressions: 850 },
            '6/0': { passes: 2, wasteImpressions: 1050 },
            '7/0': { passes: 2, wasteImpressions: 1250 },
            '1/1': { passes: 2, wasteImpressions: 240 },
            '1/OB': { passes: 2, wasteImpressions: 250 },
            '2/1': { passes: 2, wasteImpressions: 750 },
            '3/1': { passes: 2, wasteImpressions: 850 },
            '4/1': { passes: 2, wasteImpressions: 690 },
            '4/4': { passes: 2, wasteImpressions: 640 }, // 2x odpadna makulatura za 4/4 brez obračanja
            '4/OB': { passes: 2, wasteImpressions: 320 },
            '8/0': { passes: 1, wasteImpressions: 450 }
        };
        const machineProfiles = {
            'S4': { rate: 120, speed: 6900, prep: 10, useDynamic: true, maxW: 518, maxH: 348, defaultFormat: 'B3' },
            'S8': { rate: 150, speed: 6900, prep: 10, useDynamic: true, maxW: 698, maxH: 498, defaultFormat: 'B2' },
            'CD': { rate: 180, speed: 6900, prep: 10, useDynamic: true, maxW: 698, maxH: 498, defaultFormat: 'B2' },
            'SM4+lak': { rate: 160, speed: 6900, prep: 10, useDynamic: true, maxW: 698, maxH: 498, defaultFormat: 'B2' },
            'CD UV': { rate: 280, speed: 6900, prep: 10, useDynamic: true, maxW: 698, maxH: 498, defaultFormat: 'B2' },
            'digital': { rate: 40, speed: 1800, prep: 10, useDynamic: false, defaultFormat: 'Digital (480x320)', maxW: 480, maxH: 320 },
            'cooperation': { rate: 0, speed: 6000, prep: 0, useDynamic: false, defaultFormat: 'B1', maxW: 1000, maxH: 707 }
        };
        let g_lastBestLayout = null;
        let g_manualLayout = null;
        let g_lastSheetW = 0, g_lastSheetH = 0, g_lastG = 0;
        let g_autoCount = 0;
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
                const prepTimeInp = document.getElementById('calc-machine-prep-time');
                if (prepTimeInp) {
                    prepTimeInp.value = "";
                    prepTimeInp.placeholder = "Avto";
                }
                const mFormatSelect = document.getElementById('machine-format');
                if (mFormatSelect) {
                    mFormatSelect.value = isCoop ? 'B1' : 'auto';
                }
                if (mType === 'digital') {
                    const platesInp = document.getElementById('calc-plates-num');
                    if (platesInp) platesInp.value = "0";
                    const prepInp = document.getElementById('calc-prep-price');
                    if (prepInp) prepInp.value = "30";
                    const mutInp = document.getElementById('calc-mut-plates');
                    if (mutInp) mutInp.value = "0";
                    const precutPrepInp = document.getElementById('f-precut-prep');
                    if (precutPrepInp) precutPrepInp.value = "10";
                } else if (mType === 'CD UV') {
                    const prepInp = document.getElementById('calc-prep-price');
                    if (prepInp) prepInp.value = "70";
                    const platesInp = document.getElementById('calc-plates-num');
                    if (platesInp) platesInp.value = "4";
                    const mutInp = document.getElementById('calc-mut-plates');
                    if (mutInp) mutInp.value = "0";
                    const precutPrepInp = document.getElementById('f-precut-prep');
                    if (precutPrepInp) precutPrepInp.value = "15";
                } else {
                    const prepInp = document.getElementById('calc-prep-price');
                    if (prepInp) prepInp.value = "25";
                    const changeInp = document.getElementById('calc-change-price');
                    if (changeInp) changeInp.value = "10";
                }
            }
            filterAvailableFormats();
            calculate();
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
                    // Odstranjena avtomatska "mešana" postavitev (isMixed), da se ohrani simetrija in enotna smer vlaken.
                    // Če stranka želi dodati več stavkov, se mora to ročno preveriti, sicer sistem vsiljuje nesimetrične pole.
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
        function updateUVLakPrice() {
            const typeSelect = document.getElementById('f-uv-type');
            if (!typeSelect) return;
            const type = typeSelect.value;
            const formatSelect = document.getElementById('f-uv-format').value;
            if (type === 'manual') {
                return;
            }
            let format = formatSelect;
            if (format === 'auto') {
                const w = g_lastSheetW || 1000;
                const h = g_lastSheetH || 700;
                const maxDim = Math.max(w, h);
                const minDim = Math.min(w, h);
                if (maxDim <= 500 && minDim <= 350) {
                    format = '50x35';
                } else if (maxDim <= 700 && minDim <= 330) {
                    format = '70x33';
                } else {
                    format = '70x50';
                }
            }
            const uvLakTable = {
                'sijajni': { '50x35': 0.136, '70x33': 0.150, '70x50': 0.159 },
                'mat': { '50x35': 0.177, '70x33': 0.195, '70x50': 0.207 },
                'relief': { '50x35': 0.223, '70x33': 0.259, '70x50': 0.335 },
                'rubl': { '50x35': 0.277, '70x33': 0.408, '70x50': 0.470 },
                'blescice': { '50x35': 0.340, '70x33': 0.435, '70x50': 0.479 },
                'rubl_sij': { '50x35': 0.413, '70x33': 0.558, '70x50': 0.629 },
                'rubl_mat': { '50x35': 0.454, '70x33': 0.603, '70x50': 0.677 }
            };
            const pricePerSheet = uvLakTable[type] ? uvLakTable[type][format] : 0.025;
            const pricePer1000 = pricePerSheet * 1000;
            const per1000Input = document.getElementById('f-uv-per1000');
            if (per1000Input) {
                per1000Input.value = pricePer1000.toFixed(2);
                updateInputStyles(per1000Input);
            }
        }
        function getLaminationPricePerSheet(w, h, type) {
            let area = w * h;
            let formatClass = 'B1';
            if (area <= 100000) formatClass = 'B4';
            else if (area <= 200000) formatClass = 'B3';
            else if (area <= 400000) formatClass = 'B2';
            else formatClass = 'B1';
            let basePrice = 0;
            if (type === 'sijaj') {
                if (formatClass === 'B1') basePrice = 0.132;
                else if (formatClass === 'B2') basePrice = 0.074;
                else if (formatClass === 'B3') basePrice = 0.049;
                else if (formatClass === 'B4') basePrice = 0.037;
            } else if (type === 'mat') {
                if (formatClass === 'B1') basePrice = 0.234;
                else if (formatClass === 'B2') basePrice = 0.12;
                else if (formatClass === 'B3') basePrice = 0.074;
                else if (formatClass === 'B4') basePrice = 0.049;
            } else if (type === 'soft' || type === 'anti') {
                if (formatClass === 'B1') basePrice = 0.234 * 2;
                else if (formatClass === 'B2') basePrice = 0.12 * 2;
                else if (formatClass === 'B3') basePrice = 0.074 * 2;
                else if (formatClass === 'B4') basePrice = 0.049 * 2;
            }
            return basePrice;
        }
        let g_lastW_calc = 0, g_lastH_calc = 0;
        function calculate(isManual = false) {
            updateWarnings();
            if (!window.g_loadingProject) {
                g_editedQuoteHTML = '';
                g_editedQuoteATHTML = '';
                g_editedWorkOrderHTML = '';
            }
            try {
                const w = parseFloat(document.getElementById('width').value) || 0;
                const h = parseFloat(document.getElementById('height').value) || 0;
                const b = parseFloat(document.getElementById('bleed').value) || 0;
                const g = parseFloat(document.getElementById('gripper').value) || 0;
                const qStr = document.getElementById('quantity').value || "0";
                const qArr = qStr.split(',').map(x => parseFloat(x.trim().replace(/\./g, ''))).filter(x => !isNaN(x) && x > 0);
                const q = qArr[0] || 0;
                const fMode = document.getElementById('item-orientation').value;
                const mFormat = document.getElementById('machine-format').value;
                const sw = parseFloat(document.getElementById('calc-source-w').value) || 1000;
                const sh = parseFloat(document.getElementById('calc-source-h').value) || 700;
                const mType = document.getElementById('calc-machine-type').value;
                const profile = machineProfiles[mType];
                if (q <= 0) return;
                if (!g_manualLayout && (w <= 0 || h <= 0)) return;
                // Če se dimenzije spremenijo, počistimo ročno postavitev
                if (w !== g_lastW_calc || h !== g_lastH_calc) {
                    g_manualLayout = null;
                }
                g_lastW_calc = w;
                g_lastH_calc = h;
                const itemW = w + 2 * b;
                const itemH = h + 2 * b;
                // Preberi ročni vnos stavkov
                const itemsInp = document.getElementById('items-per-sheet');
                let targetCount = parseInt(itemsInp.value) || 0;
                // Če je isManual ali če so se dimenzije spremenile, ne vsiljujemo starega števila stavkov
                if (!g_manualLayout && (isManual || targetCount === g_autoCount)) {
                    targetCount = 0;
                }
                let bestSheet = null;
                let bestLayout = null;
                let bestScore = -1;
                if (g_manualLayout) {
                    bestSheet = sheets.find(s => s.w === g_manualLayout.sheetW && s.h === g_manualLayout.sheetH) || sheets.find(s => s.name === mFormat) || sheets[0];
                    bestLayout = {
                        count: g_manualLayout.items.length,
                        items: g_manualLayout.items,
                        cols: 1, rows: g_manualLayout.items.length, rot: false, isMixed: true, gripEdge: 'H', itemW: 0, itemH: 0
                    };
                } else {
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
                        const isStandard = s.name.startsWith('B') || s.name.startsWith('A') || s.name.startsWith('SRA') || s.name.startsWith('Digital');
                        const standardBonus = isStandard ? 10000000 : 0;
                        const standardBonusNormal = isStandard ? 500 : 0;

                        if (targetCount > 0) {
                            if (isSatisfied) {
                                const sheetArea = s.w * s.h;
                                score = (sYield * 1000000000) + (1000000000000 / sheetArea) + currLayout.count + standardBonus;
                            } else {
                                score = currLayout.count + (isStandard ? 0.1 : 0);
                            }
                        } else {
                            const sheetArea = s.w * s.h;
                            score = (currLayout.count * 1000000) + (sYield * 1000) - (sheetArea / 1000.0) + standardBonusNormal;
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
                }
                if (bestSheet) {
                    g_lastSheetW = bestSheet.w;
                    g_lastSheetH = bestSheet.h;
                    g_lastG = g;
                    const y1 = Math.floor(sw / bestSheet.w) * Math.floor(sh / bestSheet.h);
                    const y2 = Math.floor(sw / bestSheet.h) * Math.floor(sh / bestSheet.w);
                    document.getElementById('calc-source-yield').value = Math.max(y1, y2, 1);
                    const lamType = document.getElementById('f-lam-type').value;
                    const lamPricePerSheet = getLaminationPricePerSheet(bestSheet.w, bestSheet.h, lamType);
                    if (lamPricePerSheet > 0) {
                        document.getElementById('f-lam-per1000').value = lamPricePerSheet.toFixed(4);
                    }
                    if (typeof updateUVLakPrice === 'function') {
                        updateUVLakPrice();
                    }
                }
                if (!bestLayout) {
                    const emptyStateEl = document.getElementById('empty-state');
                    if (emptyStateEl) {
                        emptyStateEl.style.display = 'block';
                        if (w > 0 && h > 0) {
                            emptyStateEl.innerText = "⚠️ Tiskovina je prevelika za izbran stroj ali format!";
                        } else {
                            emptyStateEl.innerText = "Vnesite dimenzije zgoraj za samodejni izračun";
                        }
                    }
                    if (document.getElementById('res-source-sheets-needed')) {
                        document.getElementById('res-source-sheets-needed').innerText = '0';
                    }
                    if (document.getElementById('stats')) document.getElementById('stats').style.display = 'none';
                    if (document.getElementById('source-layout-container')) document.getElementById('source-layout-container').style.display = 'none';
                    if (document.getElementById('machine-layout-container')) document.getElementById('machine-layout-container').style.display = 'none';

                    // Reset sticky footer prices to 0.00
                    const stickyTotal = document.getElementById('sticky-price-total');
                    const stickyPerItem = document.getElementById('sticky-price-per-item');
                    const sticky1000 = document.getElementById('sticky-price-1000');
                    const stickyQty = document.getElementById('sticky-qty');
                    if (stickyQty) stickyQty.innerText = '-';
                    if (stickyTotal) stickyTotal.innerText = '0.00 €';
                    if (stickyPerItem) stickyPerItem.innerText = '0.000 €';
                    if (sticky1000) sticky1000.innerText = '0.00 €';

                    const spPaper = document.getElementById('sticky-p-paper');
                    const spPrep = document.getElementById('sticky-p-prep');
                    const spPrint = document.getElementById('sticky-p-print');
                    const spFinish = document.getElementById('sticky-p-finish');
                    if (spPaper) spPaper.innerText = '0.00 €';
                    if (spPrep) spPrep.innerText = '0.00 €';
                    if (spPrint) spPrint.innerText = '0.00 €';
                    if (spFinish) spFinish.innerText = '0.00 €';

                    if (isManual) {
                        const isObrat = document.getElementById('calc-is-obrat') ? document.getElementById('calc-is-obrat').checked : false;
                        if (isObrat) {
                            alert("Izdelek ne gre na polo! (Nasvet: Imate vklopljeno 'Obračanje / OB', ki zahteva vsaj 2 kosa na poli. Izklopite obračanje ali zmanjšajte format.)");
                        } else {
                            alert("Izdelek ne gre na polo! Preverite format (" + itemW + "x" + itemH + " vključno z bleed-om), prijemalec (" + g + "mm) in format stroja.");
                        }
                    }
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
            } catch (e) { alert("Exception in " + "Function" + ": " + e.message + "\n" + e.stack); console.error(e); }
        }
        function parseMutationDodatekList(str) {
            if (!str || (typeof str !== 'string' && typeof str !== 'number') || !String(str).trim()) return [];
            let parts = String(str).split(/[,;]/).map(s => s.trim()).filter(s => s.length > 0);
            let result = [];
            parts.forEach(part => {
                let match = part.match(/(\d[\d\.]*)/);
                if (match) {
                    let numStr = match[1].replace(/\./g, '');
                    let val = parseInt(numStr);
                    if (!isNaN(val) && val >= 0) {
                        result.push(val);
                    }
                }
            });
            return result;
        }
        function getFormattedColorsString() {
            const f = parseInt(document.getElementById('calc-color-front') ? document.getElementById('calc-color-front').value : 0) || 0;
            const b = parseInt(document.getElementById('calc-color-back') ? document.getElementById('calc-color-back').value : 0) || 0;
            const isOb = document.getElementById('calc-is-obrat') && document.getElementById('calc-is-obrat').checked;
            const isSV = document.getElementById('calc-is-sv') && document.getElementById('calc-is-sv').checked;
            let baseCol = (isOb || isSV) ? (f + '/' + f) : (f + '/' + b);

            const mType = document.getElementById('calc-mut-type') ? document.getElementById('calc-mut-type').value : '';
            if (!mType) return baseCol;

            let numM = 0;
            let mBreak = document.getElementById('calc-mut-breakdown') ? document.getElementById('calc-mut-breakdown').value.trim() : '';
            if (mBreak) {
                let parts = mBreak.split(/[,;]/).map(s => s.trim()).filter(s => s.length > 0);
                if (parts.length > 1) {
                    numM = parts.length - 1; // 3 sorte = 1 osnova + 2 mutaciji!
                } else if (parts.length === 1) {
                    numM = 1;
                }
            }
            if (numM <= 0) {
                numM = parseInt(document.getElementById('calc-mut-qty') ? document.getElementById('calc-mut-qty').value : 0) || 0;
            }
            if (numM <= 0) return baseCol;

            let mutCol = baseCol;
            if (mType === "Mutacija po prvi strani (1/0)") {
                mutCol = f > 0 ? (f + '/0') : '1/0';
            } else if (mType === "Mutacija po drugi strani (0/1)") {
                mutCol = b > 0 ? ('0/' + b) : '0/1';
            }
            return `${baseCol} + ${numM}x mutacija ${mutCol}`;
        }
        function updateMutationPlates() {
            const mutType = document.getElementById('calc-mut-type').value;
            const front = parseInt(document.getElementById('calc-color-front').value) || 0;
            const back = parseInt(document.getElementById('calc-color-back').value) || 0;
            const isObrat = document.getElementById('calc-is-obrat') ? document.getElementById('calc-is-obrat').checked : false;

            const mutBreakdown = document.getElementById('calc-mut-breakdown') ? document.getElementById('calc-mut-breakdown').value.trim() : '';
            const mutQtyInput = document.getElementById('calc-mut-qty');
            let calcMutCount = 0;

            if (mutBreakdown && mutType !== "") {
                let parts = mutBreakdown.split(/[,;]/).map(s => s.trim()).filter(s => s.length > 0);
                if (parts.length > 1) {
                    calcMutCount = parts.length - 1; // 3 sorte = 2 mutaciji!
                } else if (parts.length === 1) {
                    calcMutCount = 1;
                }
            }

            let mutQty = parseInt(mutQtyInput ? mutQtyInput.value : 0) || 0;
            if (calcMutCount > 0) {
                mutQty = calcMutCount;
                if (mutQtyInput && (mutQtyInput.value !== String(calcMutCount))) {
                    mutQtyInput.value = calcMutCount;
                }
            }

            const mutPlatesInput = document.getElementById('calc-mut-plates');
            if (mutPlatesInput) {
                let plates = 0;
                if (mutType === "Mutacija po prvi strani (1/0)") {
                    plates = front;
                } else if (mutType === "Mutacija po drugi strani (0/1)") {
                    plates = back;
                } else if (mutType === "Mutacija obojestransko (1/1)") {
                    plates = isObrat ? front : (front + back);
                }
                mutPlatesInput.value = plates * Math.max(0, mutQty);
            }
        }
        function checkMutationQuantityWarning() {
            const warningEl = document.getElementById('calc-mut-warning');
            if (!warningEl) return;

            const mutType = document.getElementById('calc-mut-type') ? document.getElementById('calc-mut-type').value : "";
            const mutBreakdown = (mutType !== "" && document.getElementById('calc-mut-breakdown')) ? document.getElementById('calc-mut-breakdown').value.trim() : "";

            if (!mutType || !mutBreakdown) {
                warningEl.style.display = 'none';
                return;
            }

            const qtyStr = document.getElementById('quantity') ? document.getElementById('quantity').value : '0';
            const qtyArr = qtyStr.split(',').map(x => parseFloat(x.trim().replace(/\./g, ''))).filter(x => !isNaN(x) && x > 0);
            const targetQty = qtyArr[0] || 0;

            let items = null;
            if (typeof parseMutationBreakdown === 'function') {
                items = parseMutationBreakdown(mutBreakdown, targetQty, 1, 0);
            }
            if (!items) {
                let parts = mutBreakdown.split(/[,;]/).map(s => s.trim()).filter(s => s.length > 0);
                let sum = 0;
                parts.forEach(p => {
                    let m = p.match(/(\d[\d\.]*)/);
                    if (m) sum += (parseInt(m[1].replace(/\./g, '')) || 0);
                });
                if (sum > 0) items = [{ qty: sum }];
            }

            if (items && items.length > 0) {
                let sumQty = items.reduce((acc, it) => acc + (it.qty || 0), 0);
                if (targetQty > 0 && sumQty > targetQty) {
                    warningEl.style.display = 'block';
                    document.getElementById('calc-mut-warning-qty').innerText = sumQty.toLocaleString('de-DE');
                    document.getElementById('calc-mut-warning-target').innerText = targetQty.toLocaleString('de-DE');
                    return;
                }
            }
            warningEl.style.display = 'none';
        }
        function updateWasteAndPrice(needed, q, dw, dh) {
            updateMutationPlates();
            checkMutationQuantityWarning();
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
            const svContainer = document.getElementById('sv-container');
            if (svContainer) {
                if (back > 0 && mType === 'S8') {
                    svContainer.style.display = 'block';
                } else {
                    svContainer.style.display = 'none';
                    const svCheckbox = document.getElementById('calc-is-sv');
                    if (svCheckbox && svCheckbox.checked) {
                        svCheckbox.checked = false;
                        calculate();
                    }
                }
            }
            const isObrat = document.getElementById('calc-is-obrat').checked;
            const mutPlates = parseInt(document.getElementById('calc-mut-plates') ? document.getElementById('calc-mut-plates').value : 0) || 0;
            const totalPlates = front + (isObrat ? 0 : back) + mutPlates;
            document.getElementById('calc-plates-num').value = totalPlates;
            // Odstranjeno prisilno prepisovanje rate, speed in prep-time iz updateWasteAndPrice,
            // tako da lahko uporabnik ročno vnese čas priprave in se ta ne povozi pri vsakem izračunu.
            const qStr = document.getElementById('quantity').value || "0";
            const qArr = qStr.split(',').map(x => parseFloat(x.trim().replace(/\./g, ''))).filter(x => !isNaN(x) && x > 0);
            const totalItemsFormArr = qArr.length ? qArr : [q || 1000];
            const oqStr = document.getElementById('ordered-quantity').value || "";
            const oqArr = oqStr.split(',').map(x => parseFloat(x.trim().replace(/\./g, ''))).filter(x => !isNaN(x) && x > 0);
            let results = [];
            let r = null;
            totalItemsFormArr.forEach((qty, idx) => {
                let currentNeeded = Math.ceil(qty / (parseInt(document.getElementById('items-per-sheet').value) || 1));
                let orderedQty = oqArr[idx] || qty;
                let res = calculateForSingleQty(qty, currentNeeded, dw, dh, orderedQty);
                results.push(res);
                if (qty === q) r = res;
            });
            if (!r && results.length > 0) r = results[0];
            if (!r) return;
            // Show/Hide multi-price breakdown
            const manualPriceList = document.getElementById('manual-price-list');
            if (g_manualLayout && r.itemBreakdown) {
                manualPriceList.style.display = 'block';
                manualPriceList.innerHTML = `<h4 style="margin: 0 0 10px 0; color: #fbbf24; border-bottom: 1px solid rgba(251, 191, 36, 0.2); padding-bottom: 5px;">Cene po dimenzijah:</h4>` +
                    r.itemBreakdown.map(ib => `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding: 10px; background: rgba(255,255,255,0.03); border-radius: 6px;">
                            <div>
                                <strong style="color: #60a5fa;">${ib.dim}</strong><br>
                                <small style="color: #94a3b8;">${ib.countPerSheet} na poli</small>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-weight: bold; color: #34d399;">${formatPrice(ib.perItem, 3)}/kos</div>
                                <div style="font-size: 0.8rem; color: #fbbf24;">${formatPrice(ib.per1000, 2)}/1.000 kos</div>
                            </div>
                        </div>
                    `).join('');
            } else {
                manualPriceList.style.display = 'none';
            }
            document.getElementById('res-count').innerText = r.itemsPerSheet;
            document.getElementById('res-count-mini').innerText = r.itemsPerSheet;
            document.getElementById('res-sheets-needed').innerText = r.sheetsNeeded;
            document.getElementById('res-price-paper').innerText = formatPrice(r.paperCost);
            document.getElementById('res-price-prep').innerText = formatPrice(r.totalPrepCost);
            document.getElementById('res-price-print').innerText = formatPrice(r.totalPrintCost);
            document.getElementById('res-price-finish').innerText = formatPrice(r.totalFinishCost);

            let qItemPola = (r.orderedQty > 0) ? r.orderedQty : ((r.qty > 0) ? r.qty : 1);
            if (document.getElementById('res-price-paper-per-item')) document.getElementById('res-price-paper-per-item').innerText = formatPrice(r.paperCost / qItemPola, 4) + ' / kos';
            if (document.getElementById('res-price-prep-per-item')) document.getElementById('res-price-prep-per-item').innerText = formatPrice(r.totalPrepCost / qItemPola, 4) + ' / kos';
            if (document.getElementById('res-price-print-per-item')) document.getElementById('res-price-print-per-item').innerText = formatPrice(r.totalPrintCost / qItemPola, 4) + ' / kos';
            if (document.getElementById('res-price-finish-per-item')) document.getElementById('res-price-finish-per-item').innerText = formatPrice(r.totalFinishCost / qItemPola, 4) + ' / kos';
            document.getElementById('res-price-total').innerText = formatPrice(r.totalPrice);
            document.getElementById('res-price-per-item-stat-quick').innerText = formatPrice(r.perItemFinal, 3);
            document.getElementById('res-price-per-item-stat-final').innerText = formatPrice(r.perItemFinal, 3);
            if (document.getElementById('comm-price-per-item')) document.getElementById('comm-price-per-item').innerText = formatPrice(r.perItemFinal, 4);
            if (document.getElementById('res-price-1000-stat')) {
                document.getElementById('res-price-1000-stat').innerText = formatPrice(r.perItemFinal * 1000);
            }
            const stickyTotal = document.getElementById('sticky-price-total');
            const stickyPerItem = document.getElementById('sticky-price-per-item');
            const sticky1000 = document.getElementById('sticky-price-1000');
            const stickyQty = document.getElementById('sticky-qty');
            if (totalItemsFormArr.length > 1) {
                let fs = 'font-size: 1.1rem; line-height: 1.5; height: 1.65rem; display: flex; align-items: center; justify-content: center;';
                if (stickyQty) stickyQty.innerHTML = results.map((x, idx) => {
                    const oqVal = oqArr[idx] || x.qty;
                    return `<div style="${fs}">${formatQty(oqVal)}</div>`;
                }).join('');
                if (stickyTotal) stickyTotal.innerHTML = results.map(x => `<div style="${fs}">${formatPrice(x.totalPrice)}</div>`).join('');
                if (stickyPerItem) stickyPerItem.innerHTML = results.map(x => `<div style="${fs}">${formatPrice(x.perItemFinal, 3)}</div>`).join('');
                if (sticky1000) sticky1000.innerHTML = results.map(x => `<div style="${fs}">${formatPrice(x.perItemFinal * 1000)}</div>`).join('');
            } else {
                const oqVal = oqArr[0] || r.qty;
                if (stickyQty) stickyQty.innerText = formatQty(oqVal);
                if (stickyTotal) stickyTotal.innerText = formatPrice(r.totalPrice);
                if (stickyPerItem) stickyPerItem.innerText = formatPrice(r.perItemFinal, 3);
                if (sticky1000) sticky1000.innerText = formatPrice(r.perItemFinal * 1000);
            }
            const spPaper = document.getElementById('sticky-p-paper');
            const spPrep = document.getElementById('sticky-p-prep');
            const spPrint = document.getElementById('sticky-p-print');
            const spFinish = document.getElementById('sticky-p-finish');
            if (spPaper) spPaper.innerText = formatPrice(r.paperCost);
            if (spPrep) spPrep.innerText = formatPrice(r.totalPrepCost);
            if (spPrint) spPrint.innerText = formatPrice(r.totalPrintCost);
            if (spFinish) spFinish.innerText = formatPrice(r.totalFinishCost);
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
                        <span style="color: #93c5fd;">Nerazrezane pole (${d.paper.sourceW}${d.paper.sourceH} ! ${d.paper.sourceYield}x razrez):</span>
                        <span style="font-weight: bold; color: #93c5fd;">${formatQty(d.paper.sourceSheets)} pol</span>
                        ${d.paper.kg > 0 ? `<span>Teža papirja:</span> <span>${d.paper.kg.toFixed(1)} kg</span>` : ''}
                        <div style="grid-column: 1/-1; height: 1px; background: rgba(255,255,255,0.1); margin: 3px 0;"></div>
                        <span>Strošek materiala:</span> <span>${formatPrice(d.paper.cost)}</span>
                    </div>
                </div>
                <!-- PREP -->
                <div style="padding: 10px; background: rgba(167, 139, 250, 0.05); border-radius: 8px;">
                    <div style="font-weight: bold; color: #a78bfa; margin-bottom: 5px;">2. Priprava${d.prep.plates > 0 ? ' in Plošče' : ''}</div>
                    <div style="display: grid; grid-template-columns: 1fr auto; gap: 5px; color: #cbd5e1;">
                        ${d.prep.plates > 0 ? `<span>Cena plošč (${d.prep.plates} kos):</span> <span>${formatPrice(d.prep.platesCost)}</span>` : ''}
                        <span>Pavšalna priprava:</span> <span>${formatPrice(d.prep.setup)}</span>
                        ${d.prep.changes > 0 ? `<span>Menjava plošč:</span> <span>${formatPrice(d.prep.changesCost)}</span>` : ''}
                        ${d.prep.washCost > 0 ? `<span>Pranje stroja:</span> <span>${formatPrice(d.prep.washCost)}</span>` : ''}
                    </div>
                </div>
                <!-- PRINT -->
                <div style="padding: 10px; background: rgba(245, 158, 11, 0.05); border-radius: 8px;">
                    <div style="font-weight: bold; color: #f59e0b; margin-bottom: 5px;">3. Tisk (Strojno delo)</div>
                    <div style="display: grid; grid-template-columns: 1fr auto; gap: 5px; color: #cbd5e1;">
                        ${d.print.mType === 'digital'
                    ? `<span>Cena tiska (${d.paper.totalSheets} pol):</span> <span>${formatPrice(d.print.cost)}</span>`
                    : `<span>Neto čas tiska (${(d.print.hours * 60).toFixed(0)} min pri hitrosti <b>${d.print.mSpeed} pol/h</b>):</span> <span>${formatPrice(d.print.hours * d.print.mRate)}</span>`
                }
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
                        { q: 1000, waste: 320, s150: 3600, s250: 3200, s350: 3000 },
                        { q: 5000, waste: 320, s150: 5070, s250: 5600, s350: 5150 },
                        { q: 10000, waste: 320, s150: 6400, s250: 6000, s350: 5450 },
                        { q: 50000, waste: 320, s150: 6800, s250: 6300, s350: 5700 },
                        { q: 100000, waste: 320, s150: 6800, s250: 6600, s350: 6060 },
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
        function calculateForSingleQty(qty, sheetsNeededIn, drawW, drawH, orderedQty) {
            const qStr_local = document.getElementById('quantity').value || "0";
            const qArr_local = qStr_local.split(',').map(x => parseFloat(x.trim().replace(/\./g, ''))).filter(x => !isNaN(x) && x > 0);
            const q = qArr_local[0] || 0;
            let itemsPerSheet = parseInt(document.getElementById('items-per-sheet').value) || 0;
            let sheetsNeeded = sheetsNeededIn;
            if (itemsPerSheet > 0) {
                sheetsNeeded = Math.ceil(qty / itemsPerSheet);
            } else {
                if (sheetsNeeded === undefined) {
                    sheetsNeeded = parseInt(document.getElementById('res-sheets-needed').innerText) || 0;
                }
                itemsPerSheet = parseInt(document.getElementById('res-count').innerText) || 1;
            }
            if (sheetsNeeded === 0) sheetsNeeded = 1;
            if (drawW === undefined || drawH === undefined) {
                let sizeStr = document.getElementById('res-size').innerText.split('x');
                if (sizeStr.length === 2) {
                    drawW = parseFloat(sizeStr[0].trim());
                    drawH = parseFloat(sizeStr[1].trim());
                } else {
                    drawW = parseFloat(document.getElementById('width').value) || 0;
                    drawH = parseFloat(document.getElementById('height').value) || 0;
                }
            }
            let paperPrice = parseFloat(document.getElementById('calc-paper-price').value.replace(',', '.')) || 0;
            let paperUnit = document.getElementById('calc-paper-unit').value;
            let paperWeight = parseFloat(document.getElementById('calc-paper-weight').value.replace(',', '.')) || 0;
            // Logika za makulaturo po Boss sistemu (preko tabele prepRules)
            const manualWaste = parseFloat(document.getElementById('calc-paper-waste-manual').value);
            let mTypeForWaste = document.getElementById('calc-machine-type').value;
            let paperWasteSheets = 320;
            if (!isNaN(manualWaste)) {
                paperWasteSheets = manualWaste;
            } else if (mTypeForWaste === 'digital') {
                paperWasteSheets = 50;
            } else {
                let _front = parseInt(document.getElementById('calc-color-front').value) || 0;
                let _back = parseInt(document.getElementById('calc-color-back').value) || 0;
                let _isObrat = document.getElementById('calc-is-obrat').checked;
                let _colorMode = _front + '/' + (_isObrat ? 'OB' : _back);
                let _mutPlates = parseInt(document.getElementById('calc-mut-plates').value) || 0;
                let _basicPlates = _front + (_isObrat ? 0 : _back);
                let mutMultiplier = (_mutPlates > 0 && _basicPlates > 0) ? (_mutPlates / _basicPlates) : 0;
                let mutPlatesVal = (_basicPlates > 0) ? Math.ceil(_mutPlates / _basicPlates) : _mutPlates;
                let mutSuffix = "";
                if (mutPlatesVal === 1) mutSuffix = " + mutacija 1x";
                else if (mutPlatesVal === 2) mutSuffix = " + mutacija 2x";
                else if (mutPlatesVal >= 3) mutSuffix = " + mutacija 3x";
                let isSV = document.getElementById('calc-is-sv') ? document.getElementById('calc-is-sv').checked : false;
                let baseColorMode = isSV ? '8/0' : (_isObrat ? '4/OB' : (_back > 0 ? '4/4' : '4/0'));
                let tableMode = baseColorMode + mutSuffix;
                let bossTable = getBossTables()[tableMode] || getBossTables()[isSV ? '8/0' : _colorMode];
                if (bossTable) {
                    let w = bossTable[0].waste;
                    let lookupValue = isSV ? qty : sheetsNeeded; // Lookup waste based on neto sheets
                    if (lookupValue <= bossTable[0].q) {
                        w = bossTable[0].waste;
                    } else if (lookupValue >= bossTable[bossTable.length - 1].q) {
                        w = bossTable[bossTable.length - 1].waste;
                    } else {
                        for (let i = 0; i < bossTable.length - 1; i++) {
                            if (lookupValue >= bossTable[i].q && lookupValue <= bossTable[i + 1].q) {
                                let rangeQ = bossTable[i + 1].q - bossTable[i].q;
                                let rangeW = bossTable[i + 1].waste - bossTable[i].waste;
                                let fraction = (lookupValue - bossTable[i].q) / rangeQ;
                                w = Math.round(bossTable[i].waste + fraction * rangeW);
                                break;
                            }
                        }
                    }
                    let tableMatchedDirectly = !!getBossTables()[tableMode];
                    if (mutMultiplier > 0 && !tableMatchedDirectly) {
                        if (_colorMode === '4/OB') {
                            w += mutMultiplier * 400;
                        } else if (_colorMode === '4/4') {
                            w += mutMultiplier * 2400;
                        } else {
                            w += mutMultiplier * w;
                        }
                    }
                    paperWasteSheets = w;
                } else {
                    let _defaultWaste = (_front + _back) * 150;
                    let _rule = prepRules[_colorMode] || { passes: 1, wasteImpressions: _defaultWaste };
                    let baseWaste = _rule.wasteImpressions;
                    paperWasteSheets = baseWaste + (mutMultiplier * baseWaste);
                }
            }
            if (qty === q) {
                const wasteEl = document.getElementById('calc-paper-waste');
                if (wasteEl) wasteEl.value = paperWasteSheets;
            }
            let _calcColorBack = parseInt(document.getElementById('calc-color-back').value) || 0;
            let _calcIsObrat = document.getElementById('calc-is-obrat').checked;
            let _isSV = document.getElementById('calc-is-sv') ? document.getElementById('calc-is-sv').checked : false;
            let _isDoubleSidedForMat = (_calcColorBack > 0 || _calcIsObrat) && !_isSV;
            let physicalWasteSheets = paperWasteSheets;

            const orderedSheetsInput = document.getElementById('calc-ordered-sheets');
            const orderedSheetsVal = orderedSheetsInput ? (parseInt(orderedSheetsInput.value) || 0) : 0;
            let sourceYield = parseFloat(document.getElementById('calc-source-yield').value) || 1;
            let totalSheetsNeeded = sheetsNeeded + physicalWasteSheets;
            let totalSourceSheetsNeeded = Math.ceil(totalSheetsNeeded / sourceYield);

            if (qty === q) {
                if (document.getElementById('res-source-sheets-needed')) {
                    document.getElementById('res-source-sheets-needed').innerText = totalSourceSheetsNeeded;
                }
            }

            if (orderedSheetsVal > 0) {
                totalSourceSheetsNeeded = orderedSheetsVal;
                totalSheetsNeeded = orderedSheetsVal * sourceYield;
            }

            let paperCost = 0;
            let sourceW = parseFloat(document.getElementById('calc-source-w').value) || 1000;
            let sourceH = parseFloat(document.getElementById('calc-source-h').value) || 700;
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
            function getDynamicSpeed(baseSpeed, grammage, qty) {
                let _front = parseInt(document.getElementById('calc-color-front').value) || 0;
                let _back = parseInt(document.getElementById('calc-color-back').value) || 0;
                let _isObrat = document.getElementById('calc-is-obrat').checked;
                let _mutPlates = parseInt(document.getElementById('calc-mut-plates').value) || 0;
                let _basicPlates = _front + (_isObrat ? 0 : _back);
                let mutPlatesVal = (_basicPlates > 0) ? Math.ceil(_mutPlates / _basicPlates) : _mutPlates;
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
                    if (qty <= bossTable[0].q && bossTable.length > 1) {
                        let rangeQ = bossTable[1].q - bossTable[0].q;
                        let speed1 = getS(bossTable[0]);
                        let speed2 = getS(bossTable[1]);
                        let rangeS = speed2 - speed1;
                        let fraction = (qty - bossTable[0].q) / rangeQ;
                        s = speed1 + fraction * rangeS;
                        s = Math.max(s, speed1 * 0.5); // Prevent extremely low or negative speeds
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
            let frontRaw = parseInt(document.getElementById('calc-color-front').value);
            let front = isNaN(frontRaw) ? 0 : frontRaw;
            let backRaw = parseInt(document.getElementById('calc-color-back').value);
            let back = isNaN(backRaw) ? 0 : backRaw;
            let isObrat = document.getElementById('calc-is-obrat').checked;
            let colorMode = front + '/' + (isObrat ? 'OB' : back);
            let prepPasses = Math.ceil(front / 4) + (back > 0 ? Math.ceil(back / 4) : 0);
            let defaultWaste = (front + back) * 150;
            let rule = prepRules[colorMode] || { passes: prepPasses, wasteImpressions: defaultWaste };
            let isSV = document.getElementById('calc-is-sv') ? document.getElementById('calc-is-sv').checked : false;
            let mPasses = isSV ? 1 : rule.passes;
            let mutPlates = parseInt(document.getElementById('calc-mut-plates').value) || 0;
            let platesNum = parseInt(document.getElementById('calc-plates-num').value) || (front + (isObrat ? 0 : back) + mutPlates);
            let platesPrice = parseFloat(document.getElementById('calc-plates-price').value) || 0;
            let prepPrice = parseFloat(document.getElementById('calc-prep-price').value) || 0;
            let changePrice = parseFloat(document.getElementById('calc-change-price').value) || 0;
            let numberOfChanges = Math.max(0, platesNum - 1);
            let washesNum = parseInt(document.getElementById('calc-color-washes').value) || 0;
            let washPrice = parseFloat(document.getElementById('calc-wash-price').value) || 25;
            let washCost = washesNum * washPrice;
            let totalPrepCost = (platesNum * platesPrice) + prepPrice + (numberOfChanges * changePrice) + washCost;
            let mRate = parseFloat(document.getElementById('calc-machine-rate').value) || 0;
            let mType = document.getElementById('calc-machine-type').value;
            let mProfile = machineProfiles[mType] || { speed: 6900 };
            let printSheets = totalSheetsNeeded;
            let printHours = 0;
            let mSpeed = 0;
            let speedMaxInpVal = document.getElementById('calc-machine-speed-max') ? document.getElementById('calc-machine-speed-max').value : "";
            if (speedMaxInpVal !== "") {
                let rawMachineSpeed = parseFloat(speedMaxInpVal) || mProfile.speed;
                mSpeed = getDynamicSpeed(rawMachineSpeed, paperWeight, totalSheetsNeeded);
                printHours = (printSheets * mPasses) / mSpeed;
            } else {
                // Sedaj za VSE barvne načine in naklade hitrost izračuna iz tabele!
                mSpeed = getDynamicSpeed(mProfile.speed, paperWeight, totalSheetsNeeded);
                printHours = (printSheets * mPasses) / mSpeed;
            }
            if (qty === q) {
                const mSpeedEl = document.getElementById('calc-machine-speed');
                if (mSpeedEl) mSpeedEl.value = Math.round(mSpeed);
            }
            // Strojni čas priprave (priprava tiska v minutah)
            let mPrepInp = document.getElementById('calc-machine-prep-time').value;
            let mPrepMinutes = 30;
            if (mPrepInp !== "") {
                mPrepMinutes = parseFloat(mPrepInp) || 0;
            } else {
                if (isObrat) {
                    mPrepMinutes = 45; // 0,75 h za 4/OB
                } else if (back > 0) {
                    mPrepMinutes = 60; // 1,0 h za 4/4
                } else {
                    mPrepMinutes = 30; // 0,5 h za 4/0
                }
                if (qty === q) {
                    const prepTimeInp = document.getElementById('calc-machine-prep-time');
                    if (prepTimeInp) {
                        let hStr = (mPrepMinutes / 60).toString().replace('.', ',');
                        prepTimeInp.placeholder = "Avto (" + hStr + " h)";
                    }
                }
            }
            let mPrepTime = mPrepMinutes / 60;
            let totalPrintCost = printHours * mRate;
            if (mType === 'digital') {
                platesNum = 0;
                numberOfChanges = 0;
                washesNum = 0;
                washCost = 0;
                prepPrice = 30;
                totalPrepCost = 30; // Fiksna priprava za digitalni tisk, brez plošč
                let isColor = (front > 1 || back > 1);
                let isDoubleSided = (back > 0 || isObrat);
                let perSheetCost = 0;
                if (isColor) {
                    perSheetCost = isDoubleSided ? 0.30 : 0.15;
                } else {
                    perSheetCost = isDoubleSided ? 0.10 : 0.05;
                }
                totalPrintCost = printSheets * perSheetCost;
                printHours = 0; // Strojnega časa za tisk ne upoštevamo po uri
            }
            let totalFinishCost = 0;
            if (mType === 'cooperation') {
                totalPrepCost = 0;
                let coopPrice = parseFloat(document.getElementById('calc-cooperation-price').value) || 0;
                let coopUnit = document.getElementById('calc-cooperation-unit').value;
                if (coopUnit === 'flat') {
                    totalPrintCost = coopPrice;
                } else {
                    totalPrintCost = coopPrice * totalSheetsNeeded;
                }
                printHours = 0;
            }
            if (document.getElementById('f-cilinder-active').checked) {
                let cPrep = parseFloat(document.getElementById('f-cilinder-prep').value) || 0;
                let cRate = parseFloat(document.getElementById('f-cilinder-rate').value) || 0;
                let manualHours = parseFloat(document.getElementById('f-cilinder-hours').value);
                let workHours = 0;
                if (!isNaN(manualHours) && manualHours > 0) {
                    workHours = manualHours;
                } else {
                    let cSpeed = 2000;
                    if (paperWeight >= 300) {
                        cSpeed = 1400;
                    } else if (paperWeight > 150) {
                        cSpeed = 2000 - ((paperWeight - 150) / 150) * (2000 - 1400);
                    }
                    cSpeed = Math.round(cSpeed);
                    workHours = sheetsNeeded / cSpeed;
                }
                totalFinishCost += cPrep + (workHours * cRate);
            }
            if (document.getElementById('f-zgibanje-active').checked) {
                let zFolds = parseInt(document.getElementById('f-zgibanje-folds').value) || 1;
                let zSpeed = parseFloat(document.getElementById('f-zgibanje-speed').value) || 10800;
                let zPrep = (zFolds + 1) * 8.40;
                let zWork = (qty / zSpeed) * 50.76;
                totalFinishCost += zPrep + zWork;
            }
            if (document.getElementById('f-razrez-format-active').checked) {
                let autoCutSpeed = 7400;
                if (paperWeight >= 300) autoCutSpeed = 4100;
                else if (paperWeight > 150) autoCutSpeed = 7400 - ((paperWeight - 150) / 150) * (7400 - 4100);
                autoCutSpeed = Math.round(autoCutSpeed);
                let autoCutRate = 30.00;
                if (qty === q) {
                    document.getElementById('f-razrez-format-speed').placeholder = "Avto (" + autoCutSpeed + ")";
                    document.getElementById('f-razrez-format-rate').placeholder = "Avto (" + autoCutRate + " )";
                }
                const spdInput = document.getElementById('f-razrez-format-speed').value;
                const spd = spdInput !== "" ? parseFloat(spdInput) : autoCutSpeed;
                const rteInput = document.getElementById('f-razrez-format-rate').value;
                const rte = rteInput !== "" ? parseFloat(rteInput) : autoCutRate;
                totalFinishCost += (totalSheetsNeeded / spd) * rte;
            }
            if (document.getElementById('f-lepljenje-active').checked) {
                totalFinishCost += (parseFloat(document.getElementById('f-lepljenje-prep').value) || 0) + qty * (parseFloat(document.getElementById('f-lepljenje-per1000').value) || 0);
            }
            if (document.getElementById('f-spiral-active').checked) {
                totalFinishCost += qty * (parseFloat(document.getElementById('f-spiral-price').value) || 0);
            }
            if (document.getElementById('f-extra-active').checked) {
                const spd = parseFloat(document.getElementById('f-extra-speed').value) || 1;
                const rte = parseFloat(document.getElementById('f-extra-rate').value) || 20;
                totalFinishCost += (qty / spd) * rte;
            }
            if (document.getElementById('f-tool-active').checked) {
                totalFinishCost += (parseFloat(document.getElementById('f-tool-cost').value) || 0);
            }
            if (document.getElementById('f-zasek-grafotehna-active') && document.getElementById('f-zasek-grafotehna-active').checked) {
                totalFinishCost += (parseFloat(document.getElementById('f-zasek-grafotehna-price').value.replace(',', '.')) || 0) * qty;
            }
            if (document.getElementById('f-uv-active').checked) {
                let uPrep = parseFloat(document.getElementById('f-uv-prep').value) || 0;
                let uP1000 = parseFloat(document.getElementById('f-uv-per1000').value) || 0;
                let pricePerSheet = uP1000 / 1000;
                let extraWaste = parseFloat(document.getElementById('f-uv-extra-waste').value) || 0;
                let uvSheetsCalculated = sheetsNeeded + extraWaste;
                totalFinishCost += uPrep + (uvSheetsCalculated * pricePerSheet);
            }
            if (document.getElementById('f-personalization-active') && document.getElementById('f-personalization-active').checked) {
                let persSidesVal = document.getElementById('f-personalization-sides') ? document.getElementById('f-personalization-sides').value : '1/0';
                let pMultiplier = (persSidesVal === '1/1' || persSidesVal === '2') ? 2 : 1;
                let currentSheetW = g_lastSheetW || 0;
                let currentSheetH = g_lastSheetH || 0;
                let maxSheetDim = Math.max(currentSheetW, currentSheetH);
                let digCutFactor = (maxSheetDim > 460 || mType === 'S8') ? 2 : 1;
                let pCost = (sheetsNeeded * digCutFactor * pMultiplier) * (parseFloat(document.getElementById('f-personalization-price').value) || 0);
                
                let extraCost = 0;
                let isB2Sheet = (currentSheetW === 698 && currentSheetH === 498) || (currentSheetW === 498 && currentSheetH === 698);
                if (isB2Sheet) {
                    let razrezSheets = totalSheetsNeeded * 2;
                    let autoCutSpeed = 7400;
                    if (paperWeight >= 300) autoCutSpeed = 4100;
                    else if (paperWeight > 150) autoCutSpeed = 7400 - ((paperWeight - 150) / 150) * (7400 - 4100);
                    extraCost += (razrezSheets / Math.round(autoCutSpeed)) * 30.00;
                } else if (mType === 'S8') {
                    let autoCutSpeed = 7400;
                    if (paperWeight >= 300) autoCutSpeed = 4100;
                    else if (paperWeight > 150) autoCutSpeed = 7400 - ((paperWeight - 150) / 150) * (7400 - 4100);
                    extraCost += (totalSheetsNeeded / autoCutSpeed) * 30.00;
                }
                totalFinishCost += pCost + extraCost;
            }
            if (document.getElementById('f-precut-active') && document.getElementById('f-precut-active').checked) {
                let prePrep = parseFloat(document.getElementById('f-precut-prep').value) || 0;
                let prePer1000 = parseFloat(document.getElementById('f-precut-per1000').value) || 0;
                totalFinishCost += prePrep + (totalSourceSheetsNeeded / 1000) * prePer1000;
            }
            if (document.getElementById('f-lam-active').checked) {
                totalFinishCost += sheetsNeeded * (parseFloat(document.getElementById('f-lam-per1000').value) || 0) * (parseInt(document.getElementById('f-lam-sides').value) || 1);
            }
            let deliveryCost = 0;
            if (document.getElementById('f-delivery-active').checked) {
                let pCount = parseFloat(document.getElementById('f-post-count').value) || 0;
                let pPricePer = parseFloat(document.getElementById('f-post-price-per').value) || 0;
                deliveryCost += (pCount * pPricePer);
            }
            if (document.getElementById('f-del-fixed-active').checked) {
                deliveryCost += (parseFloat(document.getElementById('f-del-fixed-price').value) || 0);
            }
            totalFinishCost += deliveryCost; // Sedaj prištejemo k dodelavi!
            let commercialCost = parseFloat(document.getElementById('calc-commercial').value) || 0;
            let subtotalWithoutDelivery = paperCost + totalPrepCost + totalPrintCost + (totalFinishCost - deliveryCost) + commercialCost;
            if (document.getElementById('calc-minus-price').checked) {
                subtotalWithoutDelivery = subtotalWithoutDelivery * 0.952; // -4.8%
            }
            let subtotal = subtotalWithoutDelivery + deliveryCost;
            let marginPercent = parseFloat(document.getElementById('calc-margin').value) || 0;
            let totalPrice = subtotal;
            if (marginPercent > 0 && marginPercent < 100) {
                totalPrice = subtotal / (1 - (marginPercent / 100)); // RVC izračun
            } else if (marginPercent >= 100) {
                totalPrice = subtotal * (1 + marginPercent / 100); // Standardna marža
            } else if (marginPercent < 0) {
                totalPrice = subtotal * (1 + marginPercent / 100); // Popust
            }
            // perItemFinal: cena na kos za stranko - deli s naročeno naklado (ne tiskano)
            let effectiveQty = (orderedQty && orderedQty > 0) ? orderedQty : qty;
            let perItemFinal = totalPrice / effectiveQty;
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
                    mSpeed: mSpeed,
                    mType: mType,
                    cost: totalPrintCost,
                    gripper: parseFloat(document.getElementById('gripper').value) || 0
                },
                finish: {
                    items: [],
                    cost: totalFinishCost
                }
            };
            // Collect finishing items
            if (document.getElementById('f-cilinder-active').checked) {
                let cPrep = parseFloat(document.getElementById('f-cilinder-prep').value) || 0;
                let cRate = parseFloat(document.getElementById('f-cilinder-rate').value) || 0;
                let manualHours = parseFloat(document.getElementById('f-cilinder-hours').value);
                let workHours = 0;
                let isAuto = true;
                if (!isNaN(manualHours) && manualHours > 0) {
                    workHours = manualHours;
                    isAuto = false;
                } else {
                    let cSpeed = 2000;
                    if (paperWeight >= 300) {
                        cSpeed = 1400;
                    } else if (paperWeight > 150) {
                        cSpeed = 2000 - ((paperWeight - 150) / 150) * (2000 - 1400);
                    }
                    cSpeed = Math.round(cSpeed);
                    workHours = sheetsNeeded / cSpeed;
                }
                let cWork = workHours * cRate;
                let cCost = cPrep + cWork;
                let hourText = isAuto ? `${workHours.toFixed(2)}h (avto)` : `${workHours.toFixed(2)}h (ročno)`;
                details.finish.items.push({
                    name: 'Cilinder (izsek)',
                    cost: cCost,
                    breakdown: `Priprava: ${formatPrice(cPrep)} | Delo: ${hourText} (${formatPrice(cWork)})`
                });
            }
            if (document.getElementById('f-zgibanje-active').checked) {
                let zFolds = parseInt(document.getElementById('f-zgibanje-folds').value) || 1;
                let zSpeed = parseFloat(document.getElementById('f-zgibanje-speed').value) || 10800;
                let workHours = qty / zSpeed;
                let zPrep = (zFolds + 1) * 8.40;
                let zWork = workHours * 50.76;
                let zCost = zPrep + zWork;
                details.finish.items.push({
                    name: `Zgibanje (${zFolds}x)`,
                    cost: zCost,
                    breakdown: `Priprava: ${formatPrice(zPrep)} | Delo: ${workHours.toFixed(2)}h (${formatPrice(zWork)})`
                });
            }
            if (document.getElementById('f-razrez-format-active').checked) {
                let autoCutSpeed = 7400;
                if (paperWeight >= 300) autoCutSpeed = 4100;
                else if (paperWeight > 150) autoCutSpeed = 7400 - ((paperWeight - 150) / 150) * (7400 - 4100);
                autoCutSpeed = Math.round(autoCutSpeed);
                let autoCutRate = 30.00;
                const spdInput = document.getElementById('f-razrez-format-speed').value;
                const spd = spdInput !== "" ? parseFloat(spdInput) : autoCutSpeed;
                const rteInput = document.getElementById('f-razrez-format-rate').value;
                const rte = rteInput !== "" ? parseFloat(rteInput) : autoCutRate;
                const hrs = totalSheetsNeeded / spd;
                let cost = hrs * rte;
                details.finish.items.push({
                    name: 'Razrez',
                    cost: cost,
                    breakdown: `Norma: ${spd} pol/h | Čas: ${hrs.toFixed(2)} h (${formatPrice(cost)})`
                });
            }
            if (document.getElementById('f-lepljenje-active').checked) {
                let lPrep = (parseFloat(document.getElementById('f-lepljenje-prep').value) || 0);
                let lP1000 = (parseFloat(document.getElementById('f-lepljenje-per1000').value) || 0);
                let lWork = qty * lP1000;
                let lCost = lPrep + lWork;
                details.finish.items.push({
                    name: 'Lepljenje Petrata',
                    cost: lCost,
                    breakdown: `Priprava: ${formatPrice(lPrep)} | Delo: ${qty} kos (${formatPrice(lWork)})`
                });
            }
            if (document.getElementById('f-spiral-active').checked) {
                let sPrice = parseFloat(document.getElementById('f-spiral-price').value) || 0;
                let sCost = qty * sPrice;
                details.finish.items.push({
                    name: 'Špiraljenje / Vrvice',
                    cost: sCost,
                    breakdown: `${formatQty(qty)} kos * ${formatPrice(sPrice)}/kos`
                });
            }
            if (document.getElementById('f-extra-active').checked) {
                const spd = parseFloat(document.getElementById('f-extra-speed').value) || 1;
                const rte = parseFloat(document.getElementById('f-extra-rate').value) || 20;
                const hrs = qty / spd;
                let eMan = hrs * rte;
                details.finish.items.push({
                    name: `Ročno delo (Norma: ${spd} kos/h)`,
                    cost: eMan,
                    breakdown: `Čas: ${hrs.toFixed(2)} h po ${formatPrice(rte)}/h = ${formatPrice(eMan)}`
                });
            }
            if (document.getElementById('f-tool-active').checked) {
                let tCost = (parseFloat(document.getElementById('f-tool-cost').value) || 0);
                details.finish.items.push({
                    name: 'Orodje (izsek)',
                    cost: tCost,
                    breakdown: `Strošek izdelave orodja`
                });
            }
            if (document.getElementById('f-zasek-grafotehna-active') && document.getElementById('f-zasek-grafotehna-active').checked) {
                let zPrice = parseFloat(document.getElementById('f-zasek-grafotehna-price').value.replace(',', '.')) || 0;
                let zCost = zPrice * qty;
                details.finish.items.push({
                    name: 'Zasek-Grafotehna',
                    cost: zCost,
                    breakdown: `Cena na komad: ${formatPrice(zPrice)} x ${qty} kom`
                });
            }
            if (document.getElementById('f-uv-active').checked) {
                let uPrep = parseFloat(document.getElementById('f-uv-prep').value) || 0;
                let uP1000 = parseFloat(document.getElementById('f-uv-per1000').value) || 0;
                let pricePerSheet = uP1000 / 1000;
                let extraWaste = parseFloat(document.getElementById('f-uv-extra-waste').value) || 0;
                let uvSheetsCalculated = sheetsNeeded + extraWaste;
                let uWork = uvSheetsCalculated * pricePerSheet;
                let uCost = uPrep + uWork;
                details.finish.items.push({
                    name: 'UV lak (tuja)',
                    cost: uCost,
                    breakdown: `Priprava: ${formatPrice(uPrep)} | Delo: ${sheetsNeeded} (neto) + ${extraWaste} (tiskar) = ${uvSheetsCalculated.toFixed(0)} pol po ${pricePerSheet.toFixed(3)} € (${formatPrice(uWork)})`
                });
            }
            if (document.getElementById('f-personalization-active') && document.getElementById('f-personalization-active').checked) {
                let persSidesSelect = document.getElementById('f-personalization-sides');
                let persSidesText = persSidesSelect ? persSidesSelect.value : '1/0';
                let isBothSides = (persSidesText === '1/1');
                let currentSheetW = g_lastSheetW || 0;
                let currentSheetH = g_lastSheetH || 0;
                let maxSheetDim = Math.max(currentSheetW, currentSheetH);
                let digCutFactor = (maxSheetDim > 460 || mType === 'S8') ? 2 : 1;
                let pMultiplier = isBothSides ? 2 : 1;
                let pDigitalSheets = sheetsNeeded * digCutFactor;
                let pTotalImpressions = pDigitalSheets * pMultiplier;
                let pPrice = (parseFloat(document.getElementById('f-personalization-price').value) || 0);
                let pCost = pTotalImpressions * pPrice;
                let sidesText = isBothSides ? ' (1/1 obojestransko)' : ` (${persSidesText})`;
                let breakdownText = `Delo: ${pTotalImpressions} odtisov${sidesText} na ${pDigitalSheets} pol po ${formatPrice(pPrice)}/odtis = ${formatPrice(pCost)}`;
                let extraCost = 0;
                let isB2Sheet = (currentSheetW === 698 && currentSheetH === 498) || (currentSheetW === 498 && currentSheetH === 698);
                if (isB2Sheet) {
                    // Razrez B2 (698x498) na 2 poli 318x448 za personalizacijo
                    let razrezSheets = totalSheetsNeeded * 2; // Vsaka polo se razreže na 2
                    let autoCutSpeed = 7400;
                    if (paperWeight >= 300) autoCutSpeed = 4100;
                    else if (paperWeight > 150) autoCutSpeed = 7400 - ((paperWeight - 150) / 150) * (7400 - 4100);
                    autoCutSpeed = Math.round(autoCutSpeed);
                    let razrezCost = (razrezSheets / autoCutSpeed) * 30.00;
                    extraCost += razrezCost;
                    breakdownText += ` | Razrez B2->2x(318x448): ${formatPrice(razrezCost)}`;
                    // Dodaj opozorilo
                    if (!window.g_personalizationCutWarningShown) {
                        console.warn('?? PERSONALIZACIJA: B2 polo (698x498) bo razrezana na 2 poli 318x448 za personalizacijo!');
                        window.g_personalizationCutWarningShown = true;
                    }
                } else if (mType === 'S8') {
                    let autoCutSpeed = 7400;
                    if (paperWeight >= 300) autoCutSpeed = 4100;
                    else if (paperWeight > 150) autoCutSpeed = 7400 - ((paperWeight - 150) / 150) * (7400 - 4100);
                    let cutCost = (totalSheetsNeeded / autoCutSpeed) * 30.00;
                    extraCost += cutCost;
                    breakdownText += ` | Dodaten razrez na pol: ${formatPrice(cutCost)}`;
                }
                let nameSuffix = isB2Sheet ? ' (B2->2x 318x448)' : (mType === 'S8' ? ' (Digitalni format - S8)' : '');
                if (isBothSides) nameSuffix = ' (Obojestransko)' + (isB2Sheet ? ' B2->2x' : '');
                details.finish.items.push({
                    name: 'Personalizacija' + nameSuffix + sidesText,
                    cost: pCost + extraCost,
                    breakdown: breakdownText
                });
            }
            if (document.getElementById('f-lam-active').checked) {
                let lP1000 = (parseFloat(document.getElementById('f-lam-per1000').value) || 0);
                let lSides = (parseInt(document.getElementById('f-lam-sides').value) || 1);
                let lWork = sheetsNeeded * lP1000 * lSides;
                let lCost = lWork;
                let lSidesText = lSides === 2 ? '1/1' : '1/0';
                details.finish.items.push({
                    name: `Plastifikacija (${lSidesText})`,
                    cost: lCost,
                    breakdown: `Delo: ${sheetsNeeded} pol (${formatPrice(lWork)})`
                });
            }
            if (document.getElementById('f-delivery-active').checked) {
                let pCount = parseFloat(document.getElementById('f-post-count').value) || 0;
                let pPricePer = parseFloat(document.getElementById('f-post-price-per').value) || 0;
                let totalD = pCount * pPricePer;
                details.finish.items.push({
                    name: 'Dostava (Pošta)',
                    cost: totalD,
                    breakdown: pCount > 0 ? `${pCount}x pošta (${formatPrice(pPricePer)}/dost)` : '0.00  '
                });
            }
            if (document.getElementById('f-del-fixed-active').checked) {
                let fPrice = parseFloat(document.getElementById('f-del-fixed-price').value) || 0;
                details.finish.items.push({
                    name: 'Dostava (Fiksno)',
                    cost: fPrice,
                    breakdown: `Fiksna cena dostave`
                });
            }
            // MULTI-ITEM BREAKDOWN (for manual layout)
            let itemBreakdown = null;
            if (g_manualLayout) {
                const countsByDim = {};
                let totalItemsSumArea = 0;
                g_manualLayout.items.forEach(it => {
                    const key = `${it.w - 2 * it.bleed} x ${it.h - 2 * it.bleed}`;
                    if (!countsByDim[key]) countsByDim[key] = { count: 0, area: (it.w - 2 * it.bleed) * (it.h - 2 * it.bleed) };
                    countsByDim[key].count++;
                    totalItemsSumArea += countsByDim[it.id] ? 0 : (it.w - 2 * it.bleed) * (it.h - 2 * it.bleed); // area sum
                });
                // Actually totalItemsSumArea is sum of all items placed
                totalItemsSumArea = g_manualLayout.items.reduce((acc, it) => acc + (it.w - 2 * it.bleed) * (it.h - 2 * it.bleed), 0);
                itemBreakdown = Object.entries(countsByDim).map(([dim, details]) => {
                    const areaOfTypeOnSheet = details.count * details.area;
                    const priceShareOnSheet = (areaOfTypeOnSheet / totalItemsSumArea) * (totalPrice / sheetsNeeded);
                    const perItem = priceShareOnSheet / details.count;
                    return {
                        dim: dim,
                        countPerSheet: details.count,
                        perItem: perItem,
                        per1000: perItem * 1000
                    };
                });
            }
            return {
                qty: qty,
                orderedQty: effectiveQty,
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
                // Če uporabnik ročno vnese število, počistimo grafično postavitev, ker ni več veljavna
                g_manualLayout = null;
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
                    const cnt = document.getElementById('f-post-count');
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
            let cols = useRotated ? Math.floor(sw / mh) : Math.floor(sw / mw);
            let rows = useRotated ? Math.floor(sh / mw) : Math.floor(sh / mh);
            let itemW = useRotated ? mh : mw;
            let itemH = useRotated ? mw : mh;
            // Always draw with the wider side at the bottom (landscape)
            const isDrawingRotated = sw < sh;
            let drawW = sw;
            let drawH = sh;
            let grainDirection = 'vertical';
            if (isDrawingRotated) {
                drawW = sh;
                drawH = sw;
                // Swap rows/cols and item dimensions to rotate layout
                const tempCols = cols;
                cols = rows;
                rows = tempCols;
                const tempItemW = itemW;
                itemW = itemH;
                itemH = tempItemW;
                // Grain is along sh (horizontal). Flipped: vertical.
                grainDirection = 'vertical';
            } else {
                // Already sw >= sh. Grain is along sh (vertical). Flipped: horizontal.
                grainDirection = 'horizontal';
            }
            const maxW = 400;
            const maxH = 250;
            const scale = Math.min(maxW / drawW, maxH / drawH);
            canvas.width = drawW * scale;
            canvas.height = drawH * scale;
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
            const startX = (drawW - cols * itemW) / 2;
            const startY = (drawH - rows * itemH) / 2;
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    ctx.fillRect((startX + c * itemW) * scale, (startY + r * itemH) * scale, itemW * scale, itemH * scale);
                    ctx.strokeRect((startX + c * itemW) * scale, (startY + r * itemH) * scale, itemW * scale, itemH * scale);
                }
            }
            // Labels
            ctx.fillStyle = '#94a3b8';
            ctx.font = '10px Inter';
            ctx.fillText(`${drawW} mm`, canvas.width / 2 - 15, canvas.height - 5);
            ctx.save();
            ctx.translate(10, canvas.height / 2 + 15);
            ctx.rotate(-Math.PI / 2);
            ctx.fillText(`${drawH} mm`, 0, 0);
            ctx.restore();
            // Grain direction indicator
            ctx.strokeStyle = '#ef4444';
            ctx.setLineDash([8, 4]);
            ctx.lineWidth = 2;
            if (grainDirection === 'vertical') {
                const grainX = canvas.width - 15;
                ctx.beginPath();
                ctx.moveTo(grainX, 20);
                ctx.lineTo(grainX, canvas.height - 20);
                ctx.stroke();
                ctx.setLineDash([]);
                // Arrowheads
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
                // Label
                ctx.save();
                ctx.translate(grainX - 5, canvas.height / 3);
                ctx.rotate(-Math.PI / 2);
                ctx.textAlign = 'center';
                ctx.font = 'bold 9px Inter';
                ctx.fillText('SMER VLAKEN', 0, 0);
                ctx.restore();
            } else {
                const grainY = canvas.height - 15;
                ctx.beginPath();
                ctx.moveTo(20, grainY);
                ctx.lineTo(canvas.width - 20, grainY);
                ctx.stroke();
                ctx.setLineDash([]);
                // Arrowheads
                ctx.fillStyle = '#ef4444';
                // Left arrow
                ctx.beginPath();
                ctx.moveTo(10, grainY);
                ctx.lineTo(20, grainY - 4);
                ctx.lineTo(20, grainY + 4);
                ctx.fill();
                // Right arrow
                ctx.beginPath();
                ctx.moveTo(canvas.width - 10, grainY);
                ctx.lineTo(canvas.width - 20, grainY - 4);
                ctx.lineTo(canvas.width - 20, grainY + 4);
                ctx.fill();
                // Label
                ctx.save();
                ctx.translate(canvas.width / 2, grainY - 5);
                ctx.textAlign = 'center';
                ctx.font = 'bold 9px Inter';
                ctx.fillText('SMER VLAKEN', 0, 0);
                ctx.restore();
            }
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
                if (ctx.roundRect) {
                    ctx.roundRect(bx, by, badgeWidth, badgeHeight, 6);
                } else {
                    ctx.rect(bx, by, badgeWidth, badgeHeight);
                }
                ctx.fill();
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 10px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('ROČNI VNOS', canvas.width / 2, by + 15);
                ctx.restore();
                ctx.textAlign = 'left';
            }
            if (g_manualLayout) {
                g_manualLayout.items.forEach(item => {
                    const x = item.x * scale;
                    const y = item.y * scale;
                    const iw = item.w * scale;
                    const ih = item.h * scale;
                    ctx.fillStyle = 'rgba(96, 165, 250, 0.3)';
                    ctx.strokeStyle = '#3b82f6';
                    ctx.lineWidth = 1;
                    ctx.fillRect(x, y, iw, ih);
                    ctx.strokeRect(x, y, iw, ih);
                    const innerW = iw - (2 * item.bleed * scale);
                    const innerH = ih - (2 * item.bleed * scale);
                    ctx.setLineDash([2, 3]);
                    ctx.strokeStyle = '#1e3a8a';
                    ctx.strokeRect(x + (item.bleed * scale), y + (item.bleed * scale), innerW, innerH);
                    ctx.setLineDash([]);
                    // Add Dimensions (Centered)
                    ctx.fillStyle = '#1e3a8a';
                    ctx.font = 'bold 9px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    const dimLabel = `${Math.round(item.w - 2 * item.bleed)}x${Math.round(item.h - 2 * item.bleed)}`;
                    ctx.fillText(dimLabel, x + iw / 2, y + ih / 2);
                    // Reset alignment for next items
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'alphabetic';
                });
                return;
            }
            if (!layout) return;
            // Grid
            const offsetX = layout.gripEdge === 'W' ? gripper : 0;
            const usableW = layout.gripEdge === 'W' ? sheetW - gripper : sheetW;
            const usableH = layout.gripEdge === 'H' ? sheetH - gripper : sheetH;
            const targetCount = currentCount || layout.count;
            // Poiščemo najbolj uravnoteženo mrežo (cols/rows) za uniformni del
            let uniformCount = layout.isMixed ? (layout.cols * layout.rows) : targetCount;
            let bestC = Math.min(layout.cols, uniformCount);
            let bestR = Math.ceil(uniformCount / (bestC || 1));
            const isObratChecked = document.getElementById('calc-is-obrat') ? document.getElementById('calc-is-obrat').checked : false;
            let foundPerfect = false;
            if (!layout.isMixed) {
                let bestPerfectDiff = 999999;
                for (let tempC = 1; tempC <= layout.cols; tempC++) {
                    if (targetCount % tempC === 0) {
                        let tempR = targetCount / tempC;
                        if (tempR <= layout.rows) {
                            let diff = Math.abs(tempC - tempR);
                            if (isObratChecked && tempC % 2 !== 0) diff += 1000;
                            if (!foundPerfect || diff < bestPerfectDiff || (diff === bestPerfectDiff && tempC > bestC)) {
                                bestC = tempC;
                                bestR = tempR;
                                bestPerfectDiff = diff;
                                foundPerfect = true;
                            }
                        }
                    }
                }
                if (!foundPerfect) {
                    for (let tempC = 1; tempC <= layout.cols; tempC++) {
                        let tempR = Math.ceil(targetCount / tempC);
                        if (tempR <= layout.rows) {
                            let diff = Math.abs(tempC - tempR);
                            let currentBestDiff = Math.abs(bestC - bestR);
                            if (isObratChecked) {
                                if (bestC % 2 !== 0) currentBestDiff += 1000;
                                if (tempC % 2 !== 0) diff += 1000;
                            }
                            if (diff < currentBestDiff || (diff === currentBestDiff && tempC > bestC)) {
                                bestC = tempC;
                                bestR = tempR;
                            }
                        }
                    }
                }
            }
            let usedCols = bestC;
            let usedRows = bestR;
            let gridH = usedRows * layout.itemH;
            let gridW = usedCols * layout.itemW;
            // Če je mešana postavitev, prilagodimo skupno širino in višino glede na dodatne rotirane kose
            if (layout.isMixed && !isObratChecked && targetCount > uniformCount) {
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
            if (!layout.isMixed && targetCount > 0 && !foundPerfect) {
                ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
                ctx.fillRect(0, 0, canvas.width, 30);
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 12px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(`⚠️ OPOZORILO: ${targetCount} kosov ni mogoče simetrično razporediti na to polo!`, canvas.width / 2, 15);
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
        function getAllArchives() {
            var keys = ['tisk_kalkulator_arhiv', 'kuverte_kalkulator_arhiv', 'darko_brosura_arhiv', 'darko_blok_arhiv'];
            var combined = [];
            for (var k = 0; k < keys.length; k++) {
                try {
                    var raw = localStorage.getItem(keys[k]);
                    if (raw) {
                        var parsed = JSON.parse(raw);
                        if (Array.isArray(parsed)) {
                            combined = combined.concat(parsed);
                        }
                    }
                } catch (e) { }
            }
            return combined;
        }
        function getUniqueCustomers() {
            var arhiv = getAllArchives();
            var customers = [];
            for (var i = 0; i < arhiv.length; i++) {
                if (arhiv[i] && arhiv[i].customer) {
                    var c = arhiv[i].customer.trim();
                    if (c && customers.indexOf(c) === -1) customers.push(c);
                }
            }
            try {
                var cache = JSON.parse(localStorage.getItem('petric_customers_cache') || '[]');
                for (var k = 0; k < cache.length; k++) {
                    var cc = cache[k].trim();
                    if (cc && customers.indexOf(cc) === -1) customers.push(cc);
                }
            } catch (e) { }
            customers.sort();
            return customers;
        }
        function getUnifiedCustomersData() {
            var keys = [
                'petric_kalkulacija_arhiv', 
                'petric_pola_arhiv', 
                'darko_blok_arhiv', 
                'petric_tenovis_arhiv',
                'kuverte_kalkulator_arhiv',
                'brosura_kalkulator_arhiv',
                'etikete_kalkulator_arhiv'
            ];
            var allData = [];
            for (var k = 0; k < keys.length; k++) {
                try {
                    var raw = localStorage.getItem(keys[k]);
                    if (raw) {
                        var arr = JSON.parse(raw);
                        if (Array.isArray(arr)) allData = allData.concat(arr);
                    }
                } catch (e) { }
            }
            return allData;
        }

        function getUnifiedCustomersList() {
            var allData = getUnifiedCustomersData();
            var customers = [];
            for (var i = 0; i < allData.length; i++) {
                var p = allData[i];
                if (p && p.customer) {
                    var c = p.customer.trim();
                    if (c && customers.indexOf(c) === -1) {
                        customers.push(c);
                    }
                }
            }
            try {
                var cache = JSON.parse(localStorage.getItem('petric_customers_cache') || '[]');
                for (var j = 0; j < cache.length; j++) {
                    var c2 = cache[j].trim();
                    if (c2 && customers.indexOf(c2) === -1) {
                        customers.push(c2);
                    }
                }
            } catch (e) { }
            customers.sort();
            return customers;
        }

        function renderCustomerList() {
            try {
                var customers = getUnifiedCustomersList();

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
                    item.style.display = "flex";
                    item.style.justifyContent = "space-between";
                    item.style.alignItems = "center";

                    var nameSpan = document.createElement('span');
                    nameSpan.innerText = customers[j];
                    item.appendChild(nameSpan);

                    var delBtn = document.createElement('span');
                    delBtn.innerHTML = '&#10006;'; // X icon
                    delBtn.style.color = '#ef4444';
                    delBtn.style.fontSize = '0.8rem';
                    delBtn.style.padding = '2px 8px';
                    delBtn.style.borderRadius = '4px';
                    delBtn.title = 'Odstrani stranko iz predpomnilnika';
                    delBtn.onclick = (function (name) {
                        return function (e) {
                            e.stopPropagation();
                            if (confirm('Ali res želite odstraniti stranko "' + name + '" iz arhiva? (Če je stranka shranjena v katerem od vaših projektov, se bo morda znova pojavila)')) {
                                var cache = JSON.parse(localStorage.getItem('petric_customers_cache') || '[]');
                                var idx = cache.indexOf(name);
                                if (idx > -1) {
                                    cache.splice(idx, 1);
                                    localStorage.setItem('petric_customers_cache', JSON.stringify(cache));
                                }
                                updateCustomerDatalist();
                                // Also re-render the dropdown list itself
                                renderCustomerList();
                            }
                        };
                    })(customers[j]);
                    delBtn.onmouseover = function () { this.style.background = '#fecaca'; };
                    delBtn.onmouseout = function () { this.style.background = 'transparent'; };
                    item.appendChild(delBtn);

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
            } catch (e) {
                var safeLog = (typeof logDebug === 'function') ? logDebug : console.error;
                safeLog("Napaka renderCustomerList: " + e.message);
            }
        }

        function updateCustomerDatalist() {
            try {
                var customers = getUnifiedCustomersList();

                var dl = document.getElementById('customer-list');
                if (dl) {
                    dl.innerHTML = "";
                    for (var j = 0; j < customers.length; j++) {
                        var opt = document.createElement('option');
                        opt.value = customers[j];
                        dl.appendChild(opt);
                    }
                }
                renderCustomerList();
            } catch (e) {
                var safeLog = (typeof logDebug === 'function') ? logDebug : console.error;
                safeLog("Napaka updateCustomerDatalist: " + e.message);
            }
        }

        function handleCustomerUpdate(val) {
            try {
                var custInput = document.getElementById('calc-customer');
                if (!val) {
                    if (custInput) custInput.dataset.lastCustomer = "";
                    return;
                }
                var search = val.trim().toLowerCase();
                var arhiv = getUnifiedCustomersData();

                var foundMaterialCode = false;
                var uniqueEmails = new Set();
                var uniqueAddresses = new Set();
                var lastEmail = "";
                var lastAddress = "";

                // 1. Zbiranje iz lokalnih arhivov
                for (var i = 0; i < arhiv.length; i++) {
                    var p = arhiv[i];
                    if (p && p.customer && p.customer.trim().toLowerCase() === search) {
                        // 1. Zbiranje e-mailov
                        if (p.custEmail && p.custEmail.trim() !== "") {
                            var em = p.custEmail.trim();
                            uniqueEmails.add(em);
                            lastEmail = em;
                        }
                        // 2. Zbiranje naslovov
                        if (p.custAddress && p.custAddress.trim() !== "") {
                            var adr = p.custAddress.trim();
                            uniqueAddresses.add(adr);
                            lastAddress = adr;
                        }

                        // 3. Avtomatsko izpolnjevanje šifre
                        if (!foundMaterialCode && p.materialCode && p.materialCode.trim().length > 1) {
                            var target = document.getElementById('calc-material-code');
                            if (target && (!target.value || target.value.trim() === "" || target.value.indexOf("npr.") !== -1)) {
                                target.value = p.materialCode;
                                foundMaterialCode = true;
                            }
                        }
                    }
                }

                // 2. Zbiranje iz cache-a kontaktnih podatkov z diska
                try {
                    var contactsCache = JSON.parse(localStorage.getItem('petric_customer_contacts_cache') || '{}');
                    var diskContact = contactsCache[search];
                    if (diskContact) {
                        if (diskContact.email && diskContact.email.trim() !== "") {
                            var de = diskContact.email.trim();
                            uniqueEmails.add(de);
                            lastEmail = de;
                        }
                        if (diskContact.address && diskContact.address.trim() !== "") {
                            var da = diskContact.address.trim();
                            uniqueAddresses.add(da);
                            lastAddress = da;
                        }
                        // Avtomatsko izpolnjevanje šifre stranke, če še ni izpolnjena
                        if (diskContact.code && diskContact.code.trim() !== "") {
                            var codeTarget = document.getElementById('calc-customer-code');
                            if (codeTarget && (!codeTarget.value || codeTarget.value.trim() === "")) {
                                codeTarget.value = diskContact.code.trim();
                            }
                        }
                    }
                } catch (e) { }

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
                }

                // Preveri, ali se je stranka dejansko spremenila (da ne prepisujemo ročnih popravkov ob blur/ponovnem kliku)
                var lastCustomer = custInput ? (custInput.dataset.lastCustomer || "") : "";
                var hasChanged = (val.trim().toLowerCase() !== lastCustomer.toLowerCase());

                if (hasChanged) {
                    if (custInput) custInput.dataset.lastCustomer = val.trim();

                    // Izpolni email, če je na voljo
                    if (emailTarget && lastEmail !== "") {
                        emailTarget.value = lastEmail;
                    }

                    // Izpolni naslov, če je na voljo
                    var addressTarget = document.getElementById('calc-cust-address');
                    if (addressTarget && lastAddress !== "") {
                        addressTarget.value = lastAddress;
                    }
                }
            } catch (e) {
                var safeLog = (typeof logDebug === 'function') ? logDebug : console.error;
                safeLog("Napaka v handleCustomerUpdate: " + e.message);
            }
        }// Attach events safely
        try {
            var custInput = document.getElementById('calc-customer');
            if (custInput) {
                custInput.addEventListener('input', function (e) { handleCustomerUpdate(e.target.value); });
                custInput.addEventListener('change', function (e) { handleCustomerUpdate(e.target.value); });
                custInput.addEventListener('blur', function (e) { handleCustomerUpdate(e.target.value); });
            }
        } catch (e) { alert("Exception in " + "Function" + ": " + e.message + "\n" + e.stack); logDebug("Napaka pri povezovanju dogodkov: " + e.message, true); }
        function saveCurrentProject(btn = null, silent = false) {
            try {
                let name = document.getElementById('calc-project-name').value.trim();
                if (!name) {
                    if (!silent) alert("Prosimo vnesite izdelek (polje 'Vnesite izdelek' zgoraj levo)!");
                    return;
                }
                function gv(id) { var el = document.getElementById(id); return el ? el.value : ''; }
                function gc(id) { var el = document.getElementById(id); return el ? el.checked : false; }
                var projectId = currentLoadedProjectId ? currentLoadedProjectId : Date.now();
                const data = {
                    id: projectId,
                    name: name,
                    _source: 'pola',
                    date: new Date().toLocaleString('de-DE'),
                    customer: gv('calc-customer'),
                    custAddress: gv('calc-cust-address'),
                    deliveryAddress: gv('calc-delivery-address'),
                    custEmail: gv('calc-cust-email'),
                    custId: gv('calc-cust-id'),
                    quoteNum: gv('calc-quote-number'),
                    dnNum: gv('calc-dn-number'),
                    dnOld: gv('calc-dn-old'),
                    deadline: gv('calc-dn-deadline'),
                    packaging: gv('calc-dn-packaging'),
                    givenSheets: gv('calc-given-sheets'),
                    customerCode: gv('calc-customer-code'),
                    productCode: gv('calc-product-code'),
                    preparedBy: gv('calc-prepared-by'),
                    materialCode: gv('calc-material-code'),
                    notes: gv('calc-notes'),
                    mutType: gv('calc-mut-type'),
                    mutQty: gv('calc-mut-qty'),
                    orderType: gv('calc-order-type'),
                    editedQuoteHTML: g_editedQuoteHTML,
                    editedQuoteATHTML: g_editedQuoteATHTML,
                    editedWorkOrderHTML: g_editedWorkOrderHTML,
                    inputs: {
                        givenSheets: gv('calc-given-sheets'),
                        dnNum: gv('calc-dn-number'),
                        dnOld: gv('calc-dn-old'),
                        deadline: gv('calc-dn-deadline'),
                        packaging: gv('calc-dn-packaging'),
                        orderedSheets: gv('calc-ordered-sheets'),
                        machine_format: gv('machine-format'),
                        sourcePreset: gv('calc-source-presets'),
                        sourceW: gv('calc-source-w'),
                        sourceH: gv('calc-source-h'),
                        sourceYield: gv('calc-source-yield'),
                        item_w: gv('width'),
                        item_h: gv('height'),
                        quantity: gv('quantity'),
                        bleed: gv('bleed'),
                        pPrice: gv('calc-paper-price'),
                        pUnit: gv('calc-paper-unit'),
                        pWeight: gv('calc-paper-weight'),
                        pType: gv('calc-paper-type'),
                        pWaste: gv('calc-paper-waste'),
                        wasteManual: gv('calc-paper-waste-manual'),
                        mutPlates: gv('calc-mut-plates'),
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
                        isSV: gc('calc-is-sv'),
                        commercial: gv('calc-commercial'),
                        margin: gv('calc-margin'),
                        itemsPerSheet: gv('items-per-sheet'),
                        itemOrientation: gv('item-orientation'),
                        minusPrice: gc('calc-minus-price'),
                        finish: {
                            cilinder: { active: gc('f-cilinder-active'), prep: gv('f-cilinder-prep'), hours: gv('f-cilinder-hours'), rate: gv('f-cilinder-rate'), dodatek: gv('f-cilinder-dodatek') },
                            zgibanje: { active: gc('f-zgibanje-active'), folds: gv('f-zgibanje-folds'), speed: gv('f-zgibanje-speed') },
                            razrezFormat: { active: gc('f-razrez-format-active'), speed: gv('f-razrez-format-speed'), rate: gv('f-razrez-format-rate') },
                            razrez: { active: gc('f-razrez-format-active'), speed: gv('f-razrez-format-speed'), rate: gv('f-razrez-format-rate') },
                            precut: { active: gc('f-precut-active'), prep: gv('f-precut-prep'), per1000: gv('f-precut-per1000') },
                            lepljenje: { active: gc('f-lepljenje-active'), prep: gv('f-lepljenje-prep'), per1000: gv('f-lepljenje-per1000') },
                            spiral: { active: gc('f-spiral-active'), price: gv('f-spiral-price') },
                            spiraljenje: { active: gc('f-spiral-active'), price: gv('f-spiral-price') },
                            extra: { active: gc('f-extra-active'), speed: gv('f-extra-speed'), rate: gv('f-extra-rate') },
                            tool: { active: gc('f-tool-active'), cost: gv('f-tool-cost') },
                            zasekGrafotehna: { active: gc('f-zasek-grafotehna-active'), price: gv('f-zasek-grafotehna-price') },
                            zasek: { active: gc('f-zasek-grafotehna-active'), price: gv('f-zasek-grafotehna-price') },
                            uv: { active: gc('f-uv-active'), prep: gv('f-uv-prep'), per1000: gv('f-uv-per1000') },
                            personalization: { active: gc('f-personalization-active'), sides: gv('f-personalization-sides'), price: gv('f-personalization-price') },
                            lam: { active: gc('f-lam-active'), type: gv('f-lam-type'), sides: gv('f-lam-sides'), per1000: gv('f-lam-per1000'), prep: gv('f-lam-prep') },
                            delivery: { active: gc('f-delivery-active'), count: gv('f-post-count'), pricePer: gv('f-post-price-per') },
                            delFixed: { active: gc('f-del-fixed-active'), price: gv('f-del-fixed-price') },
                            deliveryFixed: { active: gc('f-del-fixed-active'), price: gv('f-del-fixed-price') }
                        }
                    },
                    results: {
                        total: (document.getElementById('res-price-total') || {}).innerText || '',
                        perItem: (document.getElementById('res-price-per-item-stat-final') || {}).innerText || '',
                        sheets: (document.getElementById('res-sheets-needed') || {}).innerText || ''
                    }
                };
                let arhiv = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
                if (currentLoadedProjectId) {
                    arhiv = arhiv.filter(p => p.id !== currentLoadedProjectId);
                }
                arhiv.push(data);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(arhiv));
                currentLoadedProjectId = projectId;
                renderSavedProjects();
                updateCustomerDatalist();
                if (!silent) {
                    if (btn) {
                        const oldHTML = btn.innerHTML;
                        btn.innerHTML = " ? SHRANJENO";
                        btn.style.background = "#10b981";
                        setTimeout(() => {
                            btn.innerHTML = oldHTML;
                            btn.style.background = "#8b5cf6";
                        }, 2000);
                    } else {
                        alert("Projekt '" + name + "' uspešno shranjen v arhiv!");
                    }
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
                    date: new Date().toLocaleString('de-DE'),
                    customer: gv('calc-customer'),
                    custAddress: gv('calc-cust-address'),
                    deliveryAddress: gv('calc-delivery-address'),
                    custEmail: gv('calc-cust-email'),
                    custId: gv('calc-cust-id'),
                    quoteNum: gv('calc-quote-number'),
                    dnNum: gv('calc-dn-number'),
                    dnOld: gv('calc-dn-old'),
                    deadline: gv('calc-dn-deadline'),
                    packaging: gv('calc-dn-packaging'),
                    givenSheets: gv('calc-given-sheets'),
                    customerCode: gv('calc-customer-code'),
                    productCode: gv('calc-product-code'),
                    preparedBy: gv('calc-prepared-by'),
                    materialCode: gv('calc-material-code'),
                    notes: gv('calc-notes'),
                    mutType: gv('calc-mut-type'),
                    mutQty: gv('calc-mut-qty'),
                    editedQuoteHTML: g_editedQuoteHTML,
                    editedQuoteATHTML: g_editedQuoteATHTML,
                    editedWorkOrderHTML: g_editedWorkOrderHTML,
                    inputs: {
                        givenSheets: gv('calc-given-sheets'),
                        dnNum: gv('calc-dn-number'),
                        dnOld: gv('calc-dn-old'),
                        deadline: gv('calc-dn-deadline'),
                        packaging: gv('calc-dn-packaging'),
                        orderedSheets: gv('calc-ordered-sheets'),
                        machine_format: gv('machine-format'),
                        sourcePreset: gv('calc-source-presets'),
                        sourceW: gv('calc-source-w'),
                        sourceH: gv('calc-source-h'),
                        sourceYield: gv('calc-source-yield'),
                        item_w: gv('width'),
                        item_h: gv('height'),
                        quantity: gv('quantity'),
                        bleed: gv('bleed'),
                        pPrice: gv('calc-paper-price'),
                        pUnit: gv('calc-paper-unit'),
                        pWeight: gv('calc-paper-weight'),
                        pType: gv('calc-paper-type'),
                        pWaste: gv('calc-paper-waste'),
                        wasteManual: gv('calc-paper-waste-manual'),
                        mutPlates: gv('calc-mut-plates'),
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
                        isSV: gc('calc-is-sv'),
                        commercial: gv('calc-commercial'),
                        margin: gv('calc-margin'),
                        itemsPerSheet: gv('items-per-sheet'),
                        itemOrientation: gv('item-orientation'),
                        minusPrice: gc('calc-minus-price'),
                        finish: {
                            cilinder: { active: gc('f-cilinder-active'), prep: gv('f-cilinder-prep'), hours: gv('f-cilinder-hours'), rate: gv('f-cilinder-rate'), dodatek: gv('f-cilinder-dodatek') },
                            zgibanje: { active: gc('f-zgibanje-active'), folds: gv('f-zgibanje-folds'), speed: gv('f-zgibanje-speed') },
                            razrezFormat: { active: gc('f-razrez-format-active'), speed: gv('f-razrez-format-speed'), rate: gv('f-razrez-format-rate') },
                            lepljenje: { active: gc('f-lepljenje-active'), prep: gv('f-lepljenje-prep'), per1000: gv('f-lepljenje-per1000') },
                            spiral: { active: gc('f-spiral-active'), price: gv('f-spiral-price') },
                            extra: { active: gc('f-extra-active'), speed: gv('f-extra-speed'), rate: gv('f-extra-rate') },
                            tool: { active: gc('f-tool-active'), cost: gv('f-tool-cost') },
                            uv: { active: gc('f-uv-active'), prep: gv('f-uv-prep'), per1000: gv('f-uv-per1000') },
                            personalization: { active: gc('f-personalization-active'), sides: gv('f-personalization-sides'), price: gv('f-personalization-price') },
                            lam: { active: gc('f-lam-active'), type: gv('f-lam-type'), sides: gv('f-lam-sides'), per1000: gv('f-lam-per1000'), prep: gv('f-lam-prep') },
                            delivery: { active: gc('f-delivery-active'), count: gv('f-post-count'), pricePer: gv('f-post-price-per') },
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
                const nakladaStr = document.getElementById('quantity') ? document.getElementById('quantity').value : '';
                let s_naklada = nakladaStr.replace(/\s+/g, '').replace(/,/g, '-');
                if (s_naklada) s_naklada = 'nakl.' + s_naklada;

                const cFront = document.getElementById('calc-color-front') ? document.getElementById('calc-color-front').value : '0';
                const cBack = document.getElementById('calc-color-back') ? document.getElementById('calc-color-back').value : '0';
                const cColors = (cFront === '0' && cBack === '0') ? '' : `b${cFront}${cBack}`;

                const quoteNum = document.getElementById('calc-quote-number') ? document.getElementById('calc-quote-number').value.replace(/[\/\\]/g, '-').trim() : '';
                let s_ponudba = quoteNum ? 'pon.' + quoteNum : '';

                const customer = document.getElementById('calc-customer') ? document.getElementById('calc-customer').value.trim() : '';
                const izdelek = name ? name.trim() : '';

                let tParts = [s_ponudba, customer, izdelek, s_naklada, cColors].filter(Boolean);
                const suggestedName = (tParts.length > 0 ? tParts.join('_') : name).replace(/[/\\?%*:|"<> \t]/g, '_').replace(/_+/g, '_') + '.json';
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
                    } catch (e) { if (e.name === 'AbortError') return; alert("Napaka pri shranjevanju: " + e.message); }
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
        var g_diskProjectsMetadata = {};
        async function syncWithFolder() {
            try {
                g_projectsDirHandle = await window.showDirectoryPicker();
                await setHandleInIndexedDB(g_projectsDirHandle, 'pola_dir_handle');
                await refreshDiskProjects();
                renderSavedProjects();
                alert("Mapa uspešno povezana in shranjena!");
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
            extractCustomersFromDisk();
        }
        async function extractCustomersFromDisk() {
            if (!g_diskProjects || g_diskProjects.length === 0) return;
            try {
                var cache = JSON.parse(localStorage.getItem('petric_customers_cache') || '[]');
                var contactsCache = JSON.parse(localStorage.getItem('petric_customer_contacts_cache') || '{}');
                var changed = false;
                for (var i = 0; i < g_diskProjects.length; i++) {
                    try {
                        const file = await g_diskProjects[i].getFile();
                        const content = await file.text();
                        const data = JSON.parse(content);
                        if (data && data.customer) {
                            const c = data.customer.trim();
                            const cKey = c.toLowerCase();
                            if (cache.indexOf(c) === -1) {
                                cache.push(c);
                                changed = true;
                            }

                            var contact = contactsCache[cKey] || {};
                            var contactChanged = false;
                            if (data.custEmail && data.custEmail.trim() !== "" && contact.email !== data.custEmail.trim()) {
                                contact.email = data.custEmail.trim();
                                contactChanged = true;
                            }
                            if (data.custAddress && data.custAddress.trim() !== "" && contact.address !== data.custAddress.trim()) {
                                contact.address = data.custAddress.trim();
                                contactChanged = true;
                            }
                            if (data.customerCode && data.customerCode.trim() !== "" && contact.code !== data.customerCode.trim()) {
                                contact.code = data.customerCode.trim();
                                contactChanged = true;
                            }
                            if (contactChanged) {
                                contactsCache[cKey] = contact;
                                changed = true;
                            }
                        }
                    } catch (e) { }
                }
                if (changed) {
                    localStorage.setItem('petric_customers_cache', JSON.stringify(cache));
                    localStorage.setItem('petric_customer_contacts_cache', JSON.stringify(contactsCache));
                    updateCustomerDatalist();
                }
            } catch (e) { }
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
            function getSearchableText(obj) {
                let text = "";
                for (let key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (key.toLowerCase().includes('html') || key === 'id' || key === 'timestamp') {
                            continue;
                        }
                        let val = obj[key];
                        if (typeof val === 'object' && val !== null) {
                            text += " " + getSearchableText(val);
                        } else if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
                            text += " " + val;
                        }
                    }
                }
                return text;
            }
            const listContent = document.getElementById('projects-list-content');
            if (!listContent) return;
            const searchInput = document.getElementById('project-search-input');
            const filter = searchInput ? searchInput.value.toLowerCase().trim() : "";
            let arhiv = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            let html = "";
            // 1. DODAJ DATOTEKE Z DISKA
            if (g_diskProjects.length > 0) {
                html += '<div style="padding: 5px 12px; background: rgba(16, 185, 129, 0.1); color: #10b981; font-size: 0.7rem; font-weight: bold; border-bottom: 1px solid rgba(16, 185, 129, 0.2);">= DATOTEKE NA DISKU</div>';
                let diskFiltered = g_diskProjects;
                if (filter) diskFiltered = g_diskProjects.filter(e => e.name.toLowerCase().includes(filter));
                diskFiltered.forEach(entry => {
                    let meta = g_diskProjectsMetadata[entry.name];
                    let dateStr = "Lokalna datoteka";
                    let totalStr = "-";
                    let sf = "";
                    let cust = "";
                    if (meta) {
                        if (meta.timestamp) dateStr = new Date(meta.timestamp).toLocaleDateString('sl-SI');
                        if (meta.results && meta.results.total) totalStr = meta.results.total;
                        let preset = (meta.inputs && meta.inputs.sourcePreset && meta.inputs.sourcePreset !== 'custom') ? ` ${meta.inputs.sourcePreset}` : "";
                        if (meta.inputs && meta.inputs.sourceW && meta.inputs.sourceH) sf = ` | Osnovni format:${preset} (${meta.inputs.sourceW}x${meta.inputs.sourceH})`;
                        if (meta.customer) cust = `<div style="font-size: 0.7rem; color: #6ee7b7;">${meta.customer}</div>`;
                    }
                    html += `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; border-bottom: 1px solid #334155; transition: background 0.2s;" class="project-item-row" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">
                            <div style="cursor: pointer; flex: 1; min-width: 0;" onclick="loadProjectFromDisk('${entry.name}'); toggleProjectsDropdown();">
                                <div style="font-weight: bold; color: #10b981; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.85rem;">
                                    = ${entry.name}
                                </div>
                                ${cust}
                                <div style="font-size: 0.7rem; color: #94a3b8; margin-top: 2px;">${dateStr} | ${totalStr}${sf}</div>
                            </div>
                        </div>`;
                });
            }
            // 2. DODAJ ARHIV
            let filtered = filter ? arhiv.filter(proj => {
                const searchStr = getSearchableText(proj).toLowerCase();
                const terms = filter.split(/\s+/).filter(Boolean);
                return terms.every(term => searchStr.includes(term));
            }) : arhiv;
            filtered.sort((a, b) => b.id - a.id);
            if (filtered.length > 0) {
                html += '<div style="padding: 5px 12px; background: rgba(59, 130, 246, 0.1); color: #60a5fa; font-size: 0.7rem; font-weight: bold; border-bottom: 1px solid rgba(59, 130, 246, 0.2);">P+ ARHIV (Baza)</div>';
                filtered.forEach(proj => {
                    const codeDisplay = proj.materialCode ? `<span style="color:#60a5fa; margin-left:5px;">[${proj.materialCode}]</span>` : "";
                    const custDisplay = proj.customer ? `<div style="font-size: 0.7rem; color: #6ee7b7;">${proj.customer}</div>` : "";
                    let preset = (proj.inputs && proj.inputs.sourcePreset && proj.inputs.sourcePreset !== 'custom') ? ` ${proj.inputs.sourcePreset}` : "";
                    const sourceFormatDisplay = (proj.inputs && proj.inputs.sourceW && proj.inputs.sourceH) ? ` | Osnovni format:${preset} (${proj.inputs.sourceW}x${proj.inputs.sourceH})` : "";
                    html += `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; border-bottom: 1px solid #334155; transition: background 0.2s;" class="project-item-row" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">
                            <div style="cursor: pointer; flex: 1; min-width: 0;" onclick="loadProject(${proj.id}); toggleProjectsDropdown();">
                                <div style="font-weight: bold; color: #f8fafc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.85rem;">
                                    ${proj.name} ${codeDisplay}
                                </div>
                                ${custDisplay}
                                <div style="font-size: 0.7rem; color: #94a3b8; margin-top: 2px;">${proj.date} | ${proj.results ? proj.results.total : '-'}${sourceFormatDisplay}</div>
                            </div>
                            <div style="display: flex; gap: 6px; margin-left: 10px;">
                                 <button onclick="exportSingleProject(${proj.id}); event.stopPropagation();" style="background: none; border: none; color: #3b82f6; cursor: pointer; padding: 4px; font-size: 0.9rem;" title="Izvozi">=</button>
                                 <button onclick="deleteProject(${proj.id}); event.stopPropagation();" style="background: none; border: none; color: #ef4444; cursor: pointer; padding: 4px; font-size: 1rem;" title="Briši">'</button>
                            </div>
                        </div>`;
                });
            }
            if (html === "") {
                let msg = 'Arhiv je prazen.';
                if (!g_projectsDirHandle) {
                    msg = '<div style="color:#10b981; font-weight:bold; margin-bottom:10px;">Mapa ni povezana!</div>Kliknite zgornji gumb <br><b style="color:#10b981;">= POVEŽI Z MAPO</b><br>da vidite datoteke na disku.';
                } else {
                    msg = 'V mapi ni bilo najdenih projektov.';
                }
                listContent.innerHTML = '<div style="padding: 20px; text-align: center; color: #94a3b8; font-size: 0.8rem; line-height:1.4;">' + msg + '</div>';
            } else {
                listContent.innerHTML = html;
            }
        }
        function setHandleInIndexedDB(handle, key) {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open('KalkulatorDB', 1);
                request.onupgradeneeded = e => {
                    e.target.result.createObjectStore('handles');
                };
                request.onsuccess = e => {
                    const db = e.target.result;
                    const tx = db.transaction('handles', 'readwrite');
                    const store = tx.objectStore('handles');
                    store.put(handle, key);
                    tx.oncomplete = () => resolve();
                    tx.onerror = () => reject(tx.error);
                };
                request.onerror = e => reject(e.target.error);
            });
        }
        function getHandleFromIndexedDB(key) {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open('KalkulatorDB', 1);
                request.onupgradeneeded = e => {
                    e.target.result.createObjectStore('handles');
                };
                request.onsuccess = e => {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains('handles')) return resolve(null);
                    const tx = db.transaction('handles', 'readonly');
                    const store = tx.objectStore('handles');
                    const getReq = store.get(key);
                    getReq.onsuccess = () => resolve(getReq.result);
                    getReq.onerror = () => reject(getReq.error);
                };
                request.onerror = e => reject(e.target.error);
            });
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
                    } catch (e) { alert("Exception in " + "Function" + ": " + e.message + "\n" + e.stack); console.error("IndexedDB error:", e); }
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
            let tParts = [];
            if (proj.inputs && proj.inputs.quote_num) tParts.push(proj.inputs.quote_num);
            if (proj.customer) tParts.push(proj.customer);
            if (proj.name) tParts.push(proj.name);
            a.download = 'pon._' + tParts.join('_').replace(/[/\\?%*:|"<> \t]/g, '_').replace(/_+/g, '_') + '.json';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => { document.body.removeChild(a); window.URL.revokeObjectURL(url); }, 100);
        }
        // Pomožna funkcija za nalaganje podatkov v polja (skupna za Arhiv in File Import)
        function loadProjectData(proj) {
            window.g_loadingProject = true;
            try {
                function setV(id, val, isChk = false) {
                    var el = document.getElementById(id);
                    if (!el) return;
                    if (isChk) el.checked = !!val; else el.value = (val !== undefined && val !== null) ? val : '';
                    updateInputStyles(el);
                }
                if (!proj) return;
                g_editedQuoteHTML = proj.editedQuoteHTML || '';
                g_editedQuoteATHTML = proj.editedQuoteATHTML || '';
                g_editedWorkOrderHTML = proj.editedWorkOrderHTML || '';
                setV('calc-order-type', proj.orderType || '');
                const inp = proj.inputs || {};
                setV('calc-customer', proj.customer || '');
                setV('calc-cust-address', proj.custAddress || '');
                setV('calc-delivery-address', proj.deliveryAddress || '');
                setV('calc-cust-email', proj.custEmail || '');
                setV('calc-mut-type', proj.mutType || '');
                setV('calc-mut-qty', proj.mutQty || 1);
                setV('calc-mut-plates', proj.mutPlates || 0);
                setV('calc-mut-breakdown', proj.mutBreakdown || inp.mutBreakdown || '');
                setV('calc-mut-dodatek', proj.mutDodatek || inp.mutDodatek || '');
                setV('calc-cust-id', proj.custId || '');
                setV('calc-quote-number', proj.quoteNum || '');
                setV('calc-customer-code', proj.customerCode || '');
                setV('calc-product-code', proj.productCode || '');
                setV('calc-prepared-by', proj.preparedBy || '');
                setV('calc-material-code', proj.materialCode || '');
                setV('calc-notes', proj.notes || '');
                setV('calc-dn-number', proj.dnNum || inp.dnNum || '');
                setV('calc-dn-old', proj.dnOld || inp.dnOld || '');
                setV('calc-dn-deadline', proj.deadline || inp.deadline || '');
                setV('calc-dn-packaging', proj.packaging || inp.packaging || '');
                setV('calc-dn-urgent', proj.isUrgent || inp.isUrgent || false, true);
                setV('calc-given-sheets', proj.givenSheets || inp.givenSheets || '');

                if (inp.machine_format !== undefined) setV('machine-format', inp.machine_format);
                if (inp.sourcePreset !== undefined) setV('calc-source-presets', inp.sourcePreset);
                if (inp.sourceW !== undefined) setV('calc-source-w', inp.sourceW);
                if (inp.sourceH !== undefined) setV('calc-source-h', inp.sourceH);
                if (inp.sourceYield !== undefined) setV('calc-source-yield', inp.sourceYield);
                if (inp.orderedSheets !== undefined) setV('calc-ordered-sheets', inp.orderedSheets);
                if (inp.item_w !== undefined) setV('width', inp.item_w);
                if (inp.item_h !== undefined) setV('height', inp.item_h);
                if (inp.quantity !== undefined) setV('quantity', inp.quantity);
                if (inp.bleed !== undefined) setV('bleed', inp.bleed);
                if (inp.pPrice !== undefined) setV('calc-paper-price', inp.pPrice);
                if (inp.pUnit !== undefined) setV('calc-paper-unit', inp.pUnit);
                if (inp.pWeight !== undefined) setV('calc-paper-weight', inp.pWeight);
                if (inp.pType !== undefined) setV('calc-paper-type', inp.pType);
                if (inp.pWaste !== undefined) setV('calc-paper-waste', inp.pWaste);
                if (inp.platesPrice !== undefined) setV('calc-plates-price', inp.platesPrice);
                if (inp.prepPrice !== undefined) setV('calc-prep-price', inp.prepPrice);
                if (inp.changePrice !== undefined) setV('calc-change-price', inp.changePrice);
                if (inp.machineType !== undefined) setV('calc-machine-type', inp.machineType);
                if (inp.machineRate !== undefined) setV('calc-machine-rate', inp.machineRate);
                if (inp.machineSpeed !== undefined) setV('calc-machine-speed', inp.machineSpeed);
                if (inp.machinePrepTime !== undefined) setV('calc-machine-prep-time', inp.machinePrepTime);
                if (inp.colorFront !== undefined) setV('calc-color-front', inp.colorFront);
                if (inp.colorBack !== undefined) setV('calc-color-back', inp.colorBack);
                if (inp.isObrat !== undefined) setV('calc-is-obrat', inp.isObrat, true);
                if (inp.isSV !== undefined) setV('calc-is-sv', inp.isSV, true);
                if (inp.commercial !== undefined) setV('calc-commercial', inp.commercial);
                if (inp.margin !== undefined) setV('calc-margin', inp.margin);
                if (inp.itemsPerSheet !== undefined) setV('items-per-sheet', inp.itemsPerSheet);
                if (inp.itemOrientation !== undefined) setV('item-orientation', inp.itemOrientation);
                if (inp.minusPrice !== undefined) setV('calc-minus-price', inp.minusPrice, true);

                // Load Finishing
                if (inp.finish) {
                    const f = inp.finish;
                    // First reset optional finishing checkboxes
                    ['cilinder', 'zgibanje', 'tool', 'zasek-grafotehna', 'lepljenje', 'spiral', 'extra', 'uv', 'personalization', 'lam', 'delivery', 'del-fixed'].forEach(t => {
                        setV('f-' + t + '-active', false, true);
                        if (typeof toggleFinishRow === 'function') toggleFinishRow(t);
                    });
                    setV('f-razrez-format-active', true, true);
                    if (typeof toggleFinishRow === 'function') toggleFinishRow('razrez-format');
                    setV('f-precut-active', true, true);
                    if (typeof toggleFinishRow === 'function') toggleFinishRow('precut');

                    const cil = f.cilinder;
                    if (cil) {
                        setV('f-cilinder-active', cil.active, true);
                        if (cil.prep !== undefined) setV('f-cilinder-prep', cil.prep);
                        if (cil.hours !== undefined) setV('f-cilinder-hours', cil.hours);
                        if (cil.rate !== undefined) setV('f-cilinder-rate', cil.rate);
                        if (cil.dodatek !== undefined) setV('f-cilinder-dodatek', cil.dodatek);
                        toggleFinishRow('cilinder');
                    }

                    const zgib = f.zgibanje;
                    if (zgib) {
                        setV('f-zgibanje-active', zgib.active, true);
                        if (zgib.folds !== undefined) setV('f-zgibanje-folds', zgib.folds);
                        if (zgib.speed !== undefined) setV('f-zgibanje-speed', zgib.speed);
                        toggleFinishRow('zgibanje');
                    }

                    const rf = f.razrezFormat || f.razrez;
                    if (rf) {
                        setV('f-razrez-format-active', rf.active !== undefined ? rf.active : true, true);
                        if (rf.speed !== undefined) setV('f-razrez-format-speed', rf.speed);
                        if (rf.rate !== undefined) setV('f-razrez-format-rate', rf.rate);
                        toggleFinishRow('razrez-format');
                    }

                    const pc = f.precut;
                    if (pc) {
                        setV('f-precut-active', pc.active !== undefined ? pc.active : true, true);
                        if (pc.prep !== undefined) setV('f-precut-prep', pc.prep);
                        if (pc.per1000 !== undefined) setV('f-precut-per1000', pc.per1000);
                        toggleFinishRow('precut');
                    }

                    const lep = f.lepljenje;
                    if (lep) {
                        setV('f-lepljenje-active', lep.active, true);
                        if (lep.prep !== undefined) setV('f-lepljenje-prep', lep.prep);
                        if (lep.per1000 !== undefined) setV('f-lepljenje-per1000', lep.per1000);
                        toggleFinishRow('lepljenje');
                    }

                    const sp = f.spiral || f.spiraljenje;
                    if (sp) {
                        setV('f-spiral-active', sp.active, true);
                        if (sp.price !== undefined) setV('f-spiral-price', sp.price);
                        if (sp.kos !== undefined) setV('f-spiral-price', sp.kos);
                        toggleFinishRow('spiral');
                    }

                    const ex = f.extra;
                    if (ex) {
                        setV('f-extra-active', ex.active, true);
                        if (ex.speed !== undefined) setV('f-extra-speed', ex.speed);
                        if (ex.rate !== undefined) setV('f-extra-rate', ex.rate);
                        if (ex.manual !== undefined && document.getElementById('f-extra-speed')) setV('f-extra-speed', ex.manual);
                        toggleFinishRow('extra');
                    }

                    const tl = f.tool;
                    if (tl) {
                        setV('f-tool-active', tl.active, true);
                        if (tl.cost !== undefined) setV('f-tool-cost', tl.cost);
                        toggleFinishRow('tool');
                    }

                    const zg = f.zasekGrafotehna || f.zasek;
                    if (zg) {
                        setV('f-zasek-grafotehna-active', zg.active, true);
                        if (zg.price !== undefined) setV('f-zasek-grafotehna-price', zg.price);
                        toggleFinishRow('zasek-grafotehna');
                    }

                    const uvItem = f.uv;
                    if (uvItem) {
                        setV('f-uv-active', uvItem.active, true);
                        if (uvItem.prep !== undefined) setV('f-uv-prep', uvItem.prep);
                        if (uvItem.per1000 !== undefined) setV('f-uv-per1000', uvItem.per1000);
                        toggleFinishRow('uv');
                    }

                    const pers = f.personalization;
                    if (pers) {
                        setV('f-personalization-active', pers.active, true);
                        if (pers.sides !== undefined) setV('f-personalization-sides', pers.sides);
                        if (pers.price !== undefined) setV('f-personalization-price', pers.price);
                        toggleFinishRow('personalization');
                    }

                    const lm = f.lam;
                    if (lm) {
                        setV('f-lam-active', lm.active, true);
                        if (lm.type !== undefined) setV('f-lam-type', lm.type);
                        if (lm.sides !== undefined) setV('f-lam-sides', lm.sides);
                        if (lm.per1000 !== undefined) setV('f-lam-per1000', lm.per1000);
                        if (lm.prep !== undefined) setV('f-lam-prep', lm.prep);
                        toggleFinishRow('lam');
                    }

                    const del = f.delivery;
                    if (del) {
                        setV('f-delivery-active', del.active, true);
                        if (del.count !== undefined) setV('f-post-count', del.count);
                        if (del.pricePer !== undefined) setV('f-post-price-per', del.pricePer);
                        if (del.km !== undefined) setV('f-post-count', del.km);
                        toggleFinishRow('delivery');
                    }

                    const df = f.delFixed || f.deliveryFixed;
                    if (df) {
                        setV('f-del-fixed-active', df.active, true);
                        if (df.price !== undefined) setV('f-del-fixed-price', df.price);
                        if (df.cost !== undefined) setV('f-del-fixed-price', df.cost);
                        toggleFinishRow('del-fixed');
                    }
                }
                if (proj.name) setV('calc-project-name', proj.name);
                calculate();
            } catch (err) {
                console.error("loadProjectData error:", err);
                alert("Napaka pri nalaganju podatkov projekta: " + err.message);
            } finally {
                window.g_loadingProject = false;
            }
        }
        function loadProject(id) {
            let arhiv = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            let proj = arhiv.find(p => String(p.id) === String(id));
            if (!proj) {
                alert("Projekta ni bilo mogoče najti v arhivu!");
                return;
            }
            currentLoadedProjectId = proj.id;
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
                let customerName = document.getElementById('calc-customer').value.trim();
                if (customerName) {
                    try {
                        let cache = JSON.parse(localStorage.getItem('petric_customers_cache') || '[]');
                        if (cache.indexOf(customerName) === -1) {
                            cache.push(customerName);
                            localStorage.setItem('petric_customers_cache', JSON.stringify(cache));
                            updateCustomerDatalist();
                        }
                    } catch (e) { }
                }
                const data = {
                    name: name,
                    _source: 'tiskovna-pola-kalkulator',
                    customer: document.getElementById('calc-customer').value,
                    materialCode: document.getElementById('calc-material-code').value,
                    timestamp: Date.now(),
                    editedQuoteHTML: g_editedQuoteHTML,
                    editedQuoteATHTML: g_editedQuoteATHTML,
                    editedWorkOrderHTML: g_editedWorkOrderHTML,
                    inputs: {
                        orderedSheets: document.getElementById('calc-ordered-sheets') ? document.getElementById('calc-ordered-sheets').value : '',
                        machine_format: document.getElementById('machine-format').value,
                        sourcePreset: document.getElementById('calc-source-presets').value,
                        sourceW: document.getElementById('calc-source-w').value,
                        sourceH: document.getElementById('calc-source-h').value,
                        sourceYield: document.getElementById('calc-source-yield').value,
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
                        mutBreakdown: document.getElementById('calc-mut-breakdown') ? document.getElementById('calc-mut-breakdown').value : '',
                        mutDodatek: document.getElementById('calc-mut-dodatek') ? document.getElementById('calc-mut-dodatek').value : '',
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
                        isSV: document.getElementById('calc-is-sv') ? document.getElementById('calc-is-sv').checked : false,
                        margin: document.getElementById('calc-margin').value,
                        finish: {
                            cilinder: { active: document.getElementById('f-cilinder-active').checked, prep: document.getElementById('f-cilinder-prep').value, hours: document.getElementById('f-cilinder-hours').value, rate: document.getElementById('f-cilinder-rate').value },
                            zgibanje: { active: document.getElementById('f-zgibanje-active').checked, folds: document.getElementById('f-zgibanje-folds').value, speed: document.getElementById('f-zgibanje-speed').value },
                            razrezFormat: { active: document.getElementById('f-razrez-format-active').checked, speed: document.getElementById('f-razrez-format-speed').value, rate: document.getElementById('f-razrez-format-rate').value },
                            razrez: { active: document.getElementById('f-razrez-format-active').checked, speed: document.getElementById('f-razrez-format-speed').value, rate: document.getElementById('f-razrez-format-rate').value },
                            precut: { active: document.getElementById('f-precut-active') ? document.getElementById('f-precut-active').checked : false, prep: document.getElementById('f-precut-prep') ? document.getElementById('f-precut-prep').value : 5.00, per1000: document.getElementById('f-precut-per1000') ? document.getElementById('f-precut-per1000').value : 3.60 },
                            lepljenje: { active: document.getElementById('f-lepljenje-active').checked, prep: document.getElementById('f-lepljenje-prep').value, per1000: document.getElementById('f-lepljenje-per1000').value },
                            spiral: { active: document.getElementById('f-spiral-active').checked, price: document.getElementById('f-spiral-price').value },
                            spiraljenje: { active: document.getElementById('f-spiral-active').checked, price: document.getElementById('f-spiral-price').value },
                            extra: { active: document.getElementById('f-extra-active').checked, speed: document.getElementById('f-extra-speed').value, rate: document.getElementById('f-extra-rate').value },
                            tool: { active: document.getElementById('f-tool-active').checked, cost: document.getElementById('f-tool-cost').value },
                            zasekGrafotehna: { active: document.getElementById('f-zasek-grafotehna-active') ? document.getElementById('f-zasek-grafotehna-active').checked : false, price: document.getElementById('f-zasek-grafotehna-price') ? document.getElementById('f-zasek-grafotehna-price').value : 0.05 },
                            zasek: { active: document.getElementById('f-zasek-grafotehna-active') ? document.getElementById('f-zasek-grafotehna-active').checked : false, price: document.getElementById('f-zasek-grafotehna-price') ? document.getElementById('f-zasek-grafotehna-price').value : 0.05 },
                            uv: { active: document.getElementById('f-uv-active').checked, prep: document.getElementById('f-uv-prep').value, per1000: document.getElementById('f-uv-per1000').value },
                            personalization: { active: document.getElementById('f-personalization-active') ? document.getElementById('f-personalization-active').checked : false, price: document.getElementById('f-personalization-price') ? document.getElementById('f-personalization-price').value : 0.03 },
                            lam: { active: document.getElementById('f-lam-active').checked, type: document.getElementById('f-lam-type') ? document.getElementById('f-lam-type').value : '', sides: document.getElementById('f-lam-sides') ? document.getElementById('f-lam-sides').value : 1, per1000: document.getElementById('f-lam-per1000') ? document.getElementById('f-lam-per1000').value : 0, prep: document.getElementById('f-lam-prep') ? document.getElementById('f-lam-prep').value : 0 },
                            delivery: { active: document.getElementById('f-delivery-active').checked, count: document.getElementById('f-post-count').value, pricePer: document.getElementById('f-post-price-per').value },
                            delFixed: { active: document.getElementById('f-del-fixed-active').checked, price: document.getElementById('f-del-fixed-price').value },
                            deliveryFixed: { active: document.getElementById('f-del-fixed-active').checked, price: document.getElementById('f-del-fixed-price').value }
                        }
                    }
                };
                const jsonStr = JSON.stringify(data, null, 2);
                const nakladaStr = document.getElementById('quantity') ? document.getElementById('quantity').value : '';
                let s_naklada = nakladaStr.replace(/\s+/g, '').replace(/,/g, '-');
                if (s_naklada) s_naklada = 'nakl.' + s_naklada;

                const cFront = document.getElementById('calc-color-front') ? document.getElementById('calc-color-front').value : '0';
                const cBack = document.getElementById('calc-color-back') ? document.getElementById('calc-color-back').value : '0';
                const cColors = (cFront === '0' && cBack === '0') ? '' : `b${cFront}${cBack}`;

                const quoteNum = document.getElementById('calc-quote-number') ? document.getElementById('calc-quote-number').value.replace(/[\/\\]/g, '-').trim() : '';
                let s_ponudba = quoteNum ? 'pon.' + quoteNum : '';

                const customer = document.getElementById('calc-customer') ? document.getElementById('calc-customer').value.trim() : '';
                const izdelek = name ? name.trim() : '';

                let tParts = [s_ponudba, customer, izdelek, s_naklada, cColors].filter(Boolean);
                const suggestedName = (tParts.length > 0 ? tParts.join('_') : name).replace(/[/\\?%*:|"<> \t]/g, '_').replace(/_+/g, '_') + '.json';
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
                    } catch (e) { if (e.name === 'AbortError') return; alert("Napaka pri shranjevanju: " + e.message); }
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
        function formatMutationBreakdownDisplay(str, isAT) {
            if (!str || !str.trim()) return "";
            let unit = isAT ? 'Stk.' : 'kos';
            let parts = str.split(/[,;]/).map(s => s.trim()).filter(s => s.length > 0);
            let formattedParts = parts.map(part => {
                let hasUnit = /\b(kos|kom|stk|stk\.)\b/i.test(part);
                if (hasUnit) {
                    return part.replace(/\b(kos|kom|stk|stk\.)\b/gi, unit);
                }
                let numMatch = part.match(/(\d[\d\.]*)/);
                if (numMatch) {
                    let numStr = numMatch[1];
                    return part.replace(numStr, `${numStr} ${unit}`);
                }
                return part;
            });
            return formattedParts.join(' + ');
        }
        // --- TISKANJE PONUDBE ---
        function getQuoteHTML(isWord = false, canvasImage = '', isInternal = false, isAT = false) {
            const preparedBy = document.getElementById('calc-prepared-by').value || 'Darko Sužnik';
            const date = new Date().toLocaleDateString('sl-SI');
            const quoteNum = document.getElementById('calc-quote-number').value || '/';
            const orderType = document.getElementById('calc-order-type') ? document.getElementById('calc-order-type').value : '';
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
                const oqStr = document.getElementById('ordered-quantity').value || '';
                const oqArr = oqStr.split(',').map(x => parseFloat(x.trim().replace(/\./g, ''))).filter(x => !isNaN(x) && x > 0);
                const results = [];
                qtyArr.forEach((q, idx) => {
                    const oqVal = oqArr[idx] || q;
                    results.push(calculateForSingleQty(q, undefined, undefined, undefined, oqVal));
                });
                const mutType = document.getElementById('calc-mut-type') ? document.getElementById('calc-mut-type').value : '';
                const mutBreakdown = (mutType !== '' && document.getElementById('calc-mut-breakdown')) ? document.getElementById('calc-mut-breakdown').value.trim() : '';
                const mutDodatek = (mutType !== '' && document.getElementById('calc-mut-dodatek')) ? document.getElementById('calc-mut-dodatek').value : '';
                itemsToPrint = [{
                    name: projectName,
                    type: 'Tiskovna pola',
                    customer: customer,
                    productCode: document.getElementById('calc-product-code') ? document.getElementById('calc-product-code').value : '',
                    materialCode: document.getElementById('calc-material-code') ? document.getElementById('calc-material-code').value : '',
                    mutBreakdown: mutBreakdown,
                    mutDodatek: mutDodatek,
                    spec: {
                        format: document.getElementById('width').value + ' x ' + document.getElementById('height').value + ' mm',
                        paper: document.getElementById('calc-paper-weight').value + 'g ' + (document.getElementById('calc-paper-type').value || ''),
                        colors: getFormattedColorsString(),
                        finishing: getActiveFinishingList()
                    },
                    quantities: results.map(r => ({
                        qty: r.orderedQty,
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
                if (g_manualLayout) {
                    const countsByDim = {};
                    g_manualLayout.items.forEach(it => {
                        const key = `${it.w - 2 * it.bleed} x ${it.h - 2 * it.bleed}`;
                        countsByDim[key] = (countsByDim[key] || 0) + 1;
                    });
                    dimensionDisplay = Object.entries(countsByDim).map(([dim, count]) => `${count}x ${dim} mm`).join('<br>');
                    if (item.internal.bleed > 0) dimensionDisplay += `<br>(+${item.internal.bleed} mm bleed)`;
                }
                return `
                    ${htmlHeader}
                    <head><meta charset="utf-8"><title>MONTAŽA</title><style>body { font-family: 'Arial', sans-serif; padding: 40px; color: #000; text-align: center; } h1 { font-size: 28px; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; } .info { font-size: 20px; margin-bottom: 30px; line-height: 1.5; } .schema-box { border: 1px solid #000; padding: 20px; display: inline-block; background: #fff; } .footer { margin-top: 50px; font-size: 12px; color: #666; font-style: italic; }    .editable-area.waiting-for-paste { cursor: cell !important; outline: 3px dashed #eab308 !important; background-color: #fffbeb !important; }
                
        .input-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

    </style>
            </head>
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
                            <strong>ŠIFRA:</strong> ${item.productCode || item.materialCode || '/'}
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
                let specFinishing = (item.spec && item.spec.finishing) ? item.spec.finishing : '';
                if (isAT && specFinishing) {
                    specFinishing = specFinishing
                        .replace(/Cilinder/gi, 'Zylinder')
                        .replace(/x zgibano/gi, 'x gefalzt')
                        .replace(/Zgibanje/gi, 'Falzen')
                        .replace(/Razrez/gi, 'Zuschnitt')
                        .replace(/Lepljenje/gi, 'Kleben')
                        .replace(/Špiraljenje \/ Vrvice/gi, 'Spiralbindung / Schnüre')
                        .replace(/Ročno delo/gi, 'Handarbeit')
                        .replace(/Orodje/gi, 'Stanzen mit Werkzeug')
                        .replace(/UV lak/gi, 'UV-Lack')
                        .replace(/Plastifikacija/gi, 'Cellophanierung')
                        .replace(/Dostava/gi, 'Lieferung');
                }
                let priceRowsHTML = (item.quantities && Array.isArray(item.quantities)) ? item.quantities.map(q => {
                    let formattedBreakdown = formatMutationBreakdownDisplay(item.mutBreakdown, isAT);
                    return `
                    <tr>
                        <td style="font-weight: bold; padding: 4px;">${formatQty(q.qty)} ${isAT ? 'Stk.' : 'kos'}${formattedBreakdown ? `<br><span style="font-size: 13px; font-weight: 500; color: #1e293b; display: block; margin-top: 2px;">(${formattedBreakdown})</span>` : ''}</td>
                        <td style="padding: 4px;">${formatPrice(q.pricePerUnit !== undefined ? q.pricePerUnit : (q.perItem || 0), 3)}</td>
                        <td style="font-weight: bold; text-align: right; padding: 4px;">${formatPrice(q.priceTotal !== undefined ? q.priceTotal : (q.total || 0), 2)}</td>
                    </tr>`;
                }).join('') : '<tr><td colspan="3" style="padding:4px; color:red;">Manjkajoči podatki o ceni</td></tr>';
                return `
                    <div style="margin-bottom: 25px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
                        <table style="width: 100%; border-collapse: collapse;" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="width: 15%; vertical-align: top; border-right: 1px solid #ddd; padding-right: 5px;">
                                    <span style="font-size: 8px; color: #555; text-transform: uppercase;">${isAT ? 'Številka artikla:' : 'Šifra izdelka:'}</span><br>
                                    <span style="font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; margin-top: 5px; display: block;">${item.productCode || item.materialCode || '/'}</span>
                                </td>
                                <td style="width: 85%; vertical-align: top; padding-left: 10px;">
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <tr><td style="width: 100px; font-weight: bold; font-size: 15px; vertical-align: top;">${isAT ? 'Produkt:' : 'Izdelek:'}</td><td style="font-size: 15px; font-weight: bold; vertical-align: top;">${item.name || '/'}</td></tr>
                                        <tr><td style="width: 100px; font-weight: bold; font-size: 15px; vertical-align: top;">Format:</td><td style="font-size: 15px; font-weight: bold; vertical-align: top;">${(item.spec && item.spec.format) ? item.spec.format : '/'}</td></tr>
                                        ${(item.spec && item.spec.paper) ? `<tr><td style="width: 100px; font-weight: bold; font-size: 15px; vertical-align: top;">${isAT ? 'Papier:' : 'Papir:'}</td><td style="font-size: 15px; font-weight: bold; vertical-align: top;">${item.spec.paper}</td></tr>` : ''}
                                        <tr><td style="width: 100px; font-weight: bold; font-size: 15px; vertical-align: top;">${isAT ? 'Druck:' : 'Tisk:'}</td><td style="font-size: 15px; font-weight: bold; vertical-align: top;">${(item.spec && item.spec.colors) ? item.spec.colors : '/'}</td></tr>
                                        ${specFinishing ? `<tr><td style="width: 100px; font-weight: bold; font-size: 15px; vertical-align: top;">${isAT ? 'Verarbeitung:' : 'Dodel.:'}</td><td style="font-size: 15px; font-weight: bold; vertical-align: top;">${specFinishing}</td></tr>` : ''}
                                        ${deliveryAddress ? `<tr><td style="width: 100px; font-weight: bold; font-size: 15px; vertical-align: top;">${isAT ? 'Lieferung:' : 'Dostava:'}</td><td style="font-size: 15px; font-weight: bold; vertical-align: top;">${deliveryAddress.replace(/\n/g, '<br>')}</td></tr>` : ''}
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; text-align: center; border-top: 1px solid #000; border-bottom: 1px solid #000;">
                            <tr><th style="padding: 4px; border-bottom: 1px solid #000; font-size: 11px;">${isAT ? 'Auflage' : 'Naklada'}</th><th style="padding: 4px; border-bottom: 1px solid #000; font-size: 11px;">${isAT ? 'Preis/ Stk.' : 'Cena/Kom.'}</th><th style="padding: 4px; border-bottom: 1px solid #000; font-size: 11px; text-align: right;">${isAT ? 'Gesamt Preis:' : 'Cena skupno:'}</th></tr>
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
                            <td style="width: 50%; vertical-align: top;"><span style="font-size: 13px;"><strong>${customer}</strong></span><br>${custAddress ? custAddress.replace(/\n/g, '<br>') + '<br>' : ''}${custEmail ? custEmail + '<br>' : ''}</td>
                            <td style="width: 50%; vertical-align: top;" align="right"><table class="info-table" cellpadding="0" cellspacing="0"><tr><td>Datum</td><td>${date}</td></tr><tr><td>${isAT ? 'Kunde' : 'Šifra stranke'}</td><td>${customerCode}</td></tr><tr><td>${isAT ? 'Angebot' : 'Ponudba'}</td><td>${quoteNum}</td></tr>${orderType ? `<tr><td>Tip naloga</td><td style="color:#ef4444; font-weight:bold;">${orderType}</td></tr>` : ''}</table></td>
                        </tr>
                    </table>
                    <h1>${isAT ? 'ANGEBOT' : 'PONUDBA'}</h1>
                    <p style="margin: 5px 0;">${isAT ? 'Herzlichen Dank für Ihr Interesse. Wir können Ihnen folgendes anbieten:' : 'Zahvaljujemo se Vam za Vaše povpraševanje in Vam ponujamo naslednje:'}</p>
                    <p style="margin: 10px 0; min-height: 1.2em; width: 100%; clear: both; font-size: 11px;"></p>
                    ${itemsHtml}
                    <p style="margin: 10px 0; min-height: 1.2em; width: 100%; clear: both; font-size: 11px;"></p>
                    ${isAT ? '<p style="margin: 5px 0; font-weight: bold; text-decoration: underline; text-align: center;">Voraussetzung: Kunde liefert druckfertige Daten</p>' : '<p style="margin: 5px 0;"><strong>Predloga:</strong> Naročnik dostavi visokoresolucijski PDF z dodatkom za obrez!</p>'}
                    <p class="notes">${isAT ? 'Dieses Angebot ist gültig für 30 Tage. Zahlung erfolgt nach 30 Tagen ab Lieferung der Ware. Wir danken Ihnen für Ihre mögliche Bestellung, and wünschen Ihnen einen angenehmen Tag.' : 'Opcijski rok ponudbe je 30 dni. V ceni ni vračunan DDV. Rok plačila 30 dni po prejemu tiskovin. Ponudba je izdelana na osnovi znanih tehničnih podatkov in cen repromaterialov. V primeru odstopanja od zgoraj navedenih parametrov se cena izdelave lahko kadarkoli naknadno popravi.'}</p>
                    <div style="margin-top: 10px; font-size: 10px; font-style: italic;">${isAT ? 'Dieses Angebot hat für Sie erstellt:' : 'Kalkulacijo pripravil:'} ${preparedBy}</div>
            `;
            let contentToRender = (isAT && typeof g_editedQuoteATHTML !== 'undefined' && g_editedQuoteATHTML) ? g_editedQuoteATHTML :
                (!isAT && typeof g_editedQuoteHTML !== 'undefined' && g_editedQuoteHTML) ? g_editedQuoteHTML : defaultContent;
            
            if (isWord) {
                contentToRender = contentToRender.replace(
                    /<div[^>]*style="[^"]*color:\s*(#8c8f91|#475569);[^"]*"[^>]*>\s*tiskarna\s*<\/div>\s*<div[^>]*style="[^"]*color:\s*#f99c26;[^"]*"[^>]*>\s*petrič\s*<\/div>/gi,
                    `<table cellpadding="0" cellspacing="0" style="border: none; margin: 0; padding: 0; font-family: Arial, sans-serif;">
                        <tr><td style="color: $1; font-size: 20px; font-style: italic; font-weight: normal; margin: 0; padding: 0; line-height: 1.1;">tiskarna</td></tr>
                        <tr><td style="color: #f99c26; font-size: 36px; font-style: italic; font-weight: bold; margin: 0; padding: 0; padding-left: 15px; line-height: 1.1;">petrič</td></tr>
                     </table>`
                );
            }
const editedHTMLVar = isAT ? 'g_editedQuoteATHTML' : 'g_editedQuoteHTML';
            const projectName = document.getElementById('calc-project-name').value || '';
            const nakladaStr = document.getElementById('quantity') ? document.getElementById('quantity').value : '';
            const qW = document.getElementById('width') ? document.getElementById('width').value : '';
            const qH = document.getElementById('height') ? document.getElementById('height').value : '';
            const fFormat = (qW && qH) ? `${qW}x${qH}` : '';
            const cFront = document.getElementById('calc-color-front') ? document.getElementById('calc-color-front').value : '';
            const cBack = document.getElementById('calc-color-back') ? document.getElementById('calc-color-back').value : '';
            const cColors = (cFront || cBack) ? `${cFront || 0}-${cBack || 0}` : '';
            let tParts = [];
            if (quoteNum && quoteNum !== '/') tParts.push(quoteNum);
            if (customer) tParts.push(customer);
            if (projectName) tParts.push(projectName);
            if (fFormat) tParts.push(fFormat);
            if (cColors) tParts.push(cColors);
            if (nakladaStr) tParts.push(nakladaStr + "kos");
            let docTitle = (isAT ? 'ang._' : 'pon._') + tParts.join('_').replace(/[/\\?%*:|"<> \t]/g, '_').replace(/_+/g, '_');
            return `
                ${htmlHeader}
                <head><meta charset="utf-8"><title>${docTitle}</title>
                <style>
                    @page { size: A4 portrait; margin: 10mm; }
                    body { font-family: 'Arial', sans-serif; padding: ${isWord ? '10px' : '0'}; color: #000; line-height: 1.1; font-size: 11px; margin: 0; }
                    .info-table { border-collapse: collapse; margin-left: auto; margin-right: 0; }
                    .info-table td { padding: 1px 0 1px 15px; text-align: right; }
                    .info-table td:first-child { font-weight: normal; color: #555; font-size: 9px; }
                    .info-table td:last-child { font-weight: bold; }
                    h1 { font-size: 14px; font-weight: bold; margin-top: 10px; margin-bottom: 5px; letter-spacing: 1px; border-bottom: 1px solid #000; padding-bottom: 3px; }
                    .notes { margin-top: 10px; text-align: justify; font-size: 9px; line-height: 1.1; color: #444; }
                    @media print {
                        .no-print { display: none !important; }
                        html, body { width: 100% !important; margin: 0 !important; padding: 0 !important; }
                        .editable-area { width: 100% !important; max-width: 210mm !important; box-sizing: border-box !important; padding: 0 !important; height: auto !important; overflow: visible !important; }
                    }
                    .editable-area { max-width: 210mm; width: 100%; margin: 0 auto; box-sizing: border-box; height: auto; overflow: visible; }
                    .editable-area:focus { outline: 2px dashed #f99c26; background-color: #fffbeb; }
                    .editable-area p, .editable-area div:not(.header-top) { margin: 0; padding: 0; }
                    .editable-area.waiting-for-paste { cursor: cell !important; outline: 3px dashed #eab308 !important; background-color: #fffbeb !important; }
                
        .input-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

    </style>
            </head>
                <body>
                    ${!isWord ? `
                    <div class="no-print" contenteditable="false" style="background: #f1f5f9; padding: 10px; border-bottom: 1px solid #cbd5e1; display: flex; gap: 15px; align-items: center; justify-content: start; font-family: sans-serif; box-sizing: border-box; width: 100%;">
                        <button onclick="window.print()" style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px;">NATISNI PONUDBO</button>
                        <button onclick="window.close()" style="background: #64748b; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px;">ZAPRI</button>
                        <button onclick="if(confirm('Ali želite ponastaviti ponudbo na privzete vrednosti? (Spremembe besedila bodo izgubljene)')){ if(window.opener){ window.opener.${editedHTMLVar}=''; const newHtml = window.opener.getQuoteHTML(false, '', false, ${isAT}); document.open(); document.write(newHtml); document.close(); } }" style="background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px;">PONASTAVI</button>
                    <button id="btn-move-text" onclick="toggleMoveMode(this)" style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px;" title="Premakni označeno besedilo na drugo mesto. Označite besedilo, kliknite ta gumb in nato kliknite na novo mesto v besedilu.">PREMAKNI</button>
                    <button onclick="saveQuoteToDisk()" style="background: #8b5cf6; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px;" title="Shrani to ponudbo v Word (.doc) formatu na računalnik">SHRANI PONUDBO (WORD)</button>
                        <div style="display: flex; gap: 4px; align-items: center; background: #cbd5e1; padding: 3px; border-radius: 6px;">
                            <button onclick="document.execCommand('bold', false, null)" style="background: white; border: none; border-radius: 4px; width: 28px; height: 28px; font-weight: bold; cursor: pointer; color: #000; font-size: 14px;" title="Krepko (Bold)">B</button>
                            <button onclick="document.execCommand('italic', false, null)" style="background: white; border: none; border-radius: 4px; width: 28px; height: 28px; font-style: italic; cursor: pointer; color: #000; font-size: 14px; font-family: Georgia, serif;" title="Ležeče (Italic)">I</button>
                            <button onclick="document.execCommand('underline', false, null)" style="background: white; border: none; border-radius: 4px; width: 28px; height: 28px; text-decoration: underline; cursor: pointer; color: #000; font-size: 14px;" title="Podčrtano (Underline)">U</button>
                            <select onchange="const sel = window.getSelection(); if (sel.rangeCount) { const range = sel.getRangeAt(0); if (range.toString().length > 0) { const span = document.createElement('span'); span.style.fontSize = this.value; span.appendChild(range.extractContents()); range.insertNode(span); } }; this.value='';" style="background: white; border: none; border-radius: 4px; height: 28px; padding: 0 5px; font-size: 12px; cursor: pointer; color: #000; width: 90px;" title="Velikost pisave">
                                <option value="" disabled selected>Velikost</option>
                                <option value="9px">9 px</option>
                                <option value="10px">10 px</option>
                                <option value="11px">11 px</option>
                                <option value="12px">12 px</option>
                                <option value="13px">13 px</option>
                                <option value="14px">14 px</option>
                                <option value="16px">16 px</option>
                                <option value="18px">18 px</option>
                                <option value="20px">20 px</option>
                                <option value="24px">24 px</option>
                                <option value="28px">28 px</option>
                            </select>
                            <button onclick="const p = document.createElement('p'); p.style.margin = '10px 0'; p.style.minHeight = '1.2em'; p.style.width = '100%'; p.style.clear = 'both'; p.style.fontSize = '12px'; p.innerText = 'Nova vrstica besedila...'; const sel = window.getSelection(); if (sel.rangeCount) { const range = sel.getRangeAt(0); range.insertNode(p); } else { document.querySelector('.editable-area').appendChild(p); }" style="background: white; border: none; border-radius: 4px; height: 28px; padding: 0 8px; font-size: 12px; cursor: pointer; color: #000; font-weight: bold;" title="Dodaj vrstico besedila preko cele strani">+ Dodaj vrstico</button>
                        </div>
                        <div style="font-size: 12px; color: #475569; margin-left: 5px;">?? Spremembe besedila se samodejno shranjujejo v kalkulacijo.</div>
                    </div>
                    ` : ''}
                    <div class="editable-area" ${!isWord ? 'contenteditable="true"' : ''} style="padding: ${isWord ? '10px' : '30px'};">
                        ${contentToRender}
                    </div>
                    <script>
                        // Sync changes to parent window
                        let moveData = null;
                        let waitingForPaste = false;
                        
                        window.toggleMoveMode = function(btn) {
                            const sel = window.getSelection();
                            const area = document.querySelector('.editable-area');
                            if (!waitingForPaste) {
                                if (sel.rangeCount && sel.toString().trim().length > 0) {
                                    const range = sel.getRangeAt(0);
                                    moveData = range.cloneContents();
                                    range.deleteContents();
                                    waitingForPaste = true;
                                    btn.innerText = "VSTAVI TU";
                                    btn.style.background = "#eab308";
                                    area.classList.add('waiting-for-paste');
                                    if (typeof sync === 'function') sync();
                                } else {
                                    alert("Najprej z miško označite (pobarvajte) del besedila ali vrstico, ki jo želite premakniti.");
                                }
                            } else {
                                waitingForPaste = false;
                                moveData = null;
                                btn.innerText = "PREMAKNI";
                                btn.style.background = "#3b82f6";
                                area.classList.remove('waiting-for-paste');
                            }
                        };
                        
                        const area = document.querySelector('.editable-area');
                        if (area) {
                            const sync = () => {
                                if (window.opener && !window.opener.closed) {
                                    window.opener.${editedHTMLVar} = area.innerHTML;
                                }
                            };
                            area.addEventListener('click', function(e) {
                                if (waitingForPaste && moveData) {
                                    e.preventDefault();
                                    const sel = window.getSelection();
                                    if (sel.rangeCount) {
                                        const range = sel.getRangeAt(0);
                                        range.deleteContents();
                                        range.insertNode(moveData);
                                        
                                        waitingForPaste = false;
                                        moveData = null;
                                        area.classList.remove('waiting-for-paste');
                                        
                                        const btn = document.getElementById('btn-move-text');
                                        if (btn) {
                                            btn.innerText = "PREMAKNI";
                                            btn.style.background = "#3b82f6";
                                        }
                                        if (typeof sync === 'function') sync();
                                    }
                                }
                            });
                            
                            area.addEventListener('input', sync);
                            area.addEventListener('blur', sync);
                            window.addEventListener('beforeunload', sync);
                        }
                        document.addEventListener('keydown', function(e) {
                            if (e.key === 'Enter') {
                                let selection = window.getSelection();
                                if (!selection.rangeCount) return;
                                let container = selection.getRangeAt(0).commonAncestorContainer;
                                let editable = null;
                                if (container.nodeType === 1) {
                                    editable = container.closest('[contenteditable="true"]');
                                } else if (container.parentNode) {
                                    editable = container.parentNode.closest('[contenteditable="true"]');
                                }
                                if (editable) {
                                    e.preventDefault();
                                    document.execCommand('insertLineBreak', false, null);
                                }
                            }
                        });

                        function saveQuoteToDisk() {
                            try {
                                var area = document.querySelector('.editable-area');
                                var content = area ? area.innerHTML : document.body.innerHTML;
                                var fileName = (document.title || 'ponudba').replace(/[/\\?%*:|"<> \t]/g, '_').replace(/_+/g, '_');
                                if (!fileName || fileName === '_') fileName = "ponudba";
                                if (!fileName.endsWith('.doc')) fileName += ".doc";

                                if (window.opener && !window.opener.closed && typeof window.opener.downloadWordDoc === 'function') {
                                    window.opener.downloadWordDoc(fileName, content);
                                    return;
                                }

                                var bom = String.fromCharCode(0xFEFF);
                                var htmlContent = "<!DOCTYPE html><html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>" + fileName + "</title><style>body { font-family: Arial, sans-serif; font-size: 11px; margin: 0; padding: 10px; } table { width: 100%; border-collapse: collapse; } td, th { padding: 4px; }
        .input-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

    </style></head><body>" + content + "</body></html>";
                                var base64 = btoa(unescape(encodeURIComponent(bom + htmlContent)));
                                var dataUri = 'data:application/msword;base64,' + base64;

                                var a = document.createElement('a');
                                a.href = dataUri;
                                a.download = fileName;
                                document.body.appendChild(a);
                                a.click();
                                setTimeout(function() { if (a.parentNode) a.parentNode.removeChild(a); }, 300);
                            } catch (err) {
                                alert("Napaka pri shranjevanju: " + err.message);
                            }
                        }
                    <\/script>
                </body></html>`;
        }

        async function odpisiMaterial() {
            try {
                const sifrMat = document.getElementById('calc-material-code') ? document.getElementById('calc-material-code').value : '';
                if (!sifrMat || sifrMat.trim() === '/' || sifrMat.trim() === '') {
                    alert("Šifra materiala ni vpisana v kalkulaciji!");
                    return;
                }

                const qtyStr = document.getElementById('quantity') ? document.getElementById('quantity').value : '0';
                const qtyArr = qtyStr.split(',').map(x => parseFloat(x.trim().replace(/\./g, ''))).filter(x => !isNaN(x) && x > 0);
                const q = qtyArr[0] || 0;
                let calcRes = typeof calculateForSingleQty === 'function' ? calculateForSingleQty(q) : null;
                if (!calcRes || !calcRes.details || !calcRes.details.paper) {
                    alert("Najprej izračunajte kalkulacijo!");
                    return;
                }
                const unitsToSubtract = calcRes.details.paper.sourceSheets || 0;
                if (unitsToSubtract <= 0) {
                    alert("Število pol za odpis je 0.");
                    return;
                }

                if (!confirm(`Ali želite odpisati ${unitsToSubtract} pol materiala ${sifrMat} iz zaloge?\n\nV naslednjem koraku boste morali izbrati datoteko zalogaSimon.json.`)) {
                    return;
                }

                let fileHandle;
                if (typeof window.showOpenFilePicker !== 'function') {
                    alert("Vaš brskalnik ne podpira avtomatskega shranjevanja datotek (priporočamo Chrome ali Edge).");
                    return;
                }

                try {
                    [fileHandle] = await window.showOpenFilePicker({
                        types: [{
                            description: 'Zaloga JSON (zalogaSimon.json)',
                            accept: { 'application/json': ['.json'] }
                        }],
                        multiple: false
                    });
                } catch (pickerErr) {
                    // This happens if the user cancels the picker or if it's blocked by security
                    if (pickerErr.name === 'AbortError') return;
                    alert("Napaka pri odpiranju datoteke (morda nimate ustreznih pravic): " + pickerErr.message);
                    return;
                }

                const file = await fileHandle.getFile();
                const contents = await file.text();
                let zaloga;
                try {
                    zaloga = JSON.parse(contents);
                } catch (e) {
                    alert("Datoteka ni veljaven JSON.");
                    return;
                }

                let foundItem = zaloga.find(item => String(item['šifra materiala']) === String(sifrMat.trim()));
                if (!foundItem) {
                    alert("Material s šifro '" + sifrMat + "' ni bil najden v zalogi.");
                    return;
                }

                if (typeof foundItem.zaloga === 'undefined') {
                    foundItem.zaloga = 0;
                }
                foundItem.zaloga -= unitsToSubtract;

                const writable = await fileHandle.createWritable();
                await writable.write(JSON.stringify(zaloga, null, 4));
                await writable.close();

                alert(`Uspešno odpisano ${unitsToSubtract} pol materiala s šifro ${sifrMat}.\nNova zaloga: ${foundItem.zaloga}`);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    alert("Napaka pri odpisu: " + err.message);
                }
            }
        }

        function getWorkOrderHTML() {
            const qtyStr = document.getElementById('quantity').value || '0';
            const qtyArr = qtyStr.split(',').map(x => parseFloat(x.trim().replace(/\./g, ''))).filter(x => !isNaN(x) && x > 0);
            const q = qtyArr[0] || 0;
            let calcRes = calculateForSingleQty(q);
            if (!calcRes) return "Napaka pri generiranju naloga.";
            const mutType = document.getElementById('calc-mut-type') ? document.getElementById('calc-mut-type').value : "";
            const hasMutations = mutType !== "";

            // Preberi dodatek iz polja "Dodatne pole tiskarju" (ID: calc-given-sheets) in "Dodatek na mutacijo (pol)" (ID: calc-mut-dodatek)
            const givenDodatekInput = document.getElementById('calc-given-sheets') ? parseInt(document.getElementById('calc-given-sheets').value) : NaN;
            const mutDodatekRaw = (hasMutations && document.getElementById('calc-mut-dodatek')) ? document.getElementById('calc-mut-dodatek').value : "";
            // Preračunaj vrednosti glede na dodatek
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
            let isUrgent = document.getElementById('calc-dn-urgent') ? document.getElementById('calc-dn-urgent').checked : false;
            let mutBreakdown = (hasMutations && document.getElementById('calc-mut-breakdown')) ? document.getElementById('calc-mut-breakdown').value.trim() : "";

            function parseMutationBreakdown(str, totalQ, itemsPerSheet, totalDodatek, explicitMutDodatekRaw, givenDodatek) {
                if (!str || !str.trim()) return null;
                let parts = str.split(/[,;]/).map(s => s.trim()).filter(s => s.length > 0);
                if (parts.length === 0) return null;

                let items = [];
                let defaultLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

                parts.forEach((part, idx) => {
                    let numMatch = part.match(/(\d[\d\.]*)/);
                    let qty = 0;
                    if (numMatch) {
                        let numStr = numMatch[1].replace(/\./g, '');
                        qty = parseInt(numStr) || 0;
                    }

                    let cleanText = part.replace(/(\d[\d\.]*)/g, '')
                        .replace(/\b(kos|kom|vrsta|mutacija|mutacije|natis)\b/gi, '')
                        .trim();

                    let label = cleanText.length > 0 ? cleanText : (defaultLabels[idx] || `Mutacija ${idx + 1}`);
                    if (qty > 0) {
                        items.push({ label: label, qty: qty });
                    }
                });

                if (items.length === 0) return null;

                let numSorts = items.length;
                let ips = parseInt(itemsPerSheet) || 1;
                let explicitDodatekList = parseMutationDodatekList(explicitMutDodatekRaw);
                let hasExplicit = explicitDodatekList.length > 0;
                let hasGiven = !isNaN(givenDodatek) && givenDodatek >= 0;
                let dodatekPerSort = Math.round(totalDodatek / numSorts);

                items.forEach((item, idx) => {
                    let netSheets = Math.ceil(item.qty / ips);
                    let itemDodatek = 0;

                    if (hasExplicit) {
                        if (idx === 0 && hasGiven) {
                            itemDodatek = givenDodatek;
                        } else if (explicitDodatekList.length === 1) {
                            itemDodatek = explicitDodatekList[0];
                        } else {
                            let listIdx = hasGiven ? (idx - 1) : idx;
                            if (listIdx < 0) listIdx = 0;
                            itemDodatek = explicitDodatekList[listIdx] !== undefined ? explicitDodatekList[listIdx] : explicitDodatekList[explicitDodatekList.length - 1];
                        }
                    } else if (idx === 0 && hasGiven) {
                        itemDodatek = givenDodatek;
                    } else {
                        itemDodatek = dodatekPerSort;
                    }

                    let totalSheets = netSheets + itemDodatek;

                    item.netSheets = netSheets;
                    item.dodatek = itemDodatek;
                    item.totalSheets = totalSheets;
                });

                return items;
            }
            let quoteNum = document.getElementById('calc-quote-number').value || "";
            let orderType = document.getElementById('calc-order-type') ? document.getElementById('calc-order-type').value : "";
            let product = document.getElementById('calc-project-name').value || "Ni vpisano";
            let dnNotes = document.getElementById('calc-notes') ? document.getElementById('calc-notes').value : "";
            let materialDesc = document.getElementById('calc-material-desc') ? document.getElementById('calc-material-desc').value : "";
            let paperType = document.getElementById('calc-paper-type').value || "";
            let paperWeight = document.getElementById('calc-paper-weight').value || "";
            const monthNamesSl = [
                "januar", "februar", "marec", "april", "maj", "junij",
                "julij", "avgust", "september", "oktober", "november", "december"
            ];
            let nowDate = new Date();
            let date = `${nowDate.getDate()}.${monthNamesSl[nowDate.getMonth()]} ${nowDate.getFullYear()}`;

            // Format order type and old DN lines according to requirements (Line 1: Status!, Line 2: Print za tiskarja! SDN StariDN)
            let orderTypeLine1 = "";
            let orderTypeLine2 = dnOld ? `Print za tiskarja! SDN ${dnOld}` : `Print za tiskarja!`;
            if (typeof orderType === 'string' && orderType.trim() !== "") {
                let orderTypeLower = orderType.toLowerCase();
                let hasNovo = orderTypeLower.includes('novo');
                let hasSprememba = orderTypeLower.includes('sprememba');
                let hasPonatis = orderTypeLower.includes('ponatis');
                let hasAkJpg = orderTypeLower.includes('ak') || orderTypeLower.includes('jpg') || orderTypeLower.includes('montaž');

                let line1Parts = [];
                if (hasNovo) line1Parts.push('NOVO!');
                if (hasSprememba) line1Parts.push('Sprememba!');
                if (hasPonatis) line1Parts.push('Ponatis!');
                if (hasAkJpg) line1Parts.push('AK-JPG montaže!');
                orderTypeLine1 = line1Parts.join(' ');
            }
            let front = parseInt(document.getElementById('calc-color-front').value) || 0;
            let back = parseInt(document.getElementById('calc-color-back').value) || 0;
            let isObrat = document.getElementById('calc-is-obrat').checked;
            let isSV = document.getElementById('calc-is-sv') ? document.getElementById('calc-is-sv').checked : false;
            let colors = (isObrat || isSV) ? (front + '/' + front) : (front + '/' + back);
            let colorsDisplay = getFormattedColorsString();
            let tiskMode = "1 prehod";
            if (isObrat) { tiskMode = "obračanje"; } else if (back > 0) { tiskMode = "prvi/drugi (2 prehoda)"; }
            let prepPasses = front > 0 ? (Math.ceil(front / 4) + (back > 0 ? Math.ceil(back / 4) : 0)) : 1;
            let colorMode = front + '/' + (isObrat ? 'OB' : back);
            let rule = prepRules[colorMode] || { passes: prepPasses };
            let mPasses = rule.passes;
            let sourceW = d.paper.sourceW || 0;
            let sourceH = d.paper.sourceH || 0;
            let resSizeTxt = document.getElementById('res-size') ? document.getElementById('res-size').innerText.split('x') : [];
            let sheetW = resSizeTxt.length === 2 ? parseFloat(resSizeTxt[0].trim()) : 0;
            let sheetH = resSizeTxt.length === 2 ? parseFloat(resSizeTxt[1].trim()) : 0;
            let sourceYield = d.paper.sourceYield || 1;
            let sourceSheets = d.paper.sourceSheets || 0;
            let totalSheets = d.paper.totalSheets || 0;
            let itemsPerSheet = parseInt(document.getElementById('res-count').innerText) || 1;
            const getStavekLabel = (n) => {
                const num = parseInt(n) || 0;
                const mod100 = num % 100;
                if (mod100 === 1) return `${num} stavek na poli`;
                if (mod100 === 2) return `${num} stavka na poli`;
                if (mod100 === 3 || mod100 === 4) return `${num} stavki na poli`;
                return `${num} stavkov na poli`;
            };
            let formatW = document.getElementById('width').value || 0;
            let formatH = document.getElementById('height').value || 0;
            let finishList = getActiveFinishingList();
            let hasTool = document.getElementById('f-tool-active') && document.getElementById('f-tool-active').checked;
            let physicalWasteSheets = totalSheets - calcRes.sheetsNeeded;
            let finalDodatek = physicalWasteSheets;

            let tempMutItems = parseMutationBreakdown(mutBreakdown, q, itemsPerSheet, finalDodatek, mutDodatekRaw, givenDodatekInput);
            let explicitDodatekList = parseMutationDodatekList(mutDodatekRaw);
            let hasMutDodatek = explicitDodatekList.length > 0 && tempMutItems && tempMutItems.length > 0;
            let hasGivenDodatek = !isNaN(givenDodatekInput) && givenDodatekInput >= 0;

            if (hasMutDodatek) {
                finalDodatek = tempMutItems.reduce((acc, it) => acc + (it.dodatek || 0), 0);
            } else if (hasGivenDodatek) {
                finalDodatek = givenDodatekInput;
            }

            let finalTotalSheets = calcRes.sheetsNeeded + finalDodatek;
            let finalSourceSheets = Math.ceil(finalTotalSheets / sourceYield);
            let printMathString = `${calcRes.sheetsNeeded.toLocaleString('de-DE')} pol + ${finalDodatek.toLocaleString('de-DE')} pol = ${finalTotalSheets.toLocaleString('de-DE')} pol`;

            let mutItems = parseMutationBreakdown(mutBreakdown, q, itemsPerSheet, finalDodatek, hasMutDodatek ? mutDodatekRaw : "", givenDodatekInput);
            let mutPrintRowsHtml = "";
            if (mutItems && mutItems.length > 0) {
                let rowsHtml = mutItems.map(it => {
                    let labelDisplay = it.label.length === 1 ? `${it.label}:` : `${it.label}`;
                    return `
                        <tr>
                            <td style="padding: 1px 12px 1px 0; font-weight: bold; white-space: nowrap;">${labelDisplay} ${it.qty.toLocaleString('de-DE')} kos</td>
                            <td style="padding: 1px 4px; text-align: right; white-space: nowrap;">${it.netSheets.toLocaleString('de-DE')} pol</td>
                            <td style="padding: 1px 4px; text-align: center;">+</td>
                            <td style="padding: 1px 4px; text-align: right; white-space: nowrap;">${it.dodatek.toLocaleString('de-DE')} pol</td>
                            <td style="padding: 1px 4px; text-align: center;">=</td>
                            <td style="padding: 1px 0 1px 6px; font-weight: bold; text-align: right; white-space: nowrap;">${it.totalSheets.toLocaleString('de-DE')} tisk. pol</td>
                        </tr>`;
                }).join('');

                mutPrintRowsHtml = `
                    <table style="border-collapse: collapse; font-size: 14px; margin-bottom: 2px;">
                        <tbody>
                            ${rowsHtml}
                            <tr style="border-top: 1px dashed #cbd5e1; font-weight: bold;">
                                <td style="padding: 3px 12px 1px 0; white-space: nowrap;">Skupaj: ${q.toLocaleString('de-DE')} kos</td>
                                <td style="padding: 3px 4px 1px 4px; text-align: right; white-space: nowrap;">${calcRes.sheetsNeeded.toLocaleString('de-DE')} pol</td>
                                <td style="padding: 3px 4px 1px 4px; text-align: center;">+</td>
                                <td style="padding: 3px 4px 1px 4px; text-align: right; white-space: nowrap;">${finalDodatek.toLocaleString('de-DE')} pol</td>
                                <td style="padding: 3px 4px 1px 4px; text-align: center;">=</td>
                                <td style="padding: 3px 0 1px 6px; text-align: right; white-space: nowrap;">${finalTotalSheets.toLocaleString('de-DE')} tisk. pol</td>
                            </tr>
                        </tbody>
                    </table>
                    <div style="font-size: 12px; font-weight: normal; color: #475569; margin-top: 2px;">(${mPasses}x skozi stroj)</div>`;
            }

            let qtyDisplay = `${q.toLocaleString('de-DE')} kos`;
            if (mutItems && mutItems.length > 0) {
                let summaryStr = mutItems.map(it => `${it.label} ${it.qty.toLocaleString('de-DE')} kos`).join(', ');
                qtyDisplay += ` &nbsp;(${summaryStr})`;
            } else if (mutBreakdown) {
                qtyDisplay += ` &nbsp;(${mutBreakdown})`;
            }

            // Pomožna funkcija za zaokroževanje časov NAVZGOR na 0.1 ure (6 minut)
            const roundUpTime = (h) => {
                if (isNaN(h) || h <= 0) return 0;
                return Math.ceil(h * 10) / 10;
            };

            // Generiranje posameznih vrstic za aktivne dodelave z desno poravnavo časov
            let finishingRowsHtml = "";
            const isChecked = (id) => document.getElementById(id) && document.getElementById(id).checked;

            if (isChecked('f-cilinder-active')) {
                let cSpeed = 2000;
                let paperWeightNum = parseFloat(paperWeight) || 0;
                if (paperWeightNum >= 300) {
                    cSpeed = 1400;
                } else if (paperWeightNum > 150) {
                    cSpeed = 2000 - ((paperWeightNum - 150) / 150) * (2000 - 1400);
                }
                cSpeed = Math.round(cSpeed);
                let cPrepStr = hasTool ? "1,5 h" : "1 h";
                let cilDodatek = document.getElementById('f-cilinder-dodatek') ? (parseFloat(document.getElementById('f-cilinder-dodatek').value) || 0) : 0;
                let cilTotalSheets = calcRes.sheetsNeeded + cilDodatek;
                let cPrintHours = roundUpTime(cilTotalSheets / cSpeed);
                let cilQtyStr = (cilDodatek > 0)
                    ? `${calcRes.sheetsNeeded.toLocaleString('de-DE')} pol + ${cilDodatek.toLocaleString('de-DE')} pol = ${cilTotalSheets.toLocaleString('de-DE')} pol`
                    : `${calcRes.sheetsNeeded.toLocaleString('de-DE')} pol`;
                finishingRowsHtml += `
                    <tr>
                        <td style="width: 15%;">Cilinder:</td>
                        <td style="width: 35%;" class="bold">${cilQtyStr}</td>
                        <td style="width: 50%; text-align: right;" class="bold"><span class="bold">priprava:</span> ${cPrepStr} &nbsp;&nbsp;&nbsp;&nbsp; <span class="bold">tisk:</span> ${cPrintHours.toFixed(1)} h</td>
                    </tr>`;
            }
            if (isChecked('f-zgibanje-active')) {
                let zSpeed = parseFloat(document.getElementById('f-zgibanje-speed').value) || 10800;
                let ips = parseFloat(itemsPerSheet) || 1;
                let zgibNetItems = calcRes.sheetsNeeded * ips;
                let zHours = roundUpTime(zgibNetItems / zSpeed);
                let folds = document.getElementById('f-zgibanje-folds') ? document.getElementById('f-zgibanje-folds').value : '1';
                let zgibQtyStr = (ips > 1)
                    ? `${zgibNetItems.toLocaleString('de-DE')} kos`
                    : `${calcRes.sheetsNeeded.toLocaleString('de-DE')} pol`;
                finishingRowsHtml += `
                    <tr>
                        <td style="width: 15%;">Zgibanje (${folds}x):</td>
                        <td style="width: 35%;" class="bold">${zgibQtyStr}</td>
                        <td style="width: 50%; text-align: right;" class="bold"><span class="bold">tisk:</span> ${zHours.toFixed(1)} h</td>
                    </tr>`;
            }
            // Razrez in Razrez pred tiskom sta izpustopčena po zahtevi uporabnika
            if (isChecked('f-lepljenje-active')) {
                finishingRowsHtml += `
                    <tr>
                        <td style="width: 15%;">Lepljenje Petrata:</td>
                        <td style="width: 35%;" class="bold">${q.toLocaleString('de-DE')} kos</td>
                        <td style="width: 50%; text-align: right;" class="bold">/</td>
                    </tr>`;
            }
            if (isChecked('f-spiral-active')) {
                finishingRowsHtml += `
                    <tr>
                        <td style="width: 15%;">Špiraljenje / Vrvice:</td>
                        <td style="width: 35%;" class="bold">${q.toLocaleString('de-DE')} kos</td>
                        <td style="width: 50%; text-align: right;" class="bold">/</td>
                    </tr>`;
            }
            if (isChecked('f-extra-active')) {
                let extraSpeed = parseFloat(document.getElementById('f-extra-speed').value) || 1;
                let extraHours = roundUpTime(q / extraSpeed);
                finishingRowsHtml += `
                    <tr>
                        <td style="width: 15%;">Ročno delo:</td>
                        <td style="width: 35%;"></td>
                        <td style="width: 50%; text-align: right;" class="bold"><span class="bold">delo:</span> ${extraHours.toFixed(1)} h</td>
                    </tr>`;
            }
            if (isChecked('f-zasek-grafotehna-active')) {
                finishingRowsHtml += `
                    <tr>
                        <td style="width: 15%;">Zasek-Grafotehna:</td>
                        <td style="width: 35%;"></td>
                        <td style="width: 50%; text-align: right;" class="bold">/</td>
                    </tr>`;
            }
            if (isChecked('f-uv-active')) {
                finishingRowsHtml += `
                    <tr>
                        <td style="width: 15%;">UV lak (tuja):</td>
                        <td style="width: 35%;"></td>
                        <td style="width: 50%; text-align: right;" class="bold">/</td>
                    </tr>`;
            }
            if (isChecked('f-personalization-active')) {
                let persSidesSelect = document.getElementById('f-personalization-sides');
                let persSidesText = persSidesSelect ? persSidesSelect.value : '1/0';
                let maxSheetDim = Math.max(sheetW, sheetH);
                let digCutFactor = (maxSheetDim > 460 || (d && d.print && d.print.mType === 'S8')) ? 2 : 1;
                let digSheets = calcRes.sheetsNeeded * digCutFactor;
                let digFormatDetail = (digCutFactor === 2) ? ' 44,8 x 31,8 cm' : '';
                let persQtyStr = `${persSidesText} ${digSheets.toLocaleString('de-DE')} pol${digFormatDetail}`;
                finishingRowsHtml += `
                    <tr>
                        <td style="width: 15%;">Personalizacija:</td>
                        <td style="width: 35%;" class="bold">${persQtyStr}</td>
                        <td style="width: 50%; text-align: right;" class="bold">/</td>
                    </tr>`;
            }
            if (isChecked('f-lam-active')) {
                let lamTypeSelect = document.getElementById('f-lam-type');
                let lamTypeName = lamTypeSelect ? lamTypeSelect.options[lamTypeSelect.selectedIndex].text.toLowerCase() : 'mat';
                let lamSidesSelect = document.getElementById('f-lam-sides');
                let lamSidesText = lamSidesSelect ? lamSidesSelect.options[lamSidesSelect.selectedIndex].text : '1/0';
                finishingRowsHtml += `
                    <tr>
                        <td style="width: 15%;">Plastifikacija:</td>
                        <td style="width: 35%;" class="bold">${lamSidesText} ${lamTypeName} ${calcRes.sheetsNeeded.toLocaleString('de-DE')} pol</td>
                        <td style="width: 50%; text-align: right;" class="bold">/</td>
                    </tr>`;
            }
            if (isChecked('f-delivery-active') || isChecked('f-del-fixed-active')) {
                let delAddressStr = deliveryAddress ? deliveryAddress.replace(/\n/g, ', ') : (custAddress ? custAddress.replace(/\n/g, ', ') : '');
                finishingRowsHtml += `
                    <tr>
                        <td style="width: 15%;">Dostava:</td>
                        <td style="width: 85%;" class="bold" colspan="2">${delAddressStr ? delAddressStr : '/'}</td>
                    </tr>`;
            }

            // Upoštevaj fiksno hitrost 6000 pol/h samo v delovnem nalogu za tiskarja in planiranje
            let dnPrintHours = (finalTotalSheets * mPasses) / 6000;
            let prepTimeVal = d.print.prepTime || 0.5;
            let prepTimeStr = (prepTimeVal % 1 === 0 ? prepTimeVal.toFixed(0) : prepTimeVal.toString().replace('.', ',')) + ' h';
            let roundedPrintTime = roundUpTime(dnPrintHours);
            let sourceWCm = (sourceW / 10).toLocaleString('de-DE', { maximumFractionDigits: 2 });
            let sourceHCm = (sourceH / 10).toLocaleString('de-DE', { maximumFractionDigits: 2 });
            let sourceGrain = (sourceW > 0 && sourceH > 0) ? (sourceW < sourceH ? 'SB' : 'BB') : '';
            let sheetWCm = (sheetW / 10).toLocaleString('de-DE', { maximumFractionDigits: 2 });
            let sheetHCm = (sheetH / 10).toLocaleString('de-DE', { maximumFractionDigits: 2 });
            let mutExceedsWarningHtml = "";
            if (mutItems && mutItems.length > 0 && q > 0) {
                let sumMutQty = mutItems.reduce((acc, it) => acc + (it.qty || 0), 0);
                if (sumMutQty > q) {
                    mutExceedsWarningHtml = `
                        <div style="background: #fef2f2; border: 2px solid #ef4444; color: #991b1b; padding: 8px 12px; border-radius: 6px; font-weight: bold; font-size: 14px; margin-bottom: 10px;">
                            ⚠️ OPOZORILO: Skupna količina mutacij (${sumMutQty.toLocaleString('de-DE')} kos) PRESEGA naročeno količino (${q.toLocaleString('de-DE')} kos)!
                        </div>`;
                }
            }
            const defaultContent = `
                ${mutExceedsWarningHtml}
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
                            <div style="font-size: 18px;">Rok izdelave: <span class="bold">${deadline}</span> ${isUrgent ? '<span class="bold" style="color: #ef4444; font-size: 22px; margin-left: 10px;">🚨 NUJNO!</span>' : ''}</div>
                        </td>
                        <td style="width: 50%; text-align: right; vertical-align: top;">
                            <div class="bold" style="font-size: 28px; font-style: italic; text-decoration: underline; margin-bottom: 2px;">D.N.: ${dnNum}</div>
                            <div class="bold" style="font-size: 16px; font-style: italic; margin-bottom: 0px;">${date}</div>
                            <div style="line-height: 1.3;">
                                ${orderTypeLine1 ? `<div class="bold" style="font-size: 16px; font-style: italic; text-decoration: underline;">${orderTypeLine1}</div>` : ''}
                                ${orderTypeLine2 ? `<div class="bold" style="font-size: 16px; font-style: italic;">${orderTypeLine2}</div>` : ''}
                            </div>
                        </td>
                    </tr>
                </table>
                <table style="margin-top: 10px; width: 100%;">
                    <tr>
                        <td class="bold" style="font-size: 20px; width: 50%;">${product}</td>
                        <td style="width: 50%; text-align: right; font-size: 18px;"></td>
                    </tr>
                </table>
                <table style="margin-top: 5px; width: 100%;">
                    <tr><td style="width: 15%;">Količina:</td><td class="bold" style="font-size: 15px;">${qtyDisplay}</td></tr>
                    <tr><td>Format:</td><td class="bold">${formatW} x ${formatH} mm</td></tr>
                    <tr><td>Tisk:</td><td class="bold">${colorsDisplay}</td></tr>
                    <tr><td>Material:</td><td class="bold">${paperWeight ? paperWeight + 'g ' : ''}${paperType}</td></tr>
                </table>
                ${dnNotes ? `
                <table style="margin-top: 5px; width: 100%;">
                    <tr>
                        <td style="width: 15%; vertical-align: top;"><span class="bold">Opis / pripombe:</span></td>
                        <td class="bold" style="white-space: pre-wrap; font-size: 14px;">${dnNotes}</td>
                    </tr>
                </table>
                ` : ''}
                <div class="row-divider"></div>
                <table>
                    <tr>
                        <td style="width: 15%; vertical-align: top;">06 razrez:</td>
                        <td class="bold">
                            ${finalSourceSheets.toLocaleString('de-DE')} pol &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${sourceWCm} x ${sourceHCm} cm ${sourceGrain} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; na &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                            <div style="display: inline-block; vertical-align: top;">
                                ${finalTotalSheets.toLocaleString('de-DE')} pol ${sheetWCm} x ${sheetHCm} cm &nbsp;&nbsp; (${sourceYield} iz pole)
                                <div style="font-weight: bold; margin-top: 2px;">(${getStavekLabel(itemsPerSheet)})</div>
                            </div>
                        </td>
                    </tr>
                </table>
                <table style="margin-top: 5px; width: 100%;">
                    <tr>
                        <td style="width: 15%; font-weight: bold;"><strong>${d.print.mType || 'S4'}</strong> priprava:</td>
                        <td class="bold" style="width: 55%;">${tiskMode}</td>
                        <td style="width: 30%; text-align: right;" class="bold" colspan="2"><span class="bold">priprava:</span> ${prepTimeStr}</td>
                    </tr>
                    <tr>
                        <td style="vertical-align: top;">Tisk:</td>
                        <td class="bold" style="width: 55%;">
                            ${mutPrintRowsHtml ? mutPrintRowsHtml : `${printMathString} &nbsp;&nbsp; (${mPasses}x skozi stroj)`}
                        </td>
                        <td style="width: 30%; text-align: right; vertical-align: top;" class="bold" colspan="2"><span class="bold">tisk:</span> ${roundedPrintTime.toFixed(1)} h</td>
                    </tr>
                </table>
                <div class="row-divider"></div>
                <table style="width: 100%;">
                    <tr>
                        <td style="width: 15%;">Dodelava:</td>
                        <td class="bold" style="width: 85%; white-space: nowrap;" colspan="2">${finishList ? finishList : 'Brez posebne dodelave'}</td>
                    </tr>
                    ${finishingRowsHtml}
                    ${hasTool ? `
                    <tr>
                        <td style="width: 15%; padding-top: 5px; color: #ef4444; font-weight: bold;">Orodje:</td>
                        <td class="bold" style="width: 35%; padding-top: 5px; color: #ef4444; font-weight: bold;">izdelava novega orodja Smole Branko</td>
                        <td style="width: 50%; text-align: right;"></td>
                    </tr>
                    ` : ''}
                    <tr style="font-size: 15px; font-weight: bold;">
                        <td style="width: 15%; padding-top: 2px; font-size: 15px;" class="bold">Pakiranje:</td>
                        <td class="bold" style="width: 35%; padding-top: 2px; font-size: 15px;">${packaging}</td>
                        <td style="width: 50%; text-align: right;"></td>
                    </tr>
                </table>
                <div class="row-divider"></div>
                <div class="bold" style="margin-bottom: 5px; font-size: 15px;">Poraba materiala:</div>
                <table style="width: 100%;">
                    <tr>
                        <td style="font-size: 14px;">of. plošče (<strong>${d.print.mType || 'S4'}</strong>):</td>
                        <td style="text-align: right; font-size: 14px;" class="bold">${d.prep.plates} kos</td>
                    </tr>
                    <tr style="font-size: 17px; font-weight: bold;">
                        <td style="font-size: 17px;" class="bold">Papir (${sourceWCm} x ${sourceHCm} cm ${sourceGrain}) - ${paperWeight ? paperWeight + 'g ' : ''}${paperType}:</td>
                        <td style="text-align: right; font-size: 17px;" class="bold">${finalSourceSheets.toLocaleString('de-DE')} pol</td>
                    </tr>
                </table>
                <div class="row-divider"></div>
                <table>
                    <tr>
                        <td style="font-size: 14px;" class="bold">Izdobaviti točno naročeno količino!</td>
                    </tr>
                    <tr>
                        <td style="font-size: 14px;">Obvezno par vzorcev tiskovine v nalog!</td>
                    </tr>
                </table>
                <div class="row-divider"></div>
                <table style="width: 100%; margin-bottom: 5px; font-size: 14px;">
                    <tr>
                        <td style="width: 25%;"><span class="bold">Št. ponudbe:</span> ${quoteNum || '/'}</td>
                        <td style="width: 25%; text-align: center;"><span class="bold">Cena za kos:</span> ${formatPrice(calcRes.perItemFinal, 4)}</td>
                        <td style="width: 25%; text-align: center;"><span class="bold">Cena za 1000 kos:</span> ${formatPrice(calcRes.perItemFinal * 1000, 2)}</td>
                        <td style="width: 25%; text-align: right;"><span class="bold">Skupaj:</span> ${formatPrice(calcRes.totalPrice, 2)}</td>
                    </tr>
                </table>
            `;
            let contentToRender = g_editedWorkOrderHTML ? g_editedWorkOrderHTML : defaultContent;
            const qW = document.getElementById('width') ? document.getElementById('width').value : '';
            const qH = document.getElementById('height') ? document.getElementById('height').value : '';
            const fFormat = (qW && qH) ? `${qW}x${qH}` : '';
            const cFront = document.getElementById('calc-color-front') ? document.getElementById('calc-color-front').value : '';
            const cBack = document.getElementById('calc-color-back') ? document.getElementById('calc-color-back').value : '';
            const cColors = (cFront || cBack) ? `${cFront || 0}-${cBack || 0}` : '';
            let tParts = [];
            if (dnNum) tParts.push(dnNum);
            if (customer) tParts.push(customer);
            if (product) tParts.push(product);
            if (fFormat) tParts.push(fFormat);
            if (cColors) tParts.push(cColors);
            if (qtyStr) tParts.push(qtyStr + "kos");
            let docTitle = 'DN_' + tParts.join('_').replace(/[/\\?%*:|"<> \t]/g, '_').replace(/_+/g, '_');
            let html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>${docTitle}</title>
                <style>
                    @page { size: A4 portrait; margin: 10mm; }
                    body { font-family: Arial, sans-serif; font-size: 15px; line-height: 1.3; color: #000; margin: 0; padding: 0; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 3px; font-size: 15px; }
                    td, th { padding: 2px 4px; vertical-align: top; }
                    .main-table th { background: #eee; border: 1px solid #ccc; font-size: 11px; }
                    .main-table td { border: 1px solid #ccc; }
                    .header-top { display: flex; justify-content: space-between; border-bottom: 1px solid #000; padding-bottom: 4px; margin-bottom: 4px; }
                    .bold { font-weight: bold; }
                    .row-divider { border-top: 1px dashed #000; margin: 4px 0; }
                    @media print {
                        .no-print { display: none !important; }
                        html, body { width: 100% !important; margin: 0 !important; padding: 0 !important; }
                        .editable-area { width: 100% !important; max-width: 210mm !important; box-sizing: border-box !important; padding: 0 !important; height: auto !important; overflow: visible !important; }
                    }
                    .editable-area { max-width: 210mm; width: 100%; margin: 0 auto; box-sizing: border-box; height: auto; overflow: visible; word-wrap: break-word; overflow-wrap: break-word; }
                    .editable-area:focus { outline: 2px dashed #3b82f6; background-color: #eff6ff; }
                    .editable-area p, .editable-area div:not(.header-top) { margin: 0; padding: 0; }
                    .editable-area.waiting-for-paste { cursor: cell !important; outline: 3px dashed #eab308 !important; background-color: #fffbeb !important; }
                
        .input-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

    </style>
            </head>
            <body>
                <div class="no-print" contenteditable="false" style="background: #f1f5f9; padding: 10px; border-bottom: 1px solid #cbd5e1; display: flex; gap: 10px; align-items: center; justify-content: start; font-family: sans-serif; box-sizing: border-box; width: 100%; flex-wrap: wrap;">
                    <button onclick="window.print()" style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px;">NATISNI DN</button>
                    <button onclick="window.close()" style="background: #64748b; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px;">ZAPRI</button>
                    <button onclick="if(confirm('Ali želite ponastaviti delovni nalog na privzete vrednosti? (Spremembe besedila bodo izgubljene)')){ if(window.opener){ window.opener.g_editedWorkOrderHTML=''; const newHtml = window.opener.getWorkOrderHTML(); document.open(); document.write(newHtml); document.close(); } else { g_editedWorkOrderHTML=''; const modal = document.getElementById('modal-work-order'); if(modal) { modal.querySelector('.editable-area').innerHTML = getWorkOrderHTML(); } } }" style="background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px;">PONASTAVI</button>
                    <button id="btn-move-text" onclick="toggleMoveMode(this)" style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px;" title="Premakni označeno besedilo na drugo mesto. Označite besedilo, kliknite ta gumb in nato kliknite na novo mesto v besedilu.">PREMAKNI</button>
                    <button onclick="saveDNToDisk()" style="background: #8b5cf6; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px;" title="Shrani ta delovni nalog v Word (.doc) formatu na računalnik">SHRANI DN (WORD)</button>
                    <div style="display: flex; gap: 4px; align-items: center; background: #cbd5e1; padding: 3px; border-radius: 6px;">
                        <button onclick="document.execCommand('bold', false, null)" style="background: white; border: none; border-radius: 4px; width: 28px; height: 28px; font-weight: bold; cursor: pointer; color: #000; font-size: 14px;" title="Krepko (Bold)">B</button>
                        <button onclick="document.execCommand('italic', false, null)" style="background: white; border: none; border-radius: 4px; width: 28px; height: 28px; font-style: italic; cursor: pointer; color: #000; font-size: 14px; font-family: Georgia, serif;" title="Ležeče (Italic)">I</button>
                        <button onclick="document.execCommand('underline', false, null)" style="background: white; border: none; border-radius: 4px; width: 28px; height: 28px; text-decoration: underline; cursor: pointer; color: #000; font-size: 14px;" title="Podčrtano (Underline)">U</button>
                        <select onchange="const sel = window.getSelection(); if (sel.rangeCount) { const range = sel.getRangeAt(0); if (range.toString().length > 0) { const span = document.createElement('span'); span.style.fontSize = this.value; span.appendChild(range.extractContents()); range.insertNode(span); } }; this.value='';" style="background: white; border: none; border-radius: 4px; height: 28px; padding: 0 5px; font-size: 12px; cursor: pointer; color: #000; width: 90px;" title="Velikost pisave">
                            <option value="" disabled selected>Velikost</option>
                            <option value="9px">9 px</option>
                            <option value="10px">10 px</option>
                            <option value="11px">11 px</option>
                            <option value="12px">12 px</option>
                            <option value="13px">13 px</option>
                            <option value="14px">14 px</option>
                            <option value="16px">16 px</option>
                            <option value="18px">18 px</option>
                            <option value="20px">20 px</option>
                            <option value="24px">24 px</option>
                            <option value="28px">28 px</option>
                        </select>
                        <button onclick="const p = document.createElement('p'); p.style.margin = '10px 0'; p.style.minHeight = '1.2em'; p.style.width = '100%'; p.style.clear = 'both'; p.style.fontSize = '12px'; p.innerText = 'Nova vrstica besedila...'; const sel = window.getSelection(); if (sel.rangeCount) { const range = sel.getRangeAt(0); range.insertNode(p); } else { document.querySelector('.editable-area').appendChild(p); }" style="background: white; border: none; border-radius: 4px; height: 28px; padding: 0 8px; font-size: 12px; cursor: pointer; color: #000; font-weight: bold;" title="Dodaj vrstico besedila preko cele strani">+ Dodaj vrstico</button>
                    </div>
                    <div style="font-size: 12px; color: #475569; margin-left: 10px;">?? Spremembe besedila se samodejno shranjujejo v kalkulacijo.</div>
                </div>
                <div class="editable-area" contenteditable="true" style="padding: 20px;">
                    ${contentToRender}
                </div>
                <script>
                    let moveData = null;
                        let waitingForPaste = false;
                        
                        window.toggleMoveMode = function(btn) {
                            const sel = window.getSelection();
                            const area = document.querySelector('.editable-area');
                            if (!waitingForPaste) {
                                if (sel.rangeCount && sel.toString().trim().length > 0) {
                                    const range = sel.getRangeAt(0);
                                    moveData = range.cloneContents();
                                    range.deleteContents();
                                    waitingForPaste = true;
                                    btn.innerText = "VSTAVI TU";
                                    btn.style.background = "#eab308";
                                    area.classList.add('waiting-for-paste');
                                    if (typeof sync === 'function') sync();
                                } else {
                                    alert("Najprej z miško označite (pobarvajte) del besedila ali vrstico, ki jo želite premakniti.");
                                }
                            } else {
                                waitingForPaste = false;
                                moveData = null;
                                btn.innerText = "PREMAKNI";
                                btn.style.background = "#3b82f6";
                                area.classList.remove('waiting-for-paste');
                            }
                        };
                        
                        const area = document.querySelector('.editable-area');
                    if (area) {
                        const sync = () => {
                            if (window.opener && !window.opener.closed) {
                                window.opener.g_editedWorkOrderHTML = area.innerHTML;
                            }
                        };
                        area.addEventListener('click', function(e) {
                                if (waitingForPaste && moveData) {
                                    e.preventDefault();
                                    const sel = window.getSelection();
                                    if (sel.rangeCount) {
                                        const range = sel.getRangeAt(0);
                                        range.deleteContents();
                                        range.insertNode(moveData);
                                        
                                        waitingForPaste = false;
                                        moveData = null;
                                        area.classList.remove('waiting-for-paste');
                                        
                                        const btn = document.getElementById('btn-move-text');
                                        if (btn) {
                                            btn.innerText = "PREMAKNI";
                                            btn.style.background = "#3b82f6";
                                        }
                                        if (typeof sync === 'function') sync();
                                    }
                                }
                            });
                            
                            area.addEventListener('input', sync);
                        area.addEventListener('blur', sync);
                        window.addEventListener('beforeunload', sync);
                    }
                    document.addEventListener('keydown', function(e) {
                        if (e.key === 'Enter') {
                            let selection = window.getSelection();
                            if (!selection.rangeCount) return;
                            let container = selection.getRangeAt(0).commonAncestorContainer;
                            let editable = null;
                            if (container.nodeType === 1) {
                                editable = container.closest('[contenteditable="true"]');
                            } else if (container.parentNode) {
                                editable = container.parentNode.closest('[contenteditable="true"]');
                            }
                            if (editable) {
                                e.preventDefault();
                                document.execCommand('insertLineBreak', false, null);
                            }
                        }
                    });

                    function saveDNToDisk() {
                        try {
                            var area = document.querySelector('.editable-area');
                            var content = area ? area.innerHTML : document.body.innerHTML;
                            var fileName = (document.title || 'delovni_nalog').replace(/[/\\?%*:|"<> \t]/g, '_').replace(/_+/g, '_');
                            if (!fileName || fileName === '_') fileName = "delovni_nalog";
                            if (!fileName.endsWith('.doc')) fileName += ".doc";

                            if (window.opener && !window.opener.closed && typeof window.opener.downloadWordDoc === 'function') {
                                window.opener.downloadWordDoc(fileName, content);
                                return;
                            }

                            var bom = String.fromCharCode(0xFEFF);
                            var htmlContent = "<!DOCTYPE html><html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>" + fileName + "</title><style>body { font-family: Arial, sans-serif; font-size: 14px; margin: 0; padding: 10px; } table { width: 100%; border-collapse: collapse; } td, th { padding: 4px; }
        .input-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

    </style></head><body>" + content + "</body></html>";
                            var base64 = btoa(unescape(encodeURIComponent(bom + htmlContent)));
                            var dataUri = 'data:application/msword;base64,' + base64;

                            var a = document.createElement('a');
                            a.href = dataUri;
                            a.download = fileName;
                            document.body.appendChild(a);
                            a.click();
                            setTimeout(function() { if (a.parentNode) a.parentNode.removeChild(a); }, 300);
                        } catch (err) {
                            alert("Napaka pri shranjevanju: " + err.message);
                        }
                    }
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
                alert("Exception in " + "Function" + ": " + e.message + "\n" + e.stack);
                console.error("Napaka pri tisku delovnega naloga:", e);
                alert("Napaka pri generiranju delovnega naloga: " + e.message);
            }
        }
        function printQuoteAT() {
            try {
                const html = getQuoteHTML(false, '', false, true);
                const printWindow = window.open('', '', 'width=800,height=900');
                if (printWindow) {
                    printWindow.document.write(html);
                    printWindow.document.close();
                    printWindow.focus();
                } else {
                    alert("Pojavno okno je blokirano. Prosimo, dovolite pojavna okna za to stran.");
                }
            } catch (e) {
                alert("Napaka pri pripravi ponudbe za AT: " + e.message);
                console.error(e);
            }
        }
        function printQuote() {
            try {
                const html = getQuoteHTML(false, '', false);
                const printWindow = window.open('', '', 'width=850,height=900');
                if (!printWindow) {
                    alert("Prosimo omogočite pojavna okna (pop-ups) za ta zavihek.");
                    return;
                }
                printWindow.document.write(html);
                printWindow.document.close();
                printWindow.focus();
            } catch (e) {
                alert("Exception in " + "Function" + ": " + e.message + "\n" + e.stack);
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
                alert("Exception in " + "Function" + ": " + e.message + "\n" + e.stack);
                alert("Napaka pri pripravi montažnega lista: " + e.message);
                console.error(e);
            }
        }
        function downloadWordDoc(filename, htmlContent) {
            try {
                let name = filename || 'dokument';
                if (!name.endsWith('.doc')) name += '.doc';
                let fullHtml = "<!DOCTYPE html>\n<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>" + name + "</title><style>body { font-family: Arial, sans-serif; margin: 0; padding: 10px; } table { width: 100%; border-collapse: collapse; } td, th { padding: 4px; }
                    .input - group {
                        display: flex;
                flex - direction: column;
                gap: 0.5rem;
            }

    </style ></head > <body>" + htmlContent + "</body></html > ";

            let base64 = btoa(unescape(encodeURIComponent('\ufeff' + fullHtml)));
            let dataUri = 'data:application/msword;base64,' + base64;

            let a = document.createElement('a');
            a.href = dataUri;
            a.download = name;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                if (a.parentNode) a.parentNode.removeChild(a);
            }, 500);
        } catch (e) {
            alert("Napaka pri prenosu Word datoteke: " + e.message);
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
                alert("Exception in " + "Function" + ": " + e.message + "\n" + e.stack);
                alert("Napaka pri pripravi Word dokumenta: " + e.message);
                console.error(e);
            }
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
        // --- MANUAL EDITOR LOGIC ---
        let m_items = [];
        let m_selectedId = null;
        let m_dragging = false;
        let m_offsetX, m_offsetY;
        let m_scale = 1;
        function openManualEditor() {
            document.getElementById('manual-editor-modal').style.display = 'flex';
            // Set default add values
            document.getElementById('manual-add-w').value = document.getElementById('width').value;
            document.getElementById('manual-add-h').value = document.getElementById('height').value;
            // Clean existing boxes from DOM
            const sheet = document.getElementById('manual-sheet');
            sheet.querySelectorAll('.manual-box').forEach(b => b.remove());
            // Reset internal state if we starting fresh or use global
            if (g_manualLayout && g_manualLayout.items && g_manualLayout.items.length > 0 && confirm("Želite nadaljevati s prejšnjo ročno postavitvijo?")) {
                m_items = JSON.parse(JSON.stringify(g_manualLayout.items));
            } else {
                m_items = [];
                // Samodejno izriši (pred-napolni) stavke glede na Osnovni format, če so podane dimenzije
                const w = parseFloat(document.getElementById('width').value) || 0;
                const h = parseFloat(document.getElementById('height').value) || 0;
                const b = parseFloat(document.getElementById('bleed').value) || 0;
                const itemW = w + 2 * b;
                const itemH = h + 2 * b;
                const fMode = document.getElementById('item-orientation') ? document.getElementById('item-orientation').value : 'auto';
                let sheetW, sheetH;
                const mFormat = document.getElementById('machine-format').value;
                if (mFormat !== 'auto') {
                    const s = sheets.find(sh => sh.name === mFormat);
                    if (s) { sheetW = s.w; sheetH = s.h; }
                }
                if (!sheetW && g_lastSheetW > 0) {
                    sheetW = g_lastSheetW;
                    sheetH = g_lastSheetH;
                }
                if (!sheetW) {
                    // Fallback: uporabi profil stroja ali B2
                    const mType = document.getElementById('calc-machine-type').value;
                    const prof = machineProfiles[mType];
                    if (prof && prof.defaultFormat) {
                        const s = sheets.find(sh => sh.name === prof.defaultFormat);
                        if (s) { sheetW = s.w; sheetH = s.h; }
                    }
                }
                if (!sheetW) {
                    sheetW = sheets[0].w;
                    sheetH = sheets[0].h;
                }
                const gripper = parseFloat(document.getElementById('gripper').value) || 10;
                console.log('[ManualEditor] Pred-populacija:', { w, h, b, itemW, itemH, sheetW, sheetH, gripper, fMode });
                if (itemW > 0 && itemH > 0) {
                    const srcLayout = optimizeLayout(sheetW, sheetH, itemW, itemH, gripper, fMode);
                    console.log('[ManualEditor] optimizeLayout rezultat:', srcLayout);
                    if (srcLayout && srcLayout.count > 0) {
                        // Prijemalec je zdaj vizualno in logično na dnu (H)
                        const gripOffsetW = srcLayout.gripEdge === 'W' ? gripper : 0;
                        const gripOffsetH = 0; // ker je gripper vedno spodaj, začnemo na vrhu (y=0)
                        let idCount = Date.now();
                        for (let r = 0; r < srcLayout.rows; r++) {
                            for (let c = 0; c < srcLayout.cols; c++) {
                                m_items.push({
                                    id: idCount++,
                                    x: gripOffsetW + c * srcLayout.itemW,
                                    y: gripOffsetH + r * srcLayout.itemH,
                                    w: srcLayout.itemW,
                                    h: srcLayout.itemH,
                                    bleed: b,
                                    rot: srcLayout.rot
                                });
                            }
                        }
                        console.log('[ManualEditor] Dodanih stavkov:', m_items.length);
                    }
                }
            }
            // Počakaj, da se modal prikaže, preden izmerimo dimenzije
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setupManualCanvas();
                    renderManualItems();
                });
            });
        }
        function closeManualEditor() {
            document.getElementById('manual-editor-modal').style.display = 'none';
        }
        function setupManualCanvas() {
            const container = document.getElementById('manual-canvas-container');
            let sheetW, sheetH;
            const mFormat = document.getElementById('machine-format').value;
            if (mFormat !== 'auto') {
                const s = sheets.find(sh => sh.name === mFormat);
                if (s) { sheetW = s.w; sheetH = s.h; }
            }
            if (!sheetW && g_lastSheetW > 0) {
                sheetW = g_lastSheetW;
                sheetH = g_lastSheetH;
            }
            if (!sheetW) {
                const mType = document.getElementById('calc-machine-type').value;
                const prof = machineProfiles[mType];
                if (prof && prof.defaultFormat) {
                    const s = sheets.find(sh => sh.name === prof.defaultFormat);
                    if (s) { sheetW = s.w; sheetH = s.h; }
                }
            }
            if (!sheetW) {
                sheetW = sheets[0].w;
                sheetH = sheets[0].h;
            }
            const gripper = parseFloat(document.getElementById('gripper').value) || 10;
            g_lastSheetW = sheetW;
            g_lastSheetH = sheetH;
            g_lastG = gripper;
            // Izračunaj skalo, da se cela pola ujame v 80% okna
            const modal = document.getElementById('manual-editor-modal');
            const canvasArea = modal.querySelector('[data-canvas-area]');
            const areaW = canvasArea ? canvasArea.clientWidth - 80 : window.innerWidth * 0.6;
            const areaH = canvasArea ? canvasArea.clientHeight - 80 : window.innerHeight * 0.75;
            m_scale = Math.max(0.3, Math.min(areaW / sheetW, areaH / sheetH, 1.5));
            console.log('[ManualEditor] setupManualCanvas:', { sheetW, sheetH, areaW, areaH, m_scale });
            // Nastavi kontejner na skaliran px
            container.style.width = Math.round(sheetW * m_scale) + 'px';
            container.style.height = Math.round(sheetH * m_scale) + 'px';
            container.style.transform = '';
            container.style.position = 'relative';
            // Prijemalec (v skaliranih px)
            const grip = document.getElementById('manual-gripper');
            // Prijemalec naj bo vedno spodaj
            grip.style.top = 'auto';
            grip.style.bottom = '0';
            grip.style.left = '0';
            grip.style.right = '0';
            grip.style.height = Math.round(gripper * m_scale) + 'px';
            grip.style.width = '100%';
            grip.style.borderTop = '2px dashed #f43f5e';
            grip.style.borderBottom = 'none';
            grip.style.borderRight = 'none';
        }
        function addManualBox() {
            const w = parseFloat(document.getElementById('manual-add-w').value);
            const h = parseFloat(document.getElementById('manual-add-h').value);
            const b = parseFloat(document.getElementById('bleed').value) || 0;
            if (!w || !h) return;
            const id = Date.now();
            m_items.push({
                id: id,
                x: 50, y: 50, // Initial position
                w: w + 2 * b,
                h: h + 2 * b,
                bleed: b,
                rot: false
            });
            renderManualItems();
            selectManualBox(id);
        }
        function renderManualItems() {
            const sheet = document.getElementById('manual-sheet');
            sheet.querySelectorAll('.manual-box').forEach(b => b.remove());
            m_items.forEach(item => {
                const el = document.createElement('div');
                el.className = 'manual-box' + (m_selectedId === item.id ? ' selected' : '');
                // Vse koordinate in dimenzije skaliramo v px
                const px = Math.round(item.x * m_scale);
                const py = Math.round(item.y * m_scale);
                const pw = Math.round(item.w * m_scale);
                const ph = Math.round(item.h * m_scale);
                el.style.width = pw + 'px';
                el.style.height = ph + 'px';
                el.style.left = px + 'px';
                el.style.top = py + 'px';
                el.style.boxSizing = 'border-box';
                el.style.overflow = 'hidden';
                // Besedilo z dimenzijami stavka
                const netW = Math.round(item.w - 2 * item.bleed);
                const netH = Math.round(item.h - 2 * item.bleed);
                const label = document.createElement('span');
                label.textContent = `${netW}x${netH}`;
                label.style.fontSize = Math.max(9, Math.round(10 * m_scale)) + 'px';
                label.style.pointerEvents = 'none';
                el.appendChild(label);
                // Pogled na prelivanje (bleed)
                if (item.bleed > 0) {
                    const bleedBox = document.createElement('div');
                    bleedBox.style.position = 'absolute';
                    bleedBox.style.top = Math.round(item.bleed * m_scale) + 'px';
                    bleedBox.style.left = Math.round(item.bleed * m_scale) + 'px';
                    bleedBox.style.width = Math.round((item.w - 2 * item.bleed) * m_scale) + 'px';
                    bleedBox.style.height = Math.round((item.h - 2 * item.bleed) * m_scale) + 'px';
                    bleedBox.style.border = '1px dotted rgba(255,255,255,0.5)';
                    bleedBox.style.pointerEvents = 'none';
                    el.appendChild(bleedBox);
                }
                el.onmousedown = (e) => startDrag(e, item.id);
                el.ondblclick = () => rotateSelectedBox();
                sheet.appendChild(el);
            });
            document.getElementById('manual-item-count').innerText = m_items.length;
            renderManualList();
        }
        function renderManualList() {
            const list = document.getElementById('manual-items-list');
            list.innerHTML = m_items.map((it, idx) => `
                    <div style="padding: 5px; background: rgba(255,255,255,0.05); border-radius: 4px; display: flex; justify-content: space-between;">
                        <span>${idx + 1}. ${it.w - 2 * it.bleed} x ${it.h - 2 * it.bleed} mm</span>
                        <span style="color: #60a5fa;">${it.rot ? 'R' : ''}</span>
                    </div>
                `).join('');
        }
        function selectManualBox(id) {
            m_selectedId = id;
            renderManualItems();
        }
        function rotateSelectedBox() {
            if (!m_selectedId) return;
            const it = m_items.find(i => i.id === m_selectedId);
            if (it) {
                const oldW = it.w;
                it.w = it.h;
                it.h = oldW;
                it.rot = !it.rot;
                renderManualItems();
            }
        }
        function removeSelectedBox() {
            if (!m_selectedId) return;
            m_items = m_items.filter(i => i.id !== m_selectedId);
            m_selectedId = null;
            renderManualItems();
        }
        function clearManualLayout() {
            if (confirm("Res počistim celotno postavitev?")) {
                m_items = [];
                m_selectedId = null;
                renderManualItems();
            }
        }
        function startDrag(e, id) {
            e.preventDefault();
            selectManualBox(id);
            const item = m_items.find(it => it.id === id);
            m_dragging = true;
            const rect = document.getElementById('manual-canvas-container').getBoundingClientRect();
            m_offsetX = ((e.clientX - rect.left) / m_scale) - item.x;
            m_offsetY = ((e.clientY - rect.top) / m_scale) - item.y;
            window.addEventListener('mousemove', drag);
            window.addEventListener('mouseup', stopDrag);
        }
        function drag(e) {
            if (!m_dragging) return;
            const item = m_items.find(it => it.id === m_selectedId);
            if (item) {
                const rect = document.getElementById('manual-canvas-container').getBoundingClientRect();
                item.x = ((e.clientX - rect.left) / m_scale) - m_offsetX;
                item.y = ((e.clientY - rect.top) / m_scale) - m_offsetY;
                // Constrain to sheet
                const limitX = g_lastSheetW - item.w;
                const limitY = g_lastSheetH - item.h;
                if (item.x < 0) item.x = 0; if (item.x > limitX) item.x = limitX;
                if (item.y < 0) item.y = 0; if (item.y > limitY) item.y = limitY;
                renderManualItems();
            }
        }
        function stopDrag() {
            m_dragging = false;
            window.removeEventListener('mousemove', drag);
            window.removeEventListener('mouseup', stopDrag);
        }
        function printManualLayout() {
            const container = document.getElementById('manual-canvas-container');
            if (!container) return;
            // Ustvari nov okno
            const printWin = window.open('', '', 'width=1000,height=800');
            if (!printWin) {
                alert("Brskalnik je blokiral pojavno okno. Prosimo, dovolite pojavna okna za to spletno mesto.");
                return;
            }
            // Pripravi HTML
            const sheetW = g_lastSheetW || 1000;
            const sheetH = g_lastSheetH || 700;
            // Nastavi CSS in vsebino. Za tisk bomo naštimali, da se polje prilagodi strani
            const html = `
                <html>
                <head>
                    <title>Montažni list</title>
                    <style>
                        @page { size: landscape; margin: 10mm; }
                        body { 
                            margin: 0; 
                            padding: 20px; 
                            font-family: Arial, sans-serif;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            height: 100vh;
                            box-sizing: border-box;
                        }
                        h2 {
                            text-align: center;
                            margin-bottom: 20px;
                            font-size: 18px;
                            color: #333;
                        }
                        .print-wrapper {
                            /* Reset transform on wrapper to avoid scaling issues in some browsers */
                            position: relative;
                        }
                        /* Podedujemo stile za montažni list (iz korenskega CSS-a) */
                        .manual-box {
                            position: absolute;
                            background: rgba(96, 165, 250, 0.25) !important;
                            border: 2px solid #3b82f6 !important;
                            border-radius: 3px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 10px;
                            color: #1e3a8a;
                            font-weight: bold;
                            box-sizing: border-box;
                            overflow: hidden;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                        .manual-box div {
                            border: 1px dotted #333 !important;
                        }
                        #manual-gripper {
                            background: rgba(244, 63, 94, 0.15) !important;
                            color: #f43f5e !important;
                            border-top: 2px dashed #f43f5e !important;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                        @media print {
                            body { height: auto; display: block; }
                            h2 { margin-bottom: 30px; }
                            .print-wrapper {
                                margin: 0 auto;
                                /* Scale canvas to fit page width (A4 landscape roughly 277mm printable) */
                                transform-origin: top center;
                                transform: scale(\${Math.min(1, 900 / (parseFloat(container.style.width) || container.clientWidth || 900))}); 
                            }
                        }
                        .editable-area.waiting-for-paste { cursor: cell !important; outline: 3px dashed #eab308 !important; background-color: #fffbeb !important; }
                
        .input-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

    </style>
            </head>
                <body>
                    <h2>Montažni list (Osnovni format: \${sheetW} x \${sheetH} mm, Elementi: \${m_items.length})</h2>
                    <div class="print-wrapper">
                        \${container.outerHTML}
                    </div>
                    <script>
                        // Odstrani box-shadow z glave zabojnika
                        document.getElementById('manual-canvas-container').style.boxShadow = 'none';
                        document.getElementById('manual-canvas-container').style.border = '1px solid #ccc';
                    <\/script>
                </body>
                </html>
            `;
            printWin.document.write(html);
            printWin.document.close();
            // Počakaj trenutek, da brskalnik izriše CSS in DOM, preden zažene tisk
            setTimeout(() => {
                printWin.print();
            }, 500);
        }
        function applyManualLayout() {
            if (m_items.length === 0) {
                g_manualLayout = null;
                document.getElementById('items-per-sheet').value = 0; // Reset manual override
            } else {
                g_manualLayout = {
                    items: JSON.parse(JSON.stringify(m_items)),
                    sheetW: g_lastSheetW,
                    sheetH: g_lastSheetH
                };
                // Update main count input
                document.getElementById('items-per-sheet').value = m_items.length;
            }
            closeManualEditor();
            calculate(); // Recalculate and visibly reset canvas layout if cleared
        }
        // Keyboard shortcuts for editor
        window.addEventListener('keydown', (e) => {
            const modal = document.getElementById('manual-editor-modal');
            if (modal.style.display !== 'flex') return;
            if (e.key === 'r' || e.key === 'R') rotateSelectedBox();
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (document.activeElement.tagName !== 'INPUT') removeSelectedBox();
            }
            if (e.key === 'Enter') applyManualLayout();
            if (e.key === 'Escape') closeManualEditor();
        });
        // FINAL AUTO-RUN
        try {
            applyMachineDefaults();
            renderSavedProjects();
            updateCustomerDatalist();
            renderBasket();
            const givenSheetsInput = document.getElementById('calc-given-sheets');
            const uvExtraWasteInput = document.getElementById('f-uv-extra-waste');
            // Povezava je bila odstranjena, da dodatek za tisk ne spreminja dodatka za UV lakiranje in s tem cene.
            setTimeout(calculate, 200); // Give it a moment to stabilize
        } catch (e) {
            alert("Exception in " + "Function" + ": " + e.message + "\n" + e.stack);
            console.error("Startup failed:", e);
        }
    