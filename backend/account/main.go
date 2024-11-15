package main

import (
	"image_viewer/account/config"
	"image_viewer/account/usecase"
	"net/http"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/samber/do"

	_ "github.com/lib/pq" // PostgreSQL ドライバをインポート
)

func main() {

	_ = godotenv.Load(".env")

	injector := do.New()

	do.Provide(injector, config.NewDbConnection)

	do.Provide(injector, usecase.NewUseCase)

	e := echo.New()
	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello, World!")
	})
	e.Logger.Fatal(e.Start(":1323"))

	/**
	ctx := context.Background()

	// UseCaseのインスタンスを作成
	useCase := do.MustInvoke[usecase.AppUseCase](injector)

	// ワークアウトトランザクションを実行
	result, err := useCase.FindUserById(ctx, 1)

	if err != nil {
		log.Fatalln("Error creating workout transaction:", err)
	}

	// 結果を表示
	fmt.Printf("result: %s\n", result.Email)
	**/
}
