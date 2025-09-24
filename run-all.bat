@echo off
REM Script to run both Spring Boot backend and React frontend

@REM REM Initialize MySQL database (requires mysql client, XAMPP must be running)
@REM "D:\xampp\mysql\bin\mysql.exe" -u root < backend\buildsmart\src\main\resources\create_ceb_db.sql

REM Start Spring Boot backend (ensure application.properties is set for SQL connection)
start "Backend" cmd /k "cd backend\buildsmart && mvnw spring-boot:run"

REM Wait 10 seconds for backend to start
timeout /t 15 /nobreak > nul

REM Start React frontend
start "Frontend" cmd /k "npm start"
