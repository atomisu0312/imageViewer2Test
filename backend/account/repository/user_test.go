package repository_test

import (
	"context"
	"fmt"
	"image_viewer/account/config"
	"image_viewer/account/gen"
	"image_viewer/account/repository"
	"image_viewer/account/transaction"
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
		repo := repository.NewUserRepository(q)
		a, _ := repo.GetUserByID(ctx, 1)

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
		repo := repository.NewUserRepository(q)
		a, _ := repo.GetUserByID(ctx, 999)

		assert.Equal(t, "", a.Name, "The user's Name should be 'nil'")
		assert.Equal(t, "", a.Email, "The user's Email should be 'nil'")
	})

	t.Run("正常系02 ユーザの新規登録処理", func(t *testing.T) {
		config.BeforeEachForUnitTest()      // テスト前処理
		defer config.AfterEachForUnitTest() // テスト後処理

		// DIコンテナ内の依存関係を設定
		injector := do.New()
		do.Provide(injector, config.TestDbConnection)
		dbConn := do.MustInvoke[*config.DbConn](injector)

		// 挿入するデータの準備
		name := "testuser2"
		email := "test@jgmail.com"

		// トランザクションを張って挿入する処理（UseCaseに記述する処理はこれ）
		ctx := context.Background()
		tr := transaction.NewTx(dbConn.DB)
		var result gen.AppUser
		err := tr.ExecTx(ctx, func(q *gen.Queries) error {
			repo := repository.NewUserRepository(q)

			workout, err := repo.InsertUserWithNameAndEmail(ctx, name, email)
			if err != nil {
				return fmt.Errorf("error create workout!!!!! %w", err)
			}

			result = workout
			return nil
		})
		if err != nil {
			t.Fatalf("Failed to insert user: %v", err)
		}

		assert.Equal(t, name, result.Name, fmt.Sprintf("The user's Name should be '%s'", name))
		assert.Equal(t, email, result.Email, fmt.Sprintf("The user's Email should be '%s'", email))

		//　データが挿入されているかどうかを確認
		q := gen.New(dbConn.DB)
		repo := repository.NewUserRepository(q)
		searchResult, err := repo.GetUserByID(ctx, result.ID)
		if err != nil {
			t.Fatalf("Failed to get user by ID: %v", err)
		}
		assert.Equal(t, name, searchResult.Name, "The user's Name should be 'testuser2'")
		assert.Equal(t, email, searchResult.Email, "The user's Email should be 'test@jgmail.com'")

	})
}
