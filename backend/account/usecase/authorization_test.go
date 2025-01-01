package usecase_test

import (
	"context"
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
		code, err := testee.ExportPassCodeByTeamId(ctx, 1)

		if err != nil {
			log.Fatalln("Error creating workout transaction:", err)
		}

		// Tokenからチーム情報を復元
		decoded, err := testee.DecodePassCodeByTeamId(ctx, code)

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
		code, _ := testee.ExportPassCodeByTeamId(ctx, testeeId)

		// 空文字が返却されていることを確認
		assert.Equal(t, "", code, "Code Should be Empty")
	})
}
