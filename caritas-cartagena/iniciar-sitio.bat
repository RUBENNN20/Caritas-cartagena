@echo off
setlocal
cd /d "%~dp0"
echo Iniciando servidor de Caritas Cartagena...
echo Sitio publico: http://127.0.0.1:8000/
echo Administrador: http://127.0.0.1:8000/login.html
echo Mantenga esta ventana abierta. Para detener, presione Ctrl+C.
echo.
start "" "http://127.0.0.1:8000/"
where py >nul 2>nul
if %errorlevel%==0 (
  py server.py
) else (
  python server.py
)
if errorlevel 1 (
  echo No se pudo iniciar. Revise si Python esta instalado y el puerto 8000 esta libre.
  pause
)
