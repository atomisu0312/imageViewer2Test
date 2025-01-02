package app

import (
	"image_viewer/account/handler"

	"github.com/labstack/echo/v4"
	"github.com/samber/do"
)

func SetupHandler(e *echo.Echo, injector *do.Injector) {
	api := e.Group("/api")
	accountHandler := do.MustInvoke[handler.AccountHandler](injector)
	accountHandler.AddHandler(api)

	authHandler := do.MustInvoke[handler.AuthHandler](injector)
	authHandler.AddHandler(api)
}
