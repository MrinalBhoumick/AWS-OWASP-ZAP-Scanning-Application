# API Testing Script
# Tests all endpoints of the deployed application

$ALB_URL = "http://enterprise-alb-1380851139.us-west-2.elb.amazonaws.com"

Write-Host "========================================" -ForegroundColor Green
Write-Host "AWS Enterprise Application - API Tests" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Test 1: Health Check
Write-Host "1. Testing Health Check..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$ALB_URL/api/health" -UseBasicParsing
    $health = $response.Content | ConvertFrom-Json
    Write-Host "   Status: $($response.StatusCode) - $($health.status)" -ForegroundColor Green
    Write-Host "   Service: $($health.service) v$($health.version)" -ForegroundColor Yellow
} catch {
    Write-Host "   FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Frontend
Write-Host "2. Testing Frontend..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$ALB_URL" -UseBasicParsing
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Content Length: $($response.Content.Length) bytes" -ForegroundColor Yellow
} catch {
    Write-Host "   FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: User Registration
Write-Host "3. Testing User Registration..." -ForegroundColor Cyan
$testEmail = "test$(Get-Random)@example.com"
$testPassword = "SecurePass123!"
try {
    $body = @{email=$testEmail; password=$testPassword} | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "$ALB_URL/api/register" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    $regData = $response.Content | ConvertFrom-Json
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   User ID: $($regData.id), Email: $($regData.email)" -ForegroundColor Yellow
    Write-Host "   Token: $($regData.token.Substring(0,30))..." -ForegroundColor Yellow
} catch {
    Write-Host "   FAILED: $($_.ErrorDetails.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: User Login
Write-Host "4. Testing User Login..." -ForegroundColor Cyan
try {
    $body = @{email=$testEmail; password=$testPassword} | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "$ALB_URL/api/login" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    $loginData = $response.Content | ConvertFrom-Json
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Message: $($loginData.message)" -ForegroundColor Yellow
    Write-Host "   Token: $($loginData.token.Substring(0,30))..." -ForegroundColor Yellow
    $token = $loginData.token
} catch {
    Write-Host "   FAILED: $($_.ErrorDetails.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 5: Protected Endpoint (Get Users)
Write-Host "5. Testing Protected Endpoint (JWT)..." -ForegroundColor Cyan
try {
    $headers = @{Authorization = "Bearer $token"}
    $response = Invoke-WebRequest -Uri "$ALB_URL/api/users" -Headers $headers -UseBasicParsing
    $users = $response.Content | ConvertFrom-Json
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Total Users: $($users.Count)" -ForegroundColor Yellow
} catch {
    Write-Host "   FAILED: $($_.ErrorDetails.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 6: Invalid Login
Write-Host "6. Testing Invalid Login (Security)..." -ForegroundColor Cyan
try {
    $body = @{email=$testEmail; password="WrongPassword123!"} | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "$ALB_URL/api/login" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
    Write-Host "   UNEXPECTED: Should have failed!" -ForegroundColor Red
} catch {
    Write-Host "   Status: $($_.Exception.Response.StatusCode.value__) (Expected)" -ForegroundColor Green
    Write-Host "   Error: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "All Tests Completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
