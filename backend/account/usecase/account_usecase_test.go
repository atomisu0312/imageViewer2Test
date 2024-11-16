package usecase_test

import (
	"context"
	"fmt"
	"image_viewer/account/test/config"
	"image_viewer/account/usecase"
	"log"
	"testing"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/samber/do"
)

func TestMain(m *testing.M) {
	// Load environment variables
	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}
}

func TestFindUserById(t *testing.T) {
	ctx := context.Background()
	injector := do.New()

	do.Provide(injector, config.TestDbConnection)

	do.Provide(injector, usecase.NewAppUseCase)
	// UseCaseのインスタンスを作成
	useCase := do.MustInvoke[usecase.AppUserUseCase](injector)

	// ワークアウトトランザクションを実行
	result, err := useCase.FindUserById(ctx, 1)

	if err != nil {
		log.Fatalln("Error creating workout transaction:", err)
	}

	// 結果を表示
	fmt.Printf("result: %s\n", result.Email)
}
