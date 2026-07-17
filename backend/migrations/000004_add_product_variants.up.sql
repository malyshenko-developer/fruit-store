CREATE TABLE product_variants (
                                  id SERIAL PRIMARY KEY,
                                  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
                                  sku TEXT NOT NULL UNIQUE,
                                  price NUMERIC(10, 2) NOT NULL,
                                  stock INTEGER NOT NULL DEFAULT 0,
                                  attributes JSONB NOT NULL DEFAULT '{}',
                                  image_url TEXT,
                                  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_variants_product_id ON product_variants (product_id);
CREATE INDEX idx_product_variants_attributes ON product_variants USING GIN (attributes);

INSERT INTO product_variants (product_id, sku, price, stock, attributes, image_url)
SELECT
    id,
    'SKU-' || id,
    price,
    stock,
    attributes,
    image_url
FROM products;

ALTER TABLE products DROP COLUMN price;
ALTER TABLE products DROP COLUMN stock;
ALTER TABLE products DROP COLUMN attributes;