package entity

import "gorm.io/gorm"

type Member struct {
	gorm.Model
	Username   string `gorm:"unique;not null"`
	Password   string `gorm:"not null"`
	Email      string `gorm:"not null"`
	FirstName  string `gorm:"not null"`
	LastName   string `gorm:"not null"`
	Birthday   string `gorm:"not null"` // Use string for date
	Tickets    []Ticket
	Passengers []Passenger
}
