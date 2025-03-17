package app

import (
	"image_viewer/account/handler"
	"image_viewer/account/middleware"

	"github.com/labstack/echo/v4"
	"github.com/samber/do"
)

func SetupHandler(e *echo.Echo, injector *do.Injector) {
	api := e.Group("/api")

	// 認証が必要なエンドポイントグループ
	auth := api.Group("")
	auth.Use(middleware.AuthMiddleware)

	// 認証が必要なエンドポイント
	accountHandler := do.MustInvoke[handler.AccountHandler](injector)
	accountHandler.AddHandler(auth)

	// 認証が不要なエンドポイント
	authHandler := do.MustInvoke[handler.AuthHandler](injector)
	authHandler.AddHandler(api)
}
