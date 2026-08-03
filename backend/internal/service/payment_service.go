package service

import (
	"github.com/stripe/stripe-go/v82"
	"github.com/stripe/stripe-go/v82/paymentintent"
)

type PaymentService interface {
	CreatePaymentIntent(amountCents int64, metadata map[string]string) (clientSecret string, paymentIntentID string, err error)
}

type paymentService struct{}

func NewPaymentService(secretKey string) PaymentService {
	stripe.Key = secretKey
	return &paymentService{}
}

func (s *paymentService) CreatePaymentIntent(amountCents int64, metadata map[string]string) (string, string, error) {
	params := &stripe.PaymentIntentParams{
		Amount:   stripe.Int64(amountCents),
		Currency: stripe.String(string(stripe.CurrencyUSD)),
		Metadata: metadata,
	}

	pi, err := paymentintent.New(params)
	if err != nil {
		return "", "", err
	}

	return pi.ClientSecret, pi.ID, nil
}
