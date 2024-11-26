package config

type ConfigFile struct {
	ServiceInfo `json:"ServiceInfo"`
	SslConfig   `json:"SslConfig"`
	SyPagoUser  `json:"SyPagoUser"`
}

type ServiceInfo struct {
	Version     string `json:"Version"`
	Descripcion string `json:"Descripcion"`
	HttpPort    int    `json:"HttpPort"`
	GrpcPort    int    `json:"GrpcPort"`
}

type SslConfig struct {
	EnabledSslHttp bool   `json:"EnabledSslHttp"`
	EnabledSslGrpc bool   `json:"EnabledSslGrpc"`
	Path           string `json:"Path"`
	PathToKey      string `json:"PathToKey"`
}

type SyPagoUser struct {
	ClientId          string `json:"ClientId"`
	ClientSecretToken string `json:"ClientSecretToken"`
	BankCode          string `json:"BankCode"`
	AccountNumber     string `json:"AccountNumber"`
	Concept           string `json:"Concept"`
	SyPagoUrl         string `json:"SyPagoApiUrl"`
	SuccessUrl        string `json:"SuccessUrl"`
	ErrorUrl          string `json:"ErrorUrl"`
	WebHookEndpoint   string `json:"WebHookEndpoint"`
	FailedCallbackURL string `json:"FailedCallbackURL"`
}
