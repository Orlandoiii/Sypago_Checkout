package config

type ConfigFile struct {
	ServiceInfo `json:"ServiceInfo"`
	SslConfig   `json:"SslConfig"`
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
