package config

import (
	"fmt"
	"bookbus-backend/entity"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var db *gorm.DB

// ConnectionDB establishes a connection to the database.
func ConnectionDB() {
	database, err := gorm.Open(sqlite.Open("sa.db?cache=shared"), &gorm.Config{})
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
		&entity.Ticket{},
		// Add other models here
	)
	if err != nil {
		fmt.Printf("Error migrating database: %v\n", err)
	}
}
