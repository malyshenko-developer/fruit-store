package model

type Cart struct {
	ID        int64
	UserID    *int64
	SessionID *string
}

type CartItem struct {
	ID        int64
	CartID    int64
	VariantID int64
	Quantity  int
}

type CartItemWithVariant struct {
	CartItem *CartItem
	Variant  *ProductVariant
	Product  *Product
}

type CartSummary struct {
	Items []*CartItemWithVariant
	Total float64
}
