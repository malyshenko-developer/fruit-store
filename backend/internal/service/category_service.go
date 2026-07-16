package service

import (
	"context"

	"github.com/malyshenko-developer/fruit-store/internal/model"
)

type CategoryRepository interface {
	GetAll(ctx context.Context) ([]*model.Category, error)
}

type CategoryService interface {
	GetAll(ctx context.Context) ([]*model.Category, error)
}

type categoryService struct {
	repo CategoryRepository
}

func NewCategoryService(repo CategoryRepository) CategoryService {
	return &categoryService{repo: repo}
}

func (s *categoryService) GetAll(ctx context.Context) ([]*model.Category, error) {
	return s.repo.GetAll(ctx)
}
