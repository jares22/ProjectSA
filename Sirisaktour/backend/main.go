package main

import (
    "log"
    "net/http"

    "backend/database"
    "backend/handlers"

    "github.com/gorilla/mux"
)

func main() {
    database.InitDB()

    r := mux.NewRouter()
    r.HandleFunc("/api/tickets", handlers.GetTickets).Methods("GET")
    r.HandleFunc("/api/tickets/verify", handlers.VerifyTicket).Methods("POST")
    r.HandleFunc("/api/seats", handlers.GetSeats).Methods("GET")
    r.HandleFunc("/api/seats/{number:[0-9]+}", handlers.GetSeatDetails).Methods("GET") // เพิ่ม endpoint ใหม่

    // CORS middleware
    r.Use(func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            w.Header().Set("Access-Control-Allow-Origin", "*")
            w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
            if r.Method == "OPTIONS" {
                w.WriteHeader(http.StatusOK)
                return
            }
            next.ServeHTTP(w, r)
        })
    })

    log.Println("Server is running on http://localhost:8080")
    log.Fatal(http.ListenAndServe(":8080", r))
}
