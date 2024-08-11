package models

type Ticket struct {
    ID         string `json:"id"`
    SeatNumber int    `json:"seatNumber"`
    IsVerified bool   `json:"isVerified"`
}

type Seat struct {
    Number     int  `json:"number"`
    IsOccupied bool `json:"isOccupied"`
    IsVerified bool `json:"isVerified"`
}