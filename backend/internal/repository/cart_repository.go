package repository

import (
	"context"
	"encoding/json"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/malyshenko-developer/fruit-store/internal/model"
)

type CartRepository struct {
	pool *pgxpool.Pool
}

func NewCartRepository(pool *pgxpool.Pool) *CartRepository {
	return &CartRepository{pool: pool}
}

func (r *CartRepository) GetOrCreateBySessionID(ctx context.Context, sessionID string) (*model.Cart, error) {
	const selectQuery = `SELECT id, user_id, session_id FROM carts WHERE session_id = $1`

	var cart model.Cart
	err := r.pool.QueryRow(ctx, selectQuery, sessionID).Scan(&cart.ID, &cart.UserID, &cart.SessionID)
	if err == nil {
		return &cart, nil
	}

	if !errors.Is(err, pgx.ErrNoRows) {
		return nil, err
	}

	const insertQuery = `INSERT INTO carts (session_id) VALUES ($1) RETURNING id, user_id, session_id`

	err = r.pool.QueryRow(ctx, insertQuery, sessionID).Scan(&cart.ID, &cart.UserID, &cart.SessionID)
	if err != nil {
		return nil, err
	}

	return &cart, nil
}

func (r *CartRepository) GetItems(ctx context.Context, cartID int64) ([]*model.CartItemWithVariant, error) {
	const q = `
		SELECT
			ci.id, ci.cart_id, ci.variant_id, ci.quantity,
			pv.id, pv.product_id, pv.sku, pv.price, pv.stock, pv.attributes, pv.image_url,
			p.id, p.category_id, p.name, p.description, p.image_url
		FROM cart_items ci
		JOIN product_variants pv ON pv.id = ci.variant_id
		JOIN products p ON p.id = pv.product_id
		WHERE ci.cart_id = $1
		ORDER BY ci.id`

	rows, err := r.pool.Query(ctx, q, cartID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var items []*model.CartItemWithVariant
	for rows.Next() {
		var item model.CartItem
		var variant model.ProductVariant
		var product model.Product
		var rawAttributes []byte

		if err := rows.Scan(
			&item.ID, &item.CartID, &item.VariantID, &item.Quantity,
			&variant.ID, &variant.ProductID, &variant.SKU, &variant.Price, &variant.Stock, &rawAttributes, &variant.ImageURL,
			&product.ID, &product.CategoryID, &product.Name, &product.Description, &product.ImageURL,
		); err != nil {
			return nil, err
		}

		if err := json.Unmarshal(rawAttributes, &variant.Attributes); err != nil {
			return nil, err
		}

		items = append(items, &model.CartItemWithVariant{
			CartItem: &item,
			Variant:  &variant,
			Product:  &product,
		})
	}

	return items, rows.Err()
}

func (r *CartRepository) AddItem(ctx context.Context, cartID, variantID int64, quantity int) error {
	const q = `
		INSERT INTO cart_items (cart_id, variant_id, quantity)
		VALUES ($1, $2, $3)
		ON CONFLICT (cart_id, variant_id)
		DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity`

	_, err := r.pool.Exec(ctx, q, cartID, variantID, quantity)
	return err
}

func (r *CartRepository) UpdateQuantity(ctx context.Context, cartID, variantID int64, quantity int) error {
	const q = `UPDATE cart_items SET quantity = $3 WHERE cart_id = $1 AND variant_id = $2`

	_, err := r.pool.Exec(ctx, q, cartID, variantID, quantity)
	return err
}

func (r *CartRepository) RemoveItem(ctx context.Context, cartID, variantID int64) error {
	const q = `DELETE FROM cart_items WHERE cart_id = $1 AND variant_id = $2`

	_, err := r.pool.Exec(ctx, q, cartID, variantID)
	return err
}

func (r *CartRepository) AttachToUser(ctx context.Context, sessionID string, userID int64) error {
	const q = `
		UPDATE carts
		SET user_id = $2
		WHERE session_id = $1 AND user_id IS NULL`

	_, err := r.pool.Exec(ctx, q, sessionID, userID)
	return err
}
