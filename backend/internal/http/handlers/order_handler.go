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

func (h *OrderHandler) GetMyOrders(c *gin.Context) {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		writeUnauthorized(c, "not authenticated")
		return
	}

	orders, err := h.service.GetOrdersByUserID(c.Request.Context(), userID)
	if err != nil {
		h.logger.Error("failed to fetch orders", "error", err, "user_id", userID)
		writeInternalError(c, "failed to fetch orders")
		return
	}

	responses := make([]*dto.OrderWithItemsResponse, 0, len(orders))
	for _, order := range orders {
		responses = append(responses, dto.OrderWithItemsToResponse(order))
	}

	c.JSON(200, responses)
}

func (h *OrderHandler) Track(c *gin.Context) {
	var req dto.TrackOrderRequest
	if err := c.ShouldBindQuery(&req); err != nil {
		writeBadRequest(c, "order_number and email are required")
		return
	}

	order, err := h.service.TrackOrder(c.Request.Context(), req.OrderNumber, req.Email)
	if err != nil {
		if errors.Is(err, apperr.ErrNotFound) {
			writeNotFound(c, "order not found")
			return
		}
		h.logger.Error("failed to track order", "error", err)
		writeInternalError(c, "failed to track order")
		return
	}

	c.JSON(200, dto.OrderWithItemsToResponse(order))
}
