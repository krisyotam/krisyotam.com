// ============================================================================
// System Database CLI Tool
// ============================================================================
// Author: Kris Yotam
// Description: CLI tool for querying system.db SQLite database
// Created: 2026-01-04
//
// Usage:
//   go run system.go <command> [options]
//
// Commands:
//   blogroll [--category <cat>]  List all blogroll entries
//   changelog [--feed <feed>]    List changelog entries (content/infra)
//   til [--category <cat>]       List TIL entries
//   now                          List Now entries
//   words                        List all words
//   stats                        Show database statistics
//   categories                   List all categories
//   tags                         List all tags
// ============================================================================

package main

import (
	"database/sql"
	"flag"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	_ "github.com/mattn/go-sqlite3"
)

// ============================================================================
// Database Connection
// ============================================================================

func getDbPath() string {
	// Get the directory of the current executable or script
	execPath, err := os.Getwd()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error getting working directory: %v\n", err)
		os.Exit(1)
	}

	// Try to find the data directory
	dbPath := filepath.Join(execPath, "..", "data", "system.db")
	if _, err := os.Stat(dbPath); os.IsNotExist(err) {
		// Try current directory
		dbPath = filepath.Join(execPath, "data", "system.db")
	}

	return dbPath
}

func openDb() (*sql.DB, error) {
	dbPath := getDbPath()
	return sql.Open("sqlite3", dbPath+"?mode=ro")
}

// ============================================================================
// Blogroll Commands
// ============================================================================

func listBlogroll(category string) {
	db, err := openDb()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error opening database: %v\n", err)
		os.Exit(1)
	}
	defer db.Close()

	var query string
	var rows *sql.Rows

	if category != "" {
		query = `SELECT id, title, url, category, slug FROM blogroll WHERE category = ? ORDER BY title ASC`
		rows, err = db.Query(query, category)
	} else {
		query = `SELECT id, title, url, category, slug FROM blogroll ORDER BY title ASC`
		rows, err = db.Query(query)
	}

	if err != nil {
		fmt.Fprintf(os.Stderr, "Error querying blogroll: %v\n", err)
		os.Exit(1)
	}
	defer rows.Close()

	fmt.Println("\n╔════════════════════════════════════════════════════════════════════════════╗")
	fmt.Println("║                              BLOGROLL                                       ║")
	fmt.Println("╠════════════════════════════════════════════════════════════════════════════╣")

	count := 0
	for rows.Next() {
		var id int
		var title, url, cat, slug string
		if err := rows.Scan(&id, &title, &url, &cat, &slug); err != nil {
			fmt.Fprintf(os.Stderr, "Error scanning row: %v\n", err)
			continue
		}
		truncatedUrl := url
		if len(truncatedUrl) > 40 {
			truncatedUrl = truncatedUrl[:37] + "..."
		}
		fmt.Printf("║ %-30s │ %-40s ║\n", truncate(title, 30), truncatedUrl)
		count++
	}

	fmt.Println("╠════════════════════════════════════════════════════════════════════════════╣")
	fmt.Printf("║ Total: %-69d ║\n", count)
	fmt.Println("╚════════════════════════════════════════════════════════════════════════════╝")
}

// ============================================================================
// Changelog Commands
// ============================================================================

