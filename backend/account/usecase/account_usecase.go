package usecase

import (
	"context"
	"fmt"
	"image_viewer/account/gen"
	"image_viewer/account/repository"
	"image_viewer/account/transaction"

	"github.com/samber/do"
)

type useAppUserUseCaseImpl struct {
	*useCase
}

type AppUserUseCase interface {
	FindUserById(ctx context.Context, userId int64) (gen.AppUser, error)
}

// NewUseCase は新しい UseCase インスタンスを作成します
func NewAppUseCase(i *do.Injector) (AppUserUseCase, error) {
	return NewUseCase(i, func(u *useCase) AppUserUseCase {
		return &useAppUserUseCaseImpl{u}
	})
}

// AddWorkoutTx はワークアウトを作成するトランザクションを実行します
func (useCase *useAppUserUseCaseImpl) FindUserById(ctx context.Context, userId int64) (gen.AppUser, error) {
	var result gen.AppUser
	tr := transaction.NewTx(useCase.dbConn.DB)
	err := tr.ExecTx(ctx, func(q *gen.Queries) error {
		repo := repository.NewAccountRepository(q)

		workout, err := repo.GetUserById(ctx, userId)

		if err != nil {
			return fmt.Errorf("error create workout %w", err)
		}

		result = workout
		return nil
	})
	return result, err
}
