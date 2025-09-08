@echo off
REM Script to run both Spring Boot backend and React frontend

REM Start Spring Boot backend
start "Backend" cmd /k "cd backend\buildsmart && mvnw spring-boot:run"

REM Start React frontend
start "Frontend" cmd /k "npm start"
