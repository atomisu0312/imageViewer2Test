package main

import (
	"encoding/json"
	"image_viewer/account/config"
	"image_viewer/account/handler"
	"image_viewer/account/usecase"
	"os"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/samber/do"

	_ "github.com/lib/pq" // PostgreSQL ドライバをインポート
)

func main() {

	_ = godotenv.Load(".env")

	injector := do.New()

	do.Provide(injector, config.NewDbConnection)
	do.Provide(injector, usecase.NewAccountUseCase)
	do.Provide(injector, handler.NewAccountHandler)

	e := echo.New()
	api := e.Group("/api")
	accountHandler := do.MustInvoke[handler.AccountHandler](injector)
	accountHandler.AddHandler(api)

	data, _ := json.MarshalIndent(e.Routes(), "", "  ")
	os.WriteFile("routes.json", data, 0644)

	e.Logger.Fatal(e.Start(":1323"))
}
