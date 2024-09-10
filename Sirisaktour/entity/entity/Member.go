package entity

import (
	"gorm.io/gorm"
)

type Member struct {
	gorm.Model
	Passenger []Passenger    `gorm:"foreignKey:MemberID"`
}
