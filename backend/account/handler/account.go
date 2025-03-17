// Package handler provides HTTP handlers for account-related operations.
package handler

import (
	"image_viewer/account/usecase"
	"net/http"
	"strconv"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/samber/do"
	"go.uber.org/zap"
)

// 以下、他のパッケージから参照できる定数を定義する
const (
	APIGroupName            = "/account"
	PathGetUserByID         = "/users/:id"
	PathGetTeamByID         = "/teams/:id"
	PathGetAllocationSearch = "/allocationSearch"
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
	start := time.Now()
	defer h.logRequest(c, start)

	ctx := c.Request().Context()
	userIDStr := c.Param("id")

	h.logger.Debug("Getting user by ID", zap.String("user_id", userIDStr))

	// string を int64 に変換
	userID, err := strconv.ParseInt(userIDStr, 10, 64)
	if err != nil {
		h.logError(err, zap.String("user_id", userIDStr))
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"status": "error",
			"error": map[string]interface{}{
				"code":    "INVALID_USER_ID",
				"message": "無効なユーザーIDです",
			},
		})
	}

	// ユースケースを用いてユーザー情報を取得
	result, err := h.accountUsecase.FindUserByID(ctx, userID)
	if err != nil {
		h.logError(err, zap.Int64("user_id", userID))
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"status": "error",
			"error": map[string]interface{}{
				"code":    "USER_NOT_FOUND",
				"message": "ユーザーが見つかりませんでした",
			},
		})
	}

	h.logger.Info("Successfully retrieved user", zap.Int64("user_id", userID))
	return c.JSON(http.StatusOK, map[string]interface{}{
		"status": "success",
		"data":   result,
	})
}

// GetTeamByID は、チームIDを指定してチーム情報を取得するエンドポイントです。
func (h *accountHandlerImpl) GetTeamByID(c echo.Context) error {
	start := time.Now()
	defer h.logRequest(c, start)

	ctx := c.Request().Context()
	teamIDStr := c.Param("id")

	h.logger.Debug("Getting team by ID", zap.String("team_id", teamIDStr))

	// string を int64 に変換
	teamID, err := strconv.ParseInt(teamIDStr, 10, 64)
	if err != nil {
		h.logError(err, zap.String("team_id", teamIDStr))
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"status": "error",
			"error": map[string]interface{}{
				"code":    "INVALID_TEAM_ID",
				"message": "無効なチームIDです",
			},
		})
	}

	// ユースケースを用いてチーム情報を取得
	result, err := h.accountUsecase.FindTeamByID(ctx, teamID)
	if err != nil {
		h.logError(err, zap.Int64("team_id", teamID))
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"status": "error",
			"error": map[string]interface{}{
				"code":    "TEAM_NOT_FOUND",
				"message": "チームが見つかりませんでした",
			},
		})
	}

	h.logger.Info("Successfully retrieved team", zap.Int64("team_id", teamID))
	return c.JSON(http.StatusOK, map[string]interface{}{
		"status": "success",
		"data":   result,
	})
}

type GetAllocationsSearchVM struct {
	TeamID int64  `query:"teamid"`
	Email  string `query:"email"`
}

// GetAllocationsSearch は、チームIDとメールアドレスを指定して割り当て情報を検索するエンドポイントです。
func (h *accountHandlerImpl) GetAllocationsSearch(c echo.Context) error {
	start := time.Now()
	defer h.logRequest(c, start)

	ctx := c.Request().Context()
	vm := new(GetAllocationsSearchVM)
	if err := c.Bind(vm); err != nil {
		h.logError(err)
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"status": "error",
			"error": map[string]interface{}{
				"code":    "INVALID_REQUEST",
				"message": "無効なリクエストです",
			},
		})
	}

	h.logger.Debug("Searching allocations",
		zap.Int64("team_id", vm.TeamID),
		zap.String("email", vm.Email))

	// ユースケースを用いて割り当て情報を検索
	result, err := h.accountUsecase.FindAllocationByTeamIDAndEmail(ctx, vm.Email, vm.TeamID)
	if err != nil {
		h.logError(err,
			zap.Int64("team_id", vm.TeamID),
			zap.String("email", vm.Email))
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"status": "error",
			"error": map[string]interface{}{
				"code":    "ALLOCATION_NOT_FOUND",
				"message": "割り当て情報が見つかりませんでした",
			},
		})
	}

	h.logger.Info("Successfully retrieved allocations",
		zap.Int64("team_id", vm.TeamID),
		zap.String("email", vm.Email))
	return c.JSON(http.StatusOK, map[string]interface{}{
		"status": "success",
		"data":   result,
	})
}
