package service

import (
	"context"
	"errors"

	"github.com/malyshenko-developer/fruit-store/internal/model"
)

var ErrInsufficientStock = errors.New("insufficient stock")

type CartRepository interface {
	GetOrCreateBySessionID(ctx context.Context, sessionID string) (*model.Cart, error)
	GetItems(ctx context.Context, cartID int64) ([]*model.CartItemWithVariant, error)
	AddItem(ctx context.Context, cartID, variantID int64, quantity int) error
	UpdateQuantity(ctx context.Context, cartID, variantID int64, quantity int) error
	RemoveItem(ctx context.Context, cartID, variantID int64) error
	AttachToUser(ctx context.Context, sessionID string, userID int64) error
}

type CartService interface {
	GetCart(ctx context.Context, sessionID string) (*model.CartSummary, error)
	AddItem(ctx context.Context, sessionID string, variantID int64, quantity int) error
	UpdateQuantity(ctx context.Context, sessionID string, variantID int64, quantity int) error
	RemoveItem(ctx context.Context, sessionID string, variantID int64) error
}

type cartService struct {
	repo        CartRepository
	productRepo ProductRepository
}

func NewCartService(repo CartRepository, productRepo ProductRepository) CartService {
	return &cartService{repo: repo, productRepo: productRepo}
}

func (s *cartService) GetCart(ctx context.Context, sessionID string) (*model.CartSummary, error) {
	cart, err := s.repo.GetOrCreateBySessionID(ctx, sessionID)
	if err != nil {
		return nil, err
	}

	items, err := s.repo.GetItems(ctx, cart.ID)
	if err != nil {
		return nil, err
	}

	var total float64
	for _, item := range items {
		total += item.Variant.Price * float64(item.CartItem.Quantity)
	}

	return &model.CartSummary{Items: items, Total: total}, nil
}

func (s *cartService) AddItem(ctx context.Context, sessionID string, variantID int64, quantity int) error {
	cart, err := s.repo.GetOrCreateBySessionID(ctx, sessionID)
	if err != nil {
		return err
	}

	variant, err := s.productRepo.GetVariantByID(ctx, variantID)
	if err != nil {
		return err
	}

	if variant.Stock < quantity {
		return ErrInsufficientStock
	}

	return s.repo.AddItem(ctx, cart.ID, variantID, quantity)
}

func (s *cartService) UpdateQuantity(ctx context.Context, sessionID string, variantID int64, quantity int) error {
	cart, err := s.repo.GetOrCreateBySessionID(ctx, sessionID)
	if err != nil {
		return err
	}

	variant, err := s.productRepo.GetVariantByID(ctx, variantID)
	if err != nil {
		return err
	}

	if variant.Stock < quantity {
		return ErrInsufficientStock
	}

	return s.repo.UpdateQuantity(ctx, cart.ID, variantID, quantity)
}

func (s *cartService) RemoveItem(ctx context.Context, sessionID string, variantID int64) error {
	cart, err := s.repo.GetOrCreateBySessionID(ctx, sessionID)
	if err != nil {
		return err
	}

	return s.repo.RemoveItem(ctx, cart.ID, variantID)
}
