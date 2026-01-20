@echo off
set API_URL=http://localhost:3000

echo 🧪 Testing Enterprise API
echo =========================
echo.

echo 1️⃣ Testing Health Check...
curl -s %API_URL%/health
echo.
echo.

echo 2️⃣ Registering new user...
curl -s -X POST %API_URL%/register -H "Content-Type: application/json" -d "{\"email\":\"testuser@example.com\",\"password\":\"test123\"}"
echo.
echo.

echo 3️⃣ Logging in...
curl -s -X POST %API_URL%/login -H "Content-Type: application/json" -d "{\"email\":\"testuser@example.com\",\"password\":\"test123\"}"
echo.
echo.

echo 4️⃣ Getting all users...
curl -s %API_URL%/users
echo.
echo.

echo ✅ All tests completed!
pause
