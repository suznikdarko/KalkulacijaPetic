import json

# Load the project JSON
with open('BLOK_100_x_100.blok.json', 'r', encoding='utf-8') as f:
    proj = json.load(f)

inp = proj['inputs']
print("Inputs:")
print(f"pPrice: {inp.get('pPrice')}")
print(f"pUnit: {inp.get('pUnit')}")
print(f"pWeight: {inp.get('pWeight')}")
print(f"pActive: {inp.get('pActive')}")
print(f"pSupplyW: {inp.get('pSupplyW')}")
print(f"pSupplyH: {inp.get('pSupplyH')}")
print(f"pWaste: {inp.get('pWaste')}")
print(f"leaves: {inp.get('leaves')}")
print(f"quantity: {inp.get('quantity')}")

# Mimic JS parsing
pPrice = float(inp.get('pPrice') or 0)
pUnit = inp.get('pUnit')
pWeight = float(inp.get('pWeight') or 135) # fallback to 135
pActive = inp.get('pActive') == True or inp.get('pActive') == 'true'
pSupplyW = float(inp.get('pSupplyW') or 0)
pSupplyH = float(inp.get('pSupplyH') or 0)
pWaste = int(inp.get('pWaste') or 0)
leaves = int(inp.get('leaves') or 1)
quantity = float(inp.get('quantity').replace('.', '').replace(',', '.') if isinstance(inp.get('quantity'), str) else inp.get('quantity'))

# Leaves size
# Let's say printing sheet format is drawW x drawH
# For BLOK 100 x 100:
# bestSheet is 900x640, count is 24, yield is 2 (so drawW = 638, drawH = 448)
drawWL = 638.0
drawHL = 448.0

targetCount = 0
bestLayout_count = 24
finalCountLeaves = targetCount if targetCount > 0 else bestLayout_count

# sheetsNeededLeaves = Math.ceil((q * leavesPerBlock) / finalCountLeaves)
sheetsNeededLeaves = int(((quantity * leaves) + finalCountLeaves - 1) // finalCountLeaves)
print(f"sheetsNeededLeaves: {sheetsNeededLeaves}")

wasteL = 540 # hardcoded from json wasteL or pWaste
totalSheetsNeededLeaves = sheetsNeededLeaves + wasteL
print(f"totalSheetsNeededLeaves: {totalSheetsNeededLeaves}")

pYield = 0
if drawWL > 0 and drawHL > 0:
    pYield1 = int(pSupplyW // drawWL) * int(pSupplyH // drawHL)
    pYield2 = int(pSupplyW // drawHL) * int(pSupplyH // drawWL)
    pYield = max(pYield1, pYield2) or 1
    pParentSheetsNeeded = int((totalSheetsNeededLeaves + pYield - 1) // pYield)
    print(f"pYield: {pYield}")
    print(f"pParentSheetsNeeded: {pParentSheetsNeeded}")

paperCost = 0
if pActive:
    if drawWL > 0 and drawHL > 0:
        if pUnit == "1":
            paperCost = pParentSheetsNeeded * pPrice
        elif pUnit == "1000":
            paperCost = (pParentSheetsNeeded / 1000.0) * pPrice
        elif pUnit == "kg":
            areaM2 = (pSupplyW / 1000.0) * (pSupplyH / 1000.0)
            sheetKg = areaM2 * (pWeight / 1000.0)
            paperCost = pParentSheetsNeeded * sheetKg * pPrice
        elif pUnit == "ton":
            areaM2 = (pSupplyW / 1000.0) * (pSupplyH / 1000.0)
            sheetKg = areaM2 * (pWeight / 1000.0)
            totalKg = pParentSheetsNeeded * sheetKg
            paperCost = (totalKg / 1000.0) * pPrice

print(f"Calculated paperCost: {paperCost:.2f} €")
