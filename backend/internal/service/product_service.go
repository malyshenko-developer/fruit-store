package service

import (
	"context"

	"github.com/malyshenko-developer/fruit-store/internal/model"
)

const (
	defaultLimit      = 12
	maxLimit          = 100
	searchResultLimit = 8
)

var allowedSortFields = map[string]bool{
	"price":      true,
	"created_at": true,
}

var allowedOrders = map[string]bool{
	"asc":  true,
	"desc": true,
}

var AllowedAttributeFilters = map[string]bool{
	"color":        true,
	"case_color":   true,
	"band_color":   true,
	"storage":      true,
	"connectivity": true,
	"series":       true,
	"chip":         true,
	"ram":          true,
	"display_type": true,
}

type ProductWithVariants struct {
	Product  *model.Product
	Variants []*model.ProductVariant
}

type ProductRepository interface {
	GetAll(ctx context.Context, params model.ListProductsParams) (*model.PaginatedProducts, error)
	GetByID(ctx context.Context, id int64) (*model.Product, error)
	GetVariantsByProductID(ctx context.Context, productID int64) ([]*model.ProductVariant, error)
	GetVariantByID(ctx context.Context, id int64) (*model.ProductVariant, error)
	GetAvailableFilters(ctx context.Context, categoryID *int64) (*model.ProductFilters, error)
	Search(ctx context.Context, query string, limit int) ([]*model.ProductListItem, int, error)
}

type ProductService interface {
	GetAll(ctx context.Context, params model.ListProductsParams) (*model.PaginatedProducts, error)
	GetByID(ctx context.Context, id int64) (*ProductWithVariants, error)
	GetAvailableFilters(ctx context.Context, categoryID *int64) (*model.ProductFilters, error)
	Search(ctx context.Context, query string) (*model.PaginatedProducts, error)
}

type productService struct {
	repo ProductRepository
}

func NewProductService(repo ProductRepository) ProductService {
	return &productService{repo: repo}
}

func (s *productService) GetAll(ctx context.Context, params model.ListProductsParams) (*model.PaginatedProducts, error) {
	normalizeListParams(&params)
	return s.repo.GetAll(ctx, params)
}

func (s *productService) GetByID(ctx context.Context, id int64) (*ProductWithVariants, error) {
	product, err := s.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	variants, err := s.repo.GetVariantsByProductID(ctx, id)
	if err != nil {
		return nil, err
	}

	return &ProductWithVariants{Product: product, Variants: variants}, nil
}

func (s *productService) GetAvailableFilters(ctx context.Context, categoryID *int64) (*model.ProductFilters, error) {
	return s.repo.GetAvailableFilters(ctx, categoryID)
}

func (s *productService) Search(ctx context.Context, query string) (*model.PaginatedProducts, error) {
	items, total, err := s.repo.Search(ctx, query, searchResultLimit)
	if err != nil {
		return nil, err
	}

	return &model.PaginatedProducts{
		Items: items,
		Total: total,
		Page:  1,
		Limit: searchResultLimit,
	}, nil
}

func normalizeListParams(p *model.ListProductsParams) {
	if !allowedSortFields[p.SortBy] {
		p.SortBy = "created_at"
	}
	if !allowedOrders[p.Order] {
		p.Order = "desc"
	}
	if p.Page < 1 {
		p.Page = 1
	}
	if p.Limit < 1 {
		p.Limit = defaultLimit
	}
	if p.Limit > maxLimit {
		p.Limit = maxLimit
	}
}