func listChangelog(feed string) {
	db, err := openDb()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error opening database: %v\n", err)
		os.Exit(1)
	}
	defer db.Close()

	table := "changelog_content"
	if feed == "infra" {
		table = "changelog_infra"
	}

	query := fmt.Sprintf(`SELECT id, day, weekday, month, year, text, kind FROM %s ORDER BY year DESC, month DESC, day DESC`, table)
	rows, err := db.Query(query)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error querying changelog: %v\n", err)
		os.Exit(1)
	}
	defer rows.Close()

	feedName := "CONTENT"
	if feed == "infra" {
		feedName = "INFRA"
	}

	fmt.Printf("\n╔════════════════════════════════════════════════════════════════════════════╗\n")
	fmt.Printf("║                         CHANGELOG (%s)                               ║\n", feedName)
	fmt.Println("╠════════════════════════════════════════════════════════════════════════════╣")

	count := 0
	for rows.Next() {
		var id, day, weekday, month, year, text string
		var kind sql.NullString
		if err := rows.Scan(&id, &day, &weekday, &month, &year, &text, &kind); err != nil {
			fmt.Fprintf(os.Stderr, "Error scanning row: %v\n", err)
			continue
		}
		date := fmt.Sprintf("%s %s, %s", month, day, year)
		kindStr := ""
		if kind.Valid {
			kindStr = fmt.Sprintf("[%s]", kind.String)
		}
		fmt.Printf("║ %-15s │ %-10s │ %-45s ║\n", date, kindStr, truncate(text, 45))
		count++
	}

	fmt.Println("╠════════════════════════════════════════════════════════════════════════════╣")
	fmt.Printf("║ Total: %-69d ║\n", count)
	fmt.Println("╚════════════════════════════════════════════════════════════════════════════╝")
}

// ============================================================================
// TIL Commands
// ============================================================================

func listTil(category string) {
	db, err := openDb()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error opening database: %v\n", err)
		os.Exit(1)
	}
	defer db.Close()

	var query string
	var rows *sql.Rows

	if category != "" {
		query = `SELECT id, title, date, category, slug FROM til WHERE category = ? ORDER BY date DESC`
		rows, err = db.Query(query, category)
	} else {
		query = `SELECT id, title, date, category, slug FROM til ORDER BY date DESC`
		rows, err = db.Query(query)
	}

	if err != nil {
		fmt.Fprintf(os.Stderr, "Error querying TIL: %v\n", err)
		os.Exit(1)
	}
	defer rows.Close()

	fmt.Println("\n╔════════════════════════════════════════════════════════════════════════════╗")
	fmt.Println("║                          TODAY I LEARNED                                    ║")
	fmt.Println("╠════════════════════════════════════════════════════════════════════════════╣")

	count := 0
	for rows.Next() {
		var id int
		var title, category, slug string
		var date sql.NullString
		if err := rows.Scan(&id, &title, &date, &category, &slug); err != nil {
			fmt.Fprintf(os.Stderr, "Error scanning row: %v\n", err)
			continue
		}
		dateStr := ""
		if date.Valid {
			dateStr = date.String
		}
		fmt.Printf("║ %-12s │ %-15s │ %-43s ║\n", dateStr, truncate(category, 15), truncate(title, 43))
		count++
	}

	fmt.Println("╠════════════════════════════════════════════════════════════════════════════╣")
	fmt.Printf("║ Total: %-69d ║\n", count)
	fmt.Println("╚════════════════════════════════════════════════════════════════════════════╝")
}

// ============================================================================
// Now Commands
// ============================================================================

func listNow() {
	db, err := openDb()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error opening database: %v\n", err)
		os.Exit(1)
	}
	defer db.Close()

	query := `SELECT id, title, date, category, slug FROM now ORDER BY date DESC`
	rows, err := db.Query(query)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error querying Now: %v\n", err)
		os.Exit(1)
	}
	defer rows.Close()

	fmt.Println("\n╔════════════════════════════════════════════════════════════════════════════╗")
	fmt.Println("║                                 NOW                                         ║")
	fmt.Println("╠════════════════════════════════════════════════════════════════════════════╣")

	count := 0
	for rows.Next() {
		var id int
		var title, category, slug string
		var date sql.NullString
		if err := rows.Scan(&id, &title, &date, &category, &slug); err != nil {
			fmt.Fprintf(os.Stderr, "Error scanning row: %v\n", err)
			continue
		}
		dateStr := ""
		if date.Valid {
			dateStr = date.String
		}
		fmt.Printf("║ %-12s │ %-59s ║\n", dateStr, truncate(title, 59))
		count++
	}

	fmt.Println("╠════════════════════════════════════════════════════════════════════════════╣")
	fmt.Printf("║ Total: %-69d ║\n", count)
	fmt.Println("╚════════════════════════════════════════════════════════════════════════════╝")
}

// ============================================================================
// Words Commands
// ============================================================================

