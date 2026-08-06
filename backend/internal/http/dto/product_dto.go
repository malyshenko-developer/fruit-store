package dto

import (
	"github.com/malyshenko-developer/fruit-store/internal/model"
	"github.com/malyshenko-developer/fruit-store/internal/service"
)

type ImageResponse struct {
	URL       string `json:"url"`
	SortOrder int    `json:"sort_order"`
}

func imagesToResponse(images []*model.VariantImage) []*ImageResponse {
	result := make([]*ImageResponse, 0, len(images))
	for _, img := range images {
		result = append(result, &ImageResponse{URL: img.URL, SortOrder: img.SortOrder})
	}
	return result
}

type ProductListItemResponse struct {
	VariantID   int64                  `json:"variant_id"`
	ProductID   int64                  `json:"product_id"`
	CategoryID  int64                  `json:"category_id"`
	Name        string                 `json:"name"`
	Description string                 `json:"description"`
	Price       float64                `json:"price"`
	Attributes  map[string]interface{} `json:"attributes"`
	Images      []*ImageResponse       `json:"images"`
}

func ProductListItemWithImagesToResponse(item *model.ProductListItemWithImages) *ProductListItemResponse {
	return &ProductListItemResponse{
		VariantID:   item.Item.VariantID,
		ProductID:   item.Item.ProductID,
		CategoryID:  item.Item.CategoryID,
		Name:        item.Item.Name,
		Description: item.Item.Description,
		Price:       item.Item.Price,
		Attributes:  item.Item.Attributes,
		Images:      imagesToResponse(item.Images),
	}
}

type VariantResponse struct {
	ID         int64                  `json:"id"`
	SKU        string                 `json:"sku"`
	Price      float64                `json:"price"`
	Stock      int                    `json:"stock"`
	Attributes map[string]interface{} `json:"attributes"`
	Images     []*ImageResponse       `json:"images"`
}

type ProductDetailResponse struct {
	ID          int64              `json:"id"`
	CategoryID  int64              `json:"category_id"`
	Name        string             `json:"name"`
	Description string             `json:"description"`
	Variants    []*VariantResponse `json:"variants"`
}

func ProductDetailToResponse(p *service.ProductWithVariants) *ProductDetailResponse {
	variants := make([]*VariantResponse, 0, len(p.Variants))
	for _, v := range p.Variants {
		variants = append(variants, &VariantResponse{
			ID:         v.Variant.ID,
			SKU:        v.Variant.SKU,
			Price:      v.Variant.Price,
			Stock:      v.Variant.Stock,
			Attributes: v.Variant.Attributes,
			Images:     imagesToResponse(v.Images),
		})
	}

	return &ProductDetailResponse{
		ID:          p.Product.ID,
		CategoryID:  p.Product.CategoryID,
		Name:        p.Product.Name,
		Description: p.Product.Description,
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

func PaginatedProductsToResponse(p *model.PaginatedProductsWithImages) *PaginatedProductsResponse {
	items := make([]*ProductListItemResponse, 0, len(p.Items))
	for _, item := range p.Items {
		items = append(items, ProductListItemWithImagesToResponse(item))
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
