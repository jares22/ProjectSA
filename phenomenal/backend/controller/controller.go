package controller

import (
	"errors"
	"fmt"
	"net/http"
	"sirisaktour/config"
	"sirisaktour/entity"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type TicketRequest struct {
	TicketNumber string `json:"ticketNumber" binding:"required"`
}

type VerifyTicketRequest struct {
	TicketNumber string `json:"ticket_number"`
}

// TicketResponse represents the response body for ticket verification
type TicketResponse struct {
	IsValid      bool   `json:"isValid"`
	Message      string `json:"message"`
	TicketNumber string `json:"ticket_number"`
	SeatStatus   string `json:"seatStatus"`
}

func VerifyTicket(c *gin.Context) {
	var req TicketRequest
	// Bind the request payload to the TicketRequest struct
	if err := c.ShouldBindJSON(&req); err != nil {
		fmt.Println("Request binding error:", err)
		c.JSON(http.StatusBadRequest, TicketResponse{
			IsValid: false,
			Message: "Invalid request format",
		})
		return
	}
	
	var passenger entity.Passenger
	// Query the database for a passenger with the specified ticket number
	result := config.DB().First(&passenger, "ticket_number = ?", req.TicketNumber)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Ticket not found"})
		return
	}


	// Respond with the ticket details
	c.JSON(http.StatusOK, gin.H{
		"message":       "Ticket verified successfully",
		"ticket_number": passenger.TicketNumber,
		"username":      passenger.Username,
		"phone_number":  passenger.PhoneNumber,
		"seat_id":       passenger.SeatID,
		"member_id":     passenger.MemberID,
		"status":        passenger.Status,
		"bus_timing_id": passenger.BustimingID,
		"passenger_id":  passenger.ID, // Use `ID` from gorm.Model
	})
}

// UpdateSeatStatusRequest represents the structure of the request payload for updating seat status
type UpdateSeatStatusRequest struct {
	TicketNumber string `json:"ticketNumber" binding:"required"`
	SeatStatus   string `json:"seatStatus" binding:"required"`
}

// UpdateSeatStatus handles the request to update the status of a seat
func UpdateSeatStatus(c *gin.Context) {
	var req UpdateSeatStatusRequest
	// Bind the request payload to the UpdateSeatStatusRequest struct
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request format"})
		return
	}

	var passenger entity.Passenger
	// Query the database for a passenger with the specified ticket number
	result := config.DB().Where("ticket_number = ?", req.TicketNumber).First(&passenger)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"message": "Ticket number not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Internal server error"})
		return
	}

	// Update the seat status
	passenger.Status = req.SeatStatus
	if err := config.DB().Save(&passenger).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to update seat status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Seat status updated successfully"})
}

// UpdateSeatStatus updates the seat status in the database
// func GetTicket(c *gin.Context) {

// 	var passengers []entity.Passenger

// 	// Initialize DB connection
// 	db := config.DB()

// 	// Fetch all passengers without preloading related data
// 	results := db.Preload("Seat").Find(&passengers)

// 	if results.Error != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
// 		return
// 	}


// 	// Define the response structure for tickets
// 	type TicketResponse struct {
// 		PassengerID  uint   `json:"passenger_id"`
// 		TicketNumber string `json:"ticket_number"`
// 		SeatStatus   string `json:"seat_status"`
// 		PhoneNumber  string `json:"phone_number"`
// 		BusID        uint   `json:"bus_id"` // Assuming Seat has a BusID field
// 	}

// 	var response []TicketResponse

// 	// Loop through passengers to build the response
// 	for _, passenger := range passengers {
// 		response = append(response, TicketResponse{
// 			PassengerID:  passenger.ID, // Include passenger ID in the response
// 			TicketNumber: passenger.TicketNumber,
// 			SeatStatus:   passenger.Status,
// 			PhoneNumber:  passenger.PhoneNumber,
// 			BusID:        passenger.Seat.BusID, // Assuming Seat has a BusID field
// 		})
// 	}

// 	// Send the formatted response back
// 	c.JSON(http.StatusOK, response)
// }

func GetBusRounds(c *gin.Context) {
	var busRounds []struct {
		ID            uint   `json:"id"` // Field to hold bus timing ID
		DepartureDay  string `json:"departure_day"`
		DepartureTime string `json:"departure_time"`
	}

	db := config.DB()
	// Select ID (bustiming_id), DepartureDay, and DepartureTime
	result := db.Model(&entity.BusTiming{}).Select("id , departure_day, departure_time").Find(&busRounds)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, busRounds)
}

