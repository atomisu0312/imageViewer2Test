package handler

import (
	"context"
	"fmt"
	"image_viewer/account/usecase"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/samber/do"
)

type helloHandlerImpl struct {
	*handler
	userUsecase usecase.UserUseCase
}

type HelloHandler interface {
	Handler
}

func NewHelloHandler(i *do.Injector) (HelloHandler, error) {
	return NewHandler(func(h *handler) HelloHandler {
		return &helloHandlerImpl{h, do.MustInvoke[usecase.UserUseCase](i)}
	})
}

func (h *helloHandlerImpl) AddHandler(api *echo.Group) {
	group := api.Group("/hello")
	group.GET("", h.simpleHello)
}

func (h *helloHandlerImpl) simpleHello(c echo.Context) error {
	ctx := context.Background()
	result, _ := h.userUsecase.FindUserById(ctx, 1)

	return c.String(http.StatusOK, fmt.Sprintf("Hello, my name is %s", result.Name))
}
