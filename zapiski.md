# Zapiski in Navodila za Odpravljanje Napak (KalkulacijaPetrič)

Ta dokument vsebuje podroben pregled zaznamih težav, vzrokov za neodzivnost spletnih zavihkov (`kuverte2.html`, `pola2.html`, `blok2.html`, `brosura2.html`, `etikete2.html`, `TENOVIS2.html`) ter rešitve za hitro odpravljanje napak v prihodnje.



## X. Polje za Zložen Format (Vrečke/Zgib) in Avtomatsko Pakiranje v Natron Papir (pola2.html)
- **Zahteva uporabnika:**
  - Dodati polje za vnos zloženga/zgibanega formata izdelka (npr. zložena nosilna vrečka  \times 380\text{ mm}$ ali mapa), saj je format tiska/plašča ( \times 470\text{ mm}$) bistveno večji.
  - Če je format izdelka prevelik za standardno škatlo ( \times 320\text{ mm}$), se tiskovina samodejno pakira v **natron papir** (zavitki).
- **Izvedene rešitve v pola2.html:**
  1. **Novo vnosno polje na glavnem obrazcu:** Pod Dimenzije (Š x V mm) dodano polje Zložen format (vrečke/zgib): [ Š ] x [ V ] mm (z vijoličnim poudarkom #a78bfa).
  2. **Sinhronizacija z modalnim oknom 📦 Škatle & Paleta:** Zložen format je viden in uredljiv tako na osnovni maski kot v modalu.
  3. **Zaznava dimenzij in prevelikih formatov:**
     - Preveri, ali učinkovita dimenzija izdelka (zloženi format, če je vnesen, sicer format tiska) ustreza škatli  \times 320\text{ mm}$.
     - Če ne ustreza: samodejno preklopi na **Natron papir (zavitki)**.
  4. **Specifika pakiranja v natron papir:**
     - Za zložene vrečke je privzeta kapaciteta **100 kosov na zavitek** (zaradi debeline dna in vrvic cca 2,5–3,5 mm je to kup cca 25–28 cm in teža cca 6,5 kg).
     - Škatle se ne računajo (strošek embalaže zavitkov je ,00\text{ €}$).
     - Za večje količine ($\ge 8$ zavitkov ali $\ge 70\text{ kg}$) se predlaga Euro paleta (,00\text{ €}$).
     - Izpis v delovnem nalogu:  10 zavitkov (natron papir) po 100 kos; 1 Euro paleta (10 zavitkov, bruto 86 kg) ali brez palete:  2 zavitka (natron papir) po 100 kos.
  5. **Shranjevanje:** oldedWidth in oldedHeight se shranjujeta v ponudbo/projekt ter restavrirata ob nalaganju.
---

## 1. Vzroki za Popolno Neodzivnost Zavihkov ("se ne odziva")

Ko zavihek postane povsem neodziven (gumbi ne reagirajo, "MOJI PROJEKTI" se ne odpre, preračun ne deluje), gre v 99 % primerov za **kritično sintaktično ali runtime napako v JavaScriptu**, zaradi katere brskalnik prekine izvajanje celotne skripte.

### A. Podvojene Globalne Deklaracije Spremenljivk (`SyntaxError`)
- **Težava:** Če je v skripti navedeno npr.:
  ```javascript
  var STORAGE_KEY = 'kuverte_kalkulator_arhiv';
  // ... kasneje v isti ali drugi skripti:
  const STORAGE_KEY = 'kuverte_arhiv';
  ```
- **Posledica:** JavaScript pogon (V8) sproži `SyntaxError: Identifier 'STORAGE_KEY' has already been declared` med parsiranjem. Celoten skriptni blok se prekine in **nobena funkcija v tistem bloku se ne registrira** (`toggleProjectsDropdown is not defined`, `calculate is not defined`, ...).
- **Rešitev:** Vse globalne ključe deklariraj enotno z `var` ali pa uporabi različna imena (npr. `STORAGE_KEY_KUVERTE`).

---

### B. Uporaba `await` v Navadni (Ne-Async) Funkciji (`SyntaxError`)
- **Težava:** Klic `await` v funkciji, ki nima predpone `async`:
  ```javascript
  // NAPAKA:
  function exportToFile() {
      const handle = await window.showSaveFilePicker(...);
  }
  ```
- **Posledica:** `SyntaxError: await is only valid in async functions`. Skripta se spet ne prevede.
- **Rešitev:** Funkcija mora imeti obvezno deklaracijo `async function exportToFile()`.

---

### C. Omejitve `File System Access API` znotraj `<iframe>` (`SecurityError`)
- **Težava:** Ko so zavihki naloženi znotraj `<iframe>` v glavnem vmesniku (`PETRIČ.KALKULACIJE2.html`), brskalnik (Chrome/Edge) iz varnostnih razlogov blokira klica `showDirectoryPicker()` in `showSaveFilePicker()`:
  > `SecurityError: Failed to execute 'showDirectoryPicker' on 'Window': Cross origin sub frames aren't allowed to show a file picker.`
- **Rešitev:**
  1. Klic preusmeri na krovno okno (`window.top`):
     ```javascript
     let picker = (window.top && window.top !== window && typeof window.top.showDirectoryPicker === 'function')
         ? window.top.showDirectoryPicker.bind(window.top)
         : window.showDirectoryPicker.bind(window);
     ```
  2. Ulovi `SecurityError` in v primeru shranjevanja projekta samodejno preklopi na standardni prenosi (Blob Download Fallback):
     ```javascript
     catch (e) {
         if (e.name === 'SecurityError' || (e.message && e.message.includes('sub frames'))) {
             // Samodejni preklop na prenos v mapo Prenosi
             const blob = new Blob([jsonStr], { type: 'application/json' });
             const url = URL.createObjectURL(blob);
             const a = document.createElement('a');
             a.href = url;
             a.download = suggestedName;
             document.body.appendChild(a);
             a.click();
             document.body.removeChild(a);
             URL.revokeObjectURL(url);
             return;
         }
     }
     ```

---

### D. Uskladitev Skupne Cene na Zaokroženo Ceno na Kos (4 Decimalke)
- **Težava:** Če se je cena na kos prikazovala na 4 decimalke (npr. `0,1235 €`), skupna cena pa se je računala iz nezaokrožene cene (npr. `0.12345678 * 10.000 = 1.234,57 €`), je prišlo do odstopanja med prikazano ceno na kos × količina in prikazano skupno ceno (`0,1235 * 10.000 = 1.235,00 €`).
- **Rešitev:**
  V vseh kalkulacijskih datotekah (`pola2.html`, `blok2.html`, `brosura2.html`, `kuverte2.html`, `etikete2.html`, `TENOVIS2.html`) se sedaj cena na kos najprej zaokroži na 4 decimalna mesta (`Math.round((rawPrice / quantity) * 10000) / 10000`), nato pa se skupna cena izračuna natančno kot `zaokrožena_cena_na_kos_4dec * količina` (`Math.round((pricePerUnit_4dec * quantity) * 100) / 100`).
  S tem je skupna cena v ponudbah in kalkulacijah vedno 100% skladna z zmnožkom cene na kos in količine!

---

### E. Upoštevanje Obračanja (`isObrat`) in ŠV Tiska (`isSV`) pri 1-Barvnih Mutacijah (`pola2.html`)
- **Težava:** Pri 1-barvni obojestranski mutaciji (`Mutacija v 1 barvi obojestransko (1/1)`) je bilo potrebno pravilno obračunati število dodatnih plošč glede na to, ali gre za ravni tisk ali za tisk z obračanjem (Ob) / ŠV tisk.
- **Pravilo:**
  - **Ravni tisk (Ločeni plošči za spredaj/zadaj):** 1-barvna obojestranska mutacija (1/1) zahteva **2 dodatni plošči** na mutacijo (1 spredaj + 1 zadaj).
  - **Obračanje (Ob) ali ŠV tisk (Skupna plošča za spredaj/zadaj):** Ker sta sprednja in zadnja strana montirani na isti plošči, 1-barvna obojestranska mutacija (1/1) zahteva le **1 dodatno ploščo** na mutacijo.
- **Izvedba:** Funkcija `updateMutationPlates()` preveri `isObOrSV = isObrat || isSV` in pri `Mutacija v 1 barvi obojestransko (1/1)` nastavi: `plates = isObOrSV ? 1 : 2`.

---

### F. Uskladitev Prednastavljenih Formatov Kuvert in Vrečk (`envelopePresets`)
- **Težava:** Ob izbiri formata kuverte ali vrečke v padajočem menuju `#envelope-preset` (npr. `C5 LO`, `C4 BO`, `Vrečka C5`...) se dimenzije (širina in višina) niso spremenile.
- **Vzrok:** Vrednosti ustreznih HTML opcij (`value="C5_LO"`, `value="C4_BO"`, `value="Vrecka_C5_LO"`...) se niso ujemale s ključi v JavaScript objektu `envelopePresets` (tam so bili definirani le splošni ključi `'C5'`, `'C4'` z napačnimi dimenzijami).
- **Rešitev:**
  1. Obnovljen in dopolnjen objekt `envelopePresets` z vsemi točnimi dimenzijami za vse kuverte in vrečke (`Amerikanka`, `C6`, `B6`, `C6/5`, `C5`, `B5`, `C4`, `B4`, `Vrečke E4`, `400` itd.).
  2. V funkcijo `applyEnvelopePreset()` dodan pametni parser, ki v primeru neujemanja ključa samodejno razbere dimenzije v mm neposredno iz besedila opcije (npr. `"C5 LO (229x162 mm)"` -> širina 229 mm, višina 162 mm).

---

### G. Filtriranje Projektov v "MOJI PROJEKTI" (Prikaz samo projekte za trenutni modul)
- **Težava:** Pred tem sta se pri prikazu "MOJI PROJEKTI" in datotek na disku prikazovala tudi projekti iz drugih modulov (`pola`, `blok`, `brosura`, `etikete`, `tenovis`), ker je preverjanje `isKuverteProject` vključevalo preveč splošna polja (kot je `inp.quantities`).
- **Rešitev:**
  1. Funkcija `isKuverteProject(proj)` sedaj natančno preverja identifikator `_source === 'darko-kuverte'` ter polja, specifična le za kuverte (npr. `envelopePreset`, `postCount`), in eksplicitno izključuje polja iz drugih modulov (`paperType`, `cardboardWeight`, `coverMaterialCode`, `leavesMaterial`).
  2. Funkcija `refreshDiskProjects()` pri branju mape iz diska samodejno preskoči datoteke z končnicami `.pola.json`, `.blok.json`, `.brosura.json`, `.etiketa.json`, `.tenovis.json` ter preveri vsebino JSON datotek.

---

### H. Odstranitev Utripanja Polja za Naklado
- **Težava:** Vnosno polje za naklado (`calc-quantities`) je imelo nastavljeno CSS animacijo `blinkRequired 1.5s infinite`, zaradi česar je rdeče utripalo.
- **Rešitev:** Odstranjena je bila inline CSS animacija iz HTML polja, odstranjeno JS nastavljanje animacije `qtyInput.style.animation` in izbrisan `@keyframes blinkRequired` CSS pravilo.

---

### I. Nezaščiteni Dostopi do Manjkajočih DOM Elementov (`TypeError`)
- **Težava:** Klic `.value` ali `.checked` na elementu, ki v trenutnem HTML-ju ne obstaja:
  ```javascript
  // NAPAKA (če f-zgibanje-speed ne obstaja):
  let zSpeed = parseFloat(document.getElementById('f-zgibanje-speed').value) || 6800;
  ```
- **Posledica:** `TypeError: Cannot read properties of null (reading 'value')`. Izračun se sredi izvajanja prekine.
- **Rešitev:** Uporabljaj varne funkcije za branje vrednosti (`gv` in `gc`) ali ternarne preveritve:
  ```javascript
  let zSpeed = document.getElementById('f-zgibanje-speed') 
      ? parseFloat(document.getElementById('f-zgibanje-speed').value) || 6800 
      : 6800;
  ```

---

### J. Shranjevanje Ponudbe (Word) na Strežnik Srečko (`kuverte2.html`)
- **Težava:** V modulu Kuverte se ponudba ni shranila na strežnik Srečko v mapo `PONUDBE 2026`.
- **Vzroki:**
  1. Gumb `SHRANI PONUDBO NA DISK` v predogledu ponudbe je shranjeval le surovo `.html` datoteko namesto Word formata ter ni klical strežnika.
  2. Gumb `SHRANI V WORD` je poskušal izvajati `fetch('http://127.0.0.1:8095')` neposredno iz pojavnega okna (`about:blank` / `origin: null`), kar brskalnik (Chrome/Edge) blokira zaradi varnostne politike Private Network Access (PNA).
  3. Glavna funkcija `downloadWordDoc()` v `kuverte2.html` ni vsebovala kode za klic strežnika na vratih 8095.
- **Rešitev:**
  1. V `kuverte2.html` je bila posodobljena funkcija `downloadWordDoc()`, ki se sedaj poveže na lokalni strežnik `http://127.0.0.1:8095` in samodejno shrani ponudbo na strežnik Srečko v `\\server-2012\Srecko\NALOGI\A PONUDBE\PONUDBE [leto]` (oziroma `S:\NALOGI\A PONUDBE\PONUDBE [leto]`) ter hkrati sproži lokalni prenos datoteke `.doc`.
  2. V pojavnem oknu predogleda ponudbe oba gumba (`SHRANI V WORD` in `SHRANI PONUDBO (WORD)`) shranjevanje delegirata krovnemu oknu prek `window.opener.downloadWordDoc()`, s čimer se izogne blokadam PNA/CORS v pojavnem oknu.

---

### K. Napaka `Cannot access 'isSV' before initialization` (`TENOVIS2.html`)
- **Težava:** Ob vnosu ali spreminjanju podatkov v zavihku `TENOVIS2.html` se je pojavilo opozorilo `Napaka pri izračunu: Cannot access 'isSV' before initialization`, izračun pa se je prekinil.
- **Vzrok:** V funkciji za izračun se je spremenljivka `mPasses` računala kot `isSV ? 1 : rule.passes` na vrstici 5986, medtem ko je bila deklaracija `let isSV = ...` navedena šele nekaj vrstic nižje (vrstica 5992). Ker imajo `let` deklaracije blokovni obseg in se nahajajo v časovni mrtvi coni (TDZ) pred svojo vrstico, je brskalnik ob vsakem klicu funkcije `calculate()` sprožil `ReferenceError`.
- **Rešitev:** Deklaracija `let isSV = document.getElementById('calc-is-sv') ? document.getElementById('calc-is-sv')?.checked : false;` je bila premaknjena pred uporabo spremenljivke v `mPasses`.

---

### L. Povezava s strežnikom 8095 in blokada `showDirectoryPicker` v `<iframe>`
- **Težava:** Ob kliku na »Poveži z mapo« znotraj skupnega vmesnika `PETRIČ.KALKULACIJE2.html` je brskalnik javil: `Napaka: Failed to execute 'showDirectoryPicker' on 'Window': Cross origin sub frames aren't allowed to show a file picker.`
- **Rešitev v vseh kalkulatorjih (`*2.html`):**
  1. Vgrajeno samodejno pridobivanje in nalaganje ponudb prek lokalnega strežnika Srečko `http://127.0.0.1:8095/list` in `/read` (`fetchServerProjects()` in `loadProjectFromServer()`).
  2. Ponudbe s strežnika (`S:\PONUDBE TEST`) se samodejno prikažejo v meniju »MOJI PROJEKTI«, tako da ročno povezovanje mape sploh ni več potrebno.
  3. Klic `syncWithFolder()` sedaj elegantno prestreže varnostno napako brskalnika in prikaže prijazno pojasnilo namesto prekinitve.
  4. V `exportToFile()` je vgrajen samodejni preklop na Blob prenos v primeru blokade `showSaveFilePicker`.

---

### M. Centralni Zagon Strežnika Ponudb (`server-2012:8095`) za Vse Računalnike
- **Težava:** Na drugih računalnikih se v meniju »MOJI PROJEKTI« ni prikazalo nič, ker je bila koda vezana na lokalni `127.0.0.1:8095`, strežnik `save_server.py` pa je tekel samo na Darkovem računalniku (`PRODAJA-PC`).
- **Rešitev:**
  1. Na disku `S:\DARKO\KalkulacijaPetric\SERVER_APP\` je bil pripravljen celoten prenosni paket Python 3.11 s strežnikom `save_server.py`, ki ne potrebuje namestitve na strežniku `server-2012`.
  2. Pripravljeni sta zagonski skripti `ZAGON_STREZNIK_2012.bat` in `ZAGON_V_OZADJU.vbs` v mapi `S:\DARKO\KalkulacijaPetric\`.
  3. V vseh delovnih programih (`pola2.html`, `blok2.html`, `brosura2.html`, `kuverte2.html`, `etikete2.html`, `TENOVIS2.html`, `koledar2.html`) je bila povezava posodobljena s funkcijo `getServerBaseUrl()`, ki se najprej avtomatsko obrne na `http://server-2012:8095` (z varnostnimi rezervami `127.0.0.1:8095`, `Prodaja-pc:8095` in `192.168.0.154:8095`).
  4. Vse posodobljene datoteke so bile usklajene na lokalnem disku `C:` in na skupnem omrežnem pogonu `S:\`.

---

### N. Sintaktične Napake ob Posodobitvi Shranjevanja Word Ponudb (`pola2.html`, `brosura2.html`, `etikete2.html`)
- **Težava:** Meni »MOJI PROJEKTI« se v zavihkih `pola2.html` in `brosura2.html` ni odprl, gumbi so bili neodzivni.
- **Vzroka:**
  1. V `pola2.html` in `etikete2.html` je bil pri klicu `getServerBaseUrl().then(srvUrl => fetch(srvUrl, ...))` izpuščen začetni zaviti oklepaj `{` za telo lambda funkcije, kar je povzročilo `SyntaxError: missing ) after argument list`.
  2. V `brosura2.html` se je pred definicijo `g_serverProjects` pomotoma znašla podvojena vrstica `async function autoConnectFolder() {` brez zaključka, kar je sprožilo `SyntaxError: Unexpected end of input`.
- **Rešitev:**
  - V `pola2.html` in `etikete2.html` sta bili popravljeni funkciji za Word izvoz s pravilno zavitim telesom `getServerBaseUrl().then(srvUrl => { fetch(...); });`.
  - V `brosura2.html` je bila odstranjena podvojena/stray deklaracija funkcije.
  - Vsi moduli so bili preverjeni z orodjem Chrome Runtime Parser in se v celoti brezhibno prevedejo (0 napak). Datoteke so sinhronizirane na `C:` in `S:`.

---

### O. Pohitritev Strežnika `save_server.py` (iz 4,1 s na < 0,02 s) in Dvojni Sistem Branja Ponudb za Vse Računalnike
- **Težave:**
  1. V mapi `S:\PONUDBE TEST` je 248 JSON ponudb v skupni velikosti **118,16 MB** (nekaj ponudb ima pripete PDF-je do 20,5 MB). Strežnik `save_server.py` je ob vsakem klicu `/list` bral vseh 118 MB prek mreže (4,1 sekunde), brskalnik pa je imel nastavljen timeout na 600–700 ms in je povezavo vedno prekinil.
  2. `save_server.py` je uporabljal eno-nitni `HTTPServer`, ki se je ob hkratnem nalaganju 7 zavihkov v `PETRIČ.KALKULACIJE2.html` zamašil.
  3. Na drugih računalnikih je Windows požarni zid (Firewall) lahko blokiral vrata `8095`.
- **Rešitev:**
  1. **Več-nitni strežnik in predpomnilnik (`ThreadingHTTPServer` + `_index_cache.json`):** `save_server.py` sedaj uporablja `os.scandir` in predpomnilnik metapodatkov ter seznam 248 ponudb vrne v **< 20 ms** (iz pomnilnika v **0,002 ms**).
  2. **Neposredni skriptni most (`_projects_index.js` in `S:\PONUDBE TEST\_js_cache\`):** Če na kateremkoli računalniku vrata `8095` niso dosegljiva (zaradi požarnega zidu ali ugasnjenega strežnika), vseh 7 kalkulatorjev samodejno prebere seznam in odpre ponudbo neposredno iz pogona `S:\` prek `<script>` mostu (`loadJsBridgeScript`), ki deluje tudi znotraj `<iframe>` brez kakršnekoli blokade.
  3. **Vzporedno iskanje strežnika (`Promise.any`):** Funkcija `getServerBaseUrl()` preveri vse strežniške naslove vzporedno na hitri točki `/` in izbere najhitrejšega v < 20 ms.

---
---

### P. Šifra Stranke Ostaja Prazna v Vseh Kalkulatorjih
- **Zahteva uporabnika:** V vseh kalkulatorjih naj bo šifra stranke (`#calc-customer-code`) prazna.
- **Težava:** Pri samodejnem zbiranju kontaktov strank so se kot šifre strank shranile ponudbene ali povpraševalne številke (npr. `11620`, `Anfrage 726257/26` ipd.), ki so se ob izbiri stranke samodejno vpisale v polje `Šifra stranke`.
- **Rešitev:**
  1. V vseh 7 delovnih kalkulatorjih (`pola2.html`, `blok2.html`, `brosura2.html`, `TENOVIS2.html`, `kuverte2.html`, `etikete2.html`, `koledar2.html`) je bilo odstranjeno samodejno izpolnjevanje `calc-customer-code`.
  2. Ob vsaki izbiri ali menjavi stranke (`hasChanged`) se polje `calc-customer-code` izrecno ponastavi na prazno (`""`).
  3. Pri odpiranju obstoječih projektov se polje `calc-customer-code` prav tako nastavi na prazno.
  4. V datotekah `customer_contacts_seed.js` in `customer_contacts_seed.json` so bile šifre strank izbrisane, dodano pa je tudi samodejno čiščenje starih šifer iz lokalnega predpomnilnika (`localStorage.petric_customer_contacts_cache`).
  5. Vse posodobljene datoteke so sinhronizirane na lokalnem disku `C:` in omrežnem disku `S:`.

---

### R. Odstranitev Šifre Stranke in Šifre Izdelka iz Vseh Kalkulatorjev
- **Zahteva uporabnika:** Iz vseh kalkulatorjev odstrani polji "Šifra stranke" in "Šifra izdelka".
- **Izvedba:**
  1. V vseh 8 delovnih kalkulatorjih (`pola2.html`, `blok2.html`, `brosura2.html`, `TENOVIS2.html`, `krka2.html`, `kuverte2.html`, `etikete2.html`, `koledar2.html`):
     - Odstranjeni so vizualni vnosni elementi in oznake (`<label>`, `<input>`) za "Šifra stranke" in "Šifra izdelka" iz glave kalkulatorja.
     - Elementa sta ohranjena kot skriti polji (`<input type="hidden" id="calc-customer-code" value="">` ter `<input type="hidden" id="calc-product-code" value="">`), kar preprečuje kakršnekoli `TypeError: null` napake pri klicih obstoječih skript za shranjevanje ali branje projektov.
     - V `kuverte2.html` je bila oznaka materiala preimenovana v "Šifra materiala" (brez besede "izdelka").
     - V modalnih oknih za uvoz/izvoz PDF so bila polja/kljukice za šifro stranke in izdelka skrita (`display: none;`).
     - V generiranih ponudbah in delovnih nalogih se oznaka "Šifra stranke:" prikazuje izključno takrat, ko je dejansko izpolnjena (torej ne prikazuje več praznih vrednosti ali `/`).
  2. Vse spremembe so posodobljene na `C:\DARKO\KalkulacijaPetric\` in sinhronizirane na omrežni pogon `S:\DARKO\KalkulacijaPetric\`. Predloge (`pola.html`, `blok.html`, ...) so ostale nedotaknjene po pravilu uporabnika.

---

### S. Krka2: Avtomatska Tabela Pakiranja, Števila na Poli, Tiskovne Pole in Razreza
- **Zahteva uporabnika:** V `krka2.html` implementirati tabelo s 14 Krka formati (pakirano v škatli, število na poli, tiskovna pola in format razreza) ter omogočiti ročno izbiro formata za razrez iz spustnega seznama.
- **Izvedba:**
  1. Vgrajena tabela specifikacij `KRKA_FORMAT_SPECS` za vseh 14 formatov (173x150, 293x110, 269x148, 269x154, 260x154, 380x154, 399x154, 413x110, 514x110, 532x154, 615x110, 650x154, 398x148, 532x148).
  2. Ob izbiri formata iz spustnega seznama (ali ročnem vpisu odprtega formata) se samodejno nastavijo:
     - Kapaciteta škatle (`krka-box-cap`) in opomba pakiranja
     - Število sestavkov na poli (`krka-items-select` in `krka-items-per-sheet`, dodana je tudi možnost `9` sestavkov)
     - Tiskovna pola (`krka-print-sheet`: 598x498, 698x498, 698x352 mm)
     - Privzeti format za razrez (`krka-razrez-format`: 598x498, 700x1000, 1000x700, 700x1060)
  3. Uporabnik lahko format za razrez kadarkoli samostojno spremeni v spustnem seznamu (npr. izbira med 598x498, 700x1000, 1000x700, 700x1060, 698x498 ali po meri), preračun razreza (vhodne pole in razrezane pole) pa se takoj dinamično posodobi glede na izbrani format in razmerje izrezov.
  4. Posodobljeni `krka2.html` je sinhroniziran na `C:\DARKO\KalkulacijaPetric\` in `S:\DARKO\KalkulacijaPetric\`.

---

### T. Odprava Neodzivnosti "MOJI PROJEKTI" v `TENOVIS2.html` in `etikete2.html` (Analiza Vzroka)
- **Težava:** V programih `TENOVIS2.html` in `etikete2.html` se ob kliku na gumb "MOJI PROJEKTI" spustni seznam projektov ni odprl. V konzoli brskalnika se je pojavila napaka `ReferenceError: toggleProjectsDropdown is not defined`.
- **Zakaj se to zgodi, ko se naredi sprememba (Podrobna diagnoza):**
  Vsaka datoteka kalkulatorja vsebuje obsežen monolitni JavaScript blok (več kot 10.000 vrstic). V JavaScriptu velja pravilo: **če se kjerkoli v istem `<script>` bloku pojavi ena sama sintaktična napaka (`SyntaxError`) ali pa se blok ne zaključi pravilno (`</script>`), brskalnikov JavaScript pogon (V8) zavrže in prekliče prevajanje celotnega bloka kode**. Nobena funkcija iz tistega bloka se ne registrira v globalni pomnilnik (`window`). Zato vse funkcije (vključno s `toggleProjectsDropdown()`) postanejo `undefined`.
- **Konkretna vzroka v obeh datotekah:**
  1. **V `TENOVIS2.html`:** V funkciji `getWorkOrderHTML()` (okoli vrstice 12360) je pri prejšnjem urejanju ostala podvojena koda (`finalSourceSheets = ... } let prepPasses ...`), v kateri je bila odvečna zaključna zavita oklepaj (`}`). Ta oklepaj je funkcijo `getWorkOrderHTML()` predčasno zaprl, zato je kasnejša vrstica `return html;` (na vrstici 13090) pristala izven funkcije. To je sprožilo `SyntaxError: Illegal return statement`, kar je sesulo prevajanje celotne 10.000-vrstične skripte.
  2. **V `etikete2.html`:** Pri prejšnjem vnosu je orodje za urejanje na vrstici 8790 pomotoma odrezalo preostanek datoteke (`... [truncated for diff preview]`). Zaradi tega se glavni `<script>` blok nikoli ni zaprl s `</script>`, manjkale pa so tudi vse zaključne funkcije (za izvoz, tisk, pregled zalog in zaključek HTML dokumenta).
- **Izvedena rešitev:**
  1. V `TENOVIS2.html` je bil odstranjen podvojeni blok z odvečnim oklepajem `}`. Funkcija `getWorkOrderHTML()` se sedaj pravilno zaključi, vsi skriptni bloki se prevedejo z 0 napakami.
  2. V `etikete2.html` je bil v celoti obnovljen manjkajoči rep datoteke (vključno z `loadProjectData`, `getQuoteHTML`, `printQuote`, `printQuoteAT`, `printProductionOrder`, `printWorkOrder`, modalnim oknom zalog Simon ter pravilnimi zaključnimi oznakami `</script></body></html>`), hkrati pa je bila dodana podpora za shranjevanje Word ponudb na strežnik Srečko prek `getServerBaseUrl()` ter zaščita praznih šifer stranke/izdelka.
  3. Preverjeno s testnim orodjem Chrome CDP: V obeh programih je `typeof toggleProjectsDropdown === 'function'`, ob kliku na "MOJI PROJEKTI" se meni brezhibno odpre (`display: flex`) in zapre (`display: none`), brez kakršnekoli napake v konzoli.
  4. Obe datoteki sta sinhronizirani na lokalni disk `C:\` in omrežni pogon `S:\`.

---

### U. Premik Polja RVC / Marža in Minus Cena na Zavihek "Povzetek & RVC" (`blok2.html` in `brosura2.html`)
- **Zahteva:** Polje z maržo (`calc-margin`) in minus ceno 4,8% (`calc-minus-price`) premakniti iz zavihka Dodelava na zavihek »💶 Povzetek & RVC« zraven tehnične specifikacije.
- **Izvedba:**
  1. V `blok2.html` in `brosura2.html` je bil element odstranjen iz zavihka Dodelava (`calc-tab-dodelava`).
  2. V zavihku »Povzetek & RVC« (`calc-tab-povzetek`) je bil blok za specifikacijo (`detailed-spec-content`) in blok za RVC (`row-rvc-margin`) postavljen v prilagodljivo postavitev (`display: flex; gap: 1.5rem; justify-content: space-between; flex-wrap: wrap;`), kjer se polje za RVC nahaja desno zraven specifikacije, s podporo za lepljivo vidnost (`position: sticky; top: 1rem;`) ob drsenju po specifikaciji.
  3. Ohranjen je celoten nabor ID-jev in dogodkov (`onchange="calculatePrice()"` / `calculate()`), tako da kalkulacije, samodejni preračuni in shranjevanje v košarico/projekte delujejo 100% nespremenjeno.
  4. Obe datoteki sta posodobljeni na `C:\` in sinhronizirani na omrežni pogon `S:\`.

---

### V. Dodan Nov Zavihek »📦 ŠKATLE & PALETE« (`pakiranje2.html`) in Sistem Pakiranja
- **Zahteve:**
  1. Dimenzija škatle: `240 × 320 × 250 mm`.
  2. Največja dovoljena teža v škatli: `15 kg`.
  3. Omejitev višine palete: `160 cm`.
  4. Cena škatle: `0,50 €`, cena Euro palete: `10,00 €`.
  5. Na paleto se ne pakira neposredno tiskovin (vse gre v škatle, škatle na paleto).
  6. Izvedba: tako samostojni modul v `PETRIČ.KALKULACIJE2.html` kot priprava za integracijo v kalkulatorje.
- **Izvedba:**
  1. Izdelan namenski program `pakiranje2.html`:
     - Samodejni izračun kapacitete škatle glede na format izdelka in mejo 15 kg (z možnostjo ročnega vnosa ali zaokrožitve).
     - Izračun polnih in zadnje delne škatle ter skupne teže.
     - Paletizacija na Euro paleto (1200 × 800 mm):
       - 10 škatel / sloj (postavitev 5 × 2) ali 11 škatel / sloj (prepletena postavitev).
       - Max 5 slojev (skupna višina tovora 139,4 cm s paleto 14,4 cm, kar je znotraj meje 160 cm).
       - 50 škatel / Euro paleto (pri 10/sloj) oz. 55 škatel / Euro paleto (pri 11/sloj).
     - Interaktivni 2D Canvas tloris Euro palete ter stranski prikaz zlaganja po višini.
     - Gumb »Kopiraj za D.N.« za hiter prepis v delovni nalog.
     - Izpis etiket za škatle (kupec, D.N., naziv, škatla X/Y, količina) in uradni A4 spremni paletni list.
     - Gumb »Uvozi iz kalkulatorja«, ki samodejno prenese podatke o nakladi, formatu in teži iz trenutno aktivnega zavihka v `PETRIČ.KALKULACIJE2.html`.
  2. V `PETRIČ.KALKULACIJE2.html` dodan nov zavihek `📦 ŠKATLE & PALETE` in iframe `iframe_pakiranje`.
  3. Vse datoteke posodobljene na `C:\DARKO\KalkulacijaPetric\` in sinhronizirane na `S:\DARKO\KalkulacijaPetric\`.

---

### W. Integracija Izračuna Škatel in Palet v `pola2.html`
- **Zahteva:** Dodati hiter izračun pakiranja neposredno v `pola2.html`.
- **Izvedba:**
  1. Zraven polja »Pakiranje (D.N.)« dodana gumba:
     - **»⚡ Auto«**: V enem kliku samodejno preračuna škatle (240×320×250 mm, max 15 kg, 0,50 €) in Euro paleto (max 160 cm, 10,00 €) ter takoj vpiše natančno besedilo v polje delovnega naloga.
     - **»📦 Škatle & Paleta«**: Odpre namensko modalno okno za pregled in prilagoditev (format, gramatura, teža 1 kosa, kapaciteta škatle, število polnih in delnih škatel, višina palete, bruto teža, stroški embalaže).
  2. Vgrajen gumb za neposreden preskok v glavni zavihek »ŠKATLE & PALETE« za tisk nalepk za škatle ali spremnega paletnega lista.
  3. Datoteka `pola2.html` je preverjena in sinhronizirana na `C:\DARKO\KalkulacijaPetric\` ter `S:\DARKO\KalkulacijaPetric\`.

---

## 2. Hitri Diagnostični Protokol (Če se zavihek spet ne odziva)

Ko uporabnik sporoči, da se zavihek ne odziva, izvedi naslednje korake:

1. **Preveri sintakso vseh `<script>` blokov:**
   - Preveri, če katera od funkcij z `await` nima `async`.
   - Preveri podvojene `const` ali `let` deklaracije v globalnem obsegu.

2. **Preveri konzolo brskalnika (CDP / Headless Log):**
   - Preveri, ali se v konzoli pojavlja `Uncaught ReferenceError: ... is not defined` ali `SyntaxError`.

3. **Preveri varnostne pogoje vseh `getElementById` klicev:**
   - Preveri, ali se kjerkoli izvede `.value` ali `.checked` brez predhodnega preverjanja obstoja elementa.

---

## 3. Pravila pri Delu z Datotekami

1. **Predloge (`blok.html`, `pola.html`, `brosura.html`, `etikete.html`, `kuverte.html`, `tenovis.html`):**
   - Teh datotek **NE SPREMINJAJ**. Vedno delaj na ustreznih delovnih kopijah (`blok2.html`, `pola2.html`, `kuverte2.html` itd.).
2. **Git:**
   - Ne izvajaj `git commit` ali `git push`. Uporabnik to dela samodejno.
3. **Obseg sprememb:**
   - Spreminjaj samo tisti program, za katerega je uporabnik eksplicitno zaprosil.
