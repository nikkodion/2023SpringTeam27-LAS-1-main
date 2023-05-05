
@echo off
cd ..
goto :DOES_PYTHON_EXIST

:DOES_PYTHON_EXIST
python -V | find /v "Python" >NUL 2>NUL && (goto :PYTHON_DOES_NOT_EXIST)
python -V | find "Python"    >NUL 2>NUL && (goto :PYTHON_DOES_EXIST)
goto :EOF
:PYTHON_DOES_NOT_EXIST
echo Python is not installed on your system.
echo Now opening the download URL.
start "" "https://www.python.org/downloads/windows/"
goto :EOF

:PYTHON_DOES_EXIST
echo verified python installation
if exist env\scripts\activate.bat (
    echo verified environment creation
    call env\scripts\activate.bat
    pip install -r requirements.txt
) else (
    echo environment doesnt exist
    echo creating environment
    python -m venv env
    call env\scripts\activate.bat
    pip install -r requirements.txt
)
cd backend
python manage.py runserver

