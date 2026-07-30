package service

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
)

const yandexAuthorizeURL = "https://oauth.yandex.ru/authorize"
const yandexTokenURL = "https://oauth.yandex.ru/token"
const yandexUserInfoURL = "https://login.yandex.ru/info"

type YandexUserInfo struct {
	Email string `json:"default_email"`
}

type YandexOAuthService interface {
	GetAuthorizeURL() string
	ExchangeCode(code string) (string, error)
	GetUserInfo(accessToken string) (*YandexUserInfo, error)
}

type yandexOAuthService struct {
	clientID     string
	clientSecret string
	redirectURI  string
}

func NewYandexOAuthService(clientID, clientSecret, redirectURI string) YandexOAuthService {
	return &yandexOAuthService{clientID: clientID, clientSecret: clientSecret, redirectURI: redirectURI}
}

func (s *yandexOAuthService) GetAuthorizeURL() string {
	return yandexAuthorizeURL + "?response_type=code&client_id=" + s.clientID + "&redirect_uri=" + s.redirectURI
}

func (s *yandexOAuthService) ExchangeCode(code string) (string, error) {
	form := url.Values{}
	form.Set("grant_type", "authorization_code")
	form.Set("code", code)
	form.Set("client_id", s.clientID)
	form.Set("client_secret", s.clientSecret)

	resp, err := http.Post(yandexTokenURL, "application/x-www-form-urlencoded", strings.NewReader(form.Encode()))
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("yandex token exchange failed: %s", string(body))
	}

	var result struct {
		AccessToken string `json:"access_token"`
	}
	if err := json.Unmarshal(body, &result); err != nil {
		return "", err
	}

	return result.AccessToken, nil
}

func (s *yandexOAuthService) GetUserInfo(accessToken string) (*YandexUserInfo, error) {
	req, err := http.NewRequest("GET", yandexUserInfoURL, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "OAuth "+accessToken)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("yandex user info failed: %s", string(body))
	}

	var userInfo YandexUserInfo
	if err := json.Unmarshal(body, &userInfo); err != nil {
		return nil, err
	}

	return &userInfo, nil
}
