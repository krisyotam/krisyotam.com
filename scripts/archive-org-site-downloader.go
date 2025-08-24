package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strings"

	"golang.org/x/net/html"
)

const (
	// Prefix for Wayback Machine snapshot
	waybackPrefix = "https://web.archive.org/web/20240714062650/"
	// Original site base URL
	siteBase      = "http://leurenmoret.info/"
	// Local output directory
	outputDir     = "leurenmoret-archive"
)

// visited tracks URLs already processed
var visited = map[string]bool{}

func main() {
	// Create root output directory
	if err := os.MkdirAll(outputDir, 0755); err != nil {
		log.Fatalf("Failed to create output directory: %v", err)
	}

	// Start crawling from the home page
	crawl(siteBase)
}

// crawl fetches a URL from the Wayback archive and saves it locally
func crawl(pageURL string) {
	if visited[pageURL] {
		return
	}
	visited[pageURL] = true

	archiveURL := waybackPrefix + pageURL
	resp, err := http.Get(archiveURL)
	if err != nil {
		log.Printf("Error fetching %s: %v", archiveURL, err)
		return
	}
	defer resp.Body.Close()

	// Prepare local file path
	u, err := url.Parse(pageURL)
	if err != nil {
		u = &url.URL{Path: pageURL}
	}
	localPath := u.Path
	// Default index if path is directory or empty
	if strings.HasSuffix(localPath, "/") || localPath == "" {
		localPath += "index.html"
	}
	savePath := filepath.Join(outputDir, localPath)
	if err := os.MkdirAll(filepath.Dir(savePath), 0755); err != nil {
		log.Printf("Failed to create dir for %s: %v", savePath, err)
	}

	// Save response body
	file, err := os.Create(savePath)
	if err != nil {
		log.Printf("Failed to create file %s: %v", savePath, err)
		return
	}
	defer file.Close()

	// Write content
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("Error reading %s: %v", archiveURL, err)
		return
	}
	if _, err := file.Write(body); err != nil {
		log.Printf("Error writing to %s: %v", savePath, err)
		return
	}

	// If HTML, parse and extract links
	contentType := resp.Header.Get("Content-Type")
	if strings.HasPrefix(contentType, "text/html") {
		doc, err := html.Parse(strings.NewReader(string(body)))
		if err != nil {
			log.Printf("Failed to parse HTML %s: %v", pageURL, err)
			return
		}
		visitLinks(doc, pageURL)
	}
}

// visitLinks traverses HTML nodes to find and handle URLs
func visitLinks(n *html.Node, base string) {
	if n.Type == html.ElementNode {
		var key string
		switch n.Data {
		case "a", "link":
			key = "href"
		case "img", "script":
			key = "src"
		}
		if key != "" {
			for _, attr := range n.Attr {
				if attr.Key == key {
					handleURL(attr.Val, base)
				}
			}
		}
	}
	for c := n.FirstChild; c != nil; c = c.NextSibling {
		visitLinks(c, base)
	}
}

// handleURL resolves and enqueues URLs under the original site domain
func handleURL(link, base string) {
	parsed, err := url.Parse(link)
	if err != nil || strings.HasPrefix(link, "javascript:") || strings.HasPrefix(link, "#") {
		return
	}
	abs := parsed
	if !parsed.IsAbs() {
		baseURL, _ := url.Parse(base)
		abs = baseURL.ResolveReference(parsed)
	}
	// Only process URLs under the original site
	if !strings.HasPrefix(abs.String(), siteBase) {
		return
	}
	crawl(abs.String())
}

// Print completion message
func init() {
	log.SetFlags(0)
	log.SetPrefix("")
}

func done() {
	fmt.Println("Download complete. Files saved in", outputDir)
}
