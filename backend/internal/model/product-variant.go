package model

type ProductVariant struct {
	ID         int64
	ProductID  int64
	SKU        string
	Price      float64
	Stock      int
	Attributes map[string]interface{}
}
