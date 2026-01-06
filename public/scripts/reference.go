// ============================================================================
// Reference Database Migration & CLI Tool
// Author: Kris Yotam
// Description: A Go program that migrates JSON reference data to SQLite and
//              provides a terminal interface for querying the reference.db.
// ============================================================================

package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"

	_ "github.com/mattn/go-sqlite3"
)

// ============================================================================
// DATA STRUCTURES
// ============================================================================

// RuleOfTheInternet represents an internet culture rule
type RuleOfTheInternet struct {
	Rule        interface{} `json:"rule"`
	Text        string      `json:"text"`
	Explanation string      `json:"explanation"`
}

// BibleVerse represents a single verse
type BibleVerse struct {
	Verse int    `json:"verse"`
	Text  string `json:"text"`
}

// BibleChapter represents a chapter with verses
type BibleChapter struct {
	Chapter int          `json:"chapter"`
	Verses  []BibleVerse `json:"verses"`
}

// BibleBook represents a book with chapters
type BibleBook struct {
	Book         string         `json:"book"`
	ChapterCount string         `json:"chapter-count"`
	Chapters     []BibleChapter `json:"chapters"`
}

// BibleData represents the entire Bible structure
type BibleData struct {
	Version string      `json:"version"`
	Books   []BibleBook `json:"books"`
}

// OEDEntry represents an Oxford English Dictionary entry
type OEDEntry struct {
	ID         map[string]string `json:"_id"`
	Word       string            `json:"word"`
	Definition string            `json:"definition"`
	V          int               `json:"__v"`
}

// Mitzvah represents a commandment
type Mitzvah struct {
	ID        int    `json:"id"`
	Law       string `json:"law"`
	Scripture string `json:"scripture"`
}

// ============================================================================
// DATABASE INITIALIZATION
// ============================================================================

func initDatabase(dbPath string, dataDir string) (*sql.DB, error) {
	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	// Read and execute schema - try multiple paths
	possibleSchemaPaths := []string{
		filepath.Join(dataDir, "..", "scripts", "reference-schema.sql"),
		filepath.Join(filepath.Dir(dataDir), "scripts", "reference-schema.sql"),
		"reference-schema.sql",
	}

	var schema []byte
	for _, schemaPath := range possibleSchemaPaths {
		schema, err = os.ReadFile(schemaPath)
		if err == nil {
			break
		}
	}

	if schema == nil {
		return nil, fmt.Errorf("failed to read schema from any path")
	}

	_, err = db.Exec(string(schema))
	if err != nil {
		return nil, fmt.Errorf("failed to execute schema: %w", err)
	}

	return db, nil
}

// ============================================================================
// MIGRATION FUNCTIONS
// ============================================================================

