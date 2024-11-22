package handler

import "github.com/labstack/echo/v4"

type handler struct {
}
type Handler interface {
	AddHandler(api *echo.Group)
}

// NewUseCase は新しい UseCase インスタンスを作成します
func NewHandler[T interface{ Handler }](constructor func(*handler) T) (T, error) {
	return constructor(&handler{}), nil
}
