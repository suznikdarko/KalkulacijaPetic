# Pregled podvojenih gumbov po zavihkih (PETRIČ.KALKULACIJE2)

Dokument vsebuje natančen pregled in analizo podvojenih gumbov v aplikaciji **`PETRIČ.KALKULACIJE2.html`**, razdeljeno ločeno za vsak posamezni zavihek.

---

## Povzetek glavnih vzrokov podvajanja

1. **POLA (`pola2.html`)**: V datoteki sta prisotni kar **dve lepljivi nogi (`sticky-footer`)** (vrstica 1711 pred skriptom in vrstica 8872 za skriptom), zaradi česar se vsi glavni akcijski gumbi za ponudbo, delovni nalog in košarico izrisujejo dvakrat.
2. **BROŠURA (`brosura2.html`) in KUVERTE (`kuverte2.html`)**: Celoten blok HTML kode za modalno okno preverjanja zaloge (`#modal-stock-search`) je bil v preteklosti pomotoma vstavljen dvakrat, zato sta podvojena gumb za zapiranje modala in gumb za nalaganje datoteke zaloge.
3. **TENOVIS (`TENOVIS2.html`)**: Glavni akcijski gumbi (`PONUDBA`, `D. NALOG`, `STARI DN`) so istočasno definirani v razdelku košarice in v spodnji fiksni nogi.
4. **BLOK (`blok2.html`) in ETIKETE (`etikete2.html`)**: Gumb `🔍 Išči po zalogi` se pri izbiri papirja za liste pojavi dvakrat v razmaku le nekaj vrstic (enkrat v modrem pasu stanja zaloge in drugič neposredno nad vnosnim poljem).
5. **ETIKETE (`etikete2.html`)**: Zaradi neubežane oznake `<script>` znotraj predloge v JavaScriptu je prišlo do izpisa celotne orodne vrstice delovnega naloga neposredno v HTML kodo dokumenta.

---

## 1. Zavihek POLA (`pola2.html`)

V tem zavihku je podvojenost največja, saj sta na dnu strani aktivni kar dve fiksni nogi, poleg tega pa so gumbi prisotni še v košarici in glavi projekta.

| Gumb / Funkcionalnost | Lokacija 1 (Vrstica) | Lokacija 2 (Vrstica) | Lokacija 3 (Vrstica) | Klicana funkcija | Opomba / Vizualna lokacija |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **PONUDBA** | Vrstica 992 | Vrstica 1730 | Vrstica 8916 | `printQuote()` | V košarici (`PONUDBA`), v 1. nogi (`📄 PONUDBA 0`) in v 2. nogi (`PONUDBA`) |
| **PONUDBA (AT)** | Vrstica 1736 | Vrstica 8919 | — | `printQuoteAT()` | V 1. nogi (`📄 PONUDBA (AT)`) in v 2. nogi (`PONUDBA (AT)`) |
| **DELOVNI NALOG (D. NALOG)** | Vrstica 986 | Vrstica 1741 | Vrstica 8922 | `printWorkOrder()` | V košarici (`D. NALOG`), v 1. nogi (`📋 DELOVNI NALOG (DN)`) in v 2. nogi (`D. NALOG`) |
| **DODAJ V KOŠARICO** | Vrstica 1725 | Vrstica 8928 | — | `addToBasket()` | V 1. nogi (`🛒 DODAJ V KOŠARICO`) in v 2. nogi (`DODAJ`) |
| **MONTAŽNI LIST / STARI DN** | Vrstica 989 | Vrstica 8934 | — | `printProductionOrder()` | V košarici (`STARI DN`) in v 2. nogi (`Montažni list`) |
| **SPECIFIKACIJA** | Vrstica 964 | Vrstica 1746 | — | `printTechSpec()` | Ob razdelku specifikacije (`🖨️ Natisni specifikacijo`) in v 1. nogi (`📊 SPECIFIKACIJA`) |
| **SHRANI PROJEKT** | Vrstica 502 | Vrstica 520 / 1179 | Vrstica 8931 | `exportToFile()` / `saveProjectToFile()` | V orodni vrstici zgoraj (`💾 SHRANI PROJEKT`, `💾 SHRANI JSON`), ob kalkulaciji in v 2. nogi (`SHRANI`) |
| **Puščica spustnega seznama** | Vrstica 542 (`ˇ`) | Vrstica 639 (`ˇ`) | — | `toggleCustomerDropdown()` / `toggleEmailDropdown()` | Ob vnosu stranke in ob vnosu e-pošte |

---

