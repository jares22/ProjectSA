package entity

import (
	"gorm.io/gorm"
)

type Passenger struct {
	gorm.Model
	TicketNumber string
	Username    string
	PhoneNumber string
	SeatID      uint
	MemberID    uint // Fix typo here
	Status   string


	Seat   Seat   `gorm:"foreignKey:SeatID"`
	Member Member `gorm:"foreignKey:MemberID"`

	Payment []Payment `gorm:"foreignKey:PassengerID"` 
	TicketVerification []TicketVerification `gorm:"foreignKey:TicketID"` 
}
