package handler

import (
	"github.com/labstack/echo/v4"
)

func (h *Handler) AddHelloHandler(api *echo.Group) {

	group := api.Group("/hello")
	group.GET("", SimpleHello)
}
