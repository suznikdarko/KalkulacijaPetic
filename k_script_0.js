
        var g_editedQuoteHTML = '';
        var g_editedQuoteATHTML = '';
        var g_editedWorkOrderHTML = '';
        window.g_editedQuoteHTML = g_editedQuoteHTML;
        window.g_editedQuoteATHTML = g_editedQuoteATHTML;
        window.g_editedWorkOrderHTML = g_editedWorkOrderHTML;
        var prevQuoteHTML = null;
        var prevQuoteATHTML = null;
        var prevDNHTML = null;

        function updateCustomDocsPreview() {
            var container = document.getElementById('custom-docs-preview');
            if (!container) return;
            container.innerHTML = "";
            // Ponudba
            var hasQuote = (typeof window.g_editedQuoteHTML !== 'undefined' && window.g_editedQuoteHTML.trim() !== "");
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
            var hasQuoteAT = (typeof window.g_editedQuoteATHTML !== 'undefined' && window.g_editedQuoteATHTML.trim() !== "");
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
            var hasDN = (typeof window.g_editedWorkOrderHTML !== 'undefined' && window.g_editedWorkOrderHTML.trim() !== "");
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
            
            prevQuoteHTML = window.g_editedQuoteHTML;
            prevQuoteATHTML = window.g_editedQuoteATHTML;
            prevDNHTML = window.g_editedWorkOrderHTML;
        }
        
        setInterval(updateCustomDocsPreview, 1000);

        let quoteBasket = JSON.parse(localStorage.getItem('petric_quote_basket')) || [];
        renderBasket();

        // Osveževanje košarice med zavihki
        window.addEventListener('storage', (e) => {
            if (e.key === 'petric_quote_basket') {
                quoteBasket = JSON.parse(e.newValue) || [];
                renderBasket();
            }
        });

        function addToBasket() {
            const projectName = document.getElementById('calc-project-name').value || 'Tisk Kuvert';
            const materialCode = document.getElementById('calc-material-code').value || '/';
            const w = document.getElementById('width').value;
            const h = document.getElementById('height').value;
            const envType = document.getElementById('envelope-preset').options[document.getElementById('envelope-preset').selectedIndex].text;
            const cFront = document.getElementById('calc-colors-front').value || "0";
            const cBack = document.getElementById('calc-colors-back').value || "0";
            const quantitiesStr = document.getElementById('calc-quantities').value || "";
            const qList = quantitiesStr.split(',').map(s => parseFloat(s.trim().replace(/\./g, ''))).filter(n => !isNaN(n) && n > 0);

            if (qList.length === 0) {
                alert("Prosimo vnesite vsaj eno količino!");
                return;
            }

            let finishingParts = [];
            const usePers = document.getElementById('calc-use-personalization').checked;
            const persCount = parseFloat(document.getElementById('calc-personalization').value) || 0;
            if (usePers && persCount > 0) finishingParts.push('Personalizacija (' + formatQty(persCount) + ' kos)');
            const useManual = document.getElementById('calc-use-manual-work').checked;
            if (useManual) finishingParts.push('Ročna dela');

            if (document.getElementById('f-delivery-active') && document.getElementById('f-delivery-active').checked) finishingParts.push('Dostava pošti');
            if (document.getElementById('f-del-fixed-active') && document.getElementById('f-del-fixed-active').checked) finishingParts.push('Fiksna dostava');

            const item = {
                id: Date.now(),
                type: 'Kuverte',
                name: projectName,
                customer: document.getElementById('calc-customer').value || '',
                materialCode: materialCode,
                spec: {
                    format: envType + ' (' + w + ' x ' + h + ' mm)',
                    colors: cFront + ' / ' + cBack,
                    finishing: finishingParts.join(', ')
                },
                quantities: qList.map(q => {
                    const res = calculateForSingleQty(q);
                    return {
                        qty: q,
                        pricePerUnit: res.pricePerItem,
                        priceTotal: res.finalTotal
                    };
                })
            };

            quoteBasket.push(item);
            localStorage.setItem('petric_quote_basket', JSON.stringify(quoteBasket));
            renderBasket();

            // Show toast or alert on the button
            const btn = document.querySelector('button[onclick="addToBasket()"]');
            if (btn) {
                const originalText = btn.innerHTML;
                btn.innerHTML = "✅ Dodano!";
                setTimeout(() => { btn.innerHTML = originalText; }, 1500);
            }
        }

        function removeFromBasket(id) {
            quoteBasket = quoteBasket.filter(item => item.id !== id);
            localStorage.setItem('petric_quote_basket', JSON.stringify(quoteBasket));
            renderBasket();
        }

        function clearBasket() {
            if (confirm("Ali ste prepričani, da želite izprazniti celotno ponudbo?")) {
                quoteBasket = [];
                localStorage.setItem('petric_quote_basket', JSON.stringify(quoteBasket));
                renderBasket();
            }
        }

        function renderBasket() {
            const container = document.getElementById('basket-container');
            const list = document.getElementById('basket-items-list');
            const badge = document.getElementById('basket-count-badge');

            if (quoteBasket.length === 0) {
                container.style.display = 'none';
                badge.style.display = 'none';
                return;
            }

            container.style.display = 'block';
            badge.style.display = 'inline-block';
            badge.innerText = quoteBasket.length;

            let html = "";
            quoteBasket.forEach(item => {
                html += `
                    <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); display: grid; grid-template-columns: 1fr auto; gap: 15px; align-items: center;">
                        <div>
                            <div style="font-weight: bold; color: #f8fafc; font-size: 0.95rem;">${item.name} <span style="font-weight: normal; color: #94a3b8; font-size: 0.8rem; margin-left: 10px;">[${item.materialCode}]</span></div>
                            <div style="font-size: 0.8rem; color: #cbd5e1; margin-top: 3px;">
                                ${item.type} | ${item.spec.format} | ${item.spec.colors} ${item.spec.finishing ? ' | ' + item.spec.finishing : ''}
                            </div>
<div style="display: flex; gap: 10px; margin-top: 5px; flex-wrap: wrap;">
                                ${item.quantities.map(q => `<span style="background: rgba(59, 130, 246, 0.2); color: #60a5fa; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem;">${formatQty(q.qty)}: ${formatPrice(q.priceTotal)}</span>`).join('')}
                            </div>
                        </div>
                        <button onclick="removeFromBasket(${item.id})" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1.2rem; padding: 5px;" title="Odstrani">✕</button>
                    </div>
                `;
            });
            list.innerHTML = html;
        }

        function getQuoteHTML(isWord = false, isAT = false) {
            const quoteNum = document.getElementById('calc-quote-number').value || '/';
            const customer = document.getElementById('calc-customer').value || '';
            const custAddress = document.getElementById('calc-cust-address').value || '';
            const customerCode = document.getElementById('calc-customer-code').value || '/';
            const preparedBy = document.getElementById('calc-prepared-by').value || 'Darko Sužnik';
            const date = new Date().toLocaleDateString('sl-SI');
            const custEmail = document.getElementById('calc-cust-email') ? document.getElementById('calc-cust-email').value : '';
            const deliveryAddress = document.getElementById('calc-delivery-address') ? document.getElementById('calc-delivery-address').value : '';

            let itemsToRender = [];

            if (quoteBasket.length > 0) {
                itemsToRender = quoteBasket;
            } else {
                const projectName = document.getElementById('calc-project-name').value || 'Tisk Kuvert';
                const materialCode = document.getElementById('calc-material-code').value || '/';
                const w = document.getElementById('width').value;
                const h = document.getElementById('height').value;
                const envType = document.getElementById('envelope-preset').options[document.getElementById('envelope-preset').selectedIndex].text;
                const cFront = document.getElementById('calc-colors-front').value || "0";
                const cBack = document.getElementById('calc-colors-back').value || "0";
                const quantitiesStr = document.getElementById('calc-quantities').value || "";
                const qList = quantitiesStr.split(',').map(s => parseFloat(s.trim().replace(/\./g, ''))).filter(n => !isNaN(n) && n > 0);
                if (qList.length === 0) qList.push(1000);

                let finishingParts = [];
                const usePers = document.getElementById('calc-use-personalization').checked;
                const persCount = parseFloat(document.getElementById('calc-personalization').value) || 0;
                if (usePers && persCount > 0) finishingParts.push('Personalizacija (' + formatQty(persCount) + ' kos)');
                const useManual = document.getElementById('calc-use-manual-work').checked;
                if (useManual) finishingParts.push('Ročna dela');

                if (document.getElementById('f-delivery-active') && document.getElementById('f-delivery-active').checked) finishingParts.push('Dostava pošti');
                if (document.getElementById('f-del-fixed-active') && document.getElementById('f-del-fixed-active').checked) finishingParts.push('Fiksna dostava');

                itemsToRender.push({
                    name: projectName,
                    type: 'Kuverte',
                    materialCode,
                    spec: {
                        format: envType + ' (' + w + ' x ' + h + ' mm)',
                        colors: cFront + ' / ' + cBack,
                        finishing: finishingParts.join(', ')
                    },
                    quantities: qList.map(q => {
                        const res = calculateForSingleQty(q);
                        return { qty: q, pricePerUnit: res.pricePerItem, priceTotal: res.finalTotal };
                    })
                });
            }

            let allItemsHTML = '';
            itemsToRender.forEach((item, idx) => {
                allItemsHTML += `
                    <div style="margin-bottom: 15px; ${idx < itemsToRender.length - 1 ? 'border-bottom: 2px dashed #e2e8f0; padding-bottom: 15px;' : ''}">
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="width: 15%; vertical-align: top; border-right: 1px solid #e2e8f0; padding-right: 15px;">
                                    <div style="font-size: 9px; color: #1e293b; font-weight: bold; margin-bottom: 5px;">${isAT ? 'Številka artikla:' : 'Šifra izdelka:'}</div>
                                    <div style="font-size: 16px; font-weight: bold; color: #1e293b; border: 1px solid #e2e8f0; padding: 10px; background: #f8fafc; text-align: center; border-radius: 4px;">${item.materialCode}</div>
                                </td>
                                <td style="width: 85%; vertical-align: top; padding-left: 20px;">
                                    <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
                                        <tr><td style="width: 90px; font-weight: bold;">${isAT ? 'Produkt:' : 'Izdelek:'}</td><td>${item.name || '/'}</td></tr>
                                        <tr><td style="font-weight: bold;">Format:</td><td>${(item.spec && item.spec.format) ? item.spec.format : '/'}</td></tr>
                                        <tr><td style="font-weight: bold;">${isAT ? 'Druck:' : 'Tisk:'}</td><td>${(item.spec && item.spec.colors) ? item.spec.colors : '/'}</td></tr>
                                        ${(item.spec && item.spec.paper) ? `<tr><td style="font-weight: bold;">${isAT ? 'Papier:' : 'Papir:'}</td><td>${item.spec.paper}</td></tr>` : ''}
                                        ${(item.spec && item.spec.finishing) ? `<tr><td style="font-weight: bold;">${isAT ? 'Verarbeitung:' : 'Dodel.:'}</td><td>${item.spec.finishing}</td></tr>` : ''}
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; text-align: center; border-top: 1px solid #000; border-bottom: 1px solid #000;">
                            <tr><th style="padding: 4px; border-bottom: 1px solid #000; font-size: 11px;">${isAT ? 'Auflage' : 'Naklada'}</th><th style="padding: 4px; border-bottom: 1px solid #000; font-size: 11px;">${isAT ? 'Preis/ Stk.' : 'Cena/Kom.'}</th><th style="padding: 4px; border-bottom: 1px solid #000; font-size: 11px; text-align: right;">${isAT ? 'Gesamt Preis:' : 'Cena skupno:'}</th></tr>
                            ${(item.quantities && Array.isArray(item.quantities)) ? item.quantities.map(q => `
                                <tr>
                                    <td style="font-weight: bold; padding: 4px;">${formatQty(q.qty)} ${isAT ? 'Stk.' : 'kos'}</td>
                                    <td style="padding: 4px;">${formatPrice(q.pricePerUnit, 3)}</td>
                                    <td style="font-weight: bold; text-align: right; padding: 4px;">${formatPrice(q.priceTotal, 2)}</td>
                                </tr>
                            `).join('') : `<tr><td colspan="3" style="padding:4px; color:red;">${isAT ? 'Fehlende Preisdaten' : 'Manjkajoči podatki o ceni'}</td></tr>`}
                        </table>
                    </div>
                `;
            });

            const defaultContent = `
                    <div class="header-line">
                        <table style="width: 100%;">
                            <tr>
                                <td style="width: 35%; vertical-align: middle;">
                                    <div style="font-size: 24px; color: #475569; font-style: italic; line-height: 1;">tiskarna</div>
                                    <div style="font-size: 42px; font-weight: 900; color: #f99c26; font-style: italic; line-height: 0.9; padding-left: 35px;">petrič</div>
                                </td>
                                <td style="width: 25%; border-left: 1px solid #f99c26; padding-left: 15px; font-size: 11px; color: #475569; font-style: italic; vertical-align: middle; line-height: 1.3;">
                                    <strong>Tiskarna Petrič d.o.o.</strong><br>
                                    Tovarniška cesta 8<br>
                                    3210 Slovenske Konjice<br>
                                    ID za DDV: SI50694014
                                </td>
                                <td style="width: 25%; border-left: 1px solid #f99c26; padding-left: 15px; font-size: 11px; color: #475569; font-style: italic; vertical-align: middle; line-height: 1.3;">
                                    T: 03 757 25 56<br>
                                    &nbsp;&nbsp;&nbsp;&nbsp;03 757 25 50<br>
                                    &nbsp;&nbsp;&nbsp;&nbsp;03 757 25 64<br>
                                    F: 03 757 25 63<br>
                                    Mat. št.: 6889433
                                </td>
                                <td style="width: 15%; border-left: 1px solid #f99c26; padding-left: 15px; color: #f99c26; font-weight: 900; font-style: italic; font-size: 16px; text-align: center; vertical-align: bottom; padding-bottom: 5px;">
                                    vse stiska
                                </td>
                            </tr>
                        </table>
                    </div>

                    <div class="info-grid">
                        <div class="customer-box">
                            <div style="font-size: 10px; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">${isAT ? '' : 'Prejemnik:'}</div>
                            <div style="font-size: 16px; font-weight: bold; color: #1e293b;">${customer}</div>
                            <div style="font-size: 13px; color: #475569; margin-top: 5px;">${custAddress ? custAddress.replace(/\\n/g, '<br>') : ''}</div>
                        </div>
                        <div class="meta-box">
                            <table class="meta-table">
                                <tr><td>Datum:</td><td>${date}</td></tr>
                                <tr><td>${isAT ? 'Kunde' : 'Šifra stranke:'}</td><td>${customerCode}</td></tr>
                                <tr><td><strong style="font-size: 14px;">${isAT ? 'Angebot' : 'Ponudba št.:'}</strong></td><td><strong style="font-size: 14px;">${quoteNum}</strong></td></tr>
                            </table>
                        </div>
                    </div>

                    <h1 style="text-decoration: underline; margin-bottom: 10px; border: none; padding: 0;">${isAT ? 'Angebot' : 'Ponudba za tisk'}</h1>
                    <p style="color: #1e293b; font-weight: bold; margin-bottom: 20px;">${isAT ? 'Herzlichen Dank für Ihr Interesse. Wir können Ihnen folgendes anbieten:' : 'Zahvaljujemo se Vam za povpraševanje. Na podlagi vaših zahtev vam posredujemo naslednjo ponudbo:'}</p>

                    ${allItemsHTML}
                    
                    ${isAT ? '<div style="text-align: center; font-weight: bold; font-size: 12px; margin-top: -5px; margin-bottom: 20px; text-decoration: underline;">Voraussetzung: Kunde liefert druckfertige Daten</div>' : ''}


                    <div class="footer-notes" style="color: #1e293b; font-size: 11px;">
                        ${isAT ? 'Dieses Angebot ist gültig für 30 Tage. Zahlung erfolgt nach 30 Tagen ab Lieferung der Ware.<br>Wir danken Ihnen für Ihre mögliche Bestellung, und wünschen Ihnen einen angenehmen Tag.'
                    : 'Ponudba velja 30 dni od dneva izdaje. Vse cene so v EUR in ne vključujejo DDV (22%).<br>Rok izdelave po dogovoru, običajno 3-5 delovnih dni od potrditve predogleda.<br>Rok plačila je 30 dni po prejemu računa, razen če je dogovorjeno drugače.<br>Tiskarna Petrič d.o.o. si pridržuje pravico do spremembe cen v primeru bistvenih sprememb cen surovin na trgu.'}
                    </div>

                    <div class="signature-section">
                        <div style="color: #64748b; font-size: 10px;">
                            ${isAT ? '' : 'Žig podjetja (ni obvezen pri elektronskem pošiljanju)'}
                        </div>
                        <div class="prepared-by" style="font-weight: normal; font-size: 11px; color: #1e293b;">
                            ${isAT ? 'Dieses Angebot hat für Sie erstellt:' : 'Kalkulacijo pripravil:'} ${preparedBy}
                        </div>
                    </div>
            `;

            let contentToRender = isAT
                ? (window.g_editedQuoteATHTML ? window.g_editedQuoteATHTML : defaultContent)
                : (window.g_editedQuoteHTML ? window.g_editedQuoteHTML : defaultContent);

            
            if (isWord) {
                contentToRender = contentToRender.replace(
                    /<div[^>]*style="[^"]*color:\s*(#8c8f91|#475569);[^"]*"[^>]*>\s*tiskarna\s*<\/div>\s*<div[^>]*style="[^"]*color:\s*#f99c26;[^"]*"[^>]*>\s*petrič\s*<\/div>/gi,
                    `<table cellpadding="0" cellspacing="0" style="border: none; margin: 0; padding: 0; font-family: Arial, sans-serif;">
                        <tr><td style="color: $1; font-size: 20px; font-style: italic; font-weight: normal; margin: 0; padding: 0; line-height: 1.1;">tiskarna</td></tr>
                        <tr><td style="color: #f99c26; font-size: 36px; font-style: italic; font-weight: bold; margin: 0; padding: 0; padding-left: 15px; line-height: 1.1;">petrič</td></tr>
                     </table>`
                );
            }
if (isWord) {
                return `<html><body>${contentToRender}</body></html>`;
            }

            return `
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: 'Arial', sans-serif; padding: ${isWord ? '10px' : '0'}; color: #000; line-height: 1.1; font-size: 11px; margin: 0; }
                        h1 { color: #1e293b; font-size: 14px; font-weight: bold; margin-top: 10px; margin-bottom: 5px; letter-spacing: 1px; border-bottom: 1px solid #000; padding-bottom: 3px; }
                        .header-line { border-bottom: 2px solid #f99c26; margin-bottom: 20px; padding-bottom: 10px; }
                        .brand-name { font-size: 32px; font-weight: bold; color: #f99c26; text-transform: uppercase; }
                        .brand-sub { font-size: 12px; color: #64748b; letter-spacing: 2px; }
                        .info-grid { display: flex; justify-content: space-between; margin-bottom: 30px; }
                        .customer-box { width: 60%; }
                        .meta-box { width: 30%; font-size: 12px; }
                        .meta-table { width: 100%; border-collapse: collapse; }
                        .meta-table td { padding: 2px 5px; }
                        .footer-notes { font-size: 9px; color: #64748b; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 10px; }
                        .signature-section { margin-top: 50px; display: flex; justify-content: space-between; align-items: flex-end; }
                        .prepared-by { font-weight: bold; }
                        @media print {
                            .no-print { display: none !important; }
                        }
                        .editable-area:focus { outline: 2px dashed #f99c26; background-color: #fffbeb; }
                        .editable-area p, .editable-area div:not(.header-top) { margin: 0; padding: 0; }
                        .editable-area { word-wrap: break-word; overflow-wrap: break-word; }
                        .editable-area.waiting-for-paste { cursor: cell !important; outline: 3px dashed #eab308 !important; background-color: #fffbeb !important; }
                </style>
            </head>
                <body>
                    <div class="no-print" contenteditable="false" style="background: #f1f5f9; padding: 10px; border-bottom: 1px solid #cbd5e1; display: flex; gap: 15px; align-items: center; justify-content: start; font-family: sans-serif; box-sizing: border-box; width: 100%; flex-wrap: wrap;">
                        <button onclick="window.print()" style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px;">NATISNI PONUDBO</button>
                        <button onclick="exportQuoteWord(${isAT})" style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px;">SHRANI V WORD</button>
                        <button onclick="window.close()" style="background: #64748b; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px;">ZAPRI</button>
                        <button onclick="if(confirm('Ali želite ponastaviti ponudbo na privzete vrednosti? (Spremembe besedila bodo izgubljene)')){ if(window.opener){ if(${isAT}) { window.opener.g_editedQuoteATHTML=''; } else { window.opener.g_editedQuoteHTML=''; } } window.location.reload(); }" style="background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px;">PONASTAVI</button>
                    <button id="btn-move-text" onclick="toggleMoveMode(this)" style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px;" title="Premakni označeno besedilo na drugo mesto. Označite besedilo, kliknite ta gumb in nato kliknite na novo mesto v besedilu.">PREMAKNI</button>
                    <button onclick="saveQuoteToDisk()" style="background: #8b5cf6; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px;" title="Shrani to ponudbo kot datoteko na računalnik">SHRANI PONUDBO NA DISK</button>
                        
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
                        <div style="font-size: 12px; color: #475569; margin-left: 5px;">💾 Spremembe besedila se samodejno shranjujejo v kalkulacijo.</div>
                    </div>
                    <div class="editable-area" contenteditable="true" style="padding: 30px;">
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
                                    if (${isAT}) {
                                        window.opener.g_editedQuoteATHTML = area.innerHTML;
                                    } else {
                                        window.opener.g_editedQuoteHTML = area.innerHTML;
                                    }
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

                        function exportQuoteWord(isAT) {
                            const content = document.querySelector('.editable-area').innerHTML;
                            const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'></head><body>";
                            const footer = "</body></html>";
                            const sourceHTML = header + content + footer;
                            const blob = new Blob(['\\ufeff', sourceHTML], { type: 'application/msword' });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = isAT ? 'Angebot.doc' : 'Ponudba.doc';
                            link.click();
                            URL.revokeObjectURL(url);
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
                            const htmlContent = "<!DOCTYPE html>\\n" + document.documentElement.outerHTML;
                            const blob = new Blob([htmlContent], {type: "text/html;charset=utf-8"});
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            let fileName = document.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                            if (!fileName) fileName = "ponudba";
                            a.download = fileName + ".html";
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                        }
                    <\/script>
                </body>
                </html>
            `;
        }

        function printQuote() {
            try {
                const html = getQuoteHTML(false);
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

        function printQuoteAT() {
            try {
                const html = getQuoteHTML(false, true);
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
                alert("Napaka pri pripravi ponudbe AT: " + e.message);
                console.error(e);
            }
        }

        function getActiveFinishingList() {
            let list = [];
            if (document.getElementById('calc-use-personalization').checked) {
                const pCount = parseFloat(document.getElementById('calc-personalization').value) || 0;
                list.push(`Personalizacija (${formatQty(pCount)} kos)`);
            }
            if (document.getElementById('calc-use-manual-work').checked) {
                list.push("Ročna dela");
            }
            if (document.getElementById('f-delivery-active') && document.getElementById('f-delivery-active').checked) {
                list.push("Dostava pošta");
            }
            if (document.getElementById('f-del-fixed-active') && document.getElementById('f-del-fixed-active').checked) {
                list.push("Fiksna dostava");
            }
            return list.join(', ');
        }

        function getWorkOrderHTML() {
            const quantitiesStr = document.getElementById('calc-quantities').value || '';
            const qList = quantitiesStr.split(',').map(s => parseFloat(s.trim().replace(/\./g, ''))).filter(n => !isNaN(n) && n > 0);
            const q = qList[0] || 1000;

            const qo = parseFloat(document.getElementById('calc-qty-ordered').value) || 0;
            const oqVal = qo || q;

            let calcRes = calculateForSingleQty(q);
            if (!calcRes) return "Napaka pri generiranju naloga.";
            let d = calcRes.details;

            let customer = document.getElementById('calc-customer').value || "Ni vpisano";
            let customerCode = document.getElementById('calc-customer-code') ? document.getElementById('calc-customer-code').value : "";
            let custAddress = document.getElementById('calc-cust-address').value || "";
            let custEmail = document.getElementById('calc-cust-email') ? document.getElementById('calc-cust-email').value : "";
            let deliveryAddress = document.getElementById('calc-delivery-address').value || "";

            let dnNum = document.getElementById('calc-dn-number') ? document.getElementById('calc-dn-number').value : "";
            let dnOld = document.getElementById('calc-dn-old') ? document.getElementById('calc-dn-old').value : "";
            let deadline = document.getElementById('calc-dn-deadline') ? document.getElementById('calc-dn-deadline').value : "";
            let urgent = document.getElementById('calc-dn-urgent') && document.getElementById('calc-dn-urgent').checked;
            let packaging = document.getElementById('calc-dn-packaging') ? document.getElementById('calc-dn-packaging').value : "";

            let quoteNum = document.getElementById('calc-quote-number').value || "";
            let product = document.getElementById('calc-project-name').value || "Ni vpisano";
            let dnNotes = document.getElementById('calc-notes') ? document.getElementById('calc-notes').value : "";

            let qty = q;

            let materialCode = document.getElementById('calc-material-code').value || "";
            let envType = document.getElementById('envelope-preset').options[document.getElementById('envelope-preset').selectedIndex].text;
            let formatW = document.getElementById('width').value || 0;
            let formatH = document.getElementById('height').value || 0;

            let date = new Date().toLocaleDateString('sl-SI');

            // Formatiranje barv
            const cFront = parseFloat(document.getElementById('calc-colors-front').value) || 0;
            const cBack = parseFloat(document.getElementById('calc-colors-back').value) || 0;
            const isObr = document.getElementById('calc-is-obrat').checked;
            let colors = cFront + ' / ' + (isObr ? 'obračanje' : cBack);

            let tiskMode = "enostransko";
            if (isObr) {
                tiskMode = "obračanje";
            } else if (cBack > 0) {
                tiskMode = "obojestransko (2 prehoda)";
            }

            let waste = d.material.waste || 0;
            let givenDodatekInput = document.getElementById('calc-given-sheets') ? parseInt(document.getElementById('calc-given-sheets').value) : NaN;
            
            // Če ni vpisanega dodatka za nalog, ne uporabimo avtomatskega iz kalkulacije, temveč 0
            let finalDodatek = 0;
            if (!isNaN(givenDodatekInput) && givenDodatekInput >= 0) {
                finalDodatek = givenDodatekInput;
            }

            let totalQ = q + qo + finalDodatek;

            let roundedPrintTime = totalQ / d.print.speed;
            let roundedPrepTime = d.plates.plateCount * 0.15; // 0.15h per plate as setup estimation

            let finishList = getActiveFinishingList();

            const defaultContent = `
                <div class="header-top">
                    <div style="width: 50%;">
                        <div class="bold" style="font-size: 14px;">${customer} &nbsp;&nbsp;&nbsp; (Šifra stranke: ${customerCode})</div>
                        <div>${custAddress.replace(/\\n/g, '<br>')}</div>
                        <div>${custEmail ? '<br>' + custEmail : ''}</div>
                    </div>
                    <div style="width: 50%; text-align: right; font-size: 16px; font-weight: bold;">
                        Tiskarna PETRIČ
                    </div>
                </div>

                <table style="margin-top: 10px;">
                    <tr>
                        <td style="width: 50%;">
                            ${urgent ? '<div class="urgent">NUJNO!</div>' : ''}
                            <div><span class="bold">Rok izdelave:</span> ${deadline}</div>
                        </td>
                        <td style="width: 50%; text-align: right;">
                            <div class="bold" style="font-size: 16px;">D.N.: ${dnNum}</div>
                            ${dnOld ? `<div>Stari D.N. (montaža): ${dnOld}</div>` : ''}
                            <div>Datum naloga: ${date}</div>
                        </td>
                    </tr>
                </table>

                <table style="margin-top: 15px; width: 100%;">
                    <tr>
                        <td class="bold" style="font-size: 15px; width: 50%;">${product}</td>
                        <td style="width: 50%; text-align: right;"></td>
                    </tr>
                </table>

                <table style="margin-top: 5px; width: 100%;">
                    <tr><td style="width: 15%;">Količina:</td><td class="bold" style="font-size: 15px;">${qty.toLocaleString('de-DE')} kos</td></tr>
                    <tr><td>Format:</td><td class="bold">${envType} (${formatW} x ${formatH} mm)</td></tr>
                    <tr><td>Tisk:</td><td class="bold">${colors}</td></tr>
                    <tr><td>Material:</td><td class="bold">Kuverte - šifra: ${materialCode}</td></tr>
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

                <table style="margin-top: 5px;">
                    <tr>
                        <td style="width: 15%;">Kop. plošč:</td>
                        <td class="bold">${d.plates.plateCount} kom. <strong>S4</strong></td>
                    </tr>
                </table>
                <table style="margin-top: 5px; width: 100%;">
                    <tr>
                        <td style="width: 15%; font-weight: bold;"><strong>S4</strong> priprava:</td>
                        <td class="bold" style="width: 55%;">${tiskMode}</td>
                        <td style="width: 30%; text-align: right;" class="bold" colspan="2"><span class="bold">priprava:</span> ${roundedPrepTime.toFixed(2)} h</td>
                    </tr>
                    <tr>
                        <td>Tisk:</td>
                        <td class="bold" style="width: 55%; white-space: nowrap;">${qty.toLocaleString('de-DE')} + ${finalDodatek.toLocaleString('de-DE')} = ${totalQ.toLocaleString('de-DE')} kuvert</td>
                        <td style="width: 30%; text-align: right;" class="bold" colspan="2"><span class="bold">tisk:</span> ${roundedPrintTime.toFixed(2)} h</td>
                    </tr>
                </table>

                <div class="row-divider"></div>

                <table>
                    <tr>
                        <td style="width: 15%;">Dodelava:</td>
                        <td class="bold">${finishList ? finishList : 'Brez posebne dodelave'}</td>
                    </tr>
                    <tr>
                        <td style="width: 15%; padding-top: 10px;">Pakiranje:</td>
                        <td class="bold" style="padding-top: 10px;">${packaging}</td>
                    </tr>
                </table>

                <div class="row-divider"></div>

                <div class="bold" style="margin-bottom: 5px;">Poraba materiala:</div>
                <table>
                    <tr>
                        <td>of. plošče (<strong>S4</strong>):</td>
                        <td style="text-align: right;" class="bold">${d.plates.plateCount} kos</td>
                    </tr>
                    <tr>
                        <td>Material (${envType} [Šifra: ${materialCode}]):</td>
                        <td style="text-align: right;" class="bold">${totalQ.toLocaleString('de-DE')} kos</td>
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
                        <td style="width: 20%; white-space: nowrap;"><span class="bold">Št. ponudbe:</span> ${quoteNum || '/'}</td>
                        <td style="width: 25%; text-align: center; white-space: nowrap;"><span class="bold">Cena za kos:</span> ${formatPrice(calcRes.pricePerItem, 4)}</td>
                        <td style="width: 30%; text-align: center; white-space: nowrap;"><span class="bold">Cena za 1000 kos:</span> ${formatPrice(calcRes.pricePerItem * 1000, 2)}</td>
                        <td style="width: 25%; text-align: right; white-space: nowrap;"><span class="bold">Skupaj:</span> ${formatPrice(calcRes.finalTotal, 2)}</td>
                    </tr>
                </table>
            `;

            let contentToRender = window.g_editedWorkOrderHTML ? window.g_editedWorkOrderHTML : defaultContent;

            return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Delovni Nalog - ${dnNum || product}</title>
                <style>
                    body { font-family: Arial, sans-serif; font-size: 13px; line-height: 1.25; color: #000; margin: 0; padding: 0; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 6px; }
                    td, th { padding: 2px 0; vertical-align: top; }
                    .header-top { display: flex; justify-content: space-between; border-bottom: 1px solid #000; padding-bottom: 4px; margin-bottom: 8px; }
                    .bold { font-weight: bold; }
                    .title { font-size: 16px; font-weight: bold; text-transform: uppercase; }
                    .row-divider { border-top: 1px dashed #000; margin: 10px 0; }
                    .urgent { color: red; font-size: 18px; font-weight: bold; text-transform: uppercase; }
                    @media print { .no-print { display: none !important; } }
                    .editable-area:focus { outline: 2px dashed #3b82f6; background-color: #eff6ff; }
                    .editable-area.waiting-for-paste { cursor: cell !important; outline: 3px dashed #eab308 !important; background-color: #fffbeb !important; }
                </style>
            </head>
            <body>
                <div class="no-print" contenteditable="false" style="background: #f1f5f9; padding: 10px; border-bottom: 1px solid #cbd5e1; display: flex; gap: 15px; align-items: center; justify-content: start; font-family: sans-serif; box-sizing: border-box; width: 100%; flex-wrap: wrap;">
                    <button onclick="window.print()" style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px;">NATISNI DN</button>
                    <button onclick="window.close()" style="background: #64748b; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px;">ZAPRI</button>
                    <button onclick="if(confirm('Ali želite ponastaviti delovni nalog na privzete vrednosti? (Spremembe besedila bodo izgubljene)')){ if(window.opener){window.opener.g_editedWorkOrderHTML='';} window.location.reload(); }" style="background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px;">PONASTAVI</button>
                    <button id="btn-move-text" onclick="toggleMoveMode(this)" style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px;" title="Premakni označeno besedilo na drugo mesto. Označite besedilo, kliknite ta gumb in nato kliknite na novo mesto v besedilu.">PREMAKNI</button>
                    <button onclick="saveDNToDisk()" style="background: #8b5cf6; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px;" title="Shrani ta delovni nalog kot datoteko na računalnik">SHRANI DN NA DISK</button>
                    
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
                    <div style="font-size: 12px; color: #475569; margin-left: 5px;">💾 Spremembe besedila se samodejno shranjujejo v kalkulacijo.</div>
                </div>
                <div class="editable-area" contenteditable="true" style="padding: 20px;">
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
                        const htmlContent = "<!DOCTYPE html>\\n" + document.documentElement.outerHTML;
                        const blob = new Blob([htmlContent], {type: "text/html;charset=utf-8"});
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        let fileName = document.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                        if (!fileName) fileName = "delovni_nalog";
                        a.download = fileName + ".html";
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
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
                alert("Napaka pri pripravi delovnega naloga: " + e.message);
                console.error(e);
            }
        }

        function getProductionOrderHTML() {
            const customer = document.getElementById('calc-customer').value || '/';
            const projectName = document.getElementById('calc-project-name').value || '/';
            const wText = document.getElementById('width').value;
            const hText = document.getElementById('height').value;
            const dimensionDisplay = `${wText} x ${hText} mm`;
            const materialCode = document.getElementById('calc-material-code').value || '/';
            const envPreset = document.getElementById('envelope-preset');
            const envType = envPreset.options[envPreset.selectedIndex].text;
            const preparedBy = document.getElementById('calc-prepared-by').value || '';
            const date = new Date().toLocaleDateString('sl-SI');

            const canvas = document.getElementById('canvas');
            let canvasImage = '';
            if (canvas) {
                canvasImage = canvas.toDataURL('image/png');
            }

            return `
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>MONTAŽA</title>
                    <style>
                        body { font-family: 'Arial', sans-serif; padding: 40px; color: #000; text-align: center; } 
                        h1 { font-size: 28px; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; } 
                        .info { font-size: 20px; margin-bottom: 30px; line-height: 1.5; } 
                        .schema-box { border: 1px solid #000; padding: 20px; display: inline-block; background: #fff; } 
                        .footer { margin-top: 50px; font-size: 12px; color: #666; font-style: italic; }    
                        .editable-area.waiting-for-paste { cursor: cell !important; outline: 3px dashed #eab308 !important; background-color: #fffbeb !important; }
                    </style>
                </head>
                <body>
                    <h1>MONTAŽNI LIST</h1>
                    <div class="info">
                        <strong>STRANKA:</strong> ${customer}<br>
                        <strong>IZDELEK:</strong> ${projectName}<br>
                        <div style="margin: 10px 0; border: 1px dashed #ccc; padding: 10px; display: inline-block; text-align: left;">
                            <strong>DIMENZIJE KUVERTE:</strong><br>${dimensionDisplay}
                        </div><br>
                        <strong>TIP KUVERTE:</strong> ${envType}<br>
                        <strong>ŠIFRA:</strong> ${materialCode}
                    </div>
                    <div class="schema-box">
                        <div style="font-size: 12px; font-weight: bold; margin-bottom: 10px; text-align: left;">PREDOGLED KUVERTE:</div>
                        <img src="${canvasImage}" style="max-width: 100%; height: auto; max-height: 600px;">
                    </div>
                    <div class="footer">Datum: ${date} | Pripravil: ${preparedBy}<br><span style="color: red; font-weight: bold; font-size: 14px;">INTERNI DOKUMENT - TISKARNA PETRIČ</span></div>
                </body>
                </html>`;
        }

        function printProductionOrder() {
            try {
                const html = getProductionOrderHTML();
                const printWindow = window.open('', '', 'width=800,height=900');
                if (printWindow) {
                    printWindow.document.write(html);
                    printWindow.document.close();
                    printWindow.focus();
                } else {
                    alert("Pojavno okno je blokirano.");
                }
            } catch (e) {
                alert("Napaka pri pripravi montaže: " + e.message);
                console.error(e);
            }
        }

        function exportQuoteWord() {
            try {
                const htmlContent = getQuoteHTML(true);
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

        function openQuotePreview(isAT = false) {
            try {
                const html = getQuoteHTML(false, isAT);
                const previewWindow = window.open('', '', 'width=950,height=900');
                if (previewWindow) {
                    previewWindow.document.write(html);
                    previewWindow.document.close();
                    previewWindow.focus();
                } else {
                    alert("Pojavno okno je blokirano. Prosimo, dovolite pojavna okna za to stran.");
                }
            } catch (e) {
                alert("Napaka pri pripravi ponudbe: " + e.message);
                console.error(e);
            }
        }

        const sheetB3 = { w: 500, h: 350, name: "B3" };
        const gripper = 10;
        const bleed = 0;

        function formatPrice(num, decimals = 2) {
            if (num == null || isNaN(num)) return "0,00";
            let parts = Number(num).toFixed(decimals).split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            return parts.join(',') + " €";
        }

        function updatePlates() {
            const cFront = parseInt(document.getElementById('calc-colors-front').value) || 0;
            const cBack = parseInt(document.getElementById('calc-colors-back').value) || 0;
            const isObr = document.getElementById('calc-is-obrat').checked;
            const isDigital = document.getElementById('calc-machine') && document.getElementById('calc-machine').value === 'Digitalni tisk';

            // Če je obračanje, se plošče uporabijo za obe strani (računamo samo sprednje)
            // Sicer se seštejejo. Če gre za digitalni tisk, plošč ni.
            const autoPlates = isDigital ? 0 : (cFront + (isObr ? 0 : cBack));
            document.getElementById('calc-plate-count').value = autoPlates;

            calculate();
        }

        function calculateForSingleQty(q) {
            const qo = parseFloat(document.getElementById('calc-qty-ordered').value) || 0;
            const mPrice = parseFloat(document.getElementById('calc-material-price').value) || 0;
            const cFront = parseFloat(document.getElementById('calc-colors-front').value) || 0;
            const cBack = parseFloat(document.getElementById('calc-colors-back').value) || 0;
            const mRate = parseFloat(document.getElementById('calc-machine-rate').value) || 120;
            const mSpeed = parseFloat(document.getElementById('calc-machine-speed').value) || 10000;
            const platePrice = parseFloat(document.getElementById('calc-plate-price').value) || 0;
            const plateCount = parseInt(document.getElementById('calc-plate-count').value) || 0;
            const prepPrice = parseFloat(document.getElementById('calc-prep-price').value) || 0;
            const changePrice = parseFloat(document.getElementById('calc-change-price').value) || 0;
            const colorChangeCount = parseInt(document.getElementById('calc-color-change-count').value) || 0;
            const changePriceBase = parseFloat(document.getElementById('calc-color-change-price').value) || 0;
            const persCount = parseFloat(document.getElementById('calc-personalization').value) || 0;
            const manualWork = parseFloat(document.getElementById('calc-manual-work').value) || 0;
            const margin = parseFloat(document.getElementById('calc-margin').value) || 0;
            const usePers = document.getElementById('calc-use-personalization').checked;
            const useManual = document.getElementById('calc-use-manual-work').checked;
            const commercialCost = parseFloat(document.getElementById('calc-commercial').value) || 0;

            // Dodatek (makulatura)
            const manualWaste = parseFloat(document.getElementById('calc-waste-manual').value);
            let waste = 320;
            if (!isNaN(manualWaste)) {
                waste = manualWaste;
            } else {
                const isObr = document.getElementById('calc-is-obrat').checked;
                if (cFront === 4 && cBack === 4) {
                    waste = isObr ? 320 : 640;
                } else {
                    waste = 320;
                }
            }
            document.getElementById('calc-waste').value = waste;

            let deliveryCost = 0;
            if (document.getElementById('f-delivery-active') && document.getElementById('f-delivery-active').checked) {
                deliveryCost += (parseFloat(document.getElementById('f-post-count').value) || 0) * (parseFloat(document.getElementById('f-post-price-per').value) || 0);
            }
            if (document.getElementById('f-del-fixed-active') && document.getElementById('f-del-fixed-active').checked) {
                deliveryCost += parseFloat(document.getElementById('f-del-fixed-price').value) || 0;
            }

            const overrideTotal = document.getElementById('calc-override-total') ? parseFloat(document.getElementById('calc-override-total').value) : NaN;
            let totalQ = q + qo + waste;
            if (!isNaN(overrideTotal) && overrideTotal > 0) {
                totalQ = overrideTotal;
            }
            const materialCost = (totalQ / 1000) * mPrice;
            const totalColors = cFront + cBack;

            // Formula: (NumPlates * PlatePrice) + PrepPrice + ((NumPlates - 1) * ChangePrice)
            let numChanges = Math.max(0, plateCount - 1);
            let platesBaseCost = plateCount * platePrice;
            let changesCost = numChanges * changePrice;
            let totalPlatePrepCost = platesBaseCost + prepPrice + changesCost;

            let autoColorChangeCost = 0;
            let autoColorChangeCount = 0;
            if (totalColors > 0 && totalColors < 4) {
                autoColorChangeCount = totalColors - 1;
                autoColorChangeCost = autoColorChangeCount * changePriceBase;
            }
            let manualColorChangeCost = colorChangeCount * changePriceBase;
            let colorChangeCost = autoColorChangeCost + manualColorChangeCost;

            let printCost = 0;
            if (mSpeed > 0) {
                printCost = (totalQ / mSpeed) * mRate;
            }

            const persCost = usePers ? (persCount * 0.05) : 0;
            let manualCost = 0;
            if (useManual && manualWork > 0) {
                manualCost = (totalQ / manualWork) * 20;
            }
            const additionalCost = persCost + manualCost;

            let subtotalWithoutDelivery = materialCost + totalPlatePrepCost + colorChangeCost + printCost + additionalCost + commercialCost;

            if (document.getElementById('calc-minus-price') && document.getElementById('calc-minus-price').checked) {
                subtotalWithoutDelivery = subtotalWithoutDelivery * 0.952; // -4.8%
            }

            let subtotal = subtotalWithoutDelivery + deliveryCost;

            const marginAmount = (subtotal * margin) / 100;
            const finalTotal = subtotal + marginAmount;

            return {
                qty: q,
                materialCost,
                platesCost: totalPlatePrepCost,
                colorChangeCost,
                printCost,
                additionalCost,
                finalTotal,
                pricePerItem: finalTotal / q,
                details: {
                    material: { cost: materialCost, q: totalQ, mPrice, waste },
                    plates: {
                        plateCount,
                        platePrice,
                        platesBaseCost,
                        prepPrice,
                        numChanges,
                        changePrice,
                        changesCost,
                        cost: totalPlatePrepCost
                    },
                    colorChange: { cost: colorChangeCost, autoCost: autoColorChangeCost, autoCount: autoColorChangeCount, manualCost: manualColorChangeCost, manualCount: colorChangeCount, priceBase: changePriceBase },
                    print: { cost: printCost, speed: mSpeed, rate: mRate },
                    additional: { cost: additionalCost, persCost, manualCost },
                    commercial: { cost: commercialCost },
                    delivery: { cost: deliveryCost },
                    margin: { amount: marginAmount, percent: margin },
                    finalTotal
                }
            };
        }

        function renderDetailedSpec(details, q) {
            const content = document.getElementById('detailed-spec-content');
            if (!content) return;

            let html = `
            <div style="padding: 10px; background: rgba(59, 130, 246, 0.05); border-radius: 8px;">
              <div style="font-weight: bold; color: #60a5fa; margin-bottom: 5px;">1. Material</div>
              <div style="display: grid; grid-template-columns: 1fr auto; gap: 5px; color: #cbd5e1;">
                <span>Osnova (${formatQty(details.material.q)} kos × ${(details.material.cost / details.material.q * 1000).toFixed(4)}€/1000):</span> <span>${formatPrice(details.material.cost)}</span>
              </div>
            </div>
    
            <div style="padding: 10px; background: rgba(167, 139, 250, 0.05); border-radius: 8px;">
              <div style="font-weight: bold; color: #a78bfa; margin-bottom: 5px;">2. Priprava in Plošče</div>
              <div style="display: grid; grid-template-columns: 1fr auto; gap: 5px; color: #cbd5e1;">
                <span>Plošče (${details.plates.plateCount} kos × ${formatPrice(details.plates.platePrice, 2).replace(' €', '')}):</span> <span>${formatPrice(details.plates.platesBaseCost)}</span>
                <span>Priprava stroja:</span> <span>${formatPrice(details.plates.prepPrice)}</span>
                ${details.plates.numChanges > 0 ? `<span>Menjava plošč (${details.plates.numChanges} × ${formatPrice(details.plates.changePrice, 2).replace(' €', '')}):</span> <span>${formatPrice(details.plates.changesCost)}</span>` : ''}
                ${details.colorChange.autoCost > 0 ? `<span>Menjava barve (< 4 barve) (${details.colorChange.autoCount} × ${formatPrice(details.colorChange.priceBase, 2).replace(' €', '')}):</span> <span>${formatPrice(details.colorChange.autoCost)}</span>` : ''}
                ${details.colorChange.manualCost > 0 ? `<span>Dodatna menjava barve (${details.colorChange.manualCount} × ${formatPrice(details.colorChange.priceBase, 2).replace(' €', '')}):</span> <span>${formatPrice(details.colorChange.manualCost)}</span>` : ''}
                <div style="grid-column: 1/-1; height: 1px; background: rgba(255,255,255,0.1); margin: 3px 0;"></div>
                <span style="font-weight: bold;">Skupaj priprava in plošče:</span> <span style="font-weight: bold;">${formatPrice(details.plates.cost + details.colorChange.cost)}</span>
              </div>
            </div>

                <div style="padding: 10px; background: rgba(16, 185, 129, 0.05); border-radius: 8px;">
                    <div style="font-weight: bold; color: #10b981; margin-bottom: 5px;">3. Tisk</div>
                    <div style="display: grid; grid-template-columns: 1fr auto; gap: 5px; color: #cbd5e1;">
                        <span>Strojno delo:</span> <span>${formatPrice(details.print.cost)}</span>
                        <small style="grid-column: 1/-1; color: #94a3b8;">Hitrost: ${details.print.speed} kos/h | Urna post.: ${details.print.rate}€/h</small>
                    </div>
                </div>

                ${details.additional.cost > 0 ? `
                <div style="padding: 10px; background: rgba(236, 72, 153, 0.05); border-radius: 8px;">
                    <div style="font-weight: bold; color: #ec4899; margin-bottom: 5px;">5. Dodatno / Dodelava</div>
                    <div style="display: grid; grid-template-columns: 1fr auto; gap: 5px; color: #cbd5e1;">
                        ${details.additional.persCost > 0 ? `<span>Personalizacija:</span> <span>${formatPrice(details.additional.persCost)}</span>` : ''}
                        ${details.additional.manualCost > 0 ? `<span>Ročno delo:</span> <span>${formatPrice(details.additional.manualCost)}</span>` : ''}
                    </div>
                </div>
                ` : ''}
    
                ${(details.commercial.cost > 0 || details.delivery.cost > 0) ? `
                <div style="padding: 10px; background: rgba(251, 191, 36, 0.05); border-radius: 8px;">
                    <div style="font-weight: bold; color: #fbbf24; margin-bottom: 5px;">6. Ostalo</div>
                    <div style="display: grid; grid-template-columns: 1fr auto; gap: 5px; color: #cbd5e1;">
                        ${details.commercial.cost > 0 ? `<span>Komerciala / Admin:</span> <span>${formatPrice(details.commercial.cost)}</span>` : ''}
                        ${details.delivery.cost > 0 ? `<span>Dostava:</span> <span>${formatPrice(details.delivery.cost)}</span>` : ''}
                    </div>
                </div>
                ` : ''}


                ${details.margin.amount > 0 ? `
                <div style="padding: 10px; border-top: 1px dashed rgba(255,255,255,0.1); margin-top: 5px;">
                    <div style="display: grid; grid-template-columns: 1fr auto; gap: 5px; color: #cbd5e1;">
                        <span>Pribitek / Marža (${details.margin.percent}%):</span> <span>${formatPrice(details.margin.amount)}</span>
                    </div>
                </div>
                ` : ''}

                <div style="padding: 10px; border-top: 2px solid #10b981; margin-top: 5px; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 1rem; font-weight: bold; color: #10b981;">SKUPAJ (brez DDV):</span>
                    <span style="font-size: 1.25rem; font-weight: 800; color: #10b981;">${formatPrice(details.finalTotal)}</span>
                </div>
            `;
            content.innerHTML = html;
        }

        const envelopePresets = {
            'Amerikanka_LO': { w: 230, h: 110 },
            'Amerikanka_DO': { w: 230, h: 110 },
            'Amerikanka_BO': { w: 230, h: 110 },
            'C6': { w: 230, h: 162 },
            'DL': { w: 220, h: 220 },
            'C5': { w: 324, h: 229 },
            'C4': { w: 458, h: 324 },
            'B5': { w: 353, h: 250 },
            'B4': { w: 500, h: 353 }
        };

        function applyEnvelopePreset() {
            const type = document.getElementById('envelope-preset').value;
            if (type !== 'custom' && envelopePresets[type]) {
                document.getElementById('width').value = envelopePresets[type].w;
                document.getElementById('height').value = envelopePresets[type].h;
                calculate();
            }
        }

        function optimizeLayout(sheetW, sheetH, itemW, itemH, grip) {
            // Kuverte se tiskajo posamezno (1 na tiskovni prehod)
            if (itemW <= sheetW && itemH <= sheetH) {
                return { count: 1, cols: 1, rows: 1, itemW, itemH };
            }
            if (itemH <= sheetW && itemW <= sheetH) {
                return { count: 1, cols: 1, rows: 1, itemW: itemH, itemH: itemW };
            }
            return null;
        }

        function formatQty(val) {
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }

        function calculate() {
            const widthVal = parseFloat(document.getElementById('width').value) || 0;
            const heightVal = parseFloat(document.getElementById('height').value) || 0;
            const w = widthVal + (2 * bleed);
            const h = heightVal + (2 * bleed);

            const qStr = document.getElementById('calc-quantities').value.trim();
            const qtyInput = document.getElementById('calc-quantities');

            if (!qStr) {
                qtyInput.style.animation = 'blinkRequired 1.5s infinite';
                qtyInput.focus();
                return;
            }
            qtyInput.style.animation = 'none';

            const qList = qStr.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n) && n > 0);
            if (qList.length === 0) return;
            const q = qList[0];

            // Samodejna prilagoditev hitrosti
            const speedInput = document.getElementById('calc-machine-speed');
            const autoSpeed = document.getElementById('calc-auto-speed').checked;
            if (speedInput && autoSpeed) {
                if (q <= 100) {
                    speedInput.value = 1600;
                } else if (q <= 500) {
                    let interpolatedSpeed = 1600 + (q - 100) * (2100 - 1600) / (500 - 100);
                    speedInput.value = Math.round(interpolatedSpeed);
                } else if (q <= 1000) {
                    let interpolatedSpeed = 2100 + (q - 500) * (2500 - 2100) / (1000 - 500);
                    speedInput.value = Math.round(interpolatedSpeed);
                } else if (q <= 2000) {
                    let interpolatedSpeed = 2500 + (q - 1000) * (3300 - 2500) / (2000 - 1000);
                    speedInput.value = Math.round(interpolatedSpeed);
                } else {
                    speedInput.value = 3300;
                }
            }

            let layout = optimizeLayout(sheetB3.w, sheetB3.h, w, h, gripper);
            if (!layout) {
                alert("Format je prevelik za B3 polo!");
                return;
            }

            const usage = (layout.count * widthVal * heightVal) / (sheetB3.w * sheetB3.h);
            const sheetsNeeded = Math.ceil(q / layout.count);

            document.getElementById('res-count').innerText = layout.count;
            document.getElementById('res-count-mini').innerText = layout.count;
            document.getElementById('res-usage').innerText = (usage * 100).toFixed(1) + '%';
            document.getElementById('res-usage-mini').innerText = (usage * 100).toFixed(1) + '%';
            document.getElementById('res-sheets-needed').innerText = formatQty(sheetsNeeded);
            document.getElementById('sticky-qty').innerText = formatQty(q);

            drawCanvas(sheetB3.w, sheetB3.h, layout);
            calculatePrice();
        }

        function calculatePrice() {
            const quantitiesStr = document.getElementById('calc-quantities').value.trim();
            if (!quantitiesStr) {
                document.getElementById('results-tbody').innerHTML = '';
                document.getElementById('detailed-spec-content').innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 20px;">Vnesite naklado za prikaz izračuna.</div>';

                // Clear sticky footer
                document.getElementById('sticky-qty').innerText = '-';
                document.getElementById('sticky-price-per-item').innerText = '0.0000 €';
                document.getElementById('sticky-price-total-bottom').innerText = '0.00 €';

                // Clear stats
                document.getElementById('res-count').innerText = '0';
                document.getElementById('res-count-mini').innerText = '-';
                document.getElementById('res-usage').innerText = '0%';
                document.getElementById('res-usage-mini').innerText = '-';
                document.getElementById('res-sheets-needed').innerText = '0';
                return;
            }
            const qList = quantitiesStr.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n) && n > 0);
            if (qList.length === 0) return;

            let tbodyHtml = '';
            let firstResult = null;

            qList.forEach((q, index) => {
                const res = calculateForSingleQty(q);
                if (index === 0) firstResult = res;

                tbodyHtml += `
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <td style="padding: 0.5rem; text-align: left; font-weight: bold; color: var(--item-color-blue);">${formatQty(q)}</td>
                        <td style="padding: 0.5rem;">${formatPrice(res.materialCost, 2)}</td>
                        <td style="padding: 0.5rem;">${formatPrice(res.platesCost, 2)}</td>
                        <td style="padding: 0.5rem;">${formatPrice((res.printCost + res.colorChangeCost), 2)}</td>
                        <td style="padding: 0.5rem;">${formatPrice(res.additionalCost, 2)}</td>
                        <td style="padding: 0.5rem; font-weight: bold; color: var(--accent-color);">${formatPrice(res.finalTotal, 2)}</td>
                        <td style="padding: 0.5rem; color: #10b981; font-weight: bold;">${formatPrice(res.pricePerItem, 4)}</td>
                    </tr>
                `;
            });

            document.getElementById('results-tbody').innerHTML = tbodyHtml;

            if (firstResult) {
                renderDetailedSpec(firstResult.details, firstResult.qty);
                // Update sticky footer
                document.getElementById('sticky-qty').innerText = formatQty(firstResult.qty);
                document.getElementById('sticky-price-total-bottom').innerText = firstResult.finalTotal.toFixed(2) + " €";
                document.getElementById('sticky-price-per-item').innerText = firstResult.pricePerItem.toFixed(4) + " €";

                // Update stats grid if exists
                if (document.getElementById('res-price-per-item')) {
                    document.getElementById('res-price-per-item').innerText = firstResult.pricePerItem.toFixed(4) + " €";
                }
            }
        }

        function drawCanvas(sw, sh, layout) {
            const canvas = document.getElementById('canvas');
            const ctx = canvas.getContext('2d');

            // Dinamična velikost platna glede na starša
            const container = document.getElementById('canvas-container');
            canvas.width = container.clientWidth - 10;
            canvas.height = container.clientHeight - 10;
            if (canvas.height < 250) canvas.height = 250;

            // Zbrišemo prejšnji izris
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const envType = document.getElementById('envelope-preset').value;
            const wText = Math.round(layout.itemW - 2 * bleed);
            const hText = Math.round(layout.itemH - 2 * bleed);

            // Izračun povečave za optimalen prikaz kuverte
            const padding = 20;
            const availableW = canvas.width - (padding * 2);
            const availableH = canvas.height - (padding * 2);
            const scale = Math.min(availableW / wText, availableH / hText);

            const wScaled = wText * scale;
            const hScaled = hText * scale;

            const x = (canvas.width - wScaled) / 2;
            const y = (canvas.height - hScaled) / 2;

            // Senca
            ctx.shadowColor = 'rgba(0,0,0,0.4)';
            ctx.shadowBlur = 15;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;

            // Osnova kuverte
            ctx.fillStyle = '#f8fafc'; // Bela/svetla
            ctx.fillRect(x, y, wScaled, hScaled);

            // Odstrani senco za ostale elemente
            ctx.shadowColor = 'transparent';

            // Rob kuverte
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, wScaled, hScaled);

            // Zaklopec (vizualno ponazoritev zapiranja kuverte - zgornji rob do sredine)
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + wScaled / 2, y + Math.min(hScaled * 0.3, 40 * scale));
            ctx.lineTo(x + wScaled, y);
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Risanje oken, če obstajajo
            // Standardno okno pri Amerikanki je 90x45, odmik z leve/desne 20mm in od spodaj 20mm
            if (envType === 'Amerikanka_LO') {
                const winW = 90 * scale;
                const winH = 45 * scale;
                const winX = x + (20 * scale);
                const winY = y + hScaled - (20 * scale) - winH;

                ctx.fillStyle = 'rgba(59, 130, 246, 0.15)'; // Prosojno modro okence
                ctx.fillRect(winX, winY, winW, winH);
                ctx.strokeStyle = '#60a5fa';
                ctx.strokeRect(winX, winY, winW, winH);
            } else if (envType === 'Amerikanka_DO') {
                const winW = 90 * scale;
                const winH = 45 * scale;
                const winX = x + wScaled - (20 * scale) - winW;
                const winY = y + hScaled - (20 * scale) - winH;

                ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
                ctx.fillRect(winX, winY, winW, winH);
                ctx.strokeStyle = '#60a5fa';
                ctx.strokeRect(winX, winY, winW, winH);
            }

            // Besedilo z dimenzijo na sredini
            ctx.fillStyle = '#334155';
            ctx.font = 'bold 18px Inter';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${wText} x ${hText} mm`, x + wScaled / 2, y + hScaled / 2);
        }

        calculate();

        // --- ARHIV IN STRANKE ---
        var STORAGE_KEY = 'kuverte_kalkulator_arhiv';

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
        }document.getElementById('calc-customer').addEventListener('input', function (e) { handleCustomerUpdate(e.target.value); });

        function saveCurrentProject() {
            let name = document.getElementById('calc-project-name').value.trim();
            if (!name) { alert("Prosimo vnesite izdelek!"); return; }

            const data = {
                id: Date.now(),
                name: name,
                date: new Date().toLocaleString('sl-SI'),
                customer: document.getElementById('calc-customer').value,
                custAddress: document.getElementById('calc-cust-address').value,
                deliveryAddress: document.getElementById('calc-delivery-address') ? document.getElementById('calc-delivery-address').value : "",
                custEmail: document.getElementById('calc-cust-email').value,
                quoteNum: document.getElementById('calc-quote-number').value,
                customerCode: document.getElementById('calc-customer-code').value,
                preparedBy: document.getElementById('calc-prepared-by').value,
                materialCode: document.getElementById('calc-material-code').value,
                notes: document.getElementById('calc-notes') ? document.getElementById('calc-notes').value : '',
                editedQuoteHTML: window.g_editedQuoteHTML || '',
                editedQuoteATHTML: window.g_editedQuoteATHTML || '',
                editedWorkOrderHTML: window.g_editedWorkOrderHTML || '',
                inputs: {
                    item_w: document.getElementById('width').value,
                    item_h: document.getElementById('height').value,
                    envelopePreset: document.getElementById('envelope-preset').value,
                    quantities: document.getElementById('calc-quantities').value,
                    qtyOrdered: document.getElementById('calc-qty-ordered').value,
                    mPrice: document.getElementById('calc-material-price').value,
                    packaging: document.getElementById('calc-packaging').value,
                    margin: document.getElementById('calc-margin').value,
                    colorsFront: document.getElementById('calc-colors-front').value,
                    colorsBack: document.getElementById('calc-colors-back').value,
                    mRate: document.getElementById('calc-machine-rate').value,
                    mSpeed: document.getElementById('calc-machine-speed').value,
                    autoSpeed: document.getElementById('calc-auto-speed').checked,
                    plateDod: document.getElementById('calc-plate-price').value,
                    plateCount: document.getElementById('calc-plate-count').value,
                    colorChangePrice: document.getElementById('calc-color-change-price').value,
                    persCount: document.getElementById('calc-personalization').value,
                    manualWork: document.getElementById('calc-manual-work').value,
                    usePers: document.getElementById('calc-use-personalization').checked,
                    useManual: document.getElementById('calc-use-manual-work').checked,
                    waste: document.getElementById('calc-waste').value,
                    commercial: document.getElementById('calc-commercial').value,
                    deliveryActive: document.getElementById('f-delivery-active') ? document.getElementById('f-delivery-active').checked : false,
                    postCount: document.getElementById('f-post-count') ? document.getElementById('f-post-count').value : '',
                    postPricePer: document.getElementById('f-post-price-per') ? document.getElementById('f-post-price-per').value : '',
                    delFixedActive: document.getElementById('f-del-fixed-active') ? document.getElementById('f-del-fixed-active').checked : false,
                    delFixedPrice: document.getElementById('f-del-fixed-price') ? document.getElementById('f-del-fixed-price').value : '',
                    minusPrice: document.getElementById('calc-minus-price') ? document.getElementById('calc-minus-price').checked : false
                },
                results: {
                    total: document.getElementById('sticky-price-total-bottom').innerText,
                    perItem: document.getElementById('sticky-price-per-item').innerText,
                    sheets: document.getElementById('res-sheets-needed').innerText
                }
            };

            let arhiv = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            arhiv.push(data);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(arhiv));

            document.getElementById('calc-project-name').value = "";
            renderSavedProjects();
            updateCustomerDatalist();
            alert("Projekt '" + name + "' je shranjen v arhiv!");
        }

        async function exportToFile() {
            try {
                let name = document.getElementById('calc-project-name').value.trim() || "Ponudba_Kuverte";
                const data = {
                    name: name,
                    date: new Date().toLocaleString('sl-SI'),
                    customer: document.getElementById('calc-customer').value,
                    custAddress: document.getElementById('calc-cust-address').value,
                    deliveryAddress: document.getElementById('calc-delivery-address') ? document.getElementById('calc-delivery-address').value : "",
                    custEmail: document.getElementById('calc-cust-email').value,
                    quoteNum: document.getElementById('calc-quote-number').value,
                    customerCode: document.getElementById('calc-customer-code').value,
                    preparedBy: document.getElementById('calc-prepared-by').value,
                    materialCode: document.getElementById('calc-material-code').value,
                    notes: document.getElementById('calc-notes') ? document.getElementById('calc-notes').value : '',
                    editedQuoteHTML: window.g_editedQuoteHTML || '',
                    editedQuoteATHTML: window.g_editedQuoteATHTML || '',
                    editedWorkOrderHTML: window.g_editedWorkOrderHTML || '',
                    timestamp: Date.now(),
                    inputs: {
                        item_w: document.getElementById('width').value,
                        item_h: document.getElementById('height').value,
                        envelopePreset: document.getElementById('envelope-preset').value,
                        quantities: document.getElementById('calc-quantities').value,
                        qtyOrdered: document.getElementById('calc-qty-ordered').value,
                        mPrice: document.getElementById('calc-material-price').value,
                        packaging: document.getElementById('calc-packaging').value,
                        margin: document.getElementById('calc-margin').value,
                        colorsFront: document.getElementById('calc-colors-front').value,
                        colorsBack: document.getElementById('calc-colors-back').value,
                        mRate: document.getElementById('calc-machine-rate').value,
                        mSpeed: document.getElementById('calc-machine-speed').value,
                        autoSpeed: document.getElementById('calc-auto-speed').checked,
                        plateDod: document.getElementById('calc-plate-price').value,
                        plateCount: document.getElementById('calc-plate-count').value,
                        colorChangePrice: document.getElementById('calc-color-change-price').value,
                        persCount: document.getElementById('calc-personalization').value,
                        manualWork: document.getElementById('calc-manual-work').value,
                        usePers: document.getElementById('calc-use-personalization').checked,
                        useManual: document.getElementById('calc-use-manual-work').checked,
                        isObrat: document.getElementById('calc-is-obrat').checked,
                        wasteManual: document.getElementById('calc-waste-manual').value,
                        commercial: document.getElementById('calc-commercial').value,
                        deliveryActive: document.getElementById('f-delivery-active') ? document.getElementById('f-delivery-active').checked : false,
                        postCount: document.getElementById('f-post-count') ? document.getElementById('f-post-count').value : '',
                        postPricePer: document.getElementById('f-post-price-per') ? document.getElementById('f-post-price-per').value : '',
                        delFixedActive: document.getElementById('f-del-fixed-active') ? document.getElementById('f-del-fixed-active').checked : false,
                        delFixedPrice: document.getElementById('f-del-fixed-price') ? document.getElementById('f-del-fixed-price').value : '',
                        minusPrice: document.getElementById('calc-minus-price') ? document.getElementById('calc-minus-price').checked : false
                    },
                    results: {
                        total: document.getElementById('sticky-price-total-bottom').innerText,
                        perItem: document.getElementById('sticky-price-per-item').innerText,
                        sheets: document.getElementById('res-sheets-needed').innerText
                    }
                };

                let _gv = id => { let el = document.getElementById(id); return el ? el.value : ''; };
                let s_ponudba = (_gv('calc-quote-number') || '').replace(/[\/\\]/g, '-').trim();
                if (s_ponudba) s_ponudba = 'pon.' + s_ponudba;
                let s_stranka = (_gv('calc-customer') || '').trim();
                let s_izdelek = (name || '').trim();
                let s_naklada = (_gv('calc-quantities') || '').replace(/\s+/g, '').replace(/,/g, '-');
                
                let s_front = _gv('calc-colors-front') || '0';
                let s_back = _gv('calc-colors-back') || '0';
                let s_barve = (s_front === '0' && s_back === '0') ? '' : ('b' + s_front + s_back);

                let parts = [s_ponudba, s_stranka, s_izdelek, s_naklada, s_barve].filter(Boolean);
                let baseName = parts.length > 0 ? parts.join('_').replace(/\s+/g, '_') : name.replace(/\s+/g, '_');
                const suggestedFileName = baseName + '.kuverta.json';

                if (window.showSaveFilePicker) {
                    try {
                        const handle = await window.showSaveFilePicker({
                            suggestedName: suggestedFileName,
                            types: [{ description: 'JSON Ponudba (Shranite v C:\\DARKO-KUVERTE)', accept: { 'application/json': ['.json'] } }],
                        });
                        const writable = await handle.createWritable();
                        await writable.write(jsonStr);
                        await writable.close();
                        alert("Datoteka uspešno shranjena!");
                        return;
                    } catch (e) {
                        if (e.name === 'AbortError') return;
                    }
                }

                // Fallback for browsers that don't support showSaveFilePicker
                const blob = new Blob([jsonStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = suggestedFileName;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 100);

            } catch (err) {
                alert("Napaka pri shranjevanju: " + err.message);
            }
        }

        // Pomožna funkcija za varno nastavljanje vrednosti (prepreči "null" napake)
        function setV(id, val, isChecked = false) {
            const el = document.getElementById(id);
            if (el) {
                if (isChecked) el.checked = val;
                else el.value = (val !== undefined && val !== null) ? val : "";
            }
        }

        function loadProjectData(proj) {
            if (!proj || !proj.inputs) return;
            const inp = proj.inputs;

            setV('calc-customer', proj.customer);
            setV('calc-cust-address', proj.custAddress);
            setV('calc-delivery-address', proj.deliveryAddress);
            setV('calc-cust-email', proj.custEmail);
            setV('calc-quote-number', proj.quoteNum);
            setV('calc-customer-code', proj.customerCode);
            setV('calc-prepared-by', proj.preparedBy);
            setV('calc-material-code', proj.materialCode);
            setV('calc-notes', proj.notes);

            g_editedQuoteHTML = proj.editedQuoteHTML || '';
            g_editedQuoteATHTML = proj.editedQuoteATHTML || '';
            g_editedWorkOrderHTML = proj.editedWorkOrderHTML || '';
            window.g_editedQuoteHTML = g_editedQuoteHTML;
            window.g_editedQuoteATHTML = g_editedQuoteATHTML;
            window.g_editedWorkOrderHTML = g_editedWorkOrderHTML;

            setV('width', inp.item_w);
            setV('height', inp.item_h);
            setV('envelope-preset', inp.envelopePreset);
            setV('calc-quantities', inp.quantities);
            setV('calc-qty-ordered', inp.qtyOrdered);
            setV('calc-material-price', inp.mPrice);
            setV('calc-packaging', inp.packaging);
            setV('calc-margin', inp.margin);
            setV('calc-colors-front', inp.colorsFront);
            setV('calc-colors-back', inp.colorsBack);
            setV('calc-machine-rate', inp.mRate);
            setV('calc-machine-speed', inp.mSpeed);
            setV('calc-auto-speed', inp.autoSpeed, true);
            setV('calc-plate-price', inp.plateDod);
            setV('calc-plate-count', inp.plateCount);
            setV('calc-color-change-price', inp.colorChangePrice);
            setV('calc-personalization', inp.persCount);
            setV('calc-manual-work', inp.manualWork);
            setV('calc-use-personalization', inp.usePers, true);
            setV('calc-use-manual-work', inp.useManual, true);
            setV('calc-is-obrat', inp.isObrat, true);
            setV('calc-waste-manual', inp.wasteManual);
            setV('calc-commercial', inp.commercial);
            if (document.getElementById('f-delivery-active')) document.getElementById('f-delivery-active').checked = inp.deliveryActive || false;
            setV('f-post-count', inp.postCount);
            setV('f-post-price-per', inp.postPricePer);
            if (document.getElementById('f-del-fixed-active')) document.getElementById('f-del-fixed-active').checked = inp.delFixedActive || false;
            setV('f-del-fixed-price', inp.delFixedPrice);
            if (document.getElementById('calc-minus-price')) {
                document.getElementById('calc-minus-price').checked = inp.minusPrice || false;
            }

            setV('calc-project-name', proj.name);
            if (typeof calculate === 'function') calculate();
        }

        var g_projectsDirHandle = null;
        var g_diskProjects = [];

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

        async function syncWithFolder() {
            try {
                g_projectsDirHandle = await window.showDirectoryPicker();
                await setHandleInIndexedDB(g_projectsDirHandle, 'kuverte_dir_handle');
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

        async function toggleProjectsDropdown() {
            const list = document.getElementById('projects-dropdown-list');
            if (list.style.display === 'block') {
                list.style.display = 'none';
            } else {
                if (!g_projectsDirHandle) {
                    try {
                        const handle = await getHandleFromIndexedDB('kuverte_dir_handle');
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
                const clist = document.getElementById('cust-dropdown-list');
                if (clist) clist.style.display = 'none';
            }
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

            arhiv.sort((a, b) => b.id - a.id);
            let filtered = filter ? arhiv.filter(proj => {
                const searchStr = getSearchableText(proj).toLowerCase();
                const terms = filter.split(/\s+/).filter(Boolean);
                return terms.every(term => searchStr.includes(term));
            }) : arhiv;

            let html = "";

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

            if (filtered.length > 0) {
                html += '<div style="padding: 5px 12px; background: rgba(59, 130, 246, 0.1); color: #60a5fa; font-size: 0.7rem; font-weight: bold; border-bottom: 1px solid rgba(59, 130, 246, 0.2);">⭐ ARHIV (Baza)</div>';
                filtered.forEach(proj => {
                    const custDisplay = proj.customer ? `<div style="font-size: 0.7rem; color: #6ee7b7;">${proj.customer}</div>` : "";
                    html += `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; border-bottom: 1px solid #334155; transition: background 0.2s;" class="project-item-row" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">
                            <div style="cursor: pointer; flex: 1; min-width: 0;" onclick="loadProject(${proj.id}); toggleProjectsDropdown();">
                                <div style="font-weight: bold; color: #f8fafc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 0.85rem;">
                                    ${proj.name}
                                </div>
                                ${custDisplay}
                                <div style="font-size: 0.7rem; color: #94a3b8; margin-top: 2px;">${proj.date} | ${proj.results ? proj.results.total : '-'}</div>
                            </div>
                            <div style="display: flex; gap: 6px; margin-left: 10px;">
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

        function loadProject(id) {
            let arhiv = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            let proj = arhiv.find(p => p.id === id);
            if (!proj) return;
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

        function updatePlates() {
            const cF = parseInt(document.getElementById('calc-colors-front').value) || 0;
            const cB = parseInt(document.getElementById('calc-colors-back').value) || 0;
            const total = cF + cB;
            document.getElementById('calc-plate-count').value = total;
            calculate();
        }

        window.onload = function () {
            updateCustomerDatalist();
            renderBasket();
            calculate();
        };
    