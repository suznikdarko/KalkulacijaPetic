import os

with open('blok.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. HTML checkbox
html_old = '''                            <div class="form-group" id="obrat-container-leaves" style="background: rgba(245, 158, 11, 0.1); padding: 0.5rem; border-radius: 8px; border: 1px solid rgba(245, 158, 11, 0.3); margin-bottom: 0; width: 100%;">
                                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: #fcd34d; margin: 0; font-size: 0.85rem;">
                                    <input id="calc-is-obrat-leaves" onchange="updateWasteAndPrice('leaves')" style="width: auto; margin: 0;" type="checkbox" />
                                    Tisk "na obrat"
                                </label>
                            </div>'''

html_new = '''                            <div class="form-group" id="obrat-container-leaves" style="background: rgba(245, 158, 11, 0.1); padding: 0.5rem; border-radius: 8px; border: 1px solid rgba(245, 158, 11, 0.3); margin-bottom: 0; width: 100%;">
                                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: #fcd34d; margin: 0; font-size: 0.85rem;">
                                    <input id="calc-is-obrat-leaves" onchange="if(this.checked) { let sv = document.getElementById('calc-is-sv-leaves'); if(sv) sv.checked = false; } updateWasteAndPrice('leaves')" style="width: auto; margin: 0;" type="checkbox" />
                                    Tisk "na obrat"
                                </label>
                            </div>
                            <div class="form-group" id="sv-container-leaves" style="background: rgba(59, 130, 246, 0.1); padding: 0.5rem; border-radius: 8px; border: 1px solid rgba(59, 130, 246, 0.3); margin-bottom: 0; width: 100%; margin-top: 5px;">
                                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: #60a5fa; margin: 0; font-size: 0.85rem;">
                                    <input id="calc-is-sv-leaves" onchange="if(this.checked) { let ob = document.getElementById('calc-is-obrat-leaves'); if(ob) ob.checked = false; } updateWasteAndPrice('leaves')" style="width: auto; margin: 0;" type="checkbox" />
                                    Šen Vider (ŠV)
                                </label>
                            </div>'''

content = content.replace(html_old, html_new)

# 2. getBossLogic signature
getboss_old = '''            function getBossLogic(front, back, isObrat, qty, mutPlates) {
                if (front === 0 && back === 0) return null;
                let colorMode = front + '/' + (isObrat ? 'OB' : back);
                let speedTableMode = isObrat ? '4/OB' : (back > 0 ? '4/4' : '4/0');

                let basicPlates = front + (isObrat ? 0 : back);
                let mutMultiplier = (mutPlates > 0 && basicPlates > 0) ? (mutPlates / basicPlates) : 0;

                let newBossTables = {
                    '4/0': [{ q: 1000, waste: 320, speed: 2200 }, { q: 5000, waste: 320, speed: 3050 }, { q: 10000, waste: 320, speed: 4250 }, { q: 50000, waste: 320, speed: 5500 }, { q: 100000, waste: 320, speed: 5750 }, { q: 300000, waste: 320, speed: 5750 }, { q: 500000, waste: 625, speed: 6100 }],
                    '4/4': [{ q: 1000, waste: 1280, speed: 2800 }, { q: 5000, waste: 1280, speed: 3500 }, { q: 10000, waste: 1280, speed: 5200 }, { q: 50000, waste: 1280, speed: 5750 }, { q: 100000, waste: 1280, speed: 5750 }, { q: 300000, waste: 1500, speed: 6100 }, { q: 500000, waste: 2500, speed: 6100 }],
                    '4/OB': [{ q: 1000, waste: 540, speed: 2800 }, { q: 5000, waste: 540, speed: 3900 }, { q: 10000, waste: 540, speed: 4400 }, { q: 50000, waste: 540, speed: 5750 }, { q: 100000, waste: 540, speed: 5750 }, { q: 300000, waste: 750, speed: 6060 }, { q: 500000, waste: 1250, speed: 6060 }]
                };'''

getboss_new = '''            function getBossLogic(front, back, isObrat, isSV, qty, mutPlates) {
                if (front === 0 && back === 0) return null;
                let colorMode = front + '/' + (isObrat ? 'OB' : back);
                let speedTableMode = isSV ? '8/0' : (isObrat ? '4/OB' : (back > 0 ? '4/4' : '4/0'));

                let basicPlates = front + (isObrat ? 0 : back);
                let mutMultiplier = (mutPlates > 0 && basicPlates > 0) ? (mutPlates / basicPlates) : 0;

                let newBossTables = {
                    '8/0': [{ q: 1000, waste: 720, speed: 2800 }, { q: 5000, waste: 720, speed: 3500 }, { q: 10000, waste: 720, speed: 4400 }, { q: 50000, waste: 1250, speed: 5750 }, { q: 100000, waste: 1250, speed: 5750 }, { q: 300000, waste: 1500, speed: 6060 }, { q: 500000, waste: 1500, speed: 6060 }],
                    '4/0': [{ q: 1000, waste: 320, speed: 2200 }, { q: 5000, waste: 320, speed: 3050 }, { q: 10000, waste: 320, speed: 4250 }, { q: 50000, waste: 320, speed: 5500 }, { q: 100000, waste: 320, speed: 5750 }, { q: 300000, waste: 320, speed: 5750 }, { q: 500000, waste: 625, speed: 6100 }],
                    '4/4': [{ q: 1000, waste: 1280, speed: 2800 }, { q: 5000, waste: 1280, speed: 3500 }, { q: 10000, waste: 1280, speed: 5200 }, { q: 50000, waste: 1280, speed: 5750 }, { q: 100000, waste: 1280, speed: 5750 }, { q: 300000, waste: 1500, speed: 6100 }, { q: 500000, waste: 2500, speed: 6100 }],
                    '4/OB': [{ q: 1000, waste: 540, speed: 2800 }, { q: 5000, waste: 540, speed: 3900 }, { q: 10000, waste: 540, speed: 4400 }, { q: 50000, waste: 540, speed: 5750 }, { q: 100000, waste: 540, speed: 5750 }, { q: 300000, waste: 750, speed: 6060 }, { q: 500000, waste: 1250, speed: 6060 }]
                };'''

content = content.replace(getboss_old, getboss_new)

# 3. getBossLogic calls
boss_call_old = '''                    let frontL = parseInt(document.getElementById('calc-color-front-leaves')?.value || 0) || 0;
                    let backL = parseInt(document.getElementById('calc-color-back-leaves')?.value || 0) || 0;
                    let isObratL = document.getElementById('calc-is-obrat-leaves')?.checked || false;
                    let wasteL = parseInt(document.getElementById('calc-paper-waste-leaves')?.value || 0) || 0;
                    let mutPlatesL = parseInt(document.getElementById('calc-mut-plates-leaves')?.value || 0) || 0;

                    // Ovitek
                    let frontC = parseInt(document.getElementById('calc-color-front-cover')?.value || 0) || 0;
                    let backC = parseInt(document.getElementById('calc-color-back-cover')?.value || 0) || 0;
                    let isObratC = document.getElementById('calc-is-obrat-cover')?.checked || false;
                    let wasteC = parseInt(document.getElementById('calc-paper-waste-cover')?.value || 0) || 0;
                    let mutPlatesC = parseInt(document.getElementById('calc-mut-plates-cover')?.value || 0) || 0;

                    let bossL = getBossLogic(frontL, backL, isObratL, totalItemsForm, mutPlatesL);
                    if (bossL) {
                        wasteL = bossL.waste;
                        let wInputL = document.getElementById('calc-paper-waste-leaves');
                        if (wInputL) wInputL.value = wasteL;
                        let pal = document.getElementById('calc-print-allowance-leaves');
                        if (pal) pal.placeholder = "Avto (" + wasteL + " pol)";
                    } else if (frontL + backL === 0) {
                        wasteL = 0;
                        let wInputL = document.getElementById('calc-paper-waste-leaves');
                        if (wInputL) wInputL.value = 0;
                        let pal = document.getElementById('calc-print-allowance-leaves');
                        if (pal) pal.placeholder = "Vpiši dodatek...";
                    }

                    let bossC = getBossLogic(frontC, backC, isObratC, totalItemsForm, mutPlatesC);'''

boss_call_new = '''                    let frontL = parseInt(document.getElementById('calc-color-front-leaves')?.value || 0) || 0;
                    let backL = parseInt(document.getElementById('calc-color-back-leaves')?.value || 0) || 0;
                    let isObratL = document.getElementById('calc-is-obrat-leaves')?.checked || false;
                    let isSVL = document.getElementById('calc-is-sv-leaves')?.checked || false;
                    let wasteL = parseInt(document.getElementById('calc-paper-waste-leaves')?.value || 0) || 0;
                    let mutPlatesL = parseInt(document.getElementById('calc-mut-plates-leaves')?.value || 0) || 0;

                    // Ovitek
                    let frontC = parseInt(document.getElementById('calc-color-front-cover')?.value || 0) || 0;
                    let backC = parseInt(document.getElementById('calc-color-back-cover')?.value || 0) || 0;
                    let isObratC = document.getElementById('calc-is-obrat-cover')?.checked || false;
                    let wasteC = parseInt(document.getElementById('calc-paper-waste-cover')?.value || 0) || 0;
                    let mutPlatesC = parseInt(document.getElementById('calc-mut-plates-cover')?.value || 0) || 0;

                    let bossL = getBossLogic(frontL, backL, isObratL, isSVL, totalItemsForm, mutPlatesL);
                    if (bossL) {
                        wasteL = bossL.waste;
                        let wInputL = document.getElementById('calc-paper-waste-leaves');
                        if (wInputL) wInputL.value = wasteL;
                        let pal = document.getElementById('calc-print-allowance-leaves');
                        if (pal) pal.placeholder = "Avto (" + wasteL + " pol)";
                    } else if (frontL + backL === 0) {
                        wasteL = 0;
                        let wInputL = document.getElementById('calc-paper-waste-leaves');
                        if (wInputL) wInputL.value = 0;
                        let pal = document.getElementById('calc-print-allowance-leaves');
                        if (pal) pal.placeholder = "Vpiši dodatek...";
                    }

                    let bossC = getBossLogic(frontC, backC, isObratC, false, totalItemsForm, mutPlatesC);'''

content = content.replace(boss_call_old, boss_call_new)

# 4. getDynamicSpeed
dyn_old = '''            function getDynamicSpeed(baseSpeed, grammage, qty, comp) {
                let _front = parseInt(document.getElementById('calc-color-front-' + comp)?.value || 0) || 0;
                let _back = parseInt(document.getElementById('calc-color-back-' + comp)?.value || 0) || 0;
                let _isObrat = document.getElementById('calc-is-obrat-' + comp)?.checked || false;
                let baseColorMode = (_isObrat ? '4/OB' : (_back > 0 ? '4/4' : '4/0'));
                let mType = document.getElementById('calc-machine-type-' + comp)?.value || 'S4';'''

dyn_new = '''            function getDynamicSpeed(baseSpeed, grammage, qty, comp) {
                let _front = parseInt(document.getElementById('calc-color-front-' + comp)?.value || 0) || 0;
                let _back = parseInt(document.getElementById('calc-color-back-' + comp)?.value || 0) || 0;
                let _isObrat = document.getElementById('calc-is-obrat-' + comp)?.checked || false;
                let _isSV = document.getElementById('calc-is-sv-' + comp)?.checked || false;
                let baseColorMode = _isSV ? '8/0' : (_isObrat ? '4/OB' : (_back > 0 ? '4/4' : '4/0'));
                let mType = document.getElementById('calc-machine-type-' + comp)?.value || 'S4';'''

content = content.replace(dyn_old, dyn_new)

# 5. calculatePrice logic 1 (colorsL array and passes)
calc1_old = '''                let frontL = parseInt(document.getElementById('calc-color-front-leaves')?.value || 0) || 0;
                let backL = parseInt(document.getElementById('calc-color-back-leaves')?.value || 0) || 0;
                let isObratL = document.getElementById('calc-is-obrat-leaves')?.checked || false;
                let colorsL = (isObratL) ? (frontL + '/' + frontL) : (frontL + '/' + backL);

                let mTypeL = document.getElementById('calc-machine-type-leaves')?.value || 'S4';
                let ruleL = prepRules[colorsL] || { passes: Math.ceil(frontL / 4) + Math.ceil(backL / 4), wasteImpressions: (frontL + backL) * 150 };
                let mPassesL = ruleL.passes;'''

calc1_new = '''                let frontL = parseInt(document.getElementById('calc-color-front-leaves')?.value || 0) || 0;
                let backL = parseInt(document.getElementById('calc-color-back-leaves')?.value || 0) || 0;
                let isObratL = document.getElementById('calc-is-obrat-leaves')?.checked || false;
                let isSVL = document.getElementById('calc-is-sv-leaves')?.checked || false;
                let colorsL = (isObratL || isSVL) ? (frontL + '/' + frontL) : (frontL + '/' + backL);

                let mTypeL = document.getElementById('calc-machine-type-leaves')?.value || 'S4';
                let ruleL = prepRules[colorsL] || { passes: Math.ceil(frontL / 4) + Math.ceil(backL / 4), wasteImpressions: (frontL + backL) * 150 };
                let mPassesL = isSVL ? 1 : ruleL.passes;'''

content = content.replace(calc1_old, calc1_new)

# 6. state saving and loading
state_old = '''                            frontL: gv('calc-color-front-leaves'),
                            backL: gv('calc-color-back-leaves'),
                            obratL: gc('calc-is-obrat-leaves'),'''

state_new = '''                            frontL: gv('calc-color-front-leaves'),
                            backL: gv('calc-color-back-leaves'),
                            obratL: gc('calc-is-obrat-leaves'),
                            svL: gc('calc-is-sv-leaves'),'''

content = content.replace(state_old, state_new)

load_old = '''                setV('calc-color-front-leaves', inp.frontL);
                setV('calc-color-back-leaves', inp.backL);
                setV('calc-is-obrat-leaves', inp.obratL, true);'''

load_new = '''                setV('calc-color-front-leaves', inp.frontL);
                setV('calc-color-back-leaves', inp.backL);
                setV('calc-is-obrat-leaves', inp.obratL, true);
                if (document.getElementById('calc-is-sv-leaves')) document.getElementById('calc-is-sv-leaves').checked = inp.svL || false;'''

content = content.replace(load_old, load_new)


with open('blok.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated blok.html')
