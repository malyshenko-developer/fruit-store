package dto

import "github.com/malyshenko-developer/fruit-store/internal/model"

type ProductResponse struct {
	ID          int64   `json:"id"`
	CategoryID  int64   `json:"category_id"`
	Name        string  `json:"name"`
	Price       float64 `json:"price"`
	Description string  `json:"description"`
	ImageURL    string  `json:"image_url"`
	Stock       int     `json:"stock"`
}

func ProductToResponse(p *model.Product) *ProductResponse {
	return &ProductResponse{
		ID:          p.ID,
		CategoryID:  p.CategoryID,
		Name:        p.Name,
		Price:       p.Price,
		Description: p.Description,
		ImageURL:    p.ImageURL,
		Stock:       p.Stock,
	}
}
