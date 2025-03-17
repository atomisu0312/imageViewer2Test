package logger

import (
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var globalLogger *zap.Logger

// InitLogger は、グローバルロガーを初期化します。
func InitLogger() error {
	// 開発環境用の設定
	config := zap.NewDevelopmentConfig()
	config.EncoderConfig.TimeKey = "timestamp"
	config.EncoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
	config.EncoderConfig.StacktraceKey = "" // スタックトレースは開発時のみ出力

	// ロガーの作成
	logger, err := config.Build()
	if err != nil {
		return err
	}

	globalLogger = logger
	return nil
}

// GetLogger は、グローバルロガーを取得します。
func GetLogger() *zap.Logger {
	if globalLogger == nil {
		// ロガーが初期化されていない場合は、標準の開発用ロガーを作成
		logger, _ := zap.NewDevelopment()
		globalLogger = logger
	}
	return globalLogger
}

// Info は、INFOレベルのログを出力します。
func Info(msg string, fields ...zap.Field) {
	GetLogger().Info(msg, fields...)
}

// Error は、ERRORレベルのログを出力します。
func Error(msg string, fields ...zap.Field) {
	GetLogger().Error(msg, fields...)
}

// Debug は、DEBUGレベルのログを出力します。
func Debug(msg string, fields ...zap.Field) {
	GetLogger().Debug(msg, fields...)
}

// WithContext は、コンテキスト情報を含むロガーを返します。
func WithContext(fields ...zap.Field) *zap.Logger {
	return GetLogger().With(fields...)
}
