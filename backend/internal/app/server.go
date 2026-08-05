package app

import (
	"context"
	"log/slog"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/malyshenko-developer/fruit-store/internal/http/handlers"
	"github.com/malyshenko-developer/fruit-store/internal/http/middleware"
	"github.com/malyshenko-developer/fruit-store/internal/service"
)

type Server struct {
	router              *gin.Engine
	categoryService     service.CategoryService
	productService      service.ProductService
	cartService         service.CartService
	authService         service.AuthService
	yandexOAuthService  service.YandexOAuthService
	orderService        service.OrderService
	paymentService      service.PaymentService
	jwtSecret           string
	stripeWebhookSecret string
	logger              *slog.Logger
}

func NewServer(
	categoryService service.CategoryService,
	productService service.ProductService,
	cartService service.CartService,
	authService service.AuthService,
	yandexOAuthService service.YandexOAuthService,
	orderService service.OrderService,
	paymentService service.PaymentService,
	jwtSecret string,
	stripeWebhookSecret string,
	logger *slog.Logger,
) *Server {
	s := &Server{
		categoryService:     categoryService,
		productService:      productService,
		cartService:         cartService,
		authService:         authService,
		yandexOAuthService:  yandexOAuthService,
		orderService:        orderService,
		paymentService:      paymentService,
		jwtSecret:           jwtSecret,
		stripeWebhookSecret: stripeWebhookSecret,
		logger:              logger,
	}
	s.setupRouter()
	return s
}

func (s *Server) Router() *gin.Engine {
	return s.router
}

func (s *Server) setupRouter() {
	r := gin.New()
	r.Use(middleware.RequestLogger(s.logger))

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type"},
		AllowCredentials: true,
	}))

	r.Use(middleware.Session())
	r.Use(middleware.OptionalAuth(s.jwtSecret))
	r.Use(gin.Recovery())
	r.Use(withTimeout(30 * time.Second))

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	categoryHandlers := handlers.NewCategoryHandler(s.categoryService, s.logger)
	productHandlers := handlers.NewProductHandler(s.productService, s.logger)
	cartHandlers := handlers.NewCartHandler(s.cartService, s.logger)
	authHandlers := handlers.NewAuthHandler(s.authService, s.yandexOAuthService, s.logger)
	orderHandlers := handlers.NewOrderHandler(s.orderService, s.logger)
	checkoutHandlers := handlers.NewCheckoutHandler(s.cartService, s.paymentService, s.logger)
	webhookHandlers := handlers.NewWebhookHandler(s.orderService, s.stripeWebhookSecret, s.logger)

	r.POST("/v1/webhooks/stripe", webhookHandlers.HandleStripeWebhook)

	v1 := r.Group("/v1")
	{
		categories := v1.Group("/categories")
		categories.GET("", categoryHandlers.List)

		products := v1.Group("/products")
		products.GET("", productHandlers.List)
		products.GET("/filters", productHandlers.GetFilters)
		products.GET("/:id", productHandlers.GetByID)

		cart := v1.Group("/cart")
		cart.GET("", cartHandlers.GetCart)
		cart.POST("/items", cartHandlers.AddItem)
		cart.PATCH("/items/:variantId", cartHandlers.UpdateQuantity)
		cart.DELETE("/items/:variantId", cartHandlers.RemoveItem)

		auth := v1.Group("/auth")
		auth.POST("/email/request-code", authHandlers.RequestCode)
		auth.POST("/email/verify", authHandlers.VerifyCode)
		auth.GET("/me", authHandlers.Me)
		auth.POST("/logout", authHandlers.Logout)
		auth.POST("/refresh", authHandlers.RefreshToken)
		auth.GET("/yandex/login", authHandlers.YandexLogin)
		auth.GET("/yandex/callback", authHandlers.YandexCallback)

		orders := v1.Group("/orders")
		orders.POST("", orderHandlers.Create)
		orders.GET("/my", orderHandlers.GetMyOrders)
		orders.GET("/track", orderHandlers.Track)

		checkout := v1.Group("/checkout")
		checkout.POST("/create-payment-intent", checkoutHandlers.CreatePaymentIntent)
	}

	s.router = r
}

func withTimeout(d time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(c.Request.Context(), d)
		defer cancel()
		c.Request = c.Request.WithContext(ctx)
		c.Next()
	}
}
