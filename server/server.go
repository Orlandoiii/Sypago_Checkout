package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/fs"
	"net/http"
	"os"
	"os/signal"
	"sypago_checkout_server/libraries/config"
	"sypago_checkout_server/libraries/sypago"
	"sypago_checkout_server/ui"
	"syscall"

	"strings"

	"github.com/gin-gonic/gin"
	"github.com/shopspring/decimal"
)

func staticHandler(engine *gin.Engine) {
	dist, _ := fs.Sub(ui.Dist, "dist")
	fileServer := http.FileServer(http.FS(dist))

	engine.Use(func(c *gin.Context) {
		if !strings.Contains(c.Request.URL.Path, "request-sypago") {
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
	decimal.MarshalJSONWithoutQuotes = true

	var done chan os.Signal = make(chan os.Signal, 1)

	signal.Notify(done, syscall.SIGINT, syscall.SIGTERM)

	gin.SetMode(gin.ReleaseMode)

	router := gin.Default()
	staticHandler(router)

	router.POST("/request-sypago", func(c *gin.Context) {
		fmt.Println("Request Sypago")

		var requestBody struct {
			Amount decimal.Decimal `json:"amount"`
		}

		if err := c.ShouldBindJSON(&requestBody); err != nil {
			fmt.Println(err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
			return
		}

		fmt.Println("Request Body:", requestBody)

		sypagoPaymentRequest := sypago.GeneratePaymentRequestWithDecimal(requestBody.Amount)

		fmt.Println("Sypago Payment Request:", sypagoPaymentRequest)
		jsonData, _ := json.Marshal(sypagoPaymentRequest)

		fmt.Println("JSON Data:", string(jsonData))

		req, _ := http.NewRequest("POST", config.GetConfig().SyPagoUser.SyPagoUrl, bytes.NewBuffer(jsonData))
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Authorization", "Bearer "+config.GetConfig().SyPagoUser.ClientSecretToken)

		// Send the request using http.Client
		client := &http.Client{}

		resp, err := client.Do(req)

		if err != nil {
			fmt.Println("Error sending request:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to make request to SyPago"})
			return
		}

		fmt.Println("Response Status Code:", resp.StatusCode)

		defer resp.Body.Close()

		var sypagoResponse map[string]interface{}
		if err := json.NewDecoder(resp.Body).Decode(&sypagoResponse); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse SyPago response"})
			return
		}

		// Return the SyPago response to the client
		c.JSON(http.StatusOK, sypagoResponse)

	})

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
