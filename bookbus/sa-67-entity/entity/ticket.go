package entity

import "gorm.io/gorm"

type Ticket struct {
	gorm.Model
	MemberID    uint
	SeatID      uint
	ScheduleID  uint
	IssueDate   string `gorm:"not null"` // Use string for date
	Status      string `gorm:"not null"`
	Member      Member    `gorm:"foreignKey:MemberID"`
	Seat        Seat      `gorm:"foreignKey:SeatID"`
	Schedule    Schedule  `gorm:"foreignKey:ScheduleID"`
}
