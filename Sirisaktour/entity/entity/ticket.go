package entity

import (
	"gorm.io/gorm"
)

type Ticket struct {
	gorm.Model
	TicketNumber string
	SeatStatus   string
	PaymentID    uint // Follow Go naming conventions
	Payment      Payment `gorm:"foreignKey:PaymentID"` // Correct foreign key definition

	TicketVerification []TicketVerification `gorm:"foreignKey:TicketID"` // Correct foreign key definition for the relationship
}
