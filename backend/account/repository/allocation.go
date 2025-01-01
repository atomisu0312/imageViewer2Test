package repository

import (
	"context"
	"image_viewer/account/gen"
	"image_viewer/account/util"
)

type AllocationRepository interface {
	GetAllocationByUserEmailAndTeamID(ctx context.Context, email string, teamId int64) (gen.PermissionAllocation, error)
}

type allocationRepositoryImpl struct {
	queries *gen.Queries
}

// NewAllocationRepository は新しい AllocationRepositoryのコンストラクタ
func NewAllocationRepository(queries *gen.Queries) AllocationRepository {
	return &allocationRepositoryImpl{queries: queries}
}

// GetAllocationByUserEmailAndTeamId は指定されたemailとteamIdに一致するPermissionAllocationを取得します
func (repo *allocationRepositoryImpl) GetAllocationByUserEmailAndTeamID(ctx context.Context, email string, teamId int64) (gen.PermissionAllocation, error) {
	params := gen.GetAllocationByUserEmailAndTeamIdParams{
		Email:  email,
		TeamID: teamId,
	}

	result, err := repo.queries.GetAllocationByUserEmailAndTeamId(ctx, params)
	if err != nil {
		return gen.PermissionAllocation{}, err
	}

	var allocation gen.PermissionAllocation

	util.CopyStructFields(result, &allocation)

	return allocation, nil
}
