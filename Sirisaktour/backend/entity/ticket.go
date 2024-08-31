package entity

import (

	"gorm.io/gorm"
)

type Ticket struct {
	gorm.Model
	TicketNumber string
	SeatStatus string
}
