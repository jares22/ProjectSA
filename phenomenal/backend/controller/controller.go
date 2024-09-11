package controller

import (
	"sirisaktour/config"
	"sirisaktour/entity"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

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

	var ticket entity.Passenger
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
		SeatStatus:   ticket.Status,
	})
}


func UpdateSeatStatus(c *gin.Context) {
	var req UpdateSeatStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
		return
	}

	var ticket entity.Passenger
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
	ticket.Status = req.SeatStatus
	if saveErr := config.DB().Save(&ticket).Error; saveErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update seat status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Seat status updated successfully", "ticketNumber": ticket.TicketNumber, "seatStatus": ticket.Status})
}

//UpdateSeatStatus updates the seat status in the database
func GetTicket(c *gin.Context) {
	var passengers []entity.Passenger

	// Initialize DB connection
	db := config.DB()

	// Fetch all passengers without preloading related data
	results := db.Find(&passengers)

	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}

	// Define the response structure for tickets
	type TicketResponse struct {
		TicketNumber string `json:"ticket_number"`
		SeatStatus   string `json:"seat_status"`
		PhoneNumber  string `json:"phone_number"`
		BusID        uint   `json:"bus_id"`	
	}

	var response []TicketResponse

	// Loop through passengers to build the response
	for _, passenger := range passengers {
		response = append(response, TicketResponse{
			TicketNumber: passenger.TicketNumber, // Assuming the ticket number is directly on the passenger model
			SeatStatus:   passenger.Status,       // Assuming the seat status is directly accessible from the Passenger model
			PhoneNumber:  passenger.PhoneNumber,  // Assuming PhoneNumber is directly accessible from the Passenger model
			BusID:        passenger.Seat.BusID,   // Assuming Seat has a BusID field
		})
	}

	// Send the formatted response back
	c.JSON(http.StatusOK, response)
}




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