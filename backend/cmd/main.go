package main

import (
	"context"
	"log"

	"github.com/joho/godotenv"
	"github.com/malyshenko-developer/fruit-store/internal/app"
	"github.com/malyshenko-developer/fruit-store/internal/config"
	"github.com/malyshenko-developer/fruit-store/internal/infra/db/postgres"
	"github.com/malyshenko-developer/fruit-store/internal/logger"
	"github.com/malyshenko-developer/fruit-store/internal/repository"
	"github.com/malyshenko-developer/fruit-store/internal/service"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("no .env file found, relying on real environment variables")
	}

	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}

	appLogger := logger.New(cfg.LogLevel)

	ctx := context.Background()

	pool, err := postgres.NewPool(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	defer pool.Close()

	appLogger.Info("successfully connected to database")

	categoryRepo := repository.NewCategoryRepository(pool)
	productRepo := repository.NewProductRepository(pool)

	categoryService := service.NewCategoryService(categoryRepo)
	productService := service.NewProductService(productRepo)

	server := app.NewServer(categoryService, productService, appLogger)

	appLogger.Info("starting server", "port", cfg.Port)
	if err := server.Router().Run(":" + cfg.Port); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}
