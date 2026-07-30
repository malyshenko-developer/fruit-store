package service

const yandexAuthorizeURL = "https://oauth.yandex.ru/authorize"

type YandexOAuthService interface {
	GetAuthorizeURL() string
}

type yandexOAuthService struct {
	clientID    string
	redirectURI string
}

func NewYandexOAuthService(clientID, redirectURI string) YandexOAuthService {
	return &yandexOAuthService{clientID: clientID, redirectURI: redirectURI}
}

func (s *yandexOAuthService) GetAuthorizeURL() string {
	return yandexAuthorizeURL + "?response_type=code&client_id=" + s.clientID + "&redirect_uri=" + s.redirectURI
}
