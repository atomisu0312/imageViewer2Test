package repository

import (
	"context"
	"image_viewer/account/gen"
)

type UserRepository interface {
	GetUserById(ctx context.Context, id int64) (gen.AppUser, error)
}

type userRepositoryImpl struct {
	queries *gen.Queries
}

// NewUserRepository はユーザリポジトリのコンストラクタ
func NewUserRepository(queries *gen.Queries) UserRepository {
	return &userRepositoryImpl{queries: queries}
}

// GetUserById はID指定でユーザを持ってくる関数
func (repo *userRepositoryImpl) GetUserById(ctx context.Context, userId int64) (gen.AppUser, error) {
	return repo.queries.FindUserByID(ctx, userId)
}
