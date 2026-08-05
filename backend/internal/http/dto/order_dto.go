package dto

import (
	"time"

	"github.com/malyshenko-developer/fruit-store/internal/model"
)

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

type OrderItemResponse struct {
	ProductName string                 `json:"product_name"`
	Attributes  map[string]interface{} `json:"attributes"`
	Price       float64                `json:"price"`
	Quantity    int                    `json:"quantity"`
}

type OrderWithItemsResponse struct {
	OrderNumber string               `json:"order_number"`
	Status      string               `json:"status"`
	Total       float64              `json:"total"`
	CreatedAt   time.Time            `json:"created_at"`
	Items       []*OrderItemResponse `json:"items"`
}

func OrderWithItemsToResponse(o *model.OrderWithItems) *OrderWithItemsResponse {
	items := make([]*OrderItemResponse, 0, len(o.Items))
	for _, item := range o.Items {
		items = append(items, &OrderItemResponse{
			ProductName: item.ProductName,
			Attributes:  item.VariantAttributes,
			Price:       item.Price,
			Quantity:    item.Quantity,
		})
	}

	return &OrderWithItemsResponse{
		OrderNumber: o.Order.OrderNumber,
		Status:      o.Order.Status,
		Total:       o.Order.Total,
		CreatedAt:   o.Order.CreatedAt,
		Items:       items,
	}
}
