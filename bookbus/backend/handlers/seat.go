package handlers

import (
    "encoding/json"
    "net/http"
    "strconv"

    "backend/database"
    "github.com/gorilla/mux"
)

func GetSeatDetails(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    seatNumber, err := strconv.Atoi(vars["number"])
    if err != nil {
        http.Error(w, "Invalid seat number", http.StatusBadRequest)
        return
    }

    var isOccupied bool
    var owner string

    err = database.DB.QueryRow("SELECT is_occupied, owner FROM seats WHERE number = ?", seatNumber).Scan(&isOccupied, &owner)
    if err != nil {
        http.Error(w, "Seat not found", http.StatusNotFound)
        return
    }

    response := map[string]interface{}{
        "number": seatNumber,
        "isOccupied": isOccupied,
        "owner": owner,
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(response)
}
