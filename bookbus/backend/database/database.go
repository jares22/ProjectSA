package database

import (
    "database/sql"
    _ "github.com/mattn/go-sqlite3" // Import SQLite driver
    "backend/models"
)

var db *sql.DB

// InitDB initializes the database
func InitDB() {
    var err error
    db, err = sql.Open("sqlite3", "./database.db")
    if err != nil {
        panic(err)
    }
    createTables()
}

// Create tables if they do not exist
func createTables() {
    _, err := db.Exec(`
        CREATE TABLE IF NOT EXISTS tickets (
            id TEXT PRIMARY KEY,
            seat_number INTEGER,
            is_verified BOOLEAN
        );
        CREATE TABLE IF NOT EXISTS seats (
            number INTEGER PRIMARY KEY,
            is_occupied BOOLEAN,
            is_verified BOOLEAN
        );
        CREATE TABLE IF NOT EXISTS ticket_verifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ticket_id TEXT,
            employee_id TEXT,
            verified_at DATETIME,
            seat_number INTEGER,
            final_status TEXT
        );
    `)
    if err != nil {
        panic(err)
    }
}

// GetAllTickets retrieves all tickets from the database
func GetAllTickets() ([]models.Ticket, error) {
    rows, err := db.Query("SELECT id, seat_number, is_verified FROM tickets")
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var tickets []models.Ticket
    for rows.Next() {
        var ticket models.Ticket
        if err := rows.Scan(&ticket.ID, &ticket.SeatNumber, &ticket.IsVerified); err != nil {
            return nil, err
        }
        tickets = append(tickets, ticket)
    }
    return tickets, nil
}

// VerifyTicket verifies a ticket and updates the seat status
func VerifyTicket(ticketID, employeeID string) (models.VerificationResult, error) {
    tx, err := db.Begin()
    if err != nil {
        return models.VerificationResult{}, err
    }

    var ticket models.Ticket
    err = tx.QueryRow("SELECT seat_number, is_verified FROM tickets WHERE id = ?", ticketID).Scan(&ticket.SeatNumber, &ticket.IsVerified)
    if err != nil {
        tx.Rollback()
        return models.VerificationResult{}, err
    }

    if ticket.IsVerified {
        tx.Rollback()
        return models.VerificationResult{Message: "Ticket has already been verified"}, nil
    }

    _, err = tx.Exec("UPDATE tickets SET is_verified = TRUE WHERE id = ?", ticketID)
    if err != nil {
        tx.Rollback()
        return models.VerificationResult{}, err
    }

    _, err = tx.Exec("UPDATE seats SET is_verified = TRUE WHERE number = ?", ticket.SeatNumber)
    if err != nil {
        tx.Rollback()
        return models.VerificationResult{}, err
    }

    _, err = tx.Exec("INSERT INTO ticket_verifications (ticket_id, employee_id, verified_at, seat_number, final_status) VALUES (?, ?, DATETIME('now'), ?, 'Verified')",
        ticketID, employeeID, ticket.SeatNumber)
    if err != nil {
        tx.Rollback()
        return models.VerificationResult{}, err
    }

    tx.Commit()
    return models.VerificationResult{Message: "Ticket verified successfully"}, nil
}

// GetAllSeats retrieves all seats from the database
func GetAllSeats() ([]models.Seat, error) {
    rows, err := db.Query("SELECT number, is_occupied, is_verified FROM seats")
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var seats []models.Seat
    for rows.Next() {
        var seat models.Seat
        if err := rows.Scan(&seat.Number, &seat.IsOccupied, &seat.IsVerified); err != nil {
            return nil, err
        }
        seats = append(seats, seat)
    }
    return seats, nil
}

// GetSeatDetails retrieves seat details from the database
func GetSeatDetails(seatNumber string) (models.Seat, error) {
    var seat models.Seat
    err := db.QueryRow("SELECT number, is_occupied, is_verified FROM seats WHERE number = ?", seatNumber).Scan(&seat.Number, &seat.IsOccupied, &seat.IsVerified)
    if err != nil {
        return models.Seat{}, err
    }
    return seat, nil
}
