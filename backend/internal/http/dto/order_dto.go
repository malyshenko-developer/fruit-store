package dto

import "github.com/malyshenko-developer/fruit-store/internal/model"

type CreateOrderRequest struct {
	Email           string `json:"email" binding:"required,email"`
	FullName        string `json:"full_name" binding:"required"`
	ShippingAddress string `json:"shipping_address" binding:"required"`
}

type OrderResponse struct {
	OrderNumber string  `json:"order_number"`
	Status      string  `json:"status"`
	Total       float64 `json:"total"`
}

func OrderToResponse(o *model.Order) *OrderResponse {
	return &OrderResponse{
		OrderNumber: o.OrderNumber,
		Status:      o.Status,
		Total:       o.Total,
	}
}
