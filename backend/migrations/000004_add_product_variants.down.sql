ALTER TABLE products ADD COLUMN price NUMERIC(10, 2);
ALTER TABLE products ADD COLUMN stock INTEGER NOT NULL DEFAULT 0;
ALTER TABLE products ADD COLUMN attributes JSONB NOT NULL DEFAULT '{}';

UPDATE products p
SET price = pv.price,
    stock = pv.stock,
    attributes = pv.attributes,
    image_url = COALESCE(pv.image_url, p.image_url)
    FROM (
    SELECT DISTINCT ON (product_id) product_id, price, stock, attributes, image_url
    FROM product_variants
    ORDER BY product_id, id
) pv
WHERE p.id = pv.product_id;

ALTER TABLE products ALTER COLUMN price SET NOT NULL;

DROP TABLE product_variants;