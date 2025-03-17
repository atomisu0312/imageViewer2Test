#!/bin/bash

# JWT_SECRET_KEYを設定
export JWT_SECRET_KEY="test-secret-key-for-development"

# JWTトークンを生成
TOKEN=$(go run ./cmd/token/main.go)
echo "Generated Token: ${TOKEN}"