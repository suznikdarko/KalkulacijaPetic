import sys
import openpyxl

try:
    file_path = "d:\\Git\\KalkulacijaPetric\\Zaloga_Avtomatizirana.xlsx"
    wb = openpyxl.load_workbook(file_path)
    
    ws_odpis = wb['ODPIS']
    
    # We want to keep the header (row 1) and delete all other rows.
    max_row = ws_odpis.max_row
    if max_row > 1:
        # delete_rows(idx, amount)
        ws_odpis.delete_rows(2, max_row - 1)
        
    wb.save(file_path)
    print("Successfully cleared ODPIS sheet!")
except Exception as e:
    print("Error:", e)
