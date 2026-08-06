CREATE TABLE product_variant_images (
                                        id SERIAL PRIMARY KEY,
                                        variant_id INTEGER NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
                                        url TEXT NOT NULL,
                                        sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_product_variant_images_variant_id ON product_variant_images (variant_id);

ALTER TABLE product_variants DROP COLUMN image_url;
ALTER TABLE products DROP COLUMN image_url;