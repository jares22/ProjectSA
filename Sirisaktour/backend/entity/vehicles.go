package entity

import (
	"gorm.io/gorm"
)

type Vehicles struct {
	gorm.Model
	
	Drivers   []Drivers `gorm:"foreignKey:BusID"`
	Seat      []Seat `gorm:"foreignKey:BusID"`
	BusTiming []BusTiming `gorm:"foreignKey:BusID"`
}
