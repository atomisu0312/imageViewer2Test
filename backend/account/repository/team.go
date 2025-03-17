package repository

import (
	"context"
	"image_viewer/account/gen"
	"time"

	"go.uber.org/zap"
)

type TeamRepository interface {
	Repository
	GetTeamByID(ctx context.Context, id int64) (gen.AppTeam, error)
	InsertTeam(ctx context.Context, name string) (gen.AppTeam, error)
}

type teamRepositoryImpl struct {
	*repository
	queries *gen.Queries
}

// NewTeamRepository はチームリポジトリのコンストラクタ
func NewTeamRepository(queries *gen.Queries) TeamRepository {
	return NewRepository(func(r *repository) TeamRepository {
		return &teamRepositoryImpl{
			repository: r,
			queries:    queries,
		}
	})
}

func (r *teamRepositoryImpl) GetTeamByID(ctx context.Context, teamId int64) (gen.AppTeam, error) {
	start := time.Now()
	defer r.logDBOperation("GetTeamByID", start, zap.Int64("team_id", teamId))

	team, err := r.queries.FindTeamByID(ctx, teamId)
	if err != nil {
		r.logDBError("GetTeamByID", err, zap.Int64("team_id", teamId))
		return gen.AppTeam{}, err
	}

	r.logDBResult("GetTeamByID", team, zap.Int64("team_id", teamId))
	return team, nil
}

// InsertTeam はチーム名を指定してチームを登録する関数
func (r *teamRepositoryImpl) InsertTeam(ctx context.Context, name string) (gen.AppTeam, error) {
	start := time.Now()
	defer r.logDBOperation("InsertTeam", start, zap.String("name", name))

	team, err := r.queries.InsertTeam(ctx, name)
	if err != nil {
		r.logDBError("InsertTeam", err, zap.String("name", name))
		return gen.AppTeam{}, err
	}

	r.logDBResult("InsertTeam", team, zap.String("name", name))
	return team, nil
}
