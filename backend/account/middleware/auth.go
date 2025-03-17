package middleware

import (
	"image_viewer/account/util"
	"net/http"
	"os"
	"strings"

	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
)

// AuthMiddleware は、JWTトークンを検証し、ユーザーIDをコンテキストに設定するミドルウェアです。
func AuthMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	logger, err := zap.NewDevelopment()
	if err != nil {
		panic(err)
	}
	defer logger.Sync()

	return func(c echo.Context) error {
		// Authorization ヘッダーからトークンを取得
		authHeader := c.Request().Header.Get("Authorization")
		logger.Info("Received request",
			zap.String("path", c.Request().URL.Path),
			zap.String("method", c.Request().Method),
			zap.String("authorization", authHeader),
		)

		if authHeader == "" {
			logger.Warn("No authorization header found")
			return c.JSON(http.StatusUnauthorized, map[string]interface{}{
				"status": "error",
				"error": map[string]interface{}{
					"code":    "UNAUTHORIZED",
					"message": "認証が必要です",
				},
			})
		}

		// Bearer トークンの形式をチェック
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			logger.Warn("Invalid token format",
				zap.String("auth_header", authHeader),
			)
			return c.JSON(http.StatusUnauthorized, map[string]interface{}{
				"status": "error",
				"error": map[string]interface{}{
					"code":    "INVALID_TOKEN_FORMAT",
					"message": "無効なトークン形式です",
				},
			})
		}

		tokenString := parts[1]
		secretKey := os.Getenv("JWT_SECRET_KEY")

		// JWTトークンを検証
		claims, err := util.JWTHelper.DecodeJWTWithHMAC(tokenString, secretKey)
		if err != nil {
			logger.Error("Failed to decode JWT token",
				zap.Error(err),
				zap.String("token", tokenString),
			)
			return c.JSON(http.StatusUnauthorized, map[string]interface{}{
				"status": "error",
				"error": map[string]interface{}{
					"code":    "INVALID_TOKEN",
					"message": "無効なトークンです",
				},
			})
		}

		// ユーザーIDを取得してコンテキストに設定
		if userID, ok := claims["user_id"].(float64); ok {
			logger.Info("Successfully authenticated user",
				zap.Int64("user_id", int64(userID)),
			)
			c.Set("user_id", int64(userID))
		} else {
			logger.Error("Invalid user ID in token claims",
				zap.Any("claims", claims),
			)
			return c.JSON(http.StatusUnauthorized, map[string]interface{}{
				"status": "error",
				"error": map[string]interface{}{
					"code":    "INVALID_USER_ID",
					"message": "無効なユーザーIDです",
				},
			})
		}

		return next(c)
	}
}
