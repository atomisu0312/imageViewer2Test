package main

import (
	"context"
	"fmt"
	"image_viewer/account/config"
	"image_viewer/account/usecase"
	"log"

	"github.com/joho/godotenv"
	"github.com/samber/do"

	_ "github.com/lib/pq" // PostgreSQL ドライバをインポート
)

func main() {

	err := godotenv.Load(".env")

	injector := do.New()

	do.Provide(injector, config.NewDbConnection)

	do.Provide(injector, usecase.NewUseCase)

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
}