func listWords() {
	db, err := openDb()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error opening database: %v\n", err)
		os.Exit(1)
	}
	defer db.Close()

	query := `SELECT id, title, type, definition FROM words ORDER BY title ASC`
	rows, err := db.Query(query)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error querying words: %v\n", err)
		os.Exit(1)
	}
	defer rows.Close()

	fmt.Println("\n╔════════════════════════════════════════════════════════════════════════════╗")
	fmt.Println("║                           WORD OF THE DAY                                   ║")
	fmt.Println("╠════════════════════════════════════════════════════════════════════════════╣")

	count := 0
	for rows.Next() {
		var id int
		var title, wordType, definition string
		if err := rows.Scan(&id, &title, &wordType, &definition); err != nil {
			fmt.Fprintf(os.Stderr, "Error scanning row: %v\n", err)
			continue
		}
		fmt.Printf("║ %-20s │ %-12s │ %-38s ║\n", title, wordType, truncate(definition, 38))
		count++
	}

	fmt.Println("╠════════════════════════════════════════════════════════════════════════════╣")
	fmt.Printf("║ Total: %-69d ║\n", count)
	fmt.Println("╚════════════════════════════════════════════════════════════════════════════╝")
}

// ============================================================================
// Statistics Command
// ============================================================================

func showStats() {
	db, err := openDb()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error opening database: %v\n", err)
		os.Exit(1)
	}
	defer db.Close()

	fmt.Println("\n╔════════════════════════════════════════════════════════════════════════════╗")
	fmt.Println("║                         SYSTEM.DB STATISTICS                                ║")
	fmt.Println("╠════════════════════════════════════════════════════════════════════════════╣")

	tables := []struct {
		name  string
		table string
	}{
		{"Blogroll", "blogroll"},
		{"Blogroll Tags", "blogroll_tags"},
		{"Blogroll Socials", "blogroll_socials"},
		{"Blogroll URLs", "blogroll_important_urls"},
		{"Changelog Content", "changelog_content"},
		{"Changelog Infra", "changelog_infra"},
		{"TIL", "til"},
		{"TIL Tags", "til_tags"},
		{"Now", "now"},
		{"Now Tags", "now_tags"},
		{"Words", "words"},
	}

	for _, t := range tables {
		var count int
		err := db.QueryRow(fmt.Sprintf("SELECT COUNT(*) FROM %s", t.table)).Scan(&count)
		if err != nil {
			fmt.Printf("║ %-25s │ %-49s ║\n", t.name, "Error")
		} else {
			fmt.Printf("║ %-25s │ %-49d ║\n", t.name, count)
		}
	}

	fmt.Println("╚════════════════════════════════════════════════════════════════════════════╝")
}

// ============================================================================
// Categories Command
// ============================================================================

func listCategories() {
	db, err := openDb()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error opening database: %v\n", err)
		os.Exit(1)
	}
	defer db.Close()

	fmt.Println("\n╔════════════════════════════════════════════════════════════════════════════╗")
	fmt.Println("║                            CATEGORIES                                       ║")
	fmt.Println("╠════════════════════════════════════════════════════════════════════════════╣")

	// Blogroll categories
	fmt.Println("║ BLOGROLL:                                                                   ║")
	rows, _ := db.Query(`SELECT DISTINCT category FROM blogroll WHERE category != '' ORDER BY category`)
	for rows.Next() {
		var cat string
		rows.Scan(&cat)
		fmt.Printf("║   • %-71s ║\n", cat)
	}
	rows.Close()

	fmt.Println("╠────────────────────────────────────────────────────────────────────────────╣")

	// TIL categories
	fmt.Println("║ TIL:                                                                        ║")
	rows, _ = db.Query(`SELECT DISTINCT category FROM til WHERE category != '' ORDER BY category`)
	for rows.Next() {
		var cat string
		rows.Scan(&cat)
		fmt.Printf("║   • %-71s ║\n", cat)
	}
	rows.Close()

	fmt.Println("╚════════════════════════════════════════════════════════════════════════════╝")
}

// ============================================================================
// Tags Command
// ============================================================================

