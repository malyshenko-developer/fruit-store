package repository

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/malyshenko-developer/fruit-store/internal/apperr"
	"github.com/malyshenko-developer/fruit-store/internal/model"
)

type CategoryRepository struct {
	pool *pgxpool.Pool
}

func NewCategoryRepository(pool *pgxpool.Pool) *CategoryRepository {
	return &CategoryRepository{pool: pool}
}

func (r *CategoryRepository) GetAll(ctx context.Context) ([]*model.Category, error) {
	const q = `SELECT id, name, slug FROM categories ORDER BY id`
	rows, err := r.pool.Query(ctx, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var categories []*model.Category
	for rows.Next() {
		var c model.Category
		if err := rows.Scan(&c.ID, &c.Name, &c.Slug); err != nil {
			return nil, err
		}
		categories = append(categories, &c)
	}

	return categories, rows.Err()
}

func (r *CategoryRepository) GetBySlug(ctx context.Context, slug string) (*model.Category, error) {
	const q = `SELECT id, name, slug FROM categories WHERE slug = $1`

	var c model.Category
	err := r.pool.QueryRow(ctx, q, slug).Scan(&c.ID, &c.Name, &c.Slug)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, apperr.ErrNotFound
		}
		return nil, err
	}

	return &c, nil
}
