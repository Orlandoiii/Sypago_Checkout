package sypago

import (
	"sypago_checkout_server/libraries/config"

	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type AccountDetails struct {
	BankCode string `json:"bank_code"`
	Type     string `json:"type"`
	Number   string `json:"number"`
}

func GenerateAccountDetails() AccountDetails {
	accountDetails := AccountDetails{}

	accountDetails.BankCode = config.GetConfig().SyPagoUser.BankCode
	accountDetails.Number = config.GetConfig().SyPagoUser.AccountNumber
	accountDetails.Type = "CNTA"

	return accountDetails
}

type Amount struct {
	Type     string          `json:"type"`
	Amt      decimal.Decimal `json:"amt"`
	Currency string          `json:"currency"`
}

func GenerateAmount(amountValue string) Amount {
	amount := Amount{}

	amount.Type = "ALMP"
	amount.Amt, _ = decimal.NewFromString(amountValue)
	amount.Currency = "VES"

	return amount
}
func GenerateAmountWithDecimal(amountValue decimal.Decimal) Amount {
	amount := Amount{}

	amount.Type = "ALMP"
	amount.Amt = amountValue
	amount.Currency = "VES"

	return amount
}

type NotificationURLs struct {
	WebHookEndpoint      string `json:"web_hook_endpoint"`
	SucessfulCallbackURL string `json:"sucessful_callback_url"`
	FailedCallbackURL    string `json:"failed_callback_url"`
	ReturnFrontEndURL    string `json:"return_front_end_url"`
}

func GenerateNotificationURLs() NotificationURLs {
	notificationURLs := NotificationURLs{}

	notificationURLs.WebHookEndpoint = config.GetConfig().SyPagoUser.WebHookEndpoint
	notificationURLs.SucessfulCallbackURL = config.GetConfig().SyPagoUser.SuccessUrl
	notificationURLs.FailedCallbackURL = config.GetConfig().SyPagoUser.FailedCallbackURL
	notificationURLs.ReturnFrontEndURL = config.GetConfig().SyPagoUser.SuccessUrl

	return notificationURLs
}

type PaymentRequest struct {
	InternalID       string           `json:"internal_id"`
	GroupID          string           `json:"group_id"`
	Account          AccountDetails   `json:"account"`
	Amount           Amount           `json:"amount"`
	Concept          string           `json:"concept"`
	NotificationURLs NotificationURLs `json:"notification_urls"`
}

func GeneratePaymentRequest(amountValue string) PaymentRequest {

	paymentRequest := PaymentRequest{}

	paymentRequest.InternalID = uuid.New().String()
	paymentRequest.GroupID = uuid.New().String()
	paymentRequest.Account = GenerateAccountDetails()
	paymentRequest.Amount = GenerateAmount(amountValue)
	paymentRequest.Concept = config.GetConfig().SyPagoUser.Concept
	paymentRequest.NotificationURLs = GenerateNotificationURLs()

	return paymentRequest
}

func GeneratePaymentRequestWithDecimal(amountValue decimal.Decimal) PaymentRequest {

	paymentRequest := PaymentRequest{}

	id := uuid.New().String()

	id = id[:12]

	paymentRequest.InternalID = id
	paymentRequest.GroupID = id
	paymentRequest.Account = GenerateAccountDetails()
	paymentRequest.Amount = GenerateAmountWithDecimal(amountValue)
	paymentRequest.Concept = config.GetConfig().SyPagoUser.Concept
	paymentRequest.NotificationURLs = GenerateNotificationURLs()

	return paymentRequest
}
