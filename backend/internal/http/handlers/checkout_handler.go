package handlers

import (
	"fmt"
	"log/slog"

	"github.com/gin-gonic/gin"
	"github.com/malyshenko-developer/fruit-store/internal/http/dto"
	"github.com/malyshenko-developer/fruit-store/internal/http/middleware"
	"github.com/malyshenko-developer/fruit-store/internal/service"
)

type CheckoutHandler struct {
	cartService    service.CartService
	paymentService service.PaymentService
	logger         *slog.Logger
}

func NewCheckoutHandler(cartService service.CartService, paymentService service.PaymentService, logger *slog.Logger) *CheckoutHandler {
	return &CheckoutHandler{cartService: cartService, paymentService: paymentService, logger: logger}
}

func (h *CheckoutHandler) CreatePaymentIntent(c *gin.Context) {
	var req dto.CreatePaymentIntentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		writeBadRequest(c, "invalid request body")
		return
	}

	sessionID := middleware.GetSessionID(c)
	var userIDStr string
	if id, ok := middleware.GetUserID(c); ok {
		userIDStr = fmt.Sprintf("%d", id)
	}

	cart, err := h.cartService.GetCart(c.Request.Context(), sessionID, getOptionalUserID(c))
	if err != nil {
		h.logger.Error("failed to fetch cart for checkout", "error", err)
		writeInternalError(c, "failed to prepare checkout")
		return
	}

	if len(cart.Items) == 0 {
		writeBadRequest(c, "cart is empty")
		return
	}

	amountCents := int64(cart.Total * 100)

	metadata := map[string]string{
		"session_id":       sessionID,
		"user_id":          userIDStr,
		"email":            req.Email,
		"full_name":        req.FullName,
		"shipping_address": req.ShippingAddress,
	}

	clientSecret, _, err := h.paymentService.CreatePaymentIntent(amountCents, metadata)
	if err != nil {
		h.logger.Error("failed to create payment intent", "error", err)
		writeInternalError(c, "failed to create payment intent")
		return
	}

	c.JSON(200, dto.CreatePaymentIntentResponse{ClientSecret: clientSecret})
}
