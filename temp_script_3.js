
        // --- LOGIKA ZA SAMODEJNO PREVERJANJE ZALOGE SIMON ---
        let stockDataList = [];
        let activeMaterialTarget = 'paper';

        function initStockData() {
            try {
                const saved = localStorage.getItem('zaloga_simon_data');
                if (saved) {
                    stockDataList = JSON.parse(saved);
                    updateStockCountBadge();
                } else {
                    fetch('zalogaSimon.json')
                        .then(res => {
                            if (!res.ok) throw new Error('HTTP status ' + res.status);
                            return res.text();
                        })
                        .then(text => {
                            if (text && text.trim().startsWith('[')) {
                                const data = JSON.parse(text);
                                if (Array.isArray(data) && data.length > 0) {
                                    stockDataList = data;
                                    localStorage.setItem('zaloga_simon_data', JSON.stringify(data));
                                    updateStockCountBadge();
                                }
                            }
                        })
                        .catch(e => console.log('Ne morem samodejno naložiti zalogaSimon.json:', e));
                }
            } catch (e) { console.error("Napaka pri nalaganju shranjene zaloge:", e); }
        }

        function updateStockCountBadge() {
            const badge = document.getElementById('stock-count-badge');
            if (!badge) return;
            if (stockDataList && stockDataList.length > 0) {
                badge.innerText = `📦 Naloženo: ${stockDataList.length.toLocaleString('de-DE')} artiklov`;
                badge.style.color = '#34d399';
                badge.style.borderColor = '#10b981';
            } else {
                badge.innerText = `Ni naloženo (klikni Naloži)`;
                badge.style.color = '#f87171';
                badge.style.borderColor = '#ef4444';
            }
        }

        async function loadStockFile() {
            if (typeof window.showOpenFilePicker === 'function') {
                try {
                    const [fileHandle] = await window.showOpenFilePicker({
                        types: [{
                            description: 'Zaloga (JSON ali Excel .xlsx)',
                            accept: {
                                'application/json': ['.json'],
                                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
                            }
                        }],
                        multiple: false
                    });
                    const file = await fileHandle.getFile();
                    if (file.name.toLowerCase().endsWith('.xlsx')) {
                        const buffer = await file.arrayBuffer();
                        parseAndSaveExcelStock(buffer);
                    } else {
                        const text = await file.text();
                        if (text.startsWith('PK')) {
                            const buffer = await file.arrayBuffer();
                            parseAndSaveExcelStock(buffer);
                        } else {
                            parseAndSaveStock(text);
                        }
                    }
                } catch (e) {
                    if (e.name !== 'AbortError') alert("Napaka pri izbiri datoteke: " + e.message);
                }
            } else {
                let fileInput = document.createElement('input');
                fileInput.type = 'file';
                fileInput.accept = '.json,.xlsx';
                fileInput.onchange = e => {
                    let file = e.target.files[0];
                    if (file.name.toLowerCase().endsWith('.xlsx')) {
                        let reader = new FileReader();
                        reader.onload = event => parseAndSaveExcelStock(event.target.result);
                        reader.readAsArrayBuffer(file);
                    } else {
                        let reader = new FileReader();
                        reader.onload = event => {
                            const res = event.target.result;
                            if (typeof res === 'string' && res.startsWith('PK')) {
                                let r2 = new FileReader();
                                r2.onload = ev2 => parseAndSaveExcelStock(ev2.target.result);
                                r2.readAsArrayBuffer(file);
                            } else {
                                parseAndSaveStock(res);
                            }
                        };
                        reader.readAsText(file);
                    }
                };
                fileInput.click();
            }
        }

        function parseAndSaveExcelStock(buffer) {
            try {
                if (typeof XLSX === 'undefined') {
                    alert("Za branje Excel (.xlsx) datotek je potreben spletni modul XLSX.\n\nProsimo izberite datoteko 'zalogaSimon.json'.");
                    return;
                }
                const wb = XLSX.read(new Uint8Array(buffer), { type: 'array' });

                const prispeloMap = {};
                if (wb.Sheets['PRISPELO']) {
                    const rowsP = XLSX.utils.sheet_to_json(wb.Sheets['PRISPELO'], { header: 1 });
                    for (let r = 1; r < rowsP.length; r++) {
                        const row = rowsP[r];
                        if (row && row[1] !== undefined && row[6] !== undefined) {
                            const sif = String(row[1]).trim();
                            const kol = parseFloat(row[6]) || 0;
                            prispeloMap[sif] = (prispeloMap[sif] || 0) + kol;
                        }
                    }
                }

                const odpisMap = {};
                if (wb.Sheets['ODPIS']) {
                    const rowsO = XLSX.utils.sheet_to_json(wb.Sheets['ODPIS'], { header: 1 });
                    for (let r = 1; r < rowsO.length; r++) {
                        const row = rowsO[r];
                        if (row && row[1] !== undefined && row[6] !== undefined) {
                            const sif = String(row[1]).trim();
                            const kol = parseFloat(row[6]) || 0;
                            odpisMap[sif] = (odpisMap[sif] || 0) + kol;
                        }
                    }
                }

                const stockData = [];
                if (wb.Sheets['TRENUTNA ZALOGA']) {
                    const rowsZ = XLSX.utils.sheet_to_json(wb.Sheets['TRENUTNA ZALOGA'], { header: 1 });
                    for (let r = 1; r < rowsZ.length; r++) {
                        const row = rowsZ[r];
                        if (row && row[0] !== undefined) {
                            const sif = String(row[0]).trim();
                            const naziv = String(row[1] || '').trim();
                            const sirina = row[2] || '';
                            const visina = row[3] || '';
                            const gramatura = row[4] || '';
                            const zacetna = parseFloat(row[5]) || 0;
                            const pVal = prispeloMap[sif] || 0;
                            const oVal = odpisMap[sif] || 0;
                            const zalogaVal = zacetna + pVal - oVal;
                            const formatStr = (sirina && visina) ? `${sirina}x${visina}` : '';

                            stockData.push({
                                'šifra materiala': sif,
                                'sifra': sif,
                                'naziv': naziv,
                                'širina': sirina,
                                'višina': visina,
                                'format': formatStr,
                                'gramatura': gramatura,
                                'začetna zaloga': zacetna,
                                'prispelo': pVal,
                                'odpis': oVal,
                                'zaloga': zalogaVal
                            });
                        }
                    }
                }

                if (stockData.length > 0) {
                    stockDataList = stockData;
                    localStorage.setItem('zaloga_simon_data', JSON.stringify(stockData));
                    updateStockCountBadge();
                    alert(`Uspešno naložena zaloga iz Excel datoteke: ${stockData.length.toLocaleString('de-DE')} artiklov!`);
                    if (typeof renderStockSearchResults === 'function') renderStockSearchResults();
                } else {
                    alert("V Excel datoteki ni bilo najdenih artiklov na zavihku 'TRENUTNA ZALOGA'.");
                }
            } catch (e) {
                alert("Napaka pri branju Excel zaloge: " + e.message);
            }
        }

        function parseAndSaveStock(content) {
            try {
                if (typeof content === 'string' && (content.startsWith('PK') || content.includes('zaloga materiala'))) {
                    alert("Izbrali ste Excel (.xlsx) datoteko. Sistem jo je samodejno prepoznal.");
                    return;
                }
                let data = JSON.parse(content);
                if (Array.isArray(data)) {
                    stockDataList = data;
                    localStorage.setItem('zaloga_simon_data', JSON.stringify(data));
                    updateStockCountBadge();
                    alert(`Uspešno naložena zaloga: ${data.length.toLocaleString('de-DE')} artiklov!`);
                    if (typeof renderStockSearchResults === 'function') renderStockSearchResults();
                } else {
                    alert("Datoteka mora vsebovati JSON seznam artiklov (polje objektov).");
                }
            } catch (e) {
                alert("Napaka pri branju JSON zaloge: " + e.message + "\n\nZa naložitev Excel datoteke (.xlsx) izberite datoteko znova ali kliknite '📂 Naloži zalogaSimon.json'.");
            }
        }

        function searchStock(queryStr) {
            if (!stockDataList || stockDataList.length === 0) return [];
            if (!queryStr || queryStr.trim().length === 0) {
                return [...stockDataList].sort((a, b) => (parseFloat(b.zaloga || b.Zaloga) || 0) - (parseFloat(a.zaloga || a.Zaloga) || 0)).slice(0, 50);
            }

            let cleanQuery = queryStr.toLowerCase().trim()
                .replace(/(\d+)\s*[x\*]\s*(\d+)/gi, '$1x$2')
                .replace(/(\d+)\s*g\b/gi, '$1g');

            const rawTokens = cleanQuery.split(/\s+/).filter(t => t.length > 0);
            if (rawTokens.length === 0) return [];

            const extractDims = (str) => {
                const match = (str || '').match(/(\d+)\s*x\s*(\d+)/i);
                if (match) {
                    const d1 = parseInt(match[1], 10);
                    const d2 = parseInt(match[2], 10);
                    return [`${d1}x${d2}`, `${d2}x${d1}`];
                }
                return null;
            };

            const matches = stockDataList.filter(item => {
                const title = (item['naziv'] || item['opis'] || item['material'] || item['Naziv'] || '').toString().toLowerCase();
                const code = (item['šifra materiala'] || item['sifra'] || item['šifra'] || item['Šifra materiala'] || '').toString().toLowerCase();
                const gramVal = (item['gramatura'] !== undefined && item['gramatura'] !== null) ? String(item['gramatura']).trim() : '';
                const fmtStr = (item['format'] || (item['širina'] && item['višina'] ? `${item['širina']}x${item['višina']}` : '')).toString().toLowerCase();
                const w = item['širina'] ? String(item['širina']) : '';
                const h = item['višina'] ? String(item['višina']) : '';

                const itemDims = extractDims(fmtStr) || (w && h ? [`${w}x${h}`, `${h}x${w}`] : []);
                const fullStrNorm = `${title} ${code} ${gramVal}g ${fmtStr}`.replace(/(\d+)\s*g\b/g, '$1g');

                return rawTokens.every(token => {
                    // 1. Format Dimension Check (e.g. 70x100 matches 100x70 or 70x100)
                    const tokenDims = extractDims(token);
                    if (tokenDims) {
                        if (itemDims.some(d => tokenDims.includes(d)) || fmtStr.includes(token)) {
                            return true;
                        }
                    }

                    // 2. Grammage check (e.g. 250g)
                    if (/^\d+g$/i.test(token)) {
                        const gNum = token.slice(0, -1);
                        if (gramVal === gNum || fullStrNorm.includes(token) || title.includes(`${gNum}g`) || title.includes(`${gNum} g`)) {
                            return true;
                        }
                    }

                    // 3. Direct text match (e.g. "mat", "offset", "premazni")
                    if (fullStrNorm.includes(token) || title.includes(token) || code.includes(token) || fmtStr.includes(token)) {
                        return true;
                    }

                    // 4. Pure number match (e.g. "250") -> matches grammage or dimensions
                    if (/^\d+$/.test(token)) {
                        if (gramVal === token || w === token || h === token) {
                            return true;
                        }
                    }

                    return false;
                });
            });

            return matches.sort((a, b) => {
                const qA = parseFloat(a.zaloga !== undefined ? a.zaloga : a.Zaloga) || 0;
                const qB = parseFloat(b.zaloga !== undefined ? b.zaloga : b.Zaloga) || 0;
                if (qA > 0 && qB <= 0) return -1;
                if (qA <= 0 && qB > 0) return 1;
                return qB - qA;
            });
        }

        function getCombinedSearchQuery(targetComp) {
            let desc = '';
            let gram = '';

            if (targetComp === 'leaves') {
                desc = document.getElementById('calc-leaves-material')?.value || '';
                gram = document.getElementById('calc-paper-weight')?.value || '';
            } else if (targetComp === 'cover') {
                desc = document.getElementById('calc-cover-desc')?.value || '';
                gram = document.getElementById('calc-cardboard-weight')?.value || '';
            } else {
                desc = document.getElementById('calc-paper-type')?.value || document.getElementById('calc-material-desc')?.value || document.getElementById('calc-leaves-material')?.value || '';
                gram = document.getElementById('calc-paper-weight')?.value || '';
            }

            let parts = [];
            if (desc && desc.trim()) parts.push(desc.trim());
            if (gram && gram.trim()) {
                const gStr = gram.trim();
                if (!desc.toLowerCase().includes(gStr.toLowerCase())) {
                    parts.push(gStr.toLowerCase().endsWith('g') ? gStr : gStr + 'g');
                }
            }

            return parts.join(' ');
        }

        function onMaterialStockInput(inputEl, targetComp) {
            activeMaterialTarget = targetComp || 'paper';

            let codeInput = null;
            if (activeMaterialTarget === 'leaves') {
                codeInput = document.getElementById('calc-material-code');
            } else if (activeMaterialTarget === 'cover') {
                codeInput = document.getElementById('calc-cover-material-code');
            } else {
                codeInput = document.getElementById('calc-material-code') || document.getElementById('materialCode');
            }

            if (inputEl && inputEl.id !== 'calc-material-code' && inputEl.id !== 'calc-cover-material-code' && codeInput) {
                codeInput.value = '';
            }

            const combinedQuery = getCombinedSearchQuery(activeMaterialTarget);
            const val = combinedQuery || (inputEl ? inputEl.value : '');
            const targetInput = (inputEl && inputEl.id !== 'calc-paper-weight' && inputEl.id !== 'calc-cardboard-weight')
                ? inputEl
                : (document.getElementById('calc-paper-type') || document.getElementById('calc-material-desc') || document.getElementById('calc-leaves-material') || document.getElementById('calc-cover-desc') || inputEl);

            if (!val || val.trim().length < 1) {
                hideStockPopup();
                updateMaterialStockStatusBadge(targetInput, '', null);
                return;
            }
            if (!stockDataList || stockDataList.length === 0) {
                initStockData();
                if (!stockDataList || stockDataList.length === 0) {
                    showStockPopupPrompt(targetInput);
                    return;
                }
            }
            const results = searchStock(val);
            if (inputEl && inputEl.id !== 'calc-paper-weight' && inputEl.id !== 'calc-cardboard-weight') {
                showStockPopup(inputEl, results);
            }
            updateMaterialStockStatusBadge(targetInput, val, null);
        }

        function updateMaterialStockStatusBadge(inputEl, title, qty) {
            if (!inputEl) return;
            let parent = inputEl.parentElement;
            if (!parent) return;
            let badge = parent.querySelector('.stock-inline-status-badge');
            if (!badge) {
                badge = document.createElement('div');
                badge.className = 'stock-inline-status-badge';
                badge.style.fontSize = '0.8rem';
                badge.style.marginTop = '4px';
                badge.style.fontWeight = 'bold';
                badge.style.display = 'flex';
                badge.style.alignItems = 'center';
                badge.style.gap = '6px';
                parent.appendChild(badge);
            }

            if (qty !== undefined && qty !== null && qty !== '') {
                const qNum = parseFloat(qty) || 0;
                if (qNum > 0) {
                    badge.innerHTML = `<span style="color:#34d399; background:rgba(52,211,153,0.12); padding:3px 10px; border-radius:6px; border:1px solid rgba(52,211,153,0.3); display:inline-block;">✅ NA ZALOGI: <strong>${qNum.toLocaleString('de-DE')} pol</strong></span>`;
                } else {
                    badge.innerHTML = `<span style="color:#f87171; background:rgba(248,113,113,0.12); padding:3px 10px; border-radius:6px; border:1px solid rgba(248,113,113,0.3); display:inline-block;">❌ NI NA ZALOGI (0 pol)</span>`;
                }
            } else if (title && title.trim().length >= 2) {
                const matches = searchStock(title);
                if (matches && matches.length > 0) {
                    const totalQty = matches.reduce((sum, item) => sum + (parseFloat(item.zaloga !== undefined ? item.zaloga : item.Zaloga) || 0), 0);
                    const firstName = matches[0].naziv || matches[0].Naziv || title;
                    if (totalQty > 0) {
                        if (matches.length === 1) {
                            badge.innerHTML = `<span style="color:#34d399; background:rgba(52,211,153,0.12); padding:3px 10px; border-radius:6px; border:1px solid rgba(52,211,153,0.3); display:inline-block;">✅ NA ZALOGI: <strong>${totalQty.toLocaleString('de-DE')} pol</strong> (${escapeHtml(firstName)})</span>`;
                        } else {
                            badge.innerHTML = `<span style="color:#34d399; background:rgba(52,211,153,0.12); padding:3px 10px; border-radius:6px; border:1px solid rgba(52,211,153,0.3); display:inline-block;">✅ NA ZALOGI: <strong>${totalQty.toLocaleString('de-DE')} pol</strong> (${matches.length} artiklov za "${escapeHtml(title)}")</span>`;
                        }
                    } else {
                        badge.innerHTML = `<span style="color:#f87171; background:rgba(248,113,113,0.12); padding:3px 10px; border-radius:6px; border:1px solid rgba(248,113,113,0.3); display:inline-block;">❌ NI NA ZALOGI (0 pol v bazi za ${matches.length} artiklov "${escapeHtml(title)}")</span>`;
                    }
                } else {
                    badge.innerHTML = `<span style="color:#fbbf24; background:rgba(251,191,36,0.12); padding:3px 10px; border-radius:6px; border:1px solid rgba(251,191,36,0.3); display:inline-block;">⚠️ Ni najdeno v zalogi Simon za "${escapeHtml(title)}"</span>`;
                }
            } else {
                badge.innerHTML = '';
            }
        }

        function showStockPopupPrompt(inputEl) {
            let popup = getOrCreatePopup();
            const rect = inputEl.getBoundingClientRect();
            popup.style.position = 'fixed';
            popup.style.top = (rect.bottom + 2) + 'px';
            popup.style.left = rect.left + 'px';
            popup.style.width = Math.max(rect.width, 320) + 'px';
            popup.style.zIndex = '999999';
            popup.style.background = '#0f172a';
            popup.style.border = '1px solid #3b82f6';
            popup.style.borderRadius = '8px';
            popup.style.padding = '10px 14px';
            popup.style.boxShadow = '0 10px 30px rgba(0,0,0,0.6)';
            popup.style.display = 'block';

            popup.innerHTML = `
                <div style="font-size:0.85rem; color:#94a3b8; text-align:center;">
                    📦 Podatki o zalogi Simon še niso naloženi.<br>
                    <button type="button" onclick="loadStockFile()" style="margin-top:6px; padding:4px 10px; background:#3b82f6; color:white; border:none; border-radius:5px; cursor:pointer; font-weight:bold; font-size:0.8rem;">
                        📂 Naloži zalogaSimon.json
                    </button>
                </div>
            `;
        }

        function getOrCreatePopup() {
            let popup = document.getElementById('stock-autocomplete-popup');
            if (!popup) {
                popup = document.createElement('div');
                popup.id = 'stock-autocomplete-popup';
                document.body.appendChild(popup);

                document.addEventListener('click', (e) => {
                    if (!popup.contains(e.target) && !e.target.hasAttribute('oninput')) {
                        hideStockPopup();
                    }
                });
            }
            return popup;
        }

        function showStockPopup(inputEl, results) {
            let popup = getOrCreatePopup();
            if (!results || results.length === 0) {
                popup.style.display = 'none';
                return;
            }
            const rect = inputEl.getBoundingClientRect();
            popup.style.position = 'fixed';
            popup.style.top = (rect.bottom + 2) + 'px';
            popup.style.left = rect.left + 'px';
            popup.style.width = Math.max(rect.width, 360) + 'px';
            popup.style.zIndex = '999999';
            popup.style.background = '#0f172a';
            popup.style.border = '1px solid #3b82f6';
            popup.style.borderRadius = '8px';
            popup.style.boxShadow = '0 10px 30px rgba(0,0,0,0.8)';
            popup.style.maxHeight = '280px';
            popup.style.overflowY = 'auto';
            popup.style.display = 'block';

            let html = '';
            results.slice(0, 25).forEach(item => {
                const title = item['naziv'] || item['opis'] || item['material'] || item['Naziv'] || 'Neznan material';
                const code = item['šifra materiala'] || item['sifra'] || item['šifra'] || item['Šifra materiala'] || '';
                const qty = item['zaloga'] !== undefined ? item['zaloga'] : (item['Zaloga'] !== undefined ? item['Zaloga'] : 0);
                const gram = item['gramatura'] || '';
                const qtyNum = parseFloat(qty) || 0;
                const qtyColor = qtyNum > 0 ? '#34d399' : '#f87171';
                const formatStr = item['format'] || (item['širina'] && item['višina'] ? `${item['širina']}x${item['višina']}` : '');

                const safeTitle = escapeJsStr(title);
                const safeCode = escapeJsStr(code);
                const safeGram = escapeJsStr(gram ? String(gram) : '');
                const safeFmt = escapeJsStr(formatStr);

                html += `
                    <div onclick="selectStockItem('${safeTitle}', '${safeCode}', '${safeGram}', '${safeFmt}', ${qtyNum})"
                         style="padding: 8px 12px; border-bottom: 1px solid rgba(255,255,255,0.06); cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: #e2e8f0;"
                         onmouseover="this.style.background='#1e293b'" onmouseout="this.style.background='transparent'">
                        <div style="flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-right:8px;">
                            <strong style="color: #60a5fa;">${escapeHtml(title)}</strong>
                            ${code ? `<span style="font-size: 0.75rem; color: #94a3b8; margin-left: 6px;">[Šifra: ${escapeHtml(code)}]</span>` : ''}
                            ${gram ? `<span style="font-size: 0.75rem; color: #a7f3d0; margin-left: 6px;">${escapeHtml(String(gram))}g</span>` : ''}
                            ${formatStr ? `<span style="font-size: 0.75rem; color: #fbbf24; margin-left: 6px;">(${escapeHtml(formatStr)})</span>` : ''}
                        </div>
                        <div style="font-weight: bold; color: ${qtyColor}; font-size: 0.8rem; white-space: nowrap;">
                            📦 ${qtyNum.toLocaleString('de-DE')} pol
                        </div>
                    </div>
                `;
            });
            popup.innerHTML = html;
        }

        function hideStockPopup() {
            const popup = document.getElementById('stock-autocomplete-popup');
            if (popup) popup.style.display = 'none';
        }

        function escapeJsStr(str) {
            if (!str) return '';
            return String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;');
        }

        function escapeHtml(str) {
            if (!str) return '';
            return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        }

        function selectStockItem(title, code, gram, formatStr, qty) {
            hideStockPopup();

            let descInput = null;
            let codeInput = null;
            let weightInput = null;

            if (activeMaterialTarget === 'leaves') {
                descInput = document.getElementById('calc-leaves-material');
                codeInput = document.getElementById('calc-material-code');
                weightInput = document.getElementById('calc-paper-weight');
            } else if (activeMaterialTarget === 'cover') {
                descInput = document.getElementById('calc-cover-desc');
                codeInput = document.getElementById('calc-cover-material-code');
                weightInput = document.getElementById('calc-cardboard-weight');
            } else {
                descInput = document.getElementById('calc-paper-type') || document.getElementById('calc-material-desc') || document.getElementById('calc-leaves-material') || document.getElementById('materialCode');
                codeInput = document.getElementById('calc-material-code') || document.getElementById('materialCode');
                weightInput = document.getElementById('calc-paper-weight');
            }

            if (descInput) descInput.value = title;
            if (codeInput && code) codeInput.value = code;
            if (weightInput && gram) weightInput.value = gram;

            if (descInput && typeof extractGrammage === 'function' && weightInput) {
                extractGrammage(descInput, weightInput.id);
            }

            // PRIKAZ STANJA ZALOGE BREZ SAMODEJNEGA PRERAČUNAVANJA CEN/KALKULACIJE
            updateMaterialStockStatusBadge(descInput || codeInput, title, qty);
            closeStockSearchModal();
        }

        function openStockSearchModal(targetComp) {
            activeMaterialTarget = targetComp || 'paper';
            const modal = document.getElementById('modal-stock-search');
            if (modal) {
                modal.style.display = 'flex';
                const input = document.getElementById('stock-search-input');
                if (input) {
                    const currentVal = getCombinedSearchQuery(activeMaterialTarget);
                    input.value = currentVal;
                    input.focus();
                }
                renderStockSearchResults();
            }
        }

        function closeStockSearchModal() {
            const modal = document.getElementById('modal-stock-search');
            if (modal) modal.style.display = 'none';
        }

        function renderStockSearchResults() {
            const query = document.getElementById('stock-search-input')?.value || '';
            const container = document.getElementById('stock-search-results-container');
            if (!container) return;

            if (!stockDataList || stockDataList.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 2.5rem 1rem; color: #94a3b8;">
                        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📦</div>
                        <div style="font-weight: bold; font-size: 1.1rem; color: #e2e8f0; margin-bottom: 0.4rem;">Zaloga Simon še ni naložena</div>
                        <div style="font-size: 0.85rem; max-width: 450px; margin: 0 auto 1.2rem auto;">Naložite datoteko <code>zalogaSimon.json</code> z vašega računalnika ali mreže. Shranila se bo v vašem brskalniku.</div>
                        <button type="button" onclick="loadStockFile()" style="padding: 0.6rem 1.2rem; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 0.9rem; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);">
                            📂 Izberi datoteko zalogaSimon.json
                        </button>
                    </div>
                `;
                return;
            }

            const results = searchStock(query);
            if (results.length === 0) {
                container.innerHTML = `<div style="text-align: center; padding: 2rem; color: #f87171;">Ni materiala v zalogi, ki bi ustrezal iskanju "${escapeHtml(query)}".</div>`;
                return;
            }

            let html = `<div style="margin-bottom: 0.6rem; font-size: 0.8rem; color: #94a3b8;">Najdeno: <strong style="color:#38bdf8;">${results.length.toLocaleString('de-DE')}</strong> artiklov (prikazano do 100)</div>`;
            html += `<table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; color: #e2e8f0;">
                <thead>
                    <tr style="background: #1e293b; color: #94a3b8; text-align: left;">
                        <th style="padding: 10px 8px;">Šifra</th>
                        <th style="padding: 10px 8px;">Naziv materiala</th>
                        <th style="padding: 10px 8px;">Format</th>
                        <th style="padding: 10px 8px; text-align: right;">Zaloga (pol)</th>
                        <th style="padding: 10px 8px; text-align: center;">Akcija</th>
                    </tr>
                </thead>
                <tbody>`;

            results.slice(0, 100).forEach(item => {
                const title = item['naziv'] || item['opis'] || item['material'] || item['Naziv'] || 'Neznan material';
                const code = item['šifra materiala'] || item['sifra'] || item['šifra'] || item['Šifra materiala'] || '-';
                const qty = item['zaloga'] !== undefined ? item['zaloga'] : (item['Zaloga'] !== undefined ? item['Zaloga'] : 0);
                const gram = item['gramatura'] || '';
                const qtyNum = parseFloat(qty) || 0;
                const qtyColor = qtyNum > 0 ? '#34d399' : '#f87171';
                const formatStr = item['format'] || (item['širina'] && item['višina'] ? `${item['širina']}x${item['višina']}` : '-');

                const safeTitle = escapeJsStr(title);
                const safeCode = escapeJsStr(code === '-' ? '' : code);
                const safeGram = escapeJsStr(gram ? String(gram) : '');
                const safeFmt = escapeJsStr(formatStr === '-' ? '' : formatStr);

                html += `
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);" onmouseover="this.style.background='#1e293b'" onmouseout="this.style.background='transparent'">
                        <td style="padding: 8px; font-family: monospace; color: #38bdf8; font-weight: bold;">${escapeHtml(code)}</td>
                        <td style="padding: 8px; font-weight: bold; color: #f8fafc;">${escapeHtml(title)} ${gram ? `<span style="color:#a7f3d0; font-size:0.78rem;">(${gram}g)</span>` : ''}</td>
                        <td style="padding: 8px; color: #fbbf24;">${escapeHtml(formatStr)}</td>
                        <td style="padding: 8px; text-align: right; font-weight: bold; color: ${qtyColor};">📦 ${qtyNum.toLocaleString('de-DE')} pol</td>
                        <td style="padding: 8px; text-align: center;">
                            <button type="button" onclick="selectStockItem('${safeTitle}', '${safeCode}', '${safeGram}', '${safeFmt}')" style="padding: 4px 10px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 0.75rem; font-weight: bold;">Izberi</button>
                        </td>
                    </tr>
                `;
            });

            html += `</tbody></table>`;
            container.innerHTML = html;
        }

        document.addEventListener('DOMContentLoaded', () => {
            try { initStockData(); } catch (e) { console.error(e); }
            try { autoConnectFolder(); } catch (e) { console.error(e); }
            try { if (typeof calculate === 'function') calculate(); } catch (e) { console.error(e); }
        });
    