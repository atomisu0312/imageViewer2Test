package util_test

import (
	"fmt"
	"log"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var hmacSampleSecret = []byte("your-256-bit-secret")

func createTokenSample() (string, error) {
	// トークンを生成し、クレームを設定
	token := jwt.NewWithClaims(jwt.SigningMethodHS384, jwt.MapClaims{
		"foo": "bard",
		"nbf": time.Date(2025, 1, 1, 0, 0, 0, 0, time.UTC).Unix(),
	})

	// トークンを署名し、文字列として取得
	tokenString, err := token.SignedString(hmacSampleSecret)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func parseTokenSample(tokenString string) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// アルゴリズムを検証
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return hmacSampleSecret, nil
	})
	if err != nil {
		log.Fatal(err)
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		fmt.Println("Foo:", claims["foo"])
		fmt.Println("Nbf:", claims["nbf"])
	} else {
		fmt.Println("Invalid token")
	}
}

func TestJwtOfSample(t *testing.T) {
	t.Run("encodeテスト from sample", func(t *testing.T) {
		token, err := createTokenSample()
		if err != nil {
			fmt.Println("Error creating token:", err)
			return
		}
		fmt.Println("Generated Token:", token)
		parseTokenSample(token)
	})
}
