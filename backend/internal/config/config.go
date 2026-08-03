package config

import (
	"fmt"
	"os"
	"time"
)

type Config struct {
	DatabaseURL         string
	RedisURL            string
	Port                string
	LogLevel            string
	ResendAPIKey        string
	JWTSecret           string
	YandexClientID      string
	YandexClientSecret  string
	YandexRedirectURI   string
	StripeSecretKey     string
	StripeWebhookSecret string
}

const (
	AccessCookieName  = "access_token"
	RefreshCookieName = "refresh_token"
	AccessTokenTTL    = 15 * time.Minute
	RefreshTokenTTL   = 30 * 24 * time.Hour
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

	yandexClientID := os.Getenv("YANDEX_CLIENT_ID")
	if yandexClientID == "" {
		return nil, fmt.Errorf("YANDEX_CLIENT_ID is required")
	}

	yandexClientSecret := os.Getenv("YANDEX_CLIENT_SECRET")
	if yandexClientSecret == "" {
		return nil, fmt.Errorf("YANDEX_CLIENT_SECRET is required")
	}

	yandexRedirectURI := os.Getenv("YANDEX_REDIRECT_URI")
	if yandexRedirectURI == "" {
		yandexRedirectURI = "http://localhost:8080/v1/auth/yandex/callback"
	}

	stripeSecretKey := os.Getenv("STRIPE_SECRET_KEY")
	if stripeSecretKey == "" {
		return nil, fmt.Errorf("STRIPE_SECRET_KEY is required")
	}

	stripeWebhookSecret := os.Getenv("STRIPE_WEBHOOK_SECRET")
	if stripeWebhookSecret == "" {
		return nil, fmt.Errorf("STRIPE_WEBHOOK_SECRET is required")
	}

	return &Config{
		DatabaseURL:         dbURL,
		RedisURL:            redisURL,
		Port:                port,
		LogLevel:            logLevel,
		ResendAPIKey:        resendAPIKey,
		JWTSecret:           jwtSecret,
		YandexClientID:      yandexClientID,
		YandexClientSecret:  yandexClientSecret,
		YandexRedirectURI:   yandexRedirectURI,
		StripeSecretKey:     stripeSecretKey,
		StripeWebhookSecret: stripeWebhookSecret,
	}, nil
}
