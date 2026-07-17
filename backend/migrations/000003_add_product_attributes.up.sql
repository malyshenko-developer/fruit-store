ALTER TABLE products ADD COLUMN attributes JSONB NOT NULL DEFAULT '{}';

UPDATE products
SET attributes = jsonb_build_object('color', color)
WHERE color IS NOT NULL;

ALTER TABLE products DROP COLUMN color;

CREATE INDEX idx_products_attributes ON products USING GIN (attributes);