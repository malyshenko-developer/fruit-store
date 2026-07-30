package repository

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/malyshenko-developer/fruit-store/internal/apperr"
	"github.com/malyshenko-developer/fruit-store/internal/model"
)

type RefreshTokenRepository struct {
	pool *pgxpool.Pool
}

func NewRefreshTokenRepository(pool *pgxpool.Pool) *RefreshTokenRepository {
	return &RefreshTokenRepository{pool: pool}
}

func (r *RefreshTokenRepository) Create(ctx context.Context, rt *model.RefreshToken) error {
	const q = `INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)`

	_, err := r.pool.Exec(ctx, q, rt.UserID, rt.Token, rt.ExpiresAt)
	return err
}

func (r *RefreshTokenRepository) GetByToken(ctx context.Context, token string) (*model.RefreshToken, error) {
	const q = `SELECT id, user_id, token, expires_at FROM refresh_tokens WHERE token = $1`

	var rt model.RefreshToken
	err := r.pool.QueryRow(ctx, q, token).Scan(&rt.ID, &rt.UserID, &rt.Token, &rt.ExpiresAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, apperr.ErrNotFound
		}
		return nil, err
	}

	return &rt, nil
}

func (r *RefreshTokenRepository) Delete(ctx context.Context, token string) error {
	const q = `DELETE FROM refresh_tokens WHERE token = $1`

	_, err := r.pool.Exec(ctx, q, token)
	return err
}
