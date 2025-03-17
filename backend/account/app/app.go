package app

import (
	"image_viewer/account/util/logger"
	"log"

	"github.com/labstack/echo/v4"
	"github.com/samber/do"
)

// App は、アプリケーションの設定とDIを管理します。
type App struct {
	Echo *echo.Echo
	DI   *do.Injector
}

// NewApp は、新しいAppインスタンスを作成します。
func NewApp() (*App, error) {
	// ロガーの初期化
	if err := logger.InitLogger(); err != nil {
		log.Fatalf("Failed to initialize logger: %v", err)
	}

	// DIコンテナの作成
	di := do.New()

	// Echoの設定
	e := echo.New()

	return &App{
		Echo: e,
		DI:   di,
	}, nil
}

// Run は、アプリケーションを起動します。
func (a *App) Run() error {
	logger.Info("Starting application")
	return a.Echo.Start(":8080")
}
