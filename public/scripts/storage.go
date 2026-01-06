// ============================================================================
// Storage Database CLI Tool
// Author: Kris Yotam
// Date: 2026-01-04
// Filename: storage.go
// Description: CLI tool for migrating and querying object storage listings
//              from JSON files into SQLite database (storage.db).
// ============================================================================

package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	_ "github.com/mattn/go-sqlite3"
)

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

// StorageObject represents a single object in object storage
type StorageObject struct {
	Bucket       string `json:"bucket"`
	Key          string `json:"key"`
	Size         int64  `json:"size"`
	LastModified string `json:"last_modified"`
	OriginalURL  string `json:"original_url"`
	PublicURL    string `json:"public_url"`
}

// Bucket represents a storage bucket with its objects
type Bucket struct {
	Name    string          `json:"name"`
	Objects []StorageObject `json:"objects"`
}

// StorageData represents the root structure of the JSON files
type StorageData struct {
	Buckets []Bucket `json:"buckets"`
}

// ============================================================================
// DATABASE INITIALIZATION
// ============================================================================

func initDatabase(db *sql.DB, dataDir string) error {
	// Try multiple schema paths
	schemaPaths := []string{
		filepath.Join(dataDir, "..", "scripts", "storage-schema.sql"),
		filepath.Join(".", "storage-schema.sql"),
		filepath.Join("..", "scripts", "storage-schema.sql"),
		"storage-schema.sql",
	}

	var schemaSQL []byte
	var err error
	var foundPath string

	for _, path := range schemaPaths {
		schemaSQL, err = os.ReadFile(path)
		if err == nil {
			foundPath = path
			break
		}
	}

	if schemaSQL == nil {
		return fmt.Errorf("could not find storage-schema.sql in any of: %v", schemaPaths)
	}

	fmt.Printf("Using schema from: %s\n", foundPath)

	_, err = db.Exec(string(schemaSQL))
	if err != nil {
		return fmt.Errorf("failed to execute schema: %w", err)
	}

	return nil
}

// ============================================================================
// DATA LOADING
// ============================================================================

func loadStorageJSON(filePath string) (*StorageData, error) {
	data, err := os.ReadFile(filePath)
	if err != nil {
		return nil, fmt.Errorf("failed to read file %s: %w", filePath, err)
	}

	var storage StorageData
	if err := json.Unmarshal(data, &storage); err != nil {
		return nil, fmt.Errorf("failed to parse JSON from %s: %w", filePath, err)
	}

	return &storage, nil
}

// ============================================================================
// MIGRATION FUNCTIONS
// ============================================================================

func migrateStorageData(db *sql.DB, dataDir string) error {
	// JSON files to migrate
	jsonFiles := []string{
		"doc/doc.json",
		"doc/src.json",
		"doc/archive.json",
	}

	totalObjects := 0

	for _, relPath := range jsonFiles {
		filePath := filepath.Join(dataDir, relPath)

		if _, err := os.Stat(filePath); os.IsNotExist(err) {
			fmt.Printf("Skipping %s (file not found)\n", relPath)
			continue
		}

		storage, err := loadStorageJSON(filePath)
		if err != nil {
			return fmt.Errorf("failed to load %s: %w", relPath, err)
		}

		for _, bucket := range storage.Buckets {
			// Insert bucket
			bucketID, err := insertBucket(db, bucket.Name)
			if err != nil {
				return fmt.Errorf("failed to insert bucket %s: %w", bucket.Name, err)
			}

			// Insert objects
			for _, obj := range bucket.Objects {
				err := insertObject(db, bucketID, bucket.Name, obj)
				if err != nil {
					// Skip duplicates silently
					if strings.Contains(err.Error(), "UNIQUE constraint") {
						continue
					}
					return fmt.Errorf("failed to insert object %s/%s: %w", bucket.Name, obj.Key, err)
				}
				totalObjects++
			}

			fmt.Printf("Migrated bucket '%s' from %s (%d objects)\n", bucket.Name, relPath, len(bucket.Objects))
		}
	}

	fmt.Printf("\nTotal objects migrated: %d\n", totalObjects)
	return nil
}

