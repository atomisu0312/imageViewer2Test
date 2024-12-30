package usecase_test

import (
	"context"
	"image_viewer/account/app"
	"image_viewer/account/config"
	"image_viewer/account/usecase"
	"log"
	"testing"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/samber/do"
	"github.com/stretchr/testify/assert"
)

func beforeEach() {
	godotenv.Load("../.env")

	injector := do.New()

	do.Provide(injector, config.TestDbConnection)

	dbConn := do.MustInvoke[*config.DbConn](injector)

	// Insert initial data
	_, err := dbConn.Exec(`
        INSERT INTO app_user (id, name, email) VALUES (1, 'testuser', 'testuser@example.com');
        INSERT INTO app_team (id, name) VALUES (1, 'testteam');
    `)
	if err != nil {
		log.Fatalf("Failed to insert initial data: %v", err)
	}
	// Clean up
	dbConn.Close()

}

func afterEach() {
	injector := do.New()

	do.Provide(injector, config.TestDbConnection)

	dbConn := do.MustInvoke[*config.DbConn](injector)

	var err error
	// Clean up: Delete the inserted data
	_, err = dbConn.Exec(`
			DELETE FROM app_user;
			DELETE FROM app_team;
	`)

	if err != nil {
		log.Fatalf("Failed to delete test data: %v", err)
	}

	// Clean up
	dbConn.Close()

}

// 正常系テスト
func TestPositive(t *testing.T) {
	t.Run("正常系01 ID指定で適切に値が返却されていることを確認", func(t *testing.T) {
		beforeEach()      // テスト前処理
		defer afterEach() // テスト後処理

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
