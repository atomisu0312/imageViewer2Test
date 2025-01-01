package handler_test

import (
	"fmt"
	"image_viewer/account/app"
	"image_viewer/account/config"
	"image_viewer/account/handler"
	"log"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"

	"github.com/labstack/echo/v4"
	_ "github.com/lib/pq"
	"github.com/samber/do"
	"github.com/stretchr/testify/assert"
)

const (
	userJSON  = `{"Email":"testuser@example.com","Name":"testuser"}`
	teamJSON  = `{"Name":"testteam"}`
	allocJSON = `{"ID":1, "WriteLevel":3,"ReadLevel":3}`
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

	t.Run("GetAllocationByEmailAndTeamIDのテスト", func(t *testing.T) {
		config.BeforeEachForUnitTest()      // テスト前処理
		defer config.AfterEachForUnitTest() // テスト後処理

		// DIコンテナ内の依存関係を設定
		injector := app.SetupDIContainer()
		do.Override(injector, config.TestDbConnection)

		// ハンドラをコンテナから取得
		accountHandler := do.MustInvoke[handler.AccountHandler](injector)

		// アプリケーションおよびHTTPリクエストのセットアップ
		e := echo.New()

		// クエリに関する設定
		q := make(url.Values)
		q.Set("email", "testuser@example.com") // "testuser@example.com", 1
		q.Set("teamid", "1")
		req := httptest.NewRequest(http.MethodGet, "/?"+q.Encode(), nil)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)
		c.SetPath(fmt.Sprintf("%s%s", handler.APIGroupName, handler.PathGetAllocationSearch))

		// Assertions
		if assert.NoError(t, accountHandler.GetAllocationsSearch(c)) {
			assert.Equal(t, http.StatusOK, rec.Code)
			assert.JSONEq(t, allocJSON, rec.Body.String())
			log.Default().Println("c.Path(): ", rec.Body.String())
		}
	})
}
