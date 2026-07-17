ALTER TABLE products ADD COLUMN color TEXT;

UPDATE products
SET color = attributes->>'color'
WHERE attributes ? 'color';

DROP INDEX idx_products_attributes;
ALTER TABLE products DROP COLUMN attributes;