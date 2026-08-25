def isSheetFamilyMatching(rawFamily, sheetFamily, mType, sheetName, isPers):
    if sheetFamily == 'DIGITAL':
        return mType == 'digital'
    if rawFamily == 'OTHER':
        return True
    if rawFamily == 'N':
        return sheetFamily == 'N' or sheetName in ['638x448', 'SRA3']
    return rawFamily == sheetFamily

def optimizeLayout(sheetW, sheetH, itemW, itemH, gripper, isPers, mType):
    isB2Sheet = (sheetW == 698 and sheetH == 498) or (sheetW == 498 and sheetH == 698)
    maxSheetDim = max(sheetW, sheetH)
    cutFactor = 2 if (isPers and (isB2Sheet or maxSheetDim >= 600 or mType == 'S8')) else 1
    cutAxis = 'W' if sheetW >= sheetH else 'H'
    best = None
    baseConfigs = [
        {'iw': itemW, 'ih': itemH, 'rot': False, 'edge': 'H'},
        {'iw': itemH, 'ih': itemW, 'rot': True, 'edge': 'H'}
    ]
    for cfg in baseConfigs:
        usableW = sheetW - gripper if cfg['edge'] == 'W' else sheetW
        usableH = sheetH - gripper if cfg['edge'] == 'H' else sheetH
        if usableW <= 0 or usableH <= 0:
            continue
        cols = int(usableW // cfg['iw'])
        rows = int(usableH // cfg['ih'])
        if cutFactor == 2:
            if isB2Sheet:
                halfW = 318 if cutAxis == 'W' else 478
                halfH = 478 if cutAxis == 'W' else 318
                halfUsableW = halfW - gripper if cfg['edge'] == 'W' else halfW
                halfUsableH = halfH - gripper if cfg['edge'] == 'H' else halfH
                halfCols = int(halfUsableW // cfg['iw'])
                halfRows = int(halfUsableH // cfg['ih'])
                cols = halfCols * 2 if cutAxis == 'W' else halfCols
                rows = halfRows * 2 if cutAxis == 'H' else halfRows
            else:
                if cutAxis == 'W':
                    cols = int(cols // 2) * 2
                else:
                    rows = int(rows // 2) * 2
        count = cols * rows
        if count > 0 and (best is None or count > best['count']):
            best = {'count': count, 'cols': cols, 'rows': rows}
    return best

sheets = [
    {"name": "B1", "w": 1000, "h": 700, "family": "B"},
    {"name": "B2", "w": 698, "h": 498, "family": "B"},
    {"name": "B3", "w": 498, "h": 348, "family": "B"},
    {"name": "Digital (478x318)", "w": 478, "h": 318, "family": "DIGITAL"}
]

sw, sh = 1000, 700 # source paper B1
itemW, itemH = 164, 249 # 160x245 + 4mm bleed
g = 10 # gripper

def run_test_mtype(mType, profile_maxW, profile_maxH):
    print(f"================ MACHINE: {mType} ================")
    for isPers in [False, True]:
        print(f"--- isPers={isPers} ---")
        bestSheet = None
        bestLayout = None
        bestScore = -1
        for s in sheets:
            rawFamily = 'B'
            familyMatches = isSheetFamilyMatching(rawFamily, s['family'], mType, s['name'], isPers)
            fitsSource = (sw >= s['w'] and sh >= s['h']) or (sw >= s['h'] and sh >= s['w'])
            fitsMachine = (s['w'] <= profile_maxW and s['h'] <= profile_maxH) or (s['h'] <= profile_maxW and s['w'] <= profile_maxH)
            
            if not (fitsSource and fitsMachine and familyMatches):
                continue
                
            layout = optimizeLayout(s['w'], s['h'], itemW, itemH, g, isPers, mType)
            cnt = layout['count'] if layout else 0
            
            y1 = (sw // s['w']) * (sh // s['h'])
            y2 = (sw // s['h']) * (sh // s['w'])
            sYield = max(y1, y2, 1)
            
            isStandard = s['family'] in ['B', 'A', 'N', 'DIGITAL']
            standardBonusNormal = 500 if isStandard else 0
            persBonus = 5000 if (isPers and mType == 'digital' and s['family'] == 'DIGITAL') else 0
            sheetArea = s['w'] * s['h']
            score = (cnt * 1000000) + (sYield * 1000) + (sheetArea / 1000.0) + standardBonusNormal + persBonus
            
            print(f"  Sheet {s['name']}: count={cnt}, sYield={sYield}, score={score}")
            if score > bestScore:
                bestScore = score
                bestSheet = s
                bestLayout = layout
        print(f"=> BEST FOR {mType} (isPers={isPers}): Sheet={bestSheet['name'] if bestSheet else None}, count={bestLayout['count'] if bestLayout else 0}")

run_test_mtype('S4', 518, 348)
run_test_mtype('S8', 698, 498)
