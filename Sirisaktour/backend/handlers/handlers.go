package handlers

import (
    "encoding/json"
    "net/http"
    "backend/database"
    "backend/models"
    "github.com/gorilla/mux"
)

// GetTickets retrieves all tickets
func GetTickets(w http.ResponseWriter, r *http.Request) {
    tickets, err := database.GetAllTickets()
    if err != nil {
        http.Error(w, "Unable to fetch tickets", http.StatusInternalServerError)
        return
    }
    json.NewEncoder(w).Encode(tickets)
}

// VerifyTicket verifies a ticket and updates the seat status
func VerifyTicket(w http.ResponseWriter, r *http.Request) {
    var request models.VerifyTicketRequest
    if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
        http.Error(w, "Invalid request", http.StatusBadRequest)
        return
    }

    // Call database function to verify ticket and update seat
    result, err := database.VerifyTicket(request.TicketID, request.EmployeeID)
    if err != nil {
        http.Error(w, "Verification failed", http.StatusInternalServerError)
        return
    }
    
    json.NewEncoder(w).Encode(result)
}

// GetSeats retrieves all seats
func GetSeats(w http.ResponseWriter, r *http.Request) {
    seats, err := database.GetAllSeats()
    if err != nil {
        http.Error(w, "Unable to fetch seats", http.StatusInternalServerError)
        return
    }
    json.NewEncoder(w).Encode(seats)
}

// GetSeatDetails retrieves seat details by number
func GetSeatDetails(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    seatNumber := vars["number"]

    seat, err := database.GetSeatDetails(seatNumber)
    if err != nil {
        http.Error(w, "Unable to fetch seat details", http.StatusInternalServerError)
        return
    }
    json.NewEncoder(w).Encode(seat)
}
