import re, json

# 1. Read existing zaloga2.html
with open(r'c:\DARKO\KalkulacijaPetric\zaloga2.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract SEED
m_seed = re.search(r'const SEED = (\{.*?\});', content, re.DOTALL)
if not m_seed:
    raise Exception("Could not find SEED in zaloga2.html")

seed_json_str = m_seed.group(1)

html_code = f'''<!DOCTYPE html>
<html lang="sl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Zaloga Materiala - Tiskarna Petrič</title>
<style>
:root {{
    --bg: #f1f5f9;
    --panel: #ffffff;
    --ink: #0f172a;
    --muted: #64748b;
    --line: #cbd5e1;
    --accent: #1e3a5f;
    --accent-light: #2563eb;
    --accent-subtle: #eff6ff;
    --ok: #059669;
    --ok-bg: #ecfdf5;
    --ok-border: #a7f3d0;
    --bad: #dc2626;
    --bad-bg: #fef2f2;
    --bad-border: #fecaca;
    --warn: #d97706;
    --warn-bg: #fffbeb;
    --warn-border: #fde68a;
    --radius: 10px;
    --shadow: 0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -2px rgba(0,0,0,0.06);
}}

* {{ box-sizing: border-box; }}
body {{
    margin: 0;
    font-family: 'Segoe UI', system-ui, -apple-system, Roboto, Helvetica, Arial, sans-serif;
    background: var(--bg);
    color: var(--ink);
    line-height: 1.5;
}}

header {{
    background: linear-gradient(135deg, #1e3a5f 0%, #0f243e 100%);
    color: #ffffff;
    padding: 16px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    box-shadow: 0 2px 10px rgba(0,0,0,0.15);
}}

header h1 {{
    margin: 0;
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.01em;
    display: flex;
    align-items: center;
    gap: 10px;
}}

header .subtitle {{
    font-size: 13px;
    opacity: 0.85;
    font-weight: 400;
    margin-top: 3px;
}}

.sync-badge {{
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 999px;
    background: rgba(16, 185, 129, 0.2);
    border: 1px solid rgba(16, 185, 129, 0.4);
    color: #34d399;
    font-size: 13px;
    font-weight: 600;
}}

nav {{
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    padding: 10px 20px;
    background: #e2e8f0;
    border-bottom: 1px solid #cbd5e1;
    position: sticky;
    top: 0;
    z-index: 100;
}}

button, .btn {{
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 9px 15px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    background: #ffffff;
    color: var(--accent);
    transition: all 0.15s ease;
    display: inline-flex;
    align-items: center;
    gap: 6px;
}}

button:hover, .btn:hover {{
    background: #f8fafc;
    border-color: #94a3b8;
}}

nav button {{
    background: transparent;
    border-color: transparent;
    color: #334155;
    font-weight: 600;
}}

nav button:hover {{
    background: #cbd5e1;
    border-color: transparent;
}}

nav button.active {{
    background: var(--accent);
    color: #ffffff;
    border-color: var(--accent);
    box-shadow: 0 2px 4px rgba(30, 58, 95, 0.2);
}}

button.primary {{
    background: var(--accent);
    color: #ffffff;
    border-color: var(--accent);
}}
button.primary:hover {{
    background: var(--accent-light);
    border-color: var(--accent-light);
}}

button.success {{
    background: var(--ok);
    color: #ffffff;
    border-color: var(--ok);
}}
button.success:hover {{
    background: #047857;
}}

button.danger {{
    background: var(--bad-bg);
    color: var(--bad);
    border-color: var(--bad-border);
}}
button.danger:hover {{
    background: #fee2e2;
}}

main {{
    max-width: 1300px;
    margin: 20px auto;
    padding: 0 16px 40px;
}}

.page {{ display: none; }}
.page.active {{ display: block; }}

.card {{
    background: var(--panel);
    border: 1px solid #e2e8f0;
    border-radius: var(--radius);
    padding: 20px;
    box-shadow: var(--shadow);
    margin-bottom: 20px;
}}

.card-title {{
    margin: 0 0 16px 0;
    font-size: 18px;
    font-weight: 700;
    color: var(--accent);
    display: flex;
    align-items: center;
    justify-content: space-between;
}}

.grid2 {{ display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }}
.grid3 {{ display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }}
.grid4 {{ display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }}

.kpi-grid {{
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    margin-bottom: 20px;
}}

.kpi {{
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: var(--radius);
    padding: 16px 18px;
    box-shadow: var(--shadow);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}}

.kpi .kpi-label {{
    font-size: 13px;
    font-weight: 600;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
}}

.kpi .kpi-val {{
    font-size: 26px;
    font-weight: 800;
    margin-top: 6px;
    color: var(--ink);
}}

.kpi.ok .kpi-val {{ color: var(--ok); }}
.kpi.bad .kpi-val {{ color: var(--bad); }}

label {{
    display: block;
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 6px;
    color: #334155;
}}

input, select, textarea {{
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font: inherit;
    background: #ffffff;
    color: var(--ink);
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
}}

input:focus, select:focus, textarea:focus {{
    outline: none;
    border-color: var(--accent-light);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}}

.material-preview-box {{
    background: var(--accent-subtle);
    border: 1px solid #bfdbfe;
    border-radius: 10px;
    padding: 14px 18px;
    margin-top: 14px;
    display: none;
}}

.material-preview-box.show {{ display: block; }}

.material-card-highlight {{
    background: #ffffff;
    border-left: 4px solid var(--accent-light);
    border-radius: 8px;
    padding: 16px 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}}

.tablewrap {{
    overflow-x: auto;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    background: #ffffff;
    box-shadow: var(--shadow);
    max-height: 600px;
}}

table {{
    border-collapse: collapse;
    width: 100%;
    font-size: 13.5px;
    text-align: left;
}}

th, td {{
    padding: 10px 12px;
    border-bottom: 1px solid #f1f5f9;
    white-space: nowrap;
}}

th {{
    background: #f8fafc;
    font-weight: 700;
    color: #475569;
    position: sticky;
    top: 0;
    z-index: 2;
    border-bottom: 2px solid #e2e8f0;
}}

tr:hover td {{
    background: #f8fafc;
}}

.bad {{ color: var(--bad); font-weight: 700; }}
.ok {{ color: var(--ok); font-weight: 700; }}
.zero {{ color: var(--muted); }}

.badge {{
    display: inline-block;
    padding: 3px 8px;
    border-radius: 999px;
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 0.02em;
}}

.badge.in {{
    background: var(--ok-bg);
    color: var(--ok);
    border: 1px solid var(--ok-border);
}}

.badge.out {{
    background: var(--bad-bg);
    color: var(--bad);
    border: 1px solid var(--bad-border);
}}

.notice {{
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 16px;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}}

.notice.info {{
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    color: #1e40af;
}}

.notice.success {{
    background: var(--ok-bg);
    border: 1px solid var(--ok-border);
    color: #065f46;
}}

.notice.error {{
    background: var(--bad-bg);
    border: 1px solid var(--bad-border);
    color: #991b1b;
}}

.pagination {{
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 14px;
    font-size: 13px;
    color: var(--muted);
}}

.pagination .btns {{
    display: flex;
    gap: 6px;
    align-items: center;
}}

.pagination button {{
    padding: 6px 12px;
    font-size: 13px;
}}

.mini-btn {{
    padding: 4px 9px;
    font-size: 12px;
    border-radius: 6px;
}}

.actions {{
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 16px;
}}

.sync-banner {{
    background: linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%);
    color: #ffffff;
    border-radius: 12px;
    padding: 20px 24px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
}}

.sync-banner h2 {{ margin: 0 0 6px 0; font-size: 20px; }}
.sync-banner p {{ margin: 0; opacity: 0.9; font-size: 14px; }}

/* Modal za iskanje materiala */
.modal-overlay {{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(15, 23, 42, 0.75);
    backdrop-filter: blur(4px);
    z-index: 9999;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 16px;
}}

.modal-overlay.open {{
    display: flex;
}}

.modal-card {{
    background: #ffffff;
    border-radius: 16px;
    width: 100%;
    max-width: 900px;
    max-height: 90vh;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.35);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: modalIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}}

@keyframes modalIn {{
    from {{ opacity: 0; transform: scale(0.96) translateY(10px); }}
    to {{ opacity: 1; transform: scale(1) translateY(0); }}
}}

.modal-header {{
    padding: 16px 20px;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: space-between;
}}

.modal-header h3 {{
    margin: 0;
    font-size: 18px;
    color: #1e3a5f;
    display: flex;
    align-items: center;
    gap: 8px;
}}

.modal-body {{
    padding: 18px 20px;
    overflow-y: auto;
    flex-grow: 1;
}}

.modal-footer {{
    padding: 12px 20px;
    background: #f8fafc;
    border-top: 1px solid #e2e8f0;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}}

footer {{
    text-align: center;
    color: var(--muted);
    font-size: 12.5px;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #e2e8f0;
}}

@media(max-width: 900px) {{
    .kpi-grid {{ grid-template-columns: repeat(2, 1fr); }}
    .grid2, .grid3, .grid4 {{ grid-template-columns: 1fr; }}
}}
</style>
</head>
<body>

<header>
    <div>
        <h1>📦 EVIDENCA ZALOGE MATERIALA</h1>
        <div class="subtitle">Tiskarna Petrič • Celoten šifrant & sinhronizacija s kalkulatorji</div>
    </div>
    <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
        <span id="headerSyncBadge" class="sync-badge">🔄 Povezano s kalkulatorji</span>
        <span id="headerNewBadge" style="font-size: 12px; opacity: 0.9;"></span>
    </div>
</header>

<nav>
    <button data-page="home" class="active">📊 Pregled & Iskanje Šifer</button>
    <button data-page="receipt">📥 Prejem materiala</button>
    <button data-page="issue">📤 Izdaja / Odpis</button>
    <button data-page="stock">📋 Trenutna zaloga (2.283 artiklov)</button>
    <button data-page="history">📜 Zgodovina prometa</button>
    <button data-page="sync">🔄 Sinhronizacija & Kalkulatorji</button>
</nav>

<main>

<!-- 1. DOMOV / PREGLED & PAMETNO ISKANJE PO VSEH LASTNOSTIH -->
<section id="home" class="page active">
    <div class="kpi-grid">
        <div class="kpi">
            <span class="kpi-label">Vsi materiali v šifrantu</span>
            <span class="kpi-val" id="kTotalMat">0</span>
        </div>
        <div class="kpi ok">
            <span class="kpi-label">Artikli z zalogo (&gt; 0)</span>
            <span class="kpi-val" id="kInStock">0</span>
        </div>
        <div class="kpi bad">
            <span class="kpi-label">Negativna zaloga (&lt; 0)</span>
            <span class="kpi-val" id="kNegStock">0</span>
        </div>
        <div class="kpi">
            <span class="kpi-label">Skupaj vseh premikov</span>
            <span class="kpi-val" id="kTotalMovements">0</span>
        </div>
    </div>

    <!-- PAMETNO ISKALNO POLJE ZA KALKULATORJE (IME, GRAMATURA, FORMAT, ŠIFRA) -->
    <div class="card" style="border: 2px solid #93c5fd; background: #f0f7ff;">
        <div class="card-title">
            <span>🔍 Iskanje po imenu, formatu, gramaturi in šifri</span>
            <span style="font-size: 13px; font-weight: normal; color: #1e40af;">Takojšen vpogled v zalogo za kalkulatorje</span>
        </div>
        <p style="margin: 0 0 12px 0; font-size: 14px; color: #334155;">
            Vnesite poljuben iskalni niz — <b>ime</b> (npr. <i>Garda</i>), <b>format</b> (npr. <i>70x100</i> ali <i>100x70</i>), <b>gramaturo</b> (npr. <i>250g</i> ali <i>250</i>), <b>šifro</b> (npr. <i>2295</i>) ali kombinacijo (npr. <i>Garda 250 70x100</i>):
        </p>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <input id="quickCodeInput" list="allMaterialsDatalist" placeholder="Vnesite ime (npr. Garda), format (70x100), g/m² (250g) ali šifro (2295)..." style="font-size: 15px; font-weight: 600; flex: 1 1 380px;" autocomplete="off">
            <button class="primary" id="btnQuickSearch">🔍 Poišči material</button>
            <button id="btnQuickClear">Počisti</button>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; font-size: 13px; align-items: center;">
            <span style="color: #64748b;">Hitri primeri:</span>
            <button class="mini-btn" onclick="quickExample('garda 250 70x100')">Garda 250 70x100</button>
            <button class="mini-btn" onclick="quickExample('offset 80')">Offset 80</button>
            <button class="mini-btn" onclick="quickExample('claro silk 90')">Claro silk 90</button>
            <button class="mini-btn" onclick="quickExample('nikla 70x100')">Nikla 70x100</button>
            <button class="mini-btn" onclick="quickExample('2295')">Šifra 2295</button>
        </div>

        <div id="quickResultBox" style="margin-top: 16px; display: none;"></div>
    </div>

    <!-- ZADNJIH 10 PREMIKOV -->
    <div class="card">
        <div class="card-title">
            <span>🕒 Zadnji zabeleženi premiki na zalogi</span>
            <button class="mini-btn" onclick="document.querySelector('nav button[data-page=\\'history\\']').click()">Odpri celotno zgodovino &rarr;</button>
        </div>
        <div class="tablewrap" style="max-height: 340px;">
            <table>
                <thead>
                    <tr>
                        <th>Datum</th>
                        <th>Vrsta</th>
                        <th>Šifra</th>
                        <th>Naziv materiala</th>
                        <th>Količina</th>
                        <th>Dokument</th>
                        <th>Oseba / Stranka</th>
                        <th>Opomba</th>
                    </tr>
                </thead>
                <tbody id="homeRecentBody"></tbody>
            </table>
        </div>
    </div>
</section>

<!-- 2. PREJEM MATERIALA -->
<section id="receipt" class="page">
    <div class="card">
        <div class="card-title"><span>📥 PREJEM MATERIALA NA ZALOGO</span></div>
        <div id="receiptMsg"></div>
        <div class="grid3">
            <div>
                <label for="rDate">Datum prejema</label>
                <input id="rDate" type="date">
            </div>
            <div>
                <label for="rCode">Šifra ali naziv materiala</label>
                <div style="display: flex; gap: 8px;">
                    <input id="rCode" list="allMaterialsDatalist" placeholder="Vpišite šifro, ime, format ali g/m²..." autocomplete="off">
                    <button type="button" class="btn" style="white-space: nowrap; padding: 8px 12px;" onclick="openMaterialSelector('r')" title="Poišči po imenu, formatu, gramaturi">🔍 Poišči</button>
                </div>
            </div>
            <div>
                <label for="rQty">Količina (kos)</label>
                <input id="rQty" type="number" min="0.01" step="0.01" placeholder="npr. 5000">
            </div>
            <div>
                <label for="rDoc">Št. dobavnice / dokumenta</label>
                <input id="rDoc" placeholder="npr. 2041031552">
            </div>
            <div>
                <label for="rParty">Dobavitelj</label>
                <input id="rParty" placeholder="npr. EUROPAPIR, GRAFOLIT, SAMSON...">
            </div>
            <div>
                <label for="rNote">Opomba</label>
                <input id="rNote" placeholder="Neobvezno...">
            </div>
        </div>

        <div id="rMaterialBox" class="material-preview-box"></div>

        <div class="actions">
            <button class="primary" id="saveReceiptBtn">✅ POTRDI PREJEM MATERIALA</button>
            <button id="clearReceiptBtn">Počisti obrazec</button>
        </div>
    </div>
</section>

<!-- 3. IZDAJA / ODPIS MATERIALA -->
<section id="issue" class="page">
    <div class="card">
        <div class="card-title"><span>📤 IZDAJA / ODPIS MATERIALA IZ ZALOGE</span></div>
        <div id="issueMsg"></div>
        <div class="grid3">
            <div>
                <label for="iDate">Datum izdaje</label>
                <input id="iDate" type="date">
            </div>
            <div>
                <label for="iCode">Šifra ali naziv materiala</label>
                <div style="display: flex; gap: 8px;">
                    <input id="iCode" list="allMaterialsDatalist" placeholder="Vpišite šifro, ime, format ali g/m²..." autocomplete="off">
                    <button type="button" class="btn" style="white-space: nowrap; padding: 8px 12px;" onclick="openMaterialSelector('i')" title="Poišči po imenu, formatu, gramaturi">🔍 Poišči</button>
                </div>
            </div>
            <div>
                <label for="iQty">Količina za izdajo (kos)</label>
                <input id="iQty" type="number" min="0.01" step="0.01" placeholder="npr. 1200">
            </div>
            <div>
                <label for="iDoc">Delovni nalog</label>
                <input id="iDoc" placeholder="npr. 1541/26">
            </div>
            <div>
                <label for="iParty">Oseba / Naročnik</label>
                <input id="iParty" value="Darko" placeholder="Darko, Simon...">
            </div>
            <div>
                <label for="iNote">Opomba / Naročnik</label>
                <input id="iNote" placeholder="npr. VENDO, TENOVIS, LDD...">
            </div>
        </div>

        <div id="iMaterialBox" class="material-preview-box"></div>

        <div class="actions">
            <button class="primary" id="saveIssueBtn">✅ POTRDI IZDAJO MATERIALA</button>
            <button id="clearIssueBtn">Počisti obrazec</button>
        </div>
    </div>
</section>

<!-- 4. TRENUTNA ZALOGA -->
<section id="stock" class="page">
    <div class="card">
        <div class="card-title">
            <span>📋 TRENUTNA ZALOGA VSEH MATERIALOV</span>
            <button class="btn" id="exportStockCsvBtn">📊 Izvozi v CSV (Excel)</button>
        </div>

        <!-- NAPREDNA ISKALNA VRSTICA Z LOČENIMI IN SPLOŠNIMI POLJI -->
        <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 14px 16px; margin-bottom: 16px;">
            <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: flex-end;">
                <div style="flex: 2 1 240px;">
                    <label style="font-size: 12px; color: #475569; margin-bottom: 4px;">🔍 Pametno iskanje (išče po vseh lastnostih hkrati)</label>
                    <input id="stockSearch" placeholder="npr. garda 250 70x100 ali 2295..." autocomplete="off">
                </div>
                <div style="flex: 1.5 1 180px;">
                    <label style="font-size: 12px; color: #475569; margin-bottom: 4px;">🏷️ Naziv materiala</label>
                    <input id="stockFilterName" placeholder="npr. Garda, Offset..." autocomplete="off">
                </div>
                <div style="flex: 1 1 120px;">
                    <label style="font-size: 12px; color: #475569; margin-bottom: 4px;">📐 Format (cm)</label>
                    <input id="stockFilterFormat" placeholder="npr. 70x100..." autocomplete="off">
                </div>
                <div style="flex: 1 1 100px;">
                    <label style="font-size: 12px; color: #475569; margin-bottom: 4px;">⚖️ Gramatura (g/m²)</label>
                    <input id="stockFilterGsm" placeholder="npr. 250..." autocomplete="off">
                </div>
                <div style="flex: 1 1 140px;">
                    <label style="font-size: 12px; color: #475569; margin-bottom: 4px;">Stanje zaloge</label>
                    <select id="stockFilter">
                        <option value="all">Vsi materiali</option>
                        <option value="positive">Z zalogo (&gt; 0)</option>
                        <option value="zero">Ničelna zaloga (= 0)</option>
                        <option value="negative">Negativna (&lt; 0)</option>
                    </select>
                </div>
                <div style="flex: 0 1 120px;">
                    <label style="font-size: 12px; color: #475569; margin-bottom: 4px;">Na stran</label>
                    <select id="stockPageSize">
                        <option value="50">50 na stran</option>
                        <option value="100" selected>100 na stran</option>
                        <option value="250">250 na stran</option>
                        <option value="all">Vsi naenkrat</option>
                    </select>
                </div>
                <div>
                    <button type="button" id="btnClearStockFilters" style="padding: 10px 14px;">Počisti</button>
                </div>
            </div>
        </div>

        <div class="tablewrap">
            <table>
                <thead>
                    <tr>
                        <th>Šifra</th>
                        <th>Naziv materiala</th>
                        <th>Format (cm)</th>
                        <th>g/m²</th>
                        <th>Začetna zaloga</th>
                        <th>Prejem</th>
                        <th>Izdaja</th>
                        <th>Trenutna zaloga</th>
                        <th>Hitri vnos</th>
                    </tr>
                </thead>
                <tbody id="stockTableBody"></tbody>
            </table>
        </div>

        <div class="pagination">
            <span id="stockCountInfo">Prikazujem ...</span>
            <div class="btns">
                <button id="btnStockPrev">&larr; Prejšnja</button>
                <span id="stockPageNum" style="font-weight: 700; padding: 0 8px;">1</span>
                <button id="btnStockNext">Naslednja &rarr;</button>
            </div>
        </div>
    </div>
</section>

<!-- 5. ZGODOVINA PROMETA -->
<section id="history" class="page">
    <div class="card">
        <div class="card-title">
            <span>📜 ZGODOVINA VSEH PREMIKOV</span>
            <button class="btn" id="exportHistoryCsvBtn">📊 Izvozi zgodovino v CSV</button>
        </div>

        <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 14px;">
            <input id="histSearch" placeholder="🔍 Išči šifro, naziv, dobavnico, delovni nalog, stranko, opombo..." style="max-width: 450px;" autocomplete="off">
            <select id="histType" style="max-width: 220px;">
                <option value="all">Vsi premiki (prejemi + izdaje)</option>
                <option value="PREJEM">Samo prejemi</option>
                <option value="IZDAJA">Samo izdaje / odpisi</option>
            </select>
            <select id="histPageSize" style="max-width: 150px;">
                <option value="50">50 na stran</option>
                <option value="100" selected>100 na stran</option>
                <option value="250">250 na stran</option>
                <option value="all">Prikaži vse</option>
            </select>
        </div>

        <div class="tablewrap">
            <table>
                <thead>
                    <tr>
                        <th>Datum</th>
                        <th>Vrsta</th>
                        <th>Šifra</th>
                        <th>Naziv materiala</th>
                        <th>Količina</th>
                        <th>Dokument</th>
                        <th>Dobavitelj / Oseba</th>
                        <th>Opomba</th>
                        <th>Izvor</th>
                    </tr>
                </thead>
                <tbody id="histTableBody"></tbody>
            </table>
        </div>

        <div class="pagination">
            <span id="histCountInfo">Prikazujem ...</span>
            <div class="btns">
                <button id="btnHistPrev">&larr; Prejšnja</button>
                <span id="histPageNum" style="font-weight: 700; padding: 0 8px;">1</span>
                <button id="btnHistNext">Naslednja &rarr;</button>
            </div>
        </div>
    </div>
</section>

<!-- 6. SINHRONIZACIJA & KALKULATORJI -->
<section id="sync" class="page">
    <div class="sync-banner">
        <div>
            <h2>🔄 Samodejna povezava z vsemi kalkulatorji</h2>
            <p>Vsi kalkulatorji (<b>pola2.html</b>, <b>kuverte2.html</b>, <b>brosura2.html</b>, <b>blok2.html</b>, <b>etikete2.html</b>, <b>TENOVIS2.html</b>) berejo stanje zaloge neposredno iz skupnega pomnilnika <code>localStorage (zaloga_simon_data)</code>. Ob vsakem prejemu ali izdaji se zaloga samodejno posodobi!</p>
        </div>
        <button class="btn success" id="btnForceSync" style="padding: 12px 20px; font-size: 15px;">🔄 Sinhroniziraj zdaj</button>
    </div>

    <div class="card">
        <div class="card-title"><span>Stanje povezave & datotek</span></div>
        <div id="syncStatusReport" style="font-size: 14px; margin-bottom: 16px;"></div>

        <div class="actions">
            <button class="primary" id="btnDownloadJson">📥 Prenesi zalogaSimon.json (za strežnik/disk)</button>
            <button class="btn" id="btnExportBackup">💾 Shrani varnostno kopijo novih vnosov (.json)</button>
            <label class="btn">
                📂 Uvozi varnostno kopijo
                <input id="restoreFileInput" type="file" accept="application/json" style="display: none;">
            </label>
            <button class="danger" id="btnResetNew">Ponastavi samo nove vnose</button>
        </div>
        <p style="font-size: 12px; color: var(--muted); margin-top: 14px;">
            Opomba: Ponastavitev novih vnosov izbriše samo tiste prejeme in izdaje, ki so bili dodani ročno v tem brskalniku, prvotni uvoženi podatki pa ostanejo nedotaknjeni.
        </p>
    </div>
</section>

</main>

<datalist id="allMaterialsDatalist"></datalist>

<!-- MODALNO OKNO ZA ISKANJE MATERIALA -->
<div id="materialModal" class="modal-overlay">
    <div class="modal-card">
        <div class="modal-header">
            <h3>🔍 Izbira materiala iz šifranta</h3>
            <button type="button" class="btn mini-btn" onclick="closeMaterialModal()">✕ Zapri</button>
        </div>
        <div class="modal-body">
            <div style="display: flex; gap: 10px; margin-bottom: 12px;">
                <input id="modalSearchInput" placeholder="Išči po imenu (Garda), formatu (70x100), gramaturi (250g) ali šifri..." style="font-size: 15px; font-weight: 600;" autocomplete="off">
                <button type="button" id="modalClearBtn" class="btn">Počisti</button>
            </div>
            <div id="modalCountBadge" style="font-size: 12px; color: #64748b; margin-bottom: 8px;"></div>
            <div class="tablewrap" style="max-height: 420px;">
                <table>
                    <thead>
                        <tr>
                            <th>Šifra</th>
                            <th>Naziv materiala</th>
                            <th>Format (cm)</th>
                            <th>g/m²</th>
                            <th>Trenutna zaloga</th>
                            <th>Akcija</th>
                        </tr>
                    </thead>
                    <tbody id="modalTableBody"></tbody>
                </table>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn" onclick="closeMaterialModal()">Prekliči</button>
        </div>
    </div>
</div>

<footer>
    Tiskarna Petrič • Aplikacija za varno vodenje zaloge materiala • Sinhronizirano s kalkulacijskim sistemom
</footer>

<script>
// --- VGRAJENI ZAČETNI PODATKI IZ ZALOGA MATERIALA 2026.XLSX ---
const SEED = {seed_json_str};

const STORAGE_KEY = 'zaloga_petric_v2';
const CALC_STORAGE_KEY = 'zaloga_simon_data';
const CALC_TIME_KEY = 'zaloga_simon_time';

function loadState() {{
    try {{
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (saved && Array.isArray(saved.newMovements)) {{
            return saved;
        }}
    }} catch(e) {{}}
    return {{ newMovements: [] }};
}}

let state = loadState();

// Hitri slovar materialov po šifri
const matMap = new Map();
SEED.materials.forEach(m => {{
    matMap.set(String(m.code).trim(), m);
}});

function allMovements() {{
    return SEED.movements.concat(state.newMovements);
}}

function fmt(n) {{
    return new Intl.NumberFormat('sl-SI', {{ maximumFractionDigits: 2 }}).format(Number(n) || 0);
}}

// Izračun stanja po šifrah
function stockMap() {{
    const o = {{}};
    for (const m of SEED.materials) {{
        o[String(m.code)] = {{
            opening: Number(m.opening) || 0,
            inc: 0,
            out: 0
        }};
    }}
    for (const x of allMovements()) {{
        const c = String(x.code).trim();
        if (!o[c]) {{
            o[c] = {{ opening: 0, inc: 0, out: 0 }};
        }}
        if (x.type === 'PREJEM') {{
            o[c].inc += Number(x.qty) || 0;
        }} else {{
            o[c].out += Number(x.qty) || 0;
        }}
    }}
    return o;
}}

function stockOf(code) {{
    const s = stockMap()[String(code).trim()];
    if (!s) return 0;
    return s.opening + s.inc - s.out;
}}

// --- SINHRONIZACIJA S KALKULATORJI ---
function syncWithCalculators() {{
    try {{
        const sm = stockMap();
        const exportList = [];
        for (const m of SEED.materials) {{
            const cStr = String(m.code).trim();
            const s = sm[cStr] || {{ opening: 0, inc: 0, out: 0 }};
            const cur = s.opening + s.inc - s.out;
            const w = m.width || '';
            const h = m.height || '';
            const formatStr = (w && h) ? `${{w}}x${{h}}` : '';
            
            exportList.push({{
                'šifra materiala': cStr,
                'sifra': cStr,
                'naziv': m.name || '',
                'širina': w,
                'višina': h,
                'format': formatStr,
                'gramatura': m.gsm || '',
                'začetna zaloga': s.opening,
                'prispelo': s.inc,
                'odpis': s.out,
                'trenutna zaloga': cur,
                'zaloga': cur
            }});
        }}
        localStorage.setItem(CALC_STORAGE_KEY, JSON.stringify(exportList));
        const nowTime = new Date().toLocaleTimeString('sl-SI', {{ hour: '2-digit', minute: '2-digit' }});
        localStorage.setItem(CALC_TIME_KEY, nowTime);
        updateHeaderStatus();
        renderSyncStatus();
        return {{ count: exportList.length, time: nowTime }};
    }} catch(e) {{
        console.error("Napaka pri sinhronizaciji s kalkulatorji:", e);
        return null;
    }}
}}

function saveState() {{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    syncWithCalculators();
    renderAll();
}}

function updateHeaderStatus() {{
    const time = localStorage.getItem(CALC_TIME_KEY) || 'pravkar';
    const badge = document.getElementById('headerSyncBadge');
    if (badge) {{
        badge.innerHTML = `✅ Sinhronizirano s kalkulatorji (${{time}})`;
    }}
    const newBadge = document.getElementById('headerNewBadge');
    if (newBadge) {{
        newBadge.innerText = state.newMovements.length > 0 
            ? `Novi vnosi: ${{state.newMovements.length}}` 
            : '';
    }}
}}

// --- PAMETNI ISKALNI ALGORITEM (IME, GRAMATURA, FORMAT, ŠIFRA) ---
function extractDims(str) {{
    if (!str) return null;
    const match = String(str).match(/(\\d+(?:[.,]\\d+)?)\\s*[x\\*×]\\s*(\\d+(?:[.,]\\d+)?)/i);
    if (match) {{
        const d1 = parseFloat(match[1].replace(',', '.'));
        const d2 = parseFloat(match[2].replace(',', '.'));
        return {{ d1, d2 }};
    }}
    return null;
}}

function searchMaterials(query, nameFilter = '', formatFilter = '', gsmFilter = '', statusFilter = 'all') {{
    let cleanQuery = (query || '').toLowerCase().trim()
        .replace(/(\\d+)\\s*[x\\*×]\\s*(\\d+)/gi, '$1x$2')
        .replace(/(\\d+)\\s*g\\b/gi, '$1g');

    const tokens = cleanQuery.split(/\\s+/).filter(t => t.length > 0);
    const nFilter = (nameFilter || '').toLowerCase().trim();
    const fFilter = (formatFilter || '').toLowerCase().trim();
    const gFilter = (gsmFilter || '').toLowerCase().replace(/g\\b/i, '').trim();
    const sm = stockMap();
    
    const results = [];

    for (const m of SEED.materials) {{
        const cStr = String(m.code || '').trim().toLowerCase();
        const nStr = String(m.name || '').trim().toLowerCase();
        const w = parseFloat(m.width) || 0;
        const h = parseFloat(m.height) || 0;
        const gsmStr = String(m.gsm || '').trim().toLowerCase();
        const fmtStr = `${{w}}x${{h}}`;
        const fmtStrRev = `${{h}}x${{w}}`;

        // 1. Filter stanja zaloge
        const s = sm[String(m.code).trim()] || {{ opening: 0, inc: 0, out: 0 }};
        const cur = s.opening + s.inc - s.out;
        if (statusFilter === 'positive' && cur <= 0) continue;
        if (statusFilter === 'zero' && cur !== 0) continue;
        if (statusFilter === 'negative' && cur >= 0) continue;

        // 2. Ločeno polje za naziv
        if (nFilter && !nStr.includes(nFilter)) continue;

        // 3. Ločeno polje za format
        if (fFilter) {{
            const fDims = extractDims(fFilter);
            if (fDims) {{
                const matchFmt = (Math.abs(w - fDims.d1) < 0.1 && Math.abs(h - fDims.d2) < 0.1) ||
                                 (Math.abs(w - fDims.d2) < 0.1 && Math.abs(h - fDims.d1) < 0.1);
                if (!matchFmt) continue;
            }} else {{
                if (!fmtStr.includes(fFilter) && !fmtStrRev.includes(fFilter)) continue;
            }}
        }}

        // 4. Ločeno polje za gramaturo
        if (gFilter) {{
            if (gsmStr !== gFilter && !gsmStr.startsWith(gFilter)) continue;
        }}

        // 5. Splošno pametno večbesedno iskanje (tokens)
        if (tokens.length > 0) {{
            const fullHaystack = `${{cStr}} ${{nStr}} ${{fmtStr}} ${{fmtStrRev}} ${{gsmStr}}g ${{gsmStr}}`.toLowerCase();
            let allMatched = true;

            for (const t of tokens) {{
                // A. Format token (npr. 70x100 ali 100x70)
                const tDims = extractDims(t);
                if (tDims) {{
                    const matchFmt = (Math.abs(w - tDims.d1) < 0.1 && Math.abs(h - tDims.d2) < 0.1) ||
                                     (Math.abs(w - tDims.d2) < 0.1 && Math.abs(h - tDims.d1) < 0.1);
                    if (matchFmt) continue;
                }}

                // B. Gramatura token (npr. 250g)
                if (/^\\d+g$/i.test(t)) {{
                    const gNum = t.slice(0, -1);
                    if (gsmStr === gNum || gsmStr.startsWith(gNum)) continue;
                }}

                // C. Iskanje po nizu (šifra, naziv, gramatura, format)
                if (fullHaystack.includes(t)) continue;

                allMatched = false;
                break;
            }}

            if (!allMatched) continue;
        }}

        results.push({{ material: m, stock: s, cur }});
    }}

    return results;
}}

// --- PREDOGLED MATERIALA (KARTICA) ---
function getMaterialCardHtml(code) {{
    const cStr = String(code).trim();
    const m = matMap.get(cStr);
    if (!m) {{
        return `<div class="notice error">Šifra <b>${{cStr}}</b> ne obstaja v šifrantu materialov.</div>`;
    }}
    const sm = stockMap()[cStr] || {{ opening: 0, inc: 0, out: 0 }};
    const cur = sm.opening + sm.inc - sm.out;
    const curClass = cur < 0 ? 'bad' : (cur > 0 ? 'ok' : 'zero');
    
    // Poiščimo zadnje 3 premike za to šifro
    const movs = allMovements().filter(x => String(x.code).trim() === cStr);
    movs.sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.createdAt || '').localeCompare(a.createdAt || ''));
    const topMovs = movs.slice(0, 3);
    
    return `
    <div class="material-card-highlight">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px;">
            <div>
                <span style="font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase;">Šifra: <b>${{m.code}}</b></span>
                <h3 style="margin: 2px 0 6px 0; font-size: 20px; color: #1e3a5f;">${{m.name}}</h3>
                <div style="font-size: 14.5px; color: #334155;">
                    <b>Format:</b> ${{m.width}} &times; ${{m.height}} cm &nbsp; | &nbsp;
                    <b>Gramatura:</b> ${{m.gsm}} g/m²
                </div>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 12px; color: #64748b; font-weight: 700;">TRENUTNA ZALOGA</div>
                <div style="font-size: 28px; font-weight: 800;" class="${{curClass}}">${{fmt(cur)}} kos</div>
            </div>
        </div>
        
        <div style="margin-top: 12px; padding-top: 10px; border-top: 1px dashed #cbd5e1; display: flex; gap: 20px; font-size: 13.5px; color: #475569; flex-wrap: wrap;">
            <span>Začetna zaloga: <b>${{fmt(sm.opening)}}</b></span>
            <span>Skupaj prejemi: <b class="ok">+${{fmt(sm.inc)}}</b></span>
            <span>Skupaj izdaje: <b class="bad">-${{fmt(sm.out)}}</b></span>
            <span>Status v kalkulatorjih: <b class="ok">✅ Sinhronizirano</b></span>
        </div>

        <div style="margin-top: 14px; display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="primary mini-btn" style="padding: 6px 14px; font-size: 13px;" onclick="prepareReceipt('${{m.code}}')">+ Vnesi prejem materiala</button>
            <button class="mini-btn" style="padding: 6px 14px; font-size: 13px;" onclick="prepareIssue('${{m.code}}')">- Vnesi izdajo / odpis</button>
        </div>

        ${{topMovs.length > 0 ? `
            <div style="margin-top: 14px; padding-top: 10px; border-top: 1px solid #e2e8f0;">
                <div style="font-size: 12px; font-weight: 700; color: #64748b; margin-bottom: 6px;">ZADNJI PREMIKI ZA TA ARTIKEL:</div>
                <div style="font-size: 12.5px; line-height: 1.6;">
                    ${{topMovs.map(x => `
                        <div>• <b>${{x.date || '-'}}</b>: <span class="badge ${{x.type === 'PREJEM' ? 'in' : 'out'}}">${{x.type}}</span> <b>${{fmt(x.qty)}} kos</b> (${{x.doc || x.party || x.note || 'brez opisa'}})</div>
                    `).join('')}}
                </div>
            </div>
        ` : ''}}
    </div>
    `;
}}

function updatePreview(inputId, boxId) {{
    let val = document.getElementById(inputId).value.trim();
    const box = document.getElementById(boxId);
    if (!val) {{
        box.className = 'material-preview-box';
        box.innerHTML = '';
        return;
    }}

    // Če uporabnik vpiše npr. "2295 – Garda" iz dataliste, izluščimo samo šifro
    const matchCode = val.match(/^(\\d+)/);
    if (matchCode && matMap.has(matchCode[1])) {{
        val = matchCode[1];
    }}

    if (matMap.has(val)) {{
        box.className = 'material-preview-box show';
        box.innerHTML = getMaterialCardHtml(val);
    }} else {{
        // Poskusimo poiskati material po imenu
        const found = searchMaterials(val);
        if (found.length === 1) {{
            document.getElementById(inputId).value = found[0].material.code;
            box.className = 'material-preview-box show';
            box.innerHTML = getMaterialCardHtml(found[0].material.code);
        }} else if (found.length > 1) {{
            box.className = 'material-preview-box show';
            box.innerHTML = `
                <div class="notice info">Najdenih ${{found.length}} materialov za vnos "<b>${{val}}</b>". Kliknite <a href="javascript:void(0)" onclick="openMaterialSelector('${{inputId[0]}}', '${{val}}')">tukaj za izbiro</a>.</div>
            `;
        }} else {{
            box.className = 'material-preview-box show';
            box.innerHTML = `<div class="notice error">Materiala s šifro ali opisom "<b>${{val}}</b>" ni v šifrantu.</div>`;
        }}
    }}
}}

['rCode', 'iCode'].forEach(id => {{
    const el = document.getElementById(id);
    if (el) {{
        el.addEventListener('input', () => updatePreview(id, id[0] + 'MaterialBox'));
        el.addEventListener('change', () => updatePreview(id, id[0] + 'MaterialBox'));
    }}
}});

// --- HITRI VPOGLED / TESTER ŠIFER IN LASTNOSTI (DOMOV) ---
document.getElementById('btnQuickSearch').addEventListener('click', doQuickSearch);
document.getElementById('quickCodeInput').addEventListener('keydown', e => {{
    if (e.key === 'Enter') doQuickSearch();
}});
document.getElementById('quickCodeInput').addEventListener('input', () => {{
    const val = document.getElementById('quickCodeInput').value.trim();
    if (val.length >= 2) doQuickSearch();
    else if (!val) {{
        document.getElementById('quickResultBox').style.display = 'none';
    }}
}});
document.getElementById('btnQuickClear').addEventListener('click', () => {{
    document.getElementById('quickCodeInput').value = '';
    const b = document.getElementById('quickResultBox');
    b.style.display = 'none';
    b.innerHTML = '';
}});

function quickExample(txt) {{
    document.getElementById('quickCodeInput').value = txt;
    doQuickSearch();
}}

function doQuickSearch() {{
    const val = document.getElementById('quickCodeInput').value.trim();
    const box = document.getElementById('quickResultBox');
    if (!val) {{
        box.style.display = 'none';
        return;
    }}
    box.style.display = 'block';
    
    // 1. Točno ujemanje po šifri
    if (matMap.has(val)) {{
        box.innerHTML = getMaterialCardHtml(val);
        return;
    }}
    
    // 2. Pametno večbesedno iskanje (ime, gramatura, format, šifra)
    const matches = searchMaterials(val);
    
    if (matches.length === 0) {{
        box.innerHTML = `<div class="notice error">Za iskanje <b>"${{val}}"</b> ni bil najden noben material. Poskusite z drugim imenom (npr. <i>Garda</i>), formatom (npr. <i>70x100</i>) ali gramaturo (npr. <i>250g</i>).</div>`;
    }} else if (matches.length === 1) {{
        box.innerHTML = getMaterialCardHtml(matches[0].material.code);
    }} else {{
        box.innerHTML = `
        <div class="notice info">
            <span>Najdenih <b>${{matches.length}} materialov</b> za iskanje "<b>${{val}}</b>". Kliknite na vrstico za podroben vpogled:</span>
        </div>
        <div class="tablewrap" style="max-height: 380px;">
            <table>
                <thead>
                    <tr>
                        <th>Šifra</th>
                        <th>Naziv materiala</th>
                        <th>Format</th>
                        <th>g/m²</th>
                        <th>Trenutna zaloga</th>
                        <th>Akcija</th>
                    </tr>
                </thead>
                <tbody>
                    ${{matches.slice(0, 30).map(r => `
                        <tr style="cursor: pointer;" onclick="document.getElementById('quickCodeInput').value='${{r.material.code}}'; doQuickSearch();">
                            <td style="font-weight: 700; color: #1e3a5f;">${{r.material.code}}</td>
                            <td><b>${{r.material.name}}</b></td>
                            <td>${{r.material.width}} &times; ${{r.material.height}} cm</td>
                            <td>${{r.material.gsm}} g</td>
                            <td class="${{r.cur < 0 ? 'bad' : (r.cur > 0 ? 'ok' : 'zero')}}">${{fmt(r.cur)}} kos</td>
                            <td>
                                <button class="mini-btn primary" onclick="event.stopPropagation(); document.getElementById('quickCodeInput').value='${{r.material.code}}'; doQuickSearch();">Poglej kartico &rarr;</button>
                            </td>
                        </tr>
                    `).join('')}}
                </tbody>
            </table>
        </div>
        ${{matches.length > 30 ? `<div style="font-size: 12px; color: #64748b; margin-top: 6px;">Prikazanih prvih 30 od ${{matches.length}} zadetkov. Za ožji izbor dodajte format ali gramaturo.</div>` : ''}}
        `;
    }}
}}

// --- VNOS PREJEMA ---
document.getElementById('saveReceiptBtn').addEventListener('click', () => addMovement('PREJEM'));
document.getElementById('clearReceiptBtn').addEventListener('click', () => clearForm('r'));

// --- VNOS IZDAJE ---
document.getElementById('saveIssueBtn').addEventListener('click', () => addMovement('IZDAJA'));
document.getElementById('clearIssueBtn').addEventListener('click', () => clearForm('i'));

function clearForm(prefix) {{
    const fields = prefix === 'r' 
        ? ['rCode', 'rQty', 'rDoc', 'rParty', 'rNote']
        : ['iCode', 'iQty', 'iDoc', 'iNote'];
    fields.forEach(id => document.getElementById(id).value = '');
    updatePreview(prefix + 'Code', prefix + 'MaterialBox');
    document.getElementById(prefix === 'r' ? 'receiptMsg' : 'issueMsg').innerHTML = '';
}}

function addMovement(type) {{
    const p = type === 'PREJEM' ? 'r' : 'i';
    let code = document.getElementById(p + 'Code').value.trim();
    const qty = parseFloat(document.getElementById(p + 'Qty').value);
    const date = document.getElementById(p + 'Date').value || new Date().toISOString().slice(0, 10);
    const doc = document.getElementById(p + 'Doc').value.trim();
    const party = document.getElementById(p + 'Party').value.trim();
    const note = document.getElementById(p + 'Note').value.trim();
    const msgId = p === 'r' ? 'receiptMsg' : 'issueMsg';
    const msgEl = document.getElementById(msgId);
    
    // Če je uporabnik izbral celoten niz iz dataliste (npr. "2295 – Garda")
    const matchCode = code.match(/^(\\d+)/);
    if (matchCode && matMap.has(matchCode[1])) {{
        code = matchCode[1];
    }}

    if (!matMap.has(code)) {{
        // Preverimo, če poizvedba ustreza točno enemu materialu po imenu
        const found = searchMaterials(code);
        if (found.length === 1) {{
            code = found[0].material.code;
            document.getElementById(p + 'Code').value = code;
        }} else {{
            msgEl.innerHTML = `<div class="notice error">Prosim, izberite veljavno šifro materiala ali kliknite <b>🔍 Poišči</b> ob polju.</div>`;
            return;
        }}
    }}
    if (isNaN(qty) || qty <= 0) {{
        msgEl.innerHTML = `<div class="notice error">Prosim, vnesite pravilno pozitivno količino (večjo od 0).</div>`;
        return;
    }}
    
    const curStock = stockOf(code);
    if (type === 'IZDAJA' && qty > curStock) {{
        if (!confirm(`OPOZORILO: Za šifro ${{code}} je na zalogi ${{fmt(curStock)}} kosov, izdati pa želite ${{fmt(qty)}} kosov.\\n\\nZaloga bo šla v negativno stanje (${{fmt(curStock - qty)}} kosov).\\n\\nAli vseeno potrjujete to izdajo?`)) {{
            return;
        }}
    }}
    
    const mov = {{
        id: 'new-' + Date.now(),
        date,
        type,
        code,
        qty,
        doc,
        party: party || (type === 'PREJEM' ? 'Dobavitelj' : 'Darko'),
        note,
        legacy: false,
        createdAt: new Date().toISOString()
    }};
    
    state.newMovements.push(mov);
    saveState();
    
    const newStock = stockOf(code);
    msgEl.innerHTML = `
        <div class="notice success">
            <span>✅ <b>${{type === 'PREJEM' ? 'Prejem' : 'Izdaja'}} materiala (${{code}}) je bila uspešno zabeležena!</b> Nova trenutna zaloga: <b>${{fmt(newStock)}} kos</b>. Stanje je takoj posodobljeno tudi v kalkulatorjih.</span>
        </div>
    `;
    clearForm(p);
}}

// --- TABELA TRENUTNE ZALOGE S STRANIČENJEM IN NAPREDNIMI FILTRI ---
let stockCurrentPage = 1;

function getFilteredStock() {{
    const q = document.getElementById('stockSearch').value;
    const nameF = document.getElementById('stockFilterName').value;
    const formatF = document.getElementById('stockFilterFormat').value;
    const gsmF = document.getElementById('stockFilterGsm').value;
    const statusF = document.getElementById('stockFilter').value;
    
    return searchMaterials(q, nameF, formatF, gsmF, statusF);
}}

function renderStock() {{
    const rows = getFilteredStock();
    const pageSizeVal = document.getElementById('stockPageSize').value;
    const pageSize = pageSizeVal === 'all' ? rows.length : parseInt(pageSizeVal, 10);
    const totalPages = Math.ceil(rows.length / (pageSize || 1)) || 1;
    
    if (stockCurrentPage > totalPages) stockCurrentPage = totalPages;
    if (stockCurrentPage < 1) stockCurrentPage = 1;
    
    const startIdx = (stockCurrentPage - 1) * pageSize;
    const paged = pageSizeVal === 'all' ? rows : rows.slice(startIdx, startIdx + pageSize);
    
    const tbody = document.getElementById('stockTableBody');
    tbody.innerHTML = paged.map(r => {{
        const m = r.material;
        const curClass = r.cur < 0 ? 'bad' : (r.cur > 0 ? 'ok' : 'zero');
        return `
        <tr>
            <td style="font-weight: 700; color: #1e3a5f;">${{m.code}}</td>
            <td><b>${{m.name}}</b></td>
            <td>${{m.width}} &times; ${{m.height}}</td>
            <td>${{m.gsm}}</td>
            <td>${{fmt(r.stock.opening)}}</td>
            <td class="ok">${{r.stock.inc > 0 ? '+' + fmt(r.stock.inc) : '0'}}</td>
            <td class="bad">${{r.stock.out > 0 ? '-' + fmt(r.stock.out) : '0'}}</td>
            <td class="${{curClass}}">${{fmt(r.cur)}}</td>
            <td>
                <button class="mini-btn" title="Vnesi prejem za ta artikel" onclick="prepareReceipt('${{m.code}}')">+ Prejem</button>
                <button class="mini-btn" title="Vnesi izdajo za ta artikel" onclick="prepareIssue('${{m.code}}')">- Izdaja</button>
            </td>
        </tr>
        `;
    }}).join('');
    
    document.getElementById('stockCountInfo').textContent = `Prikazujem ${{rows.length > 0 ? startIdx + 1 : 0}}–${{Math.min(startIdx + paged.length, rows.length)}} od ${{rows.length.toLocaleString('sl-SI')}} materialov`;
    document.getElementById('stockPageNum').textContent = `${{stockCurrentPage}} / ${{totalPages}}`;
    document.getElementById('btnStockPrev').disabled = stockCurrentPage <= 1;
    document.getElementById('btnStockNext').disabled = stockCurrentPage >= totalPages;
}}

document.getElementById('btnStockPrev').onclick = () => {{ stockCurrentPage--; renderStock(); }};
document.getElementById('btnStockNext').onclick = () => {{ stockCurrentPage++; renderStock(); }};
document.getElementById('stockSearch').oninput = () => {{ stockCurrentPage = 1; renderStock(); }};
document.getElementById('stockFilterName').oninput = () => {{ stockCurrentPage = 1; renderStock(); }};
document.getElementById('stockFilterFormat').oninput = () => {{ stockCurrentPage = 1; renderStock(); }};
document.getElementById('stockFilterGsm').oninput = () => {{ stockCurrentPage = 1; renderStock(); }};
document.getElementById('stockFilter').onchange = () => {{ stockCurrentPage = 1; renderStock(); }};
document.getElementById('stockPageSize').onchange = () => {{ stockCurrentPage = 1; renderStock(); }};

document.getElementById('btnClearStockFilters').onclick = () => {{
    document.getElementById('stockSearch').value = '';
    document.getElementById('stockFilterName').value = '';
    document.getElementById('stockFilterFormat').value = '';
    document.getElementById('stockFilterGsm').value = '';
    document.getElementById('stockFilter').value = 'all';
    stockCurrentPage = 1;
    renderStock();
}};

function prepareReceipt(code) {{
    document.querySelector('nav button[data-page="receipt"]').click();
    document.getElementById('rCode').value = code;
    updatePreview('rCode', 'rMaterialBox');
    document.getElementById('rQty').focus();
}}

function prepareIssue(code) {{
    document.querySelector('nav button[data-page="issue"]').click();
    document.getElementById('iCode').value = code;
    updatePreview('iCode', 'iMaterialBox');
    document.getElementById('iQty').focus();
}}

// --- MODAL ZA IZBIRO MATERIALA (PREJEM / IZDAJA) ---
let currentTargetFormPrefix = 'r';

function openMaterialSelector(prefix, initialQuery = '') {{
    currentTargetFormPrefix = prefix;
    const modal = document.getElementById('materialModal');
    const input = document.getElementById('modalSearchInput');
    modal.classList.add('open');
    input.value = initialQuery || document.getElementById(prefix + 'Code').value.trim();
    renderModalResults();
    input.focus();
}}

function closeMaterialModal() {{
    document.getElementById('materialModal').classList.remove('open');
}}

document.getElementById('modalClearBtn').onclick = () => {{
    document.getElementById('modalSearchInput').value = '';
    renderModalResults();
    document.getElementById('modalSearchInput').focus();
}};

document.getElementById('modalSearchInput').oninput = renderModalResults;

function renderModalResults() {{
    const q = document.getElementById('modalSearchInput').value;
    const matches = searchMaterials(q);
    const tbody = document.getElementById('modalTableBody');
    const badge = document.getElementById('modalCountBadge');
    
    badge.textContent = `Najdenih: ${{matches.length.toLocaleString('sl-SI')}} materialov`;
    
    tbody.innerHTML = matches.slice(0, 40).map(r => `
        <tr style="cursor: pointer;" onclick="selectMaterialForForm('${{r.material.code}}')">
            <td style="font-weight: 700; color: #1e3a5f;">${{r.material.code}}</td>
            <td><b>${{r.material.name}}</b></td>
            <td>${{r.material.width}} &times; ${{r.material.height}} cm</td>
            <td>${{r.material.gsm}} g</td>
            <td class="${{r.cur < 0 ? 'bad' : (r.cur > 0 ? 'ok' : 'zero')}}">${{fmt(r.cur)}} kos</td>
            <td>
                <button type="button" class="mini-btn primary" onclick="event.stopPropagation(); selectMaterialForForm('${{r.material.code}}')">Izberi &rarr;</button>
            </td>
        </tr>
    `).join('');
}}

function selectMaterialForForm(code) {{
    const inputId = currentTargetFormPrefix + 'Code';
    document.getElementById(inputId).value = code;
    updatePreview(inputId, currentTargetFormPrefix + 'MaterialBox');
    closeMaterialModal();
    const qtyInput = document.getElementById(currentTargetFormPrefix + 'Qty');
    if (qtyInput) qtyInput.focus();
}}

// Zapri modal ob kliku zunaj kartice ali tipki Escape
document.getElementById('materialModal').addEventListener('click', e => {{
    if (e.target.id === 'materialModal') closeMaterialModal();
}});
document.addEventListener('keydown', e => {{
    if (e.key === 'Escape') closeMaterialModal();
}});

// --- ZGODOVINA PROMETA S STRANIČENJEM ---
let histCurrentPage = 1;

function getFilteredHistory() {{
    const q = document.getElementById('histSearch').value.toLowerCase().trim();
    const t = document.getElementById('histType').value;
    let list = allMovements().filter(x => t === 'all' || x.type === t);
    
    if (q) {{
        list = list.filter(x => {{
            const m = matMap.get(String(x.code).trim());
            const haystack = `${{x.code}} ${{m ? m.name : ''}} ${{m ? m.width + 'x' + m.height : ''}} ${{m ? m.gsm : ''}} ${{x.doc}} ${{x.party}} ${{x.note}}`.toLowerCase();
            return haystack.includes(q);
        }});
    }}
    
    list.sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.createdAt || '').localeCompare(a.createdAt || ''));
    return list;
}}

function renderHistory() {{
    const list = getFilteredHistory();
    const pageSizeVal = document.getElementById('histPageSize').value;
    const pageSize = pageSizeVal === 'all' ? list.length : parseInt(pageSizeVal, 10);
    const totalPages = Math.ceil(list.length / (pageSize || 1)) || 1;
    
    if (histCurrentPage > totalPages) histCurrentPage = totalPages;
    if (histCurrentPage < 1) histCurrentPage = 1;
    
    const startIdx = (histCurrentPage - 1) * pageSize;
    const paged = pageSizeVal === 'all' ? list : list.slice(startIdx, startIdx + pageSize);
    
    const tbody = document.getElementById('histTableBody');
    tbody.innerHTML = paged.map(x => {{
        const m = matMap.get(String(x.code).trim()) || {{ name: '' }};
        return `
        <tr>
            <td>${{x.date || '-'}}</td>
            <td><span class="badge ${{x.type === 'PREJEM' ? 'in' : 'out'}}">${{x.type}}</span></td>
            <td style="font-weight: 700;">${{x.code}}</td>
            <td>${{m.name || '-'}}</td>
            <td style="font-weight: 700;">${{fmt(x.qty)}}</td>
            <td>${{x.doc || '-'}}</td>
            <td>${{x.party || '-'}}</td>
            <td style="color: #64748b;">${{x.note || '-'}}</td>
            <td style="font-size: 11px; color: #94a3b8;">${{x.legacy ? 'Excel arhiv' : 'Program (nov)'}}</td>
        </tr>
        `;
    }}).join('');
    
    document.getElementById('histCountInfo').textContent = `Prikazujem ${{list.length > 0 ? startIdx + 1 : 0}}–${{Math.min(startIdx + paged.length, list.length)}} od ${{list.length.toLocaleString('sl-SI')}} vnosov`;
    document.getElementById('histPageNum').textContent = `${{histCurrentPage}} / ${{totalPages}}`;
    document.getElementById('btnHistPrev').disabled = histCurrentPage <= 1;
    document.getElementById('btnHistNext').disabled = histCurrentPage >= totalPages;
}}

document.getElementById('btnHistPrev').onclick = () => {{ histCurrentPage--; renderHistory(); }};
document.getElementById('btnHistNext').onclick = () => {{ histCurrentPage++; renderHistory(); }};
document.getElementById('histSearch').oninput = () => {{ histCurrentPage = 1; renderHistory(); }};
document.getElementById('histType').onchange = () => {{ histCurrentPage = 1; renderHistory(); }};
document.getElementById('histPageSize').onchange = () => {{ histCurrentPage = 1; renderHistory(); }};

// --- DOMOV ZADNJI PREMIKI ---
function renderHomeRecent() {{
    const tbody = document.getElementById('homeRecentBody');
    const all = allMovements();
    all.sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.createdAt || '').localeCompare(a.createdAt || ''));
    const top10 = all.slice(0, 10);
    
    tbody.innerHTML = top10.map(x => {{
        const m = matMap.get(String(x.code).trim()) || {{ name: '' }};
        return `
        <tr>
            <td>${{x.date || '-'}}</td>
            <td><span class="badge ${{x.type === 'PREJEM' ? 'in' : 'out'}}">${{x.type}}</span></td>
            <td style="font-weight: 700;">${{x.code}}</td>
            <td>${{m.name || '-'}}</td>
            <td style="font-weight: 700;">${{fmt(x.qty)}}</td>
            <td>${{x.doc || '-'}}</td>
            <td>${{x.party || '-'}}</td>
            <td style="color: #64748b;">${{x.note || '-'}}</td>
        </tr>
        `;
    }}).join('');
}}

// --- KPI-JI ---
function renderKpis() {{
    const sm = stockMap();
    let inStock = 0;
    let negStock = 0;
    for (const code in sm) {{
        const s = sm[code];
        const cur = s.opening + s.inc - s.out;
        if (cur > 0) inStock++;
        else if (cur < 0) negStock++;
    }}
    document.getElementById('kTotalMat').textContent = SEED.materials.length.toLocaleString('sl-SI');
    document.getElementById('kInStock').textContent = inStock.toLocaleString('sl-SI');
    document.getElementById('kNegStock').textContent = negStock.toLocaleString('sl-SI');
    document.getElementById('kTotalMovements').textContent = allMovements().length.toLocaleString('sl-SI');
}}

// --- CSV IZVOZ ---
function downloadCsv(filename, rows) {{
    const csvContent = '\\uFEFF' + rows.map(r => r.map(cell => `"${{String(cell ?? '').replaceAll('"', '""')}}"`).join(';')).join('\\r\\n');
    const blob = new Blob([csvContent], {{ type: 'text/csv;charset=utf-8;' }});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}}

document.getElementById('exportStockCsvBtn').onclick = () => {{
    const sm = stockMap();
    const rows = [['Šifra materiala', 'Naziv', 'Širina (cm)', 'Višina (cm)', 'Gramatura (g/m2)', 'Začetna zaloga', 'Prejem', 'Izdaja', 'Trenutna zaloga']];
    for (const m of SEED.materials) {{
        const cStr = String(m.code).trim();
        const s = sm[cStr] || {{ opening: 0, inc: 0, out: 0 }};
        rows.push([m.code, m.name, m.width, m.height, m.gsm, s.opening, s.inc, s.out, s.opening + s.inc - s.out]);
    }}
    downloadCsv('zaloga_materiala_' + new Date().toISOString().slice(0, 10) + '.csv', rows);
}};

document.getElementById('exportHistoryCsvBtn').onclick = () => {{
    const rows = [['Datum', 'Vrsta', 'Šifra', 'Naziv', 'Količina', 'Dokument', 'Dobavitelj/Oseba', 'Opomba', 'Izvor']];
    for (const x of allMovements()) {{
        const m = matMap.get(String(x.code).trim()) || {{ name: '' }};
        rows.push([x.date, x.type, x.code, m.name, x.qty, x.doc, x.party, x.note, x.legacy ? 'Excel' : 'Program']);
    }}
    downloadCsv('zgodovina_premikov_' + new Date().toISOString().slice(0, 10) + '.csv', rows);
}};

// --- SINHRONIZACIJA & VARNOSTNA KOPIJA ---
function renderSyncStatus() {{
    const el = document.getElementById('syncStatusReport');
    if (!el) return;
    const time = localStorage.getItem(CALC_TIME_KEY) || 'Ni podatka';
    let count = 0;
    try {{
        const arr = JSON.parse(localStorage.getItem(CALC_STORAGE_KEY));
        if (Array.isArray(arr)) count = arr.length;
    }} catch(e) {{}}
    
    el.innerHTML = `
        <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px 18px; line-height: 1.6;">
            <div>📦 <b>Artiklov v kalkulatorskem spominu (localStorage):</b> <span style="font-weight: 700; color: #059669;">${{count.toLocaleString('sl-SI')}} artiklov</span></div>
            <div>🕒 <b>Čas zadnje sinhronizacije:</b> ${{time}}</div>
            <div>📝 <b>Število novih lokalnih vnosov:</b> ${{state.newMovements.length}}</div>
            <div style="margin-top: 8px; font-size: 13px; color: #64748b;">
                Vsi kalkulatorji v brskalniku ob zagonu ali kliku na "Osveži zalogo" takoj uporabijo te podatke.
            </div>
        </div>
    `;
}}

document.getElementById('btnForceSync').onclick = () => {{
    const res = syncWithCalculators();
    if (res) {{
        alert(`✅ Uspešno sinhronizirano! ${{res.count.toLocaleString('sl-SI')}} artiklov je posodobljenih za kalkulatorje ob ${{res.time}}.`);
    }} else {{
        alert('Prišlo je do napake pri sinhronizaciji.');
    }}
}};

document.getElementById('btnDownloadJson').onclick = () => {{
    const sm = stockMap();
    const exportList = [];
    for (const m of SEED.materials) {{
        const cStr = String(m.code).trim();
        const s = sm[cStr] || {{ opening: 0, inc: 0, out: 0 }};
        const cur = s.opening + s.inc - s.out;
        const w = m.width || '';
        const h = m.height || '';
        exportList.push({{
            'šifra materiala': cStr,
            'sifra': cStr,
            'naziv': m.name || '',
            'širina': w,
            'višina': h,
            'format': (w && h) ? `${{w}}x${{h}}` : '',
            'gramatura': m.gsm || '',
            'začetna zaloga': s.opening,
            'prispelo': s.inc,
            'odpis': s.out,
            'trenutna zaloga': cur,
            'zaloga': cur
        }});
    }}
    const blob = new Blob([JSON.stringify(exportList, null, 2)], {{ type: 'application/json' }});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'zalogaSimon.json';
    a.click();
    URL.revokeObjectURL(a.href);
}};

document.getElementById('btnExportBackup').onclick = () => {{
    const backupData = {{
        version: 2,
        exportedAt: new Date().toISOString(),
        newMovements: state.newMovements
    }};
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {{ type: 'application/json' }});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'zaloga_backup_' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
    URL.revokeObjectURL(a.href);
}};

document.getElementById('restoreFileInput').addEventListener('change', e => {{
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {{
        try {{
            const data = JSON.parse(reader.result);
            if (!Array.isArray(data.newMovements)) throw new Error('Neveljavna struktura varnostne kopije.');
            state = {{ newMovements: data.newMovements }};
            saveState();
            alert('✅ Varnostna kopija je bila uspešno uvožena!');
        }} catch(err) {{
            alert('Napaka pri branju varnostne kopije: ' + err.message);
        }}
    }};
    reader.readAsText(file);
}});

document.getElementById('btnResetNew').onclick = () => {{
    if (confirm('Ali res želite izbrisati samo nove vnose, ki ste jih dodali v tem programu?\\n\\nPrvotna uvožena zaloga iz Excela bo ostala ohranjena.')) {{
        state = {{ newMovements: [] }};
        saveState();
        alert('Novi vnosi so ponastavljeni.');
    }}
}};

// --- NAPOLNITEV DATALISTE ZA HITRO ISKANJE ---
const datalist = document.getElementById('allMaterialsDatalist');
datalist.innerHTML = SEED.materials.map(m => 
    `<option value="${{m.code}}">${{m.name}} (${{m.width}}&times;${{m.height}} cm / ${{m.gsm}} g)</option>`
).join('');

// --- ZAČETNI ZAGON ---
function renderAll() {{
    renderKpis();
    renderHomeRecent();
    renderStock();
    renderHistory();
    updateHeaderStatus();
    renderSyncStatus();
}}

const todayStr = new Date().toISOString().slice(0, 10);
document.getElementById('rDate').value = todayStr;
document.getElementById('iDate').value = todayStr;

// Ob vsakem odprtju posodobimo zalogo v kalkulatorjih
syncWithCalculators();
renderAll();
</script>
</body>
</html>
'''

with open(r'c:\DARKO\KalkulacijaPetric\zaloga2.html', 'w', encoding='utf-8') as f:
    f.write(html_code)

print("zaloga2.html updated with advanced search successfully!")
