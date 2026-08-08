package model

type Category struct {
	ID       int64
	Name     string
	Slug     string
	ImageURL *string
	MinPrice float64
}
