package repository_test

import (
	"context"
	"image_viewer/account/config"
	"image_viewer/account/gen"
	"image_viewer/account/repository"
	"testing"

	_ "github.com/lib/pq"
	"github.com/samber/do"
	"github.com/stretchr/testify/assert"
)

// 正常系テスト
func TestForTeam(t *testing.T) {
	t.Run("正常系01 ID:1", func(t *testing.T) {
		config.BeforeEachForUnitTest()      // テスト前処理
		defer config.AfterEachForUnitTest() // テスト後処理

		// DIコンテナ内の依存関係を設定
		injector := do.New()
		do.Provide(injector, config.TestDbConnection)
		dbConn := do.MustInvoke[*config.DbConn](injector)

		ctx := context.Background()
		q := gen.New(dbConn)
		repo := repository.NewTeamRepository(q)
		a, _ := repo.GetTeamByID(ctx, 1)

		assert.Equal(t, "testteam", a.Name, "The team's name should be 'testteam'")
	})

	t.Run("異常系01 存在しないID", func(t *testing.T) {
		config.BeforeEachForUnitTest()      // テスト前処理
		defer config.AfterEachForUnitTest() // テスト後処理

		// DIコンテナ内の依存関係を設定
		injector := do.New()
		do.Provide(injector, config.TestDbConnection)
		dbConn := do.MustInvoke[*config.DbConn](injector)

		ctx := context.Background()
		q := gen.New(dbConn)
		repo := repository.NewTeamRepository(q)
		a, _ := repo.GetTeamByID(ctx, 999)

		assert.Equal(t, "", a.Name, "The team's Name should be 'nil'")
	})
}
