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

	db := config.DB()
	results := db.Find(&tickets)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, tickets)
}

// UpdateSeatStatus updates the seat status in the database
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

// GetSeatDetails retrieves all seats from the database
func GetSeatDetails(c *gin.Context) {
	var seats []entity.Seat

	db := config.DB()
	results := db.Find(&seats)
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, seats)
}