func listTags() {
	db, err := openDb()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error opening database: %v\n", err)
		os.Exit(1)
	}
	defer db.Close()

	fmt.Println("\n╔════════════════════════════════════════════════════════════════════════════╗")
	fmt.Println("║                                TAGS                                         ║")
	fmt.Println("╠════════════════════════════════════════════════════════════════════════════╣")

	// Blogroll tags
	fmt.Println("║ BLOGROLL TAGS:                                                              ║")
	rows, _ := db.Query(`SELECT DISTINCT tag FROM blogroll_tags ORDER BY tag LIMIT 20`)
	tags := []string{}
	for rows.Next() {
		var tag string
		rows.Scan(&tag)
		tags = append(tags, tag)
	}
	rows.Close()
	for i := 0; i < len(tags); i += 4 {
		line := ""
		for j := i; j < i+4 && j < len(tags); j++ {
			line += fmt.Sprintf("%-18s", truncate(tags[j], 17))
		}
		fmt.Printf("║   %-73s ║\n", line)
	}

	fmt.Println("╠────────────────────────────────────────────────────────────────────────────╣")

	// TIL tags
	fmt.Println("║ TIL TAGS:                                                                   ║")
	rows, _ = db.Query(`SELECT DISTINCT tag FROM til_tags ORDER BY tag LIMIT 20`)
	tags = []string{}
	for rows.Next() {
		var tag string
		rows.Scan(&tag)
		tags = append(tags, tag)
	}
	rows.Close()
	for i := 0; i < len(tags); i += 4 {
		line := ""
		for j := i; j < i+4 && j < len(tags); j++ {
			line += fmt.Sprintf("%-18s", truncate(tags[j], 17))
		}
		fmt.Printf("║   %-73s ║\n", line)
	}

	fmt.Println("╚════════════════════════════════════════════════════════════════════════════╝")
}

// ============================================================================
// Helper Functions
// ============================================================================

func truncate(s string, maxLen int) string {
	if len(s) <= maxLen {
		return s
	}
	return s[:maxLen-3] + "..."
}

func printUsage() {
	fmt.Println(`
╔════════════════════════════════════════════════════════════════════════════╗
║                        SYSTEM.DB CLI TOOL                                   ║
╠════════════════════════════════════════════════════════════════════════════╣
║ Usage: go run system.go <command> [options]                                 ║
║                                                                             ║
║ Commands:                                                                   ║
║   blogroll [--category <cat>]   List all blogroll entries                   ║
║   changelog [--feed <feed>]     List changelog (content/infra)              ║
║   til [--category <cat>]        List TIL entries                            ║
║   now                           List Now entries                            ║
║   words                         List all words                              ║
║   stats                         Show database statistics                    ║
║   categories                    List all categories                         ║
║   tags                          List all tags                               ║
║   help                          Show this help message                      ║
╚════════════════════════════════════════════════════════════════════════════╝`)
}

// ============================================================================
// Main
// ============================================================================

func main() {
	if len(os.Args) < 2 {
		printUsage()
		os.Exit(0)
	}

	command := strings.ToLower(os.Args[1])

	switch command {
	case "blogroll":
		fs := flag.NewFlagSet("blogroll", flag.ExitOnError)
		category := fs.String("category", "", "Filter by category")
		fs.Parse(os.Args[2:])
		listBlogroll(*category)

	case "changelog":
		fs := flag.NewFlagSet("changelog", flag.ExitOnError)
		feed := fs.String("feed", "content", "Feed type (content/infra)")
		fs.Parse(os.Args[2:])
		listChangelog(*feed)

	case "til":
		fs := flag.NewFlagSet("til", flag.ExitOnError)
		category := fs.String("category", "", "Filter by category")
		fs.Parse(os.Args[2:])
		listTil(*category)

	case "now":
		listNow()

	case "words":
		listWords()

	case "stats":
		showStats()

	case "categories":
		listCategories()

	case "tags":
		listTags()

	case "help", "-h", "--help":
		printUsage()

	default:
		fmt.Fprintf(os.Stderr, "Unknown command: %s\n", command)
		printUsage()
		os.Exit(1)
	}
}
