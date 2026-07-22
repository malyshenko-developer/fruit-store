package model

type Product struct {
	ID          int64
	CategoryID  int64
	Name        string
	Description string
	ImageURL    string
}

type ProductListItem struct {
	VariantID   int64
	ProductID   int64
	CategoryID  int64
	Name        string
	Description string
	ImageURL    string
	Price       float64
	Attributes  map[string]interface{}
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
	MinPrice   float64
	MaxPrice   float64
}

type PaginatedProducts struct {
	Items []*ProductListItem
	Total int
	Page  int
	Limit int
}
