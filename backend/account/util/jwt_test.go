package util_test

import (
	"fmt"
	"image_viewer/account/util"
	"log"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/stretchr/testify/assert"
)

var (
	hmacSampleSecretBin = []byte("your-256-bit-secret")
	hmacSampleSecret    = "your-256-bit-secret"
	sampleToken         = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXJkIiwibnVtYmVyIjozNH0.57xE3hUbkhgCAGXYvVRtlKNLGl3AM-rDcjmqTtHGsuQ"
	sampleObj           = map[string]interface{}{
		"foo":    "bard",
		"number": float64(34),
	}
)

func createTokenSample() (string, error) {
	// トークンを生成し、クレームを設定
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"foo": "bard",
		"nbf": time.Date(2025, 1, 1, 0, 0, 0, 0, time.UTC).Unix(),
	})

	// トークンを署名し、文字列として取得
	tokenString, err := token.SignedString(hmacSampleSecretBin)
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
		return hmacSampleSecretBin, nil
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

func TestJwt(t *testing.T) {
	t.Run("encodeテスト", func(t *testing.T) {
		keyStr := hmacSampleSecret
		actual, _ := util.JWTHelper.EncodeJWT(sampleObj, keyStr)
		log.Println("Generated Token:", actual)
		assert.Equal(t, sampleToken, actual, "Encoded Token is Wrong")
	})
	t.Run("decodeテスト", func(t *testing.T) {
		keyStr := hmacSampleSecret
		actual, _ := util.JWTHelper.DecodeJWTWithHMAC(sampleToken, keyStr)
		log.Println("Encoded Object:", actual)
		assert.Equal(t, sampleObj, actual, "Decoded Token is Wrong")
	})
}
