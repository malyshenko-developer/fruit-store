package model

type Product struct {
	ID          int64
	CategoryID  int64
	Name        string
	Price       float64
	Description string
	ImageURL    string
	Stock       int
	Attributes  map[string]interface{}
}
