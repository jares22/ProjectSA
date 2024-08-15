package entity

import "gorm.io/gorm"

type Schedule struct {
	gorm.Model
	RouteID       uint
	BusID         uint
	DepartureTime string `gorm:"not null"` // Use string for datetime
	ArrivalTime   string `gorm:"not null"` // Use string for datetime
	Route         Route  `gorm:"foreignKey:RouteID"`
	Bus           Bus    `gorm:"foreignKey:BusID"`
	Tickets       []Ticket
}
