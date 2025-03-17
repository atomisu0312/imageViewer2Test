package repository

import (
	"context"
	"image_viewer/account/gen"
	"time"

	"go.uber.org/zap"
)

type userRepositoryImpl struct {
	*repository
	queries *gen.Queries
}

// UserRepository は、ユーザー関連のデータアクセスを提供するインターフェースです。
type UserRepository interface {
	Repository
	GetUserByID(ctx context.Context, id int64) (gen.AppUser, error)
	InsertUserWithNameAndEmail(ctx context.Context, name string, email string) (gen.AppUser, error)
}

// NewUserRepository は、UserRepository の新しいインスタンスを作成します。
func NewUserRepository(queries *gen.Queries) UserRepository {
	return NewRepository(func(r *repository) UserRepository {
		return &userRepositoryImpl{
			repository: r,
			queries:    queries,
		}
	})
}

// GetUserByID は、ユーザーIDを指定してユーザー情報を取得します。
func (r *userRepositoryImpl) GetUserByID(ctx context.Context, id int64) (gen.AppUser, error) {
	start := time.Now()
	defer r.logDBOperation("GetUserByID", start, zap.Int64("user_id", id))

	user, err := r.queries.FindUserByID(ctx, id)
	if err != nil {
		r.logDBError("GetUserByID", err, zap.Int64("user_id", id))
		return gen.AppUser{}, err
	}

	r.logDBResult("GetUserByID", user, zap.Int64("user_id", id))
	return user, nil
}

// InsertUserWithNameAndEmail は、ユーザー名とメールアドレスを指定してユーザーを登録します。
func (r *userRepositoryImpl) InsertUserWithNameAndEmail(ctx context.Context, name string, email string) (gen.AppUser, error) {
	start := time.Now()
	defer r.logDBOperation("InsertUserWithNameAndEmail", start, zap.String("name", name), zap.String("email", email))

	user, err := r.queries.InsertUser(ctx, gen.InsertUserParams{
		Name:  name,
		Email: email,
	})
	if err != nil {
		r.logDBError("InsertUserWithNameAndEmail", err, zap.String("name", name), zap.String("email", email))
		return gen.AppUser{}, err
	}

	r.logDBResult("InsertUserWithNameAndEmail", user, zap.String("name", name), zap.String("email", email))
	return user, nil
}
