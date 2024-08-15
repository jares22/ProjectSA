package entity

import "gorm.io/gorm"

type Passenger struct {
	gorm.Model
	MemberID  uint
	TicketID  uint
	Member    Member  `gorm:"foreignKey:MemberID"`
	Ticket    Ticket  `gorm:"foreignKey:TicketID"`
}
