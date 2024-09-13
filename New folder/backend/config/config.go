package config

import (
	"fmt"

	"sirisaktour/entity" // Ensure this path is correct and matches your project structure
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

// ConnectionDB establishes a connection to the database.
func ConnectionDB() {
	database, err := gorm.Open(sqlite.Open("SirisakTourDatabaseForSA.db?cache=shared"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}
	db = database
	fmt.Println("connected database")
}

// DB returns the database connection.
func DB() *gorm.DB {
	return db
}

// SetupDatabase automates the migration of database schema.
func SetupDatabase() {
	err := db.AutoMigrate(
		&entity.Employee{},
		&entity.Vehicles{},
		&entity.Route{},
		&entity.RouteData{},
		&entity.Member{},

		&entity.Drivers{},
		&entity.BusTiming{},
		&entity.Seat{},

		&entity.Passenger{},
		&entity.Payment{},
		
		//&entity.Ticket{},
		
		
		&entity.TicketVerification{},
		
		
		
	)
	if err != nil {
		fmt.Printf("Error migrating database: %v\n", err)
		return
	}
	fmt.Println("Database migration completed successfully.")
}
