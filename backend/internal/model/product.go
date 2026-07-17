package model

type Product struct {
	ID          int64
	CategoryID  int64
	Name        string
	Description string
	ImageURL    string
}

type ProductListItem struct {
	ID          int64
	CategoryID  int64
	Name        string
	Description string
	ImageURL    string
	MinPrice    float64
}
