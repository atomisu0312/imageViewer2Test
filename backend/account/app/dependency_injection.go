package app

import (
	"image_viewer/account/config"
	"image_viewer/account/handler"
	"image_viewer/account/usecase"

	_ "github.com/lib/pq" // PostgreSQL ドライバをインポート
	"github.com/samber/do"
)

// SetupDIContainer はDIコンテナをセットアップします
// テストなどでコンテナの中身をオーバーライドしたい場合には、
// samba/doのOverride関数を使って上書きしてください
func SetupDIContainer() *do.Injector {
	injector := do.New()
	// DBコネクション
	do.Provide(injector, config.NewDbConnection)

	// ユースケース
	do.Provide(injector, usecase.NewAccountUseCase)

	// ハンドラー
	do.Provide(injector, handler.NewAccountHandler)

	return injector
}
