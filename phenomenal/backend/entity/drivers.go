package entity

import (
	"gorm.io/gorm"
)

type Drivers struct {
	gorm.Model
	BusID              *uint                 // Foreign key to the Bus table (make sure this matches your actual field)
	Vehicles           Vehicles             `gorm:"foreignKey:BusID"`
	EmployeeID         *uint                 // Correctly defining Employee's ID as foreign key
	Employee           Employee             `gorm:"foreignKey:EmployeeID;references:ID"` // Ensure correct foreign key and reference
	TicketVerification []TicketVerification `gorm:"foreignKey:DriverID"`
}
