# 🚀 Enterprise Full-Stack Application - THE ONLY GUIDE YOU NEED

## 🔒 **SECURITY UPDATE v2.0** - Production Ready!

**All critical security vulnerabilities have been fixed:**
- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT token authentication (24h expiration)
- ✅ Input validation (email format + strong password requirements)
- ✅ Rate limiting (5 attempts per 15 minutes on auth endpoints)
- ✅ SQL injection protection (parameterized queries)
- ✅ Restricted CORS (whitelist-based origins)
- ✅ Security headers with Helmet
- ✅ Environment-based configuration

**See [SECURITY-IMPROVEMENTS.md](./SECURITY-IMPROVEMENTS.md) for complete details.**

---

## 📋 What You Have

A **COMPLETE WORKING APPLICATION** with:
- **Frontend**: React + Vite (Beautiful interactive UI with login/register/dashboard)
- **Backend**: Node.js + Express (REST API with Clean Architecture + Security)
- **Database**: PostgreSQL (Persistent data storage)
- **Infrastructure**: AWS (VPC, EC2 Auto Scaling, ALB, RDS) via Terraform
- **DevOps**: Docker, Docker Compose, Auto Scaling
- **Security**: bcrypt, JWT, Rate Limiting, Input Validation, OWASP ZAP scanning

---

## 📁 Project Structure

```
AWS-OWASP-ZAP-Application/
├── frontend/                    # React UI
│   ├── src/App.jsx             # Main app with login/register/dashboard
│   ├── src/index.css           # Beautiful gradient styles
│   └── Dockerfile
├── services/auth-service/       # Node.js Backend (Security Enhanced)
│   ├── src/domain/             # Business entities
│   ├── src/application/        # Use cases (login, register with bcrypt)
│   ├── src/infrastructure/     # Database layer
│   ├── src/interfaces/         # API routes (with validation & rate limiting)
│   ├── src/utils/              # JWT, validators
│   ├── src/middleware/         # Rate limiter
│   └── Dockerfile
├── terraform/                   # AWS Infrastructure
│   ├── vpc.tf                  # Network
│   ├── ec2.tf                  # Auto Scaling Group + ALB
│   ├── rds.tf                  # PostgreSQL
│   └── deploy-ec2.ps1          # Infrastructure deployment script
├── scripts/init-db.sql         # Database schema
├── docker-compose.yml          # Local development
├── deploy-to-ec2.ps1           # Application deployment script
└── Jenkinsfile                 # CI/CD pipeline
```

---

## 🎯 THREE WAYS TO RUN - CHOOSE ONE

### ✅ OPTION 1: LOCAL DEVELOPMENT (Fastest - 2 Minutes)

**Step 1: Start Everything with Docker Compose**
```bash
cd AWS-OWASP-ZAP-Application
docker-compose up --build
```

**Step 2: Open Your Browser**
```
Frontend: http://localhost:5173
Backend API: http://localhost:3000
Database: localhost:5432
```

**Step 3: Test the Application**
- Register a new user with **strong password** (min 8 chars, uppercase, lowercase, number, special char)
  - Example: `SecurePass123!`
- Login with credentials (receives JWT token)
- View dashboard with user statistics
- See real-time data from PostgreSQL

**That's it! Everything works together!** ✨

---

### ✅ OPTION 2: MANUAL LOCAL SETUP (5 Minutes)

**Step 1: Start PostgreSQL**
```bash
docker run -d \
  --name postgres \
  -e POSTGRES_USER=appuser \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=authdb \
  -p 5432:5432 \
  postgres:15-alpine

# Initialize database
docker exec -i postgres psql -U appuser -d authdb < scripts/init-db.sql
```

**Step 2: Start Backend**
```bash
cd services/auth-service
npm install
export DB_HOST=localhost
export DB_USER=appuser
export DB_PASS=password
export DB_NAME=authdb
export JWT_SECRET=your-secret-key-min-32-chars
npm start
```

**Step 3: Start Frontend (New Terminal)**
```bash
cd frontend
npm install
npm run dev
```

