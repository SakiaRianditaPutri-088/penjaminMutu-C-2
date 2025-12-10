#!/bin/bash

echo "Testing Register API..."
echo ""

# Test register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{
    "email": "testuser@example.com",
    "password": "password123",
    "full_name": "Test User"
  }' \
  -w "\n\nStatus: %{http_code}\n" \
  -v

echo ""
echo "Done!"

