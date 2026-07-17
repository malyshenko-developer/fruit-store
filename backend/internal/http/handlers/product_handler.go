package handlers

import (
	"errors"
	"log/slog"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/malyshenko-developer/fruit-store/internal/apperr"
	"github.com/malyshenko-developer/fruit-store/internal/http/dto"
	"github.com/malyshenko-developer/fruit-store/internal/service"
)

type ProductHandler struct {
	service service.ProductService
	logger  *slog.Logger
}

func NewProductHandler(service service.ProductService, logger *slog.Logger) *ProductHandler {
	return &ProductHandler{service: service, logger: logger}
}

func (h *ProductHandler) List(c *gin.Context) {
	var categoryID *int64

	if categoryIDStr := c.Query("category_id"); categoryIDStr != "" {
		parsed, err := strconv.ParseInt(categoryIDStr, 10, 64)
		if err != nil {
			writeBadRequest(c, "category_id must be a number")
			return
		}
		categoryID = &parsed
	}

	products, err := h.service.GetAll(c.Request.Context(), categoryID)
	if err != nil {
		h.logger.Error("failed to fetch products", "error", err, "category_id", categoryID)
		writeInternalError(c, "failed to fetch products")
		return
	}

	response := make([]*dto.ProductListItemResponse, 0, len(products))
	for _, p := range products {
		response = append(response, dto.ProductListItemToResponse(p))
	}

	writeOK(c, response)
}

func (h *ProductHandler) GetByID(c *gin.Context) {
	idStr := c.Param("id")

	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		writeBadRequest(c, "id must be a number")
		return
	}

	product, err := h.service.GetByID(c.Request.Context(), id)
	if err != nil {
		if errors.Is(err, apperr.ErrNotFound) {
			writeNotFound(c, "product not found")
			return
		}
		h.logger.Error("failed to fetch product", "error", err, "product_id", id)
		writeInternalError(c, "failed to fetch product")
		return
	}

	writeOK(c, dto.ProductDetailToResponse(product))
}
