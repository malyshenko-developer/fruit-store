package repository

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/malyshenko-developer/fruit-store/internal/apperr"
	"github.com/malyshenko-developer/fruit-store/internal/model"
)

type ProductRepository struct {
	pool *pgxpool.Pool
}

func NewProductRepository(pool *pgxpool.Pool) *ProductRepository {
	return &ProductRepository{pool: pool}
}

func (r *ProductRepository) GetAll(ctx context.Context, categoryID *int64) ([]*model.Product, error) {
	const q = `
		SELECT id, category_id, name, price, description, image_url, stock
		FROM products
		WHERE ($1::bigint IS NULL OR category_id = $1)
		ORDER BY id`

	rows, err := r.pool.Query(ctx, q, categoryID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var products []*model.Product
	for rows.Next() {
		var p model.Product
		if err := rows.Scan(&p.ID, &p.CategoryID, &p.Name, &p.Price, &p.Description, &p.ImageURL, &p.Stock); err != nil {
			return nil, err
		}
		products = append(products, &p)
	}

	return products, rows.Err()
}

func (r *ProductRepository) GetByID(ctx context.Context, id int64) (*model.Product, error) {
	const q = `
		SELECT id, category_id, name, price, description, image_url, stock
		FROM products
		WHERE id = $1`

	var p model.Product
	err := r.pool.QueryRow(ctx, q, id).Scan(&p.ID, &p.CategoryID, &p.Name, &p.Price, &p.Description, &p.ImageURL, &p.Stock)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, apperr.ErrNotFound
		}
		return nil, err
	}

	return &p, nil
}
