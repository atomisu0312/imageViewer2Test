package main

import (
	"image_viewer/account/app"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
)

func main() {

	_ = godotenv.Load(".env")

	injector := app.SetupDIContainer()
	e := echo.New()

	app.SetupHandler(e, injector)

	e.Logger.Fatal(e.Start(":1323"))
}
