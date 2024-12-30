package handler

import "github.com/labstack/echo/v4"

type handler struct {
}

// Handler はハンドラの汎用インターフェースです
type Handler interface {
	AddHandler(api *echo.Group)
}

// NewHandler は新しい Handler インスタンスを作成します
func NewHandler[T interface{ Handler }](constructor func(*handler) T) (T, error) {
	return constructor(&handler{}), nil
}
