package handler

import (
	"image_viewer/account/usecase"
	"log"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/samber/do"
)

// 以下、他のパッケージから参照できる定数を定義する
const (
	APIGroupNameForAuth = "/account"
	PathShowPassCode    = "/showPassCode/:teamid"
)

type authHandlerImpl struct {
	*handler
	authUsecase usecase.AuthUseCase
}

// AuthHandler は認証関連のAPIエンドポイントを提供するハンドラーです。
type AuthHandler interface {
	Handler
	ShowTeamPassCodeByID(c echo.Context) error
}

// NewAuthHandler NewAuthHandler の新しいインスタンスを作成します。
func NewAuthHandler(i *do.Injector) (AuthHandler, error) {
	return NewHandler(func(h *handler) AuthHandler {
		return &authHandlerImpl{h, do.MustInvoke[usecase.AuthUseCase](i)}
	})
}

// AddHandler は、APIグループにハンドラーを追加します。
func (h *authHandlerImpl) AddHandler(api *echo.Group) {
	group := api.Group(APIGroupNameForAuth)
	group.GET(PathShowPassCode, h.ShowTeamPassCodeByID)
}

// ShowTeamPassCodeByID は、チームIDを指定してチームのパスコードを取得するエンドポイントです。
func (h *authHandlerImpl) ShowTeamPassCodeByID(c echo.Context) error {
	ctx := c.Request().Context()
	teamIDStr := c.Param("teamid")

	log.Default().Println("teamIDStr: ", teamIDStr)

	// string を int64 に変換
	teamID, err := strconv.ParseInt(teamIDStr, 10, 64)

	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid user ID"})
	}

	// ユースケースを用いてユーザー情報を取得
	code, err := h.authUsecase.ExportPassCodeByTeamId(ctx, teamID)

	// resultの初期値値を定義
	result := make(map[string]interface{})
	result["passcode"] = code
	result["teamID"] = teamID

	switch {
	case len(code) > 0:
		result["result"] = "success"
	default:
		result["result"] = "failed"
	}

	return c.JSON(http.StatusOK, result)
}
