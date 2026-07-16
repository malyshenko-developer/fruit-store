package main

import (
	"context"
	"log"

	"github.com/joho/godotenv"
	"github.com/malyshenko-developer/fruit-store/internal/config"
	"github.com/malyshenko-developer/fruit-store/internal/infra/db/postgres"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("no .env file found, relying on real environment variables")
	}

	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}

	ctx := context.Background()

	pool, err := postgres.NewPool(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	defer pool.Close()

	log.Println("successfully connected to database")
}
