package repository

import (
	"context"
	"image_viewer/account/config"
	"image_viewer/account/gen"
	"log"
	"os"
	"testing"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/samber/do"
	"github.com/stretchr/testify/assert"
)

var dbConn *config.DbConn

func TestMain(m *testing.M) {
	godotenv.Load("../.env")

	injector := do.New()

	do.Provide(injector, config.TestDbConnection)

	dbConn = do.MustInvoke[*config.DbConn](injector)

	// Insert initial data
	_, err := dbConn.Exec(`
        INSERT INTO app_user (id, name, email) VALUES (1, 'testuser', 'testuser@example.com');
        INSERT INTO app_team (id, name) VALUES (1, 'testteam');
    `)
	if err != nil {
		log.Fatalf("Failed to insert initial data: %v", err)
	}

	// Run tests
	code := m.Run()

	// Clean up: Delete the inserted data
	_, err = dbConn.Exec(`
			DELETE FROM app_user;
			DELETE FROM app_team;
	`)

	if err != nil {
		log.Fatalf("Failed to delete test data: %v", err)
	}

	// Clean up
	dbConn.Close()

	os.Exit(code)
}

func TestSome(t *testing.T) {
	ctx := context.Background()

	q := gen.New(dbConn)
	repo := NewAccountRepository(q)
	a, _ := repo.GetUserById(ctx, 1)

	assert.Equal(t, "testuser", a.Name, "The user's name should be 'testuser'")
}
