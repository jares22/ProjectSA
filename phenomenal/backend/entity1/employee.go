package entity

import (
	"gorm.io/gorm"
)

type Employee struct {
    gorm.Model
    Username         string
    Password         string
    Firstname        string
    Lastname         string
    Position         string
    PhoneNumber      string
    Drivers          []Drivers `gorm:"foreignKey:EmployeeID;references:ID"` // Ensure correct foreign key and references
}

