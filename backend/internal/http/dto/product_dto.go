package dto

import (
	"github.com/malyshenko-developer/fruit-store/internal/model"
	"github.com/malyshenko-developer/fruit-store/internal/service"
)

type ProductListItemResponse struct {
	ID          int64   `json:"id"`
	CategoryID  int64   `json:"category_id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	ImageURL    string  `json:"image_url"`
	MinPrice    float64 `json:"min_price"`
}

func ProductListItemToResponse(p *model.ProductListItem) *ProductListItemResponse {
	return &ProductListItemResponse{
		ID:          p.ID,
		CategoryID:  p.CategoryID,
		Name:        p.Name,
		Description: p.Description,
		ImageURL:    p.ImageURL,
		MinPrice:    p.MinPrice,
	}
}

type VariantResponse struct {
	ID         int64                  `json:"id"`
	SKU        string                 `json:"sku"`
	Price      float64                `json:"price"`
	Stock      int                    `json:"stock"`
	Attributes map[string]interface{} `json:"attributes"`
	ImageURL   *string                `json:"image_url"`
}

type ProductDetailResponse struct {
	ID          int64              `json:"id"`
	CategoryID  int64              `json:"category_id"`
	Name        string             `json:"name"`
	Description string             `json:"description"`
	ImageURL    string             `json:"image_url"`
	Variants    []*VariantResponse `json:"variants"`
}

func ProductDetailToResponse(p *service.ProductWithVariants) *ProductDetailResponse {
	variants := make([]*VariantResponse, 0, len(p.Variants))
	for _, v := range p.Variants {
		variants = append(variants, &VariantResponse{
			ID:         v.ID,
			SKU:        v.SKU,
			Price:      v.Price,
			Stock:      v.Stock,
			Attributes: v.Attributes,
			ImageURL:   v.ImageURL,
		})
	}

	return &ProductDetailResponse{
		ID:          p.Product.ID,
		CategoryID:  p.Product.CategoryID,
		Name:        p.Product.Name,
		Description: p.Product.Description,
		ImageURL:    p.Product.ImageURL,
		Variants:    variants,
	}
}
