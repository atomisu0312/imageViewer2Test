package handler_test

import (
	"fmt"
	"image_viewer/account/app"
	"image_viewer/account/config"
	"image_viewer/account/handler"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/labstack/echo/v4"
	_ "github.com/lib/pq"
	"github.com/samber/do"
	"github.com/stretchr/testify/assert"
)

const ()

func TestAuth(t *testing.T) {

	t.Run("ShowPassCodeのテスト 不正なIDの場合", func(t *testing.T) {

		teamIDStr := "13"
		passCodeJSON := fmt.Sprintf(`{"passcode":"","result":"failed", "teamID":%s}`, teamIDStr)

		config.BeforeEachForUnitTest()      // テスト前処理
		defer config.AfterEachForUnitTest() // テスト後処理

		// DIコンテナ内の依存関係を設定
		injector := app.SetupDIContainer()
		do.Override(injector, config.TestDbConnection)

		// ハンドラをコンテナから取得
		testee := do.MustInvoke[handler.AuthHandler](injector)

		// アプリケーションおよびHTTPリクエストのセットアップ
		e := echo.New()
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		// パスに関する設定
		c.SetPath(fmt.Sprintf("%s%s", handler.APIGroupName, handler.PathGetUserByID))
		c.SetParamNames("teamid")
		c.SetParamValues(teamIDStr)

		// Assertions
		if assert.NoError(t, testee.ShowTeamPassCodeByID(c)) {
			assert.Equal(t, http.StatusOK, rec.Code)
			assert.JSONEq(t, passCodeJSON, rec.Body.String())
		}
	})
}
