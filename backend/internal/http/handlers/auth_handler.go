package handlers

import (
	"errors"
	"log/slog"

	"github.com/gin-gonic/gin"
	"github.com/malyshenko-developer/fruit-store/internal/apperr"
	"github.com/malyshenko-developer/fruit-store/internal/config"
	"github.com/malyshenko-developer/fruit-store/internal/http/dto"
	"github.com/malyshenko-developer/fruit-store/internal/http/middleware"
	"github.com/malyshenko-developer/fruit-store/internal/service"
)

type AuthHandler struct {
	service     service.AuthService
	yandexOAuth service.YandexOAuthService
	logger      *slog.Logger
}

func NewAuthHandler(service service.AuthService, yandexOAuth service.YandexOAuthService, logger *slog.Logger) *AuthHandler {
	return &AuthHandler{service: service, yandexOAuth: yandexOAuth, logger: logger}
}

func (h *AuthHandler) RequestCode(c *gin.Context) {
	var req dto.RequestCodeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		writeBadRequest(c, "invalid email")
		return
	}

	err := h.service.RequestCode(c.Request.Context(), req.Email)
	if err != nil {
		if errors.Is(err, service.ErrTooManyRequests) {
			writeBadRequest(c, "too many requests, please wait before trying again")
			return
		}
		h.logger.Error("failed to request otp code", "error", err, "email", req.Email)
		writeInternalError(c, "failed to send code")
		return
	}

	c.Status(204)
}

func (h *AuthHandler) VerifyCode(c *gin.Context) {
	var req dto.VerifyCodeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		writeBadRequest(c, "invalid request")
		return
	}

	sessionID := middleware.GetSessionID(c)

	tokens, err := h.service.VerifyCode(c.Request.Context(), req.Email, req.Code, sessionID)
	if err != nil {
		if errors.Is(err, service.ErrInvalidCode) {
			writeBadRequest(c, "invalid or expired code")
			return
		}
		h.logger.Error("failed to verify otp code", "error", err, "email", req.Email)
		writeInternalError(c, "failed to verify code")
		return
	}

	c.SetCookie(config.AccessCookieName, tokens.AccessToken, int(config.AccessTokenTTL.Seconds()), "/", "", false, true)
	c.SetCookie(config.RefreshCookieName, tokens.RefreshToken, int(config.RefreshTokenTTL.Seconds()), "/", "", false, true)

	c.Status(204)
}

func (h *AuthHandler) RefreshToken(c *gin.Context) {
	refreshToken, err := c.Cookie(config.RefreshCookieName)
	if err != nil || refreshToken == "" {
		writeUnauthorized(c, "no refresh token")
		return
	}

	accessToken, err := h.service.RefreshAccessToken(c.Request.Context(), refreshToken)
	if err != nil {
		if errors.Is(err, apperr.ErrNotFound) {
			writeUnauthorized(c, "invalid or expired refresh token")
			return
		}
		h.logger.Error("failed to refresh access token", "error", err)
		writeInternalError(c, "failed to refresh token")
		return
	}

	c.SetCookie(config.AccessCookieName, accessToken, int(config.AccessTokenTTL.Seconds()), "/", "", false, true)

	c.Status(204)
}

func (h *AuthHandler) Me(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		writeUnauthorized(c, "not authenticated")
		return
	}

	user, err := h.service.GetUserByID(c.Request.Context(), userID)
	if err != nil {
		h.logger.Error("failed to fetch user", "error", err, "user_id", userID)
		writeInternalError(c, "failed to fetch user")
		return
	}

	c.JSON(200, dto.UserToMeResponse(user))
}

func (h *AuthHandler) Logout(c *gin.Context) {
	c.SetCookie(config.AccessCookieName, "", -1, "/", "", false, true)
	c.SetCookie(config.RefreshCookieName, "", -1, "/", "", false, true)
	c.Status(204)
}

func (h *AuthHandler) YandexLogin(c *gin.Context) {
	url := h.yandexOAuth.GetAuthorizeURL()
	c.Redirect(302, url)
}

func (h *AuthHandler) YandexCallback(c *gin.Context) {
	code := c.Query("code")
	if code == "" {
		writeBadRequest(c, "missing code")
		return
	}

	yandexAccessToken, err := h.yandexOAuth.ExchangeCode(code)
	if err != nil {
		h.logger.Error("failed to exchange yandex code", "error", err)
		writeInternalError(c, "failed to authenticate with yandex")
		return
	}

	userInfo, err := h.yandexOAuth.GetUserInfo(yandexAccessToken)
	if err != nil {
		h.logger.Error("failed to fetch yandex user info", "error", err)
		writeInternalError(c, "failed to authenticate with yandex")
		return
	}

	sessionID := middleware.GetSessionID(c)

	tokens, err := h.service.LoginWithYandex(c.Request.Context(), userInfo.Email, sessionID)
	if err != nil {
		h.logger.Error("failed to login with yandex", "error", err, "email", userInfo.Email)
		writeInternalError(c, "failed to authenticate with yandex")
		return
	}

	c.SetCookie(config.AccessCookieName, tokens.AccessToken, int(config.AccessTokenTTL.Seconds()), "/", "", false, true)
	c.SetCookie(config.RefreshCookieName, tokens.RefreshToken, int(config.RefreshTokenTTL.Seconds()), "/", "", false, true)

	c.Redirect(302, "http://localhost:3000/")
}
