package dto

import "github.com/malyshenko-developer/fruit-store/internal/model"

type CartItemResponse struct {
	VariantID  int64                  `json:"variant_id"`
	ProductID  int64                  `json:"product_id"`
	Name       string                 `json:"name"`
	ImageURL   string                 `json:"image_url"`
	Price      float64                `json:"price"`
	Quantity   int                    `json:"quantity"`
	Stock      int                    `json:"stock"`
	Attributes map[string]interface{} `json:"attributes"`
	Subtotal   float64                `json:"subtotal"`
}

type CartSummaryResponse struct {
	Items []*CartItemResponse `json:"items"`
	Total float64             `json:"total"`
}

func CartSummaryToResponse(c *model.CartSummary) *CartSummaryResponse {
	items := make([]*CartItemResponse, 0, len(c.Items))
	for _, item := range c.Items {
		var imageURL string
		if len(item.Images) > 0 {
			imageURL = item.Images[0].URL
		}

		items = append(items, &CartItemResponse{
			VariantID:  item.Variant.ID,
			ProductID:  item.Product.ID,
			Name:       item.Product.Name,
			ImageURL:   imageURL,
			Price:      item.Variant.Price,
			Quantity:   item.CartItem.Quantity,
			Stock:      item.Variant.Stock,
			Attributes: item.Variant.Attributes,
			Subtotal:   item.Variant.Price * float64(item.CartItem.Quantity),
		})
	}

	return &CartSummaryResponse{
		Items: items,
		Total: c.Total,
	}
}

type AddItemRequest struct {
	VariantID int64 `json:"variant_id" binding:"required"`
	Quantity  int   `json:"quantity" binding:"required,min=1"`
}

type UpdateQuantityRequest struct {
	Quantity int `json:"quantity" binding:"required,min=1"`
}
