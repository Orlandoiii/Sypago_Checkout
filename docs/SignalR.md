# Resumen del ApiHub SignalR - SyPago

## Descripción General

El `ApiHub` es un hub de SignalR que proporciona una API en tiempo real para el procesamiento de transacciones de pago. Permite a los clientes conectarse de forma anónima y realizar operaciones como obtener transacciones, aceptar pagos, solicitar OTP y gestionar notificaciones.

## Métodos Disponibles

### 1. GetTransaction
**Descripción**: Obtiene una transacción por su ID y suscribe al cliente para recibir notificaciones.

**Parámetros**:
- `transactionId` (string): ID de la transacción

**Retorna**: `Result<CheckoutTransaction, string>`

**Ejemplo de uso en TypeScript**:
```typescript
const result = await connection.invoke("GetTransaction", "transaction-id-123");
```

**Ejemplo de uso en Go**:
```go
result, err := hub.Invoke("GetTransaction", "transaction-id-123")
```

### 2. GetTransactionBlueprint
**Descripción**: Obtiene una transacción blueprint por su ID.

**Parámetros**:
- `transactionId` (string): ID de la transacción blueprint

**Retorna**: `Result<CheckoutTransaction, string>`

**Ejemplo de uso en TypeScript**:
```typescript
const result = await connection.invoke("GetTransactionBlueprint", "blueprint-id-123");
```

**Ejemplo de uso en Go**:
```go
result, err := hub.Invoke("GetTransactionBlueprint", "blueprint-id-123")
```

### 3. GetAllBanks
**Descripción**: Obtiene la lista de todos los bancos disponibles que soportan OTP de débito.

**Parámetros**: Ninguno

**Retorna**: `Result<List<IBP>, string>`

**Ejemplo de uso en TypeScript**:
```typescript
const banks = await connection.invoke("GetAllBanks");
```

**Ejemplo de uso en Go**:
```go
banks, err := hub.Invoke("GetAllBanks")
```

### 4. GetAllRejectCodes
**Descripción**: Obtiene todos los códigos de rechazo disponibles.

**Parámetros**: Ninguno

**Retorna**: `Result<List<string>, string>`

**Ejemplo de uso en TypeScript**:
```typescript
const rejectCodes = await connection.invoke("GetAllRejectCodes");
```

**Ejemplo de uso en Go**:
```go
rejectCodes, err := hub.Invoke("GetAllRejectCodes")
```

### 5. AcceptLinkWithBlueprint
**Descripción**: Acepta un pago usando un blueprint con token de cuenta de usuario.

**Parámetros**:
- `transactionId` (string): ID de la transacción
- `payAmt` (decimal): Monto a pagar
- `receptUser` (UserOperation): Información del usuario receptor
- `userAccountToken` (string): Token de la cuenta del usuario

**Retorna**: `Result<AcceptError>`

**Ejemplo de uso en TypeScript**:
```typescript
const userOperation = {
    userId: "user123",
    nm: "Juan Pérez",
    id: "12345678",
    schema: "SCID",
    account: {
        tp: "CNTA",
        id: "00010174520100126130",
        bankCode: "0001",
        bankName: "Banco Venezuela",
        alias: "Mi Cuenta",
        isPreferAccount: true,
        isVerified: true
    },
    concept: "Pago de servicios",
    response: "Accepted",
    apiData: {
        clientdId: "client123"
    },
    emailOrPhone: "juan@email.com"
};

const result = await connection.invoke("AcceptLinkWithBlueprint", 
    "transaction-id", 100.50, userOperation, "account-token");
```

**Ejemplo de uso en Go**:
```go
type UserOperation struct {
    UserId         string            `json:"userId"`
    Nm             string            `json:"nm"`
    Id             string            `json:"id"`
    Schema         string            `json:"schema"`
    Account        AccountOperation  `json:"account"`
    Concept        string            `json:"concept"`
    Response       string            `json:"response"`
    ApiData        UserApiData       `json:"apiData"`
    EmailOrPhone   string            `json:"emailOrPhone"`
}

userOp := UserOperation{
    UserId: "user123",
    Nm:     "Juan Pérez",
    Id:     "12345678",
    Schema: "SCID",
    Account: AccountOperation{
        Tp:               "CNTA",
        Id:               "00010174520100126130",
        BankCode:         "0001",
        BankName:         "Banco Venezuela",
        Alias:            "Mi Cuenta",
        IsPreferAccount:  true,
        IsVerified:       true,
    },
    Concept:      "Pago de servicios",
    Response:     "Accepted",
    ApiData:      UserApiData{ClientdId: "client123"},
    EmailOrPhone: "juan@email.com",
}

result, err := hub.Invoke("AcceptLinkWithBlueprint", "transaction-id", 100.50, userOp, "account-token")
```

