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
	const q = `
		SELECT c.id, c.name, c.slug, c.image_url, COALESCE(MIN(pv.price), 0)
		FROM categories c
		LEFT JOIN products p ON p.category_id = c.id
		LEFT JOIN product_variants pv ON pv.product_id = p.id
		GROUP BY c.id, c.name, c.slug, c.image_url
		ORDER BY c.id`

	rows, err := r.pool.Query(ctx, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var categories []*model.Category
	for rows.Next() {
		var c model.Category
		if err := rows.Scan(&c.ID, &c.Name, &c.Slug, &c.ImageURL, &c.MinPrice); err != nil {
			return nil, err
		}
		categories = append(categories, &c)
	}

	return categories, rows.Err()
}

func (r *CategoryRepository) GetBySlug(ctx context.Context, slug string) (*model.Category, error) {
	const q = `SELECT id, name, slug, image_url FROM categories WHERE slug = $1`

	var c model.Category
	err := r.pool.QueryRow(ctx, q, slug).Scan(&c.ID, &c.Name, &c.Slug, &c.ImageURL)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, apperr.ErrNotFound
		}
		return nil, err
	}

	return &c, nil
}
