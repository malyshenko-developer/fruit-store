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

func (r *ProductRepository) GetAll(ctx context.Context, params model.ListProductsParams) (*model.PaginatedProducts, error) {
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

	countQuery := fmt.Sprintf(`
		SELECT COUNT(*)
		FROM product_variants pv
		JOIN products p ON p.id = pv.product_id
		WHERE %s`, whereClause)

	var total int
	if err := r.pool.QueryRow(ctx, countQuery, args...).Scan(&total); err != nil {
		return nil, err
	}

	offset := (params.Page - 1) * params.Limit
	args = append(args, params.Limit, offset)
	limitPlaceholder := len(args) - 1
	offsetPlaceholder := len(args)

	q := fmt.Sprintf(`
		SELECT
			pv.id,
			p.id,
			p.category_id,
			c.slug,
			p.name,
			p.description,
			pv.price,
			pv.attributes
		FROM product_variants pv
		JOIN products p ON p.id = pv.product_id
		JOIN categories c ON c.id = p.category_id
		WHERE %s
		ORDER BY %s %s
		LIMIT $%d OFFSET $%d`, whereClause, orderColumn, orderDirection, limitPlaceholder, offsetPlaceholder)

	rows, err := r.pool.Query(ctx, q, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []*model.ProductListItem
	for rows.Next() {
		var item model.ProductListItem
		var rawAttributes []byte

		if err := rows.Scan(&item.VariantID, &item.ProductID, &item.CategoryID, &item.CategorySlug, &item.Name, &item.Description, &item.Price, &rawAttributes); err != nil {
			return nil, err
		}

		if err := json.Unmarshal(rawAttributes, &item.Attributes); err != nil {
			return nil, err
		}

		items = append(items, &item)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return &model.PaginatedProducts{
		Items: items,
		Total: total,
		Page:  params.Page,
		Limit: params.Limit,
	}, nil
}

func (r *ProductRepository) GetByID(ctx context.Context, id int64) (*model.Product, error) {
	const q = `
		SELECT id, category_id, name, description
		FROM products
		WHERE id = $1`

	var p model.Product
	err := r.pool.QueryRow(ctx, q, id).Scan(&p.ID, &p.CategoryID, &p.Name, &p.Description)
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
		SELECT id, product_id, sku, price, stock, attributes
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

		if err := rows.Scan(&v.ID, &v.ProductID, &v.SKU, &v.Price, &v.Stock, &rawAttributes); err != nil {
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

func (r *ProductRepository) GetVariantByID(ctx context.Context, id int64) (*model.ProductVariant, error) {
	const q = `
		SELECT id, product_id, sku, price, stock, attributes
		FROM product_variants
		WHERE id = $1`

	var v model.ProductVariant
	var rawAttributes []byte

	err := r.pool.QueryRow(ctx, q, id).Scan(&v.ID, &v.ProductID, &v.SKU, &v.Price, &v.Stock, &rawAttributes)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, apperr.ErrNotFound
		}
		return nil, err
	}

	if err := json.Unmarshal(rawAttributes, &v.Attributes); err != nil {
		return nil, err
	}

	return &v, nil
}

func (r *ProductRepository) GetImagesByVariantIDs(ctx context.Context, variantIDs []int64) (map[int64][]*model.VariantImage, error) {
	if len(variantIDs) == 0 {
		return map[int64][]*model.VariantImage{}, nil
	}

	rows, err := r.pool.Query(ctx, `
		SELECT id, variant_id, url, sort_order
		FROM product_variant_images
		WHERE variant_id = ANY($1)
		ORDER BY variant_id, sort_order`, variantIDs)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	imagesByVariant := make(map[int64][]*model.VariantImage)
	for rows.Next() {
		var img model.VariantImage
		if err := rows.Scan(&img.ID, &img.VariantID, &img.URL, &img.SortOrder); err != nil {
			return nil, err
		}
		imagesByVariant[img.VariantID] = append(imagesByVariant[img.VariantID], &img)
	}

	return imagesByVariant, rows.Err()
}

func (r *ProductRepository) Search(ctx context.Context, query string, limit, offset int) ([]*model.ProductListItem, int, error) {
	const countQuery = `
		SELECT COUNT(*)
		FROM product_variants pv
		JOIN products p ON p.id = pv.product_id
		WHERE p.name ILIKE '%' || $1 || '%'`

	var total int
	if err := r.pool.QueryRow(ctx, countQuery, query).Scan(&total); err != nil {
		return nil, 0, err
	}

	const q = `
		SELECT
			pv.id, p.id, p.category_id, c.slug, p.name, p.description,
			pv.price, pv.attributes
		FROM product_variants pv
		JOIN products p ON p.id = pv.product_id
		JOIN categories c ON c.id = p.category_id
		WHERE p.name ILIKE '%' || $1 || '%'
		ORDER BY p.name
		LIMIT $2 OFFSET $3`

	rows, err := r.pool.Query(ctx, q, query, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var items []*model.ProductListItem
	for rows.Next() {
		var item model.ProductListItem
		var rawAttributes []byte

		if err := rows.Scan(&item.VariantID, &item.ProductID, &item.CategoryID, &item.CategorySlug, &item.Name, &item.Description, &item.Price, &rawAttributes); err != nil {
			return nil, 0, err
		}

		if err := json.Unmarshal(rawAttributes, &item.Attributes); err != nil {
			return nil, 0, err
		}

		items = append(items, &item)
	}

	return items, total, rows.Err()
}
