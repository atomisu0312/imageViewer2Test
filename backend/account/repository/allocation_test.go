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
func TestForAllocation(t *testing.T) {
	t.Run("正常系01 ID:1", func(t *testing.T) {
		config.BeforeEachForUnitTest()      // テスト前処理
		defer config.AfterEachForUnitTest() // テスト後処理

		// DIコンテナ内の依存関係を設定
		injector := do.New()
		do.Provide(injector, config.TestDbConnection)
		dbConn := do.MustInvoke[*config.DbConn](injector)

		ctx := context.Background()
		q := gen.New(dbConn)
		repo := repository.NewAllocationRepository(q)
		a, _ := repo.GetAllocationByUserEmailAndTeamID(ctx, "testuser@example.com", 1)

		assert.Equal(t, int64(3), a.WriteLevel, "write level should be 3")
		assert.Equal(t, int64(1), a.ID, "ID should be 1")
	})
	t.Run("正常系01 teamID:1 and testEmail", func(t *testing.T) {
		config.BeforeEachForUnitTest()      // テスト前処理
		defer config.AfterEachForUnitTest() // テスト後処理

		// DIコンテナ内の依存関係を設定
		injector := do.New()
		do.Provide(injector, config.TestDbConnection)
		dbConn := do.MustInvoke[*config.DbConn](injector)

		ctx := context.Background()
		q := gen.New(dbConn)
		repo := repository.NewAllocationRepository(q)
		a, _ := repo.GetAllocationByUserEmailAndTeamID(ctx, "testuser@example.com", 2)

		assert.Equal(t, int64(0), a.WriteLevel, "write level should be nil")
		assert.Equal(t, int64(0), a.ID, "ID should be nil")
	})
}
