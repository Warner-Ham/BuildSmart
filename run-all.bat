@echo off
REM Script to start Apache, MySQL, Spring Boot backend, and React frontend.
REM All services will be closed when this terminal is closed.
REM This script takes care of starting and stopping all services in the correct order with appropriate delays.
REM The paths to XAMPP and project directories should be adjusted as necessary.
REM Also, the script takes around 40 seconds to complete all startups.

echo This script will start Apache, MySQL, the Spring Boot backend, and the React frontend.
echo Do not close this terminal until the startup is complete.

REM Check if XAMPP Control Panel is running
@REM tasklist /FI "IMAGENAME eq xampp-control.exe" | find /I "xampp-control.exe" > nul
@REM if errorlevel 1 (
@REM     echo Starting XAMPP Control Panel...
@REM     start "XAMPP Control" "D:\xampp\xampp-control.exe"
@REM     echo Waiting 4 seconds for XAMPP Control Panel to open...
@REM     timeout /t 4 /nobreak > nul
@REM ) else (
@REM     echo XAMPP Control Panel is already running.
@REM     timeout /t 1 /nobreak > nul
@REM )

@REM echo Starting Apache (XAMPP)...
@REM start /min "Apache" "D:\xampp\apache_start"
@REM echo Waiting 5 seconds for Apache to initialize...
@REM timeout /t 5 /nobreak > nul

@REM echo Starting MySQL (XAMPP)...
@REM start /min "MySQL" "D:\xampp\mysql_start"
@REM echo Waiting 3 seconds for MySQL to initialize...
@REM timeout /t 3 /nobreak > nul

echo Starting Spring Boot backend...
start /min "Backend" cmd /k "cd backend\buildsmart && mvnw spring-boot:run"
echo Waiting 18 seconds for backend to start...
timeout /t 18 /nobreak > nul

echo Starting React frontend...
start /min "Frontend" cmd /k "npm start"
echo Waiting 22 seconds for frontend to start...
timeout /t 22 /nobreak > nul
echo All services started...

timeout /t 2 /nobreak > nul
echo Press any key to shut down all services...
pause > nul

echo Closing React frontend...
taskkill /fi "WINDOWTITLE eq Frontend" /f > nul
timeout /t 2 /nobreak > nul

echo Closing Spring Boot backend...
taskkill /fi "WINDOWTITLE eq Backend" /f > nul
timeout /t 2 /nobreak > nul

echo Stopping MySQL (XAMPP)...
start /min "MySQL_Stop" "D:\xampp\mysql_stop"
timeout /t 4 /nobreak > nul
pause > nul
echo Stopping Apache (XAMPP)...
start /min "Apache_Stop" "D:\xampp\apache_stop"
timeout /t 4 /nobreak > nul

echo All services have been shut down...