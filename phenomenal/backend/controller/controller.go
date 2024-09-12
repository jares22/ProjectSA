package controller

import (
	"errors"
	"fmt"
	"net/http"
	"sirisaktour/config"
	"sirisaktour/entity"
	"strconv"
	//"time"

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
	}
	c.JSON(http.StatusOK, gin.H{"message": "Ticket verified successfully", "ticket_number": passenger.TicketNumber, "seatStatus": passenger.Status})
	
}

// func VerifyTicket(c *gin.Context) {

// 	var passenger entity.Passenger
// 	if err := c.ShouldBindJSON(&passenger); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request format"})
// 		return
// 	}

// 	db := config.DB()

// 	db.Find(&passenger, "ticket_number = ?", passenger.TicketNumber)

// 	c.JSON(http.StatusOK, gin.H{"message": "Ticket verified successfully", "ticket_number": passenger.TicketNumber, "seatStatus": passenger.Status})
// }


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
func GetTicket(c *gin.Context) {

	var passengers []entity.Passenger

	// Initialize DB connection
	db := config.DB()

	// Fetch all passengers without preloading related data
	results := db.Preload("Seat").Find(&passengers)

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
		BusID        uint   `json:"bus_id"` // Assuming Seat has a BusID field
	}

	var response []TicketResponse

	// Loop through passengers to build the response
	for _, passenger := range passengers {
		response = append(response, TicketResponse{
			PassengerID:  passenger.ID, // Include passenger ID in the response
			TicketNumber: passenger.TicketNumber,
			SeatStatus:   passenger.Status,
			PhoneNumber:  passenger.PhoneNumber,
			BusID:        passenger.Seat.BusID, // Assuming Seat has a BusID field
		})
	}

	// Send the formatted response back
	c.JSON(http.StatusOK, response)
}

func GetBusRounds(c *gin.Context) {
	var busRounds []struct {
		ID             uint   `json:"id"`      // Field to hold bus timing ID
		DepartureDay   string `json:"departure_day"`
		DepartureTime  string `json:"departure_time"`
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



// //GetVerifiers retrieves all tickets based on the selected bus round
// func GetVerifiers(c *gin.Context) {
// 	busRound := c.Query("busRound")
// 	if busRound == "" {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "Bus round is required"})
// 		return
// 	}

// 	var tickets []entity.Passenger
// 	db := config.DB()

// 	result := db.Preload("Payment").Preload("Payment.Passenger").Preload("TicketVerification").Preload("TicketVerification.Driver").Preload("Payment.Passenger.Seat").Where("bus_round = ?", busRound).Find(&tickets)
// 	if result.Error != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
// 		return
// 	}

// 	type TicketResponse struct {
// 		TicketNumber string `json:"ticket_number"`
// 		SeatStatus   string `json:"seat_status"`
// 		PhoneNumber  string `json:"phone_number"`
// 		BusID        uint   `json:"bus_id"`
// 		BusRoute     string `json:"bus_route"`
// 	}

// 	var response []TicketResponse

// 	for _, ticket := range tickets {
// 		passenger := ticket.Payment.Passenger
// 		busID := ticket.Payment.Passenger.Seat.BusID
// 		busRoute := ticket.Payment.BusRound.Format("2006-01-02 15:04:05")

// 		response = append(response, TicketResponse{
// 			TicketNumber: ticket.TicketNumber,
// 			SeatStatus:   ticket.SeatStatus,
// 			PhoneNumber:  passenger.PhoneNumber,
// 			BusID:        busID,
// 			BusRoute:     busRoute,
// 		})
// 	}

// 	c.JSON(http.StatusOK, response)
// }







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

    // Fetch passengers with the specific bustiming_id
    results := db.Where("bustiming_id = ?", uint(bustimingIDUint)).Find(&passengers)

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
    }

    var response []TicketResponse

    // Loop through passengers to build the response
    for _, passenger := range passengers {
        response = append(response, TicketResponse{
            PassengerID:  passenger.ID,
            TicketNumber: passenger.TicketNumber,
            SeatStatus:   passenger.Status,
            PhoneNumber:  passenger.PhoneNumber,
            BusID:        passenger.Seat.BusID,
            BustimingID:  passenger.BustimingID,
        })
    }

    // Send the formatted response back
    c.JSON(http.StatusOK, response)
}
