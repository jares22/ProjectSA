package entity

import (
	//"time"

	"gorm.io/gorm"
)

type Member struct {
	gorm.Model
	Username  string
	Password  string
	Email     string
	FirstName string
	LastName  string
	Birthday  string//time.Time

	Passenger []Passenger `gorm:"foreignKey:MemberID"`
}
