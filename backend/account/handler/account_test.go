package handler_test

import (
	"fmt"
	"image_viewer/account/app"
	"image_viewer/account/config"
	"image_viewer/account/handler"
	"log"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/labstack/echo/v4"
	_ "github.com/lib/pq"
	"github.com/samber/do"
	"github.com/stretchr/testify/assert"
)

const (
	userJSON = `{"Email":"testuser@example.com","Name":"testuser"}`
	teamJSON = `{"Name":"testteam"}`
)

func TestGetUser(t *testing.T) {

	t.Run("getUserByIdのテスト", func(t *testing.T) {
		config.BeforeEachForUnitTest()      // テスト前処理
		defer config.AfterEachForUnitTest() // テスト後処理

		// DIコンテナ内の依存関係を設定
		injector := app.SetupDIContainer()
		do.Override(injector, config.TestDbConnection)

		// ハンドラをコンテナから取得
		accountHandler := do.MustInvoke[handler.AccountHandler](injector)

		// アプリケーションおよびHTTPリクエストのセットアップ
		e := echo.New()
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		// パスに関する設定
		c.SetPath(fmt.Sprintf("%s%s", handler.APIGroupName, handler.PathGetUserByID))
		c.SetParamNames("id")
		c.SetParamValues("1")

		// Assertions
		if assert.NoError(t, accountHandler.GetUserByID(c)) {
			assert.Equal(t, http.StatusOK, rec.Code)
			assert.JSONEq(t, userJSON, rec.Body.String())
		}
	})

	t.Run("getTeamByIdのテスト", func(t *testing.T) {
		config.BeforeEachForUnitTest()      // テスト前処理
		defer config.AfterEachForUnitTest() // テスト後処理

		// DIコンテナ内の依存関係を設定
		injector := app.SetupDIContainer()
		do.Override(injector, config.TestDbConnection)

		// ハンドラをコンテナから取得
		accountHandler := do.MustInvoke[handler.AccountHandler](injector)

		// アプリケーションおよびHTTPリクエストのセットアップ
		e := echo.New()
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		// パスに関する設定
		c.SetPath(fmt.Sprintf("%s%s", handler.APIGroupName, handler.PathGetTeamByID))
		c.SetParamNames("id")
		c.SetParamValues("1")

		// Assertions
		if assert.NoError(t, accountHandler.GetTeamByID(c)) {
			assert.Equal(t, http.StatusOK, rec.Code)
			assert.JSONEq(t, teamJSON, rec.Body.String())
			log.Default().Println("c.Path(): ", rec.Body.String())
		}
	})
}
