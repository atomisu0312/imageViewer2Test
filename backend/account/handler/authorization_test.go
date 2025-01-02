package handler_test

import (
	"encoding/json"
	"fmt"
	"image_viewer/account/app"
	"image_viewer/account/config"
	"image_viewer/account/handler"
	"image_viewer/account/util"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/labstack/echo/v4"
	_ "github.com/lib/pq"
	"github.com/samber/do"
	"github.com/stretchr/testify/assert"
)

const ()

// TestAuthShowPassCode は、認証関連のハンドラーのテストを行います。
func TestAuthShowPassCode(t *testing.T) {

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
		c.SetPath(fmt.Sprintf("%s%s", handler.APIGroupNameForAuth, handler.PathShowPassCode))
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

func getTeamByIDCheck(idStr string, accountHandler *handler.AccountHandler) (string, error) {

	e := echo.New()
	reqGet := httptest.NewRequest(http.MethodGet, "/", nil)
	recGet := httptest.NewRecorder()
	c2 := e.NewContext(reqGet, recGet)

	// パスに関する設定
	c2.SetPath(fmt.Sprintf("%s%s", handler.APIGroupName, handler.PathGetTeamByID))
	c2.SetParamNames("id")
	c2.SetParamValues(idStr)

	err := (*accountHandler).GetTeamByID(c2)
	return recGet.Body.String(), err
}

// TestAuthShowPassCode は、認証関連のハンドラーのテストを行います。
func TestAuthWelcome(t *testing.T) {

	t.Run("新規登録系エンドポイント 新規ユーザおよび新規チームを作成", func(t *testing.T) {

		config.BeforeEachForUnitTest()      // テスト前処理
		defer config.AfterEachForUnitTest() // テスト後処理

		// DIコンテナ内の依存関係を設定
		injector := app.SetupDIContainer()
		do.Override(injector, config.TestDbConnection)

		// ハンドラをコンテナから取得
		testee := do.MustInvoke[handler.AuthHandler](injector)
		accountHandler := do.MustInvoke[handler.AccountHandler](injector)

		submitJSON := `{"team_name":"testteam2","user_name":"testuser2","email":"test2@gmail.com"}`

		// 送信するJSONをMapに変換し、必要な値を抽出しておく
		convertedMap, _ := util.JsonToMap(submitJSON)
		team_name := convertedMap["team_name"].(string)

		// アプリケーションおよびHTTPリクエストのセットアップ
		e := echo.New()
		req := httptest.NewRequest(http.MethodGet, "/", strings.NewReader(submitJSON))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		// Assertions
		if assert.NoError(t, testee.WelcomeNewUserTeam(c)) {
			println("rec.Body.String(): ", rec.Body.String())
			assert.Equal(t, http.StatusOK, rec.Code)
		}

		// 以下、チームが作成されたことを確認する
		teamJSON2 := fmt.Sprintf(`{"Name":"%s"}`, team_name)
		result, _ := getTeamByIDCheck("2", &accountHandler)
		assert.JSONEq(t, teamJSON2, result)

	})
}
