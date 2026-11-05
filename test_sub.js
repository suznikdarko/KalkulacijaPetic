
        var g_lastSaveHandle = null;

        
        // ========================================================
        // LOGIKA ZA FOKUSNI NAČIN IN DESNI NAVIGACIJSKI TRAK
        // ========================================================
        function switchCalcTab(tabId) {
            const tabs = ['papir-plosce', 'tisk-stroj', 'dodelava', 'povzetek', 'vse'];
            tabs.forEach(t => {
                const btn = document.getElementById('btn-calc-tab-' + t);
                const pane = document.getElementById('calc-tab-' + t);
                if (btn) {
                    if (t === tabId) {
                        btn.classList.add('active');
                        btn.style.background = 'rgba(59, 130, 246, 0.25)';
                        btn.style.borderColor = '#3b82f6';
                        btn.style.color = '#ffffff';
                    } else {
                        btn.classList.remove('active');
                        btn.style.background = 'rgba(30, 41, 59, 0.6)';
                        btn.style.borderColor = 'var(--glass-border)';
                        btn.style.color = '#94a3b8';
                    }
                }
                if (pane) {
                    if (tabId === 'vse' || t === tabId) {
                        pane.style.display = 'block';
                    } else {
                        pane.style.display = 'none';
                    }
                }
            });
            try {
                localStorage.setItem('pola2_active_calc_tab', tabId);
            } catch(e) {}
        }

        document.addEventListener('DOMContentLoaded', function() {
            try {
                const savedTab = localStorage.getItem('pola2_active_calc_tab');
                if (savedTab) switchCalcTab(savedTab);
            } catch(e) {}
        });
        function extractGrammage(sourceEl, targetId) {
            if (!sourceEl._grammageBlurBound) {
                sourceEl.addEventListener('blur', function () {
                    if (/^\d+$/.test(this.value)) {
                        this.value += 'g';
                        if (typeof calculate === 'function') calculate();
                    }
                });
                sourceEl._grammageBlurBound = true;
            }
            let val = sourceEl.value;
            if (/^\d+\s$/.test(val)) {
                sourceEl.value = val.trim() + "g ";
                val = sourceEl.value;
            }
            const match = val.match(/(\d+)\s*g/i) || val.match(/^(\d+)/);
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
        let quoteBasket = [];
        localStorage.removeItem('petric_quote_basket');
        renderBasket();
        updateWarnings();
        // Osveževanje košarice med zavihki
        window.addEventListener('storage', (e) => {
            if (e.key === 'petric_quote_basket') {
                quoteBasket = JSON.parse(e.newValue) || [];
                renderBasket();
            }
        });
        function togglePaper2Section() {
            const chk = document.getElementById('calc-paper2-enable');
            const container = document.getElementById('paper2-container');
            if (chk && container) {
                container.style.display = chk.checked ? 'flex' : 'none';
            }
        }
        function onCilinderPhaseChange() {
            const isAnyPhaseChecked = (document.getElementById('f-cilinder-zasek') && document.getElementById('f-cilinder-zasek').checked) ||
                                      (document.getElementById('f-cilinder-izsek') && document.getElementById('f-cilinder-izsek').checked) ||
                                      (document.getElementById('f-cilinder-perforacija') && document.getElementById('f-cilinder-perforacija').checked) ||
                                      (document.getElementById('f-cilinder-zleb') && document.getElementById('f-cilinder-zleb').checked);
            const activeChk = document.getElementById('f-cilinder-active');
            if (isAnyPhaseChecked && activeChk && !activeChk.checked) {
                activeChk.checked = true;
                toggleFinishRow('cilinder');
            }
            calculatePrice();
        }
        function getActiveFinishingList() {
            const list = [];
            const isChecked = (id) => document.getElementById(id) && document.getElementById(id).checked;
            if (isChecked('calc-paper2-enable')) {
                const p2Type = document.getElementById('calc-paper2-type') ? document.getElementById('calc-paper2-type').value.trim() : '';
                list.push(p2Type ? `Kaširanje / Lepljenje (${p2Type})` : 'Kaširanje / Lepljenje 2 pol');
            }
            if (isChecked('f-cilinder-active')) {
                const phases = [];
                if (isChecked('f-cilinder-zasek')) phases.push('Zasek');
                if (isChecked('f-cilinder-izsek')) phases.push('Izsek');
                if (isChecked('f-cilinder-perforacija')) phases.push('Perforacija');
                if (isChecked('f-cilinder-zleb')) phases.push('Žleb');
                if (phases.length > 0) {
                    list.push(phases.join(', '));
                } else {
                    list.push('Cilinder');
                }
            }
            if (isChecked('f-ril-active')) list.push('Ril - rilmašina');
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
            if (isChecked('f-dodatna-dela-active')) {
                const desc = document.getElementById('f-dodatna-dela-desc') ? document.getElementById('f-dodatna-dela-desc').value.trim() : '';
                list.push(desc ? `Dodatna dela (${desc})` : 'Dodatna dela');
            }
            if (isChecked('f-tool-active')) list.push('Orodje');
            if (isChecked('f-zasek-grafotehna-active')) list.push('Zasek-Grafotehna');
            if (isChecked('f-uv-active')) {
                const uvSidesEl = document.getElementById('f-uv-sides');
                const uvSides = uvSidesEl ? uvSidesEl.value : '1/0';
                list.push(`UV lak (${uvSides})`);
            }
            if (isChecked('f-uv2-active')) {
                const uvSidesEl = document.getElementById('f-uv2-sides');
                const uvSides = uvSidesEl ? uvSidesEl.value : '1/0';
                list.push(`UV lak 2 (${uvSides})`);
            }
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
        var g_activeBasketItemId = null;

        function collectPolaProjectSnapshot() {
            function gv(id) { var el = document.getElementById(id); return el ? el.value : ''; }
            function gc(id) { var el = document.getElementById(id); return el ? el.checked : false; }
            return {
                name: (document.getElementById('calc-project-name') ? document.getElementById('calc-project-name').value.trim() : '') || 'Brez imena',
                _source: 'pola',
                date: new Date().toLocaleDateString('sl-SI'),
                timestamp: Date.now(),
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
                    materialDesc: gv('calc-material-desc'),
                    productDesc: gv('calc-material-desc'),
                notes: gv('calc-notes'),
                mutType: gv('calc-mut-type'),
                mutQty: gv('calc-mut-qty'),
                mutPlates: gv('calc-mut-plates'),
                mutBreakdown: gv('calc-mut-breakdown'),
                mutDodatek: gv('calc-mut-dodatek'),
                orderType: gv('calc-order-type'),
                isUrgent: gc('calc-dn-urgent'),
                inputs: {
                    emailBody: gv('calc-email-content'),
                    paper2Enable: gc('calc-paper2-enable'),
                    paper2Price: gv('calc-paper2-price'),
                    paper2Unit: gv('calc-paper2-unit'),
                    paper2Weight: gv('calc-paper2-weight'),
                    paper2Type: gv('calc-paper2-type'),
                    paper2Code: gv('calc-paper2-code'),
                    paper2WasteManual: gv('calc-paper2-waste-manual'),
                    paper2PrepPrice: gv('calc-paper2-prep-price'),
                    paper2KasiranjePrice: gv('calc-paper2-kasiranje-price'),
                    paper2KasiranjeUnit: gv('calc-paper2-kasiranje-unit'),
                    washes: gv('calc-color-washes'),
                    washPrice: gv('calc-wash-price'),
                    coopPrice: gv('calc-cooperation-price'),
                    coopUnit: gv('calc-cooperation-unit'),
                    posterFormat: gv('calc-poster-format'),
                    posterTubes: gv('calc-poster-tubes'),
                    platesNum: gv('calc-plates-num'),
                    gripper: gv('gripper'),
                    emailSubject: gv('calc-email-subject'),
                    emailSender: gv('calc-email-sender'),
                    emailDate: gv('calc-email-date'),
                    givenSheets: gv('calc-given-sheets'),
                    dnNum: gv('calc-dn-number'),
                    dnOld: gv('calc-dn-old'),
                    deadline: gv('calc-dn-deadline'),
                    packaging: gv('calc-dn-packaging'),
                    orderedSheets: gv('calc-ordered-sheets'),
                    paperPackEnabled: gc('calc-paper-pack-enabled'),
                    paperPackSize: gv('calc-paper-pack-size'),
                    paperPackCustom: gv('calc-paper-pack-custom'),
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
                    paperWeight: gv('calc-paper-weight'),
                    pType: gv('calc-paper-type'),
                        materialDesc: gv('calc-material-desc'),
                        productDesc: gv('calc-material-desc'),
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
                    machinePasses: gv('calc-machine-passes'),
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
                        cilinder: { active: gc('f-cilinder-active'), prep: gv('f-cilinder-prep'), hours: gv('f-cilinder-hours'), rate: gv('f-cilinder-rate'), dodatek: gv('f-cilinder-dodatek'), zasek: gc('f-cilinder-zasek'), izsek: gc('f-cilinder-izsek'), perforacija: gc('f-cilinder-perforacija'), zleb: gc('f-cilinder-zleb') },
                        ril: { active: gc('f-ril-active'), speed: gv('f-ril-speed'), rate: gv('f-ril-rate'), hours: gv('f-ril-hours') },
                        zgibanje: { active: gc('f-zgibanje-active'), folds: gv('f-zgibanje-folds'), speed: gv('f-zgibanje-speed') },
                        razrezFormat: { active: gc('f-razrez-format-active'), speed: gv('f-razrez-format-speed'), rate: gv('f-razrez-format-rate') },
                        razrez: { active: gc('f-razrez-format-active'), speed: gv('f-razrez-format-speed'), rate: gv('f-razrez-format-rate') },
                        precut: { active: gc('f-precut-active'), prep: gv('f-precut-prep'), per1000: gv('f-precut-per1000') },
                        lepljenje: { active: gc('f-lepljenje-active'), prep: gv('f-lepljenje-prep'), per1000: gv('f-lepljenje-per1000') },
                        spiral: { active: gc('f-spiral-active'), price: gv('f-spiral-price') },
                        spiraljenje: { active: gc('f-spiral-active'), price: gv('f-spiral-price') },
                        extra: { active: gc('f-extra-active'), speed: gv('f-extra-speed'), rate: gv('f-extra-rate'), qty: gv('f-extra-qty') },
                        dodatnaDela: { active: gc('f-dodatna-dela-active'), desc: gv('f-dodatna-dela-desc'), sheets: gv('f-dodatna-dela-sheets'), kom: gv('f-dodatna-dela-kom'), price: gv('f-dodatna-dela-price') },
                        tool: { active: gc('f-tool-active'), cost: gv('f-tool-cost') },
                        zasekGrafotehna: { active: gc('f-zasek-grafotehna-active'), price: gv('f-zasek-grafotehna-price') },
                        zasek: { active: gc('f-zasek-grafotehna-active'), price: gv('f-zasek-grafotehna-price') },
                        uv: { active: gc('f-uv-active'), prep: gv('f-uv-prep'), per1000: gv('f-uv-per1000'), sides: gv('f-uv-sides'), type: gv('f-uv-type'), format: gv('f-uv-format'), extraWaste: gv('f-uv-extra-waste') },
                        uv2: { active: gc('f-uv2-active'), prep: gv('f-uv2-prep'), per1000: gv('f-uv2-per1000'), sides: gv('f-uv2-sides'), type: gv('f-uv2-type'), format: gv('f-uv2-format'), extraWaste: gv('f-uv2-extra-waste') },
                        personalization: { active: gc('f-personalization-active'), sides: gv('f-personalization-sides'), price: gv('f-personalization-price'), qty: gv('f-personalization-qty'), split: gv('f-personalization-split') },
                        lam: { active: gc('f-lam-active'), type: gv('f-lam-type'), sides: gv('f-lam-sides'), per1000: gv('f-lam-per1000'), prep: gv('f-lam-prep') },
                        delivery: { active: gc('f-delivery-active'), count: gv('f-post-count'), pricePer: gv('f-post-price-per') },
                        delFixed: { active: gc('f-del-fixed-active'), price: gv('f-del-fixed-price') },
                        deliveryFixed: { active: gc('f-del-fixed-active'), price: gv('f-del-fixed-price') }
                    }
                }
            };
        }

        function loadBasketCalculation(id) {
            try {
                var item = quoteBasket.find(x => x.id === id);
                if (!item) return;
                g_activeBasketItemId = id;

                quoteBasket.forEach(it => {
                    it.isSelected = (it.id === id);
                });
                localStorage.setItem('petric_quote_basket', JSON.stringify(quoteBasket));

                window.g_loadingProject = true;

                if (item.snapshot && item.snapshot.inputs) {
                    var snap = JSON.parse(JSON.stringify(item.snapshot));
                    snap.quoteBasket = quoteBasket;
                    loadProjectData(snap);
                } else {
                    function setV(elemId, val, isChk) {
                        var el = document.getElementById(elemId);
                        if (!el) return;
                        if (isChk) el.checked = !!val;
                        else el.value = (val !== undefined && val !== null) ? val : '';
                        if (typeof updateInputStyles === 'function') updateInputStyles(el);
                    }
                    if (item.name || item.projectName) setV('calc-project-name', item.name || item.projectName);
                    if (item.customer) setV('calc-customer', item.customer);
                    if (item.productCode && item.productCode !== '/') setV('calc-product-code', item.productCode);
                    if (item.materialCode && item.materialCode !== '/') setV('calc-material-code', item.materialCode);
                    if (item.deliveryAddress) setV('calc-delivery-address', item.deliveryAddress);

                    if (item.spec && item.spec.format) {
                        var fParts = item.spec.format.replace(/mm/gi, '').split('x').map(s => s.trim());
                        if (fParts.length === 2) {
                            setV('width', fParts[0]);
                            setV('height', fParts[1]);
                        }
                    }
                    if (item.spec && item.spec.paper) {
                        var pMatch = item.spec.paper.match(/^(\d+)g\s*(.*)$/);
                        if (pMatch) {
                            setV('calc-paper-weight', pMatch[1]);
                            setV('calc-paper-type', pMatch[2].replace(/\+.*$/, '').trim());
                        }
                    }
                    if (item.quantities && item.quantities.length > 0) {
                        setV('quantity', item.quantities.map(q => q.qty).join(', '));
                    }
                    if (typeof calculate === 'function') calculate();
                }

                window.g_loadingProject = false;

                if (item.quantities && item.quantities.length > 0) {
                    var ordEl = document.getElementById('ordered-quantity');
                    if (ordEl) {
                        ordEl.value = item.quantities[0].qty;
                    }
                }

                g_editedWorkOrderHTML = '';
                if (typeof calculatePrice === 'function') calculatePrice();
                else if (typeof calculate === 'function') calculate();
                if (typeof updateCustomDocsPreview === 'function') updateCustomDocsPreview();

                renderBasket();
            } catch (err) {
                console.error("loadBasketCalculation error:", err);
                alert("Napaka pri nalaganju izračuna: " + err.message);
            }
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
                    const res = calculateForSingleQty(q, undefined, undefined, undefined, oqVal, idx);
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
                    projectName: projectName,
                    customer: (document.getElementById('calc-customer') ? document.getElementById('calc-customer').value : '') || '',
                    productCode: (document.getElementById('calc-product-code') ? document.getElementById('calc-product-code').value : '') || '/',
                    materialCode: (document.getElementById('calc-material-code') ? document.getElementById('calc-material-code').value : '') || '/',
                    deliveryAddress: (document.getElementById('calc-delivery-address') ? document.getElementById('calc-delivery-address').value : '') || '',
                    quoteNum: (document.getElementById('calc-quote-number') ? document.getElementById('calc-quote-number').value : '') || '',
                    spec: {
                        usePersonalization: document.getElementById('calc-use-personalization') ? document.getElementById('calc-use-personalization').checked : false,
                        useManualWork: document.getElementById('calc-use-manual-work') ? document.getElementById('calc-use-manual-work').checked : false,
                        wasteManual: document.getElementById('calc-paper-waste-manual') ? document.getElementById('calc-paper-waste-manual').value : '',
                        mutPlates: document.getElementById('calc-mut-plates') ? document.getElementById('calc-mut-plates').value : '',
                        format: (document.getElementById('width') ? document.getElementById('width').value : '') + ' x ' + (document.getElementById('height') ? document.getElementById('height').value : '') + ' mm',
                        paper: (document.getElementById('calc-paper-weight') ? document.getElementById('calc-paper-weight').value : '') + 'g ' + (document.getElementById('calc-paper-type') ? document.getElementById('calc-paper-type').value : '') +
                            (document.getElementById('calc-paper2-enable') && document.getElementById('calc-paper2-enable').checked ?
                                ' + Kaširano: ' + (document.getElementById('calc-paper2-weight') ? document.getElementById('calc-paper2-weight').value + 'g ' : '') + (document.getElementById('calc-paper2-type') ? document.getElementById('calc-paper2-type').value : 'Papir 2') : ''),
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
                    }),
                    snapshot: collectPolaProjectSnapshot()
                };

                quoteBasket.forEach(it => { it.isSelected = false; });
                basketItem.isSelected = true;
                g_activeBasketItemId = basketItem.id;
                quoteBasket.push(basketItem);
                localStorage.setItem('petric_quote_basket', JSON.stringify(quoteBasket));
                renderBasket();
                // Povratna informacija uporabniku
                const btns = document.querySelectorAll('button[onclick="addToBasket()"]');
                if (btns.length > 0) {
                    btns.forEach(btn => {
                        const originalText = btn.innerHTML;
                        btn.innerHTML = "✅ DODANO";
                        setTimeout(() => { btn.innerHTML = originalText; }, 1500);
                    });
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
            if (g_activeBasketItemId === id) {
                g_activeBasketItemId = quoteBasket.length > 0 ? quoteBasket[0].id : null;
            }
            localStorage.setItem('petric_quote_basket', JSON.stringify(quoteBasket));
            g_editedQuoteHTML = '';
            g_editedQuoteATHTML = '';
            renderBasket();
        }
        function clearBasket() {
            if (confirm("Izbrišem vse elemente iz košarice?")) {
                quoteBasket = [];
                g_activeBasketItemId = null;
                localStorage.setItem('petric_quote_basket', JSON.stringify(quoteBasket));
                g_editedQuoteHTML = '';
                g_editedQuoteATHTML = '';
                renderBasket();
            }
        }
        function renderBasket() {
            try {
                const badges = document.querySelectorAll('.basket-count-badge');
                const count = (quoteBasket && quoteBasket.length) ? quoteBasket.length : 0;
                badges.forEach(b => {
                    b.innerText = count;
                    b.style.display = count > 0 ? 'inline-block' : 'none';
                });
                const container = document.getElementById('basket-items-list');
                const basketContainer = document.getElementById('basket-container');
                if (!container || !basketContainer) return;

                const qNum = (document.getElementById('calc-quote-number') ? document.getElementById('calc-quote-number').value : '') || '';
                const subtextEl = document.getElementById('basket-quote-subtext');
                if (subtextEl) {
                    subtextEl.innerHTML = (qNum ? `Št. ponudbe: <strong style="color: #60a5fa;">${escapeHtml(qNum)}</strong> | ` : '') + `${count} ${count === 1 ? 'shranjen izračun' : (count === 2 ? 'shranjena izračuna' : 'shranjenih izračunov')}`;
                }

                if (!quoteBasket || quoteBasket.length === 0) {
                    container.innerHTML = '<div style="padding: 10px; color: #94a3b8; font-size: 0.8rem; text-align: center;">Košarica je prazna.</div>';
                    basketContainer.style.display = 'none';
                    return;
                }
                basketContainer.style.display = 'block';
                container.innerHTML = quoteBasket.map(item => {
                    if (!item || !item.spec || !item.quantities) return '';
                    var isActive = (item.id === g_activeBasketItemId) || (item.isSelected === true);
                    return `
                    <div style="padding: 10px; background: ${isActive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255,255,255,0.05)'}; border-radius: 8px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: flex-start; border-left: ${isActive ? '4px solid #10b981' : '3px solid #3b82f6'}; border: ${isActive ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255,255,255,0.05)'};">
                        <div style="flex: 1; cursor: pointer;" onclick="loadBasketCalculation(${item.id})">
                            <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                                <div style="font-weight: bold; color: white; font-size: 0.9rem;">${item.name}</div>
                                ${isActive ? `<span style="background: #10b981; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.68rem; font-weight: bold; letter-spacing: 0.5px;">✓ IZDELANO PO PONUDBI</span>` : ''}
                            </div>
                            <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">${item.type} | ${item.spec.format} | ${item.spec.paper || ''}</div>
                            <div style="margin-top: 4px; display: flex; gap: 4px; flex-wrap: wrap;">
                                ${item.quantities.map(q => `<span style="font-size: 0.7rem; background: ${isActive ? 'rgba(16, 185, 129, 0.25)' : 'rgba(59, 130, 246, 0.2)'}; color: ${isActive ? '#a7f3d0' : '#60a5fa'}; padding: 2px 6px; border-radius: 4px; font-weight: 500;">${formatQty(q.qty)}: ${formatPrice(q.priceTotal)}</span>`).join('')}
                            </div>
                        </div>
                        <div style="display: flex; align-items: center; gap: 4px; margin-left: 8px;">
                            <button type="button" onclick="loadBasketCalculation(${item.id})" style="background: ${isActive ? '#10b981' : 'rgba(16, 185, 129, 0.2)'}; border: 1px solid #10b981; color: ${isActive ? '#ffffff' : '#34d399'}; border-radius: 6px; cursor: pointer; padding: 4px 8px; font-size: 0.8rem; font-weight: bold; display: inline-flex; align-items: center; gap: 4px;" title="Preklopi na ta izračun / izberi kot izdelano po ponudbi za DN">
                                📁 ${isActive ? 'Naloženo' : 'Izberi'}
                            </button>
                            <button type="button" onclick="removeFromBasket(${item.id})" style="background: none; border: none; color: #ef4444; cursor: pointer; padding: 4px 6px; font-size: 1rem;" title="Odstrani iz ponudbe">✕</button>
                        </div>
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
        function getPaperFamily(sw, sh) {
            const maxS = Math.max(sw, sh);
            const minS = Math.min(sw, sh);
            if ((maxS >= 950 && maxS <= 1080 && minS >= 660 && minS <= 740) ||
                (maxS >= 660 && maxS <= 740 && minS >= 460 && minS <= 540)) {
                return 'B';
            }
            if ((maxS >= 870 && maxS <= 940 && minS >= 610 && minS <= 670) ||
                (maxS >= 610 && maxS <= 670 && minS >= 420 && minS <= 470)) {
                return 'N';
            }
            if ((maxS >= 800 && maxS <= 870 && minS >= 570 && minS <= 610) ||
                (maxS >= 570 && maxS <= 610 && minS >= 400 && minS <= 430)) {
                return 'A';
            }
            return 'OTHER';
        }
        function getPersonalizationSplitInfo(sheetW, sheetH, itemsPerSheet, mType) {
            sheetW = parseFloat(sheetW) || 0;
            sheetH = parseFloat(sheetH) || 0;
            itemsPerSheet = parseInt(itemsPerSheet) || 1;
            
            let splitSelect = document.getElementById('f-personalization-split');
            let userSplit = splitSelect ? splitSelect.value : 'auto';
            
            let isB2Sheet = (sheetW >= 650 && sheetW <= 720 && sheetH >= 450 && sheetH <= 520) || (sheetH >= 650 && sheetH <= 720 && sheetW >= 450 && sheetW <= 520);
            let maxSheetDim = Math.max(sheetW, sheetH);
            let isLargeSheet = (isB2Sheet || maxSheetDim >= 500 || mType === 'S8');
            
            let digCutFactor = 1;
            if (isLargeSheet) {
                if (userSplit === '1') {
                    digCutFactor = 1;
                } else if (userSplit === '2') {
                    digCutFactor = 2;
                } else if (userSplit === '3') {
                    digCutFactor = 3;
                } else if (userSplit === '4') {
                    digCutFactor = 4;
                } else { // 'auto'
                    if (itemsPerSheet % 4 === 0 && itemsPerSheet % 3 !== 0 && itemsPerSheet % 2 !== 0) {
                        digCutFactor = 4;
                    } else if (itemsPerSheet % 3 === 0 && itemsPerSheet % 2 !== 0) {
                        digCutFactor = 3;
                    } else {
                        digCutFactor = 2;
                    }
                }
            }
            
            let cutAxis = sheetW >= sheetH ? 'W' : 'H';
            let bLayout = window.g_lastBestLayout;
            if (bLayout && (digCutFactor === 2 || digCutFactor === 3)) {
                if (bLayout.cols % digCutFactor === 0 && bLayout.rows % digCutFactor !== 0) {
                    cutAxis = 'W';
                } else if (bLayout.rows % digCutFactor === 0 && bLayout.cols % digCutFactor !== 0) {
                    cutAxis = 'H';
                } else if (bLayout.cols >= digCutFactor && bLayout.rows < digCutFactor) {
                    cutAxis = 'W';
                } else if (bLayout.rows >= digCutFactor && bLayout.cols < digCutFactor) {
                    cutAxis = 'H';
                }
            }

            let cutW = sheetW;
            let cutH = sheetH;
            
            if (digCutFactor === 2) {
                if (cutAxis === 'W') cutW = Math.round(sheetW / 2);
                else cutH = Math.round(sheetH / 2);
            } else if (digCutFactor === 3) {
                if (cutAxis === 'W') cutW = Math.round(sheetW / 3);
                else cutH = Math.round(sheetH / 3);
            } else if (digCutFactor === 4) {
                cutW = Math.round(sheetW / 2);
                cutH = Math.round(sheetH / 2);
            }
            
            let partMax = Math.max(cutW, cutH);
            let partMin = Math.min(cutW, cutH);
            let isTrimmed = false;

            // Obrezovanje traku / pole na max digitalno dolžino 480 mm (npr. s 498 mm ali 525 mm na 480 mm - digital ne rabi 10mm ofsetnega prijemalca)
            if (partMax > 480 && partMax <= 525) {
                let canTrimMax = true;
                let bLayout = window.g_lastBestLayout;
                if (bLayout && bLayout.itemW && bLayout.itemH && bLayout.cols && bLayout.rows) {
                    let cutAxis = sheetW >= sheetH ? 'W' : 'H';
                    let colsOnHalf = cutAxis === 'W' ? Math.ceil(bLayout.cols / digCutFactor) : bLayout.cols;
                    let rowsOnHalf = cutAxis === 'H' ? Math.ceil(bLayout.rows / digCutFactor) : bLayout.rows;
                    let occMax = Math.max(colsOnHalf * bLayout.itemW, rowsOnHalf * bLayout.itemH);
                    if (occMax > 480) {
                        canTrimMax = false;
                    }
                }
                if (canTrimMax) {
                    partMax = 480;
                    isTrimmed = true;
                }
            }
            // Obrezovanje širine na max digitalno širino 320 mm (npr. pri razrezu B2 pole na pol: 349-365 mm na 320 mm)
            if (partMin > 320 && partMin <= 365) {
                let canTrimMin = true;
                let bLayout = window.g_lastBestLayout;
                if (bLayout && bLayout.itemW && bLayout.itemH && bLayout.cols && bLayout.rows) {
                    let cutAxis = sheetW >= sheetH ? 'W' : 'H';
                    let colsOnHalf = cutAxis === 'W' ? Math.ceil(bLayout.cols / digCutFactor) : bLayout.cols;
                    let rowsOnHalf = cutAxis === 'H' ? Math.ceil(bLayout.rows / digCutFactor) : bLayout.rows;
                    let occDim1 = colsOnHalf * bLayout.itemW;
                    let occDim2 = rowsOnHalf * bLayout.itemH;
                    let occMin = Math.min(occDim1, occDim2);
                    let occMax = Math.max(occDim1, occDim2);
                    if (occMin > 320 || occMax > 480) {
                        canTrimMin = false;
                    }
                } else {
                    let wEl = document.getElementById('width');
                    let hEl = document.getElementById('height');
                    let bldEl = document.getElementById('bleed');
                    let wInp = parseFloat((wEl ? wEl.value : '').replace(',', '.')) || 0;
                    let hInp = parseFloat((hEl ? hEl.value : '').replace(',', '.')) || 0;
                    let bld = parseFloat((bldEl ? bldEl.value : '2').replace(',', '.')) || 0;
                    let itmMin = Math.min(wInp, hInp) + 2 * bld;
                    let itmMax = Math.max(wInp, hInp) + 2 * bld;
                    if (itmMin > 320 || itmMax > 480) {
                        canTrimMin = false;
                    }
                }
                if (canTrimMin) {
                    partMin = 320;
                    isTrimmed = true;
                }
            }
            
            // Maximum digital format for personalization is 480x320 mm
            let fitsDigital = (partMax <= 480 && partMin <= 320) || (partMax === 0 || partMin === 0);
            let partStr = (partMax > 0 && partMin > 0) ? `${partMax}x${partMin} mm` : '480x320 mm';
            
            return {
                digCutFactor: digCutFactor,
                isLargeSheet: isLargeSheet,
                cutAxis: cutAxis,
                cutW: cutW,
                cutH: cutH,
                partMax: partMax,
                partMin: partMin,
                fitsDigital: fitsDigital,
                partStr: partStr,
                isTrimmed: isTrimmed,
                userSplit: userSplit
            };
        }
        function isSheetCompatibleWithPers(s) {
            if (!s) return true;
            const minDim = Math.min(s.w, s.h);
            const maxDim = Math.max(s.w, s.h);
            if (maxDim <= 478 && minDim <= 318) return true;
            if ((s.w >= 650 && s.w <= 720 && s.h >= 450 && s.h <= 520) || (s.h >= 650 && s.h <= 720 && s.w >= 450 && s.w <= 520) || s.name === 'B2' || s.name === '720x520' || s.name === '638x448' || s.name === '638x299' || s.name === 'B3' || (s.w === 498 && s.h === 348) || (s.w === 348 && s.h === 498)) return true;
            if (s.name === 'B1' || s.name === 'A1' || s.name === '900x640') return true;
            return false;
        }
        function isSheetFamilyMatching(rawFamily, sheetFamily, mType = '', sheetName = '') {
            if (sheetFamily === 'DIGITAL') return (mType === 'digital' || mType === 'digital-plakat' || mType === 'digital-rollup');
            if (rawFamily === 'OTHER') return true;
            if (mType === 'digital-plakat' || mType === 'digital-rollup') return true;
            if (rawFamily === 'N') {
                return sheetFamily === 'N' || sheetName === '638x448' || sheetName === '638x299' || sheetName === 'SRA3';
            }
            return rawFamily === sheetFamily;
        }
        const sheets = [
            { name: "B1", w: 1000, h: 700, family: "B" },
            { name: "A1", w: 841, h: 594, family: "A" },
            { name: "900x640", w: 900, h: 640, family: "N" },
            { name: "720x520", w: 720, h: 520, family: "B" },
            { name: "B2", w: 698, h: 498, family: "B" },
            { name: "6 iz B1", w: 349, h: 332, family: "B" },
            { name: "638x448", w: 638, h: 448, family: "N" },
            { name: "638x299", w: 638, h: 299, family: "N" },
            { name: "B3", w: 498, h: 348, family: "B" },
            { name: "Riba", w: 698, h: 332, family: "B" },
            { name: "498x232", w: 498, h: 232, family: "B" },
            { name: "B4", w: 348, h: 248, family: "B" },
            { name: "A2", w: 592, h: 418, family: "A" },
            { name: "A3", w: 418, h: 295, family: "A" },
            { name: "SRA3", w: 448, h: 318, family: "A" },
            { name: "A4", w: 295, h: 208, family: "A" },
            { name: "318x298", w: 318, h: 298, family: "N" },
            { name: "318x223", w: 318, h: 223, family: "N" },
            { name: "Digital (480x320)", w: 480, h: 320, family: "DIGITAL" },
            { name: "Digital (448x318)", w: 448, h: 318, family: "DIGITAL" },
            { name: "Roll Up (850x2000)", w: 850, h: 2000, family: "DIGITAL" }
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
            '4/1': { passes: 2, wasteImpressions: 480 },
            '4/4': { passes: 2, wasteImpressions: 640 }, // Dodatek za tisk 4/4 (320 pol za 1. stran + 320 pol za 2. stran) = 640 pol
            '4/OB': { passes: 2, wasteImpressions: 380 },
            '8/0': { passes: 1, wasteImpressions: 450 }
        };
        const machineProfiles = {
            'S4': { rate: 120, speed: 6900, prep: 10, useDynamic: true, maxW: 518, maxH: 348, defaultFormat: 'B3' },
            'S8': { rate: 150, speed: 6900, prep: 10, useDynamic: true, maxW: 720, maxH: 520, defaultFormat: 'B2' },
            'CD': { rate: 180, speed: 6900, prep: 10, useDynamic: true, maxW: 720, maxH: 520, defaultFormat: 'B2' },
            'SM4+lak': { rate: 160, speed: 6900, prep: 10, useDynamic: true, maxW: 720, maxH: 520, defaultFormat: 'B2' },
            'CD UV': { rate: 280, speed: 6600, prep: 10, useDynamic: true, maxW: 720, maxH: 520, defaultFormat: 'B2', platePrice: 14.00, prepPrice: 70.00, changePrice: 70.00 },
            'digital': { rate: 40, speed: 1800, prep: 10, useDynamic: false, defaultFormat: 'Digital (480x320)', maxW: 480, maxH: 320 },
            'digital-plakat': { rate: 0, speed: 500, prep: 0, useDynamic: false, defaultFormat: 'B1', maxW: 1000, maxH: 707 },
            'digital-rollup': { rate: 0, speed: 500, prep: 0, useDynamic: false, defaultFormat: 'Roll Up (850x2000)', maxW: 2500, maxH: 2500 },
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
        function getDigitalPosterUnitPrice(format, qty) {
            qty = parseInt(qty) || 1;
            if (format === 'B1') {
                if (qty <= 5) return 15.06;
                if (qty <= 10) return 14.35;
                if (qty <= 20) return 12.48;
                if (qty <= 30) return 10.12;
                if (qty <= 50) return 8.67;
                return 8.12;
            } else if (format === 'B2') {
                if (qty <= 5) return 12.48;
                if (qty <= 10) return 11.32;
                if (qty <= 20) return 10.01;
                if (qty <= 30) return 8.437;
                return 7.785;
            } else if (format === 'A1') {
                if (qty <= 5) return 13.45;
                if (qty <= 10) return 12.01;
                if (qty <= 20) return 11.31;
                if (qty <= 30) return 9.44;
                if (qty <= 50) return 8.01;
                if (qty <= 100) return 7.785;
                if (qty <= 200) return 6.21;
                if (qty <= 400) return 4.33;
                return 2.39;
            }
            return 0;
        }
        function getDigitalRollUpUnitPrice(qty) {
            qty = parseInt(qty) || 1;
            if (qty <= 1) return 118;
            if (qty <= 5) return 110;
            return 100;
        }
        function updateMachineEfficiencyWarning(mType, qty, totalPrintCost, totalPrepCost, totalSheetsNeeded) {
            const warnEl = document.getElementById('machine-efficiency-warning');
            if (!warnEl) return;
            if (mType === 'digital-rollup') {
                warnEl.style.display = 'block';
                warnEl.style.background = 'rgba(59, 130, 246, 0.12)';
                warnEl.style.border = '1px solid #3b82f6';
                warnEl.style.color = '#93c5fd';
                let uPrice = getDigitalRollUpUnitPrice(qty);
                let tot = qty * uPrice;
                warnEl.innerHTML = `🚩 <strong>Digitalni ROLL UP:</strong> Cena po ceniku: <strong>${uPrice} € / kom</strong> (skupaj za ${qty} kos: <strong>${tot.toFixed(2).replace('.', ',')} €</strong>). Brez dodatnih stroškov papirja, priprave ali dodelave.`;
                return;
            }
            if (mType === 'digital-plakat') {
                const posterFormat = document.getElementById('calc-poster-format') ? document.getElementById('calc-poster-format').value : 'B1';
                if (qty >= 40) {
                    warnEl.style.display = 'block';
                    warnEl.style.background = 'rgba(245, 158, 11, 0.15)';
                    warnEl.style.border = '1px solid #f59e0b';
                    warnEl.style.color = '#fef08a';
                    warnEl.innerHTML = `⚠️ <strong>Nasvet za ekonomičnost (Plakati):</strong> Pri nakladi <strong>${qty} kos</strong> (${posterFormat}) na digitalnem ploterju znaša tisk <strong>${totalPrintCost.toFixed(2).replace('.', ',')} €</strong>. Za tolikšno količino plakatov priporočamo preverjanje kalkulacije na offset stroju (npr. <strong>S8</strong> ali <strong>CD</strong>), saj je offset tisk pri večjih nakladah ugodnejši!`;
                } else {
                    warnEl.style.display = 'block';
                    warnEl.style.background = 'rgba(16, 185, 129, 0.12)';
                    warnEl.style.border = '1px solid #10b981';
                    warnEl.style.color = '#a7f3d0';
                    warnEl.innerHTML = `✅ <strong>Eko izbira:</strong> Digitalni tisk plakatov je za naklado <strong>${qty} kos</strong> optimalna in najugodnejša izbira (brez stroškov offset priprav in CTP plošč).`;
                }
            } else if (mType === 'digital') {
                if (totalSheetsNeeded >= 300 || qty >= 500) {
                    warnEl.style.display = 'block';
                    warnEl.style.background = 'rgba(245, 158, 11, 0.15)';
                    warnEl.style.border = '1px solid #f59e0b';
                    warnEl.style.color = '#fef08a';
                    warnEl.innerHTML = `⚠️ <strong>Nasvet za ekonomičnost:</strong> Pri nakladi <strong>${qty} kos</strong> (${totalSheetsNeeded} pol) je digitalni tisk obsežen. Priporočamo preverjanje tiska na offset stroju (npr. <strong>S4</strong> ali <strong>S8</strong>), ker bo cena po poli na offsetu nižja.`;
                } else {
                    warnEl.style.display = 'block';
                    warnEl.style.background = 'rgba(16, 185, 129, 0.12)';
                    warnEl.style.border = '1px solid #10b981';
                    warnEl.style.color = '#a7f3d0';
                    warnEl.innerHTML = `✅ <strong>Eko izbira:</strong> Digitalni tisk je za naklado <strong>${qty} kos</strong> hitra in ekonomična rešitev.`;
                }
            } else if (mType !== 'cooperation') {
                if (totalSheetsNeeded <= 80 && qty <= 100) {
                    warnEl.style.display = 'block';
                    warnEl.style.background = 'rgba(59, 130, 246, 0.15)';
                    warnEl.style.border = '1px solid #3b82f6';
                    warnEl.style.color = '#bfdbfe';
                    warnEl.innerHTML = `💡 <strong>Nasvet:</strong> Za majhno naklado (<strong>${qty} kos</strong>) pri offset tiska plačate fiksno pripravo in CTP plošče (${totalPrepCost.toFixed(2).replace('.', ',')} €). Priporočamo preverjanje <strong>Digitalnega tiska</strong>!`;
                } else {
                    warnEl.style.display = 'none';
                }
            } else {
                warnEl.style.display = 'none';
            }
        }
        function onPosterFormatChange() {
            const posterFmt = document.getElementById('calc-poster-format') ? document.getElementById('calc-poster-format').value : 'B1';
            const mFormatSelect = document.getElementById('machine-format');
            if (mFormatSelect) {
                mFormatSelect.value = posterFmt;
            }
            const widthEl = document.getElementById('width');
            const heightEl = document.getElementById('height');
            if (posterFmt === 'B1') {
                if (widthEl) widthEl.value = "700";
                if (heightEl) heightEl.value = "1000";
            } else if (posterFmt === 'B2') {
                if (widthEl) widthEl.value = "500";
                if (heightEl) heightEl.value = "700";
            } else if (posterFmt === 'A1') {
                if (widthEl) widthEl.value = "594";
                if (heightEl) heightEl.value = "841";
            }
            if (typeof calculate === 'function') {
                calculate();
            } else {
                calculatePrice();
            }
        }
        function applyMachineDefaults() {
            const itemsInp = document.getElementById('items-per-sheet');
            if (itemsInp) itemsInp.value = "";
            const mType = document.getElementById('calc-machine-type').value;
            const profile = machineProfiles[mType];
            const isCoop = (mType === 'cooperation');
            const isPlakat = (mType === 'digital-plakat');
            const isRollup = (mType === 'digital-rollup');
            const machineInputs = document.getElementById('machine-inputs-group');
            const coopInputs = document.getElementById('cooperation-inputs-group');
            const plakatInputs = document.getElementById('digital-plakat-inputs-group');
            const rollupInputs = document.getElementById('digital-rollup-inputs-group');
            if (machineInputs) machineInputs.style.display = (isCoop || isPlakat || isRollup) ? 'none' : 'block';
            if (coopInputs) coopInputs.style.display = isCoop ? 'flex' : 'none';
            if (plakatInputs) plakatInputs.style.display = isPlakat ? 'flex' : 'none';
            if (rollupInputs) rollupInputs.style.display = isRollup ? 'flex' : 'none';
            if (isPlakat) {
                onPosterFormatChange();
                return;
            }
            if (isRollup) {
                const projNameEl = document.getElementById('calc-project-name');
                if (projNameEl && (!projNameEl.value || projNameEl.value === 'Tiskovina')) {
                    projNameEl.value = 'Digitalni ROLL UP';
                }
                const widthEl = document.getElementById('width');
                const heightEl = document.getElementById('height');
                if (widthEl && (!widthEl.value || widthEl.value === "0" || widthEl.value === "700" || widthEl.value === "500" || widthEl.value === "594")) {
                    widthEl.value = "850";
                }
                if (heightEl && (!heightEl.value || heightEl.value === "0" || heightEl.value === "1000" || heightEl.value === "700" || heightEl.value === "841")) {
                    heightEl.value = "2000";
                }
                const mFormatSelect = document.getElementById('machine-format');
                if (mFormatSelect) {
                    mFormatSelect.value = 'Roll Up (850x2000)';
                }
                const pTypeEl = document.getElementById('calc-paper-type');
                if (pTypeEl && (!pTypeEl.value || pTypeEl.value === 'Premazni' || pTypeEl.value === 'Brezlesni')) {
                    pTypeEl.value = 'Roll Up platno / film';
                }
                const pWeightEl = document.getElementById('calc-paper-weight');
                if (pWeightEl && (!pWeightEl.value || pWeightEl.value === '0' || pWeightEl.value === '135' || pWeightEl.value === '150')) {
                    pWeightEl.value = '220';
                }
                const platesInp = document.getElementById('calc-plates-num');
                if (platesInp) platesInp.value = "0";
                const platesPriceInp = document.getElementById('calc-plates-price');
                if (platesPriceInp) platesPriceInp.value = "0";
                const prepInp = document.getElementById('calc-prep-price');
                if (prepInp) prepInp.value = "0";
                const changeInp = document.getElementById('calc-change-price');
                if (changeInp) changeInp.value = "0";
                const mutInp = document.getElementById('calc-mut-plates');
                if (mutInp) mutInp.value = "0";
                const precutPrepInp = document.getElementById('f-precut-prep');
                if (precutPrepInp) precutPrepInp.value = "0";
                const bleedEl = document.getElementById('bleed');
                if (bleedEl) bleedEl.value = "0";
                const gripEl = document.getElementById('gripper');
                if (gripEl) gripEl.value = "0";
                const marginEl = document.getElementById('calc-margin');
                if (marginEl) marginEl.value = "0";
                const colF = document.getElementById('calc-color-front');
                if (colF) colF.value = "4";
                const colB = document.getElementById('calc-color-back');
                if (colB) colB.value = "0";
                const obratEl = document.getElementById('calc-is-obrat');
                if (obratEl) obratEl.checked = false;
                filterAvailableFormats();
                if (typeof calculate === 'function') {
                    calculate();
                } else {
                    calculatePrice();
                }
                return;
            }
            if (profile) {
                document.getElementById('calc-machine-rate').value = profile.rate;
                const prepTimeInp = document.getElementById('calc-machine-prep-time');
                if (prepTimeInp) {
                    prepTimeInp.value = "";
                    prepTimeInp.placeholder = "Avto";
                }
                const mFormatSelect = document.getElementById('machine-format');
                if (mFormatSelect) {
                    if (isCoop) mFormatSelect.value = 'B1';
                    else if (isPlakat) {
                        const posterFmt = document.getElementById('calc-poster-format') ? document.getElementById('calc-poster-format').value : 'B1';
                        mFormatSelect.value = posterFmt;
                    } else {
                        mFormatSelect.value = 'auto';
                    }
                }
                if (mType === 'digital') {
                    const platesInp = document.getElementById('calc-plates-num');
                    if (platesInp) platesInp.value = "0";
                    const platesPriceInp = document.getElementById('calc-plates-price');
                    if (platesPriceInp) platesPriceInp.value = "0";
                    const prepInp = document.getElementById('calc-prep-price');
                    if (prepInp) prepInp.value = "30";
                    const changeInp = document.getElementById('calc-change-price');
                    if (changeInp) changeInp.value = "0";
                    const mutInp = document.getElementById('calc-mut-plates');
                    if (mutInp) mutInp.value = "0";
                    const precutPrepInp = document.getElementById('f-precut-prep');
                    if (precutPrepInp) precutPrepInp.value = "10";
                } else if (mType === 'digital-plakat') {
                    const platesInp = document.getElementById('calc-plates-num');
                    if (platesInp) platesInp.value = "0";
                    const platesPriceInp = document.getElementById('calc-plates-price');
                    if (platesPriceInp) platesPriceInp.value = "0";
                    const prepInp = document.getElementById('calc-prep-price');
                    if (prepInp) prepInp.value = "0";
                    const changeInp = document.getElementById('calc-change-price');
                    if (changeInp) changeInp.value = "0";
                    const mutInp = document.getElementById('calc-mut-plates');
                    if (mutInp) mutInp.value = "0";
                    const precutPrepInp = document.getElementById('f-precut-prep');
                    if (precutPrepInp) precutPrepInp.value = "10";
                } else if (mType === 'CD UV') {
                    const prepInp = document.getElementById('calc-prep-price');
                    if (prepInp) prepInp.value = "70";
                    const platesPriceInp = document.getElementById('calc-plates-price');
                    if (platesPriceInp) platesPriceInp.value = "14";
                    const changeInp = document.getElementById('calc-change-price');
                    if (changeInp) changeInp.value = "70";
                    const platesInp = document.getElementById('calc-plates-num');
                    if (platesInp) platesInp.value = "4";
                    const mutInp = document.getElementById('calc-mut-plates');
                    if (mutInp) mutInp.value = "0";
                    const precutPrepInp = document.getElementById('f-precut-prep');
                    if (precutPrepInp) precutPrepInp.value = "15";
                } else {
                    const platesPriceInp = document.getElementById('calc-plates-price');
                    if (platesPriceInp) platesPriceInp.value = "10";
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
            const rawFamily = getPaperFamily(sw, sh);
            const isPers = document.getElementById('f-personalization-active') ? document.getElementById('f-personalization-active').checked : false;
            for (let i = 0; i < options.length; i++) {
                const val = options[i].value;
                if (val === 'auto') continue;
                const sheet = sheets.find(s => s.name === val);
                if (sheet) {
                    let fitsSource = (mType === 'digital-rollup' || mType === 'digital-plakat') ? true : ((sw >= sheet.w && sh >= sheet.h) || (sw >= sheet.h && sh >= sheet.w));
                    let fitsMachine = true;
                    if (profile && profile.maxW) {
                        fitsMachine = (sheet.w <= profile.maxW && sheet.h <= profile.maxH) || (sheet.h <= profile.maxW && sheet.w <= profile.maxH);
                    }
                    let familyMatches = isSheetFamilyMatching(rawFamily, sheet.family, mType, sheet.name);
                    let persMatches = !isPers || isSheetCompatibleWithPers(sheet);
                    const fits = fitsSource && fitsMachine && familyMatches && persMatches;
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
            const isSV = document.getElementById('calc-is-sv') ? document.getElementById('calc-is-sv').checked : false;
            const isTwoSided = isObrat || isSV;
            const isPers = document.getElementById('f-personalization-active') ? document.getElementById('f-personalization-active').checked : false;
            const splitSelect = document.getElementById('f-personalization-split');
            const userSplit = splitSelect ? splitSelect.value : 'auto';

            let isB2Sheet = (sheetW >= 650 && sheetW <= 720 && sheetH >= 450 && sheetH <= 520) || (sheetH >= 650 && sheetH <= 720 && sheetW >= 450 && sheetW <= 520);
            let maxSheetDim = Math.max(sheetW, sheetH);
            let mType = document.getElementById('calc-machine-type') ? document.getElementById('calc-machine-type').value : '';
            let isLargeSheet = (isPers && (isB2Sheet || maxSheetDim >= 500 || mType === 'S8'));

            let best = null;
            const baseConfigs = [
                { iw: itemW, ih: itemH, rot: false, edge: 'H' },
                { iw: itemH, ih: itemW, rot: true, edge: 'H' }
            ];
            baseConfigs.forEach(cfg => {
                let usableW = cfg.edge === 'W' ? sheetW - gripper : sheetW;
                let usableH = cfg.edge === 'H' ? sheetH - gripper : sheetH;
                if (mType === 'digital') {
                    if (sheetW >= sheetH) {
                        usableW = Math.min(usableW, 468);
                        usableH = Math.min(usableH, 308);
                    } else {
                        usableW = Math.min(usableW, 308);
                        usableH = Math.min(usableH, 468);
                    }
                }
                if (usableW <= 0 || usableH <= 0) return;
                let colsRaw = Math.floor(usableW / cfg.iw);
                let rowsRaw = Math.floor(usableH / cfg.ih);
                if (colsRaw <= 0 || rowsRaw <= 0) return;

                function evalCut(factor) {
                    let c = colsRaw;
                    let r = rowsRaw;
                    let cutAxis = sheetW >= sheetH ? 'W' : 'H';
                    if (factor === 2) {
                        if (isB2Sheet) {
                            let halfW = cutAxis === 'W' ? 318 : 478;
                            let halfH = cutAxis === 'W' ? 478 : 318;
                            let halfCols = Math.floor(halfW / cfg.iw);
                            let halfRows = Math.floor(halfH / cfg.ih);
                            c = cutAxis === 'W' ? halfCols * 2 : halfCols;
                            r = cutAxis === 'H' ? halfRows * 2 : halfRows;
                        } else {
                            let optionW = Math.floor(colsRaw / 2) * 2;
                            let countW = optionW * rowsRaw;
                            let optionH = Math.floor(rowsRaw / 2) * 2;
                            let countH = colsRaw * optionH;
                            if (countW >= countH) { c = optionW; r = rowsRaw; }
                            else { c = colsRaw; r = optionH; }
                        }
                    } else if (factor === 3) {
                        let optionW = Math.floor(colsRaw / 3) * 3;
                        let countW = optionW * rowsRaw;
                        let optionH = Math.floor(rowsRaw / 3) * 3;
                        let countH = colsRaw * optionH;
                        if (countW >= countH) { c = optionW; r = rowsRaw; }
                        else { c = colsRaw; r = optionH; }
                    } else if (factor === 4) {
                        if (isB2Sheet) {
                            let quarterW = 318;
                            let quarterH = 238;
                            let halfCols = Math.floor(quarterW / cfg.iw);
                            let halfRows = Math.floor(quarterH / cfg.ih);
                            c = halfCols * 2;
                            r = halfRows * 2;
                        } else {
                            let optionW = Math.floor(colsRaw / 2) * 2;
                            let optionH = Math.floor(rowsRaw / 2) * 2;
                            c = optionW;
                            r = optionH;
                        }
                    }
                    return { cols: c, rows: r, count: c * r, factor: factor };
                }

                let chosen = { cols: colsRaw, rows: rowsRaw, count: colsRaw * rowsRaw, factor: 1 };
                if (isLargeSheet) {
                    if (userSplit === '1') {
                        chosen = evalCut(1);
                    } else if (userSplit === '2') {
                        chosen = evalCut(2);
                    } else if (userSplit === '3') {
                        chosen = evalCut(3);
                    } else if (userSplit === '4') {
                        chosen = evalCut(4);
                    } else { // 'auto'
                        let eval4 = evalCut(4);
                        let eval3 = evalCut(3);
                        let eval2 = evalCut(2);
                        if (eval4.count > eval3.count && eval4.count > eval2.count && eval4.count > 0) {
                            chosen = eval4;
                        } else if (eval3.count > eval2.count && eval3.count > 0) {
                            chosen = eval3;
                        } else {
                            chosen = eval2;
                        }
                    }
                }

                let cols = chosen.cols;
                let rows = chosen.rows;

                let isPlacedLandscape = cfg.iw >= cfg.ih;
                if (forceMode === 'landscape' && !isPlacedLandscape) return;
                if (forceMode === 'portrait' && isPlacedLandscape && cfg.iw !== cfg.ih) return;
                let count = cols * rows;
                let finalCount = count;
                let isMixed = false;
                if (forceMode === 'auto' && !isObrat && count > 0) {
                    // Odstranjena avtomatska "mešana" postavitev (isMixed), da se ohrani simetrija in enotna smer vlaken.
                }
                if (isTwoSided) {
                    let maxColsEven = Math.floor(cols / 2) * 2;
                    let maxRowsEven = Math.floor(rows / 2) * 2;
                    let countW = maxColsEven * rows;
                    let countH = cols * maxRowsEven;
                    if (countW >= countH && countW > 0) {
                        cols = maxColsEven;
                        finalCount = countW;
                    } else if (countH > 0) {
                        rows = maxRowsEven;
                        finalCount = countH;
                    } else {
                        finalCount = 0;
                    }
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
                        isMixed: isMixed,
                        digCutFactor: chosen.factor
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
            if (qtyBox) {
                qtyBox.style.animation = 'none';
            }
            const colorFrontEl = document.getElementById('calc-color-front');
            const colorBackEl = document.getElementById('calc-color-back');
            if (colorFrontEl) colorFrontEl.style.animation = 'none';
            if (colorBackEl) colorBackEl.style.animation = 'none';
        }
        function getUVSheetFactor(w, h, selectedUVFormat) {
            if (!selectedUVFormat || selectedUVFormat === 'auto') return 1;
            const maxDim = Math.max(w || 0, h || 0);
            const minDim = Math.min(w || 0, h || 0);
            if (maxDim > 750 || (maxDim > 700 && minDim > 520)) {
                if (selectedUVFormat === '50x35') return 4;
                if (selectedUVFormat === '70x33') return 2;
                if (selectedUVFormat === '70x50') return 2;
                return 1;
            }
            let autoFormat = '70x50';
            if (maxDim <= 500 && minDim <= 350) {
                autoFormat = '50x35';
            } else if (maxDim <= 700 && minDim <= 330) {
                autoFormat = '70x33';
            } else {
                autoFormat = '70x50';
            }
            if (selectedUVFormat === autoFormat) return 1;
            if (autoFormat === '70x50' && selectedUVFormat === '50x35') {
                return 2;
            }
            if (autoFormat === '70x50' && selectedUVFormat === '70x33') {
                return -1;
            }
            return 1;
        }

        function updateUVFormatWarning(w, h, selectedUVFormat, suffix = '') {
            let warningEl = document.getElementById('f-uv' + suffix + '-format-warning');
            const formatSelect = document.getElementById('f-uv' + suffix + '-format');
            const isUvActive = document.getElementById('f-uv' + suffix + '-active') ? document.getElementById('f-uv' + suffix + '-active').checked : false;

            const factor = getUVSheetFactor(w, h, selectedUVFormat);
            const isInvalid = isUvActive && (factor === -1);

            if (!warningEl) {
                const uvContainer = document.getElementById('row-finish-uv' + suffix);
                if (uvContainer) {
                    warningEl = document.createElement('div');
                    warningEl.id = 'f-uv' + suffix + '-format-warning';
                    warningEl.style.cssText = 'display:none; margin-top:10px; width:100%; grid-column:1/-1; padding:10px 14px; background:#fee2e2; border:2px solid #ef4444; border-radius:6px; color:#991b1b; font-weight:bold; font-size:0.85rem; text-align:center; box-shadow:0 2px 4px rgba(239,68,68,0.2);';
                    uvContainer.appendChild(warningEl);
                }
            }

            if (formatSelect) {
                if (isInvalid) {
                    formatSelect.style.border = '2px solid #dc2626';
                    formatSelect.style.backgroundColor = '#fef2f2';
                    formatSelect.style.color = '#991b1b';
                    formatSelect.style.fontWeight = 'bold';
                } else {
                    formatSelect.style.border = '';
                    formatSelect.style.backgroundColor = '';
                    formatSelect.style.color = '';
                    formatSelect.style.fontWeight = '';
                }
            }

            if (warningEl) {
                if (isInvalid) {
                    warningEl.style.display = 'block';
                    warningEl.innerHTML = '⚠️ <strong>POLA NI ZA LAKIRATI:</strong> Tiskovna pola (B2 / 70x50) ne gre lakirati na format 70x33!';
                } else {
                    warningEl.style.display = 'none';
                }
            }
        }

        function updateUVLakPrice(suffix = '') {
            const typeSelect = document.getElementById('f-uv' + suffix + '-type');
            if (!typeSelect) return;
            const type = typeSelect.value;
            const formatSelect = document.getElementById('f-uv' + suffix + '-format') ? document.getElementById('f-uv' + suffix + '-format').value : 'auto';
            const w = g_lastSheetW || 700;
            const h = g_lastSheetH || 500;
            updateUVFormatWarning(w, h, formatSelect, suffix);
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
                'rubl': { '50x35': 0.480, '70x33': 0.590, '70x50': 0.640 },
                'blescice': { '50x35': 0.340, '70x33': 0.435, '70x50': 0.479 },
                'rubl_sij': { '50x35': 0.413, '70x33': 0.558, '70x50': 0.629 },
                'rubl_mat': { '50x35': 0.454, '70x33': 0.603, '70x50': 0.677 },
                'pokritna_bela': { '50x35': 0.441, '70x33': 0.558, '70x50': 0.558 }
            };
            const pricePerSheet = uvLakTable[type] ? uvLakTable[type][format] : 0.025;
            const pricePer1000 = pricePerSheet * 1000;
            const per1000Input = document.getElementById('f-uv' + suffix + '-per1000');
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
                let w = parseFloat(document.getElementById('width').value) || 0;
                let h = parseFloat(document.getElementById('height').value) || 0;
                const mType = document.getElementById('calc-machine-type').value;
                const b = (mType === 'digital-plakat' || mType === 'digital-rollup') ? 0 : (parseFloat(document.getElementById('bleed').value) || 0);
                const g = (mType === 'digital-plakat' || mType === 'digital-rollup') ? 0 : (parseFloat(document.getElementById('gripper').value) || 0);
                const qStr = document.getElementById('quantity').value || "0";
                const qArr = qStr.split(',').map(x => parseFloat(x.trim().replace(/\./g, ''))).filter(x => !isNaN(x) && x > 0);
                const q = qArr[0] || 0;
                const fMode = document.getElementById('item-orientation').value;
                const mFormat = document.getElementById('machine-format').value;
                const sw = parseFloat(document.getElementById('calc-source-w').value) || 1000;
                const sh = parseFloat(document.getElementById('calc-source-h').value) || 700;
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
                if (mType === 'digital-plakat') {
                    const posterFmt = document.getElementById('calc-poster-format') ? document.getElementById('calc-poster-format').value : 'B1';
                    bestSheet = sheets.find(s => s.name === posterFmt) || sheets.find(s => s.name === 'B1') || sheets[0];
                    bestLayout = {
                        count: 1,
                        cols: 1,
                        rows: 1,
                        rot: false,
                        gripEdge: 'H',
                        itemW: w,
                        itemH: h,
                        items: [{ id: 1, x: 0, y: 0, w: w, h: h, bleed: 0, rot: false }]
                    };
                } else if (mType === 'digital-rollup') {
                    bestSheet = sheets.find(s => s.name === 'Roll Up (850x2000)') || { name: "Roll Up (850x2000)", w: w || 850, h: h || 2000, family: "DIGITAL" };
                    bestLayout = {
                        count: 1,
                        cols: 1,
                        rows: 1,
                        rot: false,
                        gripEdge: 'H',
                        itemW: w,
                        itemH: h,
                        items: [{ id: 1, x: 0, y: 0, w: w, h: h, bleed: 0, rot: false }]
                    };
                } else if (g_manualLayout) {
                    bestSheet = sheets.find(s => s.w === g_manualLayout.sheetW && s.h === g_manualLayout.sheetH) || sheets.find(s => s.name === mFormat) || sheets[0];
                    bestLayout = {
                        count: g_manualLayout.items.length,
                        items: g_manualLayout.items,
                        cols: 1, rows: g_manualLayout.items.length, rot: false, isMixed: true, gripEdge: 'H', itemW: 0, itemH: 0
                    };
                } else {
                    const rawFamily = getPaperFamily(sw, sh);
                    const isPers = document.getElementById('f-personalization-active') ? document.getElementById('f-personalization-active').checked : false;
                    const checkSheet = (s) => {
                        let fitsSource = (sw >= s.w && sh >= s.h) || (sw >= s.h && sh >= s.w);
                        let fitsMachine = true;
                        if (profile && profile.maxW) {
                            fitsMachine = (s.w <= profile.maxW && s.h <= profile.maxH) || (s.h <= profile.maxW && s.w <= profile.maxH);
                        }
                        let familyMatches = isSheetFamilyMatching(rawFamily, s.family, mType, s.name);
                        let persMatches = !isPers || isSheetCompatibleWithPers(s);
                        if (!fitsSource || !fitsMachine || !familyMatches || !persMatches) return;
                        let currLayout = optimizeLayout(s.w, s.h, itemW, itemH, g, fMode);
                        if (!currLayout) return;
                        const y1 = Math.floor(sw / s.w) * Math.floor(sh / s.h);
                        const y2 = Math.floor(sw / s.h) * Math.floor(sh / s.w);
                        const sYield = Math.max(y1, y2, 1);
                        let score;
                        let isSatisfied = (targetCount > 0 && currLayout.count >= targetCount);
                        const isStandard = s.family === 'B' || s.family === 'A' || s.family === 'N' || s.family === 'DIGITAL';
                        const standardBonus = isStandard ? 10000000 : 0;
                        const standardBonusNormal = isStandard ? 500 : 0;
                        const persBonus = (isPers && mType === 'digital' && s.family === 'DIGITAL') ? 5000 : 0;

                        if (targetCount > 0) {
                            if (isSatisfied) {
                                const sheetArea = s.w * s.h;
                                score = (sYield * 1000000000) + (1000000000000 / sheetArea) + currLayout.count + standardBonus + persBonus;
                            } else {
                                score = currLayout.count + (isStandard ? 0.1 : 0) + persBonus;
                            }
                        } else {
                            const sheetArea = s.w * s.h;
                            score = (currLayout.count * 1000000) + (sYield * 1000) + (sheetArea / 1000.0) + standardBonusNormal + persBonus;
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
                        const isObrat = (document.getElementById('calc-is-obrat')?.checked || document.getElementById('calc-is-sv')?.checked) || false;
                        if (isObrat) {
                            alert("Izdelek ne gre na polo! (Nasvet: Imate vklopljeno 'Obračanje / OB' ali 'Šen Vider (ŠV)', ki zahteva vsaj 2 kosa na poli. Izklopite obračanje/ŠV ali zmanjšajte format.)");
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
                let currentCount = parseInt(itemsInp.value) || bestLayout.count;

                const obratCheckbox = document.getElementById('calc-is-obrat');
                const svCheckbox = document.getElementById('calc-is-sv');
                const isTwoSidedActive = (obratCheckbox && obratCheckbox.checked) || (svCheckbox && svCheckbox.checked);
                if (isTwoSidedActive && currentCount % 2 !== 0) {
                    if (currentCount > 1) {
                        let maxEven = currentCount - 1;
                        if (bestLayout && !bestLayout.isMixed) {
                            let bestPerfect = 2;
                            for (let c = bestLayout.cols; c >= 1; c--) {
                                for (let r = bestLayout.rows; r >= 1; r--) {
                                    let total = c * r;
                                    if (total % 2 === 0 && total <= currentCount - 1 && total > bestPerfect) {
                                        bestPerfect = total;
                                    }
                                }
                            }
                            if (bestPerfect > 0) maxEven = bestPerfect;
                        }
                        currentCount = maxEven;
                        itemsInp.value = currentCount;
                        // alert odstranjen glede na navodila uporabnika
                    } else {
                        alert("Opozorilo: Izbrano je '" + (obratCheckbox && obratCheckbox.checked ? "Obračanje / OB" : "Šen Vider (ŠV)") + "', vendar je na poli samo 1 stavek. Za obojestranski tisk sta potrebna vsaj 2 stavka na poli.");
                        if (obratCheckbox) obratCheckbox.checked = false;
                        if (svCheckbox) svCheckbox.checked = false;
                    }
                }

                document.getElementById('res-count').innerText = currentCount;
                document.getElementById('res-count-mini').innerText = currentCount;

                let usage = (currentCount * itemW * itemH) / (bestSheet.w * bestSheet.h);
                document.getElementById('res-usage').innerText = (usage * 100).toFixed(1) + "%";
                document.getElementById('res-usage-mini').innerText = (usage * 100).toFixed(1) + "%";

                let drawSheetW = bestSheet.w;
                let drawSheetH = bestSheet.h;
                const isPersActive = document.getElementById('f-personalization-active') ? document.getElementById('f-personalization-active').checked : false;
                if (isPersActive && mType === 'S4') {
                    drawSheetW = bestSheet.w >= bestSheet.h ? 478 : 318;
                    drawSheetH = bestSheet.w >= bestSheet.h ? 318 : 478;
                }

                document.getElementById('res-size').innerText = drawSheetW + " x " + drawSheetH;
                const isOverride = currentCount !== bestLayout.count;
                drawAllLayouts(drawSheetW, drawSheetH, bestLayout, g, w, h, b, sw, sh, isOverride, currentCount);
                updateWasteAndPrice(Math.ceil(q / currentCount), q, drawSheetW, drawSheetH);
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
            } else if (mType === "Mutacija v 1 barvi po prvi strani (1/0)") {
                mutCol = '1/0';
            } else if (mType === "Mutacija v 1 barvi po drugi strani (0/1)") {
                mutCol = '0/1';
            } else if (mType === "Mutacija v 1 barvi obojestransko (1/1)") {
                mutCol = '1/1';
            }
            return `${baseCol} + ${numM}x mutacija ${mutCol}`;
        }
        function updateMutationPlates() {
            const mutType = document.getElementById('calc-mut-type').value;
            const front = parseInt(document.getElementById('calc-color-front').value) || 0;
            const back = parseInt(document.getElementById('calc-color-back').value) || 0;
            const isObrat = document.getElementById('calc-is-obrat') ? document.getElementById('calc-is-obrat').checked : false;
            const isSV = document.getElementById('calc-is-sv') ? document.getElementById('calc-is-sv').checked : false;
            const isObOrSV = isObrat; // Pri ŠV sta sprednja in zadnja stran na ločenih ploščah (8 plošč za 4/4)

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
                    plates = isObOrSV ? front : (front + back);
                } else if (mutType === "Mutacija v 1 barvi po prvi strani (1/0)") {
                    plates = 1;
                } else if (mutType === "Mutacija v 1 barvi po drugi strani (0/1)") {
                    plates = 1;
                } else if (mutType === "Mutacija v 1 barvi obojestransko (1/1)") {
                    // Pri Obračanju (Ob) ali ŠV tisku sta sprednja in zadnja stran na ISTI plošči,
                    // zato 1-barvna obojestranska mutacija (1/1) pomeni le 1 dodatno ploščo na mutacijo.
                    // Pri ravnem tisku (kjer sta sprednja in zadnja stran na dveh ločenih ploščah) pa pomeni 2 plošči na mutacijo.
                    plates = isObOrSV ? 1 : 2;
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
            const isSV = document.getElementById('calc-is-sv') ? document.getElementById('calc-is-sv').checked : false;
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
                let res = calculateForSingleQty(qty, currentNeeded, dw, dh, orderedQty, idx);
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
                                <div style="font-weight: bold; color: #34d399;">${formatPrice(ib.perItem, 4)}/kos</div>
                                <div style="font-size: 0.8rem; color: #fbbf24;">${formatPrice(ib.per1000, 2)}/1.000 kos</div>
                            </div>
                        </div>
                    `).join('');
            } else {
                manualPriceList.style.display = 'none';
            }
            document.getElementById('res-count').innerText = r.itemsPerSheet;
            document.getElementById('res-count-mini').innerText = r.itemsPerSheet;
            if (totalItemsFormArr.length > 1) {
                document.getElementById('res-sheets-needed').innerText = results.map(x => x.sheetsNeeded).join(', ');
                if (document.getElementById('res-source-sheets-needed')) {
                    document.getElementById('res-source-sheets-needed').innerText = results.map(x => x.details.paper.rawSourceSheetsNeeded).join(', ');
                }
                const ordEl = document.getElementById('calc-ordered-sheets');
                if (ordEl) {
                    ordEl.placeholder = results.map(x => x.details.paper.sourceSheets).join(', ');
                }
            } else {
                document.getElementById('res-sheets-needed').innerText = r.sheetsNeeded;
                if (document.getElementById('res-source-sheets-needed')) {
                    document.getElementById('res-source-sheets-needed').innerText = r.details.paper.rawSourceSheetsNeeded;
                }
                const ordEl = document.getElementById('calc-ordered-sheets');
                if (ordEl) {
                    ordEl.placeholder = r.details.paper.sourceSheets;
                }
            }
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
            document.getElementById('res-price-per-item-stat-quick').innerText = formatPrice(r.perItemFinal, 4);
            document.getElementById('res-price-per-item-stat-final').innerText = formatPrice(r.perItemFinal, 4);
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
                if (stickyPerItem) stickyPerItem.innerHTML = results.map(x => `<div style="${fs}">${formatPrice(x.perItemFinal, 4)}</div>`).join('');
                if (sticky1000) sticky1000.innerHTML = results.map(x => `<div style="${fs}">${formatPrice(x.perItemFinal * 1000)}</div>`).join('');
            } else {
                const oqVal = oqArr[0] || r.qty;
                if (stickyQty) stickyQty.innerText = formatQty(oqVal);
                if (stickyTotal) stickyTotal.innerText = formatPrice(r.totalPrice);
                if (stickyPerItem) stickyPerItem.innerText = formatPrice(r.perItemFinal, 4);
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
            const safeFixed = (val, dec = 1) => {
                const n = parseFloat(val);
                return isNaN(n) ? "0" : n.toFixed(dec);
            };
            let html = `
                <!-- PAPER -->
                <div style="padding: 10px; background: rgba(59, 130, 246, 0.05); border-radius: 8px;">
                    <div style="font-weight: bold; color: #60a5fa; margin-bottom: 5px;">1. Material (Papir)</div>
                    <div style="display: grid; grid-template-columns: 1fr auto; gap: 5px; color: #cbd5e1;">
                        <span>Tiskovne pole (Papir 1):</span> <span style="font-weight: bold;">${formatQty(d.paper.totalSheets)} pol</span>
                        <span style="color: #93c5fd;">Nerazrezane pole (${d.paper.sourceW} x ${d.paper.sourceH} mm, ${d.paper.sourceYield}x razrez):</span>
                        <span style="font-weight: bold; color: #93c5fd;">${formatQty(d.paper.sourceSheets)} pol</span>
                        ${d.paper.kg > 0 ? `<span>Teža 1. papirja (bruto):</span> <span>${d.paper.kg.toFixed(1)} kg</span>` : ''}
                        ${d.paper2 && d.paper2.enabled ? `
                        <div style="grid-column: 1/-1; height: 1px; background: rgba(59,130,246,0.2); margin: 5px 0;"></div>
                        <div style="grid-column: 1/-1; font-weight: bold; color: #38bdf8;">+ 2. Papir (Kaširanje / Spodnji sloj): ${d.paper2.type || 'Papir 2'} (${d.paper2.weight} g/m²)</div>
                        <span>Tiskovne pole (Papir 2):</span> <span style="font-weight: bold;">${formatQty(d.paper2.totalSheets)} pol</span>
                        <span>Nerazrezane pole (Papir 2):</span> <span style="font-weight: bold;">${formatQty(d.paper2.sourceSheets)} pol</span>
                        <span>Strošek 2. materiala:</span> <span>${formatPrice(d.paper2.cost)}</span>
                        ` : ''}
                        <div style="grid-column: 1/-1; height: 1px; background: rgba(255,255,255,0.1); margin: 3px 0;"></div>
                        <span>Strošek materiala skupaj:</span> <span style="font-weight: bold;">${formatPrice(d.paper.cost)}</span>
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
                    ? `<span>Cena tiska (${d.paper.totalSheets} pol${d.print.perSheetCost ? ` po ${d.print.perSheetCost.toFixed(2).replace('.', ',')} €` : ''}):</span> <span>${formatPrice(d.print.cost)}</span>`
                    : (d.print.mType === 'digital-rollup'
                        ? `<span>Digitalni ROLL UP (${r.qty} kos po ${formatPrice(d.print.cost / (r.qty || 1))}):</span> <span>${formatPrice(d.print.cost)}</span>`
                        : (d.print.mType === 'digital-plakat'
                            ? `<span>Digitalni tisk plakatov (${r.qty} kos):</span> <span>${formatPrice(d.print.cost)}</span>`
                            : `<span>Neto čas tiska (${(d.print.hours * 60).toFixed(0)} min pri hitrosti <b>${d.print.mSpeed} pol/h</b>):</span> <span>${formatPrice(d.print.hours * d.print.mRate)}</span>`
                          )
                      )
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
                <!-- TEZA -->
                ${(d.weight && d.weight.singleKg > 0) || (d.productWeight && d.productWeight.oneProductGrams > 0) ? `
                <div style="padding: 10px; background: rgba(245, 158, 11, 0.05); border-radius: 8px; margin-top: 5px;">
                    <div style="font-weight: bold; color: #f59e0b; margin-bottom: 5px;">Informativna teža</div>
                    <div style="display: grid; grid-template-columns: 1fr auto; gap: 5px; color: #cbd5e1; font-size: 0.85rem;">
                        <span>Teža 1 kosa:</span> <span>${safeFixed((d.weight ? d.weight.singleKg : d.productWeight.oneProductGrams / 1000) * 1000, 1)} g (${safeFixed(d.weight ? d.weight.singleKg : d.productWeight.oneProductGrams / 1000, 3)} kg)</span>
                        <span>Skupna teža (${d.weight ? d.weight.q : d.productWeight.effectiveQty || '?'} kos):</span> <span style="font-weight: bold; color: #fcd34d;">${safeFixed(d.weight ? d.weight.totalKg : d.productWeight.totalOrderKg, 2)} kg</span>
                    </div>
                </div>
                ` : ''}
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
                        { q: 1000, waste: 640, s150: 3800, s250: 3800, s350: 3300 },
                        { q: 5000, waste: 640, s150: 6600, s250: 6600, s350: 5400 },
                        { q: 10000, waste: 640, s150: 6900, s250: 6900, s350: 5700 },
                        { q: 50000, waste: 640, s150: 7140, s250: 7140, s350: 6050 },
                        { q: 100000, waste: 1000, s150: 7140, s250: 7140, s350: 6050 },
                        { q: 300000, waste: 1000, s150: 7140, s250: 7140, s350: 6050 },
                        { q: 500000, waste: 2000, s150: 7140, s250: 7140, s350: 6050 }
                    ],
                    "4/1": [
                        { q: 1000, waste: 480, s150: 3500, s250: 3500, s350: 3150 },
                        { q: 5000, waste: 480, s150: 6600, s250: 6600, s350: 5480 },
                        { q: 10000, waste: 480, s150: 6900, s250: 6900, s350: 5700 },
                        { q: 50000, waste: 480, s150: 7400, s250: 7400, s350: 6000 },
                        { q: 100000, waste: 480, s150: 7400, s250: 7400, s350: 6000 },
                        { q: 300000, waste: 1000, s150: 7400, s250: 7400, s350: 6000 },
                        { q: 500000, waste: 1500, s150: 7400, s250: 7400, s350: 6000 }
                    ],
                    "4/OB": [
                        { q: 1000, waste: 380, s150: 4600, s250: 4600, s350: 3900 },
                        { q: 5000, waste: 380, s150: 6600, s250: 6600, s350: 5400 },
                        { q: 10000, waste: 380, s150: 6900, s250: 6900, s350: 5700 },
                        { q: 50000, waste: 540, s150: 7140, s250: 7140, s350: 6000 },
                        { q: 100000, waste: 540, s150: 7140, s250: 7140, s350: 6000 },
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
            } else if (mType === 'CD UV') {
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
                        { q: 1000, waste: 320, s150: 4000, s250: 4000, s350: 3100 },
                        { q: 5000, waste: 320, s150: 5960, s250: 5960, s350: 4600 },
                        { q: 10000, waste: 320, s150: 6400, s250: 6300, s350: 4800 },
                        { q: 50000, waste: 320, s150: 6600, s250: 6600, s350: 5100 },
                        { q: 100000, waste: 1000, s150: 6600, s250: 6600, s350: 5100 },
                        { q: 300000, waste: 3000, s150: 6600, s250: 6600, s350: 5100 },
                        { q: 500000, waste: 5000, s150: 6600, s250: 6600, s350: 5100 }
                    ],
                    "4/4": [
                        { q: 1000, waste: 640, s150: 4800, s250: 4800, s350: 4100 },
                        { q: 5000, waste: 640, s150: 6300, s250: 6300, s350: 5200 },
                        { q: 10000, waste: 640, s150: 6300, s250: 6300, s350: 4800 },
                        { q: 50000, waste: 640, s150: 6600, s250: 6600, s350: 5100 },
                        { q: 100000, waste: 1000, s150: 6600, s250: 6600, s350: 5500 },
                        { q: 300000, waste: 3000, s150: 6600, s250: 6600, s350: 5500 },
                        { q: 500000, waste: 5000, s150: 6600, s250: 6600, s350: 5500 }
                    ],
                    "4/1": [
                        { q: 1000, waste: 480, s150: 2900, s250: 2900, s350: 2700 },
                        { q: 5000, waste: 480, s150: 5600, s250: 5200, s350: 4800 },
                        { q: 10000, waste: 480, s150: 6400, s250: 6000, s350: 5450 },
                        { q: 50000, waste: 480, s150: 6800, s250: 6300, s350: 5700 },
                        { q: 100000, waste: 480, s150: 7140, s250: 6600, s350: 6060 },
                        { q: 300000, waste: 1000, s150: 7140, s250: 6600, s350: 6060 },
                        { q: 500000, waste: 1800, s150: 7140, s250: 6600, s350: 6060 }
                    ],
                    "4/OB": [
                        { q: 1000, waste: 640, s150: 4800, s250: 4800, s350: 4100 },
                        { q: 5000, waste: 640, s150: 6300, s250: 6300, s350: 5200 },
                        { q: 10000, waste: 640, s150: 6300, s250: 6300, s350: 4800 },
                        { q: 50000, waste: 640, s150: 6600, s250: 6600, s350: 5100 },
                        { q: 100000, waste: 1000, s150: 6600, s250: 6600, s350: 5500 },
                        { q: 300000, waste: 3000, s150: 6600, s250: 6600, s350: 5500 },
                        { q: 500000, waste: 5000, s150: 6600, s250: 6600, s350: 5500 }
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
                        { q: 1000, waste: 640, s150: 3600, s250: 3200, s350: 3000 },
                        { q: 5000, waste: 640, s150: 5070, s250: 5600, s350: 5150 },
                        { q: 10000, waste: 640, s150: 6400, s250: 6000, s350: 5450 },
                        { q: 50000, waste: 640, s150: 6800, s250: 6300, s350: 5700 },
                        { q: 100000, waste: 640, s150: 6800, s250: 6600, s350: 6050 },
                        { q: 300000, waste: 1500, s150: 7140, s250: 6600, s350: 6050 },
                        { q: 500000, waste: 2500, s150: 7140, s250: 6600, s350: 6050 }
                    ],
                    "4/1": [
                        { q: 1000, waste: 480, s150: 2900, s250: 2900, s350: 2700 },
                        { q: 5000, waste: 480, s150: 5600, s250: 5200, s350: 4800 },
                        { q: 10000, waste: 480, s150: 6400, s250: 6000, s350: 5450 },
                        { q: 50000, waste: 480, s150: 6800, s250: 6300, s350: 5700 },
                        { q: 100000, waste: 480, s150: 7140, s250: 6600, s350: 6060 },
                        { q: 300000, waste: 1000, s150: 7140, s250: 6600, s350: 6060 },
                        { q: 500000, waste: 1800, s150: 7140, s250: 6600, s350: 6060 }
                    ],
                    "4/OB": [
                        { q: 1000, waste: 380, s150: 4000, s250: 3800, s350: 3600 },
                        { q: 5000, waste: 380, s150: 5500, s250: 5100, s350: 4700 },
                        { q: 10000, waste: 380, s150: 6450, s250: 6000, s350: 5450 },
                        { q: 50000, waste: 380, s150: 6800, s250: 6300, s350: 5700 },
                        { q: 100000, waste: 450, s150: 6800, s250: 6600, s350: 6050 },
                        { q: 300000, waste: 650, s150: 7140, s250: 6600, s350: 6050 },
                        { q: 500000, waste: 750, s150: 7140, s250: 6600, s350: 6050 }
                    ],
                    "4/OB + mutacija 1x": [
                        { q: 1000, waste: 780, s150: 4000, s250: 3800, s350: 3600 },
                        { q: 5000, waste: 780, s150: 5500, s250: 5100, s350: 4700 },
                        { q: 10000, waste: 780, s150: 6450, s250: 6000, s350: 5450 },
                        { q: 50000, waste: 780, s150: 6800, s250: 6300, s350: 5700 },
                        { q: 100000, waste: 780, s150: 6800, s250: 6600, s350: 6050 },
                        { q: 300000, waste: 850, s150: 7140, s250: 6600, s350: 6050 },
                        { q: 500000, waste: 1150, s150: 7140, s250: 6600, s350: 6050 }
                    ],
                    "4/OB + mutacija 2x": [
                        { q: 1000, waste: 1180, s150: 4100, s250: 3800, s350: 3600 },
                        { q: 5000, waste: 1180, s150: 4800, s250: 5100, s350: 4700 },
                        { q: 10000, waste: 1180, s150: 6200, s250: 6000, s350: 5450 },
                        { q: 50000, waste: 1180, s150: 6800, s250: 6300, s350: 5700 },
                        { q: 100000, waste: 1180, s150: 6800, s250: 6600, s350: 6050 },
                        { q: 300000, waste: 1250, s150: 7140, s250: 6600, s350: 6050 },
                        { q: 500000, waste: 1550, s150: 7140, s250: 6600, s350: 6050 }
                    ],
                    "4/OB + mutacija 3x": [
                        { q: 1000, waste: 1580, s150: 4100, s250: 3800, s350: 3600 },
                        { q: 5000, waste: 1580, s150: 4800, s250: 5100, s350: 4700 },
                        { q: 10000, waste: 1580, s150: 6200, s250: 6000, s350: 5450 },
                        { q: 50000, waste: 1580, s150: 6800, s250: 6300, s350: 5700 },
                        { q: 100000, waste: 1580, s150: 6800, s250: 6600, s350: 6050 },
                        { q: 300000, waste: 1650, s150: 7140, s250: 6600, s350: 6050 },
                        { q: 500000, waste: 2150, s150: 7140, s250: 6600, s350: 6050 }
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
        function onPaperPackToggle() {
            const enabled = document.getElementById('calc-paper-pack-enabled')?.checked;
            const packSelect = document.getElementById('calc-paper-pack-size');
            const packCustom = document.getElementById('calc-paper-pack-custom');
            if (packSelect) {
                packSelect.disabled = !enabled;
                packSelect.style.opacity = enabled ? '1' : '0.5';
            }
            if (packCustom) {
                packCustom.style.display = (enabled && packSelect && packSelect.value === 'custom') ? 'inline-block' : 'none';
            }
            const ordInput = document.getElementById('calc-ordered-sheets');
            if (ordInput) {
                if (enabled) {
                    if (ordInput.value.trim() !== '') {
                        ordInput.dataset.prevVal = ordInput.value;
                        ordInput.value = '';
                    }
                } else if (ordInput.dataset.prevVal && ordInput.value.trim() === '') {
                    ordInput.value = ordInput.dataset.prevVal;
                }
            }
            g_editedWorkOrderHTML = '';
            calculatePrice();
        }

        function onPaperPackSizeChange() {
            const packSelect = document.getElementById('calc-paper-pack-size');
            const packCustom = document.getElementById('calc-paper-pack-custom');
            if (packCustom) {
                packCustom.style.display = (packSelect && packSelect.value === 'custom') ? 'inline-block' : 'none';
            }
            g_editedWorkOrderHTML = '';
            calculatePrice();
        }

        function calculateForSingleQty(qty, sheetsNeededIn, drawW, drawH, orderedQty, qtyIndex, customOrderedSheets) {
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
            } else if (mTypeForWaste === 'digital' || mTypeForWaste === 'digital-plakat' || mTypeForWaste === 'digital-rollup') {
                paperWasteSheets = (mTypeForWaste === 'digital-rollup') ? 0 : 50;
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
                let baseColorMode = isSV ? '8/0' : (_isObrat ? '4/OB' : (((_front === 4 && _back === 1) || (_front === 1 && _back === 4)) ? '4/1' : (_back > 0 ? '4/4' : '4/0')));
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

            let sourceYield = parseFloat(document.getElementById('calc-source-yield').value) || 1;
            let rawTotalSheetsNeeded = sheetsNeeded + physicalWasteSheets;
            let rawSourceSheetsNeeded = Math.ceil(rawTotalSheetsNeeded / sourceYield);
            let totalSheetsNeeded = rawTotalSheetsNeeded;
            let totalSourceSheetsNeeded = rawSourceSheetsNeeded;

            const packEnabled = document.getElementById('calc-paper-pack-enabled') ? document.getElementById('calc-paper-pack-enabled').checked : false;
            let packSize = 100;
            if (packEnabled) {
                const packSelect = document.getElementById('calc-paper-pack-size');
                if (packSelect && packSelect.value === 'custom') {
                    packSize = parseInt(document.getElementById('calc-paper-pack-custom')?.value) || 100;
                } else if (packSelect) {
                    packSize = parseInt(packSelect.value) || 100;
                }
                if (packSize <= 0) packSize = 100;
            }

            const orderedSheetsInput = document.getElementById('calc-ordered-sheets');
            const osRaw = (customOrderedSheets !== undefined && customOrderedSheets !== null) ? String(customOrderedSheets) : (orderedSheetsInput ? orderedSheetsInput.value.trim() : '');
            const osArr = osRaw ? osRaw.split(',').map(x => parseFloat(x.trim().replace(/\./g, ''))).filter(x => !isNaN(x) && x > 0) : [];
            const curIdx = (typeof qtyIndex === 'number' && qtyIndex >= 0) ? qtyIndex : 0;
            let manualOrderedVal = osArr[curIdx] || (osArr.length === 1 && curIdx === 0 ? osArr[0] : 0);

            let orderedSheetsVal = 0;
            if (manualOrderedVal > 0) {
                orderedSheetsVal = manualOrderedVal;
                totalSourceSheetsNeeded = manualOrderedVal;
                totalSheetsNeeded = manualOrderedVal * sourceYield;
            } else if (packEnabled) {
                let roundedPackSheets = Math.ceil(rawSourceSheetsNeeded / packSize) * packSize;
                orderedSheetsVal = roundedPackSheets;
                totalSourceSheetsNeeded = roundedPackSheets;
                totalSheetsNeeded = roundedPackSheets * sourceYield;
            }

            if (qty === q && curIdx === 0) {
                if (document.getElementById('res-source-sheets-needed')) {
                    document.getElementById('res-source-sheets-needed').innerText = rawSourceSheetsNeeded;
                }
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

            // IZRAČUN ZA 2. PAPIR IN KAŠIRANJE
            const paper2Enabled = document.getElementById('calc-paper2-enable') ? document.getElementById('calc-paper2-enable').checked : false;
            let paper2Cost = 0;
            let totalKasiranjeCost = 0;
            let paper2Type = "";
            let paper2Weight = 0;
            let paper2Code = "";
            let paper2Price = 0;
            let paper2Unit = "ton";
            let paper2WasteSheets = paperWasteSheets;
            let totalPaper2SheetsNeeded = 0;
            let totalSourcePaper2SheetsNeeded = 0;
            let kasiranjePrep = 0;
            let kasiranjePrice = 0;
            let kasiranjeUnit = "kos";
            let kasiranjeWorkCost = 0;

            if (paper2Enabled) {
                paper2Type = document.getElementById('calc-paper2-type') ? document.getElementById('calc-paper2-type').value.trim() : "";
                paper2Weight = parseFloat(document.getElementById('calc-paper2-weight') ? document.getElementById('calc-paper2-weight').value.replace(',', '.') : '0') || 0;
                paper2Code = document.getElementById('calc-paper2-code') ? document.getElementById('calc-paper2-code').value.trim() : "";
                paper2Price = parseFloat(document.getElementById('calc-paper2-price') ? document.getElementById('calc-paper2-price').value.replace(',', '.') : '0') || 0;
                paper2Unit = document.getElementById('calc-paper2-unit') ? document.getElementById('calc-paper2-unit').value : "ton";
                
                const manualP2Waste = parseFloat(document.getElementById('calc-paper2-waste-manual') ? document.getElementById('calc-paper2-waste-manual').value : '');
                if (!isNaN(manualP2Waste)) {
                    paper2WasteSheets = manualP2Waste;
                }
                
                totalPaper2SheetsNeeded = sheetsNeeded + paper2WasteSheets;
                let rawSourcePaper2SheetsNeeded = Math.ceil(totalPaper2SheetsNeeded / sourceYield);
                totalSourcePaper2SheetsNeeded = rawSourcePaper2SheetsNeeded;
                if (manualOrderedVal > 0) {
                    totalSourcePaper2SheetsNeeded = manualOrderedVal;
                    totalPaper2SheetsNeeded = manualOrderedVal * sourceYield;
                } else if (packEnabled) {
                    let roundedP2 = Math.ceil(rawSourcePaper2SheetsNeeded / packSize) * packSize;
                    totalSourcePaper2SheetsNeeded = roundedP2;
                    totalPaper2SheetsNeeded = roundedP2 * sourceYield;
                }

                if (paper2Unit === 'ton') {
                    let areaM2 = (sourceW / 1000) * (sourceH / 1000);
                    let weightKg2 = areaM2 * (paper2Weight / 1000) * totalSourcePaper2SheetsNeeded;
                    paper2Cost = (weightKg2 / 1000) * paper2Price;
                } else if (paper2Unit === '1000') {
                    paper2Cost = (totalSourcePaper2SheetsNeeded / 1000) * paper2Price;
                } else {
                    paper2Cost = totalSourcePaper2SheetsNeeded * paper2Price;
                }

                kasiranjePrep = parseFloat(document.getElementById('calc-paper2-prep-price') ? document.getElementById('calc-paper2-prep-price').value.replace(',', '.') : '0') || 0;
                kasiranjePrice = parseFloat(document.getElementById('calc-paper2-kasiranje-price') ? document.getElementById('calc-paper2-kasiranje-price').value.replace(',', '.') : '0') || 0;
                kasiranjeUnit = document.getElementById('calc-paper2-kasiranje-unit') ? document.getElementById('calc-paper2-kasiranje-unit').value : "kos";

                let effectiveTargetQty = (orderedQty && orderedQty > 0) ? orderedQty : qty;
                if (kasiranjeUnit === 'kos') {
                    kasiranjeWorkCost = effectiveTargetQty * kasiranjePrice;
                } else {
                    kasiranjeWorkCost = sheetsNeeded * kasiranjePrice;
                }
                totalKasiranjeCost = kasiranjePrep + kasiranjeWorkCost;

                paperCost += paper2Cost;
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
                let baseColorMode = isSV ? '8/0' : (_isObrat ? '4/OB' : (((_front === 4 && _back === 1) || (_front === 1 && _back === 4)) ? '4/1' : (_back > 0 ? '4/4' : '4/0')));
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
                    let lookupQty = (isSV) ? qty : ((_back > 0 || _isObrat) ? qty * 2 : qty);
                    if (lookupQty <= bossTable[0].q && bossTable.length > 1) {
                        let rangeQ = bossTable[1].q - bossTable[0].q;
                        let speed1 = getS(bossTable[0]);
                        let speed2 = getS(bossTable[1]);
                        let rangeS = speed2 - speed1;
                        let fraction = (lookupQty - bossTable[0].q) / rangeQ;
                        s = speed1 + fraction * rangeS;
                        s = Math.max(s, speed1 * 0.5); // Prevent extremely low or negative speeds
                    } else if (lookupQty >= bossTable[bossTable.length - 1].q) {
                        s = getS(bossTable[bossTable.length - 1]);
                    } else {
                        for (let i = 0; i < bossTable.length - 1; i++) {
                            if (lookupQty >= bossTable[i].q && lookupQty <= bossTable[i + 1].q) {
                                let rangeQ = bossTable[i + 1].q - bossTable[i].q;
                                let speed1 = getS(bossTable[i]);
                                let speed2 = getS(bossTable[i + 1]);
                                let rangeS = speed2 - speed1;
                                let fraction = (lookupQty - bossTable[i].q) / rangeQ;
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
            const manualPassesSelect = document.getElementById('calc-machine-passes');
            if (manualPassesSelect && manualPassesSelect.value !== 'auto') {
                mPasses = parseInt(manualPassesSelect.value) || mPasses;
            }
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
            // Strojni čas priprave (vedno avtomatsko izračunavanje)
            let mPrepInp = "";
            let mPrepMinutes = 30;
            if (mPrepInp !== "") {
                mPrepMinutes = parseFloat(mPrepInp) || 0;
            } else {
                if (isObrat) {
                    mPrepMinutes = 45; // 0,75 h za 4/OB (obračanje)
                } else if (back > 0) {
                    mPrepMinutes = 45; // 0,75 h za 4/4 (in ostale dvostranske tiske)
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
            let totalFinishCost = 0;
            let perSheetCost = 0;
            if (mType === 'digital') {
                platesNum = 0;
                numberOfChanges = 0;
                washesNum = 0;
                washCost = 0;
                prepPrice = 30;
                totalPrepCost = 30; // Fiksna priprava za digitalni tisk, brez plošč
                let isColor = (front > 1 || back > 1);
                let isDoubleSided = (back > 0 || isObrat);
                if (isColor) {
                    if (printSheets > 5000) {
                        perSheetCost = isDoubleSided ? 0.26 : 0.13;
                    } else {
                        perSheetCost = isDoubleSided ? 0.60 : 0.30;
                    }
                } else {
                    perSheetCost = isDoubleSided ? 0.10 : 0.05;
                }
                totalPrintCost = printSheets * perSheetCost;
                printHours = 0; // Strojnega časa za tisk ne upoštevamo po uri
            } else if (mType === 'digital-plakat') {
                platesNum = 0;
                numberOfChanges = 0;
                washesNum = 0;
                washCost = 0;
                totalPrepCost = 0;
                paperCost = 0; // Cenik plakatov že zajema papir in tisk
                let posterFormat = document.getElementById('calc-poster-format') ? document.getElementById('calc-poster-format').value : 'B1';
                let posterUnitPrice = getDigitalPosterUnitPrice(posterFormat, qty);
                totalPrintCost = qty * posterUnitPrice;
                printHours = 0;

                let numTubes = parseFloat(document.getElementById('calc-poster-tubes') ? document.getElementById('calc-poster-tubes').value : 0) || 0;
                let tubeCost = numTubes * 1.42;
                totalFinishCost += tubeCost;

                if (qty === q) {
                    let infoEl = document.getElementById('digital-plakat-price-info');
                    if (infoEl) {
                        let unitPriceStr = posterUnitPrice.toFixed(3).replace('.', ',');
                        let printCostStr = totalPrintCost.toFixed(2).replace('.', ',');
                        let tubeCostStr = tubeCost.toFixed(2).replace('.', ',');
                        infoEl.innerHTML = `📌 <strong>Cenik ${posterFormat}</strong> za ${qty} kos: <strong>${unitPriceStr} € / kos</strong> (skupaj tisk plakatov: <strong>${printCostStr} €</strong>)${numTubes > 0 ? ` | 📦 Tulci (${numTubes}x 1,42 €): <strong>${tubeCostStr} €</strong>` : ''}`;
                    }
                }
            } else if (mType === 'digital-rollup') {
                platesNum = 0;
                numberOfChanges = 0;
                washesNum = 0;
                washCost = 0;
                totalPrepCost = 0;
                paperCost = 0; // Roll up cenik zajema tisk, material in mehanizem
                let rollUpUnitPrice = getDigitalRollUpUnitPrice(qty);
                totalPrintCost = qty * rollUpUnitPrice;
                printHours = 0;

                if (qty === q) {
                    let infoEl = document.getElementById('digital-rollup-price-info');
                    if (infoEl) {
                        let unitPriceStr = rollUpUnitPrice.toFixed(2).replace('.', ',');
                        let printCostStr = totalPrintCost.toFixed(2).replace('.', ',');
                        infoEl.innerHTML = `📌 <strong>Cena Digitalni ROLL UP</strong> za ${qty} kos: <strong>${unitPriceStr} € / kos</strong> (skupaj: <strong>${printCostStr} €</strong>)`;
                    }
                }
            }
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
                let cPrep = parseFloat(document.getElementById('f-cilinder-prep').value.replace(',', '.')) || 0;
                let cRate = parseFloat(document.getElementById('f-cilinder-rate').value.replace(',', '.')) || 0;
                let manualHours = parseFloat(document.getElementById('f-cilinder-hours').value.replace(',', '.'));
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
            if (document.getElementById('f-ril-active').checked) {
                let rSpeed = parseFloat(document.getElementById('f-ril-speed').value.replace(',', '.')) || 1200;
                let rRate = parseFloat(document.getElementById('f-ril-rate').value.replace(',', '.')) || 20;
                let manualHours = parseFloat(document.getElementById('f-ril-hours').value.replace(',', '.'));
                let workHours = 0;
                if (!isNaN(manualHours) && manualHours > 0) {
                    workHours = manualHours;
                } else {
                    workHours = qty / rSpeed;
                }
                totalFinishCost += workHours * rRate;
            }
            if (document.getElementById('f-zgibanje-active').checked) {
                let zFolds = parseInt(document.getElementById('f-zgibanje-folds').value) || 1;
                let zSpeed = parseFloat(document.getElementById('f-zgibanje-speed').value.replace(',', '.')) || 10800;
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
                const spdInput = document.getElementById('f-razrez-format-speed').value.replace(',', '.');
                const spd = spdInput !== "" ? parseFloat(spdInput) : autoCutSpeed;
                const rteInput = document.getElementById('f-razrez-format-rate').value.replace(',', '.');
                const rte = rteInput !== "" ? parseFloat(rteInput) : autoCutRate;
                totalFinishCost += (totalSheetsNeeded / spd) * rte;
            }
            if (document.getElementById('f-lepljenje-active').checked) {
                totalFinishCost += (parseFloat(document.getElementById('f-lepljenje-prep').value.replace(',', '.')) || 0) + qty * (parseFloat(document.getElementById('f-lepljenje-per1000').value.replace(',', '.')) || 0);
            }
            if (document.getElementById('f-spiral-active').checked) {
                totalFinishCost += qty * (parseFloat(document.getElementById('f-spiral-price').value.replace(',', '.')) || 0);
            }
            if (document.getElementById('f-extra-active').checked) {
                const spd = parseFloat(document.getElementById('f-extra-speed').value.replace(',', '.')) || 1;
                const rte = parseFloat(document.getElementById('f-extra-rate').value.replace(',', '.')) || 20;
                let workQty = qty;
                if (document.getElementById('f-extra-qty')) {
                    let customQty = parseInt(document.getElementById('f-extra-qty').value) || 0;
                    if (customQty > 0) workQty = customQty;
                }
                totalFinishCost += (workQty / spd) * rte;
            }
            if (document.getElementById('f-dodatna-dela-active') && document.getElementById('f-dodatna-dela-active').checked) {
                let dSheets = parseFloat((document.getElementById('f-dodatna-dela-sheets')?.value || '').replace(',', '.')) || 0;
                let dKom = parseFloat((document.getElementById('f-dodatna-dela-kom')?.value || '').replace(',', '.')) || 0;
                let dPrice = parseFloat((document.getElementById('f-dodatna-dela-price')?.value || '').replace(',', '.')) || 0;
                totalFinishCost += (dSheets + dKom) * dPrice;
            }
            if (document.getElementById('f-tool-active').checked) {
                totalFinishCost += (parseFloat(document.getElementById('f-tool-cost').value.replace(',', '.')) || 0);
            }
            if (document.getElementById('f-zasek-grafotehna-active') && document.getElementById('f-zasek-grafotehna-active').checked) {
                totalFinishCost += (parseFloat(document.getElementById('f-zasek-grafotehna-price').value.replace(',', '.')) || 0) * qty;
            }
            if (document.getElementById('f-uv-active').checked) {
                let uPrep = parseFloat(document.getElementById('f-uv-prep').value.replace(',', '.')) || 0;
                let uP1000 = parseFloat(document.getElementById('f-uv-per1000').value.replace(',', '.')) || 0;
                let pricePerSheet = uP1000 / 1000;
                let extraWaste = parseFloat(document.getElementById('f-uv-extra-waste').value.replace(',', '.')) || 0;
                let uvFormat = document.getElementById('f-uv-format') ? document.getElementById('f-uv-format').value : 'auto';
                let currentSheetW = g_lastSheetW || 700;
                let currentSheetH = g_lastSheetH || 500;
                updateUVFormatWarning(currentSheetW, currentSheetH, uvFormat);
                let uvCutFactor = getUVSheetFactor(currentSheetW, currentSheetH, uvFormat);
                if (uvCutFactor !== -1) {
                    let uvSheetsNet = sheetsNeeded * uvCutFactor;
                    let uvSheetsCalculated = uvSheetsNet + extraWaste;
                    let uvSides = document.getElementById('f-uv-sides') ? document.getElementById('f-uv-sides').value : '1/0';
                    let uvMultiplier = (uvSides === '1/1') ? 2 : 1;
                    totalFinishCost += uPrep + (uvSheetsCalculated * pricePerSheet * uvMultiplier);
                }
            }
            if (document.getElementById('f-uv2-active') && document.getElementById('f-uv2-active').checked) {
                let uPrep = parseFloat(document.getElementById('f-uv2-prep').value.replace(',', '.')) || 0;
                let uP1000 = parseFloat(document.getElementById('f-uv2-per1000').value.replace(',', '.')) || 0;
                let pricePerSheet = uP1000 / 1000;
                let extraWaste = parseFloat(document.getElementById('f-uv2-extra-waste').value.replace(',', '.')) || 0;
                let uvFormat = document.getElementById('f-uv2-format') ? document.getElementById('f-uv2-format').value : 'auto';
                let currentSheetW = g_lastSheetW || 700;
                let currentSheetH = g_lastSheetH || 500;
                updateUVFormatWarning(currentSheetW, currentSheetH, uvFormat, '2');
                let uvCutFactor = getUVSheetFactor(currentSheetW, currentSheetH, uvFormat);
                if (uvCutFactor !== -1) {
                    let uvSheetsNet = sheetsNeeded * uvCutFactor;
                    let uvSheetsCalculated = uvSheetsNet + extraWaste;
                    let uvSides = document.getElementById('f-uv2-sides') ? document.getElementById('f-uv2-sides').value : '1/0';
                    let uvMultiplier = (uvSides === '1/1') ? 2 : 1;
                    totalFinishCost += uPrep + (uvSheetsCalculated * pricePerSheet * uvMultiplier);
                }
            }
            if (document.getElementById('f-personalization-active') && document.getElementById('f-personalization-active').checked) {
                let persSidesVal = document.getElementById('f-personalization-sides') ? document.getElementById('f-personalization-sides').value : '1/0';
                let pMultiplier = (persSidesVal === '1/1' || persSidesVal === '2') ? 2 : 1;
                let currentSheetW = g_lastSheetW || 0;
                let currentSheetH = g_lastSheetH || 0;
                let splitInfo = getPersonalizationSplitInfo(currentSheetW, currentSheetH, itemsPerSheet, mType);
                let digCutFactor = splitInfo.digCutFactor;
                let targetSheets = sheetsNeeded;
                let pDigitalSheets = 0;
                let pCustomQty = 0;
                if (document.getElementById('f-personalization-qty')) {
                    pCustomQty = parseInt(document.getElementById('f-personalization-qty').value) || 0;
                }
                if (pCustomQty > 0) {
                    let itemsPerDigitalSheet = (itemsPerSheet > 0) ? (itemsPerSheet / digCutFactor) : 1;
                    pDigitalSheets = Math.ceil(pCustomQty / itemsPerDigitalSheet);
                } else {
                    pDigitalSheets = targetSheets * digCutFactor;
                }
                let pCost = (pDigitalSheets * pMultiplier) * (parseFloat(document.getElementById('f-personalization-price').value.replace(',', '.')) || 0);
                
                let extraCost = 0;
                if (digCutFactor > 1) {
                    let cutsPerSheet = (digCutFactor === 3 || digCutFactor === 4 ? 2 : 1) + (splitInfo.isTrimmed ? 1 : 0);
                    let razrezSheets = totalSheetsNeeded * cutsPerSheet;
                    let autoCutSpeed = 7400;
                    if (paperWeight >= 300) autoCutSpeed = 4100;
                    else if (paperWeight > 150) autoCutSpeed = 7400 - ((paperWeight - 150) / 150) * (7400 - 4100);
                    extraCost += (razrezSheets / Math.round(autoCutSpeed)) * 30.00;
                }
                totalFinishCost += pCost + extraCost;
            }
            if (document.getElementById('f-precut-active') && document.getElementById('f-precut-active').checked) {
                let prePrep = parseFloat(document.getElementById('f-precut-prep').value.replace(',', '.')) || 0;
                let prePer1000 = parseFloat(document.getElementById('f-precut-per1000').value.replace(',', '.')) || 0;
                totalFinishCost += prePrep + (totalSourceSheetsNeeded / 1000) * prePer1000;
            }
            if (document.getElementById('f-lam-active').checked) {
                totalFinishCost += sheetsNeeded * (parseFloat(document.getElementById('f-lam-per1000').value.replace(',', '.')) || 0) * (parseInt(document.getElementById('f-lam-sides').value) || 1);
            }
            let deliveryCost = 0;
            if (document.getElementById('f-delivery-active').checked) {
                let pCount = parseFloat(document.getElementById('f-post-count').value.replace(',', '.')) || 0;
                let pPricePer = parseFloat(document.getElementById('f-post-price-per').value.replace(',', '.')) || 0;
                deliveryCost += (pCount * pPricePer);
            }
            if (document.getElementById('f-del-fixed-active').checked) {
                deliveryCost += (parseFloat(document.getElementById('f-del-fixed-price').value.replace(',', '.')) || 0);
            }
            totalFinishCost += deliveryCost; // Sedaj prištejemo k dodelavi!
            let commercialCost = parseFloat(document.getElementById('calc-commercial').value) || 0;
            if (qty === q) {
                updateMachineEfficiencyWarning(mType, qty, totalPrintCost, totalPrepCost, totalSheetsNeeded);
            }
            if (mType === 'digital-rollup') {
                paperCost = 0;
                totalPrepCost = 0;
                totalFinishCost = 0;
                deliveryCost = 0;
                commercialCost = 0;
            }
            let subtotalWithoutDelivery = paperCost + totalPrepCost + totalPrintCost + (totalFinishCost - deliveryCost) + commercialCost;
            if (mType === 'digital-rollup') {
                subtotalWithoutDelivery = totalPrintCost;
            } else if (document.getElementById('calc-minus-price').checked) {
                subtotalWithoutDelivery = subtotalWithoutDelivery * 0.952; // -4.8%
            }
            let subtotal = subtotalWithoutDelivery + deliveryCost;
            let marginPercent = parseFloat(document.getElementById('calc-margin').value) || 0;
            let totalPrice = subtotal;
            if (mType === 'digital-rollup') {
                if (marginPercent > 0 && marginPercent < 100) {
                    totalPrice = subtotal / (1 - (marginPercent / 100)); // RVC izračun če je ročno vnešen
                } else if (marginPercent >= 100 || marginPercent < 0) {
                    totalPrice = subtotal * (1 + marginPercent / 100);
                } else {
                    totalPrice = totalPrintCost;
                }
            } else if (marginPercent > 0 && marginPercent < 100) {
                totalPrice = subtotal / (1 - (marginPercent / 100)); // RVC izračun
            } else if (marginPercent >= 100) {
                totalPrice = subtotal * (1 + marginPercent / 100); // Standardna marža
            } else if (marginPercent < 0) {
                totalPrice = subtotal * (1 + marginPercent / 100); // Popust
            }
            // perItemFinal: cena na kos za stranko - deli s naročeno naklado (ne tiskano)
            let effectiveQty = (orderedQty && orderedQty > 0) ? orderedQty : qty;
            let perItemFinal = Math.round((totalPrice / effectiveQty) * 10000) / 10000;
                totalPrice = Math.round((perItemFinal * effectiveQty) * 100) / 100;
            let lamSidesForWeight = 0;
            if (document.getElementById('f-lam-active') && document.getElementById('f-lam-active').checked) {
                lamSidesForWeight = parseInt(document.getElementById('f-lam-sides').value) || 1;
            }
            let itemWForWeight = parseFloat(document.getElementById('width')?.value.replace(',', '.')) || 0;
            let itemHForWeight = parseFloat(document.getElementById('height')?.value.replace(',', '.')) || 0;
            let productAreaM2 = (itemWForWeight / 1000) * (itemHForWeight / 1000);
            let productWeightGrams = productAreaM2 * (paperWeight + (lamSidesForWeight * 25)); // 25g/m2 na plastifikacijo
            if (paper2Enabled) {
                productWeightGrams += productAreaM2 * paper2Weight;
            }
            let singleWeightKg = productWeightGrams / 1000;
            let totalOrderWeightKg = singleWeightKg * effectiveQty;
            window.g_currentTotalWeightKg = totalOrderWeightKg;
            if (typeof window.syncTariffWeightExternal === 'function') {
                window.syncTariffWeightExternal();
            }

            // DETAILED SPECS OBJECT
            let details = {
                weight: {
                    singleKg: singleWeightKg,
                    totalKg: totalOrderWeightKg,
                    q: effectiveQty
                },
                productWeight: {
                    oneProductGrams: productWeightGrams,
                    totalOrderKg: totalOrderWeightKg,
                    effectiveQty: effectiveQty
                },
                paper: {
                    rawTotalSheetsNeeded: rawTotalSheetsNeeded,
                    rawSourceSheetsNeeded: rawSourceSheetsNeeded,
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
                    perSheetCost: (mType === 'digital' ? perSheetCost : undefined),
                    cost: totalPrintCost,
                    gripper: parseFloat(document.getElementById('gripper').value) || 0
                },
                finish: {
                    items: [],
                    cost: totalFinishCost
                }
            };

            if (paper2Enabled) {
                details.paper2 = {
                    enabled: true,
                    type: paper2Type,
                    weight: paper2Weight,
                    code: paper2Code,
                    price: paper2Price,
                    unit: paper2Unit,
                    wasteSheets: paper2WasteSheets,
                    totalSheets: totalPaper2SheetsNeeded,
                    sourceSheets: totalSourcePaper2SheetsNeeded,
                    cost: paper2Cost,
                    kasiranjePrep: kasiranjePrep,
                    kasiranjePrice: kasiranjePrice,
                    kasiranjeUnit: kasiranjeUnit,
                    kasiranjeWorkCost: kasiranjeWorkCost,
                    kasiranjeTotalCost: totalKasiranjeCost
                };
                details.finish.items.push({
                    name: 'Kaširanje / Lepljenje 2 pol',
                    cost: totalKasiranjeCost,
                    breakdown: `Priprava: ${formatPrice(kasiranjePrep)} + Lepljenje (${kasiranjeUnit === 'kos' ? formatQty(effectiveQty) + ' kos' : formatQty(sheetsNeeded) + ' pol'} x ${formatPrice(kasiranjePrice)}): ${formatPrice(kasiranjeWorkCost)}`
                });
            }
            // Collect finishing items
            if (document.getElementById('f-cilinder-active').checked) {
                let cPrep = parseFloat(document.getElementById('f-cilinder-prep').value.replace(',', '.')) || 0;
                let cRate = parseFloat(document.getElementById('f-cilinder-rate').value.replace(',', '.')) || 0;
                let manualHours = parseFloat(document.getElementById('f-cilinder-hours').value.replace(',', '.'));
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
                let cilPhases = [];
                if (document.getElementById('f-cilinder-zasek')?.checked) cilPhases.push('zasek');
                if (document.getElementById('f-cilinder-izsek')?.checked) cilPhases.push('izsek');
                if (document.getElementById('f-cilinder-perforacija')?.checked) cilPhases.push('perforacija');
                if (document.getElementById('f-cilinder-zleb')?.checked) cilPhases.push('žleb');
                let cilPhaseName = cilPhases.length > 0 ? `Cilinder (${cilPhases.join(', ')})` : 'Cilinder';
                details.finish.items.push({
                    name: cilPhaseName,
                    cost: cCost,
                    breakdown: `Priprava: ${formatPrice(cPrep)} | Delo: ${hourText} (${formatPrice(cWork)})`
                });
            }
            if (document.getElementById('f-ril-active').checked) {
                let rSpeed = parseFloat(document.getElementById('f-ril-speed').value.replace(',', '.')) || 1200;
                let rRate = parseFloat(document.getElementById('f-ril-rate').value.replace(',', '.')) || 20;
                let manualHours = parseFloat(document.getElementById('f-ril-hours').value.replace(',', '.'));
                let workHours = 0;
                let isAuto = true;
                if (!isNaN(manualHours) && manualHours > 0) {
                    workHours = manualHours;
                    isAuto = false;
                } else {
                    workHours = qty / rSpeed;
                }
                let rCost = workHours * rRate;
                let hourText = isAuto ? `${workHours.toFixed(2)}h (avto)` : `${workHours.toFixed(2)}h (ročno)`;
                details.finish.items.push({
                    name: 'Ril - rilmašina',
                    cost: rCost,
                    breakdown: `Delo: ${hourText} (${formatPrice(rCost)})`
                });
            }
            if (document.getElementById('f-zgibanje-active').checked) {
                let zFolds = parseInt(document.getElementById('f-zgibanje-folds').value) || 1;
                let zSpeed = parseFloat(document.getElementById('f-zgibanje-speed').value.replace(',', '.')) || 10800;
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
                const spdInput = document.getElementById('f-razrez-format-speed').value.replace(',', '.');
                const spd = spdInput !== "" ? parseFloat(spdInput) : autoCutSpeed;
                const rteInput = document.getElementById('f-razrez-format-rate').value.replace(',', '.');
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
                let lPrep = (parseFloat(document.getElementById('f-lepljenje-prep').value.replace(',', '.')) || 0);
                let lP1000 = (parseFloat(document.getElementById('f-lepljenje-per1000').value.replace(',', '.')) || 0);
                let lWork = qty * lP1000;
                let lCost = lPrep + lWork;
                details.finish.items.push({
                    name: 'Lepljenje Petrata',
                    cost: lCost,
                    breakdown: `Priprava: ${formatPrice(lPrep)} | Delo: ${qty} kos (${formatPrice(lWork)})`
                });
            }
            if (document.getElementById('f-spiral-active').checked) {
                let sPrice = parseFloat(document.getElementById('f-spiral-price').value.replace(',', '.')) || 0;
                let sCost = qty * sPrice;
                details.finish.items.push({
                    name: 'Špiraljenje / Vrvice',
                    cost: sCost,
                    breakdown: `${formatQty(qty)} kos * ${formatPrice(sPrice)}/kos`
                });
            }
            if (document.getElementById('f-extra-active').checked) {
                const spd = parseFloat(document.getElementById('f-extra-speed').value.replace(',', '.')) || 1;
                const rte = parseFloat(document.getElementById('f-extra-rate').value.replace(',', '.')) || 20;
                let workQty = qty;
                if (document.getElementById('f-extra-qty')) {
                    let customQty = parseInt(document.getElementById('f-extra-qty').value) || 0;
                    if (customQty > 0) workQty = customQty;
                }
                const hrs = workQty / spd;
                let eMan = hrs * rte;
                let isPartial = (document.getElementById('f-extra-qty') && parseInt(document.getElementById('f-extra-qty').value) > 0);
                let qtyNote = isPartial ? ` (${workQty.toLocaleString('de-DE')} kos)` : '';
                details.finish.items.push({
                    name: `Ročno delo${qtyNote} (Norma: ${spd} kos/h)`,
                    cost: eMan,
                    breakdown: `Čas: ${hrs.toFixed(2)} h po ${formatPrice(rte)}/h = ${formatPrice(eMan)}`
                });
            }
            if (document.getElementById('f-dodatna-dela-active') && document.getElementById('f-dodatna-dela-active').checked) {
                let dDesc = document.getElementById('f-dodatna-dela-desc') ? document.getElementById('f-dodatna-dela-desc').value.trim() : '';
                let dSheets = parseFloat((document.getElementById('f-dodatna-dela-sheets')?.value || '').replace(',', '.')) || 0;
                let dKom = parseFloat((document.getElementById('f-dodatna-dela-kom')?.value || '').replace(',', '.')) || 0;
                let dPrice = parseFloat((document.getElementById('f-dodatna-dela-price')?.value || '').replace(',', '.')) || 0;
                let dCost = (dSheets + dKom) * dPrice;
                let title = dDesc ? `Dodatna dela (${dDesc})` : 'Dodatna dela';
                let parts = [];
                if (dSheets > 0) parts.push(`${dSheets} pol`);
                if (dKom > 0) parts.push(`${dKom} kom`);
                let qtyStr = parts.length > 0 ? parts.join(', ') : '0 unit';
                details.finish.items.push({
                    name: title,
                    cost: dCost,
                    breakdown: `${qtyStr} x ${formatPrice(dPrice)}`
                });
            }
            if (document.getElementById('f-tool-active').checked) {
                let tCost = (parseFloat(document.getElementById('f-tool-cost').value.replace(',', '.')) || 0);
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
                let uPrep = parseFloat(document.getElementById('f-uv-prep').value.replace(',', '.')) || 0;
                let uP1000 = parseFloat(document.getElementById('f-uv-per1000').value.replace(',', '.')) || 0;
                let pricePerSheet = uP1000 / 1000;
                let extraWaste = parseFloat(document.getElementById('f-uv-extra-waste').value.replace(',', '.')) || 0;
                let uvFormat = document.getElementById('f-uv-format') ? document.getElementById('f-uv-format').value : 'auto';
                let currentSheetW = g_lastSheetW || 700;
                let currentSheetH = g_lastSheetH || 500;
                let uvCutFactor = getUVSheetFactor(currentSheetW, currentSheetH, uvFormat);
                let uvSides = document.getElementById('f-uv-sides') ? document.getElementById('f-uv-sides').value : '1/0';
                
                let uCost = 0;
                let breakdownText = "";
                if (uvCutFactor === -1) {
                    breakdownText = `⛔ POLA NI ZA LAKIRATI, KER JE NAPAČEN FORMAT!`;
                    uCost = 0;
                } else {
                    let uvSheetsNet = sheetsNeeded * uvCutFactor;
                    let uvSheetsCalculated = uvSheetsNet + extraWaste;
                    let uvMultiplier = (uvSides === '1/1') ? 2 : 1;
                    let uWorkTotal = uvSheetsCalculated * pricePerSheet * uvMultiplier;
                    uCost = uPrep + uWorkTotal;
                    
                    let sheetDetailText = (uvCutFactor > 1) ? `${uvSheetsNet} (${sheetsNeeded}x${uvCutFactor} neto)` : `${sheetsNeeded} (neto)`;
                    breakdownText = `Priprava: ${formatPrice(uPrep)} | Delo: ${sheetDetailText} + ${extraWaste} (tiskar) = ${uvSheetsCalculated.toFixed(0)} pol po ${pricePerSheet.toFixed(3)} €`;
                    if (uvMultiplier > 1) {
                        breakdownText += ` x 2 (obojestransko)`;
                    }
                    breakdownText += ` = ${formatPrice(uWorkTotal)}`;
                }

                details.finish.items.push({
                    name: 'UV lak (tuja) ' + uvSides,
                    cost: uCost,
                    breakdown: breakdownText
                });
            }
            if (document.getElementById('f-uv2-active') && document.getElementById('f-uv2-active').checked) {
                let uPrep = parseFloat(document.getElementById('f-uv2-prep').value.replace(',', '.')) || 0;
                let uP1000 = parseFloat(document.getElementById('f-uv2-per1000').value.replace(',', '.')) || 0;
                let pricePerSheet = uP1000 / 1000;
                let extraWaste = parseFloat(document.getElementById('f-uv2-extra-waste').value.replace(',', '.')) || 0;
                let uvFormat = document.getElementById('f-uv2-format') ? document.getElementById('f-uv2-format').value : 'auto';
                let currentSheetW = g_lastSheetW || 700;
                let currentSheetH = g_lastSheetH || 500;
                let uvCutFactor = getUVSheetFactor(currentSheetW, currentSheetH, uvFormat);
                let uvSides = document.getElementById('f-uv2-sides') ? document.getElementById('f-uv2-sides').value : '1/0';
                
                let uCost = 0;
                let breakdownText = "";
                if (uvCutFactor === -1) {
                    breakdownText = `⛔ POLA NI ZA LAKIRATI, KER JE NAPAČEN FORMAT!`;
                    uCost = 0;
                } else {
                    let uvSheetsNet = sheetsNeeded * uvCutFactor;
                    let uvSheetsCalculated = uvSheetsNet + extraWaste;
                    let uvMultiplier = (uvSides === '1/1') ? 2 : 1;
                    let uWorkTotal = uvSheetsCalculated * pricePerSheet * uvMultiplier;
                    uCost = uPrep + uWorkTotal;
                    
                    let sheetDetailText = (uvCutFactor > 1) ? `${uvSheetsNet} (${sheetsNeeded}x${uvCutFactor} neto)` : `${sheetsNeeded} (neto)`;
                    breakdownText = `Priprava: ${formatPrice(uPrep)} | Delo: ${sheetDetailText} + ${extraWaste} (tiskar) = ${uvSheetsCalculated.toFixed(0)} pol po ${pricePerSheet.toFixed(3)} €`;
                    if (uvMultiplier > 1) {
                        breakdownText += ` x 2 (obojestransko)`;
                    }
                    breakdownText += ` = ${formatPrice(uWorkTotal)}`;
                }

                details.finish.items.push({
                    name: 'UV lak 2 (tuja) ' + uvSides,
                    cost: uCost,
                    breakdown: breakdownText
                });
            }
            if (document.getElementById('f-personalization-active') && document.getElementById('f-personalization-active').checked) {
                let persSidesSelect = document.getElementById('f-personalization-sides');
                let persSidesText = persSidesSelect ? persSidesSelect.value : '1/0';
                let isBothSides = (persSidesText === '1/1');
                let currentSheetW = g_lastSheetW || 0;
                let currentSheetH = g_lastSheetH || 0;
                let splitInfo = getPersonalizationSplitInfo(currentSheetW, currentSheetH, itemsPerSheet, mType);
                let digCutFactor = splitInfo.digCutFactor;
                let pMultiplier = isBothSides ? 2 : 1;
                let targetSheets = sheetsNeeded;
                let pCustomQty = 0;
                if (document.getElementById('f-personalization-qty')) {
                    pCustomQty = parseInt(document.getElementById('f-personalization-qty').value) || 0;
                }
                let pDigitalSheets = 0;
                if (pCustomQty > 0) {
                    let itemsPerDigitalSheet = (itemsPerSheet > 0) ? (itemsPerSheet / digCutFactor) : 1;
                    pDigitalSheets = Math.ceil(pCustomQty / itemsPerDigitalSheet);
                } else {
                    pDigitalSheets = targetSheets * digCutFactor;
                }
                let pTotalImpressions = pDigitalSheets * pMultiplier;
                let pPrice = (parseFloat(document.getElementById('f-personalization-price').value.replace(',', '.')) || 0);
                let pCost = pTotalImpressions * pPrice;
                let sidesText = isBothSides ? ' (1/1 obojestransko)' : ` (${persSidesText})`;
                
                let limitWarnStr = splitInfo.fitsDigital ? '' : ' ⚠️ PRESEGA DIGITAL (max 480x320)';
                let actionName = splitInfo.isTrimmed ? 'Razrez in obrez' : 'Razrez';
                let persFormatInfo = (digCutFactor > 1) ? ` (${actionName.toLowerCase()} -> ${digCutFactor}x ${splitInfo.partStr}${limitWarnStr})` : (splitInfo.partStr ? ` (format ${splitInfo.partStr}${limitWarnStr})` : '');
                let partialNote = (pCustomQty > 0) ? ` [delno: ${pCustomQty.toLocaleString('de-DE')} kos]` : '';
                let breakdownText = `Delo${partialNote}: ${pTotalImpressions.toLocaleString('de-DE')} odtisov${sidesText} na ${pDigitalSheets.toLocaleString('de-DE')} pol za personalizacijo${persFormatInfo} po ${formatPrice(pPrice)}/odtis = ${formatPrice(pCost)}`;
                let extraCost = 0;
                if (digCutFactor > 1) {
                    let cutsPerSheet = (digCutFactor === 3 || digCutFactor === 4 ? 2 : 1) + (splitInfo.isTrimmed ? 1 : 0);
                    let razrezSheets = totalSheetsNeeded * cutsPerSheet;
                    let autoCutSpeed = 7400;
                    if (paperWeight >= 300) autoCutSpeed = 4100;
                    else if (paperWeight > 150) autoCutSpeed = 7400 - ((paperWeight - 150) / 150) * (7400 - 4100);
                    autoCutSpeed = Math.round(autoCutSpeed);
                    let razrezCost = (razrezSheets / autoCutSpeed) * 30.00;
                    extraCost += razrezCost;
                    breakdownText += ` | ${actionName} -> ${digCutFactor}x (${splitInfo.partStr}): ${formatPrice(razrezCost)}`;
                }
                let nameSuffix = (digCutFactor > 1) ? ` (${actionName} -> ${digCutFactor}x ${splitInfo.partStr}${limitWarnStr})` : (splitInfo.partStr ? ` (Format ${splitInfo.partStr}${limitWarnStr})` : '');
                if (isBothSides) nameSuffix = ' (Obojestransko)' + ((digCutFactor > 1) ? ` -> ${digCutFactor}x ${splitInfo.partStr}` : ` (${splitInfo.partStr})`);
                details.finish.items.push({
                    name: 'Personalizacija' + nameSuffix + sidesText,
                    cost: pCost + extraCost,
                    breakdown: breakdownText
                });
            }
            if (document.getElementById('f-precut-active') && document.getElementById('f-precut-active').checked) {
                let prePrep = parseFloat(document.getElementById('f-precut-prep').value.replace(',', '.')) || 0;
                let prePer1000 = parseFloat(document.getElementById('f-precut-per1000').value.replace(',', '.')) || 0;
                let preCost = prePrep + (totalSourceSheetsNeeded / 1000) * prePer1000;
                details.finish.items.push({
                    name: 'Razrez materiala (pred tiskom)',
                    cost: preCost,
                    breakdown: `Osnovne pole: ${totalSourceSheetsNeeded} | Priprava: ${formatPrice(prePrep)}`
                });
            }
            if (document.getElementById('f-lam-active').checked) {
                let lP1000 = (parseFloat(document.getElementById('f-lam-per1000').value.replace(',', '.')) || 0);
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
                let pCount = parseFloat(document.getElementById('f-post-count').value.replace(',', '.')) || 0;
                let pPricePer = parseFloat(document.getElementById('f-post-price-per').value.replace(',', '.')) || 0;
                let totalD = pCount * pPricePer;
                details.finish.items.push({
                    name: 'Dostava (Pošta)',
                    cost: totalD,
                    breakdown: pCount > 0 ? `${pCount}x pošta (${formatPrice(pPricePer)}/dost)` : '0.00  '
                });
            }
            if (document.getElementById('f-del-fixed-active').checked) {
                let fPrice = parseFloat(document.getElementById('f-del-fixed-price').value.replace(',', '.')) || 0;
                details.finish.items.push({
                    name: 'Dostava (Fiksno)',
                    cost: fPrice,
                    breakdown: `Fiksna cena dostave`
                });
            }
            if (mType === 'digital-rollup') {
                details.paper.cost = 0;
                details.paper.totalSheets = 0;
                details.paper.sourceSheets = 0;
                details.prep.cost = 0;
                details.finish.cost = 0;
                details.finish.items = [];
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
            if (typeof filterAvailableFormats === 'function') filterAvailableFormats();
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

            if (!sw || !sh || !mw || !mh) return;

            // 1. Daljša stranica je VEDNO spodaj (vodoravno)
            const drawnW = Math.max(sw, sh);
            const drawnH = Math.min(sw, sh);

            // Oznake dimenzij: spodaj je vedno daljša stranica, ob strani krajša
            const bottomLabel = `${drawnW} mm`;
            const sideLabel = `${drawnH} mm`;

            // 2. Izračun izkoristka in razporeditve polo v poli
            const y1 = Math.floor(sw / mw) * Math.floor(sh / mh);
            const y2 = Math.floor(sw / mh) * Math.floor(sh / mw);
            const useRotated = y2 > y1;

            let cols, rows, itemW, itemH;
            if (sw >= sh) {
                cols = useRotated ? Math.floor(sw / mh) : Math.floor(sw / mw);
                rows = useRotated ? Math.floor(sh / mw) : Math.floor(sh / mh);
                itemW = useRotated ? mh : mw;
                itemH = useRotated ? mw : mh;
            } else {
                cols = useRotated ? Math.floor(sh / mw) : Math.floor(sh / mh);
                rows = useRotated ? Math.floor(sw / mh) : Math.floor(sw / mw);
                itemW = useRotated ? mw : mh;
                itemH = useRotated ? mh : mw;
            }

            const maxW = 400;
            const maxH = 250;
            const scale = Math.min(maxW / drawnW, maxH / drawnH);

            canvas.width = drawnW * scale;
            canvas.height = drawnH * scale;

            // Ozadje osnovne pole
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 2;
            ctx.strokeRect(0, 0, canvas.width, canvas.height);

            // Izris tiskovnih pol na osnovni poli
            ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 1;

            const startX = (drawnW - cols * itemW) / 2;
            const startY = (drawnH - rows * itemH) / 2;

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    ctx.fillRect((startX + c * itemW) * scale, (startY + r * itemH) * scale, itemW * scale, itemH * scale);
                    ctx.strokeRect((startX + c * itemW) * scale, (startY + r * itemH) * scale, itemW * scale, itemH * scale);
                }
            }

            // Oznake dimenzij
            ctx.fillStyle = '#94a3b8';
            ctx.font = 'bold 11px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(bottomLabel, canvas.width / 2, canvas.height - 6);

            ctx.save();
            ctx.translate(14, canvas.height / 2);
            ctx.rotate(-Math.PI / 2);
            ctx.textAlign = 'center';
            ctx.fillText(sideLabel, 0, 0);
            ctx.restore();

            // 3. SMER VLAKEN (SMER TEKA PAPIRJA):
            // Pri dimenzijah sw x sh tečejo vlakna v smeri druge dimenzije (sh).
            // Če vpišemo 700x1000 (sw < sh): daljša stranica (1000mm) je vodoravno -> vlakna tečejo VODORAVNO (spodaj)
            // Če vpišemo 1000x700 (sw >= sh): krajša stranica (700mm) je navpično -> vlakna tečejo NAVPIČNO (ob strani)
            const isGrainHorizontal = (sw < sh);

            ctx.save();
            ctx.strokeStyle = '#ef4444';
            ctx.fillStyle = '#ef4444';
            ctx.lineWidth = 2;

            if (isGrainHorizontal) {
                // Vodoravna črta smeri vlaken (spodaj)
                const grainY = canvas.height - 22;
                ctx.setLineDash([8, 4]);
                ctx.beginPath();
                ctx.moveTo(35, grainY);
                ctx.lineTo(canvas.width - 35, grainY);
                ctx.stroke();
                ctx.setLineDash([]);

                // Puščici levo in desno
                ctx.beginPath();
                ctx.moveTo(20, grainY);
                ctx.lineTo(35, grainY - 4);
                ctx.lineTo(35, grainY + 4);
                ctx.fill();

                ctx.beginPath();
                ctx.moveTo(canvas.width - 20, grainY);
                ctx.lineTo(canvas.width - 35, grainY - 4);
                ctx.lineTo(canvas.width - 35, grainY + 4);
                ctx.fill();

                // Oznaka SMER VLAKEN
                ctx.save();
                ctx.font = 'bold 9px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.fillText('SMER VLAKEN', canvas.width / 2, grainY - 3);
                ctx.restore();
            } else {
                // Navpična črta smeri vlaken (desno ob strani)
                const grainX = canvas.width - 18;
                ctx.setLineDash([8, 4]);
                ctx.beginPath();
                ctx.moveTo(grainX, 35);
                ctx.lineTo(grainX, canvas.height - 35);
                ctx.stroke();
                ctx.setLineDash([]);

                // Puščici zgoraj in spodaj
                ctx.beginPath();
                ctx.moveTo(grainX, 20);
                ctx.lineTo(grainX - 4, 35);
                ctx.lineTo(grainX + 4, 35);
                ctx.fill();

                ctx.beginPath();
                ctx.moveTo(grainX, canvas.height - 20);
                ctx.lineTo(grainX - 4, canvas.height - 35);
                ctx.lineTo(grainX + 4, canvas.height - 35);
                ctx.fill();

                // Oznaka SMER VLAKEN
                ctx.save();
                ctx.translate(grainX - 5, canvas.height / 2);
                ctx.rotate(-Math.PI / 2);
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.font = 'bold 9px Inter, sans-serif';
                ctx.fillText('SMER VLAKEN', 0, 0);
                ctx.restore();
            }

            ctx.restore();
        }


        function drawMachineCanvas(sheetW, sheetH, layout, gripper, origW, origH, bleed, isOverride = false, currentCount = 0) {
            // Če je prijemalec na 'W' robu (levo), vizualno zarotiramo polo za 90 stopinj, da bo prijemalec vedno v nogi.
            let _layout = { ...layout };
            if (_layout.gripEdge === 'W') {
                let tempW = sheetW;
                sheetW = sheetH;
                sheetH = tempW;
                _layout.gripEdge = 'H';
                _layout.cols = layout.rows;
                _layout.rows = layout.cols;
                _layout.itemW = layout.itemH;
                _layout.itemH = layout.itemW;
                _layout.rot = !layout.rot;
            }
            layout = _layout;

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
            const isObratChecked = (document.getElementById('calc-is-obrat')?.checked || document.getElementById('calc-is-sv')?.checked) || false;
            let foundPerfect = false;
            if (!layout.isMixed) {
                let bestPerfectDiff = 999999;
                for (let tempC = 1; tempC <= layout.cols; tempC++) {
                    if (targetCount % tempC === 0) {
                        let tempR = targetCount / tempC;
                        if (tempR <= layout.rows) {
                            let diff = Math.abs(tempC - tempR);
                            if (isObratChecked && tempC % 2 !== 0 && tempR % 2 !== 0) diff += 1000;
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
                                if (bestC % 2 !== 0 && bestR % 2 !== 0) currentBestDiff += 1000;
                                if (tempC % 2 !== 0 && tempR % 2 !== 0) diff += 1000;
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
            function drawOneItem(ctx, x, y, iw, ih, singleInnerW, singleInnerH, b, sc, sideType = '') {
                let bg = (typeof blockGap !== 'undefined') ? blockGap : ((typeof getFloatValue === 'function' && document.getElementById('block-gap')) ? getFloatValue('block-gap') : 0);
                let actW = iw - bg;
                let actH = ih - bg;

                let rectFill = 'rgba(96, 165, 250, 0.3)';
                let rectStroke = '#3b82f6';
                if (sideType === 'A') {
                    rectFill = 'rgba(37, 99, 235, 0.20)';
                    rectStroke = '#2563eb';
                } else if (sideType === 'B') {
                    rectFill = 'rgba(234, 88, 12, 0.20)';
                    rectStroke = '#ea580c';
                }

                ctx.fillStyle = rectFill;
                ctx.strokeStyle = rectStroke;
                ctx.lineWidth = 1;
                ctx.fillRect(x, y, actW * sc, actH * sc);
                ctx.strokeRect(x, y, actW * sc, actH * sc);

                let gCols = document.getElementById('group-cols') ? parseInt(document.getElementById('group-cols').value) || 1 : 1;
                let gRows = document.getElementById('group-rows') ? parseInt(document.getElementById('group-rows').value) || 1 : 1;

                // Determine if the block is rotated
                let isRotated = false;
                const getItemW = (typeof getFloatValue === 'function') ? getFloatValue('width') : (document.getElementById('width') ? parseFloat(document.getElementById('width').value) || 0 : 0);
                const expectedBlockW = (getItemW + 2 * b) * gCols + bg;
                if (Math.abs(iw - expectedBlockW) > 0.5 && Math.abs(ih - expectedBlockW) < 0.5) {
                    isRotated = true;
                }

                let drawCols = isRotated ? gRows : gCols;
                let drawRows = isRotated ? gCols : gRows;

                let stepX = (actW * sc) / drawCols;
                let stepY = (actH * sc) / drawRows;

                if (drawCols > 1 || drawRows > 1) {
                    ctx.save();
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
                    ctx.setLineDash([2, 2]);
                    ctx.beginPath();
                    for (let c = 1; c < drawCols; c++) {
                        ctx.moveTo(x + c * stepX, y);
                        ctx.lineTo(x + c * stepX, y + actH * sc);
                    }
                    for (let r = 1; r < drawRows; r++) {
                        ctx.moveTo(x, y + r * stepY);
                        ctx.lineTo(x + actW * sc, y + r * stepY);
                    }
                    ctx.stroke();
                    ctx.restore();
                }

                // Inner safe area for the ENTIRE block
                let blockInnerW = actW - 2 * b;
                let blockInnerH = actH - 2 * b;
                ctx.setLineDash([2, 3]);
                ctx.strokeStyle = '#1e3a8a';
                ctx.strokeRect(x + (b * sc), y + (b * sc), blockInnerW * sc, blockInnerH * sc);
                ctx.setLineDash([]);

                // Oznaka dimenzije za VSAKO zloženko / element v bloku posebej
                ctx.fillStyle = (sideType === 'B') ? '#c2410c' : '#1e3a8a';
                ctx.font = 'bold 11px Arial, sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const dimLabel = `${Math.round(singleInnerW)}x${Math.round(singleInnerH)}`;

                if (stepX > 20 && stepY > 10) {
                    for (let r = 0; r < drawRows; r++) {
                        for (let c = 0; c < drawCols; c++) {
                            const cellCenterX = x + c * stepX + stepX / 2;
                            const cellCenterY = y + r * stepY + stepY / 2;

                            if (sideType === 'A' || sideType === 'B') {
                                ctx.save();
                                const isSideA = (sideType === 'A');
                                const badgeColor = isSideA ? '#2563eb' : '#ea580c';
                                const badgeText = (stepX >= 48 && stepY >= 36) ? (isSideA ? 'STRAN A' : 'STRAN B') : (isSideA ? 'A' : 'B');
                                ctx.font = 'bold 10px Inter, sans-serif';
                                const tw = ctx.measureText(badgeText).width;
                                const bw = tw + 8;
                                const bh = 15;
                                const bx = cellCenterX - bw / 2;
                                const by = cellCenterY - 11;

                                ctx.fillStyle = badgeColor;
                                ctx.beginPath();
                                if (ctx.roundRect) ctx.roundRect(bx, by, bw, bh, 3); else ctx.rect(bx, by, bw, bh);
                                ctx.fill();

                                ctx.fillStyle = '#ffffff';
                                ctx.fillText(badgeText, cellCenterX, by + bh / 2 + 0.5);
                                ctx.restore();

                                ctx.fillStyle = isSideA ? '#1d4ed8' : '#c2410c';
                                ctx.font = 'bold 10px Arial, sans-serif';
                                ctx.fillText(dimLabel, cellCenterX, cellCenterY + 9);
                            } else {
                                ctx.fillText(dimLabel, cellCenterX, cellCenterY);
                            }
                        }
                    }
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
            // Informacije o razrezu za personalizacijo (za ustrezen razmik stavkov po sektorjih)
            const isPersActive = document.getElementById('f-personalization-active') ? document.getElementById('f-personalization-active').checked : false;
            const currentMType = document.getElementById('calc-machine-type') ? document.getElementById('calc-machine-type').value : '';
            let itemsCount = layout ? layout.count : 1;
            let splitInfo = getPersonalizationSplitInfo(sheetW, sheetH, itemsCount, currentMType);
            let digCutFactor = splitInfo.digCutFactor;
            let isPersSplit = isPersActive && splitInfo.isLargeSheet && digCutFactor > 1 && !layout.isMixed && !isObratChecked;
            let layoutCutAxis = 'W';
            if (digCutFactor === 2 || digCutFactor === 3) {
                if (usedCols % digCutFactor === 0 && usedRows % digCutFactor !== 0) {
                    layoutCutAxis = 'W';
                } else if (usedRows % digCutFactor === 0 && usedCols % digCutFactor !== 0) {
                    layoutCutAxis = 'H';
                } else if (usedCols >= digCutFactor && usedRows < digCutFactor) {
                    layoutCutAxis = 'W';
                } else if (usedRows >= digCutFactor && usedCols < digCutFactor) {
                    layoutCutAxis = 'H';
                } else {
                    layoutCutAxis = splitInfo.cutAxis || (sheetW >= sheetH ? 'W' : 'H');
                }
            }

            slotsToDraw.forEach(slot => {
                let x, y;
                if (isPersSplit) {
                    if (digCutFactor === 4) {
                        let secW = sheetW / 2;
                        let secH = sheetH / 2;
                        let colsPerSec = Math.max(1, Math.round(usedCols / 2));
                        let rowsPerSec = Math.max(1, Math.round(usedRows / 2));
                        let marginSecX = Math.max(0, (secW - colsPerSec * layout.itemW) / 2);
                        let secXIdx = Math.min(1, Math.floor(slot.c / colsPerSec));
                        let cInSec = slot.c - secXIdx * colsPerSec;
                        let itemX = secXIdx * secW + marginSecX + cInSec * layout.itemW;

                        let secYIdx = Math.min(1, Math.floor(slot.r / rowsPerSec));
                        let rInSec = slot.r - secYIdx * rowsPerSec;
                        let effSecH = (secYIdx === 1 && layout.gripEdge === 'H') ? Math.max(rowsPerSec * layout.itemH, secH - gripper) : secH;
                        let marginSecY = Math.max(0, (effSecH - (rowsPerSec * layout.itemH)) / 2);
                        let itemY = secYIdx * secH + marginSecY + rInSec * layout.itemH;

                        x = itemX * scale;
                        y = itemY * scale;
                    } else if (layoutCutAxis === 'W') {
                        let numSec = digCutFactor; // 2 ali 3
                        let secW = sheetW / numSec;
                        let colsPerSec = Math.max(1, Math.round(usedCols / numSec));
                        let secContentW = colsPerSec * layout.itemW;
                        let marginSecX = Math.max(0, (secW - secContentW) / 2);
                        let secIdx = Math.min(numSec - 1, Math.floor(slot.c / colsPerSec));
                        let cInSec = slot.c - secIdx * colsPerSec;
                        let itemX = secIdx * secW + marginSecX + cInSec * layout.itemW;
                        let itemY = startY + slot.r * layout.itemH;

                        x = itemX * scale;
                        y = itemY * scale;
                    } else { // layoutCutAxis === 'H'
                        let numSec = digCutFactor; // 2 ali 3
                        let secH = sheetH / numSec;
                        let rowsPerSec = Math.max(1, Math.round(usedRows / numSec));
                        let secContentH = rowsPerSec * layout.itemH;
                        let marginSecY = Math.max(0, (secH - secContentH) / 2);
                        let secIdx = Math.min(numSec - 1, Math.floor(slot.r / rowsPerSec));
                        let rInSec = slot.r - secIdx * rowsPerSec;
                        let itemY = secIdx * secH + marginSecY + rInSec * layout.itemH;
                        let itemX = startX + slot.c * layout.itemW;

                        x = itemX * scale;
                        y = itemY * scale;
                    }
                } else {
                    x = (startX + slot.c * layout.itemW) * scale;
                    y = (startY + slot.r * layout.itemH) * scale;
                }
                const innerW = (layout.rot ? origH : origW);
                const innerH = (layout.rot ? origW : origH);
                let sideType = '';
                if (isObratChecked) {
                    if (usedCols % 2 === 0) {
                        sideType = (slot.c < usedCols / 2) ? 'A' : 'B';
                    } else if (usedRows % 2 === 0) {
                        sideType = (slot.r < usedRows / 2) ? 'A' : 'B';
                    }
                }
                drawOneItem(ctx, x, y, layout.itemW, layout.itemH, innerW, innerH, bleed, scale, sideType);
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

            // Nariši rezalno os / os obračanja (če je obračanje aktivno)
            if (isObratChecked && itemsToDraw >= 2) {
                ctx.save();
                if (usedCols % 2 === 0) {
                    const cutX = (startX + (usedCols / 2) * layout.itemW) * scale;

                    // Bela senca za kontrast
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
                    ctx.lineWidth = 6;
                    ctx.beginPath();
                    ctx.moveTo(cutX, 0);
                    ctx.lineTo(cutX, canvas.height);
                    ctx.stroke();

                    // Rdeča črtkana črta
                    ctx.strokeStyle = '#dc2626';
                    ctx.lineWidth = 2.5;
                    ctx.setLineDash([8, 4]);
                    ctx.beginPath();
                    ctx.moveTo(cutX, 0);
                    ctx.lineTo(cutX, canvas.height);
                    ctx.stroke();
                    ctx.setLineDash([]);

                    // Značka osi
                    const isSVChecked = document.getElementById('calc-is-sv')?.checked || false;
                    const badgeText = isSVChecked ? '✂ OS ŠV (STRAN A | STRAN B)' : '✂ OS OBRAČANJA (STRAN A | STRAN B)';
                    ctx.font = 'bold 10px Inter, sans-serif';
                    const tw = ctx.measureText(badgeText).width;
                    const bw = tw + 16;
                    const bh = 22;
                    const bx = cutX - bw / 2;
                    const by = Math.max(10, (canvas.height - bh) / 2);

                    ctx.fillStyle = '#dc2626';
                    ctx.shadowColor = 'rgba(0,0,0,0.3)';
                    ctx.shadowBlur = 5;
                    ctx.beginPath();
                    if (ctx.roundRect) ctx.roundRect(bx, by, bw, bh, 5); else ctx.rect(bx, by, bw, bh);
                    ctx.fill();
                    ctx.shadowBlur = 0;

                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(badgeText, cutX, by + bh / 2 + 0.5);
                } else if (usedRows % 2 === 0) {
                    const cutY = (startY + (usedRows / 2) * layout.itemH) * scale;

                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
                    ctx.lineWidth = 6;
                    ctx.beginPath();
                    ctx.moveTo(0, cutY);
                    ctx.lineTo(canvas.width, cutY);
                    ctx.stroke();

                    ctx.strokeStyle = '#dc2626';
                    ctx.lineWidth = 2.5;
                    ctx.setLineDash([8, 4]);
                    ctx.beginPath();
                    ctx.moveTo(0, cutY);
                    ctx.lineTo(canvas.width, cutY);
                    ctx.stroke();
                    ctx.setLineDash([]);

                    const isSVChecked = document.getElementById('calc-is-sv')?.checked || false;
                    const badgeText = isSVChecked ? '✂ OS ŠV (STRAN A | STRAN B)' : '✂ OS OBRAČANJA (STRAN A | STRAN B)';
                    ctx.font = 'bold 10px Inter, sans-serif';
                    const tw = ctx.measureText(badgeText).width;
                    const bw = tw + 16;
                    const bh = 22;
                    const bx = (canvas.width - bw) / 2;
                    const by = cutY - bh / 2;

                    ctx.fillStyle = '#dc2626';
                    ctx.shadowColor = 'rgba(0,0,0,0.3)';
                    ctx.shadowBlur = 5;
                    ctx.beginPath();
                    if (ctx.roundRect) ctx.roundRect(bx, by, bw, bh, 5); else ctx.rect(bx, by, bw, bh);
                    ctx.fill();
                    ctx.shadowBlur = 0;

                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(badgeText, canvas.width / 2, cutY + 0.5);
                }
                ctx.restore();
            }

            // Nariši linije razreza za personalizacijo (če je vklopljena personalizacija)
            if (isPersActive && splitInfo.isLargeSheet && digCutFactor > 1) {
                ctx.save();
                let fitsDigital = splitInfo.fitsDigital;
                let limitWarn = fitsDigital ? '' : ' ⚠️ PRESEGA DIGITAL';
                let actionTitle = splitInfo.isTrimmed ? 'RAZREZ IN OBREZ' : 'RAZREZ';
                let badgeText = `✂ ${actionTitle} ZA PERSONALIZACIJO (${digCutFactor}x ${splitInfo.partStr})${limitWarn}`;

                if (digCutFactor === 4) {
                    const cutX = (sheetW * 0.5) * scale;
                    const cutY = (sheetH * 0.5) * scale;

                    // Vertikalni rez po sredini
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
                    ctx.lineWidth = 6;
                    ctx.beginPath();
                    ctx.moveTo(cutX, 0);
                    ctx.lineTo(cutX, canvas.height);
                    ctx.stroke();

                    ctx.strokeStyle = '#dc2626';
                    ctx.lineWidth = 2.5;
                    ctx.setLineDash([8, 4]);
                    ctx.beginPath();
                    ctx.moveTo(cutX, 0);
                    ctx.lineTo(cutX, canvas.height);
                    ctx.stroke();
                    ctx.setLineDash([]);

                    // Horizontalni rez po sredini
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
                    ctx.lineWidth = 6;
                    ctx.beginPath();
                    ctx.moveTo(0, cutY);
                    ctx.lineTo(canvas.width, cutY);
                    ctx.stroke();

                    ctx.strokeStyle = '#dc2626';
                    ctx.lineWidth = 2.5;
                    ctx.setLineDash([8, 4]);
                    ctx.beginPath();
                    ctx.moveTo(0, cutY);
                    ctx.lineTo(canvas.width, cutY);
                    ctx.stroke();
                    ctx.setLineDash([]);

                    // Značka na sredini
                    ctx.font = 'bold 11px Inter, sans-serif';
                    const textMetrics = ctx.measureText(badgeText);
                    const bw = textMetrics.width + 20;
                    const bh = 24;
                    const bx = cutX - bw / 2;
                    const by = cutY - bh / 2;

                    ctx.fillStyle = fitsDigital ? '#dc2626' : '#b91c1c';
                    ctx.shadowColor = 'rgba(0,0,0,0.4)';
                    ctx.shadowBlur = 6;
                    ctx.beginPath();
                    if (ctx.roundRect) ctx.roundRect(bx, by, bw, bh, 6); else ctx.rect(bx, by, bw, bh);
                    ctx.fill();
                    ctx.shadowBlur = 0;

                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(badgeText, cutX, cutY + 1);
                } else {
                    let cutPositions = [];
                    if (digCutFactor === 2) {
                        cutPositions = [0.5];
                    } else if (digCutFactor === 3) {
                        cutPositions = [1 / 3, 2 / 3];
                    }

                    if (layoutCutAxis === 'W') {
                    // Vertikalni rezi
                    cutPositions.forEach(ratio => {
                        const cutX = (sheetW * ratio) * scale;
                        ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
                        ctx.lineWidth = 6;
                        ctx.beginPath();
                        ctx.moveTo(cutX, 0);
                        ctx.lineTo(cutX, canvas.height);
                        ctx.stroke();

                        ctx.strokeStyle = '#dc2626';
                        ctx.lineWidth = 2.5;
                        ctx.setLineDash([8, 4]);
                        ctx.beginPath();
                        ctx.moveTo(cutX, 0);
                        ctx.lineTo(cutX, canvas.height);
                        ctx.stroke();
                        ctx.setLineDash([]);
                    });

                    const badgeCutRatio = (cutPositions.length > 0) ? cutPositions[0] : 0.5;
                    const badgeX = (sheetW * badgeCutRatio) * scale;
                    ctx.font = 'bold 11px Inter, sans-serif';
                    const textMetrics = ctx.measureText(badgeText);
                    const bw = textMetrics.width + 20;
                    const bh = 24;
                    const bx = badgeX - bw / 2;
                    const by = (canvas.height - bh) / 2;

                    ctx.fillStyle = fitsDigital ? '#dc2626' : '#b91c1c';
                    ctx.shadowColor = 'rgba(0,0,0,0.4)';
                    ctx.shadowBlur = 6;
                    ctx.beginPath();
                    if (ctx.roundRect) ctx.roundRect(bx, by, bw, bh, 6); else ctx.rect(bx, by, bw, bh);
                    ctx.fill();
                    ctx.shadowBlur = 0;

                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(badgeText, badgeX, by + bh / 2 + 1);
                } else {
                    // Horizontalni rezi
                    cutPositions.forEach(ratio => {
                        const cutY = (sheetH * ratio) * scale;
                        ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
                        ctx.lineWidth = 6;
                        ctx.beginPath();
                        ctx.moveTo(0, cutY);
                        ctx.lineTo(canvas.width, cutY);
                        ctx.stroke();

                        ctx.strokeStyle = '#dc2626';
                        ctx.lineWidth = 2.5;
                        ctx.setLineDash([8, 4]);
                        ctx.beginPath();
                        ctx.moveTo(0, cutY);
                        ctx.lineTo(canvas.width, cutY);
                        ctx.stroke();
                        ctx.setLineDash([]);
                    });

                    const badgeCutRatioY = (cutPositions.length > 0) ? cutPositions[0] : 0.5;
                    const badgeY = (sheetH * badgeCutRatioY) * scale;
                    ctx.font = 'bold 11px Inter, sans-serif';
                    const textMetrics = ctx.measureText(badgeText);
                    const bw = textMetrics.width + 20;
                    const bh = 24;
                    const bx = (canvas.width - bw) / 2;
                    const by = badgeY - bh / 2;

                    ctx.fillStyle = fitsDigital ? '#dc2626' : '#b91c1c';
                    ctx.shadowColor = 'rgba(0,0,0,0.4)';
                    ctx.shadowBlur = 6;
                    ctx.beginPath();
                    if (ctx.roundRect) ctx.roundRect(bx, by, bw, bh, 6); else ctx.rect(bx, by, bw, bh);
                    ctx.fill();
                    ctx.shadowBlur = 0;

                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(badgeText, canvas.width / 2, badgeY + 1);
                }
                }
                ctx.restore();
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
            var currentEmail = (document.getElementById('calc-cust-email') || {}).value || '';
            var custName = (document.getElementById('calc-customer') || {}).value || '';
            var custKey = custName.trim().toLowerCase();

            if (!datalist || datalist.options.length === 0) {
                listDiv.innerHTML = '<div style="padding: 10px; color: #94a3b8; font-size: 0.8rem;">Ni shranjenih e-mailov za to stranko.</div>';
                return;
            }

            var headerDiv = document.createElement('div');
            headerDiv.style.padding = "6px 12px";
            headerDiv.style.fontSize = "0.75rem";
            headerDiv.style.fontWeight = "bold";
            headerDiv.style.color = "#93c5fd";
            headerDiv.style.background = "rgba(59, 130, 246, 0.15)";
            headerDiv.style.borderBottom = "1px solid #3b82f6";
            headerDiv.innerText = "Shranjeni e-maili (" + datalist.options.length + "):";
            listDiv.appendChild(headerDiv);

            for (var i = 0; i < datalist.options.length; i++) {
                var em = datalist.options[i].value;
                var item = document.createElement('div');
                item.style.padding = "8px 12px";
                item.style.cursor = "pointer";
                item.style.borderBottom = "1px solid #334155";
                item.style.fontSize = "0.88rem";
                item.style.display = "flex";
                item.style.justifyContent = "space-between";
                item.style.alignItems = "center";
                item.style.transition = "background 0.15s";

                var isSelected = (em.toLowerCase() === currentEmail.trim().toLowerCase());
                if (isSelected) {
                    item.style.background = "rgba(16, 185, 129, 0.15)";
                }

                var emSpan = document.createElement('span');
                emSpan.style.flex = "1";
                emSpan.style.overflow = "hidden";
                emSpan.style.textOverflow = "ellipsis";
                emSpan.style.whiteSpace = "nowrap";
                emSpan.innerHTML = (isSelected ? '✓ <strong style="color: #34d399;">' : '') + em + (isSelected ? '</strong>' : '');
                item.appendChild(emSpan);

                // Gumb za izbris posameznega e-maila
                var delBtn = document.createElement('span');
                delBtn.innerHTML = '&#10006;';
                delBtn.style.color = '#ef4444';
                delBtn.style.fontSize = '0.8rem';
                delBtn.style.padding = '2px 6px';
                delBtn.style.marginLeft = '8px';
                delBtn.style.borderRadius = '4px';
                delBtn.title = 'Odstrani ta e-mail iz seznama stranke';
                delBtn.onclick = (function (emailToDelete) {
                    return function (e) {
                        e.stopPropagation();
                        if (confirm('Ali res želite odstraniti e-mail "' + emailToDelete + '" za stranko "' + custName + '"?')) {
                            removeCustomerEmail(custKey, emailToDelete);
                        }
                    };
                })(em);
                delBtn.onmouseover = function () { this.style.background = '#ef4444'; this.style.color = '#ffffff'; };
                delBtn.onmouseout = function () { this.style.background = 'transparent'; this.style.color = '#ef4444'; };
                item.appendChild(delBtn);

                item.onclick = (function (emailVal) {
                    return function () {
                        var emailInput = document.getElementById('calc-cust-email');
                        if (emailInput) {
                            emailInput.value = emailVal;
                            if (typeof updateInputStyles === 'function') updateInputStyles(emailInput);
                        }
                        document.getElementById('email-dropdown-list').style.display = 'none';
                        if (typeof saveCurrentCustomerContact === 'function') saveCurrentCustomerContact();
                    };
                })(em);

                item.onmouseover = function () { if (!this.dataset.selected) this.style.background = "#334155"; };
                item.onmouseout = function () { this.style.background = this.dataset.selected ? "rgba(16, 185, 129, 0.15)" : "transparent"; };
                if (isSelected) item.dataset.selected = "true";

                listDiv.appendChild(item);
            }
        }

        function removeCustomerEmail(custKey, emailToDelete) {
            try {
                var contactsCache = JSON.parse(localStorage.getItem('petric_customer_contacts_cache') || '{}');
                for (var k in contactsCache) {
                    if (k === custKey || k === custKey.replace(/\s+/g, '') || (custKey.length > 4 && k.indexOf(custKey) === 0)) {
                        var contact = contactsCache[k];
                        if (contact && Array.isArray(contact.emails)) {
                            var idx = contact.emails.findIndex(function(e) { return e.toLowerCase() === emailToDelete.toLowerCase(); });
                            if (idx > -1) contact.emails.splice(idx, 1);
                        }
                        if (contact && contact.email && contact.email.toLowerCase() === emailToDelete.toLowerCase()) {
                            contact.email = (contact.emails && contact.emails.length > 0) ? contact.emails[contact.emails.length - 1] : "";
                        }
                    }
                }
                localStorage.setItem('petric_customer_contacts_cache', JSON.stringify(contactsCache));
                var custName = (document.getElementById('calc-customer') || {}).value || '';
                handleCustomerUpdate(custName);
                renderEmailList();
            } catch (e) { console.error("removeCustomerEmail napaka:", e); }
        }

        function seedCustomerContactsIfEmpty() {
            try {
                var existing = JSON.parse(localStorage.getItem('petric_customer_contacts_cache') || '{}');
                if (window.PETRIC_CONTACTS_SEED) {
                    var updated = false;
                    for (var k in window.PETRIC_CONTACTS_SEED) {
                        var sItem = window.PETRIC_CONTACTS_SEED[k];
                        if (!existing[k]) {
                            existing[k] = JSON.parse(JSON.stringify(sItem));
                            updated = true;
                        } else {
                            if (!Array.isArray(existing[k].emails)) {
                                existing[k].emails = existing[k].email ? [existing[k].email] : [];
                            }
                            if (sItem.emails && Array.isArray(sItem.emails)) {
                                for (var si = 0; si < sItem.emails.length; si++) {
                                    var sem = sItem.emails[si];
                                    if (existing[k].emails.indexOf(sem) === -1) {
                                        existing[k].emails.push(sem);
                                        updated = true;
                                    }
                                }
                            }
                            if (!existing[k].email && sItem.email) {
                                existing[k].email = sItem.email;
                                updated = true;
                            }
                            if (!existing[k].address && sItem.address) {
                                existing[k].address = sItem.address;
                                updated = true;
                            }
                            // Šifra stranke naj ostane prazna po navodilu uporabnika
                        }
                    }
                    if (updated) {
                        localStorage.setItem('petric_customer_contacts_cache', JSON.stringify(existing));
                    }
                    var custCache = JSON.parse(localStorage.getItem('petric_customers_cache') || '[]');
                    var custCacheUpdated = false;
                    for (var ck in window.PETRIC_CONTACTS_SEED) {
                        var cname = window.PETRIC_CONTACTS_SEED[ck].name;
                        if (cname && custCache.indexOf(cname) === -1) {
                            custCache.push(cname);
                            custCacheUpdated = true;
                        }
                    }
                    if (custCacheUpdated) {
                        localStorage.setItem('petric_customers_cache', JSON.stringify(custCache));
                    }
                }
            } catch (e) { console.error("seedCustomerContactsIfEmpty napaka:", e); }
        }
                function toggleCustomerDropdown() {
            try {
                var list = document.getElementById('cust-dropdown-list');
                if (!list) return;
                if (list.style.display === 'block') {
                    list.style.display = 'none';
                } else {
                    renderCustomerList('');
                    list.style.display = 'block';
                }
            } catch (e) {
                var safeLog = (typeof logDebug === 'function') ? logDebug : console.error;
                safeLog("Napaka v toggleCustomerDropdown: " + e.message);
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
                'tisk_kalkulator_arhiv',
                'petric_kalkulacija_arhiv',
                'petric_pola_arhiv',
                'darko_blok_arhiv',
                'petric_tenovis_arhiv',
                'kuverte_kalkulator_arhiv',
                'kuverte_arhiv',
                'darko_brosura_arhiv',
                'brosura_kalkulator_arhiv',
                'etikete_kalkulator_arhiv',
                'koledar_kalkulator_arhiv',
                'darko_kalkulacije_arhiv'
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

                function renderCustomerList(filterText) {
            try {
                var cInput = document.getElementById('calc-customer');
                if (filterText === undefined || filterText === null) {
                    filterText = (cInput && cInput.value) ? cInput.value.trim() : "";
                }
                var customers = typeof getUnifiedCustomersList === 'function' ? getUnifiedCustomersList() : [];

                var listDiv = document.getElementById('cust-dropdown-list');
                if (!listDiv) return;
                listDiv.innerHTML = "";

                var q = (typeof filterText === 'string') ? filterText.trim().toLowerCase() : "";
                var displayList = [];

                if (q.length > 0) {
                    var starts = [];
                    var contains = [];
                    for (var k = 0; k < customers.length; k++) {
                        var c = customers[k];
                        var cLower = c.toLowerCase();
                        if (cLower.indexOf(q) === 0) {
                            starts.push(c);
                        } else if (cLower.indexOf(q) > 0) {
                            contains.push(c);
                        }
                    }
                    starts.sort(function (a, b) { return a.localeCompare(b, 'sl'); });
                    contains.sort(function (a, b) { return a.localeCompare(b, 'sl'); });
                    displayList = starts.concat(contains);
                } else {
                    displayList = customers.slice();
                    displayList.sort(function (a, b) { return a.localeCompare(b, 'sl'); });
                }

                if (displayList.length === 0) {
                    var cleanQ = q.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
                    var msg = q.length > 0 ? ('Ni najdenih strank za "' + cleanQ + '".') : 'Arhiv strank je prazen.';
                    listDiv.innerHTML = '<div style="padding: 10px; color: #94a3b8; font-size: 0.85rem;">' + msg + '</div>';
                    return;
                }

                for (var j = 0; j < displayList.length; j++) {
                    var item = document.createElement('div');
                    item.className = 'cust-dropdown-item';
                    item.dataset.index = j;
                    item.dataset.custName = displayList[j];
                    item.style.padding = "8px 12px";
                    item.style.cursor = "pointer";
                    item.style.borderBottom = "1px solid #334155";
                    item.style.fontSize = "0.9rem";
                    item.style.display = "flex";
                    item.style.justifyContent = "space-between";
                    item.style.alignItems = "center";
                    item.style.transition = "background-color 0.1s ease";

                    var nameSpan = document.createElement('span');
                    nameSpan.innerText = displayList[j];
                    nameSpan.style.flex = "1";
                    item.appendChild(nameSpan);

                    var delBtn = document.createElement('span');
                    delBtn.innerHTML = '&#10006;'; // X icon
                    delBtn.style.color = '#ef4444';
                    delBtn.style.fontSize = '0.8rem';
                    delBtn.style.padding = '2px 8px';
                    delBtn.style.borderRadius = '4px';
                    delBtn.style.cursor = 'pointer';
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
                                if (typeof updateCustomerDatalist === 'function') updateCustomerDatalist();
                                var curInput = document.getElementById('calc-customer');
                                var curVal = curInput ? curInput.value : '';
                                renderCustomerList(curVal);
                            }
                        };
                    })(displayList[j]);
                    delBtn.onmouseover = function () { this.style.background = '#fecaca'; };
                    delBtn.onmouseout = function () { this.style.background = 'transparent'; };
                    item.appendChild(delBtn);

                    item.onclick = (function (name) {
                        return function () {
                            var curInput = document.getElementById('calc-customer');
                            if (curInput) curInput.value = name;
                            var dList = document.getElementById('cust-dropdown-list');
                            if (dList) dList.style.display = 'none';
                            if (typeof handleCustomerUpdate === 'function') handleCustomerUpdate(name);
                        };
                    })(displayList[j]);
                    item.onmouseover = function () {
                        var allItems = listDiv.querySelectorAll('.cust-dropdown-item');
                        allItems.forEach(function (el) { el.classList.remove('active-item'); el.style.background = 'transparent'; });
                        this.classList.add('active-item');
                        this.style.background = "#334155";
                    };
                    item.onmouseout = function () {
                        this.classList.remove('active-item');
                        this.style.background = "transparent";
                    };
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

                // 1. Zbiranje iz lokalnih arhivov vseh kalkulatorjev
                for (var i = 0; i < arhiv.length; i++) {
                    var p = arhiv[i];
                    if (p && p.customer && p.customer.trim().toLowerCase() === search) {
                        // 1. Zbiranje e-mailov
                        if (p.custEmail && p.custEmail.trim() !== "") {
                            var emParts = p.custEmail.split(/[;,]+/).map(function(s) { return s.trim(); }).filter(Boolean);
                            for (var ei = 0; ei < emParts.length; ei++) {
                                uniqueEmails.add(emParts[ei]);
                                lastEmail = emParts[ei];
                            }
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

                // 2. Zbiranje iz cache-a kontaktnih podatkov z diska in baze
                try {
                    var contactsCache = JSON.parse(localStorage.getItem('petric_customer_contacts_cache') || '{}');
                    for (var cKey in contactsCache) {
                        if (cKey === search || cKey === search.replace(/\s+/g, '') || (search.length > 4 && cKey.indexOf(search) === 0)) {
                            var diskContact = contactsCache[cKey];
                            if (diskContact) {
                                if (Array.isArray(diskContact.emails)) {
                                    for (var di = 0; di < diskContact.emails.length; di++) {
                                        var dem = diskContact.emails[di];
                                        if (dem && dem.trim()) {
                                            uniqueEmails.add(dem.trim());
                                            lastEmail = dem.trim();
                                        }
                                    }
                                }
                                if (diskContact.email && diskContact.email.trim() !== "") {
                                    var dParts = diskContact.email.split(/[;,]+/).map(function(s) { return s.trim(); }).filter(Boolean);
                                    for (var dpi = 0; dpi < dParts.length; dpi++) {
                                        uniqueEmails.add(dParts[dpi]);
                                        lastEmail = dParts[dpi];
                                    }
                                }
                                if (diskContact.address && diskContact.address.trim() !== "") {
                                    var da = diskContact.address.trim();
                                    uniqueAddresses.add(da);
                                    lastAddress = da;
                                }
                                // Šifra stranke ostane prazna po navodilu uporabnika
                            }
                        }
                    }
                } catch (e) { }

                var emailTarget = document.getElementById('calc-cust-email');
                var emailDatalist = document.getElementById('email-list');
                if (emailDatalist) {
                    emailDatalist.innerHTML = "";
                    var emailsArray = Array.from(uniqueEmails);
                    emailsArray.forEach(function (em) {
                        var opt = document.createElement('option');
                        opt.value = em;
                        emailDatalist.appendChild(opt);
                    });
                }

                // Posodobitev indikatorja na gumbu za spustni seznam
                var emailBtn = document.querySelector('button[onclick="toggleEmailDropdown()"]');
                if (emailBtn) {
                    if (uniqueEmails.size > 1) {
                        emailBtn.title = "Izbira med " + uniqueEmails.size + " shranjenimi e-maili za " + val;
                        emailBtn.style.background = "#2563eb";
                    } else {
                        emailBtn.title = "Prikaži shranjene e-maile";
                        emailBtn.style.background = "#3b82f6";
                    }
                }

                // Preveri, ali se je stranka dejansko spremenila (da ne prepisujemo ročnih popravkov ob blur/ponovnem kliku)
                var lastCustomer = custInput ? (custInput.dataset.lastCustomer || "") : "";
                var hasChanged = (val.trim().toLowerCase() !== lastCustomer.toLowerCase());

                if (hasChanged) {
                    if (custInput) custInput.dataset.lastCustomer = val.trim();

                    // Izpolni email z zadnjim e-mailom (v dropdownu so na voljo vsi)
                    if (emailTarget) {
                        emailTarget.value = lastEmail;
                        if (typeof updateInputStyles === 'function') updateInputStyles(emailTarget);
                    }

                    // Izpolni ali počisti naslov
                    var addressTarget = document.getElementById('calc-cust-address');
                    if (addressTarget) {
                        addressTarget.value = lastAddress;
                        if (typeof updateInputStyles === 'function') updateInputStyles(addressTarget);
                    }

                    // Šifra stranke ostane prazna po navodilu uporabnika
                    var codeTarget = document.getElementById('calc-customer-code');
                    if (codeTarget) {
                        codeTarget.value = "";
                        if (typeof updateInputStyles === 'function') updateInputStyles(codeTarget);
                    }
                }
            } catch (e) {
                var safeLog = (typeof logDebug === 'function') ? logDebug : console.error;
                safeLog("Napaka v handleCustomerUpdate: " + e.message);
            }
        }

        function saveCurrentCustomerContact() {
            try {
                var custEl = document.getElementById('calc-customer');
                var emailEl = document.getElementById('calc-cust-email');
                var addrEl = document.getElementById('calc-cust-address');
                var codeEl = document.getElementById('calc-customer-code');

                if (!custEl) return;
                var custName = custEl.value ? custEl.value.trim() : "";
                if (!custName) return;

                var custKey = custName.toLowerCase();
                var contactsCache = JSON.parse(localStorage.getItem('petric_customer_contacts_cache') || '{}');
                var custCache = JSON.parse(localStorage.getItem('petric_customers_cache') || '[]');

                if (custCache.indexOf(custName) === -1) {
                    custCache.push(custName);
                    localStorage.setItem('petric_customers_cache', JSON.stringify(custCache));
                }

                var contact = contactsCache[custKey] || {};
                if (!Array.isArray(contact.emails)) {
                    contact.emails = [];
                    if (contact.email && contact.email.trim()) {
                        contact.emails.push(contact.email.trim());
                    }
                }
                var updated = false;

                if (emailEl) {
                    var em = emailEl.value ? emailEl.value.trim() : "";
                    if (em) {
                        var emParts = em.split(/[;,]+/).map(function(s) { return s.trim(); }).filter(Boolean);
                        for (var ep = 0; ep < emParts.length; ep++) {
                            var itemEm = emParts[ep];
                            if (itemEm.indexOf('@') > 0 && itemEm.indexOf('.') > 0) {
                                if (contact.emails.indexOf(itemEm) === -1) {
                                    contact.emails.push(itemEm);
                                    updated = true;
                                }
                            }
                        }
                        if (contact.email !== em) {
                            contact.email = em;
                            updated = true;
                        }
                    }
                }
                if (addrEl) {
                    var adr = addrEl.value ? addrEl.value.trim() : "";
                    if (adr) {
                        if (!Array.isArray(contact.addresses)) {
                            contact.addresses = [];
                            if (contact.address && contact.address.trim()) {
                                contact.addresses.push(contact.address.trim());
                            }
                        }
                        if (contact.addresses.indexOf(adr) === -1) {
                            contact.addresses.push(adr);
                            updated = true;
                        }
                        if (contact.address !== adr) {
                            contact.address = adr;
                            updated = true;
                        }
                    }
                }
                // Šifra stranke se ne shranjuje v stike (ostane prazna)

                if (updated) {
                    contactsCache[custKey] = contact;
                    localStorage.setItem('petric_customer_contacts_cache', JSON.stringify(contactsCache));

                    // Posodobi datalist, da so novi e-maili takoj na voljo
                    var emailDatalist = document.getElementById('email-list');
                    if (emailDatalist && contact.emails) {
                        contact.emails.forEach(function (ce) {
                            var exists = false;
                            for (var oi = 0; oi < emailDatalist.options.length; oi++) {
                                if (emailDatalist.options[oi].value.toLowerCase() === ce.toLowerCase()) {
                                    exists = true; break;
                                }
                            }
                            if (!exists) {
                                var opt = document.createElement('option');
                                opt.value = ce;
                                emailDatalist.appendChild(opt);
                            }
                        });
                    }
                }
            } catch (e) { }
        }

        // Attach events safely
        try {
            var custInput = document.getElementById('calc-customer');
            var custListDiv = document.getElementById('cust-dropdown-list');
            if (custInput) {
                custInput.setAttribute('autocomplete', 'off');
                custInput.removeAttribute('list');

                custInput.addEventListener('input', function (e) {
                    var val = e.target.value;
                    if (typeof handleCustomerUpdate === 'function') handleCustomerUpdate(val);
                    if (custListDiv) {
                        if (val && val.trim().length > 0) {
                            renderCustomerList(val.trim());
                            custListDiv.style.display = 'block';
                        } else {
                            custListDiv.style.display = 'none';
                        }
                    }
                });

                custInput.addEventListener('focus', function (e) {
                    var val = e.target.value;
                    if (val && val.trim().length > 0) {
                        renderCustomerList(val.trim());
                        if (custListDiv) custListDiv.style.display = 'block';
                    }
                });

                custInput.addEventListener('keydown', function (e) {
                    if (!custListDiv || custListDiv.style.display !== 'block') {
                        if (e.key === 'ArrowDown') {
                            var val = custInput.value ? custInput.value.trim() : '';
                            renderCustomerList(val);
                            custListDiv.style.display = 'block';
                            e.preventDefault();
                        }
                        return;
                    }

                    var items = custListDiv.querySelectorAll('.cust-dropdown-item');
                    if (!items || items.length === 0) return;

                    var activeIdx = -1;
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].classList.contains('active-item')) {
                            activeIdx = i;
                            break;
                        }
                    }

                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        var nextIdx = (activeIdx + 1) >= items.length ? 0 : activeIdx + 1;
                        items.forEach(function (el) { el.classList.remove('active-item'); el.style.background = 'transparent'; });
                        items[nextIdx].classList.add('active-item');
                        items[nextIdx].style.background = '#334155';
                        items[nextIdx].scrollIntoView({ block: 'nearest' });
                    } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        var prevIdx = (activeIdx - 1) < 0 ? items.length - 1 : activeIdx - 1;
                        items.forEach(function (el) { el.classList.remove('active-item'); el.style.background = 'transparent'; });
                        items[prevIdx].classList.add('active-item');
                        items[prevIdx].style.background = '#334155';
                        items[prevIdx].scrollIntoView({ block: 'nearest' });
                    } else if (e.key === 'Enter') {
                        if (activeIdx >= 0 && activeIdx < items.length) {
                            e.preventDefault();
                            items[activeIdx].click();
                        } else if (items.length === 1) {
                            e.preventDefault();
                            items[0].click();
                        }
                    } else if (e.key === 'Escape' || e.key === 'Tab') {
                        custListDiv.style.display = 'none';
                    }
                });

                custInput.addEventListener('change', function (e) {
                    if (typeof handleCustomerUpdate === 'function') handleCustomerUpdate(e.target.value);
                });
                custInput.addEventListener('blur', function (e) {
                    if (typeof handleCustomerUpdate === 'function') handleCustomerUpdate(e.target.value);
                });
            }
            var emailInput = document.getElementById('calc-cust-email');
            if (emailInput) {
                emailInput.addEventListener('input', saveCurrentCustomerContact);
                emailInput.addEventListener('change', saveCurrentCustomerContact);
                emailInput.addEventListener('blur', saveCurrentCustomerContact);
            }
            var addrInput = document.getElementById('calc-cust-address');
            if (addrInput) {
                addrInput.addEventListener('input', saveCurrentCustomerContact);
                addrInput.addEventListener('change', saveCurrentCustomerContact);
                addrInput.addEventListener('blur', saveCurrentCustomerContact);
            }
            var codeInput = document.getElementById('calc-customer-code');
            if (codeInput) {
                codeInput.addEventListener('input', saveCurrentCustomerContact);
                codeInput.addEventListener('change', saveCurrentCustomerContact);
                codeInput.addEventListener('blur', saveCurrentCustomerContact);
            }

            if (custListDiv) {
                custListDiv.addEventListener('mousedown', function (e) {
                    e.preventDefault();
                });
            }

            document.addEventListener('click', function (e) {
                var cList = document.getElementById('cust-dropdown-list');
                if (cList && cList.style.display === 'block') {
                    if (!e.target.closest('#calc-customer') &&
                        !e.target.closest('button[onclick*="toggleCustomerDropdown"]') &&
                        !e.target.closest('#cust-dropdown-list')) {
                        cList.style.display = 'none';
                    }
                }
                var eList = document.getElementById('email-dropdown-list');
                if (eList && eList.style.display === 'block') {
                    if (!e.target.closest('#calc-cust-email') &&
                        !e.target.closest('button[onclick*="toggleEmailDropdown"]') &&
                        !e.target.closest('#email-dropdown-list')) {
                        eList.style.display = 'none';
                    }
                }
            });
        } catch (e) { alert("Exception in " + "Function" + ": " + e.message + "\n" + e.stack); logDebug("Napaka pri povezovanju dogodkov: " + e.message, true); }
        function saveCurrentProject(btn = null, silent = false) {
            try {
                if (typeof saveCurrentCustomerContact === 'function') saveCurrentCustomerContact();
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
                    customerEmailBody: gv('calc-email-content'),
                    customerEmailSubject: gv('calc-email-subject'),
                    customerEmailSender: gv('calc-email-sender'),
                    customerEmailDate: gv('calc-email-date'),
                    editedQuoteHTML: g_editedQuoteHTML,
                    editedQuoteATHTML: g_editedQuoteATHTML,
                    editedWorkOrderHTML: g_editedWorkOrderHTML,
                    inputs: {
                        emailBody: gv('calc-email-content'),
                        emailSubject: gv('calc-email-subject'),
                        emailSender: gv('calc-email-sender'),
                        emailDate: gv('calc-email-date'),
                        sortImposition: window.g_currentSortImposition || null,
                        givenSheets: gv('calc-given-sheets'),
                        dnNum: gv('calc-dn-number'),
                        dnOld: gv('calc-dn-old'),
                        deadline: gv('calc-dn-deadline'),
                        packaging: gv('calc-dn-packaging'),
                        orderedSheets: gv('calc-ordered-sheets'),
                        paperPackEnabled: gc('calc-paper-pack-enabled'),
                        paperPackSize: gv('calc-paper-pack-size'),
                        paperPackCustom: gv('calc-paper-pack-custom'),
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
                        pWeight: gv('calc-paper-weight'), paperWeight: gv('calc-paper-weight'),
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
                        machinePasses: gv('calc-machine-passes'),
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
                            cilinder: { active: gc('f-cilinder-active'), prep: gv('f-cilinder-prep'), hours: gv('f-cilinder-hours'), rate: gv('f-cilinder-rate'), dodatek: gv('f-cilinder-dodatek'), zasek: gc('f-cilinder-zasek'), izsek: gc('f-cilinder-izsek'), perforacija: gc('f-cilinder-perforacija'), zleb: gc('f-cilinder-zleb') },
                            ril: { active: gc('f-ril-active'), speed: gv('f-ril-speed'), rate: gv('f-ril-rate'), hours: gv('f-ril-hours') },
                            zgibanje: { active: gc('f-zgibanje-active'), folds: gv('f-zgibanje-folds'), speed: gv('f-zgibanje-speed') },
                            razrezFormat: { active: gc('f-razrez-format-active'), speed: gv('f-razrez-format-speed'), rate: gv('f-razrez-format-rate') },
                            razrez: { active: gc('f-razrez-format-active'), speed: gv('f-razrez-format-speed'), rate: gv('f-razrez-format-rate') },
                            precut: { active: gc('f-precut-active'), prep: gv('f-precut-prep'), per1000: gv('f-precut-per1000') },
                            lepljenje: { active: gc('f-lepljenje-active'), prep: gv('f-lepljenje-prep'), per1000: gv('f-lepljenje-per1000') },
                            spiral: { active: gc('f-spiral-active'), price: gv('f-spiral-price') },
                            spiraljenje: { active: gc('f-spiral-active'), price: gv('f-spiral-price') },
                            extra: { active: gc('f-extra-active'), speed: gv('f-extra-speed'), rate: gv('f-extra-rate'), qty: gv('f-extra-qty') },
                            dodatnaDela: { active: gc('f-dodatna-dela-active'), desc: gv('f-dodatna-dela-desc'), sheets: gv('f-dodatna-dela-sheets'), kom: gv('f-dodatna-dela-kom'), price: gv('f-dodatna-dela-price') },
                            tool: { active: gc('f-tool-active'), cost: gv('f-tool-cost') },
                            zasekGrafotehna: { active: gc('f-zasek-grafotehna-active'), price: gv('f-zasek-grafotehna-price') },
                            zasek: { active: gc('f-zasek-grafotehna-active'), price: gv('f-zasek-grafotehna-price') },
                            uv: { active: gc('f-uv-active'), prep: gv('f-uv-prep'), per1000: gv('f-uv-per1000'), sides: gv('f-uv-sides'), type: gv('f-uv-type'), format: gv('f-uv-format'), extraWaste: gv('f-uv-extra-waste') },
                            uv2: { active: gc('f-uv2-active'), prep: gv('f-uv2-prep'), per1000: gv('f-uv2-per1000'), sides: gv('f-uv2-sides'), type: gv('f-uv2-type'), format: gv('f-uv2-format'), extraWaste: gv('f-uv2-extra-waste') },
                            personalization: { active: gc('f-personalization-active'), sides: gv('f-personalization-sides'), price: gv('f-personalization-price'), qty: gv('f-personalization-qty'), split: gv('f-personalization-split') },
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
                    },
                    quoteBasket: (typeof quoteBasket !== 'undefined') ? quoteBasket : [],
                    activeBasketItemId: g_activeBasketItemId,
                    sortImposition: window.g_currentSortImposition || null
                };
                let arhiv = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
                arhiv = arhiv.filter(proj => isPolaProject(proj));
                if (currentLoadedProjectId) {
                    arhiv = arhiv.filter(p => p.id !== currentLoadedProjectId);
                }
                arhiv.push(data);
                saveArhivToStorage(STORAGE_KEY, arhiv);
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
        async function autoSaveQuoteWordToServer(suggestedJsonName) {
            try {
                if (typeof getQuoteHTML !== 'function') return null;
                let wordName = suggestedJsonName || '';
                wordName = wordName.replace(/\.(pola\.json|json)$/i, '') + '.doc';
                if (!wordName || wordName === '.doc') wordName = 'ponudba.doc';
                wordName = wordName.replace(/[/\\?%*:|"<> \t]+/g, '_').replace(/_+/g, '_');

                let htmlContent = getQuoteHTML(true, '', false, false);
                if (!htmlContent) return null;
                let fullHtml = htmlContent.includes('<!DOCTYPE html>') ? htmlContent : ('<!DOCTYPE html>' + htmlContent);

                const srvUrl = await getServerBaseUrl();
                const srvRes = await fetch(srvUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: 'word', filename: wordName, content: fullHtml })
                });
                if (srvRes.ok) {
                    const srvData = await srvRes.json();
                    if (srvData && srvData.status === 'success') {
                        return wordName;
                    }
                }
            } catch (e) {
                console.warn('Samodejno shranjevanje Word ponudbe ni uspelo:', e);
            }
            return null;
        }

                function makeStorageSafeProject(proj) {
            if (!proj) return proj;
            try {
                const item = JSON.parse(JSON.stringify(proj));
                if (item.attachedPdf && item.attachedPdf.dataUrl) {
                    item.attachedPdf = { name: item.attachedPdf.name, size: item.attachedPdf.size, text: item.attachedPdf.text };
                }
                if (Array.isArray(item.attachedPdfs)) {
                    item.attachedPdfs = item.attachedPdfs.map(p => ({ name: p.name, size: p.size, text: p.text }));
                }
                if (item.editedQuoteHTML && item.editedQuoteHTML.length > 20000) item.editedQuoteHTML = '';
                if (item.editedQuoteATHTML && item.editedQuoteATHTML.length > 20000) item.editedQuoteATHTML = '';
                if (item.editedWorkOrderHTML && item.editedWorkOrderHTML.length > 20000) item.editedWorkOrderHTML = '';
                return item;
            } catch (e) {
                return proj;
            }
        }

        function saveArhivToStorage(key, arhivList) {
            if (!Array.isArray(arhivList)) return false;
            try {
                if (localStorage.getItem('zaloga_simon_data')) {
                    localStorage.removeItem('zaloga_simon_data');
                }
            } catch (e) {}

            let sanitized = arhivList.map(makeStorageSafeProject);
            if (sanitized.length > 30) sanitized = sanitized.slice(-30);

            try {
                localStorage.setItem(key, JSON.stringify(sanitized));
                return true;
            } catch (quotaErr) {
                console.warn("Storage quota exceeded on first attempt, trimming older items...", quotaErr);
                try {
                    sanitized = sanitized.slice(-15);
                    localStorage.setItem(key, JSON.stringify(sanitized));
                    return true;
                } catch (quotaErr2) {
                    try {
                        sanitized = sanitized.slice(-5);
                        localStorage.setItem(key, JSON.stringify(sanitized));
                        return true;
                    } catch (quotaErr3) {
                        console.error("Storage full, could not write arhiv to localStorage", quotaErr3);
                        return false;
                    }
                }
            }
        }

        (function autoFreeStorageQuota() {
            try {
                if (localStorage.getItem('zaloga_simon_data') && (localStorage.getItem('nova_zaloga_data') || localStorage.getItem('zaloga_materiala_v1'))) {
                    localStorage.removeItem('zaloga_simon_data');
                }
                const raw = localStorage.getItem('darko_kalkulacije_arhiv');
                if (raw && raw.length > 300000) {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) {
                        saveArhivToStorage('darko_kalkulacije_arhiv', parsed);
                    }
                }
            } catch (e) {}
        })();

        async function saveProjectToFile() {
            try {
                let name = document.getElementById('calc-project-name').value.trim() || "Ponudba";
                function gv(id) { var el = document.getElementById(id); return el ? el.value : ''; }
                function gc(id) { var el = document.getElementById(id); return el ? el.checked : false; }
                const data = {
                    name: name,
                    _source: 'pola',
                    attachedPdf: (typeof serializeSingleAttachedPdf === 'function') ? serializeSingleAttachedPdf() : (g_attachedPdf ? { name: g_attachedPdf.name, dataUrl: g_attachedPdf.dataUrl, text: g_attachedPdf.text } : null),
                    attachedPdfs: (typeof serializeAttachedPdfs === 'function') ? serializeAttachedPdfs() : [],
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
                    materialDesc: gv('calc-material-desc'),
                    productDesc: gv('calc-material-desc'),
                    notes: gv('calc-notes'),
                    sortImposition: window.g_currentSortImposition || null,
                    mutType: gv('calc-mut-type'),
                    mutQty: gv('calc-mut-qty'),
                    editedQuoteHTML: g_editedQuoteHTML,
                    editedQuoteATHTML: g_editedQuoteATHTML,
                    editedWorkOrderHTML: g_editedWorkOrderHTML,
                    inputs: {
                        emailBody: gv('calc-email-content'),
                        emailSubject: gv('calc-email-subject'),
                        emailSender: gv('calc-email-sender'),
                        emailDate: gv('calc-email-date'),
                        orderType: gv('calc-order-type'),
                        isUrgent: gc('calc-dn-urgent'),
                        mutBreakdown: gv('calc-mut-breakdown'),
                        mutDodatek: gv('calc-mut-dodatek'),
                        paper2Enable: gc('calc-paper2-enable'),
                        paper2Price: gv('calc-paper2-price'),
                        paper2Unit: gv('calc-paper2-unit'),
                        paper2Weight: gv('calc-paper2-weight'),
                        paper2Type: gv('calc-paper2-type'),
                        paper2Code: gv('calc-paper2-code'),
                        paper2WasteManual: gv('calc-paper2-waste-manual'),
                        paper2PrepPrice: gv('calc-paper2-prep-price'),
                        paper2KasiranjePrice: gv('calc-paper2-kasiranje-price'),
                        paper2KasiranjeUnit: gv('calc-paper2-kasiranje-unit'),
                        washes: gv('calc-color-washes'),
                        washPrice: gv('calc-wash-price'),
                        coopPrice: gv('calc-cooperation-price'),
                        coopUnit: gv('calc-cooperation-unit'),
                        posterFormat: gv('calc-poster-format'),
                        posterTubes: gv('calc-poster-tubes'),
                        platesNum: gv('calc-plates-num'),
                        gripper: gv('gripper'),
                        givenSheets: gv('calc-given-sheets'),
                        dnNum: gv('calc-dn-number'),
                        dnOld: gv('calc-dn-old'),
                        deadline: gv('calc-dn-deadline'),
                        packaging: gv('calc-dn-packaging'),
                        orderedSheets: gv('calc-ordered-sheets'),
                        paperPackEnabled: gc('calc-paper-pack-enabled'),
                        paperPackSize: gv('calc-paper-pack-size'),
                        paperPackCustom: gv('calc-paper-pack-custom'),
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
                        pWeight: gv('calc-paper-weight'), paperWeight: gv('calc-paper-weight'),
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
                        machinePasses: gv('calc-machine-passes'),
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
                            cilinder: { active: gc('f-cilinder-active'), prep: gv('f-cilinder-prep'), hours: gv('f-cilinder-hours'), rate: gv('f-cilinder-rate'), dodatek: gv('f-cilinder-dodatek'), zasek: gc('f-cilinder-zasek'), izsek: gc('f-cilinder-izsek'), perforacija: gc('f-cilinder-perforacija'), zleb: gc('f-cilinder-zleb') },
                            ril: { active: gc('f-ril-active'), speed: gv('f-ril-speed'), rate: gv('f-ril-rate'), hours: gv('f-ril-hours') },
                            zgibanje: { active: gc('f-zgibanje-active'), folds: gv('f-zgibanje-folds'), speed: gv('f-zgibanje-speed') },
                            razrezFormat: { active: gc('f-razrez-format-active'), speed: gv('f-razrez-format-speed'), rate: gv('f-razrez-format-rate') },
                            razrez: { active: gc('f-razrez-format-active'), speed: gv('f-razrez-format-speed'), rate: gv('f-razrez-format-rate') },
                            precut: { active: gc('f-precut-active'), prep: gv('f-precut-prep'), per1000: gv('f-precut-per1000') },
                            lepljenje: { active: gc('f-lepljenje-active'), prep: gv('f-lepljenje-prep'), per1000: gv('f-lepljenje-per1000') },
                            spiral: { active: gc('f-spiral-active'), price: gv('f-spiral-price') },
                            spiraljenje: { active: gc('f-spiral-active'), price: gv('f-spiral-price') },
                            extra: { active: gc('f-extra-active'), speed: gv('f-extra-speed'), rate: gv('f-extra-rate'), qty: gv('f-extra-qty') },
                            dodatnaDela: { active: gc('f-dodatna-dela-active'), desc: gv('f-dodatna-dela-desc'), sheets: gv('f-dodatna-dela-sheets'), kom: gv('f-dodatna-dela-kom'), price: gv('f-dodatna-dela-price') },
                            tool: { active: gc('f-tool-active'), cost: gv('f-tool-cost') },
                            zasekGrafotehna: { active: gc('f-zasek-grafotehna-active'), price: gv('f-zasek-grafotehna-price') },
                            zasek: { active: gc('f-zasek-grafotehna-active'), price: gv('f-zasek-grafotehna-price') },
                            uv: { active: gc('f-uv-active'), prep: gv('f-uv-prep'), per1000: gv('f-uv-per1000'), sides: gv('f-uv-sides'), type: gv('f-uv-type'), format: gv('f-uv-format'), extraWaste: gv('f-uv-extra-waste') },
                            uv2: { active: gc('f-uv2-active'), prep: gv('f-uv2-prep'), per1000: gv('f-uv2-per1000'), sides: gv('f-uv2-sides'), type: gv('f-uv2-type'), format: gv('f-uv2-format'), extraWaste: gv('f-uv2-extra-waste') },
                            personalization: { active: gc('f-personalization-active'), sides: gv('f-personalization-sides'), price: gv('f-personalization-price'), qty: gv('f-personalization-qty'), split: gv('f-personalization-split') },
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
                    },
                    quoteBasket: (typeof quoteBasket !== 'undefined') ? quoteBasket : []
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

                try {
                    const srvUrl = await getServerBaseUrl();
                    const srvRes = await fetch(srvUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ type: 'json', filename: suggestedName, content: jsonStr })
                    });
                    if (srvRes.ok) {
                        const srvData = await srvRes.json();
                        if (srvData.status === 'success') {
                            if (typeof refreshDiskProjects === 'function') await refreshDiskProjects();
                            if (typeof renderSavedProjects === 'function') renderSavedProjects();
                            let wordSavedName = await autoSaveQuoteWordToServer(suggestedName);
                            const currYr = new Date().getFullYear();
                            if (wordSavedName) {
                                alert("✓ Shranjeno v srečko-server:\n\n• Kalkulacija (PONUDBE TEST):\n  " + suggestedName + "\n\n• Word ponudba (PONUDBE " + currYr + "):\n  " + wordSavedName);
                            } else {
                                alert("✓ Shranjeno v srečko-server (ponudbe test):\nDatoteka: " + suggestedName);
                            }
                            return;
                        }
                    }
                } catch (srvErr) {
                    console.log("Srečko-server save error:", srvErr);
                }

                if (typeof g_projectsDirHandle !== 'undefined' && g_projectsDirHandle) {
                    try {
                        const fileHandle = await g_projectsDirHandle.getFileHandle(suggestedName, { create: true });
                        const writable = await fileHandle.createWritable();
                        await writable.write(jsonStr);
                        await writable.close();

                        // Posodobi indeksno datoteko na strežniku
                        try {
                            let sf = '';
                            let preset = document.getElementById('calc-source-presets')?.value;
                            let sw = document.getElementById('calc-source-w')?.value;
                            let sh = document.getElementById('calc-source-h')?.value;
                            if (preset && preset !== 'custom') sf += ` ${preset}`;
                            if (sw && sh) sf += ` (${sw}x${sh})`;
                            let totalStr = document.getElementById('res-total')?.innerText?.trim() || '-';
                            if (typeof updateIndexWithProject === 'function') {
                                await updateIndexWithProject({
                                    name: suggestedName,
                                    customer: customer,
                                    quoteNum: quoteNum,
                                    date: new Date().toLocaleDateString('sl-SI'),
                                    total: totalStr,
                                    sourceFormat: sf.trim(),
                                    isPola: true,
                                    mtime: Date.now()
                                });
                            }
                        } catch(idxErr) { console.warn("Index update error:", idxErr); }

                        if (typeof renderSavedProjects === 'function') renderSavedProjects();
                        alert("✓ Shranjeno v povezano mapo: [" + (g_projectsDirHandle ? g_projectsDirHandle.name : "omrežna mapa") + "]\nDatoteka: " + suggestedName);
                        return;
                    } catch (dirErr) {
                        console.log("Direct folder handle write error:", dirErr);
                    }
                }
                if (window.showSaveFilePicker) {
                    try {
                        const handle = await window.showSaveFilePicker({
                            suggestedName: suggestedName,
                            types: [{ description: 'Pola JSON', accept: { 'application/json': ['.json'] } }],
                        });
                        g_lastSaveHandle = handle;
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
        var g_serverProjects = [];
        var g_serverBaseUrl = null;

                        function loadJsBridgeScript(srcUrl, globalVar) {
            return new Promise((resolve) => {
                try {
                    window[globalVar] = undefined;
                    const s = document.createElement('script');
                    s.src = srcUrl + (srcUrl.includes('?') ? '&' : '?') + 't=' + Date.now();
                    s.onload = () => {
                        const val = window[globalVar];
                        if (s.parentNode) s.parentNode.removeChild(s);
                        resolve(val !== undefined ? val : null);
                    };
                    s.onerror = () => {
                        if (s.parentNode) s.parentNode.removeChild(s);
                        resolve(null);
                    };
                    document.head.appendChild(s);
                } catch (e) {
                    resolve(null);
                }
            });
        }

        async function getServerBaseUrl() {
            if (g_serverBaseUrl) return g_serverBaseUrl;
            const candidates = [
                'http://127.0.0.1:8095',
                'http://192.168.0.154:8095',
                'http://server-2012:8095',
                'http://Prodaja-pc:8095'
            ];
            const probe = (url) => new Promise(async (resolve, reject) => {
                try {
                    const c = new AbortController();
                    const tid = setTimeout(() => c.abort(), 1500);
                    const r = await fetch(url + '/', { signal: c.signal });
                    clearTimeout(tid);
                    if (r.ok) resolve(url);
                    else reject();
                } catch (e) {
                    reject(e);
                }
            });
            try {
                const winner = await Promise.any(candidates.map(probe));
                if (winner) {
                    g_serverBaseUrl = winner;
                    return winner;
                }
            } catch (e) { }
            return 'http://127.0.0.1:8095';
        }

        async function fetchServerProjects() {
            try {
                const srvUrl = await getServerBaseUrl();
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 6000);
                const res = await fetch(srvUrl + '/list', { signal: controller.signal });
                clearTimeout(timeoutId);
                if (res.ok) {
                    const data = await res.json();
                    if (data.status === 'success' && Array.isArray(data.projects)) {
                        g_serverProjects = data.projects;
                        return;
                    }
                }
            } catch (e) {
                console.log("HTTP strežnik 8095 ni dosegljiv, preklapljam na neposredno branje S: pogona...");
            }
            const bridgePaths = [
                '_projects_index.js',
                'file:///S:/PONUDBE%20TEST/_projects_index.js',
                '../../PONUDBE%20TEST/_projects_index.js',
                '../PONUDBE%20TEST/_projects_index.js'
            ];
            for (const bp of bridgePaths) {
                const list = await loadJsBridgeScript(bp, '__SERVER_PROJECTS_INDEX');
                if (Array.isArray(list) && list.length > 0) {
                    g_serverProjects = list;
                    return;
                }
            }
        }

        async function loadProjectFromServer(fileName) {
            try {
                const srvUrl = await getServerBaseUrl();
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 12000);
                const res = await fetch(srvUrl + '/read?file=' + encodeURIComponent(fileName), { signal: controller.signal });
                clearTimeout(timeoutId);
                if (res.ok) {
                    const data = await res.json();
                    window.g_currentLoadedFileName = fileName;
                    if (data.id) window.g_currentLoadedId = data.id;
                    loadProjectData(data);
                    alert("Ponudba '" + fileName + "' naložena s strežnika!");
                    return;
                }
            } catch (httpErr) {
                console.log("HTTP branje ni uspelo, poskušam neposredno iz S: pogona...", httpErr);
            }
            try {
                const meta = (g_serverProjects || []).find(p => p.file === fileName);
                const cacheFile = meta && meta.jsCache ? meta.jsCache : null;
                if (cacheFile) {
                    const cachePaths = [
                        'file:///S:/PONUDBE%20TEST/_js_cache/' + cacheFile,
                        '../../PONUDBE%20TEST/_js_cache/' + cacheFile,
                        '../PONUDBE%20TEST/_js_cache/' + cacheFile
                    ];
                    for (const cp of cachePaths) {
                        const data = await loadJsBridgeScript(cp, '__LOADED_SERVER_PROJECT');
                        if (data && typeof data === 'object') {
                            window.g_currentLoadedFileName = fileName;
                            if (data.id) window.g_currentLoadedId = data.id;
                            loadProjectData(data);
                            alert("Ponudba '" + fileName + "' naložena s strežnika!");
                            return;
                        }
                    }
                }
                alert("Napaka pri nalaganju ponudbe '" + fileName + "': strežnik ali pogon S: ni dosegljiv.");
            } catch (err) {
                alert("Napaka pri nalaganju s strežnika: " + err.message);
            }
        }

        async function autoConnectFolder() {
            try {
                fetchServerProjects().then(() => {
                    if (typeof renderSavedProjects === 'function') renderSavedProjects();
                }).catch(e => { });
                const handle = await getHandleFromIndexedDB('kalkulacije_shared_dir_handle');
                if (handle) {
                    const status = await handle.queryPermission({ mode: 'readwrite' });
                    if (status === 'granted') {
                        g_projectsDirHandle = handle;
                        await refreshDiskProjects();
                        renderSavedProjects();
                    }
                }
            } catch (e) { }
        }

        async function syncWithFolder() {
            try {
                let picker = (window.top && window.top !== window && typeof window.top.showDirectoryPicker === 'function')
                    ? window.top.showDirectoryPicker.bind(window.top)
                    : (window.showDirectoryPicker ? window.showDirectoryPicker.bind(window) : null);

                if (!picker) {
                    alert("Vaš brskalnik ne podpira izbire map.");
                    return;
                }
                g_projectsDirHandle = await picker();
                await setHandleInIndexedDB(g_projectsDirHandle, 'kalkulacije_shared_dir_handle');
                await refreshDiskProjects();
                renderSavedProjects();
                alert("Mapa uspešno povezana in shranjena!");
            } catch (err) {
                if (err.name === 'AbortError') return;
                if (err.name === 'SecurityError' || (err.message && (err.message.includes('sub frames') || err.message.includes('Cross origin')))) {
                    alert("⚠️ Brskalnik iz varnostnih razlogov onemogoča izbiro mape znotraj skupnega okna (iframe).\n\nPonudbe se že samodejno nalagajo s strežnika Srečko (8095).\nČe pa želite lokalno povezati mapo na disku, odprite 'pola2.html' neposredno v svojem zavihku.");
                    return;
                }
                alert("Napaka: " + err.message);
            }
        }



        var g_diskProjectsMetadata = {};

        function isPolaProject(proj) {
            if (!proj) return false;
            if (proj._source) return proj._source === 'pola' || proj._source === 'tiskovna-pola-kalkulator';
            const inp = proj.inputs || {};
            // Check if it has pola inputs and no other module inputs
            if (inp.sourceW && !inp.leaves && !inp.coverW && !inp.envelopePreset && !inp.labelW && !inp.padSheets) {
                return true;
            }
            return false;
        }

        function isPolaServerProject(p) {
            if (!p) return false;
            const src = (p.source || '').toLowerCase();
            if (src === 'pola' || src === 'tiskovna-pola-kalkulator') return true;
            const file = (p.file || '').toLowerCase();
            if (file.includes('.pola.json')) return true;
            if (src.includes('tenovis') || src.includes('blok') || src.includes('brosura') || src.includes('kuvert') || src.includes('etiket') || src.includes('koledar')) return false;
            if (file.includes('.blok.json') || file.includes('.brosura.json') || file.includes('.kuverta.json') || file.includes('.etiket.json') || file.includes('.koledar.json') || file.includes('.tenovis.json')) return false;
            return true;
        }

        async function loadFolderIndex() {
            if (!g_projectsDirHandle) return null;
            try {
                const fileHandle = await g_projectsDirHandle.getFileHandle('index_projektov.json');
                const file = await fileHandle.getFile();
                const text = await file.text();
                const data = JSON.parse(text);
                if (data && Array.isArray(data.projects)) {
                    return data;
                }
            } catch (e) {
                // Indeks še ne obstaja ali pa ga ni mogoče prebrati
            }
            return null;
        }

        async function saveFolderIndex(indexData) {
            if (!g_projectsDirHandle || !indexData) return;
            try {
                indexData.updatedAt = new Date().toISOString();
                const fileHandle = await g_projectsDirHandle.getFileHandle('index_projektov.json', { create: true });
                const writable = await fileHandle.createWritable();
                await writable.write(JSON.stringify(indexData, null, 2));
                await writable.close();
            } catch (e) {
                console.warn("Ne morem shraniti index_projektov.json:", e);
            }
        }

        async function updateIndexWithProject(meta) {
            if (!g_projectsDirHandle || !meta || !meta.name) return;
            try {
                let indexData = await loadFolderIndex();
                if (!indexData) {
                    indexData = { version: 1, updatedAt: new Date().toISOString(), projects: [] };
                }
                indexData.projects = indexData.projects.filter(p => p.name !== meta.name);
                indexData.projects.unshift(meta);
                await saveFolderIndex(indexData);

                g_diskProjectsMetadata[meta.name] = meta;
                if (!g_diskProjects.some(p => p.name === meta.name)) {
                    g_diskProjects.unshift({ name: meta.name });
                }
            } catch (e) {
                console.warn("Napaka pri posodabljanju indeksa:", e);
            }
        }

        async function buildFullIndexFromDisk(onProgress) {
            if (!g_projectsDirHandle) return null;
            let tempEntries = [];
            try {
                for await (const entry of g_projectsDirHandle.values()) {
                    if (entry.kind === 'file' && entry.name.endsWith('.json') && !entry.name.startsWith('index_')) {
                        tempEntries.push(entry);
                    }
                }
            } catch (err) { console.error(err); }

            let projects = [];
            const BATCH_SIZE = 20;
            for (let i = 0; i < tempEntries.length; i += BATCH_SIZE) {
                const batch = tempEntries.slice(i, i + BATCH_SIZE);
                if (typeof onProgress === 'function') {
                    onProgress(Math.min(i + batch.length, tempEntries.length), tempEntries.length);
                }
                await Promise.all(batch.map(async (entry) => {
                    try {
                        const file = await entry.getFile();
                        const text = await file.text();
                        const data = JSON.parse(text);
                        const inp = data.inputs || {};
                        let sf = '';
                        let preset = (inp.sourcePreset && inp.sourcePreset !== 'custom') ? ` ${inp.sourcePreset}` : '';
                        if (inp.sourceW && inp.sourceH) sf = `Osnovni format:${preset} (${inp.sourceW}x${inp.sourceH})`;

                        let totalStr = '-';
                        if (data.results && data.results.total) totalStr = String(data.results.total);
                        let mtime = file.lastModified || 0;
                        let dateStr = data.date || (mtime ? new Date(mtime).toLocaleDateString('sl-SI') : 'Lokalna datoteka');
                        let cust = (data.customer || inp.customer || '').trim();
                        let qNum = (data.quoteNum || inp.quote_num || '').trim();

                        projects.push({
                            name: entry.name,
                            customer: cust,
                            quoteNum: qNum,
                            date: dateStr,
                            total: totalStr,
                            sourceFormat: sf.trim(),
                            isPola: isPolaProject(data),
                            mtime: mtime
                        });
                    } catch (e) {}
                }));
            }

            projects.sort((a, b) => (b.mtime || 0) - (a.mtime || 0));
            const indexData = {
                version: 1,
                updatedAt: new Date().toISOString(),
                projects: projects
            };
            await saveFolderIndex(indexData);
            return indexData;
        }

        async function refreshDiskProjects(forceReindex = false) {
            if (!g_projectsDirHandle) return;
            try {
                let indexData = null;
                if (!forceReindex) {
                    indexData = await loadFolderIndex();
                }

                if (!indexData) {
                    const listContent = document.getElementById('projects-list-content');
                    if (listContent) {
                        listContent.innerHTML = '<div style="padding: 20px; text-align: center; color: #60a5fa; font-size: 0.85rem;"><div style="font-weight:bold; margin-bottom:6px;">⚡ Pripravljam hitri indeks projektov...</div>Prosimo počakajte trenutek (to se zgodi samo enkrat).</div>';
                    }
                    indexData = await buildFullIndexFromDisk((done, total) => {
                        const lc = document.getElementById('projects-list-content');
                        if (lc) lc.innerHTML = `<div style="padding: 20px; text-align: center; color: #60a5fa; font-size: 0.85rem;"><div style="font-weight:bold; margin-bottom:6px;">⚡ Indeksiram mapo (${done}/${total})...</div></div>`;
                    });
                }

                if (indexData && Array.isArray(indexData.projects)) {
                    g_diskProjectsMetadata = {};
                    g_diskProjects = [];
                    var customersList = [];
                    indexData.projects.forEach(p => {
                        if (p.isPola) {
                            g_diskProjects.push({ name: p.name });
                            g_diskProjectsMetadata[p.name] = p;
                            if (p.customer && customersList.indexOf(p.customer) === -1) {
                                customersList.push(p.customer);
                            }
                        }
                    });

                    if (customersList.length > 0) {
                        try {
                            var cache = JSON.parse(localStorage.getItem('petric_customers_cache') || '[]');
                            var changed = false;
                            customersList.forEach(c => {
                                if (cache.indexOf(c) === -1) {
                                    cache.push(c);
                                    changed = true;
                                }
                            });
                            if (changed) {
                                localStorage.setItem('petric_customers_cache', JSON.stringify(cache));
                                updateCustomerDatalist();
                            }
                        } catch(e) {}
                    }
                }
            } catch (err) {
                console.error("refreshDiskProjects napaka:", err);
            }
        }
        async function loadProjectFromDisk(fileName) {
            if (!g_projectsDirHandle) return;
            try {
                const fileHandle = await g_projectsDirHandle.getFileHandle(fileName);
                const file = await fileHandle.getFile();
                const content = await file.text();
                const data = JSON.parse(content);
                loadProjectData(data);
                alert("Datoteka '" + fileName + "' naložena!");
            } catch (err) { alert("Napaka pri branju datoteke: " + err.message); }
        }
        function handleFileSelect(event) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function (e) {
                try {
                    const data = JSON.parse(e.target.result);
                    if (!isPolaProject(data)) {
                        alert("Napaka: Ta JSON ni bil izdelan v Poli!");
                        return;
                    }
                    loadProjectData(data);
                    alert("Projekt uspešno uvožen!");
                } catch (err) { alert("Napaka pri branju datoteke: " + err.message); }
            };
            reader.readAsText(file);
        }
        window.g_serverFilterMode = 'all';

        function setProjectFilterMode(mode) {
            window.g_serverFilterMode = mode;
            renderSavedProjects();
        }

        function getProjectCategoryInfo(p) {
            const src = (p.source || p._source || '').toLowerCase();
            const fname = (p.file || p.name || '').toLowerCase();
            if (src.includes('tenovis') || fname.includes('tenovis') || fname.includes('_230') || fname.includes('_240')) {
                return { type: 'tenovis', label: 'TENOVIS', color: '#c084fc', bg: 'rgba(192, 132, 252, 0.15)', icon: '⚡' };
            }
            if (src.includes('kuvert') || fname.includes('kuvert')) {
                return { type: 'kuverte', label: 'KUVERTE', color: '#fb7185', bg: 'rgba(251, 113, 133, 0.15)', icon: '✉️' };
            }
            if (src.includes('etiket') || fname.includes('etiket')) {
                return { type: 'etikete', label: 'ETIKETE', color: '#2dd4bf', bg: 'rgba(45, 212, 191, 0.15)', icon: '🏷️' };
            }
            if (src.includes('brosur') || fname.includes('brosur') || fname.includes('brošur') || fname.includes('broura') || fname.includes('brour') || fname.includes('.brosura.json')) {
                return { type: 'brosura', label: 'BROŠURA', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)', icon: '📖' };
            }
            if (src.includes('blok') || fname.includes('blok')) {
                return { type: 'blok', label: 'BLOK', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)', icon: '📋' };
            }
            return { type: 'pola', label: 'POLA', color: '#34d399', bg: 'rgba(52, 211, 153, 0.15)', icon: '📑' };
        }

        function openProjectSmart(safeFile, projSource) {
            if (typeof toggleProjectsDropdown === 'function') toggleProjectsDropdown();
            const cat = getProjectCategoryInfo({ file: safeFile, source: projSource });
            const currentCalc = 'pola';

            if (cat.type !== currentCalc && window.parent && window.parent !== window && typeof window.parent.switchTab === 'function') {
                try {
                    window.parent.switchTab(cat.type);
                    const ifr = window.parent.document.getElementById('iframe_' + cat.type);
                    if (ifr && ifr.contentWindow && typeof ifr.contentWindow.loadProjectFromServer === 'function') {
                        setTimeout(() => {
                            try { ifr.contentWindow.loadProjectFromServer(safeFile); } catch (e) {}
                        }, 150);
                        return;
                    }
                } catch (e) {
                    console.warn("Preklop med zavihki ni uspel:", e);
                }
            }

            if (typeof loadProjectFromServer === 'function') {
                loadProjectFromServer(safeFile);
            }
        }

        function renderSavedProjects() {
            function getSearchableText(obj) {
                let text = "";
                for (let key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (key.toLowerCase().includes('html') || key === 'id' || key === 'timestamp') continue;
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

            const allServerProjects = Array.isArray(g_serverProjects) ? g_serverProjects : [];
            const polaServerCount = allServerProjects.filter(p => getProjectCategoryInfo(p).type === 'pola').length;

            const countAllEl = document.getElementById('count-filter-all');
            const countTypeEl = document.getElementById('count-filter-type');
            if (countAllEl) countAllEl.innerText = allServerProjects.length;
            if (countTypeEl) countTypeEl.innerText = polaServerCount;

            const btnAll = document.getElementById('btn-filter-all');
            const btnType = document.getElementById('btn-filter-type');
            const activeMode = window.g_serverFilterMode || 'all';
            if (btnAll) {
                if (activeMode === 'all') {
                    btnAll.style.background = '#3b82f6';
                    btnAll.style.color = 'white';
                    btnAll.style.border = 'none';
                } else {
                    btnAll.style.background = '#334155';
                    btnAll.style.color = '#94a3b8';
                    btnAll.style.border = '1px solid #475569';
                }
            }
            if (btnType) {
                if (activeMode === 'type') {
                    btnType.style.background = '#3b82f6';
                    btnType.style.color = 'white';
                    btnType.style.border = 'none';
                } else {
                    btnType.style.background = '#334155';
                    btnType.style.color = '#94a3b8';
                    btnType.style.border = '1px solid #475569';
                }
            }

            let html = "";

            if (g_projectsDirHandle) {
                html += '<div style="padding: 6px 12px; background: rgba(16, 185, 129, 0.15); border-bottom: 1px solid rgba(16, 185, 129, 0.3); font-size: 0.75rem; font-weight: bold; color: #10b981; display: flex; justify-content: space-between; align-items: center;">' +
                    '<span>📁 Povezana: [' + g_projectsDirHandle.name + ']</span>' +
                    '<div style="display:flex; gap:4px;">' +
                    '<button onclick="refreshDiskProjects(true).then(() => renderSavedProjects())" style="background:#0284c7; color:white; border:none; padding:2px 6px; border-radius:4px; font-size:0.68rem; cursor:pointer;" title="Ponovno preberi vse datoteke in osveži hitri indeks">🔄 Osveži</button>' +
                    '<button onclick="syncWithFolder()" style="background:#10b981; color:white; border:none; padding:2px 6px; border-radius:4px; font-size:0.68rem; cursor:pointer;" title="Spremeni mapo">Spremeni</button>' +
                    '</div>' +
                    '</div>';
            }
            }

            // 0. PONUDBE ZE STREŽNIKA (Srečko server 8095 -> PONUDBE TEST)
            if (allServerProjects.length > 0) {
                let srvFiltered = allServerProjects;
                if (filter) {
                    const terms = filter.split(/\s+/).filter(Boolean);
                    srvFiltered = allServerProjects.filter(p => {
                        const str = `${p.file} ${p.name || ''} ${p.customer || ''} ${p.quoteNum || ''}`.toLowerCase();
                        return terms.every(term => str.includes(term));
                    });
                } else if (activeMode === 'type') {
                    srvFiltered = allServerProjects.filter(p => getProjectCategoryInfo(p).type === 'pola');
                }

                if (srvFiltered.length > 0) {
                    const headerLabel = filter 
                        ? `🔍 REZULTATI ISKANJA NA STREŽNIKU (${srvFiltered.length})` 
                        : (activeMode === 'type' 
                            ? `📑 POLA NA STREŽNIKU (${srvFiltered.length})` 
                            : `🌐 VSE PONUDBE NA STREŽNIKU (${srvFiltered.length})`);

                    html += `<div style="padding: 6px 12px; background: rgba(59, 130, 246, 0.15); color: #60a5fa; font-size: 0.72rem; font-weight: bold; border-bottom: 1px solid rgba(59, 130, 246, 0.3); display: flex; justify-content: space-between; align-items: center;">
                        <span>${headerLabel}</span>
                        <span style="font-size: 0.65rem; color: #94a3b8; font-weight: normal;">S:\\PONUDBE TEST</span>
                    </div>`;

                    srvFiltered.forEach(p => {
                        const safeFile = p.file.replace(/'/g, "\\'");
                        const cat = getProjectCategoryInfo(p);
                        const custStr = p.customer ? `<div style="font-size: 0.72rem; color: #6ee7b7; font-weight: 600; margin-top: 1px;">👤 ${p.customer}</div>` : '';
                        const dateStr = p.date || 'Strežnik';
                        const qNumStr = p.quoteNum ? `<span style="color:#fde047; font-weight:bold;">pon. ${p.quoteNum}</span> | ` : '';
                        const totalStr = p.total ? `<div style="text-align: right; margin-left: 8px;"><div style="color: #10b981; font-weight: bold; font-size: 0.85rem;">${p.total}</div></div>` : '';

                        html += `
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 9px 12px; border-bottom: 1px solid #334155; transition: background 0.2s;" class="project-item-row" onmouseover="this.style.background='rgba(59, 130, 246, 0.1)'" onmouseout="this.style.background='transparent'">
                                <div style="cursor: pointer; flex: 1; min-width: 0;" onclick="openProjectSmart('${safeFile}', '${cat.type}')">
                                    <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 2px;">
                                        <span style="font-size: 0.62rem; font-weight: 800; padding: 1px 5px; border-radius: 4px; background: ${cat.bg}; color: ${cat.color}; border: 1px solid ${cat.color}40; letter-spacing: 0.3px;">${cat.icon} ${cat.label}</span>
                                        <div style="font-weight: 600; color: #38bdf8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.82rem;" title="${safeFile}">
                                            ${p.file}
                                        </div>
                                    </div>
                                    ${custStr}
                                    <div style="font-size: 0.68rem; color: #94a3b8; margin-top: 1px;">${qNumStr}${dateStr}</div>
                                </div>
                                ${totalStr}
                            </div>`;
                    });
                } else if (filter) {
                    html += `<div style="padding: 16px 12px; text-align: center; color: #94a3b8; font-size: 0.8rem;">
                        Za iskanje "<strong style="color:white;">${filter}</strong>" na strežniku ni zadetkov.
                    </div>`;
                }
            } else {
                html += `<div style="padding: 24px 16px; text-align: center; color: #38bdf8; font-size: 0.82rem;">
                    <div style="font-size: 1.5rem; margin-bottom: 6px;">⏳</div>
                    <strong>Nalagam kalkulacije s strežnika...</strong>
                    <div style="color: #64748b; font-size: 0.7rem; margin-top: 4px;">Povezujem z mapo S:\\PONUDBE TEST</div>
                </div>`;
            }

            // 1. DATOTEKE NA DISKU (če je mapa povezana)
            if (g_diskProjects && g_diskProjects.length > 0) {
                html += '<div style="padding: 5px 12px; background: rgba(16, 185, 129, 0.1); color: #10b981; font-size: 0.7rem; font-weight: bold; border-bottom: 1px solid rgba(16, 185, 129, 0.2);">📁 DATOTEKE NA DISKU</div>';
                let diskFiltered = g_diskProjects;
                if (filter) diskFiltered = g_diskProjects.filter(e => e.name.toLowerCase().includes(filter));
                diskFiltered.forEach(entry => {
                    const safeName = String(entry.name).replace(/'/g, "\\'");
                    let meta = (typeof g_diskProjectsMetadata !== 'undefined' && g_diskProjectsMetadata[entry.name]) ? g_diskProjectsMetadata[entry.name] : {};
                    let metaCust = meta.customer || '';
                    let metaQuote = meta.quoteNum ? (' | ' + meta.quoteNum) : '';
                    let metaDate = meta.date || 'Lokalna datoteka';
                    let metaTotal = meta.total || '';

                    html += `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; border-bottom: 1px solid #334155; transition: background 0.2s;" class="project-item-row" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">
                            <div style="cursor: pointer; flex: 1; min-width: 0;" onclick="loadProjectFromDisk('${safeName}'); toggleProjectsDropdown();">
                                <div style="font-weight: bold; color: #10b981; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.85rem;" title="${safeName}">
                                    📄 ${entry.name}
                                </div>
                                ${metaCust ? `<div style="font-size: 0.75rem; color: #e2e8f0; font-weight: 600; margin-top: 2px;">👤 ${metaCust}${metaQuote}</div>` : ''}
                                <div style="font-size: 0.7rem; color: #94a3b8; margin-top: 2px;">${metaDate}</div>
                            </div>
                            ${metaTotal ? `<div style="text-align: right; margin-left: 8px;"><div style="color: #10b981; font-weight: bold; font-size: 0.85rem;">${metaTotal}</div></div>` : ''}
                        </div>`;
                });
            }

            // 2. LOKALNI ARHIV BRUSKALNIKA
            let arhiv = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            arhiv = arhiv.filter(proj => isPolaProject(proj));
            let localFiltered = filter ? arhiv.filter(proj => {
                const searchStr = getSearchableText(proj).toLowerCase();
                const terms = filter.split(/\s+/).filter(Boolean);
                return terms.every(term => searchStr.includes(term));
            }) : arhiv;
            localFiltered.sort((a, b) => b.id - a.id);

            if (localFiltered.length > 0 && allServerProjects.length === 0) {
                html += '<div style="padding: 5px 12px; background: rgba(59, 130, 246, 0.1); color: #60a5fa; font-size: 0.7rem; font-weight: bold; border-bottom: 1px solid rgba(59, 130, 246, 0.2);">⭐ LOKALNI ARHIV BRUSKALNIKA</div>';
                html += localFiltered.map(proj => `
                    <div style="padding: 10px 12px; border-bottom: 1px solid #334155; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='rgba(59, 130, 246, 0.1)'" onmouseout="this.style.background='transparent'">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;" onclick="loadProject('${proj.id}'); toggleProjectsDropdown();">
                            <div style="flex: 1;">
                                <div style="color: #f8fafc; font-weight: bold; font-size: 0.85rem;">${proj.name || 'Brez imena'}</div>
                                <div style="color: #94a3b8; font-size: 0.72rem;">${proj.customer || 'Neznana stranka'}</div>
                                <div style="color: #64748b; font-size: 0.68rem; margin-top: 1px;">${proj.date || ''}</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="color: #10b981; font-weight: bold; font-size: 0.85rem;">${(proj.results && proj.results.total) ? proj.results.total : ''}</div>
                            </div>
                        </div>
                        <div style="display: flex; gap: 6px; margin-top: 6px;">
                            <button onclick="exportSingleProject('${proj.id}')" style="flex: 1; background: #3b82f6; border: none; color: white; padding: 3px; border-radius: 4px; font-size: 0.68rem; cursor: pointer;">IZVOZI</button>
                            <button onclick="deleteProject('${proj.id}')" style="flex: 1; background: #ef4444; border: none; color: white; padding: 3px; border-radius: 4px; font-size: 0.68rem; cursor: pointer;">BRIŠI</button>
                        </div>
                    </div>
                `).join('');
            }

            listContent.innerHTML = html;
        }

        (function initAutoFetchServerProjects() {
            function doFetch() {
                if (typeof fetchServerProjects === 'function') {
                    fetchServerProjects().then(() => {
                        if (typeof renderSavedProjects === 'function') renderSavedProjects();
                    }).catch(() => {});
                }
            }
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                setTimeout(doFetch, 50);
            } else {
                document.addEventListener('DOMContentLoaded', doFetch);
            }
        })();
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
            if (!list) return;
            if (list.style.display === 'flex' || list.style.display === 'block') {
                list.style.display = 'none';
                return;
            }

            // 1. TAKOJ prikaži okno - ne čakaj na omrežje!
            list.style.display = 'flex';
            renderSavedProjects();

            // Zapri customer dropdown če je odprt
            const clist = document.getElementById('cust-dropdown-list');
            if (clist) clist.style.display = 'none';

            // 2. V ozadju naloži iz strežnika in hitrega indeksa diska
            fetchServerProjects().then(() => {
                if (typeof renderSavedProjects === 'function') renderSavedProjects();
            }).catch(e => {});
        }
        // Pomožna funkcija za izvoz enega projekta iz arhiva
        async function exportSingleProject(id) {
            let arhiv = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            arhiv = arhiv.filter(proj => isPolaProject(proj));
            let proj = arhiv.find(p => p.id === id);
            if (!proj) return;
            const jsonStr = JSON.stringify(proj, null, 2);
            let tParts = [];
            if (proj.inputs && proj.inputs.quote_num) tParts.push(proj.inputs.quote_num);
            if (proj.customer) tParts.push(proj.customer);
            if (proj.name) tParts.push(proj.name);
            const suggestedName = 'pon._' + tParts.join('_').replace(/[/\\?%*:|"<> \t]/g, '_').replace(/_+/g, '_') + '.json';

            try {
                const srvUrl = await getServerBaseUrl();
                const srvRes = await fetch(srvUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type: 'json', filename: suggestedName, content: jsonStr })
                });
                if (srvRes.ok) {
                    const srvData = await srvRes.json();
                    if (srvData.status === 'success') {
                        if (typeof refreshDiskProjects === 'function') await refreshDiskProjects();
                        if (typeof renderSavedProjects === 'function') renderSavedProjects();
                        let wordSavedName = await autoSaveQuoteWordToServer(suggestedName);
                            const currYr = new Date().getFullYear();
                            if (wordSavedName) {
                                alert("✓ Shranjeno v srečko-server:\n\n• Kalkulacija (PONUDBE TEST):\n  " + suggestedName + "\n\n• Word ponudba (PONUDBE " + currYr + "):\n  " + wordSavedName);
                            } else {
                                alert("✓ Shranjeno v srečko-server (ponudbe test):\nDatoteka: " + suggestedName);
                            }
                        return;
                    }
                }
            } catch (srvErr) {
                console.log("Srečko-server save error:", srvErr);
            }

            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = suggestedName;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => { document.body.removeChild(a); window.URL.revokeObjectURL(url); }, 100);
        }
        // Pomožna funkcija za nalaganje podatkov v polja (skupna za Arhiv in File Import)
        function loadProjectData(proj) {
            window.g_loadingProject = true;
            if (proj && Array.isArray(proj.quoteBasket)) {
                quoteBasket = proj.quoteBasket;
            } else {
                quoteBasket = [];
            }
            g_activeBasketItemId = (proj && proj.activeBasketItemId) ? proj.activeBasketItemId : (quoteBasket.length > 0 ? quoteBasket[0].id : null);
            localStorage.setItem('petric_quote_basket', JSON.stringify(quoteBasket));
            if (typeof renderBasket === 'function') renderBasket();

            try {
                function setV(id, val, isChk = false) {
                    var el = document.getElementById(id);
                    if (!el) return;
                    if (isChk) el.checked = !!val; else el.value = (val !== undefined && val !== null) ? val : '';
                    updateInputStyles(el);
                }
                if (!proj) return;
                try { restoreAttachedPdfs(proj); } catch(e){}
                g_editedQuoteHTML = proj.editedQuoteHTML || '';
                g_editedQuoteATHTML = proj.editedQuoteATHTML || '';
                g_editedWorkOrderHTML = proj.editedWorkOrderHTML || '';
                const inp = proj.inputs || {};
                setV('calc-order-type', proj.orderType || inp.orderType || '');
                setV('calc-customer', proj.customer || inp.customer || '');
                setV('calc-cust-address', proj.custAddress || inp.custAddress || '');
                setV('calc-delivery-address', proj.deliveryAddress || inp.deliveryAddress || '');
                setV('calc-cust-email', proj.custEmail || inp.custEmail || '');
                setV('calc-mut-type', proj.mutType || inp.mutType || '');
                setV('calc-mut-qty', proj.mutQty || inp.mutQty || 1);
                setV('calc-mut-plates', proj.mutPlates || inp.mutPlates || 0);
                setV('calc-mut-breakdown', proj.mutBreakdown || inp.mutBreakdown || '');
                setV('calc-mut-dodatek', proj.mutDodatek || inp.mutDodatek || '');
                setV('calc-cust-id', proj.custId || inp.custId || '');
                setV('calc-quote-number', proj.quoteNum || inp.quoteNum || inp.quote_num || '');
                setV('calc-customer-code', '');
                setV('calc-product-code', proj.productCode || inp.productCode || '');
                setV('calc-prepared-by', proj.preparedBy || inp.preparedBy || '');
                setV('calc-material-code', proj.materialCode || inp.materialCode || '');
                setV('calc-material-desc', proj.materialDesc || (inp && inp.materialDesc) || proj.productDesc || (inp && inp.productDesc) || '');
                setV('calc-notes', proj.notes || inp.notes || '');
                // Ob odpiranju ponudbe avtomatsko naloži shranjeno razporeditev sort
                if (typeof restoreSortImpositionFromProject === 'function') {
                    restoreSortImpositionFromProject(proj.sortImposition || (inp && inp.sortImposition) || null);
                }
                setV('calc-dn-number', proj.dnNum || inp.dnNum || '');
                setV('calc-dn-old', proj.dnOld || inp.dnOld || '');
                setV('calc-dn-deadline', proj.deadline || inp.deadline || '');
                setV('calc-dn-packaging', proj.packaging || inp.packaging || '');
                setV('calc-dn-urgent', proj.isUrgent || inp.isUrgent || false, true);
                setV('calc-given-sheets', proj.givenSheets || inp.givenSheets || '');
                setV('calc-email-content', proj.customerEmailBody || inp.emailBody || '');
                setV('calc-email-subject', proj.customerEmailSubject || inp.emailSubject || '');
                setV('calc-email-sender', proj.customerEmailSender || inp.emailSender || '');
                setV('calc-email-date', proj.customerEmailDate || inp.emailDate || '');
                if (typeof updateEmailBadge === 'function') updateEmailBadge();

                if (inp.machine_format !== undefined) setV('machine-format', inp.machine_format);
                if (inp.sourcePreset !== undefined) setV('calc-source-presets', inp.sourcePreset);
                if (inp.sourceW !== undefined) setV('calc-source-w', inp.sourceW);
                if (inp.sourceH !== undefined) setV('calc-source-h', inp.sourceH);
                if (inp.sourceYield !== undefined) setV('calc-source-yield', inp.sourceYield);
                if (inp.orderedSheets !== undefined) setV('calc-ordered-sheets', inp.orderedSheets);
                if (inp.paperPackEnabled !== undefined) setV('calc-paper-pack-enabled', inp.paperPackEnabled, true);
                if (inp.paperPackSize !== undefined) setV('calc-paper-pack-size', inp.paperPackSize);
                if (inp.paperPackCustom !== undefined) setV('calc-paper-pack-custom', inp.paperPackCustom);
                if (typeof onPaperPackToggle === 'function') onPaperPackToggle();
                if (inp.item_w !== undefined) setV('width', inp.item_w);
                if (inp.item_h !== undefined) setV('height', inp.item_h);
                if (inp.quantity !== undefined) setV('quantity', inp.quantity);
                if (inp.bleed !== undefined) setV('bleed', inp.bleed);
                if (inp.pWaste !== undefined) setV('calc-paper-waste', inp.pWaste);
                if (inp.pWeight !== undefined) setV('calc-paper-weight', inp.pWeight);
                else if (inp.paperWeight !== undefined) setV('calc-paper-weight', inp.paperWeight);
                if (inp.pPrice !== undefined) setV('calc-paper-price', inp.pPrice);
                if (inp.pType !== undefined) setV('calc-paper-type', inp.pType);
                if (inp.pUnit !== undefined) setV('calc-paper-unit', inp.pUnit);
                else if (inp.paperPrice !== undefined) setV('calc-paper-price', inp.paperPrice);
                if (inp.pWeight !== undefined) setV('calc-paper-weight', inp.pWeight);
                else if (inp.paperWeight !== undefined) setV('calc-paper-weight', inp.paperWeight);
                if (inp.pPrice !== undefined) setV('calc-paper-price', inp.pPrice);
                if (inp.pType !== undefined) setV('calc-paper-type', inp.pType);
                if (inp.pUnit !== undefined) setV('calc-paper-unit', inp.pUnit);
                else if (inp.paperPrice !== undefined) setV('calc-paper-price', inp.paperPrice);
                if (inp.pWeight !== undefined) setV('calc-paper-weight', inp.pWeight);
                else if (inp.paperWeight !== undefined) setV('calc-paper-weight', inp.paperWeight);
                if (inp.pPrice !== undefined) setV('calc-paper-price', inp.pPrice);
                if (inp.pType !== undefined) setV('calc-paper-type', inp.pType);
                if (inp.pUnit !== undefined) setV('calc-paper-unit', inp.pUnit);
                else if (inp.paperPrice !== undefined) setV('calc-paper-price', inp.paperPrice);
                var wManual = (inp.wasteManual !== undefined) ? inp.wasteManual : ((proj.wasteManual !== undefined) ? proj.wasteManual : '');
                setV('calc-paper-waste-manual', wManual);
                if (inp.colorWashes !== undefined) setV('calc-color-washes', inp.colorWashes);
                if (inp.washPrice !== undefined) setV('calc-wash-price', inp.washPrice);
                if (inp.cooperationPrice !== undefined) setV('calc-cooperation-price', inp.cooperationPrice);
                if (inp.cooperationUnit !== undefined) setV('calc-cooperation-unit', inp.cooperationUnit);
                if (inp.posterFormat !== undefined) setV('calc-poster-format', inp.posterFormat);
                if (inp.posterTubes !== undefined) setV('calc-poster-tubes', inp.posterTubes);
                if (inp.washes !== undefined) setV('calc-color-washes', inp.washes);
                if (inp.washPrice !== undefined) setV('calc-wash-price', inp.washPrice);
                if (inp.coopPrice !== undefined) setV('calc-cooperation-price', inp.coopPrice);
                if (inp.coopUnit !== undefined) setV('calc-cooperation-unit', inp.coopUnit);
                if (inp.platesNum !== undefined) setV('calc-plates-num', inp.platesNum);
                if (inp.gripper !== undefined) setV('gripper', inp.gripper);
                if (inp.platesPrice !== undefined) setV('calc-plates-price', inp.platesPrice);
                if (inp.prepPrice !== undefined) setV('calc-prep-price', inp.prepPrice);
                if (inp.changePrice !== undefined) setV('calc-change-price', inp.changePrice);
                if (inp.machineType !== undefined) setV('calc-machine-type', inp.machineType);
                if (inp.machineRate !== undefined) setV('calc-machine-rate', inp.machineRate);
                if (inp.machineSpeed !== undefined) setV('calc-machine-speed', inp.machineSpeed);
                if (inp.machinePrepTime !== undefined) setV('calc-machine-prep-time', inp.machinePrepTime);
                if (inp.machinePasses !== undefined) setV('calc-machine-passes', inp.machinePasses);
                if (inp.colorFront !== undefined) setV('calc-color-front', inp.colorFront);
                if (inp.colorBack !== undefined) setV('calc-color-back', inp.colorBack);
                if (inp.isObrat !== undefined) setV('calc-is-obrat', inp.isObrat, true);
                if (inp.isSV !== undefined) setV('calc-is-sv', inp.isSV, true);
                if (inp.commercial !== undefined) setV('calc-commercial', inp.commercial);
                if (inp.margin !== undefined) setV('calc-margin', inp.margin);
                if (inp.itemsPerSheet !== undefined) setV('items-per-sheet', inp.itemsPerSheet);
                if (inp.itemOrientation !== undefined) setV('item-orientation', inp.itemOrientation);
                if (inp.minusPrice !== undefined) setV('calc-minus-price', inp.minusPrice, true);
                if (inp.paper2Enable !== undefined) setV('calc-paper2-enable', inp.paper2Enable, true);
                if (inp.paper2Price !== undefined) setV('calc-paper2-price', inp.paper2Price);
                if (inp.paper2Unit !== undefined) setV('calc-paper2-unit', inp.paper2Unit);
                if (inp.paper2Weight !== undefined) setV('calc-paper2-weight', inp.paper2Weight);
                if (inp.paper2Type !== undefined) setV('calc-paper2-type', inp.paper2Type);
                if (inp.paper2Code !== undefined) setV('calc-paper2-code', inp.paper2Code);
                if (inp.paper2WasteManual !== undefined) setV('calc-paper2-waste-manual', inp.paper2WasteManual);
                if (inp.paper2PrepPrice !== undefined) setV('calc-paper2-prep-price', inp.paper2PrepPrice);
                if (inp.paper2KasiranjePrice !== undefined) setV('calc-paper2-kasiranje-price', inp.paper2KasiranjePrice);
                if (inp.paper2KasiranjeUnit !== undefined) setV('calc-paper2-kasiranje-unit', inp.paper2KasiranjeUnit);
                if (typeof togglePaper2Section === 'function') togglePaper2Section();

                // Load Finishing
                if (inp.finish) {
                    const f = inp.finish;
                    // First reset optional finishing checkboxes
                    ['cilinder', 'ril', 'zgibanje', 'tool', 'zasek-grafotehna', 'lepljenje', 'spiral', 'extra', 'uv', 'personalization', 'lam', 'delivery', 'del-fixed'].forEach(t => {
                        setV('f-' + t + '-active', false, true);
                        if (typeof toggleFinishRow === 'function') toggleFinishRow(t);
                    });
                    setV('f-cilinder-zasek', false, true);
                    setV('f-cilinder-izsek', false, true);
                    setV('f-cilinder-perforacija', false, true);
                    setV('f-cilinder-zleb', false, true);
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
                        if (cil.zasek !== undefined) setV('f-cilinder-zasek', cil.zasek, true);
                        if (cil.izsek !== undefined) setV('f-cilinder-izsek', cil.izsek, true);
                        if (cil.perforacija !== undefined) setV('f-cilinder-perforacija', cil.perforacija, true);
                        if (cil.zleb !== undefined) setV('f-cilinder-zleb', cil.zleb, true);
                        toggleFinishRow('cilinder');
                    }

                    const ril = f.ril;
                    if (ril) {
                        setV('f-ril-active', ril.active, true);
                        if (ril.speed !== undefined) setV('f-ril-speed', ril.speed);
                        if (ril.rate !== undefined) setV('f-ril-rate', ril.rate);
                        if (ril.hours !== undefined) setV('f-ril-hours', ril.hours);
                        toggleFinishRow('ril');
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
                        if (ex.qty !== undefined) setV('f-extra-qty', ex.qty);
                        if (ex.manual !== undefined && document.getElementById('f-extra-speed')) setV('f-extra-speed', ex.manual);
                        toggleFinishRow('extra');
                    }

                    const dd = f.dodatnaDela;
                    if (dd) {
                        setV('f-dodatna-dela-active', dd.active, true);
                        if (dd.desc !== undefined) setV('f-dodatna-dela-desc', dd.desc);
                        if (dd.sheets !== undefined) setV('f-dodatna-dela-sheets', dd.sheets);
                        if (dd.kom !== undefined) setV('f-dodatna-dela-kom', dd.kom);
                        if (dd.price !== undefined) setV('f-dodatna-dela-price', dd.price);
                        toggleFinishRow('dodatna-dela');
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
                        if (uvItem.sides !== undefined) setV('f-uv-sides', uvItem.sides);
                        if (uvItem.type !== undefined) setV('f-uv-type', uvItem.type);
                        if (uvItem.format !== undefined) setV('f-uv-format', uvItem.format);
                        if (uvItem.extraWaste !== undefined) setV('f-uv-extra-waste', uvItem.extraWaste);
                        toggleFinishRow('uv');
                    }

                    const uv2Item = f.uv2;
                    if (uv2Item) {
                        setV('f-uv2-active', uv2Item.active, true);
                        if (uv2Item.prep !== undefined) setV('f-uv2-prep', uv2Item.prep);
                        if (uv2Item.per1000 !== undefined) setV('f-uv2-per1000', uv2Item.per1000);
                        if (uv2Item.sides !== undefined) setV('f-uv2-sides', uv2Item.sides);
                        if (uv2Item.type !== undefined) setV('f-uv2-type', uv2Item.type);
                        if (uv2Item.format !== undefined) setV('f-uv2-format', uv2Item.format);
                        if (uv2Item.extraWaste !== undefined) setV('f-uv2-extra-waste', uv2Item.extraWaste);
                        toggleFinishRow('uv2');
                    }

                    const pers = f.personalization;
                    if (pers) {
                        setV('f-personalization-active', pers.active, true);
                        if (pers.sides !== undefined) setV('f-personalization-sides', pers.sides);
                        if (pers.price !== undefined) setV('f-personalization-price', pers.price);
                        if (pers.qty !== undefined) setV('f-personalization-qty', pers.qty);
                        if (pers.split !== undefined) setV('f-personalization-split', pers.split);
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
            arhiv = arhiv.filter(proj => isPolaProject(proj));
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
            arhiv = arhiv.filter(proj => isPolaProject(proj));
            arhiv = arhiv.filter(p => p.id !== id);
            saveArhivToStorage(STORAGE_KEY, arhiv);
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
                function gv(id) { var el = document.getElementById(id); return el ? el.value : ''; }
                function gc(id) { var el = document.getElementById(id); return el ? el.checked : false; }
                const data = {
                    name: name,
                    _source: 'tiskovna-pola-kalkulator',
                    attachedPdf: (typeof serializeSingleAttachedPdf === 'function') ? serializeSingleAttachedPdf() : (g_attachedPdf ? { name: g_attachedPdf.name, dataUrl: g_attachedPdf.dataUrl, text: g_attachedPdf.text } : null),
                    attachedPdfs: (typeof serializeAttachedPdfs === 'function') ? serializeAttachedPdfs() : [],
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
                    mutPlates: gv('calc-mut-plates'),
                    mutBreakdown: gv('calc-mut-breakdown'),
                    mutDodatek: gv('calc-mut-dodatek'),
                    orderType: gv('calc-order-type'),
                    customerEmailBody: gv('calc-email-content'),
                    customerEmailSubject: gv('calc-email-subject'),
                    customerEmailSender: gv('calc-email-sender'),
                    customerEmailDate: gv('calc-email-date'),
                    isUrgent: gc('calc-dn-urgent'),
                    timestamp: Date.now(),
                    editedQuoteHTML: g_editedQuoteHTML,
                    editedQuoteATHTML: g_editedQuoteATHTML,
                    editedWorkOrderHTML: g_editedWorkOrderHTML,
                    inputs: {
                        emailBody: gv('calc-email-content'),
                        emailSubject: gv('calc-email-subject'),
                        emailSender: gv('calc-email-sender'),
                        emailDate: gv('calc-email-date'),
                        quote_num: gv('calc-quote-number'),
                        quoteNum: gv('calc-quote-number'),
                        customerCode: gv('calc-customer-code'),
                        productCode: gv('calc-product-code'),
                        preparedBy: gv('calc-prepared-by'),
                        customer: gv('calc-customer'),
                        custAddress: gv('calc-cust-address'),
                        deliveryAddress: gv('calc-delivery-address'),
                        custEmail: gv('calc-cust-email'),
                        custId: gv('calc-cust-id'),
                        notes: gv('calc-notes'),
                        orderType: gv('calc-order-type'),
                        isUrgent: gc('calc-dn-urgent'),
                        orderedSheets: document.getElementById('calc-ordered-sheets') ? document.getElementById('calc-ordered-sheets').value : '',
                        paperPackEnabled: document.getElementById('calc-paper-pack-enabled') ? document.getElementById('calc-paper-pack-enabled').checked : false,
                        paperPackSize: document.getElementById('calc-paper-pack-size') ? document.getElementById('calc-paper-pack-size').value : '100',
                        paperPackCustom: document.getElementById('calc-paper-pack-custom') ? document.getElementById('calc-paper-pack-custom').value : '100',
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
                        wasteManual: document.getElementById('calc-paper-waste-manual') ? document.getElementById('calc-paper-waste-manual').value : '',
                        givenSheets: document.getElementById('calc-given-sheets') ? document.getElementById('calc-given-sheets').value : '',
                        dnNum: document.getElementById('calc-dn-number') ? document.getElementById('calc-dn-number').value : '',
                        dnOld: document.getElementById('calc-dn-old') ? document.getElementById('calc-dn-old').value : '',
                        deadline: document.getElementById('calc-dn-deadline') ? document.getElementById('calc-dn-deadline').value : '',
                        packaging: document.getElementById('calc-dn-packaging') ? document.getElementById('calc-dn-packaging').value : '',
                        isUrgent: document.getElementById('calc-dn-urgent') ? document.getElementById('calc-dn-urgent').checked : false,
                        mutPlates: document.getElementById('calc-mut-plates') ? document.getElementById('calc-mut-plates').value : 0,
                        platesPrice: document.getElementById('calc-plates-price').value,
                        prepPrice: document.getElementById('calc-prep-price').value,
                        mutBreakdown: document.getElementById('calc-mut-breakdown') ? document.getElementById('calc-mut-breakdown').value : '',
                        mutDodatek: document.getElementById('calc-mut-dodatek') ? document.getElementById('calc-mut-dodatek').value : '',
                        changePrice: document.getElementById('calc-change-price').value,
                        colorWashes: parseInt(document.getElementById('calc-color-washes').value) || 0,
                        washPrice: parseFloat(document.getElementById('calc-wash-price').value) || 25,
                        cooperationPrice: document.getElementById('calc-cooperation-price') ? document.getElementById('calc-cooperation-price').value : '',
                        cooperationUnit: document.getElementById('calc-cooperation-unit') ? document.getElementById('calc-cooperation-unit').value : 'flat',
                        posterFormat: document.getElementById('calc-poster-format') ? document.getElementById('calc-poster-format').value : 'B1',
                        posterTubes: document.getElementById('calc-poster-tubes') ? document.getElementById('calc-poster-tubes').value : '0',
                        machineType: document.getElementById('calc-machine-type').value,
                        machineRate: document.getElementById('calc-machine-rate').value,
                        machineSpeed: document.getElementById('calc-machine-speed').value,
                        machinePrepTime: document.getElementById('calc-machine-prep-time').value,
                        machinePasses: document.getElementById('calc-machine-passes') ? document.getElementById('calc-machine-passes').value : 'auto',
                        colorFront: document.getElementById('calc-color-front').value,
                        colorBack: document.getElementById('calc-color-back').value,
                        isObrat: document.getElementById('calc-is-obrat').checked,
                        isSV: document.getElementById('calc-is-sv') ? document.getElementById('calc-is-sv').checked : false,
                        commercial: document.getElementById('calc-commercial') ? document.getElementById('calc-commercial').value : 10,
                        margin: document.getElementById('calc-margin').value,
                        itemsPerSheet: document.getElementById('items-per-sheet') ? document.getElementById('items-per-sheet').value : '',
                        itemOrientation: document.getElementById('item-orientation') ? document.getElementById('item-orientation').value : '',
                        minusPrice: document.getElementById('calc-minus-price') ? document.getElementById('calc-minus-price').checked : false,
                        paper2Enable: gc('calc-paper2-enable'),
                        paper2Price: gv('calc-paper2-price'),
                        paper2Unit: gv('calc-paper2-unit'),
                        paper2Weight: gv('calc-paper2-weight'),
                        paper2Type: gv('calc-paper2-type'),
                        paper2Code: gv('calc-paper2-code'),
                        paper2WasteManual: gv('calc-paper2-waste-manual'),
                        paper2PrepPrice: gv('calc-paper2-prep-price'),
                        paper2KasiranjePrice: gv('calc-paper2-kasiranje-price'),
                        paper2KasiranjeUnit: gv('calc-paper2-kasiranje-unit'),
                        finish: {
                            cilinder: { active: document.getElementById('f-cilinder-active').checked, prep: document.getElementById('f-cilinder-prep').value, hours: document.getElementById('f-cilinder-hours').value, rate: document.getElementById('f-cilinder-rate').value, dodatek: document.getElementById('f-cilinder-dodatek') ? document.getElementById('f-cilinder-dodatek').value : '0', zasek: document.getElementById('f-cilinder-zasek') ? document.getElementById('f-cilinder-zasek').checked : false, izsek: document.getElementById('f-cilinder-izsek') ? document.getElementById('f-cilinder-izsek').checked : false, perforacija: document.getElementById('f-cilinder-perforacija') ? document.getElementById('f-cilinder-perforacija').checked : false, zleb: document.getElementById('f-cilinder-zleb') ? document.getElementById('f-cilinder-zleb').checked : false },
                            ril: { active: document.getElementById('f-ril-active').checked, speed: document.getElementById('f-ril-speed').value, rate: document.getElementById('f-ril-rate').value, hours: document.getElementById('f-ril-hours').value },
                            zgibanje: { active: document.getElementById('f-zgibanje-active').checked, folds: document.getElementById('f-zgibanje-folds').value, speed: document.getElementById('f-zgibanje-speed').value },
                            razrezFormat: { active: document.getElementById('f-razrez-format-active').checked, speed: document.getElementById('f-razrez-format-speed').value, rate: document.getElementById('f-razrez-format-rate').value },
                            razrez: { active: document.getElementById('f-razrez-format-active').checked, speed: document.getElementById('f-razrez-format-speed').value, rate: document.getElementById('f-razrez-format-rate').value },
                            precut: { active: document.getElementById('f-precut-active') ? document.getElementById('f-precut-active').checked : false, prep: document.getElementById('f-precut-prep') ? document.getElementById('f-precut-prep').value : 5.00, per1000: document.getElementById('f-precut-per1000') ? document.getElementById('f-precut-per1000').value : 3.60 },
                            lepljenje: { active: document.getElementById('f-lepljenje-active').checked, prep: document.getElementById('f-lepljenje-prep').value, per1000: document.getElementById('f-lepljenje-per1000').value },
                            spiral: { active: document.getElementById('f-spiral-active').checked, price: document.getElementById('f-spiral-price').value },
                            spiraljenje: { active: document.getElementById('f-spiral-active').checked, price: document.getElementById('f-spiral-price').value },
                            extra: { active: document.getElementById('f-extra-active').checked, speed: document.getElementById('f-extra-speed').value, rate: document.getElementById('f-extra-rate').value, qty: document.getElementById('f-extra-qty') ? document.getElementById('f-extra-qty').value : '' },
                            dodatnaDela: { active: document.getElementById('f-dodatna-dela-active') ? document.getElementById('f-dodatna-dela-active').checked : false, desc: document.getElementById('f-dodatna-dela-desc') ? document.getElementById('f-dodatna-dela-desc').value : '', sheets: document.getElementById('f-dodatna-dela-sheets') ? document.getElementById('f-dodatna-dela-sheets').value : '', kom: document.getElementById('f-dodatna-dela-kom') ? document.getElementById('f-dodatna-dela-kom').value : '', price: document.getElementById('f-dodatna-dela-price') ? document.getElementById('f-dodatna-dela-price').value : 0 },
                            tool: { active: document.getElementById('f-tool-active').checked, cost: document.getElementById('f-tool-cost').value },
                            zasekGrafotehna: { active: document.getElementById('f-zasek-grafotehna-active') ? document.getElementById('f-zasek-grafotehna-active').checked : false, price: document.getElementById('f-zasek-grafotehna-price') ? document.getElementById('f-zasek-grafotehna-price').value : 0.05 },
                            zasek: { active: document.getElementById('f-zasek-grafotehna-active') ? document.getElementById('f-zasek-grafotehna-active').checked : false, price: document.getElementById('f-zasek-grafotehna-price') ? document.getElementById('f-zasek-grafotehna-price').value : 0.05 },
                            uv: { active: document.getElementById('f-uv-active').checked, prep: document.getElementById('f-uv-prep').value, per1000: document.getElementById('f-uv-per1000').value, sides: document.getElementById('f-uv-sides') ? document.getElementById('f-uv-sides').value : '1/0', type: document.getElementById('f-uv-type') ? document.getElementById('f-uv-type').value : 'manual' },
                            uv2: { active: document.getElementById('f-uv2-active') ? document.getElementById('f-uv2-active').checked : false, prep: document.getElementById('f-uv2-prep') ? document.getElementById('f-uv2-prep').value : 90, per1000: document.getElementById('f-uv2-per1000') ? document.getElementById('f-uv2-per1000').value : 25, sides: document.getElementById('f-uv2-sides') ? document.getElementById('f-uv2-sides').value : '1/0', type: document.getElementById('f-uv2-type') ? document.getElementById('f-uv2-type').value : 'manual' },
                            personalization: { active: document.getElementById('f-personalization-active') ? document.getElementById('f-personalization-active').checked : false, price: document.getElementById('f-personalization-price') ? document.getElementById('f-personalization-price').value : 0.03, qty: document.getElementById('f-personalization-qty') ? document.getElementById('f-personalization-qty').value : '', split: document.getElementById('f-personalization-split') ? document.getElementById('f-personalization-split').value : 'auto' },
                            lam: { active: document.getElementById('f-lam-active').checked, type: document.getElementById('f-lam-type') ? document.getElementById('f-lam-type').value : '', sides: document.getElementById('f-lam-sides') ? document.getElementById('f-lam-sides').value : 1, per1000: document.getElementById('f-lam-per1000') ? document.getElementById('f-lam-per1000').value : 0, prep: document.getElementById('f-lam-prep') ? document.getElementById('f-lam-prep').value : 0 },
                            delivery: { active: document.getElementById('f-delivery-active').checked, count: document.getElementById('f-post-count').value, pricePer: document.getElementById('f-post-price-per').value },
                            delFixed: { active: document.getElementById('f-del-fixed-active').checked, price: document.getElementById('f-del-fixed-price').value },
                                                        deliveryFixed: { active: document.getElementById('f-del-fixed-active').checked, price: document.getElementById('f-del-fixed-price').value }
                        }
                    },
                    quoteBasket: (typeof quoteBasket !== 'undefined') ? quoteBasket : []
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

                try {
                    const srvUrl = await getServerBaseUrl();
                    const srvRes = await fetch(srvUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ type: 'json', filename: suggestedName, content: jsonStr })
                    });
                    if (srvRes.ok) {
                        const srvData = await srvRes.json();
                        if (srvData.status === 'success') {
                            if (typeof refreshDiskProjects === 'function') await refreshDiskProjects();
                            if (typeof renderSavedProjects === 'function') renderSavedProjects();
                            let wordSavedName = await autoSaveQuoteWordToServer(suggestedName);
                            const currYr = new Date().getFullYear();
                            if (wordSavedName) {
                                alert("✓ Shranjeno v srečko-server:\n\n• Kalkulacija (PONUDBE TEST):\n  " + suggestedName + "\n\n• Word ponudba (PONUDBE " + currYr + "):\n  " + wordSavedName);
                            } else {
                                alert("✓ Shranjeno v srečko-server (ponudbe test):\nDatoteka: " + suggestedName);
                            }
                            return;
                        }
                    }
                } catch (srvErr) {
                    console.log("Srečko-server save error:", srvErr);
                }

                if (typeof g_projectsDirHandle !== 'undefined' && g_projectsDirHandle) {
                    try {
                        const fileHandle = await g_projectsDirHandle.getFileHandle(suggestedName, { create: true });
                        const writable = await fileHandle.createWritable();
                        await writable.write(jsonStr);
                        await writable.close();

                        // Posodobi indeksno datoteko na strežniku
                        try {
                            let sf = '';
                            let preset = document.getElementById('calc-source-presets')?.value;
                            let sw = document.getElementById('calc-source-w')?.value;
                            let sh = document.getElementById('calc-source-h')?.value;
                            if (preset && preset !== 'custom') sf += ` ${preset}`;
                            if (sw && sh) sf += ` (${sw}x${sh})`;
                            let totalStr = document.getElementById('res-total')?.innerText?.trim() || '-';
                            if (typeof updateIndexWithProject === 'function') {
                                await updateIndexWithProject({
                                    name: suggestedName,
                                    customer: customer,
                                    quoteNum: quoteNum,
                                    date: new Date().toLocaleDateString('sl-SI'),
                                    total: totalStr,
                                    sourceFormat: sf.trim(),
                                    isPola: true,
                                    mtime: Date.now()
                                });
                            }
                        } catch(idxErr) { console.warn("Index update error:", idxErr); }

                        if (typeof renderSavedProjects === 'function') renderSavedProjects();
                        alert("✓ Shranjeno v povezano mapo: [" + (g_projectsDirHandle ? g_projectsDirHandle.name : "omrežna mapa") + "]\nDatoteka: " + suggestedName);
                        return;
                    } catch (dirErr) {
                        console.log("Direct folder handle write error:", dirErr);
                    }
                }
                if (window.showSaveFilePicker) {
                    try {
                        const handle = await window.showSaveFilePicker({
                            suggestedName: suggestedName,
                            types: [{ description: 'Tiskovna Pola JSON', accept: { 'application/json': ['.json'] } }],
                        });
                        g_lastSaveHandle = handle;
                        const writable = await handle.createWritable();
                        await writable.write(jsonStr);
                        await writable.close();
                        alert("Datoteka uspešno shranjena!");
                        return;
                    } catch (e) {
                        if (e.name === 'AbortError') return;
                        if (e.name === 'SecurityError' || (e.message && (e.message.includes('sub frames') || e.message.includes('Cross origin')))) {
                            // Samodejni fallback na Blob prenos brez opozorila o napaki
                            const blob = new Blob([jsonStr], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = suggestedName;
                            document.body.appendChild(a); a.click();
                            setTimeout(() => { document.body.removeChild(a); window.URL.revokeObjectURL(url); }, 100);
                            return;
                        }
                        alert("Napaka pri shranjevanju: " + e.message);
                    }
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
        function printQuote() {
            try {
                const html = getQuoteHTML(false, '', false, false);
                const printWin = window.open('', '_blank', 'width=950,height=900');
                if (!printWin) {
                    alert("Pojavno okno je bilo blokirano.");
                    return;
                }
                printWin.document.write(html);
                printWin.document.close();
                setTimeout(() => { printWin.focus(); }, 200);
            } catch (e) { alert("Napaka pri pripravi ponudbe: " + e.message); }
        }

        function printQuoteAT() {
            try {
                const html = getQuoteHTML(false, '', false, true);
                const printWin = window.open('', '_blank', 'width=950,height=900');
                if (!printWin) {
                    alert("Pojavno okno je bilo blokirano.");
                    return;
                }
                printWin.document.write(html);
                printWin.document.close();
                setTimeout(() => { printWin.focus(); }, 200);
            } catch (e) { alert("Napaka pri pripravi ponudbe (AT): " + e.message); }
        }

        function printWorkOrder() {
            try {
                const html = getWorkOrderHTML();
                const printWin = window.open('', '_blank', 'width=950,height=900');
                if (!printWin) {
                    alert("Pojavno okno je bilo blokirano.");
                    return;
                }
                printWin.document.write(html);
                printWin.document.close();
                setTimeout(() => { printWin.focus(); }, 200);
            } catch (e) { alert("Napaka pri pripravi naloga: " + e.message); }
        }

        function formatQuoteColor(val, isAT = false) {
            if (!val || val === '/' || val === 'Brez tiska' || val === '0/0' || val === '0 / 0') {
                return (isAT && val === 'Brez tiska') ? 'Ohne Druck' : (val || '/');
            }
            let cleaned = String(val).replace(/\s*\b(color|skala)\b/gi, '').trim();
            let res = cleaned.replace(/(\d+)\s*\/\s*(\d+)/g, function(match, fStr, bStr) {
                let f = parseInt(fStr, 10);
                let b = parseInt(bStr, 10);
                let base = f + '/' + b;
                if (f === 4 || b === 4) {
                    return base + ' ' + (isAT ? 'Skala' : 'color');
                }
                return base;
            });
            if (isAT) {
                res = res.replace(/\s*\b(ŠV|OB)\b/g, '').replace(/\bmutacija\b/gi, 'Mutation').trim();
            }
            return res;
        }

        const LOGO_PETRIC_BASE64 = "data:image/png;base64,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";

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
                    results.push(calculateForSingleQty(q, undefined, undefined, undefined, oqVal, idx));
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
                        <div class="footer">Datum: ${date} | Pripravil: ${preparedBy}<br><span style="color: red; font-weight: bold; font-size: 11pt;">INTERNI DOKUMENT - TISKARNA PETRIČ</span></div>
                    

</body></html>`;
            }
            // GENERATE MULTI-ITEM QUOTE
            let itemsHtml = itemsToPrint.map(item => {
                let specFinishing = (item.spec && item.spec.finishing) ? item.spec.finishing : (item.finishingText || (item.options ? item.options.join(', ') : ''));
                if (isAT && specFinishing) {
                    specFinishing = specFinishing
                        .replace(/Cilinder/gi, 'Zylinder')
                        .replace(/Zasek/gi, 'Anstanzen')
                        .replace(/Izsek/gi, 'Stanzen')
                        .replace(/Perforacija/gi, 'Perforation')
                        .replace(/Žleb|Zleb/gi, 'Rillen')
                        .replace(/Ril - rilmašina/gi, 'Rillen')
                        .replace(/x zgibano/gi, 'x gefalzt')
                        .replace(/Zgibanje/gi, 'Falzen')
                        .replace(/Razrez/gi, 'Zuschnitt')
                        .replace(/razrez na format/gi, 'Zuschnitt auf Format')
                        .replace(/Lepljenje/gi, 'Kleben')
                        .replace(/lepljenje blokov/gi, 'Blockleimung')
                        .replace(/šivanje/gi, 'Heftung')
                        .replace(/Špiraljenje \/ Vrvice/gi, 'Spiralbindung / Schnüre')
                        .replace(/Špiraljenje/gi, 'Spiralbindung')
                        .replace(/Vrvice/gi, 'Schnüre')
                        .replace(/Ročno delo/gi, 'Handarbeit')
                        .replace(/Orodje/gi, 'Stanzen mit Werkzeug')
                        .replace(/UV lak/gi, 'UV-Lack')
                        .replace(/Plastifikacija/gi, 'Cellophanierung')
                        .replace(/Dostava/gi, 'Lieferung');
                }
                let priceRowsHTML = (item.quantities && Array.isArray(item.quantities)) ? item.quantities.map(q => {
                    let formattedBreakdown = formatMutationBreakdownDisplay(item.mutBreakdown, isAT);
                    let unitPrice = q.pricePerUnit !== undefined ? q.pricePerUnit : (q.perItem || 0);
                    return `
                    <tr>
                        <td style="font-weight: bold; padding: 4px;">${formatQty(q.qty)} ${isAT ? 'Stk.' : 'kos'}${formattedBreakdown ? `<br><span style="font-size: 11pt; font-weight: 500; color: #1e293b; display: block; margin-top: 2px;">(${formattedBreakdown})</span>` : ''}</td>
                        <td style="padding: 4px;">${formatPrice(unitPrice, 4)}</td>
                        <td style="padding: 4px;">${formatPrice(unitPrice * 1000, 2)}</td>
                        <td style="font-weight: bold; text-align: right; padding: 4px;">${formatPrice(q.priceTotal !== undefined ? q.priceTotal : (q.total || 0), 2)}</td>
                    </tr>`;
                }).join('') : '<tr><td colspan="4" style="padding:4px; color:red;">Manjkajoči podatki o ceni</td></tr>';

                let itemDelivery = item.deliveryAddress || deliveryAddress;
                let deliveryRowHtml = itemDelivery ? `<tr><td style="width: 100px; font-weight: bold; font-size: 15px; vertical-align: top;">${isAT ? 'Lieferung:' : 'Dostava:'}</td><td style="font-size: 15px; font-weight: bold; vertical-align: top;">${itemDelivery.replace(/\n/g, '<br>')}</td></tr>` : '';
                let finishingRowHtml = specFinishing ? `<tr><td style="width: 100px; font-weight: bold; font-size: 15px; vertical-align: top;">${isAT ? 'Verarbeitung:' : 'Dodel.:'}</td><td style="font-size: 15px; font-weight: bold; vertical-align: top;">${specFinishing}</td></tr>` : '';

                const isBlockType = !!(item.formatLeaves || item.extentText || item.paperLeaves || (item.type && item.type.toLowerCase().includes('blok')));
                let specRowsHtml = '';

                if (isBlockType) {
                    let projName = item.projectName || item.name || 'Blok';
                    let fLeaves = item.formatLeaves || item.size || '/';
                    if (fLeaves !== '/' && !fLeaves.includes('mm') && !fLeaves.includes('x')) fLeaves += ' mm';
                    let fCover = (item.formatCover && item.formatCover !== '/' && item.formatCover !== '0x0' && item.formatCover !== 'Brez ovitka') ? item.formatCover : '';
                    if (fCover && !fCover.includes('mm') && !fCover.includes('x')) fCover += ' mm';
                    let eText = item.extentText || '';
                    let pLeaves = item.paperLeaves || (item.spec && item.spec.paper ? item.spec.paper : (item.paper || ''));
                    let pCover = (item.paperCover && item.paperCover !== '/' && item.paperCover !== 'Brez ovitka') ? item.paperCover : '';
                    let tLeaves = item.tiskLeaves ? formatQuoteColor(item.tiskLeaves, isAT) : '';
                    let tCover = (item.tiskCover && item.tiskCover !== '/' && item.tiskCover !== '0/0' && item.tiskCover !== 'Brez tiska') ? formatQuoteColor(item.tiskCover, isAT) : '';

                    specRowsHtml = `
                        <tr><td style="width: 100px; font-weight: bold; font-size: 15px; vertical-align: top;">${isAT ? 'Produkt:' : 'Izdelek:'}</td><td style="font-size: 15px; font-weight: bold; vertical-align: top;">${projName}</td></tr>
                        <tr><td style="width: 100px; font-weight: bold; font-size: 15px; vertical-align: top;">${isAT ? 'Format Blätter:' : 'Format listov:'}</td><td style="font-size: 15px; font-weight: bold; vertical-align: top;">${fLeaves}</td></tr>
                        ${fCover ? `<tr><td style="width: 100px; font-weight: bold; font-size: 15px; vertical-align: top;">${isAT ? 'Format Umschlag:' : 'Format ovitka:'}</td><td style="font-size: 15px; font-weight: bold; vertical-align: top;">${fCover}</td></tr>` : ''}
                        ${eText ? `<tr><td style="width: 100px; font-weight: bold; font-size: 15px; vertical-align: top;">${isAT ? 'Umfang:' : 'Obseg:'}</td><td style="font-size: 15px; font-weight: bold; vertical-align: top;">${eText}</td></tr>` : ''}
                        ${pLeaves ? `<tr><td style="width: 100px; font-weight: bold; font-size: 15px; vertical-align: top;">${isAT ? 'Papier Blätter:' : 'Papir listov:'}</td><td style="font-size: 15px; font-weight: bold; vertical-align: top;">${pLeaves}</td></tr>` : ''}
                        ${pCover ? `<tr><td style="width: 100px; font-weight: bold; font-size: 15px; vertical-align: top;">${isAT ? 'Papier Umschlag:' : 'Papir ovitka:'}</td><td style="font-size: 15px; font-weight: bold; vertical-align: top;">${pCover}</td></tr>` : ''}
                        ${tLeaves ? `<tr><td style="width: 100px; font-weight: bold; font-size: 15px; vertical-align: top;">${isAT ? 'Druck Blätter:' : 'Tisk listov:'}</td><td style="font-size: 15px; font-weight: bold; vertical-align: top;">${tLeaves}</td></tr>` : ''}
                        ${tCover ? `<tr><td style="width: 100px; font-weight: bold; font-size: 15px; vertical-align: top;">${isAT ? 'Druck Umschlag:' : 'Tisk ovitka:'}</td><td style="font-size: 15px; font-weight: bold; vertical-align: top;">${tCover}</td></tr>` : ''}
                        ${finishingRowHtml}
                        ${deliveryRowHtml}
                    `;
                } else {
                    let projName = item.name || item.projectName || '/';
                    let fText = (item.spec && item.spec.format) ? item.spec.format : (item.format || '/');
                    let pText = (item.spec && item.spec.paper) ? item.spec.paper : (item.paper || '');
                    let tText = (item.spec && item.spec.colors) ? formatQuoteColor(item.spec.colors, isAT) : (item.colors || item.tisk ? formatQuoteColor(item.colors || item.tisk, isAT) : '/');

                    specRowsHtml = `
                        <tr><td style="width: 100px; font-weight: bold; font-size: 15px; vertical-align: top;">${isAT ? 'Produkt:' : 'Izdelek:'}</td><td style="font-size: 15px; font-weight: bold; vertical-align: top;">${projName}</td></tr>
                        <tr><td style="width: 100px; font-weight: bold; font-size: 15px; vertical-align: top;">Format:</td><td style="font-size: 15px; font-weight: bold; vertical-align: top;">${fText}</td></tr>
                        ${pText ? `<tr><td style="width: 100px; font-weight: bold; font-size: 15px; vertical-align: top;">${isAT ? 'Papier:' : 'Papir:'}</td><td style="font-size: 15px; font-weight: bold; vertical-align: top;">${pText}</td></tr>` : ''}
                        <tr><td style="width: 100px; font-weight: bold; font-size: 15px; vertical-align: top;">${isAT ? 'Druck:' : 'Tisk:'}</td><td style="font-size: 15px; font-weight: bold; vertical-align: top;">${tText}</td></tr>
                        ${finishingRowHtml}
                        ${deliveryRowHtml}
                    `;
                }

                return `
                    <div style="font-family: Arial, sans-serif; font-size: 11pt; margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 8px;">
                        <table style="width: 100%; border-collapse: collapse;" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="width: 15%; vertical-align: top; border-right: 1px solid #ddd; padding-right: 5px;">
                                    <span style="font-size: 8pt; color: #555; text-transform: uppercase;">${isAT ? 'Številka artikla:' : 'Šifra izdelka:'}</span><br>
                                    <span style="font-family: Arial, sans-serif; font-size: 11pt; font-weight: bold; margin-top: 5px; display: block;">${item.productCode || item.materialCode || item.coverMaterialCode || '/'}</span>
                                </td>
                                <td style="width: 85%; vertical-align: top; padding-left: 10px;">
                                    <table style="width: 100%; border-collapse: collapse;">
                                        ${specRowsHtml}
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; text-align: center; border-top: 1px solid #000; border-bottom: 1px solid #000;">
                            <tr><th style="padding: 4px; border-bottom: 1px solid #000; font-size: 11pt; font-family: Arial, sans-serif;">${isAT ? 'Auflage' : 'Naklada'}</th><th style="padding: 4px; border-bottom: 1px solid #000; font-size: 11pt; font-family: Arial, sans-serif;">${isAT ? 'Preis/ Stk.' : 'Cena/Kom.'}</th><th style="padding: 4px; border-bottom: 1px solid #000; font-size: 11pt; font-family: Arial, sans-serif;">${isAT ? 'Preis/ 1000 Stk.' : 'Cena/1000 Kom.'}</th><th style="padding: 4px; border-bottom: 1px solid #000; font-size: 11pt; font-family: Arial, sans-serif; text-align: right;">${isAT ? 'Gesamt Preis:' : 'Cena skupno:'}</th></tr>
                            ${priceRowsHTML}
                        </table>
                    </div>
                `;
            }).join('');
            const defaultContent = `
                    <div style="font-family: Arial, sans-serif; font-size: 11pt; color: #000;">
<table style="width: 100%; margin-bottom: 15px; border-bottom: 2px solid #f99c26; padding-bottom: 5px;" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="width: 32%; vertical-align: middle;">
                                <img src="${LOGO_PETRIC_BASE64}" width="165" height="69" style="width: 165px; height: 69px; max-width: 100%; object-fit: contain; display: block;" alt="Tiskarna Petrič">
                            </td>
                            <td style="width: 25%; vertical-align: middle; border-left: 2px solid #f99c26; padding-left: 15px; font-size: 9px; color: #8c8f91; font-style: italic;"><strong>Tiskarna Petrič d.o.o.</strong><br>Tovarniška cesta 8<br>3210 Slovenske Konjice<br>ID za DDV: SI50694014</td>
                            <td style="width: 20%; vertical-align: middle; border-left: 2px solid #f99c26; padding-left: 15px; font-size: 9px; color: #8c8f91; font-style: italic;">T: 03 757 25 56<br>F: 03 757 25 63<br>Mat. št.: 6889433</td>
                            <td style="width: 23%; vertical-align: bottom; border-left: 2px solid #f99c26; padding-left: 15px; padding-bottom: 5px; font-size: 18px; font-weight: bold; color: #f99c26; font-style: italic;">vse stiska</td>
                        </tr>
                    </table>
                    <table style="width: 100%; margin-bottom: 5px;" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="width: 50%; vertical-align: top;"><span style="font-size: 11pt;"><strong>${customer}</strong></span><br>${custAddress ? custAddress.replace(/\n/g, '<br>') + '<br>' : ''}${custEmail ? custEmail + '<br>' : ''}</td>
                            <td style="width: 50%; vertical-align: top;" align="right"><table class="info-table" cellpadding="0" cellspacing="0"><tr><td>Datum</td><td>${date}</td></tr><tr><td>${isAT ? 'Kunde' : 'Šifra stranke'}</td><td>${customerCode}</td></tr><tr><td>${isAT ? 'Angebot' : 'Ponudba'}</td><td>${quoteNum}</td></tr>${orderType ? `<tr><td>Tip naloga</td><td style="color:#ef4444; font-weight:bold;">${orderType}</td></tr>` : ''}</table></td>
                        </tr>
                    </table>
                    <h1 style="font-size: 18pt; font-weight: bold; margin-top: 10px; margin-bottom: 5px; letter-spacing: 1px; border-bottom: 1px solid #000; padding-bottom: 3px; line-height: 1.1; mso-margin-top-alt: 6pt; mso-margin-bottom-alt: 3pt;">${isAT ? 'ANGEBOT' : 'PONUDBA'}</h1>
                    <p style="margin: 4px 0; mso-margin-top-alt: 0pt; mso-margin-bottom-alt: 0pt;">${isAT ? 'Herzlichen Dank für Ihr Interesse. Wir können Ihnen folgendes anbieten:' : 'Zahvaljujemo se Vam za Vaše povpraševanje in Vam ponujamo naslednje:'}</p>
                    ${itemsHtml}
                    ${isAT ? '<p style="margin: 4px 0; font-weight: bold; text-decoration: underline; text-align: center; mso-margin-top-alt: 0pt; mso-margin-bottom-alt: 0pt;">Voraussetzung: Kunde liefert druckfertige Daten</p>' : '<p style="margin: 4px 0; mso-margin-top-alt: 0pt; mso-margin-bottom-alt: 0pt;"><strong>Predloga:</strong> Naročnik dostavi visokoresolucijski PDF z dodatkom za obrez!</p>'}
                    <p class="notes" style="margin-top: 8px; text-align: justify; font-size: 9px; line-height: 1.15; color: #444; mso-margin-top-alt: 0pt; mso-margin-bottom-alt: 0pt;">${isAT ? 'Dieses Angebot ist gültig für 30 Tage. Zahlung erfolgt nach 30 Tagen ab Lieferung der Ware. Wir danken Ihnen für Ihre mögliche Bestellung, and wünschen Ihnen einen angenehmen Tag.' : 'Opcijski rok ponudbe je 30 dni. V ceni ni vračunan DDV. Rok plačila 30 dni po prejemu tiskovin. Ponudba je izdelana na osnovi znanih tehničnih podatkov in cen repromaterialov. V primeru odstopanja od zgoraj navedenih parametrov se cena izdelave lahko kadarkoli naknadno popravi.'}</p>
                    <div style="margin-top: 8px; font-family: Arial, sans-serif; font-size: 9pt; font-style: italic;">${isAT ? 'Dieses Angebot hat für Sie erstellt:' : 'Kalkulacijo pripravil:'} ${preparedBy}</div>
            </div>
`;
            let contentToRender = (isAT && typeof g_editedQuoteATHTML !== 'undefined' && g_editedQuoteATHTML) ? g_editedQuoteATHTML :
                (!isAT && typeof g_editedQuoteHTML !== 'undefined' && g_editedQuoteHTML) ? g_editedQuoteHTML : defaultContent;

            if (contentToRender) {
                contentToRender = contentToRender.replace(/(<td[^>]*>(?:Tisk[^<]*|Druck[^<]*)<\/td>\s*<td[^>]*>)(.*?)(<\/td>)/gi, function(match, td1, colorVal, td2) {
                    return td1 + formatQuoteColor(colorVal, isAT) + td2;
                });
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
                    @page { size: A4 portrait; margin: 5mm 10mm 10mm 10mm; } @page WordSection1 { size: 595.3pt 841.9pt; margin: 14.2pt 28.35pt 28.35pt 28.35pt; mso-header-margin: 0pt; mso-footer-margin: 0pt; } div.WordSection1 { page: WordSection1; }
                    body, table, td, p, h1, h2, h3 { font-family: 'Arial', sans-serif; line-height: 1.15; font-size: 11pt; color: #000; }
                    p, div, td, th { mso-margin-top-alt: 0pt; mso-margin-bottom-alt: 0pt; }
                    p { margin: 3px 0; }
                    .info-table { border-collapse: collapse; margin-left: auto; margin-right: 0; }
                    .info-table td { padding: 1px 0 1px 15px; text-align: right; }
                    .info-table td:first-child { font-weight: normal; color: #555; }
                    .info-table td:last-child { font-weight: bold; }
                    h1 { font-size: 18pt; font-weight: bold; margin-top: 10px; margin-bottom: 5px; letter-spacing: 1px; border-bottom: 1px solid #000; padding-bottom: 3px; line-height: 1.1; mso-margin-top-alt: 6pt; mso-margin-bottom-alt: 3pt; }
                    .notes { margin-top: 8px; text-align: justify; font-size: 9px; line-height: 1.15; color: #444; }
                    @media print {
                        .no-print { display: none !important; }
                        html, body { width: 100% !important; margin: 0 !important; padding: 0 !important; }
                        .editable-area { width: 100% !important; max-width: 210mm !important; box-sizing: border-box !important; padding: 0 !important; height: auto !important; overflow: visible !important; }
                    }
                    .editable-area { max-width: 210mm; width: 100%; margin: 0 auto; box-sizing: border-box; height: auto; overflow: visible; }
                    .editable-area:focus { outline: 2px dashed #f99c26; background-color: #fffbeb; }
                    .editable-area p, .editable-area div:not(.header-top) { margin: 0; padding: 0; }
                    .editable-area.waiting-for-paste { cursor: cell !important; outline: 3px dashed #eab308 !important; background-color: #fffbeb !important; }
</style>
            </head>
                <body>
                    ${!isWord ? `
                    <div class="no-print" contenteditable="false" style="background: #f1f5f9; padding: 10px; border-bottom: 1px solid #cbd5e1; display: flex; gap: 15px; align-items: center; justify-content: start; font-family: sans-serif; box-sizing: border-box; width: 100%;">
                        <button onclick="window.print()" style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 11pt;">NATISNI PONUDBO</button>
                        <button onclick="window.close()" style="background: #64748b; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 11pt;">ZAPRI</button>
                        <button onclick="if(confirm('Ali želite ponastaviti ponudbo na privzete vrednosti? (Spremembe besedila bodo izgubljene)')){ if(window.opener){ window.opener.${editedHTMLVar}=''; const newHtml = window.opener.getQuoteHTML(false, '', false, ${isAT}); document.open(); document.write(newHtml); document.close(); } }" style="background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 11pt;">PONASTAVI</button>
                    <button id="btn-move-text" onclick="toggleMoveMode(this)" style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 11pt;" title="Premakni označeno besedilo na drugo mesto. Označite besedilo, kliknite ta gumb in nato kliknite na novo mesto v besedilu.">PREMAKNI</button>
                    <button onclick="saveQuoteToDisk()" style="background: #8b5cf6; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 11pt;" title="Shrani to ponudbo v Word (.doc) formatu na računalnik">SHRANI PONUDBO (WORD)</button>
                        <div style="display: flex; gap: 4px; align-items: center; background: #cbd5e1; padding: 3px; border-radius: 6px;">
                            <button onclick="document.execCommand('bold', false, null)" style="background: white; border: none; border-radius: 4px; width: 28px; height: 28px; font-weight: bold; cursor: pointer; color: #000; font-size: 11pt;" title="Krepko (Bold)">B</button>
                            <button onclick="document.execCommand('italic', false, null)" style="background: white; border: none; border-radius: 4px; width: 28px; height: 28px; font-style: italic; cursor: pointer; color: #000; font-size: 11pt; font-family: Georgia, serif;" title="Ležeče (Italic)">I</button>
                            <button onclick="document.execCommand('underline', false, null)" style="background: white; border: none; border-radius: 4px; width: 28px; height: 28px; text-decoration: underline; cursor: pointer; color: #000; font-size: 11pt;" title="Podčrtano (Underline)">U</button>
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
                    <div class="editable-area${isWord ? ' WordSection1' : ''}" ${!isWord ? 'contenteditable="true"' : ''} style="max-width: 210mm; margin: 0 auto; padding: ${isWord ? '0' : '20px 30px'};">
                        ${contentToRender}
                    </div>
                    <script>
        var g_lastSaveHandle = null;
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

                        function downloadWordDoc(filename, htmlContent) {
            try {
                let name = filename || 'dokument';
                if (!name.endsWith('.doc')) name += '.doc';
                let fullHtml = "<!DOCTYPE html><html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>" + name + "</title><style>body { font-family: Arial, sans-serif; margin: 0; padding: 10px; } table { width: 100%; border-collapse: collapse; } td, th { padding: 4px; }</style></head><body>" + htmlContent + "</body></html>";
                let base64 = btoa(unescape(encodeURIComponent('\ufeff' + fullHtml)));
                let dataUri = 'data:application/msword;base64,' + base64;
                let a = document.createElement('a');
                a.href = dataUri;
                a.download = name;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => { if (a.parentNode) a.parentNode.removeChild(a); }, 300);
            } catch (e) {
                alert("Napaka pri prenosu Word datoteke: " + e.message);
            }
        }
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
                                var htmlContent = "<!DOCTYPE html><html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>" + fileName + "</title><style>body { font-family: Arial, sans-serif; font-size: 11pt; margin: 0; padding: 10px; } table { width: 100%; border-collapse: collapse; } td, th { padding: 4px; }</style></head><body>" + content + "</body></html>";
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
                                var htmlContent = "<!DOCTYPE html><html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>" + fileName + "</title><style>body { font-family: Arial, sans-serif; font-size: 11pt; margin: 0; padding: 10px; } table { width: 100%; border-collapse: collapse; } td, th { padding: 4px; }</style></head><body>" + content + "</body></html>";
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
            // Kalkulacije so namenjene izkliučno vpogledu v zalogo (brez samodejnega odpisa materiala)
            console.log('Vpogled v zalogo: odpis je izklopljen.');
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
            let materialCode = document.getElementById('calc-material-code') ? document.getElementById('calc-material-code').value.trim() : "";
            const monthNamesSl = [
                "januar", "februar", "marec", "april", "maj", "junij",
                "julij", "avgust", "september", "oktober", "november", "december"
            ];
            let nowDate = new Date();
            let date = `${nowDate.getDate()}. ${monthNamesSl[nowDate.getMonth()]} ${nowDate.getFullYear()}`;

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
            if (isSV) { tiskMode = "Šen Vider (1 prehod obojestransko)"; } else if (isObrat) { tiskMode = "obračanje"; } else if (back > 0) { tiskMode = "prvi/drugi (2 prehoda)"; }
            let prepPasses = front > 0 ? (Math.ceil(front / 4) + (back > 0 ? Math.ceil(back / 4) : 0)) : 1;
            let colorMode = front + '/' + (isObrat ? 'OB' : back);
            let rule = prepRules[colorMode] || { passes: prepPasses };
            let mPasses = isSV ? 1 : rule.passes;
            const manualPassesSelect = document.getElementById('calc-machine-passes');
            if (manualPassesSelect && manualPassesSelect.value !== 'auto') {
                const pVal = parseInt(manualPassesSelect.value);
                if (pVal === 1) tiskMode = "1 prehod (ročno)";
                else if (pVal === 2) tiskMode = "2 prehoda (ročno)";
                else if (pVal === 3) tiskMode = "3 prehodi (ročno)";
                else if (pVal === 4) tiskMode = "4 prehodi (ročno)";
                mPasses = pVal;
            }
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
                    <table style="border-collapse: collapse; font-size: 11pt; margin-bottom: 2px;">
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

            if (isChecked('f-ril-active')) {
                let rSpeed = parseFloat(document.getElementById('f-ril-speed').value) || 1200;
                let rHours = roundUpTime(calcRes.qty / rSpeed);
                let rilQtyStr = `${calcRes.qty.toLocaleString('de-DE')} kos`;
                finishingRowsHtml += `
                    <tr>
                        <td style="width: 15%;">Ril - rilmašina:</td>
                        <td style="width: 35%;" class="bold">${rilQtyStr}</td>
                        <td style="width: 50%; text-align: right;" class="bold"><span class="bold">delo:</span> ${rHours.toFixed(1).replace('.', ',')} h</td>
                    </tr>`;
            }
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
                let cilPhases = [];
                if (isChecked('f-cilinder-zasek')) cilPhases.push('zasek');
                if (isChecked('f-cilinder-izsek')) cilPhases.push('izsek');
                if (isChecked('f-cilinder-perforacija')) cilPhases.push('perforacija');
                if (isChecked('f-cilinder-zleb')) cilPhases.push('žleb');
                let cilLabel = cilPhases.length > 0 ? `Cilinder (${cilPhases.join(', ')}):` : 'Cilinder:';
                finishingRowsHtml += `
                    <tr>
                        <td style="width: 15%;">${cilLabel}</td>
                        <td style="width: 35%;" class="bold">${cilQtyStr}</td>
                        <td style="width: 50%; text-align: right;" class="bold"><span class="bold">priprava:</span> ${cPrepStr} &nbsp;&nbsp;&nbsp;&nbsp; <span class="bold">tisk:</span> ${cPrintHours.toFixed(1).replace('.', ',')} h</td>
                    </tr>`;
            }
            if (isChecked('f-zgibanje-active')) {
                let zSpeed = parseFloat(document.getElementById('f-zgibanje-speed').value) || 10800;
                let ips = parseFloat(itemsPerSheet) || 1;
                let zgibNetItems = calcRes.qty;
                let zHours = roundUpTime(zgibNetItems / zSpeed);
                let folds = document.getElementById('f-zgibanje-folds') ? document.getElementById('f-zgibanje-folds').value : '1';
                let zgibQtyStr = (ips > 1)
                    ? `${zgibNetItems.toLocaleString('de-DE')} kos`
                    : `${calcRes.sheetsNeeded.toLocaleString('de-DE')} pol`;
                finishingRowsHtml += `
                    <tr>
                        <td style="width: 15%;">Zgibanje (${folds}x):</td>
                        <td style="width: 35%;" class="bold">${zgibQtyStr}</td>
                        <td style="width: 50%; text-align: right;" class="bold"><span class="bold">tisk:</span> ${zHours.toFixed(1).replace('.', ',')} h</td>
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
                let workQty = q;
                if (document.getElementById('f-extra-qty')) {
                    let customQty = parseInt(document.getElementById('f-extra-qty').value) || 0;
                    if (customQty > 0) workQty = customQty;
                }
                let extraHours = roundUpTime(workQty / extraSpeed);
                let qtyNote = (document.getElementById('f-extra-qty') && parseInt(document.getElementById('f-extra-qty').value) > 0) ? ` (${workQty.toLocaleString('de-DE')} kos)` : '';
                finishingRowsHtml += `
                    <tr>
                        <td style="width: 15%;">Ročno delo${qtyNote}:</td>
                        <td style="width: 35%;"></td>
                        <td style="width: 50%; text-align: right;" class="bold"><span class="bold">delo:</span> ${extraHours.toFixed(1).replace('.', ',')} h</td>
                    </tr>`;
            }
            if (isChecked('f-dodatna-dela-active')) {
                let dDesc = document.getElementById('f-dodatna-dela-desc') ? document.getElementById('f-dodatna-dela-desc').value.trim() : '';
                let dSheets = parseFloat((document.getElementById('f-dodatna-dela-sheets')?.value || '').replace(',', '.')) || 0;
                let dKom = parseFloat((document.getElementById('f-dodatna-dela-kom')?.value || '').replace(',', '.')) || 0;
                let parts = [];
                if (dSheets > 0) parts.push(`${dSheets.toLocaleString('de-DE')} pol`);
                if (dKom > 0) parts.push(`${dKom.toLocaleString('de-DE')} kos`);
                let infoStr = parts.length > 0 ? parts.join(', ') : '';
                let labelText = dDesc ? `Dodatna dela (${dDesc}):` : 'Dodatna dela:';
                finishingRowsHtml += `
                    <tr>
                        <td style="width: 15%;">${labelText}</td>
                        <td style="width: 35%;" class="bold">${infoStr}</td>
                        <td style="width: 50%; text-align: right;" class="bold">/</td>
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
                let uvSidesSelect = document.getElementById('f-uv-sides');
                let uvSidesText = uvSidesSelect ? uvSidesSelect.value : '1/0';
                let uvTypeSelect = document.getElementById('f-uv-type');
                let uvTypeText = uvTypeSelect ? uvTypeSelect.options[uvTypeSelect.selectedIndex].text : '';
                let uvFormat = document.getElementById('f-uv-format') ? document.getElementById('f-uv-format').value : 'auto';
                let uvCutFactor = getUVSheetFactor(sheetW || g_lastSheetW || 700, sheetH || g_lastSheetH || 500, uvFormat);
                let uvDisplayInfo = (uvCutFactor === -1) ? `<span style="background:#fee2e2; color:#dc2626; border:1px solid #ef4444; padding:3px 8px; border-radius:4px; font-weight:bold; display:inline-block;">⚠️ POLA NI ZA LAKIRATI (NAPAČEN FORMAT)</span>` : `${uvTypeText} (${uvSidesText})`;
                finishingRowsHtml += `
                    <tr>
                        <td style="width: 15%;">UV lak (tuja):</td>
                        <td style="width: 35%;" class="bold">${uvDisplayInfo}</td>
                        <td style="width: 50%; text-align: right;" class="bold">/</td>
                    </tr>`;
            }
            if (isChecked('f-uv2-active')) {
                let uvSidesSelect = document.getElementById('f-uv2-sides');
                let uvSidesText = uvSidesSelect ? uvSidesSelect.value : '1/0';
                let uvTypeSelect = document.getElementById('f-uv2-type');
                let uvTypeText = uvTypeSelect ? uvTypeSelect.options[uvTypeSelect.selectedIndex].text : '';
                let uvFormat = document.getElementById('f-uv2-format') ? document.getElementById('f-uv2-format').value : 'auto';
                let uvCutFactor = getUVSheetFactor(sheetW || g_lastSheetW || 700, sheetH || g_lastSheetH || 500, uvFormat);
                let uvDisplayInfo = (uvCutFactor === -1) ? `<span style="background:#fee2e2; color:#dc2626; border:1px solid #ef4444; padding:3px 8px; border-radius:4px; font-weight:bold; display:inline-block;">⚠️ POLA NI ZA LAKIRATI (NAPAČEN FORMAT)</span>` : `${uvTypeText} (${uvSidesText})`;
                finishingRowsHtml += `
                    <tr>
                        <td style="width: 15%;">UV lak 2 (tuja):</td>
                        <td style="width: 35%;" class="bold">${uvDisplayInfo}</td>
                        <td style="width: 50%; text-align: right;" class="bold">/</td>
                    </tr>`;
            }
            if (isChecked('f-personalization-active')) {
                let persSidesSelect = document.getElementById('f-personalization-sides');
                let persSidesText = persSidesSelect ? persSidesSelect.value : '1/0';
                let currentMType = (d && d.print && d.print.mType) ? d.print.mType : '';
                let itemsCount = calcRes.itemsPerSheet || 1;
                let splitInfo = getPersonalizationSplitInfo(sheetW, sheetH, itemsCount, currentMType);
                let digCutFactor = splitInfo.digCutFactor;
                let targetSheets = calcRes.sheetsNeeded;
                let pCustomQty = 0;
                if (document.getElementById('f-personalization-qty')) {
                    pCustomQty = parseInt(document.getElementById('f-personalization-qty').value) || 0;
                }
                let digSheets = 0;
                if (pCustomQty > 0) {
                    let itemsPerDigitalSheet = (itemsCount > 0) ? (itemsCount / digCutFactor) : 1;
                    digSheets = Math.ceil(pCustomQty / itemsPerDigitalSheet);
                } else {
                    digSheets = targetSheets * digCutFactor;
                }
                let persFormatDetail = (digCutFactor > 1) ? ` (${splitInfo.partStr})` : (splitInfo.partStr ? ` (${splitInfo.partStr})` : '');
                let partialNote = (pCustomQty > 0) ? ` (delno: ${pCustomQty.toLocaleString('de-DE')} kos)` : '';
                let persQtyStr = `${persSidesText} ${digSheets.toLocaleString('de-DE')} pol${persFormatDetail}${partialNote}`;
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
            if (isChecked('calc-paper2-enable')) {
                let p2Type = document.getElementById('calc-paper2-type') ? document.getElementById('calc-paper2-type').value.trim() : '';
                finishingRowsHtml += `
                    <tr>
                        <td style="width: 15%;">Kaširanje:</td>
                        <td style="width: 35%;" class="bold">Lepljenje 2 pol (${p2Type || 'Papir 2'})</td>
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
            let prepTimeStr = (prepTimeVal % 1 === 0 ? prepTimeVal.toFixed(0) : prepTimeVal.toFixed(2).replace('.', ',')) + ' h';
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
                        <div style="background: #fef2f2; border: 2px solid #ef4444; color: #991b1b; padding: 8px 12px; border-radius: 6px; font-weight: bold; font-size: 11pt; margin-bottom: 10px;">
                            ⚠️ OPOZORILO: Skupna količina mutacij (${sumMutQty.toLocaleString('de-DE')} kos) PRESEGA naročeno količino (${q.toLocaleString('de-DE')} kos)!
                        </div>`;
                }
            }
            const defaultContent = `
                ${mutExceedsWarningHtml}
                <div class="header-top">
                    <div style="width: 50%;">
                        <div class="bold" style="font-size: 11pt;">${customer} &nbsp;&nbsp;&nbsp; (Šifra stranke: ${customerCode})</div>
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
                    <tr><td style="width: 15%;">Količina:</td><td class="bold" style="font-size: 11pt;">${qtyDisplay}</td></tr>
                    <tr><td>Format:</td><td class="bold">${formatW} x ${formatH} mm</td></tr>
                    <tr><td>Tisk:</td><td class="bold">${colorsDisplay}</td></tr>
                    <tr><td>Material:</td><td class="bold">${paperWeight ? paperWeight + 'g ' : ''}${paperType}</td></tr>
                </table>
                ${dnNotes ? `
                <table style="margin-top: 5px; width: 100%;">
                    <tr>
                        <td style="width: 15%; vertical-align: top;"><span class="bold">Opis / pripombe:</span></td>
                        <td class="bold" style="white-space: pre-wrap; font-size: 11pt;">${dnNotes}</td>
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
                    ${(d.paper2 && d.paper2.enabled) ? `
                    <tr>
                        <td style="width: 15%; vertical-align: top;">06 razrez 2. papir (kaširanje):</td>
                        <td class="bold" style="color: #0284c7;">
                            ${d.paper2.sourceSheets.toLocaleString('de-DE')} pol &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${sourceWCm} x ${sourceHCm} cm ${sourceGrain} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; na &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                            <div style="display: inline-block; vertical-align: top;">
                                ${d.paper2.totalSheets.toLocaleString('de-DE')} pol ${sheetWCm} x ${sheetHCm} cm &nbsp;&nbsp; (${d.paper2.type || 'Papir 2'} ${d.paper2.weight ? d.paper2.weight + 'g' : ''})
                            </div>
                        </td>
                    </tr>
                    ` : ''}
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
                        <td style="width: 30%; text-align: right; vertical-align: top;" class="bold" colspan="2"><span class="bold">tisk:</span> ${roundedPrintTime.toFixed(1).replace('.', ',')} h</td>
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
                    <tr style="font-size: 11pt; font-weight: bold;">
                        <td style="width: 15%; padding-top: 2px; font-size: 11pt;" class="bold">Pakiranje:</td>
                        <td class="bold" style="width: 35%; padding-top: 2px; font-size: 11pt;">${packaging}</td>
                        <td style="width: 50%; text-align: right;"></td>
                    </tr>
                </table>
                <div class="row-divider"></div>
                <div class="bold" style="margin-bottom: 5px; font-size: 11pt;">Poraba materiala:</div>
                <table style="width: 100%;">
                    <tr>
                        <td style="font-size: 11pt;">of. plošče (<strong>${d.print.mType || 'S4'}</strong>):</td>
                        <td style="text-align: right; font-size: 11pt;" class="bold">${d.prep.plates} kos</td>
                    </tr>
                    <tr style="font-size: 17px; font-weight: bold;">
                        <td style="font-size: 17px;" class="bold">${materialCode ? '[' + materialCode + '] ' : ''}Papir (${sourceWCm} x ${sourceHCm} cm ${sourceGrain}) - ${paperWeight ? paperWeight + 'g ' : ''}${paperType}:</td>
                        <td style="text-align: right; font-size: 17px;" class="bold">${finalSourceSheets.toLocaleString('de-DE')} pol</td>
                    </tr>
                </table>
                <div class="row-divider"></div>
                <table>
                    <tr>
                        <td style="font-size: 11pt;" class="bold">Izdobaviti točno naročeno količino!</td>
                    </tr>
                    <tr>
                        <td style="font-size: 11pt;">Obvezno par vzorcev tiskovine v nalog!</td>
                    </tr>
                </table>
                <div class="row-divider"></div>
                <table style="width: 100%; margin-bottom: 5px; font-size: 11pt;">
                    <tr>
                        <td style="width: 20%; white-space: nowrap;"><span class="bold">Št. ponudbe:</span> ${quoteNum || '/'}</td>
                        <td style="width: 25%; text-align: center; white-space: nowrap;"><span class="bold">Cena za kos:</span> ${formatPrice(calcRes.perItemFinal, 4)}</td>
                        <td style="width: 30%; text-align: center; white-space: nowrap;"><span class="bold">Cena za 1000 kos:</span> ${formatPrice(calcRes.perItemFinal * 1000, 2)}</td>
                        <td style="width: 25%; text-align: right; white-space: nowrap;"><span class="bold">Skupaj:</span> ${formatPrice(calcRes.totalPrice, 2)}</td>
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
                    body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.3; color: #000; margin: 0; padding: 0; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 3px; font-size: 11pt; }
                    td, th { padding: 2px 4px; vertical-align: top; }
                    .main-table th { background: #eee; border: 1px solid #ccc; font-size: 11pt; font-family: Arial, sans-serif; }
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
</style>
            </head>
            <body>
                <div class="no-print" contenteditable="false" style="background: #f1f5f9; padding: 10px; border-bottom: 1px solid #cbd5e1; display: flex; gap: 10px; align-items: center; justify-content: start; font-family: sans-serif; box-sizing: border-box; width: 100%; flex-wrap: wrap;">
                    <button onclick="window.print()" style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 11pt;">NATISNI DN</button>
                    <button onclick="window.close()" style="background: #64748b; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 11pt;">ZAPRI</button>
                    <button onclick="if(confirm('Ali želite ponastaviti delovni nalog na privzete vrednosti? (Spremembe besedila bodo izgubljene)')){ if(window.opener){ window.opener.g_editedWorkOrderHTML=''; const newHtml = window.opener.getWorkOrderHTML(); document.open(); document.write(newHtml); document.close(); } else { g_editedWorkOrderHTML=''; const modal = document.getElementById('modal-work-order'); if(modal) { modal.querySelector('.editable-area').innerHTML = getWorkOrderHTML(); } } }" style="background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 11pt;">PONASTAVI</button>
                    <button id="btn-move-text" onclick="toggleMoveMode(this)" style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 11pt;" title="Premakni označeno besedilo na drugo mesto. Označite besedilo, kliknite ta gumb in nato kliknite na novo mesto v besedilu.">PREMAKNI</button>
                    <button onclick="saveDNToDisk()" style="background: #8b5cf6; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 11pt;" title="Shrani ta delovni nalog v Word (.doc) formatu na računalnik">SHRANI DN (WORD)</button>
                    <div style="display: flex; gap: 4px; align-items: center; background: #cbd5e1; padding: 3px; border-radius: 6px;">
                        <button onclick="document.execCommand('bold', false, null)" style="background: white; border: none; border-radius: 4px; width: 28px; height: 28px; font-weight: bold; cursor: pointer; color: #000; font-size: 11pt;" title="Krepko (Bold)">B</button>
                        <button onclick="document.execCommand('italic', false, null)" style="background: white; border: none; border-radius: 4px; width: 28px; height: 28px; font-style: italic; cursor: pointer; color: #000; font-size: 11pt; font-family: Georgia, serif;" title="Ležeče (Italic)">I</button>
                        <button onclick="document.execCommand('underline', false, null)" style="background: white; border: none; border-radius: 4px; width: 28px; height: 28px; text-decoration: underline; cursor: pointer; color: #000; font-size: 11pt;" title="Podčrtano (Underline)">U</button>
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
        var g_lastSaveHandle = null;
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
                            var htmlContent = "<!DOCTYPE html><html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>" + fileName + "</title><style>body { font-family: Arial, sans-serif; font-size: 11pt; margin: 0; padding: 10px; } table { width: 100%; border-collapse: collapse; } td, th { padding: 4px; }</style></head><body>" + content + "</body></html>";
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
            return html;
        }
        function printTechSpec() {
            try {
                const html = getTechSpecHTML();
                const printWin = window.open('', '_blank', 'width=950,height=900');
                if (!printWin) {
                    alert("Pojavno okno je bilo blokirano.");
                    return;
                }
                printWin.document.write(html);
                printWin.document.close();
                setTimeout(() => { printWin.focus(); }, 200);
            } catch (e) { alert("Napaka pri pripravi tehnične specifikacije: " + e.message); }
        }

        function getTechSpecHTML() {
            let customer = document.getElementById('calc-customer') ? document.getElementById('calc-customer').value : "Ni vpisano";
            let customerCode = document.getElementById('calc-customer-code') ? document.getElementById('calc-customer-code').value : "";
            let custAddress = document.getElementById('calc-cust-address') ? document.getElementById('calc-cust-address').value : "";
            let custEmail = document.getElementById('calc-cust-email') ? document.getElementById('calc-cust-email').value : "";
            let quoteNum = document.getElementById('calc-quote-number') ? document.getElementById('calc-quote-number').value : "";
            let product = document.getElementById('calc-project-name') ? document.getElementById('calc-project-name').value : "Ni vpisano";
            let preparedBy = document.getElementById('calc-prepared-by') ? document.getElementById('calc-prepared-by').value : 'Darko Sužnik';
            let orderType = document.getElementById('calc-order-type') ? document.getElementById('calc-order-type').value : '';

            const dateObj = new Date();
            const slMonths = ["januar", "februar", "marec", "april", "maj", "junij", "julij", "avgust", "september", "oktober", "november", "december"];
            let date = dateObj.getDate() + '. ' + slMonths[dateObj.getMonth()] + ' ' + dateObj.getFullYear();

            const qtyStr = document.getElementById('quantity') ? document.getElementById('quantity').value : '0';
            const qtyArr = qtyStr.split(/[,/;]+/).map(x => parseFloat(x.trim().replace(/\./g, '').replace(',', '.'))).filter(x => !isNaN(x) && x > 0);
            if (qtyArr.length === 0) qtyArr.push(1);

            const safeFixed = (val, dec = 1) => {
                const n = parseFloat(val);
                return isNaN(n) ? "0" : n.toFixed(dec);
            };

            let specsHtml = '';

            qtyArr.forEach((q, idx) => {
                let calcRes = calculateForSingleQty(q, undefined, undefined, undefined, undefined, idx);
                let d = calcRes ? (calcRes.details || calcRes) : null;
                if (!d) return;

                let matCost = d.paper ? d.paper.cost : (calcRes.paperCost || 0);
                let prepCost = d.prep ? d.prep.cost : (calcRes.prepCost || 0);
                let printCost = d.print ? d.print.cost : (calcRes.printCost || 0);
                let finishCost = d.finish ? d.finish.cost : (calcRes.finishCost || 0);
                let totalPrice = calcRes.totalPrice || calcRes.total || 0;
                let perItem = calcRes.perItem || (totalPrice / q);

                let matHtml = `
                    <div style="margin-bottom: 15px; padding: 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;">
                        <div style="font-weight: bold; color: #2563eb; margin-bottom: 5px; font-size: 11pt;">1. Material (Papir)</div>
                        <table style="width: 100%; border-collapse: collapse; font-size: 10pt;" cellpadding="3">
                            ${d.paper ? `
                            <tr>
                                <td>Tiskovne pole po razrezu:</td>
                                <td style="text-align: right; font-weight: bold;">${formatQty(d.paper.totalSheets || d.paper.sheets || 0)} pol</td>
                            </tr>
                            <tr>
                                <td>Nerazrezane pole (${d.paper.sourceW || 0}×${d.paper.sourceH || 0} mm → ${d.paper.sourceYield || 1}x razrez):</td>
                                <td style="text-align: right; font-weight: bold;">${formatQty(d.paper.sourceSheets || 0)} pol</td>
                            </tr>
                            ${d.paper.kg > 0 ? `<tr><td>Teža papirja:</td><td style="text-align: right;">${safeFixed(d.paper.kg)} kg</td></tr>` : ''}
                            ` : ''}
                            <tr style="border-top: 1px solid #cbd5e1; font-weight: bold; color: #1e3a8a;">
                                <td>Strošek materiala skupaj:</td>
                                <td style="text-align: right;">${formatPrice(matCost)}</td>
                            </tr>
                        </table>
                    </div>
                `;

                let printHtml = `
                    <div style="margin-bottom: 15px; padding: 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;">
                        <div style="font-weight: bold; color: #7c3aed; margin-bottom: 5px; font-size: 11pt;">2. Priprava in Tisk</div>
                        <table style="width: 100%; border-collapse: collapse; font-size: 10pt;" cellpadding="3">
                            ${d.prep ? `
                            <tr><td>Število plošč:</td><td style="text-align: right;">${d.prep.plates || 0} kos (${formatPrice(d.prep.platesCost || 0)})</td></tr>
                            <tr><td>Pavšalna priprava:</td><td style="text-align: right;">${formatPrice(d.prep.setup || 0)}</td></tr>
                            ${(d.prep.changes || 0) > 0 ? `<tr><td>Menjava plošč:</td><td style="text-align: right;">${formatPrice(d.prep.changesCost || 0)}</td></tr>` : ''}
                            ${(d.prep.washes || 0) > 0 ? `<tr><td>Pranje stroja:</td><td style="text-align: right;">${formatPrice(d.prep.washCost || 0)}</td></tr>` : ''}
                            ` : ''}
                            ${d.print ? `
                            ${d.print.mType === 'digital'
                                ? `<tr><td>Cena tiska (${d.paper ? d.paper.totalSheets : ''} pol${d.print.perSheetCost ? ` po ${d.print.perSheetCost.toFixed(2).replace('.', ',')} €` : ''}):</td><td style="text-align: right;">${formatPrice(d.print.cost || 0)}</td></tr>`
                                : (d.print.mType === 'digital-rollup'
                                    ? `<tr><td>Digitalni ROLL UP:</td><td style="text-align: right;">${formatPrice(d.print.cost || 0)}</td></tr>`
                                    : (d.print.mType === 'digital-plakat'
                                        ? `<tr><td>Digitalni tisk plakatov:</td><td style="text-align: right;">${formatPrice(d.print.cost || 0)}</td></tr>`
                                        : `<tr><td>Neto čas tiska (${((d.print.hours || 0) * 60).toFixed(0)} min):</td><td style="text-align: right;">${formatPrice(d.print.cost || 0)}</td></tr>`
                                      )
                                  )
                            }
                            ${d.print.gripper ? `<tr><td>Prijemalec (gripper):</td><td style="text-align: right; font-weight: bold;">${d.print.gripper} mm</td></tr>` : ''}
                            ` : ''}
                            <tr style="border-top: 1px solid #cbd5e1; font-weight: bold; color: #5b21b6;">
                                <td>Skupaj priprava + tisk:</td>
                                <td style="text-align: right;">${formatPrice(prepCost + printCost)}</td>
                            </tr>
                        </table>
                    </div>
                `;

                let finishItemsHtml = '';
                if (d.finish && d.finish.items && Array.isArray(d.finish.items)) {
                    finishItemsHtml = d.finish.items.map(item => `
                        <tr style="border-bottom: 1px dashed #e2e8f0;">
                            <td>
                                <strong>${item.name}</strong><br>
                                <span style="font-size: 8.5pt; color: #64748b;">${item.breakdown || ''}</span>
                            </td>
                            <td style="text-align: right; font-weight: bold; vertical-align: top;">${formatPrice(item.cost)}</td>
                        </tr>
                    `).join('');
                }

                let finishHtml = `
                    <div style="margin-bottom: 15px; padding: 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;">
                        <div style="font-weight: bold; color: #059669; margin-bottom: 5px; font-size: 11pt;">3. Dodelava in Storitve</div>
                        <table style="width: 100%; border-collapse: collapse; font-size: 10pt;" cellpadding="3">
                            ${finishItemsHtml}
                            <tr style="border-top: 1px solid #cbd5e1; font-weight: bold; color: #065f46;">
                                <td>Skupaj strošek dodelave:</td>
                                <td style="text-align: right;">${formatPrice(finishCost)}</td>
                            </tr>
                        </table>
                    </div>
                `;

                let marginVal = d.margin || calcRes.margin || 0;
                let commVal = d.commercial || calcRes.commercial || 0;
                let totalProd = d.total || matCost + prepCost + printCost + finishCost;

                let summaryHtml = `
                    <div style="padding: 10px; background: #f1f5f9; border: 2px solid #059669; border-radius: 6px; margin-bottom: 15px;">
                        <table style="width: 100%; border-collapse: collapse; font-size: 11pt;" cellpadding="4">
                            <tr>
                                <td style="font-weight: bold;">Skupaj proizvodni stroški:</td>
                                <td style="text-align: right; font-weight: bold; color: #0f172a;">${formatPrice(totalProd)}</td>
                            </tr>
                            ${marginVal > 0 ? `
                            <tr>
                                <td style="color: #475569;">RVC / Marža:</td>
                                <td style="text-align: right; color: #475569;">${formatPrice(marginVal)}</td>
                            </tr>
                            ` : ''}
                            ${commVal > 0 ? `
                            <tr>
                                <td style="color: #475569;">Komerciala / Admin:</td>
                                <td style="text-align: right; color: #475569;">${formatPrice(commVal)}</td>
                            </tr>
                            ` : ''}
                            <tr style="border-top: 2px solid #059669; font-size: 12pt; font-weight: bold; color: #059669;">
                                <td>SKUPNA PRODAJNA CENA (brez DDV):</td>
                                <td style="text-align: right;">${formatPrice(totalPrice)}</td>
                            </tr>
                            <tr>
                                <td style="font-size: 10pt; color: #475569;">Cena na kos:</td>
                                <td style="text-align: right; font-size: 10pt; font-weight: bold; color: #0284c7;">${formatPrice(perItem, 4)} / kos</td>
                            </tr>
                            <tr>
                                <td style="font-size: 10pt; color: #475569;">Cena na 1.000 kos:</td>
                                <td style="text-align: right; font-size: 10pt; font-weight: bold; color: #d97706;">${formatPrice(perItem * 1000, 2)} / 1.000 kos</td>
                            </tr>
                        </table>
                    </div>
                `;

                specsHtml += `
                    <div style="margin-top: 20px; border: 1px solid #cbd5e1; border-radius: 8px; padding: 15px; background: #ffffff;">
                        <h3 style="margin-top: 0; color: #0f172a; border-bottom: 2px solid #0284c7; padding-bottom: 5px; font-size: 13pt;">
                            Specifikacija za naklado: <span style="color: #0284c7;">${q.toLocaleString('sl-SI')} kos</span>
                        </h3>
                        ${matHtml}
                        ${printHtml}
                        ${finishHtml}
                        ${summaryHtml}
                    </div>
                `;
            });

            return `
                <!DOCTYPE html>
                <html lang="sl">
                <head>
                    <meta charset="utf-8">
                    <title>Tehnična Specifikacija</title>
                    <style>
                        body { font-family: Arial, sans-serif; font-size: 10pt; color: #000; margin: 0; padding: 15px; line-height: 1.2; }
                        .info-table { border-collapse: collapse; margin-left: auto; margin-right: 0; }
                        .info-table td { padding: 2px 0 2px 15px; text-align: right; }
                        .info-table td:first-child { font-weight: normal; color: #555; }
                        .info-table td:last-child { font-weight: bold; }
                        h1 { font-size: 14pt; font-weight: bold; margin-top: 15px; margin-bottom: 10px; letter-spacing: 0.5px; border-bottom: 2px solid #f99c26; padding-bottom: 5px; color: #0f172a; }
                        @media print { .no-print { display: none !important; } }
                    </style>
                </head>
                <body>
                    <div class="no-print" style="background: #f1f5f9; padding: 10px; border-bottom: 1px solid #cbd5e1; display: flex; gap: 15px; align-items: center; justify-content: start; margin-bottom: 15px;">
                        <button onclick="window.print()" style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 11pt;">NATISNI SPECIFIKACIJO</button>
                        <button onclick="window.close()" style="background: #64748b; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 11pt;">ZAPRI</button>
                    </div>

                    <!-- HEADER TISKARNA PETRIČ -->
                    <table style="width: 100%; margin-bottom: 15px; border-bottom: 2px solid #f99c26; padding-bottom: 5px;" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="width: 32%; vertical-align: middle;">
                                <img src="${LOGO_PETRIC_BASE64}" width="165" height="69" style="width: 165px; height: 69px; max-width: 100%; object-fit: contain; display: block;" alt="Tiskarna Petrič">
                            </td>
                            <td style="width: 25%; vertical-align: middle; border-left: 2px solid #f99c26; padding-left: 15px; font-size: 9px; color: #8c8f91; font-style: italic;">
                                <strong>Tiskarna Petrič d.o.o.</strong><br>Tovarniška cesta 8<br>3210 Slovenske Konjice<br>ID za DDV: SI50694014
                            </td>
                            <td style="width: 20%; vertical-align: middle; border-left: 2px solid #f99c26; padding-left: 15px; font-size: 9px; color: #8c8f91; font-style: italic;">
                                T: 03 757 25 56<br>F: 03 757 25 63<br>Mat. št.: 6889433
                            </td>
                            <td style="width: 23%; vertical-align: bottom; border-left: 2px solid #f99c26; padding-left: 15px; padding-bottom: 5px; font-size: 18px; font-weight: bold; color: #f99c26; font-style: italic;">
                                vse stiska
                            </td>
                        </tr>
                    </table>

                    <!-- STRANKA & OSNOVNI PODATKI -->
                    <table style="width: 100%; margin-bottom: 10px;" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="width: 50%; vertical-align: top;">
                                <div style="font-size: 9pt; color: #555; text-transform: uppercase; margin-bottom: 2px;">Stranka:</div>
                                <span style="font-size: 11pt;"><strong>${customer}</strong></span><br>
                                <div style="margin-top: 3px; line-height: 1.2; font-size: 9.5pt;">
                                    ${custAddress ? custAddress.replace(/\n/g, '<br>') : ''}
                                </div>
                                ${custEmail ? '<div style="margin-top: 3px; color: #444; font-size: 9pt;">' + custEmail + '</div>' : ''}
                            </td>
                            <td style="width: 50%; vertical-align: top;" align="right">
                                <table class="info-table" cellpadding="0" cellspacing="0">
                                    <tr><td>Datum:</td><td>${date}</td></tr>
                                    <tr><td>Šifra stranke:</td><td>${customerCode || '/'}</td></tr>
                                    <tr><td>Ponudba št.:</td><td>${quoteNum || '/'}</td></tr>
                                    ${orderType ? `<tr><td>Tip naloga:</td><td style="color:#ef4444; font-weight:bold;">${orderType}</td></tr>` : ''}
                                </table>
                            </td>
                        </tr>
                    </table>

                    <h1>TEHNIČNA SPECIFIKACIJA &amp; RAZČLENITEV STROŠKOV</h1>
                    <div style="margin-bottom: 10px; font-size: 10.5pt; font-weight: bold; color: #1e293b;">
                        Projekt: <span style="color: #0284c7;">${product}</span>
                    </div>

                    ${specsHtml}

                    <div style="margin-top: 25px; font-size: 9pt; font-style: italic; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 8px;">
                        Specifikacijo pripravil: <strong>${preparedBy}</strong>
                    </div>
                </body>
                </html>
            `;
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
        function generateQuoteWordFilename(isAT = false) {
            let _gv = id => { let el = document.getElementById(id); return el ? el.value : ''; };
            let rawQuoteNum = (_gv('calc-quote-number') || '').replace(/[\/\\]/g, '-').trim();
            let cleanNum = rawQuoteNum.replace(/^(pon\.|ang\.|pon|ang)/i, '').trim();
            let prefix = isAT ? 'ang.' : 'pon.';
            let s_ponudba = cleanNum ? (prefix + cleanNum) : (isAT ? 'ang' : 'pon');

            let s_stranka = (_gv('calc-customer') || '').trim();
            let s_izdelek = (_gv('calc-project-name') || 'Pola').trim();
            let nakladaStr = _gv('calc-quantities') || _gv('calc-qty-ordered') || '';
            let s_naklada = nakladaStr ? ('nakl.' + nakladaStr.replace(/\s+/g, '').replace(/,/g, '-')) : '';
            let cFront = _gv('calc-colors-front') || '0';
            let cBack = _gv('calc-colors-back') || '0';
            let s_barve = (cFront === '0' && cBack === '0') ? '' : ('b' + cFront + cBack);

            let parts = [s_ponudba, s_stranka, s_izdelek, s_naklada, s_barve].filter(Boolean);
            let baseName = parts.join('_').replace(/[/\\?%*:|"<> \t]/g, '_').replace(/_+/g, '_');
            if (!baseName) baseName = isAT ? 'ang_ponudba' : 'pon_ponudba';
            return baseName + '.doc';
        }

        function exportQuoteWord(isAT = false) {
            try {
                const htmlContent = getQuoteHTML(true, '', isAT);
                const wordName = generateQuoteWordFilename(isAT);

                let fullHtml = "<!DOCTYPE html><html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>" + wordName + "</title><style>body { font-family: Arial, sans-serif; font-size: 11pt; margin: 0; padding: 10px; } table { width: 100%; border-collapse: collapse; } td, th { padding: 4px; }</style></head><body>" + htmlContent + "</body></html>";

                const blob = new Blob(['\ufeff', fullHtml], { type: 'application/msword;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = wordName;
                document.body.appendChild(link);
                link.click();
                setTimeout(() => { if (link.parentNode) link.parentNode.removeChild(link); URL.revokeObjectURL(url); }, 500);

                getServerBaseUrl().then(srvUrl => {
                    fetch(srvUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ type: 'word', filename: wordName, content: fullHtml })
                    }).then(res => res.json()).then(srvData => {
                        if (srvData && srvData.status === 'success') {
                            console.log("📄 Word uspešno shranjen na server Srečko:", srvData.path || wordName);
                        }
                    }).catch(srvErr => {
                        console.log("Server Srečko save info:", srvErr);
                    });
                });

            } catch (e) {
                alert("Napaka pri pripravi Word dokumenta: " + e.message);
                console.error(e);
            }
        }

        function downloadWordDoc(filename, htmlContent) {
            try {
                let name = filename;
                if (!name || name === 'dokument' || name === 'ponudba') {
                    name = generateQuoteWordFilename(false);
                }
                if (!name.endsWith('.doc')) name += '.doc';

                let fullHtml = "<!DOCTYPE html><html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>" + name + "</title><style>body { font-family: Arial, sans-serif; margin: 0; padding: 10px; } table { width: 100%; border-collapse: collapse; } td, th { padding: 4px; }</style></head><body>" + htmlContent + "</body></html>";

                let blob = new Blob(['\ufeff', fullHtml], { type: 'application/msword;charset=utf-8' });
                let url = URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = url;
                a.download = name;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => { if (a.parentNode) a.parentNode.removeChild(a); URL.revokeObjectURL(url); }, 500);

                getServerBaseUrl().then(srvUrl => {
                    fetch(srvUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ type: 'word', filename: name, content: fullHtml })
                    }).then(res => res.json()).then(srvData => {
                        if (srvData && srvData.status === 'success') {
                            console.log("📄 Word uspešno shranjen na server Srečko:", srvData.path || name);
                        }
                    }).catch(srvErr => {
                        console.log("Server Srečko save info:", srvErr);
                    });
                });

            } catch (e) {
                alert("Napaka pri prenosu Word datoteke: " + e.message);
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
            const machineName = document.getElementById('calc-machine-type') ? document.getElementById('calc-machine-type').value : '';
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
</style>
            </head>
                <body>
                    <h2>Montažni list (Stroj: \${machineName}, Osnovni format: \${sheetW} x \${sheetH} mm, Elementi: \${m_items.length})</h2>
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
            seedCustomerContactsIfEmpty();
            updateCustomerDatalist();
            renderBasket();
            autoConnectFolder();
            const givenSheetsInput = document.getElementById('calc-given-sheets');
            const uvExtraWasteInput = document.getElementById('f-uv-extra-waste');
            // Povezava je bila odstranjena, da dodatek za tisk ne spreminja dodatka za UV lakiranje in s tem cene.
            setTimeout(calculate, 200); // Give it a moment to stabilize
        } catch (e) {
            alert("Exception in " + "Function" + ": " + e.message + "\n" + e.stack);
            console.error("Startup failed:", e);
        }
    
    // Varnostni fallback za odpiranje cenika prevozov (PDF)
    if (typeof window.odpriCenikPDF !== 'function') {
        window.odpriCenikPDF = function() {
            window.open('Tarife_Tiskarna_Petric_2026.pdf', '_blank');
        };
    }
