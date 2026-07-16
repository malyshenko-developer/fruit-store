package service

import (
	"context"

	"github.com/malyshenko-developer/fruit-store/internal/model"
)

type ProductRepository interface {
	GetAll(ctx context.Context, categoryID *int64) ([]*model.Product, error)
	GetByID(ctx context.Context, id int64) (*model.Product, error)
}

type ProductService interface {
	GetAll(ctx context.Context, categoryID *int64) ([]*model.Product, error)
	GetByID(ctx context.Context, id int64) (*model.Product, error)
}

type productService struct {
	repo ProductRepository
}

func NewProductService(repo ProductRepository) ProductService {
	return &productService{repo: repo}
}

func (s *productService) GetAll(ctx context.Context, categoryID *int64) ([]*model.Product, error) {
	return s.repo.GetAll(ctx, categoryID)
}

func (s *productService) GetByID(ctx context.Context, id int64) (*model.Product, error) {
	return s.repo.GetByID(ctx, id)
}
