package repository

import (
	"context"
	"crypto/rand"
	"encoding/json"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/malyshenko-developer/fruit-store/internal/apperr"
	"github.com/malyshenko-developer/fruit-store/internal/model"
)

type OrderRepository struct {
	pool *pgxpool.Pool
}

func NewOrderRepository(pool *pgxpool.Pool) *OrderRepository {
	return &OrderRepository{pool: pool}
}

func (r *OrderRepository) CreateFromCart(ctx context.Context, input model.CreateOrderInput) (*model.Order, error) {
	tx, err := r.pool.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	var cartID int64
	if input.UserID != nil {
		err = tx.QueryRow(ctx, `SELECT id FROM carts WHERE user_id = $1`, *input.UserID).Scan(&cartID)
	} else {
		err = tx.QueryRow(ctx, `SELECT id FROM carts WHERE session_id = $1`, input.SessionID).Scan(&cartID)
	}
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, apperr.ErrNotFound
		}
		return nil, err
	}

	items, err := r.getCartItemsForUpdate(ctx, tx, cartID)
	if err != nil {
		return nil, err
	}

	if len(items) == 0 {
		return nil, apperr.ErrNotFound
	}

	var total float64
	for _, item := range items {
		if item.Variant.Stock < item.CartItem.Quantity {
			return nil, model.ErrInsufficientStock
		}
		total += item.Variant.Price * float64(item.CartItem.Quantity)
	}

	orderNumber, err := generateOrderNumber()
	if err != nil {
		return nil, err
	}

	order, err := r.insertOrder(ctx, tx, input, orderNumber, total)
	if err != nil {
		return nil, err
	}

	if err := r.insertOrderItemsAndDecrementStock(ctx, tx, order.ID, items); err != nil {
		return nil, err
	}

	if _, err := tx.Exec(ctx, `DELETE FROM cart_items WHERE cart_id = $1`, cartID); err != nil {
		return nil, err
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}

	return order, nil
}

func (r *OrderRepository) getCartItemsForUpdate(ctx context.Context, tx pgx.Tx, cartID int64) ([]*model.CartItemWithVariant, error) {
	rows, err := tx.Query(ctx, `
		SELECT
			ci.id, ci.cart_id, ci.variant_id, ci.quantity,
			pv.id, pv.product_id, pv.sku, pv.price, pv.stock, pv.attributes, pv.image_url,
			p.id, p.category_id, p.name, p.description, p.image_url
		FROM cart_items ci
		JOIN product_variants pv ON pv.id = ci.variant_id
		JOIN products p ON p.id = pv.product_id
		WHERE ci.cart_id = $1
		FOR UPDATE OF pv`, cartID)
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

		items = append(items, &model.CartItemWithVariant{CartItem: &item, Variant: &variant, Product: &product})
	}

	return items, rows.Err()
}

func (r *OrderRepository) insertOrder(ctx context.Context, tx pgx.Tx, input model.CreateOrderInput, orderNumber string, total float64) (*model.Order, error) {
	var order model.Order
	err := tx.QueryRow(ctx, `
		INSERT INTO orders (order_number, user_id, email, full_name, shipping_address, total)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, order_number, user_id, email, full_name, shipping_address, status, total, created_at`,
		orderNumber, input.UserID, input.Email, input.FullName, input.ShippingAddress, total,
	).Scan(&order.ID, &order.OrderNumber, &order.UserID, &order.Email, &order.FullName, &order.ShippingAddress, &order.Status, &order.Total, &order.CreatedAt)
	if err != nil {
		return nil, err
	}

	return &order, nil
}

func (r *OrderRepository) insertOrderItemsAndDecrementStock(ctx context.Context, tx pgx.Tx, orderID int64, items []*model.CartItemWithVariant) error {
	for _, item := range items {
		attrs, err := json.Marshal(item.Variant.Attributes)
		if err != nil {
			return err
		}

		_, err = tx.Exec(ctx, `
			INSERT INTO order_items (order_id, variant_id, product_name, variant_attributes, price, quantity)
			VALUES ($1, $2, $3, $4, $5, $6)`,
			orderID, item.Variant.ID, item.Product.Name, attrs, item.Variant.Price, item.CartItem.Quantity)
		if err != nil {
			return err
		}

		_, err = tx.Exec(ctx, `UPDATE product_variants SET stock = stock - $1 WHERE id = $2`,
			item.CartItem.Quantity, item.Variant.ID)
		if err != nil {
			return err
		}
	}

	return nil
}

func generateOrderNumber() (string, error) {
	digits := make([]byte, 6)
	randomBytes := make([]byte, 6)
	if _, err := rand.Read(randomBytes); err != nil {
		return "", err
	}
	for i, b := range randomBytes {
		digits[i] = "0123456789"[int(b)%10]
	}
	return fmt.Sprintf("FS-%s", digits), nil
}
