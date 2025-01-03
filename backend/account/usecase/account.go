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
	FindUserByID(ctx context.Context, userId int64) (map[string]interface{}, error)
	FindTeamByID(ctx context.Context, teamId int64) (map[string]interface{}, error)
	FindAllocationByTeamIDAndEmail(ctx context.Context, email string, teamID int64) (map[string]interface{}, error)
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
func (useCase *accountUseCaseImpl) FindUserByID(ctx context.Context, userId int64) (map[string]interface{}, error) {
	var result gen.AppUser
	tr := transaction.NewTx(useCase.dbConn.DB)
	err := tr.ExecNonTx(ctx, func(q *gen.Queries) error {
		repo := repository.NewUserRepository(q)

		workout, err := repo.GetUserByID(ctx, userId)

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

// FindTeamByIDはTeamをIDで検索する
// {"Name": "testuser"}
func (useCase *accountUseCaseImpl) FindTeamByID(ctx context.Context, teamID int64) (map[string]interface{}, error) {
	var result gen.AppTeam
	tr := transaction.NewTx(useCase.dbConn.DB)
	err := tr.ExecNonTx(ctx, func(q *gen.Queries) error {
		repo := repository.NewTeamRepository(q)

		workout, err := repo.GetTeamByID(ctx, teamID)

		if err != nil {
			return fmt.Errorf("error create workout %w", err)
		}

		result = workout
		return nil
	})

	// 必要な値のみを取り出す
	resultMap := util.FilterMapFields(util.StructToMap(result), "Name")

	return resultMap, err
}

// FindUserByIDはUserをIDで検索する
// {"WriteLevel": int64, "ReadLevel": int64, "ID": int64}
func (useCase *accountUseCaseImpl) FindAllocationByTeamIDAndEmail(ctx context.Context, email string, teamID int64) (map[string]interface{}, error) {
	var result gen.PermissionAllocation

	tr := transaction.NewTx(useCase.dbConn.DB)
	err := tr.ExecNonTx(ctx, func(q *gen.Queries) error {
		repo := repository.NewAllocationRepository(q)

		workout, err := repo.GetAllocationByUserEmailAndTeamID(ctx, email, teamID)

		if err != nil {
			return fmt.Errorf("error create workout %w", err)
		}

		result = workout
		return nil
	})

	// 必要な値のみを取り出す
	resultMap := util.FilterMapFields(util.StructToMap(result), "WriteLevel", "ReadLevel", "ID")

	return resultMap, err
}
