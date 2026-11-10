with open(r'c:\DARKO\KalkulacijaPetric\kuverte1.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

old_func = '''            let arhiv = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

            arhiv.sort((a, b) => b.id - a.id);
            let filtered = filter ? arhiv.filter(proj => {
                const searchStr = getSearchableText(proj).toLowerCase();
                const terms = filter.split(/\s+/).filter(Boolean);
                return terms.every(term => searchStr.includes(term));
            }) : arhiv;'''

new_func = '''            let arhivRaw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            // Filter only kuverte projects (or those without source for compatibility)
            let arhiv = arhivRaw.filter(p => !p._source || p._source === 'kuverte');

            arhiv.sort((a, b) => b.id - a.id);
            let filtered = filter ? arhiv.filter(proj => {
                const searchStr = getSearchableText(proj).toLowerCase();
                const terms = filter.split(/\s+/).filter(Boolean);
                return terms.every(term => searchStr.includes(term));
            }) : arhiv;'''

if old_func in html:
    html = html.replace(old_func, new_func)
    with open(r'c:\DARKO\KalkulacijaPetric\kuverte1.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Fixed renderSavedProjects successfully")
else:
    print("Could not find renderSavedProjects old func")
