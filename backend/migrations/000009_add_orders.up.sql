CREATE TABLE orders (
                        id SERIAL PRIMARY KEY,
                        order_number TEXT NOT NULL UNIQUE,
                        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                        email TEXT NOT NULL,
                        full_name TEXT NOT NULL,
                        shipping_address TEXT NOT NULL,
                        status TEXT NOT NULL DEFAULT 'pending',
                        total NUMERIC(10, 2) NOT NULL,
                        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
                             id SERIAL PRIMARY KEY,
                             order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
                             variant_id INTEGER NOT NULL REFERENCES product_variants(id),
                             product_name TEXT NOT NULL,
                             variant_attributes JSONB NOT NULL DEFAULT '{}',
                             price NUMERIC(10, 2) NOT NULL,
                             quantity INTEGER NOT NULL
);

CREATE INDEX idx_orders_user_id ON orders (user_id);