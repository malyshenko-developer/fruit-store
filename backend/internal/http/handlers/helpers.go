package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func writeOK(c *gin.Context, payload any) {
	c.JSON(http.StatusOK, payload)
}

func writeInternalError(c *gin.Context, msg string) {
	c.JSON(http.StatusInternalServerError, gin.H{"error": gin.H{"code": "internal_error", "message": msg}})
}

func writeNotFound(c *gin.Context, msg string) {
	c.JSON(http.StatusNotFound, gin.H{"error": gin.H{"code": "not_found", "message": msg}})
}

func writeBadRequest(c *gin.Context, msg string) {
	c.JSON(http.StatusBadRequest, gin.H{"error": gin.H{"code": "bad_request", "message": msg}})
}
