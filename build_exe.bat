@echo off
cd /d "%~dp0"
echo =======================================================
echo   GRADNJA PetricKalkulacije.exe (PyInstaller)
echo =======================================================
python -m PyInstaller --noconfirm --onefile --noconsole --name "PetricKalkulacije" --distpath "." petric_launcher.py
if errorlevel 1 (
    echo.
    echo NAPAKA pri gradnji .exe datoteke!
    pause
    exit /b 1
)
echo.
echo USPESNO! Datoteka PetricKalkulacije.exe je pripravljena v tej mapi.
pause
