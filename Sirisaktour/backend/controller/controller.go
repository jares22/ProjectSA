package controller

import (
	"bookbus-backend/config"
	"bookbus-backend/entity"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// TicketRequest represents the request body for ticket verification
type TicketRequest struct {
	TicketNumber string `json:"ticketNumber" binding:"required"`
}

// TicketResponse represents the response body for ticket verification
type TicketResponse struct {
	IsValid      bool   `json:"isValid"`
	TicketNumber string `json:"ticketNumber,omitempty"`
	SeatStatus   string `json:"seatStatus,omitempty"`
	Message      string `json:"message,omitempty"`
}

// UpdateSeatStatusRequest represents the request body for updating seat status
type UpdateSeatStatusRequest struct {
	TicketNumber string `json:"ticketNumber" binding:"required"`
	SeatStatus   string `json:"seatStatus" binding:"required"`
}

// VerifyTicket checks if the ticket is valid
func VerifyTicket(c *gin.Context) {
	var req TicketRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, TicketResponse{IsValid: false, Message: "Invalid request format"})
		return
	}

	var ticket entity.Ticket
	result := config.DB().Where("ticket_number = ?", req.TicketNumber).First(&ticket)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, TicketResponse{IsValid: false, Message: "Invalid ticket number"})
			return
		}
		c.JSON(http.StatusInternalServerError, TicketResponse{IsValid: false, Message: "Internal server error"})
		return
	}

	c.JSON(http.StatusOK, TicketResponse{
		IsValid:      true,
		TicketNumber: ticket.TicketNumber,
		SeatStatus:   ticket.SeatStatus,
	})
}

// GetTicket retrieves all tickets from the database
func GetTicket(c *gin.Context) {
	var tickets []entity.Ticket

	// Initialize DB connection
	db := config.DB()

	// Preload related data
	results := db.Preload("Payment").Preload("Payment.Passenger").Preload("TicketVerification").Preload("TicketVerification.Driver").Preload("Payment.Passenger.Seat").Find(&tickets)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	// Create a response structure to include additional details
	type TicketResponse struct {
		TicketNumber string `json:"ticket_number"`
		SeatStatus   string `json:"seat_status"`
		PhoneNumber  string `json:"phone_number"`
		BusID        uint   `json:"bus_id"`
		BusRoute     string `json:"bus_route"` // Updated field name
	}

	var response []TicketResponse

	for _, ticket := range tickets {
		// Get related entities
		passenger := ticket.Payment.Passenger
		busID := ticket.Payment.Passenger.Seat.BusID // Assuming you have a way to retrieve BusID, adjust if necessary
		busRoute := ticket.Payment.BusRound.Format("2006-01-02 15:04:05") // Format if needed

		response = append(response, TicketResponse{
			TicketNumber: ticket.TicketNumber,
			SeatStatus:   ticket.SeatStatus,
			PhoneNumber:  passenger.PhoneNumber,
			BusID:        busID,
			BusRoute:     busRoute,
		})
	}

	c.JSON(http.StatusOK, response)
}

//UpdateSeatStatus updates the seat status in the database
func UpdateSeatStatus(c *gin.Context) {
	var req UpdateSeatStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	var ticket entity.Ticket
	result := config.DB().Where("ticket_number = ?", req.TicketNumber).First(&ticket)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Ticket not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	// Update the seat status
	ticket.SeatStatus = req.SeatStatus
	if saveErr := config.DB().Save(&ticket).Error; saveErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update seat status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Seat status updated successfully", "ticketNumber": ticket.TicketNumber, "seatStatus": ticket.SeatStatus})
}

// // GetSeatDetails retrieves all seats from the database
// func GetSeatDetails(c *gin.Context) {
// 	var seats []entity.Seat

// 	db := config.DB()
// 	results := db.Find(&seats)
// 	if results.Error != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
// 		return
// 	}
// 	c.JSON(http.StatusOK, seats)
// }



func GetBusRounds(c *gin.Context) {
	var busRounds []struct {
		DepartureDay  string `json:"departure_day"`
		DepartureTime string `json:"departure_time"`
	}

	db := config.DB()
	// เลือกเฉพาะฟิลด์ DepartureDay และ DepartureTime
	result := db.Model(&entity.BusTiming{}).Select("departure_day, departure_time").Find(&busRounds)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, busRounds)
}


//GetVerifiers retrieves all tickets based on the selected bus round
func GetVerifiers(c *gin.Context) {
	busRound := c.Query("BustimingID")
	if busRound == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bus round is required"})
		return
	}

	var tickets []entity.Passenger
	db := config.DB()

	result := db.Preload("BusTiming").Preload("Payment.Passenger").Preload("TicketVerification").Preload("TicketVerification.Driver").Preload("Payment.Passenger.Seat").Where("bus_round = ?", busRound).Find(&tickets)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": result.Error.Error()})
		return
	}

	type TicketResponse struct {
		TicketNumber string `json:"ticket_number"`
		SeatStatus   string `json:"seat_status"`
		PhoneNumber  string `json:"phone_number"`
		BusID        uint   `json:"bus_id"`
		BusRoute     string `json:"bus_route"`
	}

	var response []TicketResponse

	for _, ticket := range tickets {
		passenger := ticket.Payment.Passenger
		busID := ticket.Payment.Passenger.Seat.BusID
		busRoute := ticket.Payment.BusRound.Format("2006-01-02 15:04:05")

		response = append(response, TicketResponse{
			TicketNumber: ticket.TicketNumber,
			SeatStatus:   ticket.SeatStatus,
			PhoneNumber:  passenger.PhoneNumber,
			BusID:        busID,
			BusRoute:     busRoute,
		})
	}

	c.JSON(http.StatusOK, response)
}