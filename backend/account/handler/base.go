package handler

import (
	"image_viewer/account/util/logger"
	"time"

	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
)

// Handler は、HTTPハンドラーの基本インターフェースです。
type Handler interface {
	AddHandler(api *echo.Group)
}

// handler は、ハンドラーの基本構造体です。
type handler struct {
	logger *zap.Logger
}

// NewHandler は、新しいハンドラーを作成します。
func NewHandler[T Handler](f func(*handler) T) (T, error) {
	h := &handler{
		logger: logger.GetLogger(),
	}
	return f(h), nil
}

// logRequest は、リクエストのログを出力します。
func (h *handler) logRequest(c echo.Context, start time.Time) {
	req := c.Request()
	res := c.Response()

	fields := []zap.Field{
		zap.String("method", req.Method),
		zap.String("path", req.URL.Path),
		zap.Int("status", res.Status),
		zap.Duration("latency", time.Since(start)),
		zap.String("remote_ip", c.RealIP()),
	}

	if userID := c.Get("user_id"); userID != nil {
		fields = append(fields, zap.Any("user_id", userID))
	}

	h.logger.Info("HTTP Request", fields...)
}

// logError は、エラーのログを出力します。
func (h *handler) logError(err error, fields ...zap.Field) {
	h.logger.Error("Error occurred", append(fields, zap.Error(err))...)
}
