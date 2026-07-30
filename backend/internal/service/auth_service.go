package service

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/malyshenko-developer/fruit-store/internal/apperr"
	"github.com/malyshenko-developer/fruit-store/internal/config"
	"github.com/malyshenko-developer/fruit-store/internal/model"
)

type UserRepository interface {
	GetByEmail(ctx context.Context, email string) (*model.User, error)
	Create(ctx context.Context, email string) (*model.User, error)
	GetByID(ctx context.Context, id int64) (*model.User, error)
}

type RefreshTokenRepository interface {
	Create(ctx context.Context, rt *model.RefreshToken) error
	GetByToken(ctx context.Context, token string) (*model.RefreshToken, error)
	Delete(ctx context.Context, token string) error
}

type AuthTokens struct {
	AccessToken  string
	RefreshToken string
}

type AuthService interface {
	RequestCode(ctx context.Context, email string) error
	VerifyCode(ctx context.Context, email, code, sessionID string) (*AuthTokens, error)
	RefreshAccessToken(ctx context.Context, refreshToken string) (string, error)
	GetUserByID(ctx context.Context, userID int64) (*model.User, error)
}

type authService struct {
	userRepo         UserRepository
	cartRepo         CartRepository
	refreshTokenRepo RefreshTokenRepository
	otpService       OTPService
	emailService     EmailService
	jwtSecret        string
}

func NewAuthService(userRepo UserRepository, cartRepo CartRepository, refreshTokenRepo RefreshTokenRepository, otpService OTPService, emailService EmailService, jwtSecret string) AuthService {
	return &authService{
		userRepo:         userRepo,
		cartRepo:         cartRepo,
		refreshTokenRepo: refreshTokenRepo,
		otpService:       otpService,
		emailService:     emailService,
		jwtSecret:        jwtSecret,
	}
}

func (s *authService) RequestCode(ctx context.Context, email string) error {
	code, err := s.otpService.GenerateAndStore(ctx, email)
	if err != nil {
		return err
	}

	return s.emailService.SendOTPCode(email, code)
}

func (s *authService) VerifyCode(ctx context.Context, email, code, sessionID string) (*AuthTokens, error) {
	if err := s.otpService.Verify(ctx, email, code); err != nil {
		return nil, err
	}

	user, err := s.userRepo.GetByEmail(ctx, email)
	if err != nil {
		if !errors.Is(err, apperr.ErrNotFound) {
			return nil, err
		}

		user, err = s.userRepo.Create(ctx, email)
		if err != nil {
			return nil, err
		}
	}

	if err := s.cartRepo.AttachToUser(ctx, sessionID, user.ID); err != nil {
		return nil, err
	}

	return s.issueTokens(ctx, user.ID)
}

func (s *authService) RefreshAccessToken(ctx context.Context, refreshToken string) (string, error) {
	rt, err := s.refreshTokenRepo.GetByToken(ctx, refreshToken)
	if err != nil {
		return "", err
	}

	if time.Now().After(rt.ExpiresAt) {
		return "", apperr.ErrNotFound
	}

	return s.generateAccessToken(rt.UserID)
}

func (s *authService) issueTokens(ctx context.Context, userID int64) (*AuthTokens, error) {
	accessToken, err := s.generateAccessToken(userID)
	if err != nil {
		return nil, err
	}

	refreshToken, err := generateRandomToken()
	if err != nil {
		return nil, err
	}

	err = s.refreshTokenRepo.Create(ctx, &model.RefreshToken{
		UserID:    userID,
		Token:     refreshToken,
		ExpiresAt: time.Now().Add(config.RefreshTokenTTL),
	})
	if err != nil {
		return nil, err
	}

	return &AuthTokens{AccessToken: accessToken, RefreshToken: refreshToken}, nil
}

func (s *authService) generateAccessToken(userID int64) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(config.AccessTokenTTL).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.jwtSecret))
}

func (s *authService) GetUserByID(ctx context.Context, userID int64) (*model.User, error) {
	return s.userRepo.GetByID(ctx, userID)
}

func generateRandomToken() (string, error) {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}
