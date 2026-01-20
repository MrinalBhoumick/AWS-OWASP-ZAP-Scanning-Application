@echo off
echo 🚀 Enterprise Application - Quick Start
echo ======================================
echo.

REM Check if docker-compose is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ docker-compose not found. Please install Docker Desktop.
    exit /b 1
)

echo ✅ Docker Compose found
echo.
echo Starting all services...
echo - PostgreSQL Database
echo - Backend API (Node.js)
echo - Frontend (React)
echo.

REM Start services
docker-compose up --build -d

echo.
echo ⏳ Waiting for services to start...
timeout /t 10 /nobreak >nul

echo.
echo ✅ Application is ready!
echo.
echo 📱 Access your application:
echo    Frontend:  http://localhost:5173
echo    Backend:   http://localhost:3000
echo    Database:  localhost:5432
echo.
echo 🧪 Test the API:
echo    curl http://localhost:3000/health
echo.
echo 📊 View logs:
echo    docker-compose logs -f
echo.
echo 🛑 Stop services:
echo    docker-compose down
echo.
echo Happy coding! 🎉
pause
