import subprocess

ps_command = """
$file = '\\\\server-2012\\SIMON\\ZALOGA MATERIALA 2026.xlsx'
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
    # 1. Try opening normally with NO password parameters
    $wb = $excel.Workbooks.Open($file, 0, $false)
    Write-Host "Opened normally without password parameters:"
    Write-Host "  ReadOnly:" $wb.ReadOnly
    Write-Host "  ReadOnlyRecommended:" $wb.ReadOnlyRecommended
    Write-Host "  WriteReserved:" $wb.WriteReserved
    Write-Host "  WriteReservedBy:" $wb.WriteReservedBy
    $wb.Close($false)
    
    Write-Host "`nOpening with WriteResPassword='Simon' to confirm write access:"
    $wb2 = $excel.Workbooks.Open($file, 0, $false, 5, $null, "Simon")
    Write-Host "  ReadOnly:" $wb2.ReadOnly
    $wb2.Close($false)
} catch {
    Write-Host "Error: $_"
}

$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
"""

res = subprocess.run(["powershell", "-Command", ps_command], capture_output=True, text=True, encoding='utf-8')
print("STDOUT:")
print(res.stdout)
print("STDERR:")
print(res.stderr)
