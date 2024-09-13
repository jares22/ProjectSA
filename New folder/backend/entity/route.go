package entity

import (
	"gorm.io/gorm"
)

type Route struct {
	gorm.Model
	NameRoute string
	Routeway  string // Avoid underscores in database column names

	BusTiming []BusTiming `gorm:"foreignKey:RouteID"`
}
