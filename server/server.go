package main

import (
	"fmt"
	"io/fs"
	"net/http"
	"os"
	"os/signal"
	"sypago_checkout_server/libraries/config"
	"sypago_checkout_server/ui"
	"syscall"

	"strings"

	"github.com/gin-gonic/gin"
)

func staticHandler(engine *gin.Engine) {
	dist, _ := fs.Sub(ui.Dist, "dist")
	fileServer := http.FileServer(http.FS(dist))

	engine.Use(func(c *gin.Context) {
		if !strings.HasPrefix(c.Request.URL.Path, "/api") {
			// Check if the requested file exists
			_, err := fs.Stat(dist, strings.TrimPrefix(c.Request.URL.Path, "/"))
			if os.IsNotExist(err) {
				// If the file does not exist, serve index.html
				fmt.Println("File not found, serving index.html")
				c.Request.URL.Path = "/"
			} else {
				// Serve other static files
				fmt.Println("Serving other static files")
			}

			fileServer.ServeHTTP(c.Writer, c.Request)
			c.Abort()
		}
	})
}

func main() {
	var done chan os.Signal = make(chan os.Signal, 1)

	signal.Notify(done, syscall.SIGINT, syscall.SIGTERM)

	gin.SetMode(gin.ReleaseMode)

	router := gin.Default()
	staticHandler(router)

	if config.GetConfig().SslConfig.EnabledSslHttp {

		if err := router.RunTLS(fmt.Sprintf("0.0.0.0:%d",
			config.GetConfig().ServiceInfo.HttpPort),
			config.GetConfig().SslConfig.Path,
			config.GetConfig().SslConfig.PathToKey); err != nil {

			fmt.Println("Failed to start REST API server", err)
		}

		return
	}

	go func(r *gin.Engine) {
		err := r.Run(fmt.Sprintf("0.0.0.0:%d",
			config.GetConfig().ServiceInfo.HttpPort))

		if err != nil {
			fmt.Println(err)
		}

	}(router)

	<-done
}
