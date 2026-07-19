package service

import (
	"testing"

	"github.com/malyshenko-developer/fruit-store/internal/model"
)

func TestListProductsParams_Normalize(t *testing.T) {
	tests := []struct {
		name     string
		input    model.ListProductsParams
		expected model.ListProductsParams
	}{
		{
			name:     "invalid sort_by falls back to created_at",
			input:    model.ListProductsParams{SortBy: "garbage", Order: "asc"},
			expected: model.ListProductsParams{SortBy: "created_at", Order: "asc"},
		},
		{
			name:     "invalid order falls back to desc",
			input:    model.ListProductsParams{SortBy: "price", Order: "garbage"},
			expected: model.ListProductsParams{SortBy: "price", Order: "desc"},
		},
		{
			name:     "valid values pass through unchanged",
			input:    model.ListProductsParams{SortBy: "price", Order: "asc"},
			expected: model.ListProductsParams{SortBy: "price", Order: "asc"},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			params := tt.input
			normalizeListParams(&params)

			if params.SortBy != tt.expected.SortBy {
				t.Errorf("SortBy = %q, want %q", params.SortBy, tt.expected.SortBy)
			}
			if params.Order != tt.expected.Order {
				t.Errorf("Order = %q, want %q", params.Order, tt.expected.Order)
			}
		})
	}
}
