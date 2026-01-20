#!/bin/bash

API_URL="http://localhost:3000"

echo "🧪 Testing Enterprise API"
echo "========================="
echo ""

# Test 1: Health Check
echo "1️⃣ Testing Health Check..."
curl -s $API_URL/health | jq '.'
echo ""

# Test 2: Register User
echo "2️⃣ Registering new user..."
curl -s -X POST $API_URL/register \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"test123"}' | jq '.'
echo ""

# Test 3: Login
echo "3️⃣ Logging in..."
curl -s -X POST $API_URL/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"test123"}' | jq '.'
echo ""

# Test 4: Get All Users
echo "4️⃣ Getting all users..."
curl -s $API_URL/users | jq '.'
echo ""

echo "✅ All tests completed!"
