package model

type Product struct {
	ID          int64
	CategoryID  int64
	Name        string
	Description string
}

type ProductListItem struct {
	VariantID    int64
	ProductID    int64
	CategoryID   int64
	CategorySlug string
	Name         string
	Description  string
	Price        float64
	Attributes   map[string]interface{}
}

type ListProductsParams struct {
	CategoryID    *int64
	SortBy        string
	Order         string
	Attributes    map[string][]string
	MinPrice      *float64
	MaxPrice      *float64
	MinScreenSize *float64
	MaxScreenSize *float64
	Page          int
	Limit         int
}

type ProductFilters struct {
	Attributes map[string][]string
	Colors     map[string]string
	MinPrice   float64
	MaxPrice   float64
}

type PaginatedProducts struct {
	Items []*ProductListItem
	Total int
	Page  int
	Limit int
}

type VariantImage struct {
	ID        int64
	VariantID int64
	URL       string
	SortOrder int
}

type ProductListItemWithImages struct {
	Item   *ProductListItem
	Images []*VariantImage
}

type PaginatedProductsWithImages struct {
	Items []*ProductListItemWithImages
	Total int
	Page  int
	Limit int
}

type ProductVariantWithImages struct {
	Variant *ProductVariant
	Images  []*VariantImage
}
