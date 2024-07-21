package main

import (
    "database/sql"
    "encoding/json"
    "net/http"
    _ "github.com/mattn/go-sqlite3"
    "github.com/gorilla/mux"
    "log"
)

var db *sql.DB

func main() {
    var err error
    db, err = sql.Open("sqlite3", "./bookbus.db")
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    r := mux.NewRouter()
    r.HandleFunc("/api/seats", GetSeats).Methods("GET")
    http.Handle("/", r)
    log.Println("Server running on port 8000")
    http.ListenAndServe(":8000", nil)
}

func GetSeats(w http.ResponseWriter, r *http.Request) {
    rows, err := db.Query(`SELECT id, seat_number, status FROM seats`)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    seats := []map[string]interface{}{}
    for rows.Next() {
        var id int
        var seatNumber, status string
        if err := rows.Scan(&id, &seatNumber, &status); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        seats = append(seats, map[string]interface{}{
            "id":          id,
            "seat_number": seatNumber,
            "status":      status,
        })
    }
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(seats)
}
