package dto

type CreatePaymentIntentRequest struct {
	Email           string `json:"email" binding:"required,email"`
	FullName        string `json:"full_name" binding:"required"`
	ShippingAddress string `json:"shipping_address" binding:"required"`
}

type CreatePaymentIntentResponse struct {
	ClientSecret string `json:"client_secret"`
}
