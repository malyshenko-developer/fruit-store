package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

const sessionCookieName = "session_id"
const sessionContextKey = "session_id"
const sessionCookieMaxAge = 30 * 24 * 60 * 60

func Session() gin.HandlerFunc {
	return func(c *gin.Context) {
		sessionID, err := c.Cookie(sessionCookieName)

		if err != nil || sessionID == "" {
			sessionID = uuid.NewString()
			c.SetCookie(sessionCookieName, sessionID, sessionCookieMaxAge, "/", "", false, true)
		}

		c.Set(sessionContextKey, sessionID)
		c.Next()
	}
}

func GetSessionID(c *gin.Context) string {
	value, _ := c.Get(sessionContextKey)
	sessionID, _ := value.(string)
	return sessionID
}
