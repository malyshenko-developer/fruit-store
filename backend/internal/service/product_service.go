package service

import (
	"context"

	"github.com/malyshenko-developer/fruit-store/internal/model"
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
	"storage":      true,
	"chip":         true,
	"connectivity": true,
}

type ProductWithVariants struct {
	Product  *model.Product
	Variants []*model.ProductVariant
}

type ProductRepository interface {
	GetAll(ctx context.Context, params model.ListProductsParams) ([]*model.ProductListItem, error)
	GetByID(ctx context.Context, id int64) (*model.Product, error)
	GetVariantsByProductID(ctx context.Context, productID int64) ([]*model.ProductVariant, error)
	GetAvailableFilters(ctx context.Context, categoryID *int64) (*model.ProductFilters, error)
}

type ProductService interface {
	GetAll(ctx context.Context, params model.ListProductsParams) ([]*model.ProductListItem, error)
	GetByID(ctx context.Context, id int64) (*ProductWithVariants, error)
	GetAvailableFilters(ctx context.Context, categoryID *int64) (*model.ProductFilters, error)
}

type productService struct {
	repo ProductRepository
}

func NewProductService(repo ProductRepository) ProductService {
	return &productService{repo: repo}
}

func (s *productService) GetAll(ctx context.Context, params model.ListProductsParams) ([]*model.ProductListItem, error) {
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

func normalizeListParams(p *model.ListProductsParams) {
	if !allowedSortFields[p.SortBy] {
		p.SortBy = "created_at"
	}
	if !allowedOrders[p.Order] {
		p.Order = "desc"
	}
}
