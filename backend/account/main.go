package main

import (
	"encoding/json"
	"image_viewer/account/app"
	"os"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
)

func main() {

	_ = godotenv.Load(".env")

	injector := app.SetupDIContainer()
	e := echo.New()

	app.SetupHandler(e, injector)

	data, _ := json.MarshalIndent(e.Routes(), "", "  ")
	os.WriteFile("routes.json", data, 0644)

	e.Logger.Fatal(e.Start(":1323"))
}
