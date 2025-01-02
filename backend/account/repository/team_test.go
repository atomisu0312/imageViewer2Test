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

	t.Run("正常系02 チームの新規登録処理", func(t *testing.T) {
		config.BeforeEachForUnitTest()      // テスト前処理
		defer config.AfterEachForUnitTest() // テスト後処理

		// DIコンテナ内の依存関係を設定
		injector := do.New()
		do.Provide(injector, config.TestDbConnection)
		dbConn := do.MustInvoke[*config.DbConn](injector)

		// 挿入するデータの準備
		name := "testteam2"

		// トランザクションを張って挿入する処理（UseCaseに記述する処理はこれ）
		ctx := context.Background()
		tr := transaction.NewTx(dbConn.DB)

		var result gen.AppTeam
		err := tr.ExecTx(ctx, func(q *gen.Queries) error {
			repo := repository.NewTeamRepository(q)

			workout, err := repo.InsertTeam(ctx, name)
			if err != nil {
				return fmt.Errorf("error create workout!!!!! %w", err)
			}

			result = workout
			return nil
		})
		if err != nil {
			t.Fatalf("Failed to insert team: %v", err)
		}

		assert.Equal(t, name, result.Name, fmt.Sprintf("The team's Name should be '%s'", name))

		//　データが挿入されているかどうかを確認
		q := gen.New(dbConn.DB)
		repo := repository.NewTeamRepository(q)
		searchResult, err := repo.GetTeamByID(ctx, result.ID)
		if err != nil {
			t.Fatalf("Failed to get team by ID: %v", err)
		}
		assert.Equal(t, name, searchResult.Name, fmt.Sprintf("The team's Name should be '%s'", name))

	})
}
