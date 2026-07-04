import sys
import openpyxl
from openpyxl.formatting.rule import FormulaRule
from openpyxl.styles import Font

try:
    file_path = "d:\\Git\\KalkulacijaPetric\\Zaloga_Avtomatizirana.xlsx"
    wb = openpyxl.load_workbook(file_path)
    ws = wb['TRENUTNA ZALOGA']

    # Remove all existing conditional formatting rules to avoid duplicates
    keys = list(ws.conditional_formatting._cf_rules.keys())
    for key in keys:
        del ws.conditional_formatting._cf_rules[key]

    # Create new style: Red bold text, no background fill
    red_font = Font(color='FF0000', bold=True)

    # Pravilo: Če celica A (šifra) ni prazna IN je zaloga (I) manjša od 100
    rule = FormulaRule(formula=['AND(A2<>"", I2<100)'], stopIfTrue=True, font=red_font)

    # Dodamo pogojno oblikovanje za stolpec I (od vrstice 2 do 1000)
    ws.conditional_formatting.add('I2:I1000', rule)

    wb.save(file_path)
    print("Successfully updated conditional formatting (red text, white background)!")
except Exception as e:
    print("Error:", e)
