package handlers

import (
	"errors"
	"log/slog"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/malyshenko-developer/fruit-store/internal/apperr"
	"github.com/malyshenko-developer/fruit-store/internal/http/dto"
	"github.com/malyshenko-developer/fruit-store/internal/model"
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
	categoryID, err := parseOptionalInt64Query(c, "category_id")
	if err != nil {
		writeBadRequest(c, "category_id must be a number")
		return
	}

	minPrice, err := parseOptionalFloat64Query(c, "min_price")
	if err != nil {
		writeBadRequest(c, "min_price must be a number")
		return
	}

	maxPrice, err := parseOptionalFloat64Query(c, "max_price")
	if err != nil {
		writeBadRequest(c, "max_price must be a number")
		return
	}

	minScreenSize, err := parseOptionalFloat64Query(c, "min_screen_size")
	if err != nil {
		writeBadRequest(c, "min_screen_size must be a number")
		return
	}

	maxScreenSize, err := parseOptionalFloat64Query(c, "max_screen_size")
	if err != nil {
		writeBadRequest(c, "max_screen_size must be a number")
		return
	}

	page := 1
	if pageStr := c.Query("page"); pageStr != "" {
		parsed, err := strconv.Atoi(pageStr)
		if err != nil {
			writeBadRequest(c, "page must be a number")
			return
		}
		page = parsed
	}

	limit := 0
	if limitStr := c.Query("limit"); limitStr != "" {
		parsed, err := strconv.Atoi(limitStr)
		if err != nil {
			writeBadRequest(c, "limit must be a number")
			return
		}
		limit = parsed
	}

	attributes := make(map[string][]string)
	for key := range service.AllowedAttributeFilters {
		if values := c.QueryArray(key); len(values) > 0 {
			attributes[key] = values
		}
	}

	params := model.ListProductsParams{
		CategoryID:    categoryID,
		SortBy:        c.Query("sort_by"),
		Order:         c.Query("order"),
		Attributes:    attributes,
		MinPrice:      minPrice,
		MaxPrice:      maxPrice,
		MinScreenSize: minScreenSize,
		MaxScreenSize: maxScreenSize,
		Page:          page,
		Limit:         limit,
	}

	products, err := h.service.GetAll(c.Request.Context(), params)
	if err != nil {
		h.logger.Error("failed to fetch products", "error", err, "params", params)
		writeInternalError(c, "failed to fetch products")
		return
	}

	writeOK(c, dto.PaginatedProductsToResponse(products))
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

func (h *ProductHandler) GetFilters(c *gin.Context) {
	categoryID, err := parseOptionalInt64Query(c, "category_id")
	if err != nil {
		writeBadRequest(c, "category_id must be a number")
		return
	}

	filters, err := h.service.GetAvailableFilters(c.Request.Context(), categoryID)
	if err != nil {
		h.logger.Error("failed to fetch filters", "error", err, "category_id", categoryID)
		writeInternalError(c, "failed to fetch filters")
		return
	}

	writeOK(c, dto.ProductFiltersToResponse(filters))
}

func (h *ProductHandler) Search(c *gin.Context) {
	query := c.Query("q")
	if query == "" {
		writeBadRequest(c, "query parameter 'q' is required")
		return
	}

	result, err := h.service.Search(c.Request.Context(), query)
	if err != nil {
		h.logger.Error("failed to search products", "error", err, "query", query)
		writeInternalError(c, "failed to search products")
		return
	}

	writeOK(c, dto.PaginatedProductsToResponse(result))
}
