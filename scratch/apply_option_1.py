import subprocess

ps_command = """
$file = '\\\\server-2012\\SIMON\\ZALOGA MATERIALA 2026.xlsx'
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
    Write-Host "Opening workbook..."
    # Open(Filename, UpdateLinks, ReadOnly, Format, Password, WriteResPassword, IgnoreReadOnlyRecommended)
    $wb = $excel.Workbooks.Open($file, 0, $false, 5, $null, "Simon", $true)
    
    Write-Host "Disabling ReadOnlyRecommended..."
    # Set ReadOnlyRecommended to false
    $wb.ReadOnlyRecommended = $false
    
    # Save the file. Excel's SaveAs signature:
    # SaveAs(Filename, FileFormat, Password, WriteResPassword, ReadOnlyRecommended, CreateBackup, AccessMode)
    # xlNoChange = 1
    Write-Host "Saving workbook with password 'Simon' and ReadOnlyRecommended = false..."
    $wb.SaveAs($file, $wb.FileFormat, $null, "Simon", $false, $false, 1)
    
    Write-Host "Successfully updated Excel file protection!"
    $wb.Close($false)
} catch {
    Write-Host "Error occurred: $_"
}

$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
"""

res = subprocess.run(["powershell", "-Command", ps_command], capture_output=True, text=True, encoding='utf-8')
print("STDOUT:")
print(res.stdout)
print("STDERR:")
print(res.stderr)
