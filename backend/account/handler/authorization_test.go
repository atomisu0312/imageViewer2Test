package handler_test

import (
	"encoding/json"
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

// TestAuth は、認証関連のハンドラーのテストを行います。
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
	t.Run("ShowPassCodeのテスト 正常なIDの場合", func(t *testing.T) {

		teamIDStr := "1"

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
			result := rec.Body.String()
			var resultMap map[string]interface{}
			_ = json.Unmarshal([]byte(result), &resultMap)

			// ステータスコードと結果の確認
			assert.Equal(t, http.StatusOK, rec.Code)

			// 結果の確認
			//	- result: success
			//	- passcode: パスコードが空文字でないこと
			assert.Equal(t, "success", resultMap["result"].(string), "result should be success")
			assert.True(t, len(resultMap["passcode"].(string)) > 0, "passcode should not be empty")
		}
	})
}
