package config

import (
	"database/sql"
	"fmt"
	"image_viewer/account/env"
	"log"

	"github.com/samber/do"
)

type DbConn struct {
	*sql.DB
}

func TestDbConnection(i *do.Injector) (*DbConn, error) {
	dbURI := fmt.Sprintf("postgres://%s:%s@%s/%s?sslmode=disable",
		env.GetAsString("PG_DB_USER", "image_viewer"),
		env.GetAsString("PG_DB_PASSWORD", "password"),
		env.GetAsString("PG_DB_HOST_PORT", "localhost:5432"),
		env.GetAsString("PG_DB_DATABASE_TEST", "testDB"),
	)

	// Open the database
	database, err := sql.Open("postgres", dbURI)
	if err != nil {
		return nil, err
	}

	// Connectivity check
	if err := database.Ping(); err != nil {
		log.Fatalln("Error from database ping:", err)
		return nil, err
	}

	// Set schema
	_, err = database.Exec("SET search_path TO image;")
	if err != nil {
		return nil, err
	}

	return &DbConn{database}, nil
}
