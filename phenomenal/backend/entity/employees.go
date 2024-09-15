package entity

import "gorm.io/gorm"

type Employees struct {
	gorm.Model

	FirstName   string
	LastName    string
	PhoneNumber string
	Position    string
	Address     string

	Drivers []Drivers `gorm:"foreignKey:EmployeeID"`

}
