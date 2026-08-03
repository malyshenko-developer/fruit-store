package model

import "time"

const (
	OrderStatusPending   = "pending"
	OrderStatusPaid      = "paid"
	OrderStatusShipped   = "shipped"
	OrderStatusDelivered = "delivered"
	OrderStatusCancelled = "cancelled"
	OrderStatusRefunded  = "refunded"
)

var AllowedOrderStatuses = map[string]bool{
	OrderStatusPending:   true,
	OrderStatusPaid:      true,
	OrderStatusShipped:   true,
	OrderStatusDelivered: true,
	OrderStatusCancelled: true,
	OrderStatusRefunded:  true,
}

type Order struct {
	ID              int64
	OrderNumber     string
	UserID          *int64
	Email           string
	FullName        string
	ShippingAddress string
	Status          string
	Total           float64
	CreatedAt       time.Time
}

type OrderItem struct {
	ID                int64
	OrderID           int64
	VariantID         int64
	ProductName       string
	VariantAttributes map[string]interface{}
	Price             float64
	Quantity          int
}

type CreateOrderInput struct {
	SessionID       string
	UserID          *int64
	Email           string
	FullName        string
	ShippingAddress string
	Status          string
}
