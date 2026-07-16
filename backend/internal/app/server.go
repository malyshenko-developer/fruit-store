package app

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/malyshenko-developer/fruit-store/internal/http/handlers"
	"github.com/malyshenko-developer/fruit-store/internal/service"
)

type Server struct {
	router          *gin.Engine
	categoryService service.CategoryService
}

func NewServer(categoryService service.CategoryService) *Server {
	s := &Server{categoryService: categoryService}
	s.setupRouter()
	return s
}

func (s *Server) Router() *gin.Engine {
	return s.router
}

func (s *Server) setupRouter() {
	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	r.Use(withTimeout(30 * time.Second))

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	categoryHandlers := handlers.NewCategoryHandler(s.categoryService)

	v1 := r.Group("/v1")
	{
		v1.GET("/categories", categoryHandlers.List)
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
