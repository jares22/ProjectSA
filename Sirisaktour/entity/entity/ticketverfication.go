package entity

import (
	"time"

	"gorm.io/gorm"
)

type TicketVerification struct {
	gorm.Model
	TicketID         uint
	DriverID         uint
	EmployeeID       uint // Foreign key for Employee
	VerificationTime time.Time `gorm:"not null"` // Use time.Time for datetime
	Status           string    `gorm:"not null"`
	Ticket           Ticket    `gorm:"foreignKey:TicketID"`
	Driver        Drivers `gorm:"foreignKey:EmployeeID"`
}
