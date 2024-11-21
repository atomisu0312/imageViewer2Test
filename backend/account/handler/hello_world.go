package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func (h *Handler) AddHelloHandler(api *echo.Group) {

	group := api.Group("/hello")

	group.GET("", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})
}
