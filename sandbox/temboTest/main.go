package main

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/lib/pq"
)

// ----------------------------------------------------------------
func main() {
	fmt.Fprintln(os.Stderr, "*** 開始 ***")
	db, err := sql.Open("postgres", "host=DB_URL user=postgres dbname=postgres password=SAMPLE sslmode=require")
	defer db.Close()

	sql_str := "explain analyze select 1;"

	rows, err := db.Query(sql_str)
	if err != nil {
		fmt.Println(err)
	}
	defer rows.Close()

	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			fmt.Println(err)
		}
		fmt.Printf("%s\n", id)
	}

	fmt.Fprintln(os.Stderr, "*** 終了 ***")
}
