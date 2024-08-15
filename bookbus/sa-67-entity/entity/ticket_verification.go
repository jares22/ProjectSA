package entity

import "gorm.io/gorm"

type TicketVerification struct {
	gorm.Model
	TicketID        uint
	EmployeeID      uint
	VerificationTime string `gorm:"not null"` // Use string for datetime
	Status          string `gorm:"not null"`
	Ticket          Ticket   `gorm:"foreignKey:TicketID"`
	Employee        Employee `gorm:"foreignKey:EmployeeID"`
}
