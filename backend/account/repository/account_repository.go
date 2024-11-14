package repository

import (
	"context"
	"image_viewer/account/gen"
)

type AccountRepository interface {
	GetUserById(ctx context.Context, id int64) (gen.AppUser, error)
}

type AccountRepositoryImpl struct {
	queries *gen.Queries
}

func NewAccountRepository(queries *gen.Queries) *AccountRepositoryImpl {
	return &AccountRepositoryImpl{queries: queries}
}

// CreateExercise はエクササイズを作成します
func (repo *AccountRepositoryImpl) GetUserById(ctx context.Context, userId int64) (gen.AppUser, error) {
	return repo.queries.FindUserById(ctx, userId)
}