func migrateRulesOfTheInternet(db *sql.DB, dataDir string) error {
	fmt.Println("  Migrating rules of the internet...")

	data, err := os.ReadFile(filepath.Join(dataDir, "rules-of-the-internet.json"))
	if err != nil {
		return fmt.Errorf("failed to read rules file: %w", err)
	}

	var rules []RuleOfTheInternet
	if err := json.Unmarshal(data, &rules); err != nil {
		return fmt.Errorf("failed to parse rules: %w", err)
	}

	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare("INSERT OR IGNORE INTO rules_of_the_internet (rule, text, explanation) VALUES (?, ?, ?)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	for _, rule := range rules {
		ruleStr := fmt.Sprintf("%v", rule.Rule)
		_, err := stmt.Exec(ruleStr, rule.Text, rule.Explanation)
		if err != nil {
			return fmt.Errorf("failed to insert rule %v: %w", rule.Rule, err)
		}
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	fmt.Printf("    Inserted %d rules\n", len(rules))
	return nil
}

func migrateKJV1611(db *sql.DB, dataDir string) error {
	fmt.Println("  Migrating KJV 1611 Bible...")

	data, err := os.ReadFile(filepath.Join(dataDir, "reference", "source-data", "1611kjv.json"))
	if err != nil {
		return fmt.Errorf("failed to read Bible file: %w", err)
	}

	var bible BibleData
	if err := json.Unmarshal(data, &bible); err != nil {
		return fmt.Errorf("failed to parse Bible: %w", err)
	}

	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare("INSERT OR IGNORE INTO kjv_1611 (book, chapter, verse, text) VALUES (?, ?, ?, ?)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	verseCount := 0
	for _, book := range bible.Books {
		for _, chapter := range book.Chapters {
			for _, verse := range chapter.Verses {
				_, err := stmt.Exec(book.Book, chapter.Chapter, verse.Verse, verse.Text)
				if err != nil {
					return fmt.Errorf("failed to insert %s %d:%d: %w", book.Book, chapter.Chapter, verse.Verse, err)
				}
				verseCount++
			}
		}
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	fmt.Printf("    Inserted %d verses from %d books\n", verseCount, len(bible.Books))
	return nil
}

func migrateOED(db *sql.DB, dataDir string) error {
	fmt.Println("  Migrating Oxford English Dictionary...")

	data, err := os.ReadFile(filepath.Join(dataDir, "reference", "oed.json"))
	if err != nil {
		return fmt.Errorf("failed to read OED file: %w", err)
	}

	var entries []OEDEntry
	if err := json.Unmarshal(data, &entries); err != nil {
		return fmt.Errorf("failed to parse OED: %w", err)
	}

	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare("INSERT OR IGNORE INTO oed (word, definition) VALUES (?, ?)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	inserted := 0
	for _, entry := range entries {
		word := strings.ToUpper(strings.TrimSpace(entry.Word))
		if word == "" {
			continue
		}
		_, err := stmt.Exec(word, entry.Definition)
		if err != nil {
			return fmt.Errorf("failed to insert word %s: %w", word, err)
		}
		inserted++
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	fmt.Printf("    Inserted %d words\n", inserted)
	return nil
}

func migrateMerriamWebster(db *sql.DB, dataDir string) error {
	fmt.Println("  Migrating Merriam-Webster Dictionary...")

	data, err := os.ReadFile(filepath.Join(dataDir, "reference", "merriam-webster.json"))
	if err != nil {
		return fmt.Errorf("failed to read Merriam-Webster file: %w", err)
	}

	var entries map[string]string
	if err := json.Unmarshal(data, &entries); err != nil {
		return fmt.Errorf("failed to parse Merriam-Webster: %w", err)
	}

	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare("INSERT OR IGNORE INTO merriam_webster (word, definition) VALUES (?, ?)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	inserted := 0
	for word, definition := range entries {
		normalizedWord := strings.ToLower(strings.TrimSpace(word))
		if normalizedWord == "" {
			continue
		}
		_, err := stmt.Exec(normalizedWord, definition)
		if err != nil {
			return fmt.Errorf("failed to insert word %s: %w", word, err)
		}
		inserted++
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	fmt.Printf("    Inserted %d words\n", inserted)
	return nil
}

func migrateMitzvot(db *sql.DB, dataDir string) error {
	fmt.Println("  Migrating Mitzvot (613 Commandments)...")

	data, err := os.ReadFile(filepath.Join(dataDir, "mitzvah.json"))
	if err != nil {
		return fmt.Errorf("failed to read mitzvah file: %w", err)
	}

	var mitzvot []Mitzvah
	if err := json.Unmarshal(data, &mitzvot); err != nil {
		return fmt.Errorf("failed to parse mitzvot: %w", err)
	}

	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare("INSERT OR REPLACE INTO mitzvot (id, law, scripture) VALUES (?, ?, ?)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	for _, m := range mitzvot {
		_, err := stmt.Exec(m.ID, m.Law, m.Scripture)
		if err != nil {
			return fmt.Errorf("failed to insert mitzvah %d: %w", m.ID, err)
		}
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	fmt.Printf("    Inserted %d commandments\n", len(mitzvot))
	return nil
}

func migrateCPI(db *sql.DB, dataDir string) error {
	fmt.Println("  Migrating CPI (Consumer Price Index)...")

	data, err := os.ReadFile(filepath.Join(dataDir, "cpi.json"))
	if err != nil {
		return fmt.Errorf("failed to read CPI file: %w", err)
	}

	var cpiData map[string]float64
	if err := json.Unmarshal(data, &cpiData); err != nil {
		return fmt.Errorf("failed to parse CPI: %w", err)
	}

	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare("INSERT OR REPLACE INTO cpi (year, value) VALUES (?, ?)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	for yearStr, value := range cpiData {
		year, err := strconv.Atoi(yearStr)
		if err != nil {
			fmt.Printf("    Warning: skipping invalid year %s\n", yearStr)
			continue
		}
		_, err = stmt.Exec(year, value)
		if err != nil {
			return fmt.Errorf("failed to insert CPI for %d: %w", year, err)
		}
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	fmt.Printf("    Inserted %d years of CPI data\n", len(cpiData))
	return nil
}

// ============================================================================
// CLI QUERY FUNCTIONS
// ============================================================================

func listTables(db *sql.DB) {
	fmt.Println("\n=== Reference Database Tables ===")
	fmt.Println()

	tables := []struct {
		name        string
		description string
		countQuery  string
	}{
		{"rules_of_the_internet", "Internet Culture Rules", "SELECT COUNT(*) FROM rules_of_the_internet"},
		{"kjv_1611", "King James Bible (1611)", "SELECT COUNT(*) FROM kjv_1611"},
		{"oed", "Oxford English Dictionary", "SELECT COUNT(*) FROM oed"},
		{"merriam_webster", "Merriam-Webster Dictionary", "SELECT COUNT(*) FROM merriam_webster"},
		{"mitzvot", "613 Commandments", "SELECT COUNT(*) FROM mitzvot"},
		{"cpi", "Consumer Price Index", "SELECT COUNT(*) FROM cpi"},
	}

	for _, t := range tables {
		var count int
		err := db.QueryRow(t.countQuery).Scan(&count)
		if err != nil {
			count = 0
		}
		fmt.Printf("  %-25s %s (%d entries)\n", t.name, t.description, count)
	}
	fmt.Println()
}

func listRules(db *sql.DB) {
	fmt.Println("\n=== Rules of the Internet ===")
	fmt.Println()

	rows, err := db.Query("SELECT rule, text FROM rules_of_the_internet ORDER BY id")
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}
	defer rows.Close()

	for rows.Next() {
		var rule, text string
		if err := rows.Scan(&rule, &text); err != nil {
			continue
		}
		fmt.Printf("  Rule %s: %s\n", rule, text)
	}
	fmt.Println()
}

func listMitzvot(db *sql.DB) {
	fmt.Println("\n=== Mitzvot (First 20) ===")
	fmt.Println()

	rows, err := db.Query("SELECT id, law, scripture FROM mitzvot ORDER BY id LIMIT 20")
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}
	defer rows.Close()

	for rows.Next() {
		var id int
		var law, scripture string
		if err := rows.Scan(&id, &law, &scripture); err != nil {
			continue
		}
		fmt.Printf("  %3d. %s (%s)\n", id, law, scripture)
	}
	fmt.Println("  ...")
	fmt.Println()
}

func listCPI(db *sql.DB) {
	fmt.Println("\n=== Consumer Price Index ===")
	fmt.Println()

	rows, err := db.Query("SELECT year, value FROM cpi ORDER BY year")
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}
	defer rows.Close()

	var years []int
	cpiMap := make(map[int]float64)

	for rows.Next() {
		var year int
		var value float64
		if err := rows.Scan(&year, &value); err != nil {
			continue
		}
		years = append(years, year)
		cpiMap[year] = value
	}

	sort.Ints(years)

	// Print in columns
	cols := 4
	for i, year := range years {
		fmt.Printf("  %d: %7.2f", year, cpiMap[year])
		if (i+1)%cols == 0 {
			fmt.Println()
		} else {
			fmt.Print("    ")
		}
	}
	fmt.Println()
	fmt.Println()
}

func listBibleBooks(db *sql.DB) {
	fmt.Println("\n=== KJV 1611 Books ===")
	fmt.Println()

	rows, err := db.Query("SELECT DISTINCT book FROM kjv_1611")
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}
	defer rows.Close()

	var books []string
	for rows.Next() {
		var book string
		if err := rows.Scan(&book); err != nil {
			continue
		}
		books = append(books, book)
	}

	// Print in columns
	cols := 4
	for i, book := range books {
		fmt.Printf("  %-20s", book)
		if (i+1)%cols == 0 {
			fmt.Println()
		}
	}
	fmt.Println()
	fmt.Println()
}

func searchOED(db *sql.DB, term string) {
	fmt.Printf("\n=== OED Search: %s ===\n", term)
	fmt.Println()

	query := "SELECT word, definition FROM oed WHERE word LIKE ? LIMIT 10"
	rows, err := db.Query(query, "%"+strings.ToUpper(term)+"%")
	if err != nil {
		fmt.Printf("Error: %v\n", err)
		return
	}
	defer rows.Close()

	found := false
	for rows.Next() {
		var word, definition string
		if err := rows.Scan(&word, &definition); err != nil {
			continue
		}
		found = true
		// Truncate definition if too long
		if len(definition) > 200 {
			definition = definition[:200] + "..."
		}
		fmt.Printf("  %s: %s\n\n", word, definition)
	}

	if !found {
		fmt.Println("  No results found.")
	}
	fmt.Println()
}

func printUsage() {
	fmt.Println(`
Reference Database CLI
Author: Kris Yotam

Usage:
  go run reference.go [command]

Commands:
  migrate              Run database migration from JSON files
  tables               List all tables and their counts
  rules                List all Rules of the Internet
  mitzvot              List first 20 mitzvot
  cpi                  List all CPI data
  books                List all Bible books
  search-oed <term>    Search OED for a word
  help                 Show this help message

Examples:
  go run reference.go migrate
  go run reference.go tables
  go run reference.go search-oed philosophy
`)
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

	// Determine paths - try multiple locations
	var dataDir, dbPath string

	// Get current working directory
	cwd, _ := os.Getwd()

	// Try various paths
	possibleDataDirs := []string{
		filepath.Join(cwd, "..", "data"),  // Running from scripts/
		filepath.Join(cwd, "data"),         // Running from project root
		"../data",                          // Relative from scripts/
		"data",                             // Relative from project root
	}

	for _, dir := range possibleDataDirs {
		absDir, _ := filepath.Abs(dir)
		if _, err := os.Stat(absDir); err == nil {
			dataDir = absDir
			dbPath = filepath.Join(dataDir, "reference.db")
			break
		}
	}

	if dataDir == "" {
		fmt.Printf("Error: Could not find data directory (cwd: %s)\n", cwd)
		os.Exit(1)
	}

	switch command {
	case "migrate":
		fmt.Println("=== Reference Database Migration ===")
		fmt.Println()
		fmt.Printf("Database: %s\n", dbPath)
		fmt.Printf("Data directory: %s\n", dataDir)
		fmt.Println()

		// Remove existing database
		os.Remove(dbPath)

		db, err := initDatabase(dbPath, dataDir)
		if err != nil {
			fmt.Printf("Error initializing database: %v\n", err)
			os.Exit(1)
		}
		defer db.Close()

		fmt.Println("Running migrations...")
		fmt.Println()

		if err := migrateRulesOfTheInternet(db, dataDir); err != nil {
			fmt.Printf("Error migrating rules: %v\n", err)
		}

		if err := migrateKJV1611(db, dataDir); err != nil {
			fmt.Printf("Error migrating KJV: %v\n", err)
		}

		if err := migrateOED(db, dataDir); err != nil {
			fmt.Printf("Error migrating OED: %v\n", err)
		}

		if err := migrateMerriamWebster(db, dataDir); err != nil {
			fmt.Printf("Error migrating Merriam-Webster: %v\n", err)
		}

		if err := migrateMitzvot(db, dataDir); err != nil {
			fmt.Printf("Error migrating Mitzvot: %v\n", err)
		}

		if err := migrateCPI(db, dataDir); err != nil {
			fmt.Printf("Error migrating CPI: %v\n", err)
		}

		fmt.Println()
		fmt.Println("Migration complete!")
		fmt.Printf("Database created at: %s\n", dbPath)

	case "tables":
		db, err := sql.Open("sqlite3", dbPath)
		if err != nil {
			fmt.Printf("Error opening database: %v\n", err)
			os.Exit(1)
		}
		defer db.Close()
		listTables(db)

	case "rules":
		db, err := sql.Open("sqlite3", dbPath)
		if err != nil {
			fmt.Printf("Error opening database: %v\n", err)
			os.Exit(1)
		}
		defer db.Close()
		listRules(db)

	case "mitzvot":
		db, err := sql.Open("sqlite3", dbPath)
		if err != nil {
			fmt.Printf("Error opening database: %v\n", err)
			os.Exit(1)
		}
		defer db.Close()
		listMitzvot(db)

	case "cpi":
		db, err := sql.Open("sqlite3", dbPath)
		if err != nil {
			fmt.Printf("Error opening database: %v\n", err)
			os.Exit(1)
		}
		defer db.Close()
		listCPI(db)

	case "books":
		db, err := sql.Open("sqlite3", dbPath)
		if err != nil {
			fmt.Printf("Error opening database: %v\n", err)
			os.Exit(1)
		}
		defer db.Close()
		listBibleBooks(db)

	case "search-oed":
		if len(os.Args) < 3 {
			fmt.Println("Error: search-oed requires a search term")
			os.Exit(1)
		}
		db, err := sql.Open("sqlite3", dbPath)
		if err != nil {
			fmt.Printf("Error opening database: %v\n", err)
			os.Exit(1)
		}
		defer db.Close()
		searchOED(db, os.Args[2])

	case "help":
		printUsage()

	default:
		fmt.Printf("Unknown command: %s\n", command)
		printUsage()
		os.Exit(1)
	}
}
