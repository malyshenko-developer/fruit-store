package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/malyshenko-developer/fruit-store/internal/http/dto"
	"github.com/malyshenko-developer/fruit-store/internal/service"
)

type CategoryHandler struct {
	service service.CategoryService
}

func NewCategoryHandler(service service.CategoryService) *CategoryHandler {
	return &CategoryHandler{service: service}
}

func (h *CategoryHandler) List(c *gin.Context) {
	categories, err := h.service.GetAll(c.Request.Context())
	if err != nil {
		writeInternalError(c, "failed to fetch categories")
		return
	}

	response := make([]dto.CategoryResponse, 0, len(categories))
	for _, cat := range categories {
		response = append(response, dto.CategoryToResponse(cat))
	}

	writeOK(c, response)
}
