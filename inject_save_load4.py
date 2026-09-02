with open(r'c:\DARKO\KalkulacijaPetric\kuverte1.html', 'r', encoding='utf-8') as f:
    html = f.read()

js_functions = '''
        // --- SAVE/LOAD PROJECT FUNCTIONS ---
        function handleFileSelect(event) {
            const file = event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function (e) {
                try {
                    const data = JSON.parse(e.target.result);
                    if (!data.inputs) throw new Error("Neveljavna datoteka!");
                    if (data._source && data._source !== 'kuverte') {
                        alert("Opozorilo: Ta datoteka morda ne pripada kuvertam (vir: " + data._source + "). Odpiram vseeno...");
                    }
                    loadProjectData(data);
                    alert("Ponudba '" + (data.name || "Brez imena") + "' uspešno uvožena!");
                } catch (err) { alert("Napaka pri uvozu: " + err.message); }
                event.target.value = "";
            };
            reader.readAsText(file);
        }

        async function saveProjectToFile() {
            try {
                let name = document.getElementById('calc-project-name').value.trim() || "Ponudba";
                function gv(id) { var el = document.getElementById(id); return el ? el.value : ''; }
                function gc(id) { var el = document.getElementById(id); return el ? el.checked : false; }
                const data = {
                    name: name,
                    _source: 'kuverte',
                    date: new Date().toLocaleString('de-DE'),
                    customer: gv('calc-customer'),
                    custAddress: gv('calc-cust-address'),
                    deliveryAddress: gv('calc-delivery-address'),
                    custEmail: gv('calc-cust-email'),
                    quoteNum: gv('calc-quote-number'),
                    dnNum: gv('calc-dn-number'),
                    dnOld: gv('calc-dn-old'),
                    deadline: gv('calc-dn-deadline'),
                    packaging: gv('calc-dn-packaging'),
                    givenSheets: gv('calc-given-sheets'),
                    customerCode: gv('calc-customer-code'),
                    preparedBy: gv('calc-prepared-by'),
                    materialCode: gv('calc-material-code'),
                    notes: gv('calc-notes'),
                    editedQuoteHTML: typeof g_editedQuoteHTML !== 'undefined' ? g_editedQuoteHTML : '',
                    editedQuoteATHTML: typeof g_editedQuoteATHTML !== 'undefined' ? g_editedQuoteATHTML : '',
                    editedWorkOrderHTML: typeof g_editedWorkOrderHTML !== 'undefined' ? g_editedWorkOrderHTML : '',
                    inputs: {
                        'calc-dn-old': gv('calc-dn-old'),
                        'calc-dn-packaging': gv('calc-dn-packaging'),
                        'calc-order-type': gv('calc-order-type'),
                        'calc-given-sheets': gv('calc-given-sheets'),
                        'calc-customer-code': gv('calc-customer-code'),
                        'calc-customer': gv('calc-customer'),
                        'calc-quantities': gv('calc-quantities'),
                        'calc-material-price': gv('calc-material-price'),
                        'calc-use-manual-work': gv('calc-use-manual-work'),
                        'calc-project-name': gv('calc-project-name'),
                        'calc-machine-rate': gv('calc-machine-rate'),
                        'calc-waste-manual': gv('calc-waste-manual'),
                        'calc-paper-weight': gv('calc-paper-weight'),
                        'calc-machine': gv('calc-machine'),
                        'calc-color-change-price': gv('calc-color-change-price'),
                        'f-del-fixed-active': gc('f-del-fixed-active'),
                        'calc-colors-front': gv('calc-colors-front'),
                        'calc-machine-speed': gv('calc-machine-speed'),
                        'calc-cust-address': gv('calc-cust-address'),
                        'calc-prepared-by': gv('calc-prepared-by'),
                        'calc-prep-price': gv('calc-prep-price'),
                        'f-post-price-per': gv('f-post-price-per'),
                        'calc-use-personalization': gv('calc-use-personalization'),
                        'calc-margin': gv('calc-margin'),
                        'calc-plate-price': gv('calc-plate-price'),
                        'calc-plate-count': gv('calc-plate-count'),
                        'calc-dn-deadline': gv('calc-dn-deadline'),
                        'calc-manual-work': gv('calc-manual-work'),
                        'calc-material-code': gv('calc-material-code'),
                        'f-delivery-active': gc('f-delivery-active'),
                        'calc-cust-email': gv('calc-cust-email'),
                        'calc-notes': gv('calc-notes'),
                        'calc-change-price': gv('calc-change-price'),
                        'f-post-count': gv('f-post-count'),
                        'f-del-fixed-price': gv('f-del-fixed-price'),
                        'calc-minus-price': gv('calc-minus-price'),
                        'calc-color-change-count': gv('calc-color-change-count'),
                        'calc-dn-number': gv('calc-dn-number'),
                        'calc-override-total': gv('calc-override-total'),
                        'calc-waste': gv('calc-waste'),
                        'calc-quote-number': gv('calc-quote-number'),
                        'calc-auto-speed': gv('calc-auto-speed'),
                        'calc-colors-back': gv('calc-colors-back'),
                        'calc-personalization': gv('calc-personalization'),
                        'calc-commercial': gv('calc-commercial'),
                        'calc-dn-urgent': gc('calc-dn-urgent'),
                        'calc-is-obrat': gc('calc-is-obrat'),
                        'calc-delivery-address': gv('calc-delivery-address'),
                        'calc-grafotehna': gv('calc-grafotehna'),
                        'calc-packaging': gv('calc-packaging')
                    }
                };

                const fileName = name.replace(/[^a-z0-9\\u0100-\\u017F]/gi, '_') + '.kuverte.json';
                
                try {
                    const res = await fetch('http://127.0.0.1:8095', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ filename: fileName, content: JSON.stringify(data, null, 2), type: 'json' })
                    });
                    if (res.ok) {
                        const jsonRes = await res.json();
                        alert(jsonRes.message || 'Uspešno shranjeno na strežnik!');
                        return;
                    }
                } catch (err) {
                    console.log("Server JSON save failed, using local download fallback", err);
                }

                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
                const a = document.createElement('a');
                a.href = dataStr;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => document.body.removeChild(a), 100);
            } catch(e) {
                alert("Napaka pri shranjevanju projekta: " + e.message);
                console.error(e);
            }
        }

        function loadProjectData(data) {
            if (!data || !data.inputs) return;
            const inps = data.inputs;
            function setv(id, val) { if (val !== undefined) { var el = document.getElementById(id); if (el) el.value = val; } }
            function setc(id, val) { if (val !== undefined) { var el = document.getElementById(id); if (el) el.checked = val; } }
            
            Object.keys(inps).forEach(key => {
                const el = document.getElementById(key);
                if (el) {
                    if (el.type === 'checkbox') el.checked = inps[key];
                    else el.value = inps[key];
                }
            });
            
            if (typeof g_editedQuoteHTML !== 'undefined') g_editedQuoteHTML = data.editedQuoteHTML || '';
            if (typeof g_editedQuoteATHTML !== 'undefined') g_editedQuoteATHTML = data.editedQuoteATHTML || '';
            if (typeof g_editedWorkOrderHTML !== 'undefined') g_editedWorkOrderHTML = data.editedWorkOrderHTML || '';

            if (typeof calculate === 'function') calculate();
        }

        // define exportToFile for the old button if any
        window.exportToFile = saveProjectToFile;

    </script>
</body>
</html>
'''

html = html.replace("    </script>\n</body>\n</html>\n", js_functions)

with open(r'c:\DARKO\KalkulacijaPetric\kuverte1.html', 'w', encoding='utf-8') as f:
    f.write(html)
