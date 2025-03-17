package main

import (
	"fmt"
	"image_viewer/account/util"
	"log"
	"os"
)

func main() {
	// テスト用のユーザーID
	userID := int64(1)

	// JWTトークンのクレーム
	claims := map[string]interface{}{
		"user_id": userID,
	}

	// 環境変数からシークレットキーを取得
	secretKey := os.Getenv("JWT_SECRET_KEY")
	if secretKey == "" {
		log.Fatal("JWT_SECRET_KEY environment variable is not set")
	}

	// トークンを生成
	token, err := util.JWTHelper.EncodeJWT(claims, secretKey)
	if err != nil {
		log.Fatalf("Failed to generate token: %v", err)
	}

	// トークンを出力
	fmt.Println(token)
}
