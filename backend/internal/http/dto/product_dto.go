package dto

import (
	"github.com/malyshenko-developer/fruit-store/internal/model"
	"github.com/malyshenko-developer/fruit-store/internal/service"
)

type ProductListItemResponse struct {
	VariantID   int64                  `json:"variant_id"`
	ProductID   int64                  `json:"product_id"`
	CategoryID  int64                  `json:"category_id"`
	Name        string                 `json:"name"`
	Description string                 `json:"description"`
	ImageURL    string                 `json:"image_url"`
	Price       float64                `json:"price"`
	Attributes  map[string]interface{} `json:"attributes"`
}

func ProductListItemToResponse(p *model.ProductListItem) *ProductListItemResponse {
	return &ProductListItemResponse{
		VariantID:   p.VariantID,
		ProductID:   p.ProductID,
		CategoryID:  p.CategoryID,
		Name:        p.Name,
		Description: p.Description,
		ImageURL:    p.ImageURL,
		Price:       p.Price,
		Attributes:  p.Attributes,
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

type PriceRangeResponse struct {
	Min float64 `json:"min"`
	Max float64 `json:"max"`
}

type ProductFiltersResponse struct {
	Attributes map[string][]string `json:"attributes"`
	PriceRange PriceRangeResponse  `json:"price_range"`
}

func ProductFiltersToResponse(f *model.ProductFilters) *ProductFiltersResponse {
	return &ProductFiltersResponse{
		Attributes: f.Attributes,
		PriceRange: PriceRangeResponse{
			Min: f.MinPrice,
			Max: f.MaxPrice,
		},
	}
}

type PaginatedProductsResponse struct {
	Items      []*ProductListItemResponse `json:"items"`
	Total      int                        `json:"total"`
	Page       int                        `json:"page"`
	Limit      int                        `json:"limit"`
	TotalPages int                        `json:"total_pages"`
}

func PaginatedProductsToResponse(p *model.PaginatedProducts) *PaginatedProductsResponse {
	items := make([]*ProductListItemResponse, 0, len(p.Items))
	for _, item := range p.Items {
		items = append(items, ProductListItemToResponse(item))
	}

	totalPages := 0
	if p.Limit > 0 {
		totalPages = (p.Total + p.Limit - 1) / p.Limit
	}

	return &PaginatedProductsResponse{
		Items:      items,
		Total:      p.Total,
		Page:       p.Page,
		Limit:      p.Limit,
		TotalPages: totalPages,
	}
}
