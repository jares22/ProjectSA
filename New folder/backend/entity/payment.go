package entity

import (
	"time"

	"gorm.io/gorm"
)

type Payment struct {
	gorm.Model
	BusRound    time.Time // Correcting the type to time.Time
	PassengerID uint      // Foreign key reference to Passenger

	Passenger Passenger `gorm:"foreignKey:PassengerID"` // Defining the relation with Passenger


}
