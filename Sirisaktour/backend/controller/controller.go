package controller

import (
	"bookbus-backend/config"
	"bookbus-backend/entity"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type TicketRequest struct {
	TicketNumber string `json:"ticketNumber"`
}

type TicketResponse struct {
	IsValid      bool   `json:"isValid"` // Updated to match frontend expectations
	TicketNumber string `json:"ticketNumber,omitempty"`
	SeatStatus   string `json:"seatStatus,omitempty"`
	Message      string `json:"message,omitempty"`
}

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
