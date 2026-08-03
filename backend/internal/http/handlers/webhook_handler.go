package handlers

import (
	"encoding/json"
	"io"
	"log/slog"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/malyshenko-developer/fruit-store/internal/model"
	"github.com/malyshenko-developer/fruit-store/internal/service"
	"github.com/stripe/stripe-go/v82"
	"github.com/stripe/stripe-go/v82/webhook"
)

type WebhookHandler struct {
	orderService  service.OrderService
	webhookSecret string
	logger        *slog.Logger
}

func NewWebhookHandler(orderService service.OrderService, webhookSecret string, logger *slog.Logger) *WebhookHandler {
	return &WebhookHandler{orderService: orderService, webhookSecret: webhookSecret, logger: logger}
}

func (h *WebhookHandler) HandleStripeWebhook(c *gin.Context) {
	payload, err := io.ReadAll(c.Request.Body)
	if err != nil {
		writeBadRequest(c, "failed to read request body")
		return
	}

	signature := c.GetHeader("Stripe-Signature")

	event, err := webhook.ConstructEventWithOptions(payload, signature, h.webhookSecret, webhook.ConstructEventOptions{
		IgnoreAPIVersionMismatch: true,
	})
	if err != nil {
		h.logger.Error("invalid stripe webhook signature", "error", err)
		writeBadRequest(c, "invalid signature")
		return
	}

	if event.Type != "payment_intent.succeeded" {
		c.Status(200)
		return
	}

	var paymentIntent stripe.PaymentIntent
	if err := json.Unmarshal(event.Data.Raw, &paymentIntent); err != nil {
		h.logger.Error("failed to parse payment intent", "error", err)
		writeInternalError(c, "failed to process webhook")
		return
	}

	metadata := paymentIntent.Metadata

	var userID *int64
	if userIDStr := metadata["user_id"]; userIDStr != "" {
		id, err := strconv.ParseInt(userIDStr, 10, 64)
		if err == nil {
			userID = &id
		}
	}

	input := model.CreateOrderInput{
		SessionID:             metadata["session_id"],
		UserID:                userID,
		Email:                 metadata["email"],
		FullName:              metadata["full_name"],
		ShippingAddress:       metadata["shipping_address"],
		Status:                model.OrderStatusPaid,
		StripePaymentIntentID: paymentIntent.ID,
	}

	_, err = h.orderService.CreateFromCart(c.Request.Context(), input)
	if err != nil {
		h.logger.Error("failed to create order from webhook", "error", err, "payment_intent_id", paymentIntent.ID)
		writeInternalError(c, "failed to create order")
		return
	}

	c.Status(200)
}
