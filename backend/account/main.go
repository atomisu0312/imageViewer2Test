package main

import (
	"image_viewer/account/config"
	"image_viewer/account/handler"
	"image_viewer/account/usecase"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/samber/do"

	_ "github.com/lib/pq" // PostgreSQL ドライバをインポート
)

func main() {

	_ = godotenv.Load(".env")

	injector := do.New()

	do.Provide(injector, config.NewDbConnection)
	do.Provide(injector, usecase.NewAppUseCase)

	e := echo.New()
	api := e.Group("/account")

	h := handler.NewHandler()
	h.AddHelloHandler(api)
	e.Logger.Fatal(e.Start(":1323"))
}
