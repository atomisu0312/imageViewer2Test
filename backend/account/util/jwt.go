package util

import (
	"github.com/golang-jwt/jwt/v5"
)

type jwtHelperImpl struct{}

// StringHelper は文字列に関するヘルパーを提供します
var JWTHelper = jwtHelperImpl{}

func (jh jwtHelperImpl) EncodeJWTWithMethod(obj map[string]interface{}, keyStr string, method *jwt.SigningMethodHMAC) (string, error) {
	claims := jwt.MapClaims(obj)
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(keyStr))

	if err != nil {
		return "", err
	}
	return tokenString, nil
}

// EncodeJWT は指定されたオブジェクトをJWT形式にエンコードします
func (jh jwtHelperImpl) EncodeJWT(obj map[string]interface{}, keyStr string) (string, error) {
	return jh.EncodeJWTWithMethod(obj, keyStr, jwt.SigningMethodHS256)
}

// DecodeJWTHMAC は指定されたJWT文字列をデコードします
func (jh jwtHelperImpl) DecodeJWTWithHMAC(tokenString string, keyStr string) (map[string]interface{}, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrInvalidKey
		}
		return []byte(keyStr), nil
	})
	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims, nil
	}
	return nil, jwt.ErrInvalidKey
}
