@echo off
title Save Server (Port 8095) - Petric Kalkulacije
cd /d "%~dp0"
echo =======================================================
echo   ZAGANJAM SHRANJEVALNI STREZNIK (PORT 8095)
echo =======================================================
echo.
python save_server.py
if errorlevel 1 (
    echo.
    echo Poskusam z ukazom python3...
    python3 save_server.py
)
if errorlevel 1 (
    echo.
    echo OPOZORILO: Python ni namescen ali ni dodan v PATH!
    echo Prosimo namestite Python iz https://www.python.org/
    pause
)

