ALTER TABLE products ADD COLUMN image_url TEXT;
ALTER TABLE product_variants ADD COLUMN image_url TEXT;
DROP TABLE product_variant_images;