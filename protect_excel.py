import openpyxl

try:
    file_path = "c:\\DARKO\\KalkulacijaPetric\\Zaloga_Avtomatizirana.xlsx"
    wb = openpyxl.load_workbook(file_path)
    ws = wb['TRENUTNA ZALOGA']

    # Nastavimo filter čez celotno tabelo
    ws.auto_filter.ref = ws.dimensions

    # Vključimo zaščito lista, ampak dovolimo filtriranje in sortiranje
    ws.protection.sheet = True
    ws.protection.autoFilter = False
    ws.protection.sort = False
    
    wb.save(file_path)
    print("Successfully protected 'TRENUTNA ZALOGA' and enabled filters.")
except Exception as e:
    print("Error:", e)
