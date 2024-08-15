package main

import (
	"log"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"sa-67-entity/entity" // แทนที่ด้วยชื่อโมดูลของคุณ
)

func main() {
	db, err := gorm.Open(sqlite.Open("bus_ticket_verification.db"), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}

	// อัปเดตโครงสร้างฐานข้อมูล
	err = db.AutoMigrate(
		&entity.Member{},
		&entity.Ticket{},
		&entity.Seat{},
		&entity.Bus{},
		&entity.Route{},
		&entity.Schedule{},
		&entity.Employee{},
		&entity.TicketVerification{},
		&entity.Passenger{},
	)
	if err != nil {
		log.Fatalf("failed to migrate schema: %v", err)
	}

	log.Println("Database schema migrated successfully.")
}
