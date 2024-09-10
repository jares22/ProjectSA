package entity

import (
	"gorm.io/gorm"
)

type Passenger struct {
	gorm.Model
	Username    string
	PhoneNumber string
	SeatID      uint
	MemberID    uint // Fix typo here

	Seat   Seat   `gorm:"foreignKey:SeatID"`
	Member Member `gorm:"foreignKey:MemberID"`
}
