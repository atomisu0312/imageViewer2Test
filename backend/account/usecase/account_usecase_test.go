package usecase

import (
	"context"
	"image_viewer/account/config"
	"log"
	"os"
	"testing"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/samber/do"
	"github.com/stretchr/testify/assert"
)

var dbConn *config.DbConn
var userUseCase UserUseCase
var injector *do.Injector

func TestMain(m *testing.M) {
	godotenv.Load("../.env")
	injector = do.New()

	do.Provide(injector, config.TestDbConnection)

	dbConn = do.MustInvoke[*config.DbConn](injector)

	do.Provide(injector, NewAppUseCase)

	// UseCaseのインスタンスを作成
	userUseCase = do.MustInvoke[UserUseCase](injector)

	// Clean up: Delete the inserted data
	_, err := dbConn.Exec(`
		DELETE FROM app_user;
		DELETE FROM app_team;
	`)

	if err != nil {
		log.Fatalf("Failed to delete test data: %v", err)
	}

	// Insert initial data
	_, err = dbConn.Exec(`
        INSERT INTO app_user (id, name, email) VALUES (1, 'testUser', 'testuser@example.com');
        INSERT INTO app_team (id, name) VALUES (1, 'testteam');
    `)
	if err != nil {
		log.Fatalf("Failed to insert initial data: %v", err)
	}

	// Run tests
	code := m.Run()

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
	os.Exit(code)
}

func TestFindUserById(t *testing.T) {
	ctx := context.Background()

	// ユースケースの実行
	result, err := userUseCase.FindUserById(ctx, 1)

	if err != nil {
		log.Fatalln("Error creating workout transaction:", err)
	}

	// 結果を表示
	assert.Equal(t, "testUser", result.Name, "The user's name should be 'testuser'")
}
