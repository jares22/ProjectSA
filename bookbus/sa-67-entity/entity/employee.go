package entity

import "gorm.io/gorm"

type Employee struct {
	gorm.Model
	Username   string `gorm:"unique;not null"`
	Password   string `gorm:"not null"`
	FirstName  string `gorm:"not null"`
	LastName   string `gorm:"not null"`
	TicketVerifications []TicketVerification
}
