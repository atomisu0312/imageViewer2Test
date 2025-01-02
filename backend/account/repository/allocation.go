package repository

import (
	"context"
	"image_viewer/account/gen"
	"image_viewer/account/util"
)

// AllocationRepository はPermissionAllocationのリポジトリです
type AllocationRepository interface {
	GetAllocationByUserEmailAndTeamID(ctx context.Context, email string, teamID int64) (gen.PermissionAllocation, error)
	InsertAllocation(ctx context.Context, userID int64,
		teamID int64, isAdmin bool, readLevel int64, writeLevel int64) (gen.PermissionAllocation, error)
}

type allocationRepositoryImpl struct {
	queries *gen.Queries
}

// NewAllocationRepository は新しい AllocationRepositoryのコンストラクタ
func NewAllocationRepository(queries *gen.Queries) AllocationRepository {
	return &allocationRepositoryImpl{queries: queries}
}

// GetAllocationByUserEmailAndTeamId は指定されたemailとteamIdに一致するPermissionAllocationを取得します
func (repo *allocationRepositoryImpl) GetAllocationByUserEmailAndTeamID(ctx context.Context, email string, teamID int64) (gen.PermissionAllocation, error) {
	params := gen.GetAllocationByUserEmailAndTeamIdParams{
		Email:  email,
		TeamID: teamID,
	}

	result, err := repo.queries.GetAllocationByUserEmailAndTeamId(ctx, params)
	if err != nil {
		return gen.PermissionAllocation{}, err
	}

	var allocation gen.PermissionAllocation

	util.CopyStructFields(result, &allocation)

	return allocation, nil
}

// InsertAllocation はユーザを登録する関数
func (repo *allocationRepositoryImpl) InsertAllocation(ctx context.Context, userID int64,
	teamID int64, isAdmin bool, readLevel int64, writeLevel int64) (gen.PermissionAllocation, error) {
	return repo.queries.InsertAllocation(ctx, gen.InsertAllocationParams{
		UserID:     userID,
		TeamID:     teamID,
		IsAdmin:    isAdmin,
		ReadLevel:  readLevel,
		WriteLevel: writeLevel,
	})
}
