package entity

import "gorm.io/gorm"

type Route struct {
	gorm.Model
	StartLocation string `gorm:"not null"`
	EndLocation   string `gorm:"not null"`
	Distance      int    `gorm:"not null"`
	Schedules     []Schedule
}
