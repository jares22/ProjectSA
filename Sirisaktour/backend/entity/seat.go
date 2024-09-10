package entity

import (
	"gorm.io/gorm"
)

type Seat struct {
	gorm.Model
	SeatNumber int
	BusID      uint
	Vehicles   Vehicles `gorm:"foreignKey:BusID"`

	Passenger []Passenger    `gorm:"foreignKey:SeatID"`
}
