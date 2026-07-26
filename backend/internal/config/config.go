package config

import (
	"fmt"
	"os"
	"time"
)

type Config struct {
	DatabaseURL  string
	RedisURL     string
	Port         string
	LogLevel     string
	ResendAPIKey string
	JWTSecret    string
}

const (
	AuthCookieName = "auth_token"
	AuthTokenTTL   = 30 * 24 * time.Hour
)

func Load() (*Config, error) {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		return nil, fmt.Errorf("DATABASE_URL is required")
	}

	redisURL := os.Getenv("REDIS_URL")
	if redisURL == "" {
		redisURL = "redis://localhost:6379"
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	logLevel := os.Getenv("LOG_LEVEL")
	if logLevel == "" {
		logLevel = "info"
	}

	resendAPIKey := os.Getenv("RESEND_API_KEY")
	if resendAPIKey == "" {
		return nil, fmt.Errorf("RESEND_API_KEY is required")
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		return nil, fmt.Errorf("JWT_SECRET is required")
	}

	return &Config{
		DatabaseURL:  dbURL,
		RedisURL:     redisURL,
		Port:         port,
		LogLevel:     logLevel,
		ResendAPIKey: resendAPIKey,
		JWTSecret:    jwtSecret,
	}, nil
}
