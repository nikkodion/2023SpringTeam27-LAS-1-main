@echo off
if not defined in_subprocess (cmd /k set in_subprocess=y ^& %0 %*) & exit )
for /f "delims== tokens=1,2" %%G in (param.txt) do set %%G=%%H
echo answered="%answered%"
goto :DOES_PYTHON_EXIST

:DOES_PYTHON_EXIST
python -V | find /v "Python" >NUL 2>NUL && (goto :PYTHON_DOES_NOT_EXIST)
python -V | find "Python"    >NUL 2>NUL && (goto :DOES_NODE_EXIST)
goto :EOF
:PYTHON_DOES_NOT_EXIST
echo Python is not installed on your system.
echo Now opening the download URL.
start "" "https://www.python.org/downloads/windows/"
goto :EOF


:DOES_NODE_EXIST
node -v | find /v "v" >NUL 2>NUL && (goto :NODE_DOES_NOT_EXIST)
node -v | find "v"    >NUL 2>NUL && (goto :DOES_PSQL_EXIST)
goto :EOF
:NODE_DOES_NOT_EXIST
echo Node is not installed on your system.
echo Now opening the download URL.
start "" "https://nodejs.org/en/download/"
goto :EOF
:DOES_PSQL_EXIST
psql -V | find /v "PostgreSQL" >NUL 2>NUL && (goto :PSQL_DOES_NOT_EXIST)
psql -V | find "PostgreSQL"    >NUL 2>NUL && (goto :DOES_DATABASE_EXIST)
goto :EOF
:PSQL_DOES_NOT_EXIST
echo PostgreSQL is not installed on your system.
echo Now opening the download URL.
start "" "https://www.enterprisedb.com/downloads/postgres-postgresql-downloads/"


:DOES_DATABASE_EXIST

IF "%answered%"=="" (set "answered=0")

if %answered%==1 (
    goto :CHECK_DB
) else (
    echo ANSWERS WILL BE SAVED AND THE QUESTION WILL NOT BE ASKED AGAIN, TO CHANGE ANSWER SET answered=0 IN param.txt
    set /p remote=Is the database remote(y/n)
    set "answered=1"
    echo answered=%answered% > param.txt
    echo remote=%remote% >> param.txt

    :CHECK_DB
    if "%remote%" == "y" (
        goto :EXECUTE_SCRIPT
    )
    for /f %%i in ('psql -U postgres -XtAc  "SELECT 1 FROM pg_database WHERE datname='dataprioritization'"') do set RESULT=%%i
    
    if "%result%" == "" (
        echo database does not exist
        echo creating database
        psql -U postgres -c "CREATE DATABASE dataprioritization"
        psql -U postgres -d dataprioritization -a -f "init.sql"
        echo database created
        goto :EXECUTE_SCRIPT
    ) else (
        echo verified database exists
        goto :EXECUTE_SCRIPT
    )
)


:EXECUTE_SCRIPT
cd "run scripts"
start cmd /k "call runbackend"
call "runfrontend"

