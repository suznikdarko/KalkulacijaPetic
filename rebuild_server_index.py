import os, json, glob

files = glob.glob(r'S:\PONUDBE TEST\*.json')
print(f"Total files found: {len(files)}")

projects = []
for fpath in files:
    fname = os.path.basename(fpath)
    if fname == 'index_projektov.json':
        continue
    try:
        with open(fpath, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        continue
        
    src = data.get('_source') or data.get('source') or ''
    inp = data.get('inputs') or {}
    lname = fname.lower()
    
    isKuverte = False
    isBlok = False
    isBrosura = False
    isEtikete = False
    isTenovis = False
    isPola = False

    if src == 'darko-kuverte' or lname.endswith('.kuverte.json') or 'envelopePreset' in inp:
        isKuverte = True
    elif src == 'darko-brosura' or lname.endswith('.brosura.json') or 'machine_format_cover' in inp or 'closedW' in inp or 'brosur' in lname or 'brošur' in lname:
        isBrosura = True
    elif src == 'darko-blok' or lname.endswith('.blok.json') or 'padSheets' in inp or 'blok' in lname:
        isBlok = True
    elif src == 'darko-etikete' or lname.endswith('.etiketa.json') or lname.endswith('.etikete.json') or 'labelW' in inp or 'etiket' in lname:
        isEtikete = True
    elif src == 'darko-tenovis' or lname.endswith('.tenovis.json') or 'tenovis' in lname or '_230' in lname or '_240' in lname:
        isTenovis = True
    else:
        isPola = True

    cust = str(data.get('customer') or inp.get('customer') or '').strip()
    qNum = str(data.get('quoteNum') or inp.get('quote_num') or '').strip()
    mtime = int(os.path.getmtime(fpath) * 1000)
    dateStr = str(data.get('date') or '')
    
    sf = ''
    if inp.get('sourceW') and inp.get('sourceH'):
        preset = (" " + str(inp.get('sourcePreset'))) if inp.get('sourcePreset') and inp.get('sourcePreset') != 'custom' else ''
        sf = f"Osnovni format:{preset} ({inp.get('sourceW')}x{inp.get('sourceH')})"

    totalStr = '-'
    if data.get('results') and data['results'].get('total'):
        totalStr = str(data['results']['total'])

    projects.append({
        'name': fname,
        'customer': cust,
        'quoteNum': qNum,
        'date': dateStr,
        'total': totalStr,
        'sourceFormat': sf.strip(),
        'isPola': isPola,
        'isBlok': isBlok,
        'isBrosura': isBrosura,
        'isKuverte': isKuverte,
        'isEtikete': isEtikete,
        'isTenovis': isTenovis,
        'mtime': mtime
    })

projects.sort(key=lambda x: x.get('mtime', 0), reverse=True)

counts = {
    'pola': sum(1 for p in projects if p['isPola']),
    'blok': sum(1 for p in projects if p['isBlok']),
    'brosura': sum(1 for p in projects if p['isBrosura']),
    'kuverte': sum(1 for p in projects if p['isKuverte']),
    'etikete': sum(1 for p in projects if p['isEtikete']),
    'tenovis': sum(1 for p in projects if p['isTenovis'])
}
print(f"Total indexed projects: {len(projects)}")
print(f"Counts: {counts}")

indexData = {
    'version': 1,
    'updatedAt': '2026-10-26T12:45:00.000Z',
    'projects': projects
}

with open(r'S:\PONUDBE TEST\index_projektov.json', 'w', encoding='utf-8') as f:
    json.dump(indexData, f, ensure_ascii=False, indent=2)

print("Successfully written S:\\PONUDBE TEST\\index_projektov.json!")