func insertBucket(db *sql.DB, name string) (int64, error) {
	// Try to insert, ignore if exists
	_, err := db.Exec(`INSERT OR IGNORE INTO buckets (name) VALUES (?)`, name)
	if err != nil {
		return 0, err
	}

	// Get the bucket ID
	var id int64
	err = db.QueryRow(`SELECT id FROM buckets WHERE name = ?`, name).Scan(&id)
	if err != nil {
		return 0, err
	}

	return id, nil
}

func insertObject(db *sql.DB, bucketID int64, bucketName string, obj StorageObject) error {
	_, err := db.Exec(`
		INSERT INTO objects (bucket_id, bucket_name, key, size, last_modified, original_url, public_url)
		VALUES (?, ?, ?, ?, ?, ?, ?)
	`, bucketID, bucketName, obj.Key, obj.Size, obj.LastModified, obj.OriginalURL, obj.PublicURL)
	return err
}

// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

func listBuckets(db *sql.DB) error {
	rows, err := db.Query(`
		SELECT b.name, COUNT(o.id) as object_count, COALESCE(SUM(o.size), 0) as total_size
		FROM buckets b
		LEFT JOIN objects o ON b.id = o.bucket_id
		GROUP BY b.id
		ORDER BY b.name
	`)
	if err != nil {
		return err
	}
	defer rows.Close()

	fmt.Println("\n=== Buckets ===")
	fmt.Printf("%-20s %10s %15s\n", "Name", "Objects", "Total Size")
	fmt.Println(strings.Repeat("-", 50))

	for rows.Next() {
		var name string
		var objectCount int
		var totalSize int64
		if err := rows.Scan(&name, &objectCount, &totalSize); err != nil {
			return err
		}
		fmt.Printf("%-20s %10d %15s\n", name, objectCount, formatSize(totalSize))
	}

	return nil
}

func listObjects(db *sql.DB, bucketName string, limit int) error {
	query := `
		SELECT key, size, last_modified, public_url
		FROM objects
		WHERE bucket_name = ?
		ORDER BY key
		LIMIT ?
	`

	rows, err := db.Query(query, bucketName, limit)
	if err != nil {
		return err
	}
	defer rows.Close()

	fmt.Printf("\n=== Objects in '%s' (first %d) ===\n", bucketName, limit)
	fmt.Printf("%-60s %12s %25s\n", "Key", "Size", "Last Modified")
	fmt.Println(strings.Repeat("-", 100))

	for rows.Next() {
		var key string
		var size int64
		var lastModified, publicURL sql.NullString
		if err := rows.Scan(&key, &size, &lastModified, &publicURL); err != nil {
			return err
		}

		keyDisplay := key
		if len(keyDisplay) > 57 {
			keyDisplay = "..." + keyDisplay[len(keyDisplay)-54:]
		}

		modified := ""
		if lastModified.Valid {
			modified = lastModified.String[:19]
		}

		fmt.Printf("%-60s %12s %25s\n", keyDisplay, formatSize(size), modified)
	}

	return nil
}

func searchObjects(db *sql.DB, pattern string) error {
	rows, err := db.Query(`
		SELECT bucket_name, key, size, public_url
		FROM objects
		WHERE key LIKE ?
		ORDER BY bucket_name, key
		LIMIT 50
	`, "%"+pattern+"%")
	if err != nil {
		return err
	}
	defer rows.Close()

	fmt.Printf("\n=== Search Results for '%s' ===\n", pattern)
	fmt.Printf("%-15s %-55s %12s\n", "Bucket", "Key", "Size")
	fmt.Println(strings.Repeat("-", 85))

	count := 0
	for rows.Next() {
		var bucketName, key string
		var size int64
		var publicURL sql.NullString
		if err := rows.Scan(&bucketName, &key, &size, &publicURL); err != nil {
			return err
		}

		keyDisplay := key
		if len(keyDisplay) > 52 {
			keyDisplay = "..." + keyDisplay[len(keyDisplay)-49:]
		}

		fmt.Printf("%-15s %-55s %12s\n", bucketName, keyDisplay, formatSize(size))
		count++
	}

	fmt.Printf("\nFound %d matching objects\n", count)
	return nil
}