## 2. Zavihek BLOK (`blok2.html`)

| Gumb / Funkcionalnost | Lokacija 1 (Vrstica) | Lokacija 2 (Vrstica) | Klicana funkcija | Opomba / Vizualna lokacija |
| :--- | :--- | :--- | :--- | :--- |
| **🔍 Išči po zalogi (listi)** | Vrstica 1244 | Vrstica 1264 | `openStockSearchModal('leaves')` | Prvič v modrem pasu zaloge, drugič tik nad vnosnim poljem za »Material listi« |
| **📂 Naloži zalogaSimon.json** | Vrstica 1241 | Vrstica 2155 | `loadStockFile()` | V pasu zaloge pri materialu ter znotraj pojavnega okna zaloge |
| **💾 SHRANI** | Vrstica 532 | Vrstica 2133 | `saveCurrentProject(this)` | V zgornji vrstici (`💾 SHRANI PROJEKT`) in v spodnji fiksni nogi (`💾 SHRANI`) |
| **SPECIFIKACIJA** | Vrstica 1486 | Vrstica 2127 | `printTechSpec()` | V razdelku specifikacije (`🖨️ Natisni specifikacijo`) in v spodnji fiksni nogi (`📊 SPECIFIKACIJA`) |
| **DIAGNOSTIKA** | Vrstica 2164 | Vrstica 2178 | `toggleDebugConsole()` | Plavajoči gumb (`🐞 DIAGNOSTIKA & NAPAKE 0`) in gumb za zapiranje (`✖`) v konzoli |
| **Puščica spustnega seznama** | Vrstica 570 (`▼`) | Vrstica 667 (`▼`) | `toggleCustomerDropdown()` / `toggleEmailDropdown()` | Ob vnosu stranke in ob vnosu e-pošte |

---

## 3. Zavihek BROŠURA (`brosura2.html`)

V tem zavihku je celotno modalno okno za zalogo (`<div id="modal-stock-search">`) v kodi vstavljeno dvakrat.

| Gumb / Funkcionalnost | Lokacija 1 (Vrstica) | Lokacija 2 (Vrstica) | Klicana funkcija | Opomba / Vizualna lokacija |
| :--- | :--- | :--- | :--- | :--- |
| **× (Zapri modal zaloge)** | Vrstica 3707 | Vrstica 13089 | `closeStockSearchModal()` | V prvem in v drugem (podvojenem) modalu zaloge |
| **📂 Naloži zalogaSimon.json** | Vrstica 3714 | Vrstica 13096 | `loadStockFile()` | V prvem in v drugem modalu zaloge (ter v JS predlogi vrstica 14182 / 14339) |
| **SPECIFIKACIJA** | Vrstica 2782 | Vrstica 3684 | `printTechSpec()` | V razdelku specifikacije (`🖨️ Natisni specifikacijo`) in v spodnji lepljivi nogi (`📊 SPECIFIKACIJA`) |
| **🔍 Preveri zalogo (Simon)** | Vrstica 2304 | Vrstica 2333 | `openStockSearchModal(...)` | Enkrat za vsebino/liste (`'leaves'`), drugič za ovitek (`'cover'`) |
| **Puščica spustnega seznama** | Vrstica 1069 (`▼`) | Vrstica 1256 (`▼`) | `toggleCustomerDropdown()` / `toggleEmailDropdown()` | Ob vnosu stranke in ob vnosu e-pošte |

---

## 4. Zavihek TENOVIS (`TENOVIS2.html`)

Glavno podvajanje v Tenovisu nastane med gumbi v košarici in gumbi v spodnji lepljivi nogi.

| Gumb / Funkcionalnost | Lokacija 1 (Vrstica) | Lokacija 2 (Vrstica) | Klicana funkcija | Opomba / Vizualna lokacija |
| :--- | :--- | :--- | :--- | :--- |
| **PONUDBA** | Vrstica 1756 | Vrstica 2667 | `printQuote()` | V košarici (`🖨️ PONUDBA`) in v lepljivi nogi spodaj (`PONUDBA`) |
| **D. NALOG** | Vrstica 1742 | Vrstica 2673 | `printWorkOrder()` | V košarici (`D. NALOG`) in v lepljivi nogi spodaj (`D. NALOG`) |
| **MONTAŽNI LIST / DN** | Vrstica 1749 | Vrstica 2689 | `printProductionOrder()` | V košarici (`STARI DN`) in v lepljivi nogi spodaj (`Montažni list`) |
| **SPECIFIKACIJA** | Vrstica 1709 | Vrstica 2676 | `printTechSpec()` | V razdelku specifikacije (`🖨️ Natisni specifikacijo`) in v lepljivi nogi spodaj (`📊 SPECIFIKACIJA`) |
| **DIAGNOSTIKA** | Vrstica 2699 | Vrstica 2724 | `toggleDebugConsole()` | Plavajoči gumb (`🐞 DIAGNOSTIKA & NAPAKE 0`) in gumb za zapiranje (`✖`) |
| **Puščica spustnega seznama** | Vrstica 984 (`▼`) | Vrstica 1211 (`▼`) | `toggleCustomerDropdown()` / `toggleEmailDropdown()` | Ob vnosu stranke in ob vnosu e-pošte |

