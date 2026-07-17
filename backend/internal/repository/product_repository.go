package repository

import (
	"context"
	"encoding/json"
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

func (r *ProductRepository) GetAll(ctx context.Context, categoryID *int64) ([]*model.ProductListItem, error) {
	const q = `
		SELECT
			p.id,
			p.category_id,
			p.name,
			p.description,
			p.image_url,
			MIN(pv.price) AS min_price
		FROM products p
		JOIN product_variants pv ON pv.product_id = p.id
		WHERE ($1::bigint IS NULL OR category_id = $1)
		GROUP BY p.id
		ORDER BY p.id`

	rows, err := r.pool.Query(ctx, q, categoryID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var products []*model.ProductListItem
	for rows.Next() {
		var p model.ProductListItem
		if err := rows.Scan(&p.ID, &p.CategoryID, &p.Name, &p.Description, &p.ImageURL, &p.MinPrice); err != nil {
			return nil, err
		}

		products = append(products, &p)
	}

	return products, rows.Err()
}

func (r *ProductRepository) GetByID(ctx context.Context, id int64) (*model.Product, error) {
	const q = `
		SELECT id, category_id, name, description, image_url
		FROM products
		WHERE id = $1`

	var p model.Product
	err := r.pool.QueryRow(ctx, q, id).Scan(&p.ID, &p.CategoryID, &p.Name, &p.Description, &p.ImageURL)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, apperr.ErrNotFound
		}
		return nil, err
	}

	return &p, nil
}

func (r *ProductRepository) GetVariantsByProductID(ctx context.Context, productID int64) ([]*model.ProductVariant, error) {
	const q = `
		SELECT id, product_id, sku, price, stock, attributes, image_url
		FROM product_variants
		WHERE product_id = $1
		ORDER BY id`

	rows, err := r.pool.Query(ctx, q, productID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var variants []*model.ProductVariant
	for rows.Next() {
		var v model.ProductVariant
		var rawAttributes []byte

		if err := rows.Scan(&v.ID, &v.ProductID, &v.SKU, &v.Price, &v.Stock, &rawAttributes, &v.ImageURL); err != nil {
			return nil, err
		}

		if err := json.Unmarshal(rawAttributes, &v.Attributes); err != nil {
			return nil, err
		}

		variants = append(variants, &v)
	}

	return variants, rows.Err()
}
