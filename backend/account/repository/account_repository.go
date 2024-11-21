package repository

import (
	"context"
	"image_viewer/account/gen"
)

type AccountRepository interface {
	GetUserById(ctx context.Context, id int64) (gen.AppUser, error)
}

type accountRepositoryImpl struct {
	queries *gen.Queries
}

// アカウントリポジトリのコンストラクタ
func NewAccountRepository(queries *gen.Queries) AccountRepository {
	return &accountRepositoryImpl{queries: queries}
}

// ID指定でユーザを持ってくる関数
func (repo *accountRepositoryImpl) GetUserById(ctx context.Context, userId int64) (gen.AppUser, error) {
	return repo.queries.FindUserById(ctx, userId)
}
