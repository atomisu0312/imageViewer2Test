package handler

import (
	"image_viewer/account/config"
	"image_viewer/account/usecase"
	"log"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
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

var (
	userJSON = `{"name":"Jon Snow","email":"jon@labstack.com"}`
)

func TestGetUser(t *testing.T) {

	t.Run("正常系01 パラメーター(names []string)のサイズ1", func(t *testing.T) {
		beforeEach()      // テスト前処理
		defer afterEach() // テスト後処理

		// DIコンテナ内の依存関係を設定
		injector := do.New()
		do.Provide(injector, config.TestDbConnection)
		do.Provide(injector, usecase.NewAccountUseCase)
		do.Provide(injector, NewAccountHandler)
		// ハンドラをコンテナから取得
		accountHandler := do.MustInvoke[AccountHandler](injector)

		// Setup
		e := echo.New()
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		c.SetPath("/account/users/:id")
		c.SetParamNames("id")
		c.SetParamValues("1")

		// Assertions
		if assert.NoError(t, accountHandler.getUserById(c)) {
			assert.Equal(t, http.StatusOK, rec.Code)
			assert.Equal(t, userJSON, rec.Body.String())
		}
	})
}
