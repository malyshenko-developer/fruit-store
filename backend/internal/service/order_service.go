package service

import (
	"context"

	"github.com/malyshenko-developer/fruit-store/internal/model"
)

type OrderRepository interface {
	CreateFromCart(ctx context.Context, input model.CreateOrderInput) (*model.Order, error)
	GetByUserID(ctx context.Context, userID int64) ([]*model.Order, error)
	GetItemsByOrderIDs(ctx context.Context, orderIDs []int64) (map[int64][]*model.OrderItem, error)
}

type OrderService interface {
	CreateFromCart(ctx context.Context, input model.CreateOrderInput) (*model.Order, error)
	GetOrdersByUserID(ctx context.Context, userID int64) ([]*model.OrderWithItems, error)
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

func (s *orderService) GetOrdersByUserID(ctx context.Context, userID int64) ([]*model.OrderWithItems, error) {
	orders, err := s.repo.GetByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}

	if len(orders) == 0 {
		return []*model.OrderWithItems{}, nil
	}

	orderIDs := make([]int64, len(orders))
	for i, order := range orders {
		orderIDs[i] = order.ID
	}

	itemsByOrder, err := s.repo.GetItemsByOrderIDs(ctx, orderIDs)
	if err != nil {
		return nil, err
	}

	result := make([]*model.OrderWithItems, len(orders))
	for i, order := range orders {
		result[i] = &model.OrderWithItems{
			Order: order,
			Items: itemsByOrder[order.ID],
		}
	}

	return result, nil
}
