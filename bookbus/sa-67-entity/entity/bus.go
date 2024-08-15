package entity

import "gorm.io/gorm"

type Bus struct {
	gorm.Model
	BusNumber string `gorm:"not null"`
	BusType   string `gorm:"not null"`
	Seats     []Seat
	Schedules []Schedule
}
