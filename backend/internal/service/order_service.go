package service

import (
	"context"

	"github.com/malyshenko-developer/fruit-store/internal/model"
)

type OrderRepository interface {
	CreateFromCart(ctx context.Context, input model.CreateOrderInput) (*model.Order, error)
}

type OrderService interface {
	CreateFromCart(ctx context.Context, input model.CreateOrderInput) (*model.Order, error)
}

type orderService struct {
	repo         OrderRepository
	emailService EmailService
}

func NewOrderService(repo OrderRepository, emailService EmailService) OrderService {
	return &orderService{repo: repo, emailService: emailService}
}

func (s *orderService) CreateFromCart(ctx context.Context, input model.CreateOrderInput) (*model.Order, error) {
	order, err := s.repo.CreateFromCart(ctx, input)
	if err != nil {
		return nil, err
	}

	if err := s.emailService.SendOrderConfirmation(order.Email, order.OrderNumber); err != nil {
		return order, nil
	}

	return order, nil
}
