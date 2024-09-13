package entity

import (
	"gorm.io/gorm"
)

type Vehicles struct {
	gorm.Model
	Type string
	Drivers   []Drivers `gorm:"foreignKey:BusID"`
	Seat      []Seat `gorm:"foreignKey:BusID"`
	BusTiming []BusTiming `gorm:"foreignKey:BusID"`
}
