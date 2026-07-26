package dto

import "github.com/malyshenko-developer/fruit-store/internal/model"

type RequestCodeRequest struct {
	Email string `json:"email" binding:"required,email"`
}

type VerifyCodeRequest struct {
	Email string `json:"email" binding:"required,email"`
	Code  string `json:"code" binding:"required,len=6"`
}

type VerifyCodeResponse struct {
	Token string `json:"token"`
}

func TokenToResponse(token string) *VerifyCodeResponse {
	return &VerifyCodeResponse{Token: token}
}

type MeResponse struct {
	ID    int64  `json:"id"`
	Email string `json:"email"`
}

func UserToMeResponse(u *model.User) *MeResponse {
	return &MeResponse{
		ID:    u.ID,
		Email: u.Email,
	}
}
