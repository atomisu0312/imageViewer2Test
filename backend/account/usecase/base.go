package usecase

import (
	"image_viewer/account/config"

	"github.com/samber/do"
)

// ハンドラから直接呼ばれるのがユースケース
type useCase struct {
	dbConn *config.DbConn
}

// NewUseCase は新しい UseCase インスタンスを作成します
func NewUseCase[T any](i *do.Injector, constructor func(*useCase) T) (T, error) {
	dbConn := do.MustInvoke[*config.DbConn](i)

	return constructor(&useCase{
		dbConn: dbConn,
	}), nil
}