**Step 4: Access Application**
```
Frontend: http://localhost:5173
Backend: http://localhost:3000
```

---

### ✅ OPTION 3: AWS PRODUCTION DEPLOYMENT (15 Minutes)

**Prerequisites:**
```bash
aws --version          # AWS CLI
terraform --version    # Terraform
docker --version       # Docker
```

**Step 1: Configure AWS**
```bash
aws configure
# Enter: Access Key, Secret Key, Region (us-west-2), Output (json)
```

**Step 2: Deploy Everything with One Script**
```bash
.\DEPLOY.ps1
```

**That's it!** The script will:
- ✅ Deploy infrastructure (VPC, EC2 Auto Scaling, ALB, RDS)
- ✅ Build Docker images
- ✅ Push to ECR
- ✅ Trigger instance refresh
- ✅ Show your application URL

**Takes ~15 minutes total**

**Step 3: Access Your Application**
The script will output your Application Load Balancer URL:
```
http://enterprise-alb-XXXXXXXXX.us-west-2.elb.amazonaws.com
```

**Wait 5-10 minutes** for instances to refresh and services to start.

**Step 4: Test Your Application**
```bash
# Health check
curl http://your-alb-url/health

# Register user (strong password required)
curl -X POST http://your-alb-url/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"SecurePass123!"}'
```

---

## 🎨 APPLICATION FEATURES

### What You Can Do
1. **Register** - Create new user account with strong password
2. **Login** - Authenticate with JWT tokens
3. **Dashboard** - View statistics (total users, active users, system health)
4. **User List** - See all registered users from database (JWT protected)
5. **Logout** - End session and clear tokens

### API Endpoints
| Method | Endpoint | Description | Protection |
|--------|----------|-------------|------------|
| POST | /register | Create new user | Rate limited (5/15min) |
| POST | /login | Authenticate user | Rate limited (5/15min) |
| GET | /users | Get all users | JWT required |
| GET | /health | Health check | Public |

### 🔒 Security Features
- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Authentication**: 24-hour token expiration
- **Input Validation**: Strong password requirements (8+ chars, uppercase, lowercase, number, special char)
- **Rate Limiting**: 5 auth attempts per 15 minutes
- **SQL Injection Protection**: Parameterized queries
- **CORS Restrictions**: Whitelist-based origins
- **Security Headers**: Helmet middleware enabled

---

## 🧪 TESTING YOUR APPLICATION

### Test Backend API (Updated for Security)
```bash
# Health check
curl http://localhost:3000/health

# Register user (requires strong password now)
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"SecurePass123!"}'

# Login (returns JWT token)
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"SecurePass123!"}'

# Get all users (requires JWT token)
TOKEN="your-jwt-token-from-login"
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/users
```

### Test Security Features
See [TESTING-SECURITY.md](./TESTING-SECURITY.md) for comprehensive security testing guide.

### Test Frontend
1. Open http://localhost:5173
2. Click "Register" tab
3. Enter email and **strong password** (min 8 chars, uppercase, lowercase, number, special char)
4. Click Register
5. Switch to "Login" tab
6. Login with credentials (receives JWT token)
7. View dashboard with user statistics

### Run OWASP ZAP Security Scan
```bash
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t http://localhost:5173
```

---

## 📊 APPLICATION FEATURES

### Frontend Features
- ✅ User Registration
- ✅ User Login
- ✅ Dashboard with Statistics
- ✅ User List Display
- ✅ Responsive Design
- ✅ Real-time API Integration

### Backend Features
- ✅ RESTful API
- ✅ Clean Architecture
- ✅ PostgreSQL Integration
- ✅ CORS Enabled (Whitelist-based)
- ✅ Health Checks
- ✅ Error Handling
- ✅ **JWT Authentication**
- ✅ **bcrypt Password Hashing**
- ✅ **Input Validation**
- ✅ **Rate Limiting**
- ✅ **Security Headers (Helmet)**

