ALTER TABLE carts
    ADD CONSTRAINT fk_carts_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;