---

## 5. Zavihek KUVERTE (`kuverte2.html`)

Podobno kot pri Brošuri je celoten modal zaloge (`modal-stock-search`) definiran dvakrat (vrstica 971 in vrstica 2904).

| Gumb / Funkcionalnost | Lokacija 1 (Vrstica) | Lokacija 2 (Vrstica) | Klicana funkcija | Opomba / Vizualna lokacija |
| :--- | :--- | :--- | :--- | :--- |
| **× (Zapri modal zaloge)** | Vrstica 975 | Vrstica 2911 | `closeStockSearchModal()` | V prvem in v drugem modalu za zalogo |
| **📂 Naloži zalogaSimon.json** | Vrstica 979 | Vrstica 2918 | `loadStockFile()` | V prvem in v drugem modalu za zalogo |
| **SPECIFIKACIJA** | Vrstica 649 | Vrstica 936 | `printTechSpec()` | V razdelku specifikacije (`🖨️ Natisni specifikacijo`) in v lepljivi nogi spodaj (`📊 SPECIFIKACIJA`) |
| **Puščica spustnega seznama** | Vrstica 379 (`▼`) | Vrstica 485 (`▼`) | `toggleCustomerDropdown()` / `toggleEmailDropdown()` | Ob vnosu stranke in ob vnosu e-pošte |

---

## 6. Zavihek ETIKETE (`etikete2.html`)

| Gumb / Funkcionalnost | Lokacija 1 (Vrstica) | Lokacija 2 (Vrstica) | Klicana funkcija | Opomba / Vizualna lokacija |
| :--- | :--- | :--- | :--- | :--- |
| **🔍 Išči po zalogi (listi)** | Vrstica 1238 | Vrstica 1258 | `openStockSearchModal('leaves')` | V pasu zaloge ter tik ob vnosnem polju za material listov |
| **📂 Naloži zalogaSimon.json** | Vrstica 1235 | Vrstica 8352 | `loadStockFile()` | V pasu zaloge pri materialu in v modalnem oknu |
| **Orodna vrstica delovnega naloga (leaked HTML)** | Vrstice 9550–9554 | — | `window.print()`, `window.close()`, `saveDNToDisk()`, itd. | Zaradi sintaktične napake v JS predlogi se gumbi `NATISNI DN`, `ZAPRI`, `PONASTAVI`, `PREMAKNI`, `SHRANI DN (WORD)` izrišejo neposredno v HTML |
| **Puščica spustnega seznama** | Vrstica 564 (`▼`) | Vrstica 661 (`▼`) | `toggleCustomerDropdown()` / `toggleEmailDropdown()` | Ob vnosu stranke in ob vnosu e-pošte |

---

## Predlogi za sanacijo podvojenosti

1. **POLA**: Odstraniti prvo lepljivo nogo (`sticky-footer` v vrsticah 1711–1752) ali pa odstraniti drugo (vrstice 8872–8940), tako da ostane le ena enotna spodnja vrstica z gumbi.
2. **BROŠURA in KUVERTE**: Izbrisati drugi, podvojeni blok `<div id="modal-stock-search">...</div>` (v brošuri vrstice 13081–13102, v kuvertah vrstice 2902–2924).
3. **TENOVIS in POLA**: Poenotiti gumbe med košarico in spodnjo vrstico (npr. v košarici obdržati le gumb za praznjenje/odstranitev, generiranje ponudbe in naloga pa prepustiti spodnji glavni vrstici).
4. **BLOK in ETIKETE**: Odstraniti odvečni gumb `🔍 Išči po zalogi` nad poljem »Material listi«, saj že obstaja gumb v zgornjem pasu zaloge.
5. **ETIKETE**: Popraviti ubežitev oznak `<script>` v funkciji za generiranje delovnega naloga, da se gumbi delovnega naloga ne izrisujejo neposredno v vmesnik kalkulatorja.
