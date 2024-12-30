package usecase

import (
	"context"
	"fmt"
	"image_viewer/account/gen"
	"image_viewer/account/repository"
	"image_viewer/account/transaction"
	"image_viewer/account/util"

	"github.com/samber/do"
)

type accountUseCaseImpl struct {
	*useCase
}

type AccountUseCase interface {
	UseCase
	// FindUserByIDはUserをIDで検索する
	// {"Name": "testuser", "Email": "sample@gmail.com"}
	FindUserByID(ctx context.Context, userID int64) (map[string]interface{}, error)
}

// NewAccountUseCase は新しい UseCase インスタンスを作成します
func NewAccountUseCase(i *do.Injector) (AccountUseCase, error) {
	return NewUseCase(i, func(u *useCase) AccountUseCase {
		return &accountUseCaseImpl{u}
	})
}

func (useCase *accountUseCaseImpl) emptyFunc() {}

// FindUserByIDはUserをIDで検索する
// {"Name": "testuser", "Email": "sample@gmail.com"}
func (useCase *accountUseCaseImpl) FindUserByID(ctx context.Context, userID int64) (map[string]interface{}, error) {
	var result gen.AppUser
	tr := transaction.NewTx(useCase.dbConn.DB)
	err := tr.ExecNonTx(ctx, func(q *gen.Queries) error {
		repo := repository.NewUserRepository(q)

		workout, err := repo.GetUserById(ctx, userID)

		if err != nil {
			return fmt.Errorf("error create workout %w", err)
		}

		result = workout
		return nil
	})

	// 必要な値のみを取り出す
	resultMap := util.FilterMapFields(util.StructToMap(result), "Name", "Email")

	return resultMap, err
}
