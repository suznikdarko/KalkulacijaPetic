import json

# Load temp_seed.json
with open('temp_seed.json', 'r', encoding='utf-8') as f:
    seed_data = json.load(f)

seed_json_str = json.dumps(seed_data, ensure_ascii=False)

html_template = f'''<!DOCTYPE html>
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
    padding: 14px 18px;
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

.notice.warn {{
    background: var(--warn-bg);
    border: 1px solid var(--warn-border);
    color: #92400e;
}}

.searchrow {{
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 14px;
}}

.searchrow input {{ max-width: 360px; }}
.searchrow select {{ max-width: 220px; }}

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
    padding: 3px 8px;
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

<!-- 1. DOMOV / PREGLED & TESTER ŠIFER -->
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

    <!-- TESTER ŠIFER ZA KALKULATORJE (POSEBNOST ZA A2) -->
    <div class="card" style="border: 2px solid #93c5fd; background: #f0f7ff;">
        <div class="card-title">
            <span>🔍 Hitri vpogled v šifro za kalkulator</span>
            <span style="font-size: 13px; font-weight: normal; color: #1e40af;">Preizkusi, kaj kalkulator vidi za poljubno šifro</span>
        </div>
        <p style="margin: 0 0 12px 0; font-size: 14px; color: #334155;">
            Vnesite šifro materiala (npr. <b>2295</b>, <b>4288</b>, <b>1136</b>, <b>4350</b>, <b>320</b>) ali del naziva za takojšen pregled zaloge in prenos v kalkulatorje:
        </p>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <input id="quickCodeInput" list="allMaterialsDatalist" placeholder="Vnesite šifro (npr. 2295) ali naziv..." style="font-size: 16px; font-weight: 600; max-width: 450px;" autocomplete="off">
            <button class="primary" id="btnQuickSearch">Preveri zalogo</button>
            <button id="btnQuickClear">Počisti</button>
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
                <label for="rCode">Šifra materiala</label>
                <input id="rCode" list="allMaterialsDatalist" placeholder="Vpišite šifro (npr. 2295)..." autocomplete="off">
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
                <label for="iCode">Šifra materiala</label>
                <input id="iCode" list="allMaterialsDatalist" placeholder="Vpišite šifro (npr. 2295)..." autocomplete="off">
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

        <div class="searchrow">
            <input id="stockSearch" placeholder="🔍 Išči po šifri, nazivu, formatu ali gramaturi..." autocomplete="off">
            <select id="stockFilter">
                <option value="all">Vsi materiali</option>
                <option value="positive">Samo z zalogo (&gt; 0)</option>
                <option value="zero">Samo ničelna zaloga (= 0)</option>
                <option value="negative">Samo negativna zaloga (&lt; 0)</option>
            </select>
            <select id="stockPageSize">
                <option value="50">50 na stran</option>
                <option value="100" selected>100 na stran</option>
                <option value="250">250 na stran</option>
                <option value="all">Prikaži vse naenkrat</option>
            </select>
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

        <div class="searchrow">
            <input id="histSearch" placeholder="🔍 Išči šifro, dobavnico, delovni nalog, stranko, opombo..." autocomplete="off">
            <select id="histType">
                <option value="all">Vsi premiki (prejemi + izdaje)</option>
                <option value="PREJEM">Samo prejemi</option>
                <option value="IZDAJA">Samo izdaje / odpisi</option>
            </select>
            <select id="histPageSize">
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

// --- NAVIGACIJA ---
document.querySelectorAll('nav button').forEach(b => {{
    b.addEventListener('click', () => {{
        document.querySelectorAll('nav button').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
        const targetPage = document.getElementById(b.dataset.page);
        if (targetPage) targetPage.classList.add('active');
        if (b.dataset.page === 'stock') renderStock();
        if (b.dataset.page === 'history') renderHistory();
        if (b.dataset.page === 'sync') renderSyncStatus();
    }});
}});

// --- PREDOGLED MATERIALA ---
function getMaterialCardHtml(code) {{
    const cStr = String(code).trim();
    const m = matMap.get(cStr);
    if (!m) {{
        return `<div class="notice error">Šifra <b>${{cStr}}</b> ne obstaja v šifrantu materialov.</div>`;
    }}
    const sm = stockMap()[cStr] || {{ opening: 0, inc: 0, out: 0 }};
    const cur = sm.opening + sm.inc - sm.out;
    const curClass = cur < 0 ? 'bad' : (cur > 0 ? 'ok' : 'zero');
    
    return `
    <div class="material-card-highlight">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px;">
            <div>
                <span style="font-size: 13px; font-weight: 700; color: #64748b; text-transform: uppercase;">Šifra: ${{m.code}}</span>
                <h3 style="margin: 2px 0 6px 0; font-size: 18px; color: #1e3a5f;">${{m.name}}</h3>
                <div style="font-size: 14px; color: #475569;">
                    <b>Format:</b> ${{m.width}} &times; ${{m.height}} cm &nbsp; | &nbsp;
                    <b>Gramatura:</b> ${{m.gsm}} g/m²
                </div>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 12px; color: #64748b; font-weight: 600;">TRENUTNA ZALOGA</div>
                <div style="font-size: 26px; font-weight: 800;" class="${{curClass}}">${{fmt(cur)}} kos</div>
            </div>
        </div>
        <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #cbd5e1; display: flex; gap: 18px; font-size: 13px; color: #64748b; flex-wrap: wrap;">
            <span>Začetna zaloga: <b>${{fmt(sm.opening)}}</b></span>
            <span>Skupaj prejemi: <b class="ok">+${{fmt(sm.inc)}}</b></span>
            <span>Skupaj izdaje: <b class="bad">-${{fmt(sm.out)}}</b></span>
            <span>Status v kalkulatorju: <b class="ok">✅ Na voljo</b></span>
        </div>
    </div>
    `;
}}

function updatePreview(inputId, boxId) {{
    const code = document.getElementById(inputId).value.trim();
    const box = document.getElementById(boxId);
    if (!code) {{
        box.className = 'material-preview-box';
        box.innerHTML = '';
        return;
    }}
    box.className = 'material-preview-box show';
    box.innerHTML = getMaterialCardHtml(code);
}}

['rCode', 'iCode'].forEach(id => {{
    const el = document.getElementById(id);
    if (el) {{
        el.addEventListener('input', () => updatePreview(id, id[0] + 'MaterialBox'));
        el.addEventListener('change', () => updatePreview(id, id[0] + 'MaterialBox'));
    }}
}});

// --- HITRI VPOGLED / TESTER ŠIFER (DOMOV) ---
document.getElementById('btnQuickSearch').addEventListener('click', doQuickSearch);
document.getElementById('quickCodeInput').addEventListener('keydown', e => {{
    if (e.key === 'Enter') doQuickSearch();
}});
document.getElementById('btnQuickClear').addEventListener('click', () => {{
    document.getElementById('quickCodeInput').value = '';
    const b = document.getElementById('quickResultBox');
    b.style.display = 'none';
    b.innerHTML = '';
}});

function doQuickSearch() {{
    const val = document.getElementById('quickCodeInput').value.trim();
    const box = document.getElementById('quickResultBox');
    if (!val) {{
        box.style.display = 'none';
        return;
    }}
    box.style.display = 'block';
    
    // Poskusimo točno po šifri
    if (matMap.has(val)) {{
        box.innerHTML = getMaterialCardHtml(val);
        return;
    }}
    
    // Drugače iščemo po vseh
    const q = val.toLowerCase();
    const matches = SEED.materials.filter(m => 
        String(m.code).toLowerCase().includes(q) || 
        m.name.toLowerCase().includes(q)
    );
    
    if (matches.length === 0) {{
        box.innerHTML = `<div class="notice error">Za iskalni niz <b>"${{val}}"</b> ni bil najden noben material v šifrantu.</div>`;
    }} else if (matches.length === 1) {{
        box.innerHTML = getMaterialCardHtml(matches[0].code);
    }} else {{
        box.innerHTML = `
        <div class="notice info">Najdenih več zadetkov (${{matches.length}}). Izberite želenega:</div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
            ${{matches.slice(0, 10).map(m => `
                <div style="background: white; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center; cursor: pointer;" onclick="document.getElementById('quickCodeInput').value='${{m.code}}'; doQuickSearch();">
                    <div>
                        <b>${{m.code}}</b> – ${{m.name}} (${{m.width}}&times;${{m.height}} cm, ${{m.gsm}} g)
                    </div>
                    <div>
                        Zaloga: <b>${{fmt(stockOf(m.code))}}</b> &rarr;
                    </div>
                </div>
            `).join('')}}
        </div>
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
    const code = document.getElementById(p + 'Code').value.trim();
    const qty = parseFloat(document.getElementById(p + 'Qty').value);
    const date = document.getElementById(p + 'Date').value || new Date().toISOString().slice(0, 10);
    const doc = document.getElementById(p + 'Doc').value.trim();
    const party = document.getElementById(p + 'Party').value.trim();
    const note = document.getElementById(p + 'Note').value.trim();
    const msgId = p === 'r' ? 'receiptMsg' : 'issueMsg';
    const msgEl = document.getElementById(msgId);
    
    if (!matMap.has(code)) {{
        msgEl.innerHTML = `<div class="notice error">Prosim, izberite veljavno šifro materiala iz šifranta.</div>`;
        return;
    }}
    if (isNaN(qty) || qty <= 0) {{
        msgEl.innerHTML = `<div class="notice error">Prosim, vnesite pravilno pozitivno količino (večjo od 0).</div>`;
        return;
    }}
    
    const curStock = stockOf(code);
    if (type === 'IZDAJA' && qty > curStock) {{
        if (!confirm(`OPOZORILO: Za šifro ${{code}} je na zalogi ${{fmt(curStock)}} kosov, izdati pa želite ${{fmt(qty)}} kosov.\n\nZaloga bo šla v negativno stanje (${{fmt(curStock - qty)}} kosov).\n\nAli vseeno potrjujete to izdajo?`)) {{
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

// --- TABELA TRENUTNE ZALOGE S STRANIČENJEM ---
let stockCurrentPage = 1;

function getFilteredStock() {{
    const q = document.getElementById('stockSearch').value.toLowerCase().trim();
    const f = document.getElementById('stockFilter').value;
    const sm = stockMap();
    let rows = [];
    
    for (const m of SEED.materials) {{
        const cStr = String(m.code).trim();
        const s = sm[cStr] || {{ opening: 0, inc: 0, out: 0 }};
        const cur = s.opening + s.inc - s.out;
        
        if (f === 'positive' && cur <= 0) continue;
        if (f === 'zero' && cur !== 0) continue;
        if (f === 'negative' && cur >= 0) continue;
        
        if (q) {{
            const searchHaystack = `${{cStr}} ${{m.name}} ${{m.width}}x${{m.height}} ${{m.gsm}}g`.toLowerCase();
            if (!searchHaystack.includes(q)) continue;
        }}
        rows.push({{ material: m, stock: s, cur }});
    }}
    return rows;
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
            <td>${{m.name}}</td>
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
document.getElementById('stockFilter').onchange = () => {{ stockCurrentPage = 1; renderStock(); }};
document.getElementById('stockPageSize').onchange = () => {{ stockCurrentPage = 1; renderStock(); }};

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

// --- ZGODOVINA PROMETA S STRANIČENJEM ---
let histCurrentPage = 1;

function getFilteredHistory() {{
    const q = document.getElementById('histSearch').value.toLowerCase().trim();
    const t = document.getElementById('histType').value;
    let list = allMovements().filter(x => t === 'all' || x.type === t);
    
    if (q) {{
        list = list.filter(x => {{
            const m = matMap.get(String(x.code).trim());
            const haystack = `${{x.code}} ${{m ? m.name : ''}} ${{x.doc}} ${{x.party}} ${{x.note}}`.toLowerCase();
            return haystack.includes(q);
        }});
    }}
    
    // Sortiraj padajoče po datumu
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
    const csvContent = '\uFEFF' + rows.map(r => r.map(cell => `"${{String(cell ?? '').replaceAll('"', '""')}}"`).join(';')).join('\\r\\n');
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
    f.write(html_template)

print("zaloga2.html generated successfully!")
