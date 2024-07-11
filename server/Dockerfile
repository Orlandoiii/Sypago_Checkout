# Stage 1: Build the Go binary
FROM golang:1.22.3-alpine AS builder

# Set necessary environment variables for Go
ENV CGO_ENABLED=0
ENV GOOS=linux
ENV GOARCH=amd64

# Create a working directory
WORKDIR /app

# Copy go.mod and go.sum files for dependency resolution
COPY go.mod go.sum ./

# Download dependencies (ensures they are cached)
RUN go mod download

# Copy the rest of the source code
COPY . .

# Build the Go binary (replace "sypago_checkout_server" with your actual main package)
RUN go build -o sypago_checkout_server

# Stage 2: Create the final runtime image
FROM alpine:latest

# Set working directory
WORKDIR /app

# Copy the binary from the builder stage
COPY --from=builder /app/sypago_checkout_server .
COPY config/appsettings.json /app/config/appsettings.json 

# (Optional) Copy any static files or configuration if needed
# COPY public ./public
# COPY config.json ./config.json

# Expose the port your server listens on (replace with your actual port)
EXPOSE 3000

# Define the command to run your application
CMD ["./sypago_checkout_server"]