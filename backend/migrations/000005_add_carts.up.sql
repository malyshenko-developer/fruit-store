CREATE TABLE carts (
                       id SERIAL PRIMARY KEY,
                       user_id INTEGER,
                       session_id TEXT UNIQUE,
                       created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE cart_items (
                            id SERIAL PRIMARY KEY,
                            cart_id INTEGER NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
                            variant_id INTEGER NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
                            quantity INTEGER NOT NULL DEFAULT 1,
                            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                            UNIQUE (cart_id, variant_id)
);

CREATE INDEX idx_cart_items_cart_id ON cart_items (cart_id);