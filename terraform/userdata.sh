#!/bin/bash
set -e

# Update system
yum update -y

# Install Docker
yum install -y docker
systemctl start docker
systemctl enable docker
usermod -aG docker ec2-user

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install AWS CLI v2
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
yum install -y unzip
unzip awscliv2.zip
./aws/install
rm -rf aws awscliv2.zip

# Login to ECR
aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin ${account_id}.dkr.ecr.${region}.amazonaws.com

# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 32)

# Create docker-compose.yml
cat > /home/ec2-user/docker-compose.yml <<EOF
version: '3.8'

services:
  auth-service:
    image: ${account_id}.dkr.ecr.${region}.amazonaws.com/auth:latest
    container_name: auth-service
    ports:
      - "3000:3000"
    environment:
      DB_HOST: ${db_host}
      DB_USER: ${db_user}
      DB_PASS: ${db_pass}
      DB_NAME: ${db_name}
      DB_PORT: 5432
      PORT: 3000
      NODE_ENV: production
      JWT_SECRET: \$JWT_SECRET
      JWT_EXPIRES_IN: 24h
      ALLOWED_ORIGINS: "*"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - app-network

  frontend:
    image: ${account_id}.dkr.ecr.${region}.amazonaws.com/frontend:latest
    container_name: frontend
    ports:
      - "80:80"
    depends_on:
      - auth-service
    restart: unless-stopped
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
EOF

# Start services
cd /home/ec2-user
docker-compose up -d

# Wait for backend to be ready
echo "Waiting for backend to start..."
sleep 60

# Initialize database
echo "Initializing database..."
docker exec auth-service sh -c '
apk add --no-cache postgresql-client curl > /dev/null 2>&1
export PGPASSWORD=${db_pass}
psql -h ${db_host} -U ${db_user} -d ${db_name} <<SQL
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
SQL
' || echo "Database initialization completed"

echo "Deployment complete!"
echo "Backend health: $(curl -s http://localhost:3000/health || echo 'Not ready yet')"
