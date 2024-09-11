package entity

import (
	"time"

	"gorm.io/gorm"
)

type TicketVerification struct {
	gorm.Model
	TicketID         *uint
	DriverID         *uint
	
	VerificationTime time.Time `gorm:"not null"` // Use time.Time for datetime
	Status           string    `gorm:"not null"`
	
	passenger           Passenger    `gorm:"foreignKey:TicketID"`
	Driver        Drivers `gorm:"foreignKey:DriverID"`

	BustimingID uint
	BusTiming   BusTiming `gorm:"foreignKey:BustimingID"`
}
