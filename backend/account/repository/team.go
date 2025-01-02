package repository

import (
	"context"
	"image_viewer/account/gen"
)

type TeamRepository interface {
	GetTeamByID(ctx context.Context, id int64) (gen.AppTeam, error)
	InsertTeam(ctx context.Context, name string) (gen.AppTeam, error)
}

type teamRepositoryImpl struct {
	queries *gen.Queries
}

// NewUserRepository はユーザリポジトリのコンストラクタ
func NewTeamRepository(queries *gen.Queries) TeamRepository {
	return &teamRepositoryImpl{queries: queries}
}

func (repo *teamRepositoryImpl) GetTeamByID(ctx context.Context, teamId int64) (gen.AppTeam, error) {
	return repo.queries.FindTeamByID(ctx, teamId)
}

// InsertTeam はユーザ名とメールアドレスを指定してユーザを登録する関数
func (repo *teamRepositoryImpl) InsertTeam(ctx context.Context, name string) (gen.AppTeam, error) {
	return repo.queries.InsertTeam(ctx, name)
}
