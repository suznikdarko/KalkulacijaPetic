def get_paper_family(sw, sh):
    max_s = max(sw, sh)
    min_s = min(sw, sh)
    if (950 <= max_s <= 1080 and 660 <= min_s <= 740) or (660 <= max_s <= 740 and 460 <= min_s <= 540):
        return 'B'
    if (870 <= max_s <= 940 and 610 <= min_s <= 670) or (610 <= max_s <= 670 and 420 <= min_s <= 470):
        return 'N'
    if (800 <= max_s <= 870 and 570 <= min_s <= 610) or (570 <= max_s <= 610 and 400 <= min_s <= 430):
        return 'A'
    return 'OTHER'

def is_sheet_family_matching(raw_family, sheet_family, m_type=''):
    if sheet_family == 'DIGITAL':
        return m_type == 'digital'
    if raw_family == 'OTHER':
        return True
    return raw_family == sheet_family

sheets = [
    {"name": "B1", "w": 1000, "h": 700, "family": "B"},
    {"name": "A1", "w": 841, "h": 594, "family": "A"},
    {"name": "900x640", "w": 900, "h": 640, "family": "N"},
    {"name": "B2", "w": 698, "h": 498, "family": "B"},
    {"name": "640x450", "w": 640, "h": 450, "family": "N"},
    {"name": "6 iz B1", "w": 349, "h": 332, "family": "B"},
    {"name": "638x448", "w": 638, "h": 448, "family": "B"},
    {"name": "B3", "w": 498, "h": 348, "family": "B"},
    {"name": "Riba", "w": 698, "h": 332, "family": "B"},
    {"name": "640x300", "w": 640, "h": 300, "family": "N"},
    {"name": "498x232", "w": 498, "h": 232, "family": "B"},
    {"name": "B4", "w": 348, "h": 248, "family": "B"},
    {"name": "A2", "w": 592, "h": 418, "family": "A"},
    {"name": "A3", "w": 418, "h": 295, "family": "A"},
    {"name": "SRA3", "w": 448, "h": 318, "family": "A"},
    {"name": "A4", "w": 295, "h": 208, "family": "A"},
    {"name": "318x298", "w": 318, "h": 298, "family": "N"},
    {"name": "318x223", "w": 318, "h": 223, "family": "N"},
    {"name": "Digital (480x320)", "w": 480, "h": 320, "family": "DIGITAL"}
]

# Test machine S4 (maxW: 518, maxH: 348)
sw, sh = 1000, 700
family = get_paper_family(sw, sh)
s4_maxW, s4_maxH = 518, 348

allowed_s4 = [
    s["name"] for s in sheets 
    if is_sheet_family_matching(family, s["family"], m_type='S4')
    and ((sw >= s["w"] and sh >= s["h"]) or (sw >= s["h"] and sh >= s["w"]))
    and ((s["w"] <= s4_maxW and s["h"] <= s4_maxH) or (s["h"] <= s4_maxW and s["w"] <= s4_maxH))
]

print(f"Raw paper {sw}x{sh}, Machine S4 -> Allowed print sheets: {', '.join(allowed_s4)}")
