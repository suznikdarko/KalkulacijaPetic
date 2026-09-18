# Zapiski in Navodila za Odpravljanje Napak (KalkulacijaPetrič)

Ta dokument vsebuje podroben pregled zaznamih težav, vzrokov za neodzivnost spletnih zavihkov (`kuverte2.html`, `pola2.html`, `blok2.html`, `brosura2.html`, `etikete2.html`, `TENOVIS2.html`) ter rešitve za hitro odpravljanje napak v prihodnje.

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
