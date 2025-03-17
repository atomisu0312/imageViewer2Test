#!/bin/bash

# スクリプトのディレクトリに移動
cd "$(dirname "$0")/.."

# JWT_SECRET_KEYを設定
export JWT_SECRET_KEY="test-secret-key-for-development"

# JWTトークンを生成
echo "Generating JWT token..."
TOKEN=$(go run ./cmd/token/main.go | tr -d '\n' | tr -d '%')

echo "*******************************************"
echo "Generated Token: $TOKEN"
echo "*******************************************"

if [ -z "$TOKEN" ]; then
    echo "Error: Failed to generate token"
    exit 1
fi

echo "Testing authenticated endpoints..."

# ユーザー情報の取得
echo -e "\nTesting GET /api/account/users/1"
curl -X GET "http://localhost:1323/api/account/users/1" \
  -H "Authorization: Bearer $TOKEN"

# チーム情報の取得
echo -e "\nTesting GET /api/account/teams/1"
curl -X GET "http://localhost:1323/api/account/teams/1" \
  -H "Authorization: Bearer $TOKEN"