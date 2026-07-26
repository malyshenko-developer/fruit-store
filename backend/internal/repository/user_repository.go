package repository

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/malyshenko-developer/fruit-store/internal/apperr"
	"github.com/malyshenko-developer/fruit-store/internal/model"
)

type UserRepository struct {
	pool *pgxpool.Pool
}

func NewUserRepository(pool *pgxpool.Pool) *UserRepository {
	return &UserRepository{pool: pool}
}

func (r *UserRepository) GetByEmail(ctx context.Context, email string) (*model.User, error) {
	const q = `SELECT id, email, yandex_id FROM users WHERE email = $1`

	var u model.User
	err := r.pool.QueryRow(ctx, q, email).Scan(&u.ID, &u.Email, &u.YandexID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, apperr.ErrNotFound
		}
		return nil, err
	}

	return &u, nil
}

func (r *UserRepository) GetByID(ctx context.Context, id int64) (*model.User, error) {
	const q = `SELECT id, email, yandex_id FROM users WHERE id = $1`

	var u model.User
	err := r.pool.QueryRow(ctx, q, id).Scan(&u.ID, &u.Email, &u.YandexID)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, apperr.ErrNotFound
		}
		return nil, err
	}

	return &u, nil
}

func (r *UserRepository) Create(ctx context.Context, email string) (*model.User, error) {
	const q = `INSERT INTO users (email) VALUES ($1) RETURNING id, email, yandex_id`

	var u model.User
	err := r.pool.QueryRow(ctx, q, email).Scan(&u.ID, &u.Email, &u.YandexID)
	if err != nil {
		return nil, err
	}

	return &u, nil
}
