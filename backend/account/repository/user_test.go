package repository

import (
	"context"
	"image_viewer/account/config"
	"image_viewer/account/gen"
	"testing"

	_ "github.com/lib/pq"
	"github.com/samber/do"
	"github.com/stretchr/testify/assert"
)

// 正常系テスト
func TestPositive(t *testing.T) {
	t.Run("正常系01 ID:1", func(t *testing.T) {
		config.BeforeEachForUnitTest()      // テスト前処理
		defer config.AfterEachForUnitTest() // テスト後処理

		// DIコンテナ内の依存関係を設定
		injector := do.New()
		do.Provide(injector, config.TestDbConnection)
		dbConn := do.MustInvoke[*config.DbConn](injector)

		ctx := context.Background()
		q := gen.New(dbConn)
		repo := NewUserRepository(q)
		a, _ := repo.GetUserById(ctx, 1)

		assert.Equal(t, "testuser", a.Name, "The user's name should be 'testuser'")
		assert.Equal(t, "testuser@example.com", a.Email, "The user's email should be 'testuser@example.com'")
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
		repo := NewUserRepository(q)
		a, _ := repo.GetUserById(ctx, 999)

		assert.Equal(t, "", a.Name, "The user's Name should be 'nil'")
		assert.Equal(t, "", a.Email, "The user's Email should be 'nil'")
	})
}
