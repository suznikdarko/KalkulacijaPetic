import openpyxl

file_path = r"\\server-2012\SIMON\ZALOGA MATERIALA 2026.xlsx"
wb = openpyxl.load_workbook(file_path)

if 'AVGUST 26' in wb.sheetnames:
    ws = wb['AVGUST 26']
    print("Column widths in AVGUST 26:")
    for col in ['A', 'B', 'C', 'D', 'E', 'F']:
        dim = ws.column_dimensions[col]
        print(f"  Col {col}: width={dim.width}, customWidth={getattr(dim, 'customWidth', 'not exist')}")
else:
    print("AVGUST 26 not found.")
