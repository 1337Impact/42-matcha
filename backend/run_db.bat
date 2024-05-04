@echo off
SETLOCAL

REM Load environment variables from .env file
for /f "delims=" %%a in (.env) do (
    set "%%a"
)

REM Set the path to include PostgreSQL binary directory first
SET PATH=C:\Program Files\PostgreSQL\16\bin;%PATH%

REM Use variables from .env
SET PGDATA=%PGDATA%
SET PGDATABASE=%PGDATABASE%
SET PGUSER=%PGUSER%
SET PGPORT=%PGPORT%
SET PGLOCALEDIR=%PGLOCALEDIR%

REM Check parameters
IF "%1"=="start" (
    echo Starting PostgreSQL...
    pg_ctl start -l logfile.txt
) ELSE IF "%1"=="stop" (
    echo Stopping PostgreSQL...
    pg_ctl stop
) ELSE (
    echo Invalid parameter. Use "start" or "stop".
)

ENDLOCAL
