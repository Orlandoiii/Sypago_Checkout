package middlewares

import (
	"log"
	"os"
	"path"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

type StaticAssetsConfig struct {
	StaticPath      string
	URLPrefix       string
	IndexFile       string
	CacheMaxAge     int
	APIPrefix       string
	ExcludePrefixes []string
	AllowedExts     []string
	IsImageRepo     bool
}

func NewCheckoutWebAssetsConfig(staticPath string) StaticAssetsConfig {
	return StaticAssetsConfig{
		StaticPath:      staticPath,
		URLPrefix:       "/",
		IndexFile:       "index.html",
		CacheMaxAge:     3600, // 1 hour by default
		APIPrefix:       "/request-sypago",
		ExcludePrefixes: []string{"/request-sypago"},
		IsImageRepo:     false,
	}
}

func shouldExclude(path string, excludePrefixes []string) bool {
	if len(excludePrefixes) == 0 {
		return false
	}

	for _, prefix := range excludePrefixes {
		if prefix != "" && strings.HasPrefix(path, prefix) {
			return true
		}
	}

	return false
}

// Helper function to set cache headers based on file type and config
func setCacheHeaders(c *gin.Context, filePath string, maxAge int) {
	if strings.HasSuffix(filePath, ".html") {
		c.Header("Cache-Control", "no-cache, no-store, must-revalidate")
		c.Header("Pragma", "no-cache")
		c.Header("Expires", "0")
	} else {
		c.Header("Cache-Control", "public, max-age="+strconv.Itoa(maxAge))
		c.Header("Expires", time.Now().Add(time.Duration(maxAge)*time.Second).Format(time.RFC1123))
	}
}

func setContentTypeHeaders(c *gin.Context, filePath string) {
	ext := path.Ext(filePath)
	switch ext {
	case ".js":
		c.Header("Content-Type", "application/javascript")
	case ".css":
		c.Header("Content-Type", "text/css")
	case ".svg":
		c.Header("Content-Type", "image/svg+xml")
	case ".json":
		c.Header("Content-Type", "application/json")
	case ".jpg", ".jpeg":
		c.Header("Content-Type", "image/jpeg")
	case ".png":
		c.Header("Content-Type", "image/png")
	case ".gif":
		c.Header("Content-Type", "image/gif")
	case ".webp":
		c.Header("Content-Type", "image/webp")
	}
}

func fileExistsAndReadable(filePath string) (os.FileInfo, error) {
	fileInfo, err := os.Stat(filePath)
	if err != nil {
		return nil, err
	}

	file, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	file.Close()

	return fileInfo, nil
}

func isExtensionAllowed(filePath string, allowedExts []string) bool {
	if len(allowedExts) == 0 {
		return true
	}

	ext := strings.ToLower(path.Ext(filePath))
	if ext == "" {
		return true
	}

	for _, allowedExt := range allowedExts {
		if ext == allowedExt {
			return true
		}
	}

	return false
}

func ServeStaticAssets(config StaticAssetsConfig) gin.HandlerFunc {
	return func(c *gin.Context) {
		excludePrefixes := config.ExcludePrefixes
		if len(excludePrefixes) == 0 && config.APIPrefix != "" {
			excludePrefixes = []string{config.APIPrefix}
		}

		if shouldExclude(c.Request.URL.Path, excludePrefixes) {
			c.Next()
			return
		}

		if config.IsImageRepo && !strings.HasPrefix(c.Request.URL.Path, config.URLPrefix) {
			c.Next()
			return
		}

		requestPath := c.Request.URL.Path
		if config.URLPrefix != "/" {
			if !strings.HasPrefix(requestPath, config.URLPrefix) {
				c.Next()
				return
			}
			requestPath = strings.TrimPrefix(requestPath, config.URLPrefix)
		}

		if strings.Contains(requestPath, "..") {
			log.Println("Directory traversal attempt")
			c.Status(403)
			c.Abort()
			return
		}

		filePath := filepath.Join(config.StaticPath, requestPath)

		if config.IsImageRepo && !isExtensionAllowed(filePath, config.AllowedExts) {
			log.Println("File extension not allowed")
			c.Status(403)
			c.Abort()
			return
		}

		fileInfo, err := fileExistsAndReadable(filePath)
		if err == nil {
			if fileInfo.IsDir() && !config.IsImageRepo {
				filePath = filepath.Join(filePath, config.IndexFile)
				_, err = fileExistsAndReadable(filePath)
				if err != nil {
					log.Println("Failed to access index file")
					c.Next()
					return
				}
			} else if fileInfo.IsDir() && config.IsImageRepo {
				c.Status(403)
				c.Abort()
				return
			}

			setCacheHeaders(c, filePath, config.CacheMaxAge)
			setContentTypeHeaders(c, filePath)

			c.File(filePath)
			c.Abort()
			return
		}

		if !config.IsImageRepo {
			indexPath := filepath.Join(config.StaticPath, config.IndexFile)
			if _, err := fileExistsAndReadable(indexPath); err == nil {
				setCacheHeaders(c, indexPath, 0) // Don't cache index.html

				c.File(indexPath)
				c.Abort()
				return
			}

			log.Println("Index file not found")
		}

		c.Next()
	}
}
