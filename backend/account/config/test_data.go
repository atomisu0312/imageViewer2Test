package config

import (
	"log"

	"github.com/joho/godotenv"
	"github.com/samber/do"
)

func BeforeEachForUnitTest() {
	godotenv.Load("../.env")

	injector := do.New()

	do.Provide(injector, TestDbConnection)

	dbConn := do.MustInvoke[*DbConn](injector)

	// Insert initial data
	_, err := dbConn.Exec(`
        INSERT INTO app_user (id, name, email) VALUES (1, 'testuser', 'testuser@example.com');
        INSERT INTO app_team (id, name) VALUES (1, 'testteam');
				INSERT INTO permission_allocation (user_id, team_id, is_admin, read_level, write_level) VALUES (1, 1, TRUE, 3, 3);
    `)
	if err != nil {
		log.Fatalf("Failed to insert initial data: %v", err)
	}

	// Clean up
	dbConn.Close()

}

func AfterEachForUnitTest() {
	injector := do.New()

	do.Provide(injector, TestDbConnection)

	dbConn := do.MustInvoke[*DbConn](injector)

	var err error
	// Clean up: Delete the inserted data
	_, err = dbConn.Exec(`
			TRUNCATE TABLE permission_allocation RESTART IDENTITY;
			TRUNCATE TABLE app_user RESTART IDENTITY CASCADE;
			TRUNCATE TABLE app_team RESTART IDENTITY CASCADE;
	`)

	if err != nil {
		log.Fatalf("Failed to delete test data: %v", err)
	}

	// Clean up
	dbConn.Close()

}