### Infrastructure Features
- ✅ VPC with Public/Private Subnets
- ✅ Application Load Balancer
- ✅ EC2 Auto Scaling Group (2-4 instances)
- ✅ RDS PostgreSQL
- ✅ Auto-healing (unhealthy instances replaced)
- ✅ Security Groups
- ✅ IAM Roles

---

## 🏗️ ARCHITECTURE OVERVIEW

### Local Development
```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ HTTP
       ▼
┌─────────────────────┐
│  React Frontend     │  ← User Interface
│  (Port 5173)        │
└──────┬──────────────┘
       │ REST API
       ▼
┌─────────────────────┐
│  Node.js Backend    │  ← Business Logic + Security
│  (Port 3000)        │
│  JWT + bcrypt       │
└──────┬──────────────┘
       │ SQL
       ▼
┌─────────────────────┐
│  PostgreSQL         │  ← Data Storage
│  (Port 5432)        │
└─────────────────────┘
```

### AWS Production Architecture
```
Internet
   │
   ▼
Application Load Balancer
   │
   ├─────────────┬─────────────┐
   ▼             ▼             ▼
EC2 Instance  EC2 Instance  EC2 Instance
(Docker)      (Docker)      (Docker)
   │             │             │
   └─────────────┴─────────────┘
                 │
                 ▼
          RDS PostgreSQL
        (Private Subnet)
```

---

## 🔧 TROUBLESHOOTING

### Issue: Database Connection Failed
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Check connection
docker exec -it postgres psql -U appuser -d authdb -c "SELECT 1;"
```

### Issue: Frontend Can't Reach Backend
```bash
# Check backend is running
curl http://localhost:3000/health

# Check CORS headers
curl -I http://localhost:3000/health
```

### Issue: EC2 Instances Not Healthy
```bash
# Check Auto Scaling Group
aws autoscaling describe-auto-scaling-groups \
  --auto-scaling-group-names enterprise-app-asg \
  --region us-west-2

# Check target health
aws elbv2 describe-target-health \
  --target-group-arn <your-target-group-arn> \
  --region us-west-2

