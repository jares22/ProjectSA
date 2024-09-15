package entity

import (

	

	"gorm.io/gorm"
)

type Payment struct {

	gorm.Model
	Departure  	string
	Destination	string
	Date 		string//time.Time
	Status 		string
	Timestamp 	string//time.Time
	Total		float32 
	Image		string `gorm:"type:longtext"`

	BustimingID uint
	BusTiming BusTiming `gorm:"foreignKey:BustimingID"`

	Passenger []Passenger `gorm:"foreignKey:PaymentID"`

}