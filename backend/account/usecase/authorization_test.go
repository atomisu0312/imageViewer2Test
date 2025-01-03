package usecase_test

import (
	"context"
	"fmt"
	"image_viewer/account/app"
	"image_viewer/account/config"
	"image_viewer/account/env"
	"image_viewer/account/usecase"
	"log"
	"testing"

	"github.com/samber/do"
	"github.com/stretchr/testify/assert"
)

var (
	samplePassCode    = "samplePassCode"
	AuthSecret        = env.GetAsString("AUTH_JWT_SECRET", "auth_secret")
	AuthInterleaveDim = env.GetAsInt("AUTH_INTERLEAVE_DIM", 19)
	JWTToken          = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZWFtX2lkIjoxLCJ0ZWFtX25hbWUiOiJ0ZWFtQSJ9.wv-cSUzAdurX91IlI5Re5Qmm-G2MZCamV1ATuoS0z1k"
)

// 正常系テスト
func TestAuthPassCode(t *testing.T) {
	t.Run("正常系01 TeamID指定でチーム用認証コードが取得できることを確認", func(t *testing.T) {
		config.BeforeEachForUnitTest()      // テスト前処理
		defer config.AfterEachForUnitTest() // テスト後処理

		// DIコンテナ内の依存関係を設定
		injector := app.SetupDIContainer()
		do.Override(injector, config.TestDbConnection)

		// UseCaseのインスタンスを作成
		testee := do.MustInvoke[usecase.AuthUseCase](injector)

		// コンテキストを作成
		ctx := context.Background()

		// ユースケースの実行
		code, err := testee.ExportPassCodeByTeamID(ctx, 1)

		if err != nil {
			log.Fatalln("Error creating workout transaction:", err)
		}

		// Tokenからチーム情報を復元
		decoded, err := testee.DecodePassCode(ctx, code)

		log.Default().Println("devodedInfo", decoded)

		// 結果を表示
		assert.Equal(t, "testteam", decoded["team_name"], "Decoded TeamName is Wrong")
		assert.Equal(t, int64(1), int64(decoded["team_id"].(float64)), "Decoded TeamID is Wrong")

	})
	t.Run("異常系01 存在しないTeamID指定では失敗することを確認", func(t *testing.T) {
		config.BeforeEachForUnitTest()      // テスト前処理
		defer config.AfterEachForUnitTest() // テスト後処理

		testeeId := int64(999)

		// DIコンテナ内の依存関係を設定
		injector := app.SetupDIContainer()
		do.Override(injector, config.TestDbConnection)

		// UseCaseのインスタンスを作成
		testee := do.MustInvoke[usecase.AuthUseCase](injector)

		// コンテキストを作成
		ctx := context.Background()

		// ユースケースの実行
		code, _ := testee.ExportPassCodeByTeamID(ctx, testeeId)

		// 空文字が返却されていることを確認
		assert.Equal(t, "", code, "Code Should be Empty")
	})
}

// 新規登録時の動作のテスト
func TestWelcomeAuth(t *testing.T) {
	t.Run("正常系02.01. 新規チームとユーザを作成する動作", func(t *testing.T) {
		config.BeforeEachForUnitTest()      // テスト前処理
		defer config.AfterEachForUnitTest() // テスト後処理

		// DIコンテナ内の依存関係を設定
		injector := app.SetupDIContainer()
		do.Override(injector, config.TestDbConnection)

		// UseCaseのインスタンスを作成
		testee := do.MustInvoke[usecase.AuthUseCase](injector)

		// コンテキストを作成
		ctx := context.Background()

		// パラメータの準備
		teamName := "testteam2"
		userName := "testuser2"
		email := "test2@example.com"

		// ユースケースの実行
		_, err := testee.MakeNewTeamAndUser(ctx, teamName, userName, email)

		if err != nil {
			log.Fatalln("Error creating workout transaction:", err)
		}

		accountUseCase := do.MustInvoke[usecase.AccountUseCase](injector)
		searchedUser, err := accountUseCase.FindUserByID(ctx, int64(2))
		searchedTeam, err := accountUseCase.FindTeamByID(ctx, int64(2))

		// 結果を表示
		assert.Equal(t, userName, searchedUser["Name"], fmt.Sprintf("expected user name is %s", userName))
		assert.Equal(t, email, searchedUser["Email"], fmt.Sprintf("expected email is %s", email))
		assert.Equal(t, teamName, searchedTeam["Name"], fmt.Sprintf("expected team name is %s", teamName))

	})

	t.Run("02.02.  パスコードの検証", func(t *testing.T) {
		config.BeforeEachForUnitTest()      // テスト前処理
		defer config.AfterEachForUnitTest() // テスト後処理

		// DIコンテナ内の依存関係を設定
		injector := app.SetupDIContainer()
		do.Override(injector, config.TestDbConnection)

		// UseCaseのインスタンスを作成
		testee := do.MustInvoke[usecase.AuthUseCase](injector)

		// コンテキストを作成
		ctx := context.Background()

		// パラメータの準備
		passCodeForTeam1, err := testee.ExportPassCodeByTeamID(ctx, int64(1))
		if err != nil {
			log.Fatalln("Failed to generate passcode:", err)
		}

		// パスコードの検証
		// 正しいパスコードであればチーム情報が返却される
		result1, err := testee.ValidatePassCode(ctx, passCodeForTeam1)
		assert.Equal(t, "testteam", result1["Name"], "TeamName should be 'testteam'")

		// 不正なパスコードであればnilが返却される
		result2, err := testee.ValidatePassCode(ctx, "dummy")
		assert.Equal(t, nil, result2["Name"], "Team should be 'nil'")
	})
}
