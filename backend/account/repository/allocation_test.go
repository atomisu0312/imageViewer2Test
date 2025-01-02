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
	t.Run("正常系02 関連の新規登録処理", func(t *testing.T) {
		config.BeforeEachForUnitTest()      // テスト前処理
		defer config.AfterEachForUnitTest() // テスト後処理

		// DIコンテナ内の依存関係を設定
		injector := do.New()
		do.Provide(injector, config.TestDbConnection)
		dbConn := do.MustInvoke[*config.DbConn](injector)

		// 挿入するデータの準備
		userID := int64(1)
		teamID := int64(1)
		isAdmin := true
		readLevel := int64(3)
		writeLevel := int64(3)

		// トランザクションを張って挿入する処理（UseCaseに記述する処理はこれ）
		ctx := context.Background()
		tr := transaction.NewTx(dbConn.DB)

		var result gen.PermissionAllocation
		err := tr.ExecTx(ctx, func(q *gen.Queries) error {
			repo := repository.NewAllocationRepository(q)

			allocation, err := repo.InsertAllocation(ctx, userID, teamID, isAdmin, readLevel, writeLevel)
			if err != nil {
				return fmt.Errorf("error creating allocation: %w", err)
			}

			result = allocation
			return nil
		})
		if err != nil {
			t.Fatalf("Failed to insert allocation: %v", err)
		}

		assert.Equal(t, userID, result.UserID, fmt.Sprintf("The UserID should be '%d'", userID))
		assert.Equal(t, teamID, result.TeamID, fmt.Sprintf("The TeamID should be '%d'", teamID))
		assert.Equal(t, isAdmin, result.IsAdmin, "The IsAdmin should be true")

		//　データが挿入されているかどうかを確認
		q := gen.New(dbConn.DB)

		userRepo := repository.NewUserRepository(q)
		user, err := userRepo.GetUserByID(ctx, userID)
		if err != nil {
			t.Fatalf("Failed to get user by ID: %v", err)
		}
		userEmail := user.Email
		assert.Equal(t, "testuser@example.com", userEmail, fmt.Sprintf("The address should be '%s'", "testuser@example.com"))

		repo := repository.NewAllocationRepository(q)
		searchResult, err := repo.GetAllocationByUserEmailAndTeamID(ctx, userEmail, teamID)

		if err != nil {
			t.Fatalf("Failed to get team by ID: %v", err)
		}

		assert.Equal(t, userID, searchResult.UserID, fmt.Sprintf("The UserID should be '%d'", userID))
		assert.Equal(t, teamID, searchResult.TeamID, fmt.Sprintf("The TeamID should be '%d'", teamID))
		assert.Equal(t, isAdmin, searchResult.IsAdmin, "The IsAdmin should be true")

	})
}
