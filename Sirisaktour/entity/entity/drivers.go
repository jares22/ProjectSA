package entity

import (
	"gorm.io/gorm"
)

type Drivers struct {
	gorm.Model

	
	BusID      uint
	Vehicles   Vehicles `gorm:"foreignKey:BusID"`

	EmployeeID uint
	Employee   Employee `gorm:"foreignKey:EmployeeID"`

	TicketVerification []TicketVerification   `gorm:"foreignKey:DriverID"`
}
