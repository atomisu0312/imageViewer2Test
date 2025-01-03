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
	APIGroupNameForAuth         = "/myauth"
	PathShowPassCode            = "/passcode/:teamid"
	PathWelcomeNewUserTeam      = "/welcome/new/userteam"
	PathWelcomeNewFollowingUser = "/welcome/new/follower"
)

type authHandlerImpl struct {
	*handler
	authUsecase usecase.AuthUseCase
}

// AuthHandler は認証関連のAPIエンドポイントを提供するハンドラーです。
type AuthHandler interface {
	Handler
	ShowTeamPassCodeByID(c echo.Context) error
	WelcomeNewUserTeam(c echo.Context) error
	WelcomeNewFollowingUser(c echo.Context) error
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
	group.POST(PathWelcomeNewUserTeam, h.WelcomeNewUserTeam)
	group.POST(PathWelcomeNewFollowingUser, h.WelcomeNewFollowingUser)

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
	code, err := h.authUsecase.ExportPassCodeByTeamID(ctx, teamID)

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

// WelcomeNewUserTeamVM は、新しいユーザーチームを作成するためのVMです。
type WelcomeNewUserTeamVM struct {
	TeamName string `json:"team_name"`
	UserName string `json:"user_name"`
	Email    string `json:"email"`
}

// WelcomeNewUserTeam は、新しいユーザーチームを作成するエンドポイントです。
func (h *authHandlerImpl) WelcomeNewUserTeam(c echo.Context) error {
	ctx := c.Request().Context()
	vm := new(WelcomeNewUserTeamVM)

	if err := c.Bind(vm); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid JSON Parsing"})
	}

	result, err := h.authUsecase.MakeNewTeamAndUser(ctx, vm.TeamName, vm.UserName, vm.Email)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, result)
}

// WelcomeNewFollowingUserVM は、新しいユーザーチームを作成するためのVMです。
type WelcomeNewFollowingUserVM struct {
	PassCode string `json:"passcode"`
	UserName string `json:"user_name"`
	Email    string `json:"email"`
}

// WelcomeNewFollowingUser は、新しいユーザーチームを作成するエンドポイントです。
func (h *authHandlerImpl) WelcomeNewFollowingUser(c echo.Context) error {
	ctx := c.Request().Context()
	vm := new(WelcomeNewFollowingUserVM)

	if err := c.Bind(vm); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Wrong Request"})
	}

	validatePasscode, err := h.authUsecase.ValidatePassCode(ctx, vm.PassCode)
	if validatePasscode == nil {
		return c.JSON(http.StatusOK, map[string]string{"error": "Wrong Request"})
	}

	// パスコードからIDを取得
	teamID := validatePasscode["ID"].(int64)

	result, err := h.authUsecase.MakeNewFollowingUser(ctx, teamID, vm.UserName, vm.Email)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, result)
}
