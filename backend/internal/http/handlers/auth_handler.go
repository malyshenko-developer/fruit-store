package handlers

import (
	"errors"
	"log/slog"

	"github.com/gin-gonic/gin"
	"github.com/malyshenko-developer/fruit-store/internal/config"
	"github.com/malyshenko-developer/fruit-store/internal/http/dto"
	"github.com/malyshenko-developer/fruit-store/internal/http/middleware"
	"github.com/malyshenko-developer/fruit-store/internal/service"
)

type AuthHandler struct {
	service service.AuthService
	logger  *slog.Logger
}

func NewAuthHandler(service service.AuthService, logger *slog.Logger) *AuthHandler {
	return &AuthHandler{service: service, logger: logger}
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

	token, err := h.service.VerifyCode(c.Request.Context(), req.Email, req.Code, sessionID)
	if err != nil {
		if errors.Is(err, service.ErrInvalidCode) {
			writeBadRequest(c, "invalid or expired code")
			return
		}
		h.logger.Error("failed to verify otp code", "error", err, "email", req.Email)
		writeInternalError(c, "failed to verify code")
		return
	}

	c.SetCookie(config.AuthCookieName, token, int(config.AuthTokenTTL.Seconds()), "/", "", false, true)

	c.JSON(200, dto.TokenToResponse(token))
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
	c.SetCookie(config.AuthCookieName, "", -1, "/", "", false, true)
	c.Status(204)
}
