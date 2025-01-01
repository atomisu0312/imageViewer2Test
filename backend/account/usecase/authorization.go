package usecase

import (
	"context"
	"fmt"
	"image_viewer/account/env"
	"image_viewer/account/gen"
	"image_viewer/account/repository"
	"image_viewer/account/transaction"
	"image_viewer/account/util"

	"github.com/samber/do"
)

var (
	AuthSecret        = env.GetAsString("AUTH_JWT_SECRET", "auth_secret")
	AuthInterleaveDim = env.GetAsInt("AUTH_INTERLEAVE_DIM", 19)
)

type authUseCaseImpl struct {
	*useCase
}

type AuthUseCase interface {
	UseCase
	// FindUserByIDはUserをIDで検索する
	// {"Name": "testuser", "Email": "sample@gmail.com"}
	ExportPassCodeByTeamId(ctx context.Context, teamId int64) (string, error)
	DecodePassCodeByTeamId(ctx context.Context, passCode string) (map[string]interface{}, error)
}

// NewAuthUseCase は新しい UseCase インスタンスを作成します
func NewAuthUseCase(i *do.Injector) (AuthUseCase, error) {
	return NewUseCase(i, func(u *useCase) AuthUseCase {
		return &authUseCaseImpl{u}
	})
}

func (useCase *authUseCaseImpl) emptyFunc() {}

func (useCase *authUseCaseImpl) ExportPassCodeByTeamId(ctx context.Context, teamID int64) (string, error) {
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

	// チーム名が取得できなかった場合には空文字を返す
	if (resultMap["Name"] == "") || (err != nil) {
		return "", err
	}

	originalInfo := map[string]interface{}{
		"team_id":   int64(teamID),
		"team_name": resultMap["Name"],
	}

	token, err := util.JWTHelper.EncodeJWT(originalInfo, AuthSecret)

	return util.StringHelper.InterleaveString(token, AuthInterleaveDim), err
}

func (useCase *authUseCaseImpl) DecodePassCodeByTeamId(ctx context.Context, passCode string) (map[string]interface{}, error) {
	return util.JWTHelper.DecodeJWTWithHMAC(util.StringHelper.UntiInterleaveString(passCode, AuthInterleaveDim), AuthSecret)
}
