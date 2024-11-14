package usecase

import (
	"context"
	"fmt"
	"image_viewer/account/config"
	"image_viewer/account/gen"
	"image_viewer/account/repository"
	"image_viewer/account/transaction"

	"github.com/samber/do"
)

// ハンドラから直接呼ばれるのがユースケース
type useCase struct {
	dbConn *config.DbConn
}

type AppUseCase interface {
	FindUserById(ctx context.Context, userId int64) (gen.AppUser, error)
}

// NewUseCase は新しい UseCase インスタンスを作成します
func NewUseCase(i *do.Injector) (AppUseCase, error) {
	dbConn := do.MustInvoke[*config.DbConn](i)

	return &useCase{
		dbConn: dbConn,
	}, nil
}

// AddWorkoutTx はワークアウトを作成するトランザクションを実行します
func (useCase *useCase) FindUserById(ctx context.Context, userId int64) (gen.AppUser, error) {
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
