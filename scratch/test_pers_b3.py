def optimize_layout(sheetW, sheetH, itemW, itemH, gripper=10, isPers=False, mType='S4'):
    itemW_bleed = itemW + 4
    itemH_bleed = itemH + 4
    isB2Sheet = (sheetW == 698 and sheetH == 498) or (sheetW == 498 and sheetH == 698)
    maxSheetDim = max(sheetW, sheetH)
    
    # NEW Logic for cutFactor:
    cutFactor = 2 if (isPers and (isB2Sheet or maxSheetDim >= 600 or mType == 'S8')) else 1
    
    cutAxis = 'W' if sheetW >= sheetH else 'H'
    
    baseConfigs = [
        {'iw': itemW_bleed, 'ih': itemH_bleed, 'edge': 'H'},
        {'iw': itemH_bleed, 'ih': itemW_bleed, 'edge': 'H'}
    ]
    
    best_count = 0
    for cfg in baseConfigs:
        usableW = sheetW - gripper if cfg['edge'] == 'W' else sheetW
        usableH = sheetH - gripper if cfg['edge'] == 'H' else sheetH
        
        cols = usableW // cfg['iw']
        rows = usableH // cfg['ih']
        
        if cutFactor == 2:
            if isB2Sheet:
                halfW = 320 if cutAxis == 'W' else 480
                halfH = 480 if cutAxis == 'W' else 320
                halfUsableW = halfW - gripper if cfg['edge'] == 'W' else halfW
                halfUsableH = halfH - gripper if cfg['edge'] == 'H' else halfH
                halfCols = halfUsableW // cfg['iw']
                halfRows = halfUsableH // cfg['ih']
                cols = halfCols * 2 if cutAxis == 'W' else halfCols
                rows = halfRows * 2 if cutAxis == 'H' else halfRows
            else:
                if cutAxis == 'W':
                    cols = (cols // 2) * 2
                else:
                    rows = (rows // 2) * 2
        count = cols * rows
        if count > best_count:
            best_count = count
            
    return best_count

print("B3 Sheet (498x348), 150x150 items, S4 machine:")
print("Personalization OFF:", optimize_layout(498, 348, 150, 150, isPers=False))
print("Personalization ON:", optimize_layout(498, 348, 150, 150, isPers=True))

print("\nB2 Sheet (698x498), 150x150 items, S4 machine:")
print("Personalization OFF:", optimize_layout(698, 498, 150, 150, isPers=False))
print("Personalization ON:", optimize_layout(698, 498, 150, 150, isPers=True))
