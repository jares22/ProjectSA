package handlers

import (
    "encoding/json"
    "net/http"

    "bus-ticket-verifier/backend/database"
    "bus-ticket-verifier/backend/models"
)

func GetTickets(w http.ResponseWriter, r *http.Request) {
    rows, err := database.DB.Query("SELECT id, seat_number, is_verified FROM tickets")
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var tickets []models.Ticket
    for rows.Next() {
        var t models.Ticket
        if err := rows.Scan(&t.ID, &t.SeatNumber, &t.IsVerified); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        tickets = append(tickets, t)
    }

    json.NewEncoder(w).Encode(tickets)
}

func VerifyTicket(w http.ResponseWriter, r *http.Request) {
    var ticket models.Ticket
    if err := json.NewDecoder(r.Body).Decode(&ticket); err != nil {
        http.Error(w, "Invalid request body: "+err.Error(), http.StatusBadRequest)
        return
    }

    result, err := database.DB.Exec("UPDATE tickets SET is_verified = true WHERE id = ?", ticket.ID)
    if err != nil {
        http.Error(w, "Database error: "+err.Error(), http.StatusInternalServerError)
        return
    }

    rowsAffected, err := result.RowsAffected()
    if err != nil {
        http.Error(w, "Error checking rows affected: "+err.Error(), http.StatusInternalServerError)
        return
    }

    if rowsAffected == 0 {
        http.Error(w, "No ticket found with the given ID", http.StatusNotFound)
        return
    }

    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]string{"message": "Ticket verified successfully"})
}

func GetSeats(w http.ResponseWriter, r *http.Request) {
    rows, err := database.DB.Query("SELECT seat_number, is_verified FROM tickets")
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    seats := make([]models.Seat, 20)
    for i := range seats {
        seats[i] = models.Seat{Number: i + 1, IsOccupied: false, IsVerified: false}
    }

    for rows.Next() {
        var seatNumber int
        var isVerified bool
        if err := rows.Scan(&seatNumber, &isVerified); err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        seats[seatNumber-1].IsOccupied = true
        seats[seatNumber-1].IsVerified = isVerified
    }

    json.NewEncoder(w).Encode(seats)
}