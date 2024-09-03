// main.go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"bookbus-backend/config"
	"bookbus-backend/controller"
)

const PORT = "8000"

func main() {
	// Open connection to the database
	config.ConnectionDB()
	config.SetupDatabase()

	r := gin.Default()

	// Use CORS middleware
	r.Use(CORSMiddleware())

	// Define routes
	router := r.Group("")
	{
		router.POST("/verify-ticket", controller.VerifyTicket)
		router.GET("/ticket", controller.GetTicket)
		router.PUT("/update-seat-status", controller.UpdateSeatStatus)
	}

	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "API RUNNING... PORT: %s", PORT)
	})

	// Run the server
	r.Run(":" + PORT)
}

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE, PATCH")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
