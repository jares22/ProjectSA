package entity

import (
	"gorm.io/gorm"
)

type BusTiming struct {
	gorm.Model
	DepartureDay  string
	DepartureTime string
	ReturnDay     string
	ReturnTime    string

	BusID   uint
	Vehicles Vehicles `gorm:"foreignKey:BusID"`

	RouteID uint
	Route   Route `gorm:"foreignKey:RouteID"`
}
