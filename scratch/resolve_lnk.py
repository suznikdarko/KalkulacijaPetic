import subprocess

ps_command = """
$sh = New-Object -ComObject WScript.Shell
$lnk1 = $sh.CreateShortcut('C:\\Users\\Prodaja\\Desktop\\PREGLED ZALOGE (Samo za branje).lnk')
write-host "Desktop PREGLED Target:" $lnk1.TargetPath
write-host "Desktop PREGLED Args:" $lnk1.Arguments

if (test-path '\\\\server-2012\\SIMON\\PREGLED ZALOGE (Samo za branje).lnk') {
    $lnk2 = $sh.CreateShortcut('\\\\server-2012\\SIMON\\PREGLED ZALOGE (Samo za branje).lnk')
    write-host "Server PREGLED Target:" $lnk2.TargetPath
    write-host "Server PREGLED Args:" $lnk2.Arguments
}
"""

res = subprocess.run(["powershell", "-Command", ps_command], capture_output=True, text=True)
print(res.stdout)
print(res.stderr)
