// -----------------------------------------------------------------------------
// Module:        URLArchiverV1
// Description:   Scan MDX and JSON files for URLs and archive them via multiple archival services
// Author:        Kris Yotam
// Created:       2025-04-23
// Last Modified: 2025-04-23 17:00:00 (America/Chicago)
// License:       CC-0
// 
// Dependencies:
//   • Standard library: fmt, os, io/fs, path/filepath, encoding/json, net/http, context, time, sync
//   • Third-party modules:
//       – github.com/yuin/goldmark v1.5.4        // Optional: markdown to HTML if needed
//       – github.com/PuerkitoBio/goquery v1.8.0  // Optional: HTML querying
//       – golang.org/x/sync/errgroup v0.1.0     // concurrency helpers
// 
// Usage:
//   $ go build -o bin/urlarchiverv1 ./cmd/urlarchiverv1
//   $ ./bin/urlarchiverv1 -contentDir=app/blog -dataDir=data/feed.json -report=archives_report.txt
// 
// Flags:
//   -contentDir    string   // root directory of MDX/JSON files (e.g., "app/blog")
//   -dataFeed      string   // path to feed.json containing slugs
//   -report        string   // output report file for archived URLs
//   -concurrency   int      // max parallel HTTP/archive requests (default 20)
// -----------------------------------------------------------------------------

package main

import (
    "context"
    "encoding/json"
    "flag"
    "fmt"
    "io/fs"
    "log"
    "net/http"
    "os"
    "path/filepath"
    "regexp"
    "sync"
    "time"

    "golang.org/x/sync/errgroup"
)

type FeedEntry struct {
    Slug string `json:"slug"`
}

type ArchiveResult struct {
    URL       string
    Service   string
    Archived  bool
    Error     error
}

func main() {
    var contentDir, feedPath, reportPath string
    var concurrency int
    flag.StringVar(&contentDir, "contentDir", "app/blog", "root directory of MDX/JSON files")
    flag.StringVar(&feedPath, "dataFeed", "data/feed.json", "path to feed.json containing slugs")
    flag.StringVar(&reportPath, "report", "archives_report.txt", "output report file")
    flag.IntVar(&concurrency, "concurrency", 20, "max parallel requests")
    flag.Parse()

    slugs, err := loadSlugs(feedPath)
    if err != nil {
        log.Fatalf("Failed to load feed: %v", err)
    }

    // Collect files to scan
    paths := collectPaths(contentDir, slugs)

    // Extract URLs
    urls := extractURLs(paths)

    // Archive URLs
    results := archiveURLs(urls, concurrency)

    // Write report
    writeReport(reportPath, results)
    fmt.Printf("Archive run complete. Report: %s\n", reportPath)
}

func loadSlugs(feedPath string) ([]string, error) {
    data, err := os.ReadFile(feedPath)
    if err != nil {
        return nil, err
    }
    var entries []FeedEntry
    if err := json.Unmarshal(data, &entries); err != nil {
        return nil, err
    }
    slugs := make([]string, len(entries))
    for i, e := range entries {
        slugs[i] = e.Slug
    }
    return slugs, nil
}

func collectPaths(root string, slugs []string) []string {
    var paths []string
    // Always include MDX and optional JSON in root
    for _, slug := range slugs {
        // assume path app/blog/YYYY/slug
        // so walk root/*/slug
        glob := filepath.Join(root, "*", slug)
        dirs, _ := filepath.Glob(glob)
        for _, dir := range dirs {
            for _, fname := range []string{"page.mdx", "bibliography.json", "margin-notes.json"} {
                fp := filepath.Join(dir, fname)
                if _, err := os.Stat(fp); err == nil {
                    paths = append(paths, fp)
                }
            }
        }
    }
    return paths
}

var urlRegex = regexp.MustCompile(`https?://[^\s"')>]+`)

func extractURLs(files []string) []string {
    urlSet := make(map[string]struct{})
    for _, f := range files {
        data, err := os.ReadFile(f)
        if err != nil {
            log.Printf("Read error %s: %v", f, err)
            continue
        }
        matches := urlRegex.FindAllString(string(data), -1)
        for _, u := range matches {
            urlSet[u] = struct{}{}
        }
    }
    urls := make([]string, 0, len(urlSet))
    for u := range urlSet {
        urls = append(urls, u)
    }
    return urls
}

func archiveURLs(urls []string, concurrency int) []ArchiveResult {
    eg, _ := errgroup.WithContext(context.Background())
    sem := make(chan struct{}, concurrency)
    var mu sync.Mutex
    results := make([]ArchiveResult, 0, len(urls))

    for _, u := range urls {
        u := u
        sem <- struct{}{}
        eg.Go(func() error {
            defer func() { <-sem }()
            // example: archive.org Save Page Now API
            archived, err := savePageNow(u)
            mu.Lock()
            results = append(results, ArchiveResult{URL: u, Service: "archive.org", Archived: archived, Error: err})
            mu.Unlock()
            return nil
        })
    }
    eg.Wait()
    return results
}

func savePageNow(url string) (bool, error) {
    api := "https://web.archive.org/save/" + url
    client := http.Client{Timeout: 30 * time.Second}
    resp, err := client.Get(api)
    if err != nil {
        return false, err
    }
    defer resp.Body.Close()
    return resp.StatusCode == http.StatusOK || resp.StatusCode == http.StatusCreated, nil
}

func writeReport(path string, results []ArchiveResult) {
    f, err := os.Create(path)
    if err != nil {
        log.Fatalf("Report create error: %v", err)
    }
    defer f.Close()
    for _, r := range results {
        line := fmt.Sprintf("%s [%s] archived=%t error=%v\n", r.URL, r.Service, r.Archived, r.Error)
        f.WriteString(line)
    }
}
