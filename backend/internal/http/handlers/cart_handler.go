package handlers

import (
	"errors"
	"log/slog"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/malyshenko-developer/fruit-store/internal/apperr"
	"github.com/malyshenko-developer/fruit-store/internal/http/dto"
	"github.com/malyshenko-developer/fruit-store/internal/http/middleware"
	"github.com/malyshenko-developer/fruit-store/internal/service"
)

type CartHandler struct {
	service service.CartService
	logger  *slog.Logger
}

func NewCartHandler(service service.CartService, logger *slog.Logger) *CartHandler {
	return &CartHandler{service: service, logger: logger}
}

func (h *CartHandler) GetCart(c *gin.Context) {
	sessionID := middleware.GetSessionID(c)
	userID := getOptionalUserID(c)

	cart, err := h.service.GetCart(c.Request.Context(), sessionID, userID)
	if err != nil {
		h.logger.Error("failed to fetch cart", "error", err)
		writeInternalError(c, "failed to fetch cart")
		return
	}

	writeOK(c, dto.CartSummaryToResponse(cart))
}

func (h *CartHandler) AddItem(c *gin.Context) {
	sessionID := middleware.GetSessionID(c)
	userID := getOptionalUserID(c)

	var req dto.AddItemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		writeBadRequest(c, "invalid request body")
		return
	}

	err := h.service.AddItem(c.Request.Context(), sessionID, userID, req.VariantID, req.Quantity)
	if err != nil {
		if errors.Is(err, service.ErrInsufficientStock) {
			writeBadRequest(c, "insufficient stock")
			return
		}
		if errors.Is(err, apperr.ErrNotFound) {
			writeNotFound(c, "product variant not found")
			return
		}
		h.logger.Error("failed to add item to cart", "error", err, "variant_id", req.VariantID)
		writeInternalError(c, "failed to add item to cart")
		return
	}

	c.Status(204)
}

func (h *CartHandler) UpdateQuantity(c *gin.Context) {
	sessionID := middleware.GetSessionID(c)
	userID := getOptionalUserID(c)

	variantID, err := strconv.ParseInt(c.Param("variantId"), 10, 64)
	if err != nil {
		writeBadRequest(c, "variantId must be a number")
		return
	}

	var req dto.UpdateQuantityRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		writeBadRequest(c, "invalid request body")
		return
	}

	err = h.service.UpdateQuantity(c.Request.Context(), sessionID, userID, variantID, req.Quantity)
	if err != nil {
		if errors.Is(err, service.ErrInsufficientStock) {
			writeBadRequest(c, "insufficient stock")
			return
		}
		h.logger.Error("failed to update cart item quantity", "error", err, "variant_id", variantID)
		writeInternalError(c, "failed to update quantity")
		return
	}

	c.Status(204)
}

func (h *CartHandler) RemoveItem(c *gin.Context) {
	sessionID := middleware.GetSessionID(c)
	userID := getOptionalUserID(c)

	variantID, err := strconv.ParseInt(c.Param("variantId"), 10, 64)
	if err != nil {
		writeBadRequest(c, "variantId must be a number")
		return
	}

	if err := h.service.RemoveItem(c.Request.Context(), sessionID, userID, variantID); err != nil {
		h.logger.Error("failed to remove cart item", "error", err, "variant_id", variantID)
		writeInternalError(c, "failed to remove item")
		return
	}

	c.Status(204)
}

func getOptionalUserID(c *gin.Context) *int64 {
	userID, ok := middleware.GetUserID(c)
	if !ok {
		return nil
	}
	return &userID
}
