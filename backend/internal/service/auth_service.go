package service

import (
	"context"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/malyshenko-developer/fruit-store/internal/apperr"
	"github.com/malyshenko-developer/fruit-store/internal/model"
)

const jwtTTL = 30 * 24 * time.Hour

type UserRepository interface {
	GetByEmail(ctx context.Context, email string) (*model.User, error)
	Create(ctx context.Context, email string) (*model.User, error)
}

type AuthService interface {
	RequestCode(ctx context.Context, email string) error
	VerifyCode(ctx context.Context, email, code string) (string, error)
}

type authService struct {
	userRepo     UserRepository
	otpService   OTPService
	emailService EmailService
	jwtSecret    string
}

func NewAuthService(userRepo UserRepository, otpService OTPService, emailService EmailService, jwtSecret string) AuthService {
	return &authService{
		userRepo:     userRepo,
		otpService:   otpService,
		emailService: emailService,
		jwtSecret:    jwtSecret,
	}
}

func (s *authService) RequestCode(ctx context.Context, email string) error {
	code, err := s.otpService.GenerateAndStore(ctx, email)
	if err != nil {
		return err
	}

	return s.emailService.SendOTPCode(email, code)
}

func (s *authService) VerifyCode(ctx context.Context, email, code string) (string, error) {
	if err := s.otpService.Verify(ctx, email, code); err != nil {
		return "", err
	}

	user, err := s.userRepo.GetByEmail(ctx, email)
	if err != nil {
		if !errors.Is(err, apperr.ErrNotFound) {
			return "", err
		}

		user, err = s.userRepo.Create(ctx, email)
		if err != nil {
			return "", err
		}
	}

	return s.generateJWT(user.ID)
}

func (s *authService) generateJWT(userID int64) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(jwtTTL).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.jwtSecret))
}
