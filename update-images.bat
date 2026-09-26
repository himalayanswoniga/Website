@echo off
cd /d "%~dp0"
echo Making web-sized copies of the photos in the products folder...
echo.
python optimize-images.py
echo.
pause