### 6. AcceptCheckoutTransactionExternal
**Descripción**: Acepta una transacción de checkout externa.

**Parámetros**:
- `transactionId` (string): ID de la transacción
- `payAmt` (decimal): Monto a pagar
- `receptUser` (UserOperation): Información del usuario receptor
- `userAccountToken` (string): Token de la cuenta del usuario

**Retorna**: `Result<AcceptError>`

### 7. AcceptCheckoutTransactionSypago
**Descripción**: Acepta una transacción de checkout de SyPago.

**Parámetros**:
- `transactionId` (string): ID de la transacción
- `payAmt` (decimal): Monto a pagar
- `receptUser` (UserOperation): Información del usuario receptor

**Retorna**: `Result<AcceptError>`

### 8. RequestOtp
**Descripción**: Solicita un código OTP para una transacción.

**Parámetros**:
- `transactionId` (string): ID de la transacción
- `payAmt` (decimal): Monto a pagar
- `receptUser` (UserOperation): Información del usuario receptor
- `receptDocumentType` (string): Tipo de documento del receptor

**Retorna**: `Result<string>`

**Ejemplo de uso en TypeScript**:
```typescript
const result = await connection.invoke("RequestOtp", 
    "transaction-id", 100.50, userOperation, "V");
```

**Ejemplo de uso en Go**:
```go
result, err := hub.Invoke("RequestOtp", "transaction-id", 100.50, userOp, "V")
```

### 9. RequestOtpBlueprint
**Descripción**: Solicita un código OTP para un blueprint.

**Parámetros**:
- `blueprintId` (string): ID del blueprint
- `payAmt` (decimal): Monto a pagar
- `receptUser` (UserOperation): Información del usuario receptor
- `receptDocumentType` (string): Tipo de documento del receptor

**Retorna**: `Result<string>`

### 10. SubscribeToTransactionNotifications
**Descripción**: Suscribe la conexión actual para recibir notificaciones de una transacción.

**Parámetros**:
- `transactionId` (string): ID de la transacción

**Retorna**: `IResult`

### 11. Ping
**Descripción**: Método de prueba de conectividad.

**Parámetros**: Ninguno

**Retorna**: `string` ("pong")

**Ejemplo de uso en TypeScript**:
```typescript
const response = await connection.invoke("Ping");
console.log(response); // "pong"
```

**Ejemplo de uso en Go**:
```go
response, err := hub.Invoke("Ping")
// response será "pong"
```

## Estructuras de Datos

### CheckoutTransaction (TypeScript)
```typescript
interface CheckoutTransaction {
    type: string;
    blueprint_id: string;
    transaction_id: string;
    end_to_end: string;
    sending_user: SendingUser;
    amount: AmountInfoCheckoutTransaction;
    concept: string;
    notification_urls: NotificationURLsInfo;
    receiving_user: ReceivingUserInfoInitRequest;
    status: string;
    rsn: string;
}

interface SendingUser {
    name: string;
    document_info: DocumentInfo;
}
```

### CheckoutTransaction (Go)
```go
type CheckoutTransaction struct {
    Type             string                        `json:"type"`
    BlueprintId      string                        `json:"blueprint_id"`
    TransactionId    string                        `json:"transaction_id"`
    EndToEndId       string                        `json:"end_to_end"`
    SendingUserInfo  SendingUser                   `json:"sending_user"`
    Amount           AmountInfoCheckoutTransaction `json:"amount"`
    Concept          string                        `json:"concept"`
    NotificationURLs NotificationURLsInfo          `json:"notification_urls"`
    ReceivingUser    ReceivingUserInfoInitRequest  `json:"receiving_user"`
    Status           string                        `json:"status"`
    Rsn              string                        `json:"rsn"`
}

type SendingUser struct {
    Name     string       `json:"name"`
    Document DocumentInfo `json:"document_info"`
}
```

