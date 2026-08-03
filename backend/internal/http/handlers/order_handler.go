package handlers

import (
	"errors"
	"log/slog"

	"github.com/gin-gonic/gin"
	"github.com/malyshenko-developer/fruit-store/internal/apperr"
	"github.com/malyshenko-developer/fruit-store/internal/http/dto"
	"github.com/malyshenko-developer/fruit-store/internal/http/middleware"
	"github.com/malyshenko-developer/fruit-store/internal/model"
	"github.com/malyshenko-developer/fruit-store/internal/service"
)

type OrderHandler struct {
	service service.OrderService
	logger  *slog.Logger
}

func NewOrderHandler(service service.OrderService, logger *slog.Logger) *OrderHandler {
	return &OrderHandler{service: service, logger: logger}
}

func (h *OrderHandler) Create(c *gin.Context) {
	var req dto.CreateOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		writeBadRequest(c, "invalid request body")
		return
	}

	sessionID := middleware.GetSessionID(c)
	var userID *int64
	if id, ok := middleware.GetUserID(c); ok {
		userID = &id
	}

	input := model.CreateOrderInput{
		SessionID:       sessionID,
		UserID:          userID,
		Email:           req.Email,
		FullName:        req.FullName,
		ShippingAddress: req.ShippingAddress,
	}

	order, err := h.service.CreateFromCart(c.Request.Context(), input)
	if err != nil {
		if errors.Is(err, apperr.ErrNotFound) {
			writeBadRequest(c, "cart is empty or not found")
			return
		}
		if errors.Is(err, model.ErrInsufficientStock) {
			writeBadRequest(c, "one or more items are out of stock")
			return
		}
		h.logger.Error("failed to create order", "error", err)
		writeInternalError(c, "failed to create order")
		return
	}

	c.JSON(201, dto.OrderToResponse(order))
}