func getStats(db *sql.DB) error {
	var bucketCount, objectCount int
	var totalSize int64

	err := db.QueryRow(`SELECT COUNT(*) FROM buckets`).Scan(&bucketCount)
	if err != nil {
		return err
	}

	err = db.QueryRow(`SELECT COUNT(*), COALESCE(SUM(size), 0) FROM objects`).Scan(&objectCount, &totalSize)
	if err != nil {
		return err
	}

	fmt.Println("\n=== Database Statistics ===")
	fmt.Printf("Buckets:      %d\n", bucketCount)
	fmt.Printf("Objects:      %d\n", objectCount)
	fmt.Printf("Total Size:   %s\n", formatSize(totalSize))

	return nil
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

func formatSize(bytes int64) string {
	if bytes == 0 {
		return "0 B"
	}

	units := []string{"B", "KB", "MB", "GB", "TB"}
	size := float64(bytes)
	unitIndex := 0

	for size >= 1024 && unitIndex < len(units)-1 {
		size /= 1024
		unitIndex++
	}

	if size >= 10 {
		return fmt.Sprintf("%.0f %s", size, units[unitIndex])
	}
	return fmt.Sprintf("%.1f %s", size, units[unitIndex])
}

func findDataDir() (string, error) {
	// Try multiple possible data directory paths
	paths := []string{
		filepath.Join("..", "data"),
		filepath.Join(".", "data"),
		"data",
		filepath.Join("..", "..", "data"),
	}

	cwd, _ := os.Getwd()

	// Also try from the cwd parent
	if cwd != "" {
		paths = append([]string{
			filepath.Join(cwd, "..", "data"),
			filepath.Join(cwd, "data"),
		}, paths...)
	}

	for _, p := range paths {
		if info, err := os.Stat(p); err == nil && info.IsDir() {
			absPath, _ := filepath.Abs(p)
			return absPath, nil
		}
	}

	return "", fmt.Errorf("could not find data directory in any of: %v", paths)
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

func main() {
	if len(os.Args) < 2 {
		printUsage()
		os.Exit(1)
	}

	command := os.Args[1]

	// Find data directory
	dataDir, err := findDataDir()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}

	dbPath := filepath.Join(dataDir, "storage.db")

	// Open database
	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed to open database: %v\n", err)
		os.Exit(1)
	}
	defer db.Close()

	switch command {
	case "migrate":
		fmt.Printf("Migrating storage data to %s...\n", dbPath)

		if err := initDatabase(db, dataDir); err != nil {
			fmt.Fprintf(os.Stderr, "Failed to initialize database: %v\n", err)
			os.Exit(1)
		}

		if err := migrateStorageData(db, dataDir); err != nil {
			fmt.Fprintf(os.Stderr, "Migration failed: %v\n", err)
			os.Exit(1)
		}

		fmt.Println("\nMigration completed successfully!")

	case "buckets":
		if err := listBuckets(db); err != nil {
			fmt.Fprintf(os.Stderr, "Error: %v\n", err)
			os.Exit(1)
		}

	case "objects":
		if len(os.Args) < 3 {
			fmt.Fprintln(os.Stderr, "Usage: storage objects <bucket_name> [limit]")
			os.Exit(1)
		}
		limit := 50
		if len(os.Args) >= 4 {
			fmt.Sscanf(os.Args[3], "%d", &limit)
		}
		if err := listObjects(db, os.Args[2], limit); err != nil {
			fmt.Fprintf(os.Stderr, "Error: %v\n", err)
			os.Exit(1)
		}

	case "search":
		if len(os.Args) < 3 {
			fmt.Fprintln(os.Stderr, "Usage: storage search <pattern>")
			os.Exit(1)
		}
		if err := searchObjects(db, os.Args[2]); err != nil {
			fmt.Fprintf(os.Stderr, "Error: %v\n", err)
			os.Exit(1)
		}

	case "stats":
		if err := getStats(db); err != nil {
			fmt.Fprintf(os.Stderr, "Error: %v\n", err)
			os.Exit(1)
		}

	default:
		printUsage()
		os.Exit(1)
	}
}

func printUsage() {
	fmt.Println(`
Storage Database CLI Tool
Author: Kris Yotam

Usage: go run storage.go <command> [args]

Commands:
  migrate              Migrate JSON files to SQLite database
  buckets              List all buckets with object counts
  objects <bucket>     List objects in a bucket (default: first 50)
  search <pattern>     Search for objects by key pattern
  stats                Show database statistics

Examples:
  go run storage.go migrate
  go run storage.go buckets
  go run storage.go objects doc
  go run storage.go objects src 100
  go run storage.go search pdf
  go run storage.go stats
`)
}
