package repo

import (
	"context"
	"fmt"
	"schema/query"
	"testing"

	"schema/model"

	"github.com/stretchr/testify/assert"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/schema"
)

func TestSome(t *testing.T) {
	dsn := "host=localhost user=image_viewer password=password00 dbname=test_image_viewer port=5432 sslmode=disable TimeZone=Asia/Tokyo"
	gormdb, _ := gorm.Open(postgres.Open(dsn), &gorm.Config{
		NamingStrategy: schema.NamingStrategy{
			TablePrefix:   "image.", // schema name
			SingularTable: false,
		}})

	var team model.AppTeam
	fmt.Println(team)

	// begin a transaction
	tx := query.Use(gormdb.Table("app_user")).Begin()

	ctx := context.Background()

	// do some database operations in the transaction (use 'tx' from this point, not 'db')
	tx.AppUser.WithContext(ctx).Create(&model.AppUser{ID: 1, Name: "testuser", Email: "test@gmail.com"})

	tx.Commit()

	tx1 := query.Use(gormdb.Table("app_user")).Begin()
	user, _ := tx1.AppUser.WithContext(ctx).First()

	assert.Equal(t, *user, model.AppUser{ID: 1, Name: "testuser", Email: "test@gmail.com"})
	// ...

	// rollback the transaction in case of error
	//tx.Rollback()

	// Or commit the transaction
	tx1.Commit()

	tx2 := query.Use(gormdb.Table("app_user")).Begin()
	tx2.AppUser.WithContext(ctx).Delete(&model.AppUser{ID: 1})

}