# SSH into instance (if needed)
aws ssm start-session --target <instance-id>
```

### Issue: Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

---

## 🔐 SECURITY FEATURES

1. **Network Security**
   - VPC isolation with public/private subnets
   - Security groups (firewall rules)
   - No direct internet access to database

2. **Application Security**
   - Password hashing with bcrypt
   - JWT token authentication
   - Input validation
   - Rate limiting
   - Error handling
   - CORS configuration
   - Security headers (Helmet)

3. **Security Scanning**
   - OWASP ZAP web application scanning
   - Trivy container vulnerability scanning
   - Automated security checks in CI/CD

---

## 📊 TECHNOLOGY STACK

**Frontend**: React 18, Vite, Axios, CSS3  
**Backend**: Node.js 20, Express, bcrypt, jsonwebtoken, express-validator, express-rate-limit, helmet  
**Database**: PostgreSQL 15  
**Infrastructure**: Terraform, AWS (VPC, EC2, ALB, RDS)  
**Containers**: Docker, Docker Compose  
**CI/CD**: Jenkins, AWS ECR  
**Security**: OWASP ZAP, Trivy, JWT, bcrypt, Rate Limiting

---

## 🎯 FILE REFERENCE

| File | Purpose |
|------|---------|
| `frontend/src/App.jsx` | Main React component with UI |
| `services/auth-service/src/server.js` | Backend entry point with security |
| `services/auth-service/src/interfaces/http.js` | API routes with validation |
| `services/auth-service/src/application/*.usecase.js` | Business logic with bcrypt |
| `services/auth-service/src/utils/jwt.js` | JWT token management |
| `services/auth-service/src/utils/validators.js` | Input validation rules |
| `services/auth-service/src/middleware/rateLimiter.js` | Rate limiting config |
| `scripts/init-db.sql` | Database schema |
| `docker-compose.yml` | Local development setup |
| `terraform/ec2.tf` | EC2 Auto Scaling infrastructure |
| `terraform/rds.tf` | RDS database |
| `terraform/deploy-ec2.ps1` | Infrastructure deployment |
| `deploy-to-ec2.ps1` | Application deployment |
| `Jenkinsfile` | CI/CD pipeline |

---

## 🚀 NEXT STEPS & ENHANCEMENTS

### ✅ Security Improvements (COMPLETED)
1. ~~**Add JWT Authentication**~~ ✅ Implemented
2. ~~**Hash Passwords**~~ ✅ bcrypt with 10 salt rounds
3. ~~**Add Input Validation**~~ ✅ express-validator
4. ~~**Implement Rate Limiting**~~ ✅ 5 attempts per 15 minutes
5. ~~**Restrict CORS**~~ ✅ Whitelist-based origins
6. ~~**Add Security Headers**~~ ✅ Helmet middleware

### Immediate Improvements (Optional)
1. **Add Email Verification** - Verify user emails
2. **Implement Password Reset** - Forgot password functionality
3. **Add Refresh Tokens** - Long-lived tokens for better UX
4. **Add User Profiles** - Extended user information
5. **Implement 2FA** - Two-factor authentication

### Scale the Application
1. **Add More Services** - Duplicate auth-service for other features
2. **Implement API Gateway** - Centralized routing
3. **Add Redis Caching** - Improve performance
4. **Setup Monitoring** - Prometheus + Grafana
5. **Add Logging** - ELK stack or CloudWatch

### Production Readiness
1. **HTTPS/TLS** - SSL certificates
2. **AWS WAF** - Web application firewall
3. **Backup Strategy** - Automated backups
4. **Disaster Recovery** - Multi-region setup
5. **CDN** - CloudFront for static assets

---

## 💰 COST ESTIMATE

**Monthly AWS costs (approximate):**
- EC2 instances (t3.medium x2): $60/month
- RDS (db.t3.micro): $15/month
- Application Load Balancer: $20/month
- **Total: ~$95/month**

**Savings vs EKS: $73/month** (No EKS cluster fees!)

---

## 📞 QUICK REFERENCE

**Start Locally**: `docker-compose up --build`  
**Access App**: http://localhost:5173  
**Test API**: `curl http://localhost:3000/health`  
**Stop All**: `docker-compose down`  

**Deploy to AWS**: `.\DEPLOY.ps1`  
**Cleanup AWS**: `cd terraform && terraform destroy -auto-approve`  

---

## ✅ CHECKLIST

- [ ] Run `docker-compose up` successfully
- [ ] Access frontend at http://localhost:5173
- [ ] Register a new user with strong password
- [ ] Login with credentials
- [ ] View dashboard with statistics
- [ ] Test API endpoints with curl
- [ ] Review code structure
- [ ] Customize for your needs
- [ ] Deploy to AWS (optional)
- [ ] Setup CI/CD (optional)

---

---

## 🚀 CI/CD with GitHub Actions

### Single Comprehensive Workflow

**File**: `.github/workflows/complete-cicd.yml`

**What it does** (9 automated jobs):
1. ✅ Code Quality & Security Checks (linting, tests, npm audit)
2. ✅ Build & Scan Docker Images (Trivy security scan)
3. ✅ Terraform Infrastructure (VPC, RDS, EC2, ALB)
4. ✅ Push to ECR (backend + frontend images)
5. ✅ Database Migration (SQL schema deployment)
6. ✅ Deploy to EC2 Auto Scaling (instance refresh)
7. ✅ OWASP ZAP Security Scan (vulnerability testing)
8. ✅ Smoke Tests (health, registration, login)
9. ✅ Deployment Summary (URLs, status, metrics)

### Setup (One-Time)

**1. Add GitHub Secrets** (Settings → Secrets and variables → Actions):
```
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_ACCOUNT_ID=your-12-digit-account-id
DB_PASSWORD=EnterpriseApp2026!
```

**2. Get AWS Account ID:**
```bash
aws sts get-caller-identity --query Account --output text
```

**3. Push to GitHub:**
```bash
git add .
git commit -m "Deploy application"
git push origin main
```

### Automatic Triggers

- **Push to `main`** → Full deployment (25-35 minutes)
- **Push to `develop`** → Build and test only
- **Pull Request** → Code quality checks only
- **Manual** → GitHub Actions → Run workflow

### Pipeline Flow
```
Code Quality → Build Images → Terraform → Push ECR → 
Database Migration → Deploy EC2 → Security Scan → Smoke Tests → Summary
```

### Monitoring

View pipeline status: GitHub → Actions → Complete CI/CD Pipeline

**Pipeline provides:**
- ✅ Real-time job progress
- ✅ Deployment summary with URLs
- ✅ Security scan reports
- ✅ Test results
- ✅ Infrastructure endpoints

---

## 🧹 CLEANUP (AWS)

```bash
# Destroy infrastructure
cd terraform
terraform destroy -auto-approve

# Delete ECR repositories
aws ecr delete-repository --repository-name auth --force --region us-west-2
aws ecr delete-repository --repository-name frontend --force --region us-west-2
```

---

**🎉 Everything is ready! Just run `docker-compose up` and start building!**

Made with ❤️ for Enterprise Development

**Version**: 2.0.0 - Security Enhanced + EC2 Deployment

A **COMPLETE WORKING APPLICATION** with:
- **Frontend**: React + Vite (Beautiful interactive UI with login/register/dashboard)
- **Backend**: Node.js + Express (REST API with Clean Architecture)
- **Database**: PostgreSQL (Persistent data storage)
- **Infrastructure**: AWS (VPC, EKS, RDS) via Terraform
- **DevOps**: Docker, Kubernetes, Jenkins CI/CD
- **Security**: OWASP ZAP scanning

---

## 📁 Project Structure

```
AWS-OWASP-ZAP-Application/
├── frontend/                    # React UI
│   ├── src/App.jsx             # Main app with login/register/dashboard
│   ├── src/index.css           # Beautiful gradient styles
│   └── Dockerfile
├── services/auth-service/       # Node.js Backend
│   ├── src/domain/             # Business entities
│   ├── src/application/        # Use cases (login, register)
│   ├── src/infrastructure/     # Database layer
│   ├── src/interfaces/         # API routes
│   └── Dockerfile
├── terraform/                   # AWS Infrastructure
│   ├── vpc.tf                  # Network
│   ├── eks.tf                  # Kubernetes
│   └── rds.tf                  # PostgreSQL
├── k8s/                        # Kubernetes manifests
├── scripts/init-db.sql         # Database schema
├── docker-compose.yml          # Local development
└── Jenkinsfile                 # CI/CD pipeline
```

---

## 🎯 THREE WAYS TO RUN - CHOOSE ONE

### ✅ OPTION 1: LOCAL DEVELOPMENT (Fastest - 2 Minutes)

**Step 1: Start Everything with Docker Compose**
```bash
cd AWS-OWASP-ZAP-Application
docker-compose up --build
```

**Step 2: Open Your Browser**
```
Frontend: http://localhost:5173
Backend API: http://localhost:3000
Database: localhost:5432
```

**Step 3: Test the Application**
- Register a new user
- Login with credentials
- View dashboard with user list
- See real-time data from PostgreSQL

**That's it! Everything works together!** ✨

---

### ✅ OPTION 2: MANUAL LOCAL SETUP (5 Minutes)

**Step 1: Start PostgreSQL**
```bash
docker run -d \
  --name postgres \
  -e POSTGRES_USER=appuser \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=authdb \
  -p 5432:5432 \
  postgres:15-alpine

# Initialize database
docker exec -i postgres psql -U appuser -d authdb < scripts/init-db.sql
```

**Step 2: Start Backend**
```bash
cd services/auth-service
npm install
export DB_HOST=localhost
export DB_USER=appuser
export DB_PASS=password
export DB_NAME=authdb
npm start
```

**Step 3: Start Frontend (New Terminal)**
```bash
cd frontend
npm install
npm run dev
```

**Step 4: Access Application**
```
Frontend: http://localhost:5173
Backend: http://localhost:3000
```

---

### ✅ OPTION 3: AWS PRODUCTION DEPLOYMENT (30 Minutes)

**Prerequisites:**
```bash
# Install required tools
aws --version          # AWS CLI
terraform --version    # Terraform
kubectl version        # Kubernetes CLI
docker --version       # Docker
```

**Step 1: Configure AWS**
```bash
aws configure
# Enter: Access Key, Secret Key, Region (us-west-2), Output (json)
```

**Step 2: Deploy Infrastructure**
```bash
cd terraform

# Create terraform.tfvars
cat > terraform.tfvars << EOF
db_user      = "appuser"
db_pass      = "YourSecurePassword123!"
cluster_name = "enterprise-eks"
region       = "us-west-2"
EOF

# Deploy
terraform init
terraform plan
terraform apply -auto-approve

# Save outputs
terraform output > ../outputs.txt
```

**Step 3: Configure kubectl**
```bash
aws eks update-kubeconfig --name enterprise-eks --region us-west-2
kubectl get nodes
```

**Step 4: Create ECR Repositories**
```bash
aws ecr create-repository --repository-name auth --region us-west-2
aws ecr create-repository --repository-name frontend --region us-west-2
```

**Step 5: Build & Push Backend**
```bash
cd services/auth-service

# Get ECR login
aws ecr get-login-password --region us-west-2 | \
  docker login --username AWS --password-stdin <ACCOUNT>.dkr.ecr.us-west-2.amazonaws.com

# Build and push
docker build -t auth:latest .
docker tag auth:latest <ACCOUNT>.dkr.ecr.us-west-2.amazonaws.com/auth:latest
docker push <ACCOUNT>.dkr.ecr.us-west-2.amazonaws.com/auth:latest
```

**Step 6: Build & Push Frontend**
```bash
cd ../../frontend

docker build -t frontend:latest .
docker tag frontend:latest <ACCOUNT>.dkr.ecr.us-west-2.amazonaws.com/frontend:latest
docker push <ACCOUNT>.dkr.ecr.us-west-2.amazonaws.com/frontend:latest
```

**Step 7: Update Kubernetes Manifests**
```bash
# Get RDS endpoint from terraform output
RDS_ENDPOINT=$(terraform output -raw rds_address)
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Update deployment.yaml
sed -i "s/<ACCOUNT>/$ACCOUNT_ID/g" ../k8s/deployment.yaml
sed -i "s/<RDS_ENDPOINT>/$RDS_ENDPOINT/g" ../k8s/deployment.yaml

# Update frontend-deployment.yaml
sed -i "s/<ACCOUNT>/$ACCOUNT_ID/g" ../k8s/frontend-deployment.yaml
```

**Step 8: Create Database Secret**
```bash
kubectl create secret generic db-secret \
  --from-literal=password='YourSecurePassword123!'
```

**Step 9: Deploy to Kubernetes**
```bash
cd ../k8s
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f frontend-deployment.yaml

# Wait for pods
kubectl get pods -w
```

**Step 10: Get Application URL**
```bash
# Get LoadBalancer URL
kubectl get svc frontend-svc

# Access your application
# http://<EXTERNAL-IP>
```

**Step 11: Initialize Database**
```bash
# Port forward to RDS through a pod
kubectl run psql --rm -it --image=postgres:15 -- \
  psql -h $RDS_ENDPOINT -U appuser -d authdb

# Run in psql:
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (email, password) VALUES ('admin@test.com', 'admin123');
\q
```

---

## 🎨 APPLICATION FEATURES

### What You Can Do
1. **Register** - Create new user account with strong password
2. **Login** - Authenticate with JWT tokens
3. **Dashboard** - View statistics (total users, active users, system health)
4. **User List** - See all registered users from database (JWT protected)
5. **Logout** - End session and clear tokens

### API Endpoints
| Method | Endpoint | Description | Protection |
|--------|----------|-------------|------------|
| POST | /register | Create new user | Rate limited (5/15min) |
| POST | /login | Authenticate user | Rate limited (5/15min) |
| GET | /users | Get all users | JWT required |
| GET | /health | Health check | Public |

### 🔒 Security Features
- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Authentication**: 24-hour token expiration
- **Input Validation**: Strong password requirements (8+ chars, uppercase, lowercase, number, special char)
- **Rate Limiting**: 5 auth attempts per 15 minutes
- **SQL Injection Protection**: Parameterized queries
- **CORS Restrictions**: Whitelist-based origins
- **Security Headers**: Helmet middleware enabled

---

## 🧪 TESTING YOUR APPLICATION

### Test Backend API (Updated for Security)
```bash
# Health check
curl http://localhost:3000/health

# Register user (requires strong password now)
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"SecurePass123!"}'

# Login (returns JWT token)
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"SecurePass123!"}'

# Get all users (requires JWT token)
TOKEN="your-jwt-token-from-login"
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/users
```

### Test Security Features
See [TESTING-SECURITY.md](./TESTING-SECURITY.md) for comprehensive security testing guide.

### Test Frontend
1. Open http://localhost:5173
2. Click "Register" tab
3. Enter email and **strong password** (min 8 chars, uppercase, lowercase, number, special char)
4. Click Register
5. Switch to "Login" tab
6. Login with credentials (receives JWT token)
7. View dashboard with user statistics

### Run OWASP ZAP Security Scan
```bash
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t http://localhost:5173
```

---

## 📊 APPLICATION FEATURES

### Frontend Features
- ✅ User Registration
- ✅ User Login
- ✅ Dashboard with Statistics
- ✅ User List Display
- ✅ Responsive Design
- ✅ Real-time API Integration

### Backend Features
- ✅ RESTful API
- ✅ Clean Architecture
- ✅ PostgreSQL Integration
- ✅ CORS Enabled (Whitelist-based)
- ✅ Health Checks
- ✅ Error Handling
- ✅ **JWT Authentication**
- ✅ **bcrypt Password Hashing**
- ✅ **Input Validation**
- ✅ **Rate Limiting**
- ✅ **Security Headers (Helmet)**

### Infrastructure Features
- ✅ VPC with Public/Private Subnets
- ✅ EKS Cluster
- ✅ RDS PostgreSQL
- ✅ Auto-scaling Node Groups
- ✅ Load Balancers
- ✅ Security Groups

---

## 🏗️ ARCHITECTURE OVERVIEW

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ HTTP
       ▼
┌─────────────────────┐
│  React Frontend     │  ← User Interface
│  (Port 5173)        │
└──────┬──────────────┘
       │ REST API
       ▼
┌─────────────────────┐
│  Node.js Backend    │  ← Business Logic
│  (Port 3000)        │
│  Clean Architecture │
└──────┬──────────────┘
       │ SQL
       ▼
┌─────────────────────┐
│  PostgreSQL         │  ← Data Storage
│  (Port 5432)        │
└─────────────────────┘
```

### AWS Production Architecture
```
Internet → Load Balancer → EKS Cluster → RDS Database
                            ├─ Frontend Pods (x2)
                            └─ Backend Pods (x3)
```

---

## 🔧 TROUBLESHOOTING

### Issue: Database Connection Failed
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Check connection
docker exec -it postgres psql -U appuser -d authdb -c "SELECT 1;"
```

### Issue: Frontend Can't Reach Backend
```bash
# Check backend is running
curl http://localhost:3000/health

# Check CORS headers
curl -I http://localhost:3000/health
```

### Issue: Pods Not Starting
```bash
# Check pod logs
kubectl logs -f deployment/auth-service

# Check pod status
kubectl describe pod <pod-name>

# Check events
kubectl get events --sort-by='.lastTimestamp'
```

### Issue: Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

---

## 🔐 SECURITY FEATURES

1. **Network Security**
   - VPC isolation with public/private subnets
   - Security groups (firewall rules)
   - No direct internet access to database

2. **Application Security**
   - Input validation
   - Error handling
   - CORS configuration
   - Kubernetes secrets for credentials

3. **Security Scanning**
   - OWASP ZAP web application scanning
   - Trivy container vulnerability scanning
   - Automated security checks in CI/CD

---

## 📊 TECHNOLOGY STACK

**Frontend**: React 18, Vite, Axios, CSS3  
**Backend**: Node.js 20, Express, bcrypt, jsonwebtoken, express-validator, express-rate-limit, helmet  
**Database**: PostgreSQL 15  
**Infrastructure**: Terraform, AWS (VPC, EKS, RDS)  
**Containers**: Docker, Kubernetes  
**CI/CD**: Jenkins, AWS ECR  
**Security**: OWASP ZAP, Trivy, JWT, bcrypt, Rate Limiting  

---

## 🎯 FILE REFERENCE

| File | Purpose |
|------|---------|
| `frontend/src/App.jsx` | Main React component with UI |
| `services/auth-service/src/server.js` | Backend entry point |
| `services/auth-service/src/interfaces/http.js` | API routes |
| `services/auth-service/src/application/*.usecase.js` | Business logic |
| `services/auth-service/src/infrastructure/user.repo.js` | Database access |
| `scripts/init-db.sql` | Database schema |
| `docker-compose.yml` | Local development setup |
| `terraform/*.tf` | AWS infrastructure |
| `k8s/*.yaml` | Kubernetes deployment |
| `Jenkinsfile` | CI/CD pipeline |

---

## 🚀 NEXT STEPS & ENHANCEMENTS

### ✅ Security Improvements (COMPLETED)
1. ~~**Add JWT Authentication**~~ ✅ Implemented
2. ~~**Hash Passwords**~~ ✅ bcrypt with 10 salt rounds
3. ~~**Add Input Validation**~~ ✅ express-validator
4. ~~**Implement Rate Limiting**~~ ✅ 5 attempts per 15 minutes
5. ~~**Restrict CORS**~~ ✅ Whitelist-based origins
6. ~~**Add Security Headers**~~ ✅ Helmet middleware

### Immediate Improvements (Optional)
1. **Add Email Verification** - Verify user emails
2. **Implement Password Reset** - Forgot password functionality
3. **Add Refresh Tokens** - Long-lived tokens for better UX
4. **Add User Profiles** - Extended user information
5. **Implement 2FA** - Two-factor authentication

### Scale the Application
1. **Add More Services** - Duplicate auth-service for other features
2. **Implement API Gateway** - Centralized routing
3. **Add Redis Caching** - Improve performance
4. **Setup Monitoring** - Prometheus + Grafana
5. **Add Logging** - ELK stack or CloudWatch

### Production Readiness
1. **HTTPS/TLS** - SSL certificates
2. **Rate Limiting** - Prevent abuse
3. **AWS WAF** - Web application firewall
4. **Backup Strategy** - Automated backups
5. **Disaster Recovery** - Multi-region setup

---

## 📞 QUICK REFERENCE

**Start Locally**: `docker-compose up --build`  
**Access App**: http://localhost:5173  
**Test API**: `curl http://localhost:3000/health`  
**Stop All**: `docker-compose down`  

**Deploy AWS**: `cd terraform && terraform apply`  
**Deploy K8s**: `kubectl apply -f k8s/`  

---

## ✅ CHECKLIST

- [ ] Run `docker-compose up` successfully
- [ ] Access frontend at http://localhost:5173
- [ ] Register a new user
- [ ] Login with credentials
- [ ] View dashboard with statistics
- [ ] Test API endpoints with curl
- [ ] Review code structure
- [ ] Customize for your needs
- [ ] Deploy to AWS (optional)
- [ ] Setup CI/CD (optional)

---

**🎉 Everything is ready! Just run `docker-compose up` and start building!**

Made with ❤️ for Enterprise Development
