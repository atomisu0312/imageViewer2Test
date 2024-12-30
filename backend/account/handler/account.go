package handler

import (
	"image_viewer/account/usecase"
	"log"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/samber/do"
)

type accountHandlerImpl struct {
	*handler
	userUsecase usecase.AccountUseCase
}

type AccountHandler interface {
	Handler
	getUserById(c echo.Context) error
}

func NewAccountHandler(i *do.Injector) (AccountHandler, error) {
	return NewHandler(func(h *handler) AccountHandler {
		return &accountHandlerImpl{h, do.MustInvoke[usecase.AccountUseCase](i)}
	})
}

func (h *accountHandlerImpl) AddHandler(api *echo.Group) {
	group := api.Group("/account")
	group.GET("/users/:id", h.getUserById)
}

func (h *accountHandlerImpl) getUserById(c echo.Context) error {
	ctx := c.Request().Context()
	userIdStr := c.Param("id")

	log.Default().Println("userIdStr: ", userIdStr)

	// string を int64 に変換
	userId, err := strconv.ParseInt(userIdStr, 10, 64)

	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid user ID"})
	}

	result, err := h.userUsecase.FindUserByID(ctx, userId)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "User not found"})
	}

	return c.JSON(http.StatusOK, result)
}
