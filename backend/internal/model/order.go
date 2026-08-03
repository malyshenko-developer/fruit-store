package model

import "time"

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
}
