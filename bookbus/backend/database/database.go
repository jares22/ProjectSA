package database

import (
    "database/sql"
    "log"

    _ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

func InitDB() {
    var err error
    DB, err = sql.Open("sqlite3", "./tickets.db")
    if err != nil {
        log.Fatal(err)
    }

    createTables()
}

func createTables() {
    createTicketsTable := `
    CREATE TABLE IF NOT EXISTS tickets (
        id TEXT PRIMARY KEY,
        seat_number INTEGER,
        is_verified BOOLEAN
    );`

    _, err := DB.Exec(createTicketsTable)
    if err != nil {
        log.Fatal(err)
    }

    // Insert some initial data
    initialData := `
    INSERT OR IGNORE INTO tickets (id, seat_number, is_verified) VALUES
    ('T001', 1, false),
    ('T002', 2, false),
    ('T003', 5, false);`

    _, err = DB.Exec(initialData)
    if err != nil {
        log.Fatal(err)
    }
}