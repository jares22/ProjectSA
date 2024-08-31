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

func GetTicket(c *gin.Context) {
	var ticket []entity.Ticket

	db := config.DB()
	results := db.Find(&ticket)  /*// Get all records    result := db.Find(&users)
															// SELECT * FROM users;*/
	if results.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": results.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, ticket)   //ถ้าการดึงข้อมูลสำเร็จ ฟังก์ชันจะส่ง HTTP 200 (OK) 
	//ทำเป็นไฟล์ JSON								//พร้อมกับ JSON ที่ประกอบด้วยรายการผู้ใช้ที่ถูกเก็บใน users.
}

