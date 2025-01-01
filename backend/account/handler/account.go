// Package handler provides HTTP handlers for account-related operations.
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
	APIGroupName            = "/account"
	PathGetUserByID         = "/users/:id"
	PathGetTeamByID         = "/teams/:id"
	PathGetAllocationSearch = "/allocationsSearch"
)

type accountHandlerImpl struct {
	*handler
	accountUsecase usecase.AccountUseCase
}

// AccountHandler は、アカウント関連のAPIエンドポイントを提供するハンドラーです。
type AccountHandler interface {
	Handler
	GetUserByID(c echo.Context) error
	GetTeamByID(c echo.Context) error
	GetAllocationsSearch(c echo.Context) error
}

// NewAccountHandler は、AccountHandler の新しいインスタンスを作成します。
func NewAccountHandler(i *do.Injector) (AccountHandler, error) {
	return NewHandler(func(h *handler) AccountHandler {
		return &accountHandlerImpl{h, do.MustInvoke[usecase.AccountUseCase](i)}
	})
}

// AddHandler は、APIグループにハンドラーを追加します。
func (h *accountHandlerImpl) AddHandler(api *echo.Group) {
	group := api.Group(APIGroupName)
	group.GET(PathGetUserByID, h.GetUserByID)
	group.GET(PathGetTeamByID, h.GetTeamByID)
	group.GET(PathGetAllocationSearch, h.GetAllocationsSearch)
}

// GetUserByID は、ユーザーIDを指定してユーザー情報を取得するエンドポイントです。
func (h *accountHandlerImpl) GetUserByID(c echo.Context) error {
	ctx := c.Request().Context()
	userIDStr := c.Param("id")

	log.Default().Println("userIDStr: ", userIDStr)

	// string を int64 に変換
	userID, err := strconv.ParseInt(userIDStr, 10, 64)

	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid user ID"})
	}

	// ユースケースを用いてユーザー情報を取得
	result, err := h.accountUsecase.FindUserByID(ctx, userID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "User not found"})
	}

	return c.JSON(http.StatusOK, result)
}

// GetTeamByID は、チームIDを指定してチーム情報を取得するエンドポイントです。
func (h *accountHandlerImpl) GetTeamByID(c echo.Context) error {
	ctx := c.Request().Context()
	userIDStr := c.Param("id")

	log.Default().Println("teamIDStr: ", userIDStr)

	// string を int64 に変換
	userID, err := strconv.ParseInt(userIDStr, 10, 64)

	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid user ID"})
	}

	// ユースケースを用いてユーザー情報を取得
	result, err := h.accountUsecase.FindTeamByID(ctx, userID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "User not found"})
	}

	return c.JSON(http.StatusOK, result)
}

// GetAllocationsSearch は、チームIDを指定してチーム情報を取得するエンドポイントです。
func (h *accountHandlerImpl) GetAllocationsSearch(c echo.Context) error {
	ctx := c.Request().Context()
	email := c.QueryParam("email")
	teamIDString := c.QueryParam("teamid")

	teamID, err := strconv.ParseInt(teamIDString, 10, 64)

	log.Default().Println("teamIDStr: ", email)

	// ユースケースを用いてユーザー情報を取得
	result, err := h.accountUsecase.FindAllocationByTeamIDAndEmail(ctx, email, teamID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Allocation not found"})
	}

	return c.JSON(http.StatusOK, result)
}
