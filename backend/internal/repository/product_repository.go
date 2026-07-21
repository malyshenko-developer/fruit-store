package repository

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"regexp"
	"strings"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/malyshenko-developer/fruit-store/internal/apperr"
	"github.com/malyshenko-developer/fruit-store/internal/model"
)

var safeAttributeKeyPattern = regexp.MustCompile(`^[a-z_]+$`)

type ProductRepository struct {
	pool *pgxpool.Pool
}

func NewProductRepository(pool *pgxpool.Pool) *ProductRepository {
	return &ProductRepository{pool: pool}
}

func (r *ProductRepository) GetAll(ctx context.Context, params model.ListProductsParams) ([]*model.ProductListItem, error) {
	orderColumn := "pv.price"
	if params.SortBy == "created_at" {
		orderColumn = "p.created_at"
	}

	orderDirection := "ASC"
	if params.Order == "desc" {
		orderDirection = "DESC"
	}

	conditions := []string{"($1::bigint IS NULL OR p.category_id = $1)"}
	args := []interface{}{params.CategoryID}

	args = append(args, params.MinPrice)
	conditions = append(conditions, fmt.Sprintf("($%d::numeric IS NULL OR pv.price >= $%d)", len(args), len(args)))

	args = append(args, params.MaxPrice)
	conditions = append(conditions, fmt.Sprintf("($%d::numeric IS NULL OR pv.price <= $%d)", len(args), len(args)))

	args = append(args, params.MinScreenSize)
	conditions = append(conditions, fmt.Sprintf("($%d::numeric IS NULL OR (pv.attributes->>'screen_size')::numeric >= $%d)", len(args), len(args)))

	args = append(args, params.MaxScreenSize)
	conditions = append(conditions, fmt.Sprintf("($%d::numeric IS NULL OR (pv.attributes->>'screen_size')::numeric <= $%d)", len(args), len(args)))

	for key, values := range params.Attributes {
		if len(values) == 0 || !safeAttributeKeyPattern.MatchString(key) {
			continue
		}
		args = append(args, values)
		conditions = append(conditions, fmt.Sprintf("pv.attributes->>'%s' = ANY($%d)", key, len(args)))
	}

	whereClause := strings.Join(conditions, " AND ")

	q := fmt.Sprintf(`
		SELECT
			pv.id,
			p.id,
			p.category_id,
			p.name,
			p.description,
			COALESCE(pv.image_url, p.image_url),
			pv.price,
			pv.attributes
		FROM product_variants pv
		JOIN products p ON p.id = pv.product_id
		WHERE %s
		ORDER BY %s %s`, whereClause, orderColumn, orderDirection)

	rows, err := r.pool.Query(ctx, q, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []*model.ProductListItem
	for rows.Next() {
		var item model.ProductListItem
		var rawAttributes []byte

		if err := rows.Scan(&item.VariantID, &item.ProductID, &item.CategoryID, &item.Name, &item.Description, &item.ImageURL, &item.Price, &rawAttributes); err != nil {
			return nil, err
		}

		if err := json.Unmarshal(rawAttributes, &item.Attributes); err != nil {
			return nil, err
		}

		items = append(items, &item)
	}

	return items, rows.Err()
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

func (r *ProductRepository) GetAvailableFilters(ctx context.Context, categoryID *int64) (*model.ProductFilters, error) {
	const attrsQuery = `
		SELECT kv.key, array_agg(DISTINCT kv.value) 
		FROM product_variants pv
		JOIN products p ON p.id = pv.product_id
		CROSS JOIN LATERAL jsonb_each_text(pv.attributes) AS kv(key, value)
		WHERE ($1::bigint IS NULL OR p.category_id = $1)
		GROUP BY kv.key`

	rows, err := r.pool.Query(ctx, attrsQuery, categoryID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	attributes := make(map[string][]string)
	for rows.Next() {
		var key string
		var values []string
		if err := rows.Scan(&key, &values); err != nil {
			return nil, err
		}
		attributes[key] = values
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	const priceQuery = `
		SELECT COALESCE(MIN(pv.price), 0), COALESCE(MAX(pv.price), 0)
		FROM product_variants pv
		JOIN products p ON p.id = pv.product_id
		WHERE ($1::bigint IS NULL OR p.category_id = $1)`

	var minPrice, maxPrice float64
	if err := r.pool.QueryRow(ctx, priceQuery, categoryID).Scan(&minPrice, &maxPrice); err != nil {
		return nil, err
	}

	return &model.ProductFilters{
		Attributes: attributes,
		MinPrice:   minPrice,
		MaxPrice:   maxPrice,
	}, nil
}
