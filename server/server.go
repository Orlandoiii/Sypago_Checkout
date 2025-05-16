package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"sypago_checkout_server/libraries/config"
	"sypago_checkout_server/libraries/sypago"
	"sypago_checkout_server/middlewares"
	"syscall"

	"github.com/gin-gonic/gin"
	"github.com/shopspring/decimal"
)

func SecurityHeaders() gin.HandlerFunc {

	return func(c *gin.Context) {
		c.Header("X-Frame-Options", "SAMEORIGIN")

		//c.Header("Content-Security-Policy", "frame-ancestors 'none'; default-src 'self'")

		c.Header("X-Content-Type-Options", "nosniff")
		c.Header("X-XSS-Protection", "1; mode=block")

		c.Next()
	}
}

func main() {
	decimal.MarshalJSONWithoutQuotes = true

	execPath, err := os.Executable()
	if err != nil {
		panic(err)
	}

	execPath = filepath.Dir(execPath)

	var done chan os.Signal = make(chan os.Signal, 1)

	signal.Notify(done, syscall.SIGINT, syscall.SIGTERM)

	gin.SetMode(gin.ReleaseMode)

	router := gin.Default()

	router.Use(SecurityHeaders())

	checkoutDir := filepath.Join(execPath, "checkoutweb")

	fmt.Println("Checkout Dir:", checkoutDir)

	checkoutWebAssets := middlewares.NewCheckoutWebAssetsConfig(checkoutDir)

	router.Use(middlewares.ServeStaticAssets(checkoutWebAssets))

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

	fmt.Println("Starting REST API server on port", config.GetConfig().ServiceInfo.HttpPort)

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
