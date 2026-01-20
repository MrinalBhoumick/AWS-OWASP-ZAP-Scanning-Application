# Complete AWS Deployment Script
# This script deploys infrastructure and application in one go

Write-Host "AWS Enterprise Application Deployment" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

$ErrorActionPreference = "Stop"

# Configuration
$REGION = "us-west-2"
$DB_PASSWORD = "EnterpriseApp2026!"

Write-Host "Step 1: Deploying Infrastructure..." -ForegroundColor Cyan
Set-Location terraform

# Create tfvars if not exists
if (!(Test-Path "terraform.tfvars")) {
    @"
db_user = "appuser"
db_pass = "$DB_PASSWORD"
region  = "$REGION"
"@ | Out-File -FilePath "terraform.tfvars" -Encoding UTF8
}

# Deploy infrastructure
terraform init
terraform apply -auto-approve

if ($LASTEXITCODE -ne 0) {
    Write-Host "Infrastructure deployment failed" -ForegroundColor Red
    exit 1
}

$ALB_URL = (terraform output -raw alb_url)
$RDS_HOST = (terraform output -raw rds_address)
Write-Host "Infrastructure deployed successfully" -ForegroundColor Green
Write-Host "   ALB URL: $ALB_URL" -ForegroundColor Yellow
Write-Host "   RDS Host: $RDS_HOST" -ForegroundColor Yellow
Write-Host ""

Set-Location ..

Write-Host "Step 2: Building and Pushing Docker Images..." -ForegroundColor Cyan

$ACCOUNT_ID = (aws sts get-caller-identity --query Account --output text)
$ECR_AUTH = "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"

# Create ECR repositories
aws ecr describe-repositories --repository-names auth --region $REGION 2>$null
if ($LASTEXITCODE -ne 0) {
    aws ecr create-repository --repository-name auth --region $REGION | Out-Null
}

aws ecr describe-repositories --repository-names frontend --region $REGION 2>$null
if ($LASTEXITCODE -ne 0) {
    aws ecr create-repository --repository-name frontend --region $REGION | Out-Null
}

# Login to ECR
aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ECR_AUTH

# Build and push backend
Write-Host "  Building backend..." -ForegroundColor Yellow
Set-Location services\auth-service
npm install --production
docker build -t auth:latest .
docker tag auth:latest $ECR_AUTH/auth:latest
docker push $ECR_AUTH/auth:latest
Set-Location ..\..
Write-Host "  Backend pushed to ECR" -ForegroundColor Green

# Build and push frontend
Write-Host "  Building frontend..." -ForegroundColor Yellow
Set-Location frontend
docker build -t frontend:latest .
docker tag frontend:latest $ECR_AUTH/frontend:latest
docker push $ECR_AUTH/frontend:latest
Set-Location ..
Write-Host "  Frontend pushed to ECR" -ForegroundColor Green
Write-Host ""

Write-Host "Step 3: Triggering EC2 Instance Refresh..." -ForegroundColor Cyan
aws autoscaling start-instance-refresh `
    --auto-scaling-group-name enterprise-app-asg `
    --preferences MinHealthyPercentage=50,InstanceWarmup=300 `
    --region $REGION

Write-Host "Instance refresh started" -ForegroundColor Green
Write-Host ""

Write-Host "=========================================" -ForegroundColor Green
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Application URL:" -ForegroundColor Cyan
Write-Host "   $ALB_URL" -ForegroundColor Yellow
Write-Host ""
Write-Host "Wait 5-10 minutes for:" -ForegroundColor Cyan
Write-Host "   - EC2 instances to refresh" -ForegroundColor White
Write-Host "   - Docker images to pull" -ForegroundColor White
Write-Host "   - Services to start" -ForegroundColor White
Write-Host "   - Health checks to pass" -ForegroundColor White
Write-Host ""
Write-Host "Test your application:" -ForegroundColor Cyan
Write-Host "   curl $ALB_URL/health" -ForegroundColor Gray
Write-Host ""
Write-Host "Security Features:" -ForegroundColor Cyan
Write-Host "   - bcrypt password hashing" -ForegroundColor Green
Write-Host "   - JWT authentication" -ForegroundColor Green
Write-Host "   - Input validation" -ForegroundColor Green
Write-Host "   - Rate limiting" -ForegroundColor Green
Write-Host ""
