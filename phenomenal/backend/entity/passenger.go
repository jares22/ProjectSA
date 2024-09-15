package entity

import (

	"gorm.io/gorm"
)

type Passenger struct {
	gorm.Model
	KeyTicket	string
	Name		string
	PhoneNumber		string
	Seat		string

	MemberID 	uint
	Member 	Member `gorm:"foreignKey:MemberID"`

	PaymentID 	uint
	Payment 	Payment	`gorm:"foreignKey:PaymentID"`

	TicketVerification []TicketVerification `gorm:"foreignKey:PassengerID"`

}
