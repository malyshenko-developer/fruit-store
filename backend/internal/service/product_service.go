package service

import (
	"context"

	"github.com/malyshenko-developer/fruit-store/internal/model"
)

type ProductWithVariants struct {
	Product  *model.Product
	Variants []*model.ProductVariant
}

type ProductRepository interface {
	GetAll(ctx context.Context, categoryID *int64) ([]*model.ProductListItem, error)
	GetByID(ctx context.Context, id int64) (*model.Product, error)
	GetVariantsByProductID(ctx context.Context, productID int64) ([]*model.ProductVariant, error)
}

type ProductService interface {
	GetAll(ctx context.Context, categoryID *int64) ([]*model.ProductListItem, error)
	GetByID(ctx context.Context, id int64) (*ProductWithVariants, error)
}

type productService struct {
	repo ProductRepository
}

func NewProductService(repo ProductRepository) ProductService {
	return &productService{repo: repo}
}

func (s *productService) GetAll(ctx context.Context, categoryID *int64) ([]*model.ProductListItem, error) {
	return s.repo.GetAll(ctx, categoryID)
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
