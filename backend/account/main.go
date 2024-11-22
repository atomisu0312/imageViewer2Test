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
	do.Provide(injector, handler.NewHelloHandler)

	e := echo.New()
	api := e.Group("/account")

	helloHandler := do.MustInvoke[handler.HelloHandler](injector)
	helloHandler.AddHandler(api)

	e.Logger.Fatal(e.Start(":1323"))
}
