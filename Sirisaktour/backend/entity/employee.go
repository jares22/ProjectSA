package entity

import (
	"gorm.io/gorm"
)

type Employee struct {
	gorm.Model
	Username    string
	Password    string
	Firstname   string
	Lastname    string
	Position    string
	PhoneNumber string

	// Define the relationships with foreign keys
	Drivers             []Drivers             `gorm:"foreignKey:EmployeeID"`
}
