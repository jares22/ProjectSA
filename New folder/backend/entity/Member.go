package entity

import (
	"time"
	"gorm.io/gorm"
)

type Member struct {
	gorm.Model
	Username  string    `gorm:"not null"`
	Password  string    `gorm:"not null"`
	Firstname string    `gorm:"not null"`
	Lastname  string    `gorm:"not null"`
	Email     string    `gorm:"unique;not null"` // Ensure email is unique and not null
	Birthday  time.Time `gorm:"type:date"` // Use the date type for birthdays
}
