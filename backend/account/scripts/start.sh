#!/bin/bash

# JWT_SECRET_KEYを設定
export JWT_SECRET_KEY="test-secret-key-for-development"

# アプリケーションを起動
go run main.go 