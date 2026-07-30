package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/malyshenko-developer/fruit-store/internal/config"
)

const userIDContextKey = "user_id"

func OptionalAuth(jwtSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString, err := c.Cookie(config.AccessCookieName)
		if err != nil || tokenString == "" {
			c.Next()
			return
		}

		token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
			return []byte(jwtSecret), nil
		})
		if err != nil || !token.Valid {
			c.Next()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.Next()
			return
		}

		userIDFloat, ok := claims["user_id"].(float64)
		if !ok {
			c.Next()
			return
		}

		c.Set(userIDContextKey, int64(userIDFloat))
		c.Next()
	}
}

func GetUserID(c *gin.Context) (int64, bool) {
	value, exists := c.Get(userIDContextKey)
	if !exists {
		return 0, false
	}

	userID, ok := value.(int64)
	return userID, ok
}
