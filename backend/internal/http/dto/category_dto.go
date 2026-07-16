package dto

import "github.com/malyshenko-developer/fruit-store/internal/model"

type CategoryResponse struct {
	ID   int64  `json:"id"`
	Name string `json:"name"`
	Slug string `json:"slug"`
}

func CategoryToResponse(c *model.Category) CategoryResponse {
	return CategoryResponse{
		ID:   c.ID,
		Name: c.Name,
		Slug: c.Slug,
	}
}
