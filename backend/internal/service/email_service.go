package service

import (
	"fmt"

	"github.com/resend/resend-go/v3"
)

type EmailService interface {
	SendOTPCode(email, code string) error
}

type emailService struct {
	client *resend.Client
}

func NewEmailService(apiKey string) EmailService {
	return &emailService{client: resend.NewClient(apiKey)}
}

func (s *emailService) SendOTPCode(email, code string) error {
	params := &resend.SendEmailRequest{
		From:    "Fruit Store <onboarding@resend.dev>",
		To:      []string{email},
		Subject: "Your login code",
		Html:    fmt.Sprintf("<p>Your login code is: <strong>%s</strong></p><p>It expires in 5 minutes.</p>", code),
	}

	_, err := s.client.Emails.Send(params)
	return err
}
