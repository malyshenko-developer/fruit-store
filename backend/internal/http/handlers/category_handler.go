package handlers

import (
	"errors"
	"log/slog"

	"github.com/gin-gonic/gin"
	"github.com/malyshenko-developer/fruit-store/internal/apperr"
	"github.com/malyshenko-developer/fruit-store/internal/http/dto"
	"github.com/malyshenko-developer/fruit-store/internal/service"
)

type CategoryHandler struct {
	service service.CategoryService
	logger  *slog.Logger
}

func NewCategoryHandler(service service.CategoryService, logger *slog.Logger) *CategoryHandler {
	return &CategoryHandler{service: service, logger: logger}
}

func (h *CategoryHandler) List(c *gin.Context) {
	categories, err := h.service.GetAll(c.Request.Context())
	if err != nil {
		h.logger.Error("failed to fetch categories", "error", err)
		writeInternalError(c, "failed to fetch categories")
		return
	}

	response := make([]*dto.CategoryResponse, 0, len(categories))
	for _, cat := range categories {
		response = append(response, dto.CategoryToResponse(cat))
	}

	writeOK(c, response)
}

func (h *CategoryHandler) GetBySlug(c *gin.Context) {
	slug := c.Param("slug")

	category, err := h.service.GetBySlug(c.Request.Context(), slug)
	if err != nil {
		if errors.Is(err, apperr.ErrNotFound) {
			writeNotFound(c, "category not found")
			return
		}
		h.logger.Error("failed to fetch category", "error", err, "slug", slug)
		writeInternalError(c, "failed to fetch category")
		return
	}

	writeOK(c, dto.CategoryToResponse(category))
}
