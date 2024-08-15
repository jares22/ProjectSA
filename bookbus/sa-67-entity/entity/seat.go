package entity

import "gorm.io/gorm"

type Seat struct {
	gorm.Model
	BusID        uint
	SeatNumber   string `gorm:"not null"`
	Bus          Bus    `gorm:"foreignKey:BusID"`
	Tickets      []Ticket
}
