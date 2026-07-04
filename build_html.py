import sys

html_content = """<!DOCTYPE html>
<html lang="sl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Odpis Materiala iz Zaloge</title>
    <!-- ExcelJS za varno branje in urejanje .xlsx -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.3.0/exceljs.min.js"></script>
    <style>
        :root {
            --bg-color: #0f172a;
            --card-bg: rgba(30, 41, 59, 0.7);
            --text-color: #f8fafc;
            --primary: #3b82f6;
            --primary-hover: #2563eb;
            --danger: #ef4444;
            --success: #10b981;
            --input-bg: #1e293b;
            --border-color: #334155;
        }

        body {
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
            color: var(--text-color);
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            box-sizing: border-box;
        }

        .container {
            background: var(--card-bg);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 40px;
            width: 100%;
            max-width: 500px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        h1 {
            margin-top: 0;
            font-size: 1.8rem;
            text-align: center;
            margin-bottom: 30px;
            background: linear-gradient(to right, #60a5fa, #a78bfa);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .form-group { margin-bottom: 20px; }

        label {
            display: block;
            margin-bottom: 8px;
            font-size: 0.95rem;
            font-weight: 500;
            color: #cbd5e1;
        }

        input[type="text"], input[type="number"] {
            width: 100%;
            padding: 12px 16px;
            background: var(--input-bg);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            color: white;
            font-size: 1rem;
            box-sizing: border-box;
            transition: all 0.2s ease;
        }

        input[type="text"]:focus, input[type="number"]:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
        }

        .btn-file {
            width: 100%;
            text-align: center;
            background: var(--input-bg);
            border: 2px dashed var(--border-color);
            border-radius: 8px;
            color: #94a3b8;
            padding: 12px;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.2s ease;
            outline: none;
            box-sizing: border-box;
        }

        .btn-file:hover {
            border-color: var(--primary);
            color: var(--primary);
            background: rgba(59, 130, 246, 0.05);
        }

        .btn-submit {
            width: 100%;
            padding: 14px;
            background: var(--primary);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-top: 10px;
        }

        .btn-submit:hover {
            background: var(--primary-hover);
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.4);
        }

        .btn-submit:active { transform: translateY(0); }

        .btn-submit:disabled {
            background: #475569;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        #status {
            margin-top: 20px;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            font-weight: 500;
            display: none;
        }

        .status-success {
            background: rgba(16, 185, 129, 0.1);
            color: var(--success);
            border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .status-error {
            background: rgba(239, 68, 68, 0.1);
            color: var(--danger);
            border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .file-name-display {
            margin-top: 8px;
            font-size: 0.85rem;
            color: var(--success);
            text-align: center;
            font-weight: bold;
        }

        .optional-badge {
            font-size: 0.75rem;
            background: #334155;
            color: #94a3b8;
            padding: 2px 6px;
            border-radius: 4px;
            margin-left: 8px;
            vertical-align: middle;
        }
    </style>
</head>
<body>

    <div class="container">
        <h1>Odpis Materiala (Dnevnik)</h1>

        <div class="form-group">
            <label>Izberite datoteko (Zaloga_Avtomatizirana.xlsx)</label>
            <button id="btnPickFile" class="btn-file">📁 Kliknite za izbiro datoteke</button>
            <div id="selectedFileName" class="file-name-display"></div>
        </div>

        <div class="form-group">
            <label for="materialCode">Šifra materiala (npr. PAP-135-MAT)</label>
            <input type="text" id="materialCode" placeholder="Vnesite šifro...">
        </div>

        <div class="form-group">
            <label for="quantity">Količina za odpis</label>
            <input type="number" id="quantity" placeholder="npr. 500" min="0" step="any">
        </div>

        <div class="form-group">
            <label for="orderNumber">Št. Delovnega naloga <span class="optional-badge">Neobvezno</span></label>
            <input type="text" id="orderNumber" placeholder="npr. DN-2026-105">
        </div>

        <div class="form-group">
            <label for="personName">Oseba <span class="optional-badge">Neobvezno</span></label>
            <input type="text" id="personName" placeholder="Kdo opravlja odpis...">
        </div>

        <button class="btn-submit" id="processBtn">Zapiši odpis v Excel</button>

        <div id="status"></div>
    </div>

    <script>
        let selectedFileHandle = null;
        let selectedFile = null;

        document.getElementById('btnPickFile').addEventListener('click', async function () {
            try {
                if (typeof window.showOpenFilePicker !== 'function') {
                    showStatus('Vaš brskalnik ne podpira avtomatskega shranjevanja datotek (priporočamo Chrome ali Edge).', 'error');
                    return;
                }
                const [handle] = await window.showOpenFilePicker({
                    types: [{
                        description: 'Excel Files',
                        accept: {
                            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
                            'application/vnd.ms-excel.sheet.macroEnabled.12': ['.xlsm']
                        }
                    }],
                    multiple: false
                });
                selectedFileHandle = handle;
                selectedFile = await handle.getFile();

                const btn = document.getElementById('btnPickFile');
                btn.style.borderColor = '#10b981';
                btn.style.color = '#10b981';
                document.getElementById('selectedFileName').innerText = "Izbrana datoteka: " + selectedFile.name;
                document.getElementById('status').style.display = 'none';
            } catch (err) {
                if (err.name !== 'AbortError') {
                    showStatus('Napaka pri izbiri datoteke: ' + err.message, 'error');
                }
            }
        });

        document.getElementById('processBtn').addEventListener('click', async function () {
            const statusDiv = document.getElementById('status');
            const btn = document.getElementById('processBtn');
            statusDiv.style.display = 'none';

            const materialCode = document.getElementById('materialCode').value.trim();
            const quantityVal = parseFloat(document.getElementById('quantity').value);
            const orderNumber = document.getElementById('orderNumber').value.trim();
            const personName = document.getElementById('personName').value.trim();

            if (!selectedFile) { showStatus('Prosim, izberite Excel (.xlsx) datoteko.', 'error'); return; }
            if (!materialCode) { showStatus('Prosim, vnesite šifro materiala.', 'error'); return; }
            if (isNaN(quantityVal) || quantityVal <= 0) {
                showStatus('Količina mora biti veljavno pozitivno število večje od 0.', 'error');
                return;
            }

            try {
                btn.disabled = true;
                btn.innerText = "Obdelujem...";

                const arrayBuffer = await selectedFile.arrayBuffer();
                
                // Uporaba ExcelJS za varno delo z Excelom
                const workbook = new ExcelJS.Workbook();
                await workbook.xlsx.load(arrayBuffer);

                // Poiščemo zavihek ODPIS
                const sheetOdpis = workbook.getWorksheet('ODPIS');
                if (!sheetOdpis) {
                    throw new Error('V datoteki ni zavihka z imenom "ODPIS". Izbrati morate datoteko z novo strukturo (npr. Zaloga_Avtomatizirana.xlsx).');
                }

                // Dodajanje nove vrstice
                const dateStr = new Date().toLocaleDateString('sl-SI');
                
                // Ugotovimo katera vrstica bo naslednja
                const nextRow = sheetOdpis.rowCount + 1;
                
                const newRowData = [
                    dateStr,                                // A: Datum
                    materialCode,                           // B: Šifra materiala
                    { formula: `IF(B${nextRow}="","",VLOOKUP(B${nextRow},'TRENUTNA ZALOGA'!A:B,2,FALSE))` }, // C: Naziv
                    quantityVal,                            // D: Količina
                    orderNumber,                            // E: Delovni Nalog
                    personName,                             // F: Oseba
                    ""                                      // G: Opomba
                ];
                
                sheetOdpis.addRow(newRowData);

                // Shranjevanje nazaj
                const outBuffer = await workbook.xlsx.writeBuffer();

                if (selectedFileHandle) {
                    const writable = await selectedFileHandle.createWritable();
                    await writable.write(outBuffer);
                    await writable.close();
                    
                    showStatus(`Uspešno! Odpis ${quantityVal} kosov za šifro "${materialCode}" je bil vpisan v dnevnik odpisa.<br><br><b>Datoteka ${selectedFile.name} je bila posodobljena.</b>`, 'success');
                } else {
                    // Fallback
                    const blob = new Blob([outBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = selectedFile.name;
                    a.click();
                    showStatus(`Odpis uspešen!<br><b>Prenos datoteke se je začel.</b>`, 'success');
                }

                // Počistimo vnos za količino
                document.getElementById('quantity').value = '';

            } catch (err) {
                console.error(err);
                showStatus('Napaka pri obdelavi datoteke: ' + err.message, 'error');
            } finally {
                btn.disabled = false;
                btn.innerText = "Zapiši odpis v Excel";
            }
        });

        function showStatus(message, type) {
            const statusDiv = document.getElementById('status');
            statusDiv.innerHTML = message;
            statusDiv.className = type === 'success' ? 'status-success' : 'status-error';
            statusDiv.style.display = 'block';
        }
    </script>
</body>
</html>
"""

with open("d:\\Git\\KalkulacijaPetric\\odpis_materiala.html", "w", encoding="utf-8") as f:
    f.write(html_content)
print("Done writing HTML!")
