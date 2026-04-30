        function getQuoteHTML() {
            const quoteNum = document.getElementById('calc-quote-number').value || '/';
            const customer = document.getElementById('calc-customer').value || '';
            const custAddress = document.getElementById('calc-cust-address').value || '';
            const customerCode = document.getElementById('calc-customer-code').value || '/';
            const preparedBy = document.getElementById('calc-prepared-by').value || 'Darko Sužnik';
            const date = new Date().toLocaleDateString('sl-SI');

            // Glavno ime projekta za naslov dokumenta
            let mainProjectTitle = document.getElementById('calc-project-name').value || 'Tisk Kuvert';
            let itemsToRender = [];

            if (quoteBasket.length > 0) {
                itemsToRender = quoteBasket;
                if (quoteBasket.length > 1) {
                    mainProjectTitle = "Skupna ponudba (" + quoteBasket.length + " pozicij)";
                } else {
                    mainProjectTitle = quoteBasket[0].name;
                }
            } else {
                // Če je košarica prazna, vzamemo trenutne podatke s platna
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
                                    <div style="font-size: 9px; color: #64748b; text-transform: uppercase; margin-bottom: 5px;">Šifra izdelka:</div>
                                    <div style="font-size: 16px; font-weight: bold; color: #1e293b; border: 1px solid #e2e8f0; padding: 10px; background: #f8fafc; text-align: center; border-radius: 4px;">${item.materialCode}</div>
                                </td>
                                <td style="width: 85%; vertical-align: top; padding-left: 20px;">
                                    <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
                                        <tr><td style="width: 90px; font-weight: bold;">Izdelek:</td><td>${item.name}</td></tr>
                                        <tr><td style="font-weight: bold;">Format:</td><td>${item.spec.format}</td></tr>
                                        <tr><td style="font-weight: bold;">Tisk:</td><td>${item.spec.colors}</td></tr>
                                        ${item.spec.paper ? `<tr><td style="font-weight: bold;">Papir:</td><td>${item.spec.paper}</td></tr>` : ''}
                                        ${item.spec.finishing ? `<tr><td style="font-weight: bold;">Dodel.:</td><td>${item.spec.finishing}</td></tr>` : ''}
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 10px; text-align: center; border-top: 1px solid #000; border-bottom: 1px solid #000;">
                            <tr><th style="padding: 4px; border-bottom: 1px solid #000; font-size: 11px;">Naklada</th><th style="padding: 4px; border-bottom: 1px solid #000; font-size: 11px;">Cena/Kom.</th><th style="padding: 4px; border-bottom: 1px solid #000; font-size: 11px; text-align: right;">Cena skupno:</th></tr>
                            ${item.quantities.map(q => `
                                <tr>
                                    <td style="font-weight: bold; padding: 4px;">${formatQty(q.qty)} kos</td>
                                    <td style="padding: 4px;">${formatPrice(q.pricePerUnit, 3)}</td>
                                    <td style="font-weight: bold; text-align: right; padding: 4px;">${formatPrice(q.priceTotal, 2)}</td>
                                </tr>
                            `).join('')}
                        </table>
                    </div>
                `;
            });

            return `<html>...`; // (Simplified for write_to_file call, I'll use replace_file_content instead)
        }
