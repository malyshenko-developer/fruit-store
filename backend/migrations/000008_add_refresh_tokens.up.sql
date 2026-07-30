CREATE TABLE refresh_tokens (
                                id SERIAL PRIMARY KEY,
                                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                token TEXT NOT NULL UNIQUE,
                                expires_at TIMESTAMPTZ NOT NULL,
                                created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_refresh_tokens_token ON refresh_tokens (token);