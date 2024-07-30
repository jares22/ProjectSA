package main

import (
    "encoding/json"
    "net/http"
    "github.com/gorilla/mux"
    "gorm.io/driver/sqlite"
    "gorm.io/gorm"
)

type Member struct {
    ID        uint   `gorm:"primaryKey"`
    Username  string `gorm:"unique;not null"`
    Password  string `gorm:"not null"`
    Email     string `gorm:"not null"`
    FirstName string `gorm:"not null"`
    LastName  string `gorm:"not null"`
    Birthday  string `gorm:"not null"` // Change to `date` or `datetime` based on your database
}

type Ticket struct {
    ID         uint   `gorm:"primaryKey"`
    MemberID   uint   `gorm:"not null"`
    SeatID     uint   `gorm:"not null"`
    ScheduleID uint   `gorm:"not null"`
    IssueDate  string `gorm:"not null"` // Change to `date` or `datetime` based on your database
    Status     string `gorm:"not null"`
}

type Seat struct {
    ID         uint   `gorm:"primaryKey"`
    BusID      uint   `gorm:"not null"`
    SeatNumber string `gorm:"not null"`
}

type Bus struct {
    ID         uint   `gorm:"primaryKey"`
    BusNumber  string `gorm:"not null"`
    BusType    string `gorm:"not null"`
}

type Route struct {
    ID            uint   `gorm:"primaryKey"`
    StartLocation string `gorm:"not null"`
    EndLocation   string `gorm:"not null"`
    Distance      int    `gorm:"not null"`
}

type Schedule struct {
    ID           uint   `gorm:"primaryKey"`
    RouteID      uint   `gorm:"not null"`
    BusID        uint   `gorm:"not null"`
    DepartureTime string `gorm:"not null"` // Change to `datetime` based on your database
    ArrivalTime   string `gorm:"not null"` // Change to `datetime` based on your database
}

type Employee struct {
    ID        uint   `gorm:"primaryKey"`
    Username  string `gorm:"unique;not null"`
    Password  string `gorm:"not null"`
    FirstName string `gorm:"not null"`
    LastName  string `gorm:"not null"`
}

type TicketVerification struct {
    ID             uint   `gorm:"primaryKey"`
    TicketID       uint   `gorm:"not null"`
    EmployeeID     uint   `gorm:"not null"`
    VerificationTime string `gorm:"not null"` // Change to `datetime` based on your database
    Status         string `gorm:"not null"`
}

type UnverifiedPassenger struct {
    ID             uint   `gorm:"primaryKey"`
    MemberID       uint   `gorm:"not null"`
    TicketID       uint   `gorm:"not null"`
    ScheduleID     uint   `gorm:"not null"`
    BusID          uint   `gorm:"not null"`
    FirstName      string `gorm:"not null"`
    LastName       string `gorm:"not null"`
    Username       string `gorm:"not null"`
    Email          string `gorm:"not null"`
    PhoneNumber    string `gorm:"not null"`
    DepartureTime  string `gorm:"not null"` // Change to `datetime` based on your database
}

var db *gorm.DB
var err error

func main() {
    // เปิดการเชื่อมต่อกับฐานข้อมูล SQLite
    db, err = gorm.Open(sqlite.Open("bookbus.db"), &gorm.Config{})
    if err != nil {
        panic("failed to connect database")
    }

    // อัตโนมัติสร้างตารางที่ใช้โครงสร้างข้อมูล
    db.AutoMigrate(&Member{}, &Ticket{}, &Seat{}, &Bus{}, &Route{}, &Schedule{}, &Employee{}, &TicketVerification{}, &UnverifiedPassenger{})

    // กำหนด router
    r := mux.NewRouter()

    // กำหนด route สำหรับรับ request
    r.HandleFunc("/api/seats", getSeats).Methods("GET")

    // รัน server
    http.ListenAndServe(":8080", r)
}

func getSeats(w http.ResponseWriter, r *http.Request) {
    var seats []Seat
    db.Find(&seats)
    json.NewEncoder(w).Encode(seats)
}
