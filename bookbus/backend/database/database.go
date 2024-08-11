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
    // Create tickets table
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

    // Create seats table
    createSeatsTable := `
    CREATE TABLE IF NOT EXISTS seats (
        number INTEGER PRIMARY KEY,
        is_occupied BOOLEAN,
        owner TEXT
    );`

    _, err = DB.Exec(createSeatsTable)
    if err != nil {
        log.Fatal(err)
    }

    // Insert some initial data
    initialTicketsData := `
    INSERT OR IGNORE INTO tickets (id, seat_number, is_verified) VALUES
    ('T001', 1, false),
    ('T002', 2, false),
    ('T003', 5, false);`

    _, err = DB.Exec(initialTicketsData)
    if err != nil {
        log.Fatal(err)
    }

    initialSeatsData := `
    INSERT OR IGNORE INTO seats (number, is_occupied, owner) VALUES
    (1, true, 'John Doe'),
    (2, false, ''),
    (5, true, 'Jane Smith');`

    _, err = DB.Exec(initialSeatsData)
    if err != nil {
        log.Fatal(err)
    }
}
