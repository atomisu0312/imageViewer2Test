package usecase_test

import (
	"context"
	"image_viewer/account/app"
	"image_viewer/account/config"
	"image_viewer/account/usecase"
	"log"
	"testing"

	_ "github.com/lib/pq"
	"github.com/samber/do"
	"github.com/stretchr/testify/assert"
)

// 正常系テスト
func TestPositive(t *testing.T) {
	t.Run("正常系01 ID指定でUserが取得できることを確認", func(t *testing.T) {
		config.BeforeEachForUnitTest()      // テスト前処理
		defer config.AfterEachForUnitTest() // テスト後処理

		// DIコンテナ内の依存関係を設定
		injector := app.SetupDIContainer()
		do.Override(injector, config.TestDbConnection)

		// UseCaseのインスタンスを作成
		accountUseCase := do.MustInvoke[usecase.AccountUseCase](injector)

		// コンテキストを作成
		ctx := context.Background()

		// ユースケースの実行
		result, err := accountUseCase.FindUserByID(ctx, 1)

		if err != nil {
			log.Fatalln("Error creating workout transaction:", err)
		}

		// 結果を表示
		assert.Equal(t, "testuser", result["Name"], "The user's name should be 'testuser'")
		assert.Equal(t, "testuser@example.com", result["Email"], "The user's name should be 'testuser'")
	})
}

// 正常系テスト
func TestPositiveForTeam(t *testing.T) {
	t.Run("正常系02 ID指定でTeamが取得できることを確認", func(t *testing.T) {
		config.BeforeEachForUnitTest()      // テスト前処理
		defer config.AfterEachForUnitTest() // テスト後処理

		// DIコンテナ内の依存関係を設定
		injector := app.SetupDIContainer()
		do.Override(injector, config.TestDbConnection)

		// UseCaseのインスタンスを作成
		accountUseCase := do.MustInvoke[usecase.AccountUseCase](injector)

		// コンテキストを作成
		ctx := context.Background()

		// ユースケースの実行
		result, err := accountUseCase.FindTeamByID(ctx, 1)

		if err != nil {
			log.Fatalln("Error creating workout transaction:", err)
		}

		// 結果を表示
		assert.Equal(t, "testteam", result["Name"], "The team's name should be 'testteam'")
	})
}
