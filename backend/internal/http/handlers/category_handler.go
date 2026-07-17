package handlers

import (
	"log/slog"

	"github.com/gin-gonic/gin"
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
