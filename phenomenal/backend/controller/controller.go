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
	KeyTicket string `json:"key_ticket" binding:"required"`
}

type VerifyTicketRequest struct {
	KeyTicket string `json:"key_ticket" binding:"required"`
}

// TicketResponse represents the response body for ticket verification
type TicketResponse struct {
	IsValid    bool   `json:"isValid"`
	Message    string `json:"message"`
	Keyticket  string `json:"key_ticket"`
	SeatStatus string `json:"seatStatus"`
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
	result := config.DB().Preload("Payment").First(&passenger, "key_ticket = ?", req.KeyTicket)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Ticket not found"})
		return
	}

	// Respond with the ticket details
	c.JSON(http.StatusOK, gin.H{
		"message":       "Ticket verified successfully",
		"key_ticket": passenger.KeyTicket,
		"name":          passenger.Name,
		"phone_number":  passenger.PhoneNumber,
		"seat":       passenger.Seat,
		"member_id":     passenger.MemberID,
		"status":        passenger.Payment.Status,
		"bus_timing_id": passenger.Payment.BustimingID,
		"passenger_id": passenger.ID, // Use `ID` from gorm.Model
	})
}

// UpdateSeatStatusRequest represents the structure of the request payload for updating seat status


// UpdateSeatStatus handles the request to update the status of a seat

// UpdateSeatStatus handles the request to update the status of a seat
type UpdateSeatStatusRequest struct {
	Keyticket string `json:"key_ticket" binding:"required"`
	Status    string `json:"Status" binding:"required"`
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
	// Query the database for a passenger with the specified ticket number and preload the Payment relation
	result := config.DB().Preload("Payment").Where("key_ticket = ?", req.Keyticket).First(&passenger)
	if result.Error != nil {
		if errors.Is(result.Error, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"message": "Ticket number not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Database query failed", "error": result.Error.Error()})
		return
	}

	// Check if Payment record is available
	if passenger.Payment.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "Payment record not found"})
		return
	}

	// Update the seat status
	passenger.Payment.Status = req.Status
	if err := config.DB().Save(&passenger.Payment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to update seat status", "error": err.Error()})
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

	// Fetch passengers with the specific bustiming_id through the Payment relation
	results := db.Preload("Payment.BusTiming").Where("payment_id IN (SELECT id FROM payments WHERE bustiming_id = ?)", uint(bustimingIDUint)).Find(&passengers)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	// Define the response structure for tickets
	type TicketResponse struct {
		PassengerID uint   `json:"passenger_id"`
		KeyTicket   string `json:"key_ticket"`
		Status      string `json:"status"`
		PhoneNumber string `json:"phone_number"`
		BusID       uint   `json:"bus_id"`
		BustimingID uint   `json:"bustiming_id"`
		DepartDate  string `json:"departdate"`
		DepartTime  string `json:"departtime"`
	}

	var response []TicketResponse

	// Loop through passengers to build the response
	for _, passenger := range passengers {
		DepartDate := ""
		DepartTime := ""
		if passenger.Payment.BusTiming.DepartureDay != "" {
			DepartDate = passenger.Payment.BusTiming.DepartureDay
			DepartTime = passenger.Payment.BusTiming.DepartureTime
		}

		response = append(response, TicketResponse{
			PassengerID: passenger.ID,
			KeyTicket:   passenger.KeyTicket,
			Status:      passenger.Payment.Status,
			PhoneNumber: passenger.PhoneNumber,
			BusID:       passenger.Payment.BusTiming.BusID,
			BustimingID: passenger.Payment.BustimingID,
			DepartTime:  DepartTime,
			DepartDate:  DepartDate,
		})
	}

	// Send the formatted response back
	c.JSON(http.StatusOK, response)
}

// type RequestBody struct {
// 	Passenger uint   `json:"passenger_id"`
// 	DriverID     uint   `json:"driver_id"`
// 	Status       string `json:"status"`
// }

// func CreateTicketVerification(c *gin.Context) {
// 	var requestBody RequestBody

// 	// Parse the request body
// 	if err := c.BindJSON(&requestBody); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
// 		return
// 	}

// 	// Initialize database connection
// 	db := config.DB()

// 	// Create new TicketVerification record
// 	newVerification := entity.TicketVerification{
// 		TicketID:         requestBody.TicketNumber,
// 		DriverID:         requestBody.DriverID,
// 		VerificationTime: time.Now(), // Set the current time as VerificationTime
// 		Status:           requestBody.Status,
// 	}

// 	if result := db.Create(&newVerification); result.Error != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"message": "Ticket verification created successfully", "data": newVerification})
// }

type RequestBody struct {
	PassengerID   int    `json:"passenger_id" binding:"required"`
	DriverID      int    `json:"driver_id" binding:"required"`
	Status        string `json:"status" binding:"required"`
}

// TicketVerification handles the request to create a new ticket verification record
func TicketVerification(c *gin.Context) {
	var requestBody RequestBody

	// Bind the request payload to the RequestBody struct
	if err := c.BindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	// Start database connection
	db := config.DB()

	// Check if there's already a verification record for the same passenger
	var existingVerification entity.TicketVerification
	if err := db.Where("passenger_id = ?", requestBody.PassengerID).First(&existingVerification).Error; err != nil && err != gorm.ErrRecordNotFound {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error checking for existing records"})
		return
	}

	if existingVerification.ID != 0 {
		// If exists, send a conflict message
		c.JSON(http.StatusConflict, gin.H{"error": "A verification record for this passenger already exists"})
		return
	}

	// Create new TicketVerification record
	newVerification := entity.TicketVerification{
		Verification_Time: time.Now(),
		Status:            requestBody.Status,
		DriversID:         uint(requestBody.DriverID),
		PassengerID:       uint(requestBody.PassengerID),
	}

	if result := db.Create(&newVerification); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Ticket verification record created successfully", "data": newVerification})
}