func GetVerifiers(c *gin.Context) {
	var passengers []entity.Passenger

	// Initialize DB connection
	db := config.DB()

	// Get query parameters
	bustimingID := c.Query("bustiming_id")

	// Check if bustiming_id is provided
	if bustimingID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "bustiming_id is required"})
		return
	}

	// Convert bustimingID to uint
	bustimingIDUint, err := strconv.ParseUint(bustimingID, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid bustiming_id"})
		return
	}

	// Fetch passengers with the specific bustiming_id, including bustiming data
	results := db.Preload("BusTiming").Preload("Seat").Where("bustiming_id = ?", uint(bustimingIDUint)).Find(&passengers)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	// Define the response structure for tickets
	type TicketResponse struct {
		PassengerID  uint   `json:"passenger_id"`
		TicketNumber string `json:"ticket_number"`
		SeatStatus   string `json:"seat_status"`
		PhoneNumber  string `json:"phone_number"`
		BusID        uint   `json:"bus_id"`
		BustimingID  uint   `json:"bustiming_id"`
		DepartDate   string `json:"departdate"`  // Adjust the type as per your entity, e.g., time.Time
		DepartTime   string `json:"departtime"`  // Adjust the type as per your entity, e.g., time.Time
	}

	var response []TicketResponse

	// Loop through passengers to build the response
	for _, passenger := range passengers {
		DepartDate := ""
		DepartTime := ""
		if passenger.BusTiming.DepartureDay != "" {
			DepartDate = passenger.BusTiming.DepartureDay
			DepartTime = passenger.BusTiming.DepartureTime
		}
	
		response = append(response, TicketResponse{
			PassengerID:  passenger.ID,
			TicketNumber: passenger.TicketNumber,
			SeatStatus:   passenger.Status,
			PhoneNumber:  passenger.PhoneNumber,
			BusID:        passenger.Seat.BusID,  // Ensure this fetches the correct BusID
			BustimingID:  passenger.BustimingID, // Fetch directly from passenger
			DepartTime:   DepartTime,
			DepartDate:   DepartDate,
		})
	}
	

	// Send the formatted response back
	c.JSON(http.StatusOK, response)
}


type RequestBody struct {
	TicketNumber uint   `json:"passenger_id"`
	DriverID     uint   `json:"driver_id"`
	Status       string `json:"status"`
}

func CreateTicketVerification(c *gin.Context) {
	var requestBody RequestBody

	// Parse the request body
	if err := c.BindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Initialize database connection
	db := config.DB()

	// Create new TicketVerification record
	newVerification := entity.TicketVerification{
		TicketID:         requestBody.TicketNumber,
		DriverID:         requestBody.DriverID,
		VerificationTime: time.Now(), // Set the current time as VerificationTime
		Status:           requestBody.Status,
	}

	if result := db.Create(&newVerification); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Ticket verification created successfully", "data": newVerification})
}


func TicketVerification(c *gin.Context) {
	var requestBody RequestBody

	// แปลงข้อมูลจาก request body
	if err := c.BindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "รูปแบบข้อมูลไม่ถูกต้อง"})
		return
	}

	// เริ่มการเชื่อมต่อกับฐานข้อมูล
	db := config.DB()

	// ตรวจสอบว่ามีข้อมูลการตรวจสอบบัตรที่มี ticketnumber เดียวกันนี้อยู่แล้วหรือไม่
	// ตรวจสอบว่ามีข้อมูลการตรวจสอบบัตรที่มี ticketnumber เดียวกันนี้อยู่แล้วหรือไม่
	var existingVerification entity.TicketVerification
	if err := db.Where("ticket_id = ?", requestBody.TicketNumber).First(&existingVerification).Error; err != nil && err != gorm.ErrRecordNotFound {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "เกิดข้อผิดพลาดขณะตรวจสอบข้อมูล"})
		return
	}

	if existingVerification.ID != 0 {
		// ถ้าพบ ให้ส่งข้อความแสดงข้อผิดพลาดว่ามีข้อมูลอยู่แล้ว
		c.JSON(http.StatusConflict, gin.H{"error": "มีการตรวจสอบบัตรด้วยหมายเลขนี้อยู่แล้ว"})
		return
	}

	// สร้างข้อมูลใหม่ในตาราง TicketVerification
	newVerification := entity.TicketVerification{
		TicketID:         requestBody.TicketNumber,
		DriverID:         requestBody.DriverID,
		VerificationTime: time.Now(), // บันทึกเวลาปัจจุบันเป็น VerificationTime
		Status:           requestBody.Status,
	}

	if result := db.Create(&newVerification); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "สร้างข้อมูลการตรวจสอบบัตรเรียบร้อยแล้ว", "data": newVerification})
}