### UserOperation (TypeScript)
```typescript
interface UserOperation {
    userId: string;
    nm: string;
    id: string;
    schema: "SCID" | "SRIF" | "SPAS";
    account: AccountOperation;
    concept: string;
    response: "Accepted" | "Rejected";
    apiData: UserApiData;
    emailOrPhone: string;
}

interface AccountOperation {
    tp: "CNTA" | "CELE" | "ALIS";
    id: string;
    bankCode: string;
    bankName: string;
    alias: string;
    isPreferAccount: boolean;
    isVerified: boolean;
}

interface UserApiData {
    clientdId: string;
}
```

### UserOperation (Go)
```go
type UserOperation struct {
    UserId         string            `json:"userId"`
    Nm             string            `json:"nm"`
    Id             string            `json:"id"`
    Schema         string            `json:"schema"` // "SCID", "SRIF", "SPAS"
    Account        AccountOperation  `json:"account"`
    Concept        string            `json:"concept"`
    Response       string            `json:"response"` // "Accepted", "Rejected"
    ApiData        UserApiData       `json:"apiData"`
    EmailOrPhone   string            `json:"emailOrPhone"`
}

type AccountOperation struct {
    Tp               string `json:"tp"`               // "CNTA", "CELE", "ALIS"
    Id               string `json:"id"`
    BankCode         string `json:"bankCode"`
    BankName         string `json:"bankName"`
    Alias            string `json:"alias"`
    IsPreferAccount  bool   `json:"isPreferAccount"`
    IsVerified       bool   `json:"isVerified"`
}

type UserApiData struct {
    ClientdId string `json:"clientdId"`
}
```

### DocumentInfo (TypeScript)
```typescript
interface DocumentInfo {
    type: "V" | "E" | "G" | "J" | "R" | "C" | "P";
    number: string;
}
```

### DocumentInfo (Go)
```go
type DocumentInfo struct {
    Type   string `json:"type"`   // "V", "E", "G", "J", "R", "C", "P"
    Number string `json:"number"`
}
```

### AccountInfo (TypeScript)
```typescript
interface AccountInfo {
    bank_code: string;
    type: "CNTA" | "CELE";
    number: string;
}
```

### AccountInfo (Go)
```go
type AccountInfo struct {
    BankCode string `json:"bank_code"`
    Type     string `json:"type"`   // "CNTA", "CELE"
    Number   string `json:"number"`
}
```

### AmountInfoCheckoutTransaction (TypeScript)
```typescript
interface AmountInfoCheckoutTransaction {
    type: string;
    amt: number;
    currency: string;
    min_allow_amt: number;
    max_allow_amt: number;
    use_day_rate: boolean;
    rate: number;
    pay_amt: number;
    original_amt: number;
    original_currency: string;
}
```

### AmountInfoCheckoutTransaction (Go)
```go
type AmountInfoCheckoutTransaction struct {
    Type             string  `json:"type"`
    Amt              float64 `json:"amt"`
    Currency         string  `json:"currency"`
    MinAllowAmt      float64 `json:"min_allow_amt"`
    MaxAllowAmt      float64 `json:"max_allow_amt"`
    UseDayRate       bool    `json:"use_day_rate"`
    Rate             float64 `json:"rate"`
    PayAmt           float64 `json:"pay_amt"`
    OriginalAmt      float64 `json:"original_amt"`
    OriginalCurrency string  `json:"original_currency"`
}
```

### NotificationURLsInfo (TypeScript)
```typescript
interface NotificationURLsInfo {
    sucessful_callback_url: string;
    failed_callback_url: string;
    return_front_end_url: string;
    web_hook_endpoint: string;
}
```

### NotificationURLsInfo (Go)
```go
type NotificationURLsInfo struct {
    SucessfulCallbackUrl    string `json:"sucessful_callback_url"`
    FailedCallbackUrl       string `json:"failed_callback_url"`
    ReturnFrontEndUrl       string `json:"return_front_end_url"`
    NotificationEndpointUrl string `json:"web_hook_endpoint"`
}
```

