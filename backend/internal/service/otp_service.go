package service

import (
	"context"
	"crypto/rand"
	"errors"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
)

var (
	ErrTooManyRequests = errors.New("too many requests, try again later")
	ErrInvalidCode     = errors.New("invalid or expired code")
)

const (
	otpTTL       = 5 * time.Minute
	rateLimitTTL = 60 * time.Second
)

type OTPService interface {
	GenerateAndStore(ctx context.Context, email string) (string, error)
	Verify(ctx context.Context, email, code string) error
}

type otpService struct {
	redis *redis.Client
}

func NewOTPService(redisClient *redis.Client) OTPService {
	return &otpService{redis: redisClient}
}

func (s *otpService) GenerateAndStore(ctx context.Context, email string) (string, error) {
	rateLimitKey := fmt.Sprintf("otp_rate_limit:%s", email)

	exists, err := s.redis.Exists(ctx, rateLimitKey).Result()
	if err != nil {
		return "", err
	}
	if exists > 0 {
		return "", ErrTooManyRequests
	}

	code, err := generateCode()
	if err != nil {
		return "", err
	}

	otpKey := fmt.Sprintf("otp:%s", email)
	if err := s.redis.Set(ctx, otpKey, code, otpTTL).Err(); err != nil {
		return "", err
	}

	if err := s.redis.Set(ctx, rateLimitKey, "1", rateLimitTTL).Err(); err != nil {
		return "", err
	}

	return code, nil
}

func (s *otpService) Verify(ctx context.Context, email, code string) error {
	otpKey := fmt.Sprintf("otp:%s", email)

	storedCode, err := s.redis.Get(ctx, otpKey).Result()
	if err != nil {
		if errors.Is(err, redis.Nil) {
			return ErrInvalidCode
		}
		return err
	}

	if storedCode != code {
		return ErrInvalidCode
	}

	s.redis.Del(ctx, otpKey)
	return nil
}

func generateCode() (string, error) {
	const digits = "0123456789"
	code := make([]byte, 6)

	randomBytes := make([]byte, 6)
	if _, err := rand.Read(randomBytes); err != nil {
		return "", err
	}

	for i, b := range randomBytes {
		code[i] = digits[int(b)%10]
	}

	return string(code), nil
}