### ReceivingUserInfoInitRequest (TypeScript)
```typescript
interface ReceivingUserInfoInitRequest {
    name: string;
    document_info: DocumentInfo;
    account: AccountInfo;
}
```

### ReceivingUserInfoInitRequest (Go)
```go
type ReceivingUserInfoInitRequest struct {
    Name     string       `json:"name"`
    Document DocumentInfo `json:"document_info"`
    Account  AccountInfo  `json:"account"`
}
```

### IBP (Banco) (TypeScript)
```typescript
interface IBP {
    code: string;
    name: string;
    active: boolean;
    sypagoClient: boolean;
    enableTransitionAccount: boolean;
    verifyType: string;
    isSmsOtp: boolean;
    smsOtpAddress: string;
    smsOtpText: string;
    isDebitOTP: boolean;
}
```

### IBP (Banco) (Go)
```go
type IBP struct {
    Code                    string `json:"code"`
    Name                    string `json:"name"`
    Active                  bool   `json:"active"`
    SypagoClient            bool   `json:"sypagoClient"`
    EnableTransitionAccount bool   `json:"enableTransitionAccount"`
    VerifyType              string `json:"verifyType"`
    IsSmsOtp                bool   `json:"isSmsOtp"`
    SmsOtpAddress           string `json:"smsOtpAddress"`
    SmsOtpText              string `json:"smsOtpText"`
    IsDebitOTP              bool   `json:"isDebitOTP"`
}
```

### AcceptError (TypeScript)
```typescript
interface AcceptError {
    message: string;
    errorType: "Unknow" | "RateChange" | "FormatErr";
    associateException?: any;
}
```

### AcceptError (Go)
```go
type AcceptError struct {
    Message             string      `json:"message"`
    ErrorType           string      `json:"errorType"` // "Unknow", "RateChange", "FormatErr"
    AssociateException  interface{} `json:"associateException,omitempty"`
}
```

### Result<T, E> (TypeScript)
```typescript
interface Result<T, E = string> {
    isSuccessful: boolean;
    value?: T;
    err?: E;
}
```

### Result<T, E> (Go)
```go
type Result[T any, E any] struct {
    IsSuccessful bool `json:"isSuccessful"`
    Value        *T   `json:"value,omitempty"`
    Err          *E   `json:"err,omitempty"`
}
```

## Validaciones Importantes

### Validaciones de UserOperation
- **UserId**: Requerido
- **Id**: Requerido (número de documento)
- **Nm**: Entre 1 y 140 caracteres
- **Concept**: Entre 1 y 2400 caracteres
- **Account.Id**: Para CNTA debe ser 20 dígitos, para CELE debe ser teléfono válido venezolano
- **Account.BankCode**: Debe ser 4 dígitos
- **Account.Tp**: Solo "CNTA", "CELE", "ALIS"

### Validaciones de AccountInfo
- **BankCode**: 4 dígitos requeridos
- **Type**: Solo "CNTA" o "CELE"
- **Number**: Para CNTA 20 dígitos, para CELE teléfono venezolano válido
- Para CNTA: El número debe comenzar con el código del banco

### Validaciones de DocumentInfo
- **Type**: Solo "V", "E", "G", "J", "R", "C", "P"
- **Number**: Requerido

### Validaciones de Montos
- **Amt**: Debe ser mayor que 0, máximo 2 decimales
- **Currency**: Solo "VES", "USD", "EUR"

## Notas de Implementación

1. **Conexión Anónima**: El hub permite conexiones anónimas (`[AllowAnonymous]`)
2. **Logging**: Utiliza NLog para registro de eventos
3. **Cache**: Utiliza IMemoryCache para almacenar claves simétricas
4. **Validación**: Utiliza FluentValidation para validar estructuras de datos
5. **Serialización**: Utiliza System.Text.Json con JsonPropertyName para mapear propiedades
6. **Manejo de Errores**: Retorna objetos Result con información de éxito/error

## Eventos de Conexión

El hub maneja automáticamente:
- **OnConnectedAsync**: Se ejecuta cuando un cliente se conecta
- **OnDisconnectedAsync**: Se ejecuta cuando un cliente se desconecta

Ambos eventos registran información de debug con el ConnectionId del cliente.
