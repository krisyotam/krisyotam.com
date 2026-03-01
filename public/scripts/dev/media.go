// ============================================================================
// Media Reordering CLI
// Author: Kris Yotam
// Date: 2026-01-05
// Updated: 2026-02-26
// Filename: media.go
// Description: CLI for reordering entries across media tables (sort_order,
//              favorites position, people sort columns).
// Usage:
//   go run media.go list <table>
//   go run media.go swap <table> <name1> <name2>
//   go run media.go set <table> <name> <position>
//
// Table aliases:
//   actors, directors, characters, companies, producers,
//   tv-actors, tv-characters, tv-networks, showrunners, tv-shows,
//   favorites:<type>, people:<type>
// ============================================================================

package main

import (
	"database/sql"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"unicode"

	_ "github.com/mattn/go-sqlite3"
)

// ============================================================================
// TABLE CONFIGURATION
// ============================================================================

// sortOrderTable represents a media.db table with a sort_order column.
type sortOrderTable struct {
	table     string // actual DB table name
	nameCol   string // column used for display/lookup
	orderCol  string // always "sort_order"
	orderTail string // extra ORDER BY after sort_order (e.g. ", id")
}

// Map of alias -> sortOrderTable for all sort_order-based tables.
var sortOrderTables = map[string]sortOrderTable{
	"actors":        {"fav_actors", "name", "sort_order", ", id"},
	"directors":     {"fav_directors", "name", "sort_order", ", id"},
	"characters":    {"fav_film_characters", "name", "sort_order", ", id"},
	"companies":     {"fav_film_companies", "name", "sort_order", ", id"},
	"producers":     {"fav_producers", "name", "sort_order", ", id"},
	"tv-actors":     {"fav_tv_actors", "name", "sort_order", ", id"},
	"tv-characters": {"fav_tv_characters", "name", "sort_order", ", id"},
	"tv-networks":   {"fav_tv_networks", "name", "sort_order", ", id"},
	"showrunners":   {"fav_showrunners", "name", "sort_order", ", id"},
	"tv-shows":      {"fav_tv_shows", "name", "sort_order", ", id"},
}

// Valid people types and their corresponding sort column.
var peopleTypes = map[string]string{
	"actor":         "sort_actor",
	"artist":        "sort_artist",
	"author":        "sort_author",
	"designer":      "sort_designer",
	"mathematician": "sort_mathematician",
	"musician":      "sort_musician",
	"philosopher":   "sort_philosopher",
	"poet":          "sort_poet",
}

// capitalize uppercases the first letter of s.
func capitalize(s string) string {
	if s == "" {
		return s
	}
	r := []rune(s)
	r[0] = unicode.ToUpper(r[0])
	return string(r)
}

// ============================================================================
// DATABASE HELPERS
// ============================================================================

func scriptDir() string {
	exe, _ := os.Executable()
	dir := filepath.Dir(exe)
	// When using go run, the executable is in a temp dir.
	// Fall back to working directory-based resolution.
	if strings.Contains(dir, "go-build") || strings.Contains(dir, "/tmp") {
		wd, _ := os.Getwd()
		// If we're in the scripts dir already, go up one level for data/
		if filepath.Base(wd) == "scripts" {
			return wd
		}
		// Otherwise assume project root, point to public/scripts
		return filepath.Join(wd, "public", "scripts")
	}
	return dir
}

func dataDir() string {
	return filepath.Join(filepath.Dir(scriptDir()), "data")
}

func openMediaDB() (*sql.DB, error) {
	path := filepath.Join(dataDir(), "media.db")
	return sql.Open("sqlite3", path)
}

func openSystemDB() (*sql.DB, error) {
	path := filepath.Join(dataDir(), "system.db")
	return sql.Open("sqlite3", path)
}

// ============================================================================
// SORT_ORDER TABLE OPERATIONS
// ============================================================================

type row struct {
	id        int
	name      string
	sortOrder int
}

func listSortOrder(cfg sortOrderTable) error {
	db, err := openMediaDB()
	if err != nil {
		return err
	}
	defer db.Close()

	query := fmt.Sprintf("SELECT id, %s, %s FROM %s ORDER BY %s%s",
		cfg.nameCol, cfg.orderCol, cfg.table, cfg.orderCol, cfg.orderTail)
	rows, err := db.Query(query)
	if err != nil {
		return err
	}
	defer rows.Close()

	fmt.Printf("\n  %-4s  %-5s  %s\n", "#", "Order", "Name")
	fmt.Printf("  %-4s  %-5s  %s\n", "---", "-----", strings.Repeat("-", 40))
	i := 1
	for rows.Next() {
		var r row
		if err := rows.Scan(&r.id, &r.name, &r.sortOrder); err != nil {
			return err
		}
		fmt.Printf("  %-4d  %-5d  %s\n", i, r.sortOrder, r.name)
		i++
	}
	return rows.Err()
}

func findByName(db *sql.DB, cfg sortOrderTable, name string) (row, error) {
	query := fmt.Sprintf("SELECT id, %s, %s FROM %s WHERE %s LIKE ? LIMIT 1",
		cfg.nameCol, cfg.orderCol, cfg.table, cfg.nameCol)
	var r row
	err := db.QueryRow(query, name).Scan(&r.id, &r.name, &r.sortOrder)
	if err == sql.ErrNoRows {
		return r, fmt.Errorf("no match for %q in %s", name, cfg.table)
	}
	return r, err
}

func swapSortOrder(cfg sortOrderTable, name1, name2 string) error {
	db, err := openMediaDB()
	if err != nil {
		return err
	}
	defer db.Close()

	r1, err := findByName(db, cfg, name1)
	if err != nil {
		return err
	}
	r2, err := findByName(db, cfg, name2)
	if err != nil {
		return err
	}

	fmt.Printf("\n  Before:\n")
	fmt.Printf("    %s → %d\n", r1.name, r1.sortOrder)
	fmt.Printf("    %s → %d\n", r2.name, r2.sortOrder)

	tx, err := db.Begin()
	if err != nil {
		return err
	}
	update := fmt.Sprintf("UPDATE %s SET %s = ? WHERE id = ?", cfg.table, cfg.orderCol)
	if _, err := tx.Exec(update, r2.sortOrder, r1.id); err != nil {
		tx.Rollback()
		return err
	}
	if _, err := tx.Exec(update, r1.sortOrder, r2.id); err != nil {
		tx.Rollback()
		return err
	}
	if err := tx.Commit(); err != nil {
		return err
	}

	fmt.Printf("\n  After:\n")
	fmt.Printf("    %s → %d\n", r1.name, r2.sortOrder)
	fmt.Printf("    %s → %d\n", r2.name, r1.sortOrder)
	return nil
}

func setSortOrder(cfg sortOrderTable, name string, pos int) error {
	db, err := openMediaDB()
	if err != nil {
		return err
	}
	defer db.Close()

	// Find target row
	target, err := findByName(db, cfg, name)
	if err != nil {
		return err
	}

	// Get all rows in current order
	query := fmt.Sprintf("SELECT id, %s, %s FROM %s ORDER BY %s%s",
		cfg.nameCol, cfg.orderCol, cfg.table, cfg.orderCol, cfg.orderTail)
	rows, err := db.Query(query)
	if err != nil {
		return err
	}
	var all []row
	for rows.Next() {
		var r row
		if err := rows.Scan(&r.id, &r.name, &r.sortOrder); err != nil {
			rows.Close()
			return err
		}
		all = append(all, r)
	}
	rows.Close()
	if err := rows.Err(); err != nil {
		return err
	}

	// Remove target from list
	var rest []row
	for _, r := range all {
		if r.id != target.id {
			rest = append(rest, r)
		}
	}

	// Clamp position
	if pos < 1 {
		pos = 1
	}
	if pos > len(all) {
		pos = len(all)
	}

	// Insert at position (1-indexed)
	idx := pos - 1
	reordered := make([]row, 0, len(all))
	reordered = append(reordered, rest[:idx]...)
	reordered = append(reordered, target)
	reordered = append(reordered, rest[idx:]...)

	// Reassign sort_order = 1, 2, 3, ...
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	update := fmt.Sprintf("UPDATE %s SET %s = ? WHERE id = ?", cfg.table, cfg.orderCol)
	for i, r := range reordered {
		if _, err := tx.Exec(update, i+1, r.id); err != nil {
			tx.Rollback()
			return err
		}
	}
	if err := tx.Commit(); err != nil {
		return err
	}

	// Print new order
	fmt.Printf("\n  New order for %s:\n", cfg.table)
	fmt.Printf("  %-4s  %s\n", "#", "Name")
	fmt.Printf("  %-4s  %s\n", "---", strings.Repeat("-", 40))
	for i, r := range reordered {
		marker := " "
		if r.id == target.id {
			marker = "→"
		}
		fmt.Printf("  %-4d  %s %s\n", i+1, marker, r.name)
	}
	return nil
}

// ============================================================================
// FAVORITES TABLE OPERATIONS (position-based, UNIQUE constraint)
// ============================================================================

type favRow struct {
	id       int
	title    string
	position int
}

func listFavorites(favType string) error {
	db, err := openMediaDB()
	if err != nil {
		return err
	}
	defer db.Close()

	rows, err := db.Query("SELECT id, title, position FROM favorites WHERE type = ? ORDER BY position", favType)
	if err != nil {
		return err
	}
	defer rows.Close()

	fmt.Printf("\n  favorites:%s\n", favType)
	fmt.Printf("  %-4s  %s\n", "Pos", "Title")
	fmt.Printf("  %-4s  %s\n", "---", strings.Repeat("-", 40))
	for rows.Next() {
		var r favRow
		if err := rows.Scan(&r.id, &r.title, &r.position); err != nil {
			return err
		}
		fmt.Printf("  %-4d  %s\n", r.position, r.title)
	}
	return rows.Err()
}

func findFavorite(db *sql.DB, favType, title string) (favRow, error) {
	var r favRow
	err := db.QueryRow(
		"SELECT id, title, position FROM favorites WHERE type = ? AND title LIKE ? LIMIT 1",
		favType, title,
	).Scan(&r.id, &r.title, &r.position)
	if err == sql.ErrNoRows {
		return r, fmt.Errorf("no match for %q in favorites:%s", title, favType)
	}
	return r, err
}

func swapFavorites(favType, title1, title2 string) error {
	db, err := openMediaDB()
	if err != nil {
		return err
	}
	defer db.Close()

	r1, err := findFavorite(db, favType, title1)
	if err != nil {
		return err
	}
	r2, err := findFavorite(db, favType, title2)
	if err != nil {
		return err
	}

	fmt.Printf("\n  Before:\n")
	fmt.Printf("    %s → pos %d\n", r1.title, r1.position)
	fmt.Printf("    %s → pos %d\n", r2.title, r2.position)

	// Use temp position -1 to avoid UNIQUE(type, position) violation
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	if _, err := tx.Exec("UPDATE favorites SET position = -1 WHERE id = ?", r1.id); err != nil {
		tx.Rollback()
		return err
	}
	if _, err := tx.Exec("UPDATE favorites SET position = ? WHERE id = ?", r1.position, r2.id); err != nil {
		tx.Rollback()
		return err
	}
	if _, err := tx.Exec("UPDATE favorites SET position = ? WHERE id = ?", r2.position, r1.id); err != nil {
		tx.Rollback()
		return err
	}
	if err := tx.Commit(); err != nil {
		return err
	}

	fmt.Printf("\n  After:\n")
	fmt.Printf("    %s → pos %d\n", r1.title, r2.position)
	fmt.Printf("    %s → pos %d\n", r2.title, r1.position)
	return nil
}

func setFavorite(favType, title string, pos int) error {
	db, err := openMediaDB()
	if err != nil {
		return err
	}
	defer db.Close()

	target, err := findFavorite(db, favType, title)
	if err != nil {
		return err
	}

	// Get all rows for this type
	rows, err := db.Query("SELECT id, title, position FROM favorites WHERE type = ? ORDER BY position", favType)
	if err != nil {
		return err
	}
	var all []favRow
	for rows.Next() {
		var r favRow
		if err := rows.Scan(&r.id, &r.title, &r.position); err != nil {
			rows.Close()
			return err
		}
		all = append(all, r)
	}
	rows.Close()
	if err := rows.Err(); err != nil {
		return err
	}

	// Remove target from list
	var rest []favRow
	for _, r := range all {
		if r.id != target.id {
			rest = append(rest, r)
		}
	}

	// Clamp
	if pos < 1 {
		pos = 1
	}
	if pos > len(all) {
		pos = len(all)
	}

	// Insert at position
	idx := pos - 1
	reordered := make([]favRow, 0, len(all))
	reordered = append(reordered, rest[:idx]...)
	reordered = append(reordered, target)
	reordered = append(reordered, rest[idx:]...)

	// Clear all positions first to avoid UNIQUE violations, then reassign
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	// Set all positions to negative temporaries
	for i, r := range reordered {
		if _, err := tx.Exec("UPDATE favorites SET position = ? WHERE id = ?", -(i + 1), r.id); err != nil {
			tx.Rollback()
			return err
		}
	}
	// Now set real positions
	for i, r := range reordered {
		if _, err := tx.Exec("UPDATE favorites SET position = ? WHERE id = ?", i+1, r.id); err != nil {
			tx.Rollback()
			return err
		}
	}
	if err := tx.Commit(); err != nil {
		return err
	}

	fmt.Printf("\n  New order for favorites:%s\n", favType)
	fmt.Printf("  %-4s  %s\n", "Pos", "Title")
	fmt.Printf("  %-4s  %s\n", "---", strings.Repeat("-", 40))
	for i, r := range reordered {
		marker := " "
		if r.id == target.id {
			marker = "→"
		}
		fmt.Printf("  %-4d  %s %s\n", i+1, marker, r.title)
	}
	return nil
}

// ============================================================================
// PEOPLE TABLE OPERATIONS (system.db, per-type sort columns)
// ============================================================================

type personRow struct {
	id       int
	name     string
	sortVal  int
}

func listPeople(pType string) error {
	sortCol, ok := peopleTypes[pType]
	if !ok {
		return fmt.Errorf("unknown people type %q (valid: %s)", pType, validPeopleTypes())
	}

	db, err := openSystemDB()
	if err != nil {
		return err
	}
	defer db.Close()

	// People types in DB are capitalized (e.g. "Actor")
	dbType := capitalize(pType)
	query := fmt.Sprintf("SELECT id, name, %s FROM people WHERE type = ? ORDER BY %s, name", sortCol, sortCol)
	rows, err := db.Query(query, dbType)
	if err != nil {
		return err
	}
	defer rows.Close()

	fmt.Printf("\n  people:%s (sorted by %s)\n", pType, sortCol)
	fmt.Printf("  %-4s  %-5s  %s\n", "#", "Sort", "Name")
	fmt.Printf("  %-4s  %-5s  %s\n", "---", "-----", strings.Repeat("-", 40))
	i := 1
	for rows.Next() {
		var r personRow
		if err := rows.Scan(&r.id, &r.name, &r.sortVal); err != nil {
			return err
		}
		fmt.Printf("  %-4d  %-5d  %s\n", i, r.sortVal, r.name)
		i++
	}
	return rows.Err()
}

func findPerson(db *sql.DB, pType, name string) (personRow, error) {
	sortCol := peopleTypes[pType]
	dbType := capitalize(pType)
	query := fmt.Sprintf("SELECT id, name, %s FROM people WHERE type = ? AND name LIKE ? LIMIT 1", sortCol)
	var r personRow
	err := db.QueryRow(query, dbType, name).Scan(&r.id, &r.name, &r.sortVal)
	if err == sql.ErrNoRows {
		return r, fmt.Errorf("no match for %q in people:%s", name, pType)
	}
	return r, err
}

func swapPeople(pType, name1, name2 string) error {
	sortCol, ok := peopleTypes[pType]
	if !ok {
		return fmt.Errorf("unknown people type %q (valid: %s)", pType, validPeopleTypes())
	}

	db, err := openSystemDB()
	if err != nil {
		return err
	}
	defer db.Close()

	r1, err := findPerson(db, pType, name1)
	if err != nil {
		return err
	}
	r2, err := findPerson(db, pType, name2)
	if err != nil {
		return err
	}

	fmt.Printf("\n  Before:\n")
	fmt.Printf("    %s → %s=%d\n", r1.name, sortCol, r1.sortVal)
	fmt.Printf("    %s → %s=%d\n", r2.name, sortCol, r2.sortVal)

	tx, err := db.Begin()
	if err != nil {
		return err
	}
	update := fmt.Sprintf("UPDATE people SET %s = ? WHERE id = ?", sortCol)
	if _, err := tx.Exec(update, r2.sortVal, r1.id); err != nil {
		tx.Rollback()
		return err
	}
	if _, err := tx.Exec(update, r1.sortVal, r2.id); err != nil {
		tx.Rollback()
		return err
	}
	if err := tx.Commit(); err != nil {
		return err
	}

	fmt.Printf("\n  After:\n")
	fmt.Printf("    %s → %s=%d\n", r1.name, sortCol, r2.sortVal)
	fmt.Printf("    %s → %s=%d\n", r2.name, sortCol, r1.sortVal)
	return nil
}

func setPeople(pType, name string, pos int) error {
	sortCol, ok := peopleTypes[pType]
	if !ok {
		return fmt.Errorf("unknown people type %q (valid: %s)", pType, validPeopleTypes())
	}

	db, err := openSystemDB()
	if err != nil {
		return err
	}
	defer db.Close()

	target, err := findPerson(db, pType, name)
	if err != nil {
		return err
	}

	// Get all people of this type
	dbType := capitalize(pType)
	query := fmt.Sprintf("SELECT id, name, %s FROM people WHERE type = ? ORDER BY %s, name", sortCol, sortCol)
	rows, err := db.Query(query, dbType)
	if err != nil {
		return err
	}
	var all []personRow
	for rows.Next() {
		var r personRow
		if err := rows.Scan(&r.id, &r.name, &r.sortVal); err != nil {
			rows.Close()
			return err
		}
		all = append(all, r)
	}
	rows.Close()
	if err := rows.Err(); err != nil {
		return err
	}

	// Remove target
	var rest []personRow
	for _, r := range all {
		if r.id != target.id {
			rest = append(rest, r)
		}
	}

	// Clamp
	if pos < 1 {
		pos = 1
	}
	if pos > len(all) {
		pos = len(all)
	}

	// Insert at position
	idx := pos - 1
	reordered := make([]personRow, 0, len(all))
	reordered = append(reordered, rest[:idx]...)
	reordered = append(reordered, target)
	reordered = append(reordered, rest[idx:]...)

	// Reassign sort values
	tx, err := db.Begin()
	if err != nil {
		return err
	}
	update := fmt.Sprintf("UPDATE people SET %s = ? WHERE id = ?", sortCol)
	for i, r := range reordered {
		if _, err := tx.Exec(update, i+1, r.id); err != nil {
			tx.Rollback()
			return err
		}
	}
	if err := tx.Commit(); err != nil {
		return err
	}

	fmt.Printf("\n  New order for people:%s:\n", pType)
	fmt.Printf("  %-4s  %s\n", "#", "Name")
	fmt.Printf("  %-4s  %s\n", "---", strings.Repeat("-", 40))
	for i, r := range reordered {
		marker := " "
		if r.id == target.id {
			marker = "→"
		}
		fmt.Printf("  %-4d  %s %s\n", i+1, marker, r.name)
	}
	return nil
}

// ============================================================================
// ROUTING / PARSING
// ============================================================================

// parseTable splits "favorites:film" → ("favorites", "film")
// and "actors" → ("actors", "").
func parseTable(s string) (string, string) {
	if i := strings.IndexByte(s, ':'); i >= 0 {
		return s[:i], s[i+1:]
	}
	return s, ""
}

func validPeopleTypes() string {
	types := make([]string, 0, len(peopleTypes))
	for k := range peopleTypes {
		types = append(types, k)
	}
	return strings.Join(types, ", ")
}

func validAliases() string {
	aliases := make([]string, 0, len(sortOrderTables)+2)
	for k := range sortOrderTables {
		aliases = append(aliases, k)
	}
	aliases = append(aliases, "favorites:<type>", "people:<type>")
	return strings.Join(aliases, ", ")
}

// ============================================================================
// MAIN
// ============================================================================

func usage() {
	fmt.Println(`Usage: go run media.go <command> <table> [args...]

Commands:
  list <table>                     Show current order
  swap <table> <name1> <name2>     Swap two entries' positions
  set  <table> <name> <position>   Move entry to position N, shift others

Table aliases:
  actors, directors, characters, companies, producers,
  tv-actors, tv-characters, tv-networks, showrunners, tv-shows,
  favorites:<type>  (e.g. favorites:film, favorites:music)
  people:<type>     (e.g. people:actor, people:musician)

Examples:
  go run media.go list actors
  go run media.go swap actors "Winona Ryder" "Jodie Foster"
  go run media.go set directors "Akira Kurosawa" 1
  go run media.go list favorites:film
  go run media.go swap favorites:film "Girl Interrupted" "Pulp Fiction"
  go run media.go list people:actor
  go run media.go set people:musician "Bach" 1`)
}

func main() {
	args := os.Args[1:]
	if len(args) < 2 {
		usage()
		os.Exit(1)
	}

	command := args[0]
	tableArg := args[1]
	prefix, subtype := parseTable(tableArg)

	switch command {
	case "list":
		var err error
		switch prefix {
		case "favorites":
			if subtype == "" {
				fmt.Fprintln(os.Stderr, "Error: favorites requires a type (e.g. favorites:film)")
				os.Exit(1)
			}
			err = listFavorites(subtype)
		case "people":
			if subtype == "" {
				fmt.Fprintln(os.Stderr, "Error: people requires a type (e.g. people:actor)")
				os.Exit(1)
			}
			err = listPeople(subtype)
		default:
			cfg, ok := sortOrderTables[prefix]
			if !ok {
				fmt.Fprintf(os.Stderr, "Error: unknown table %q\nValid: %s\n", tableArg, validAliases())
				os.Exit(1)
			}
			err = listSortOrder(cfg)
		}
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error: %v\n", err)
			os.Exit(1)
		}

	case "swap":
		if len(args) < 4 {
			fmt.Fprintln(os.Stderr, "Usage: go run media.go swap <table> <name1> <name2>")
			os.Exit(1)
		}
		name1, name2 := args[2], args[3]
		var err error
		switch prefix {
		case "favorites":
			if subtype == "" {
				fmt.Fprintln(os.Stderr, "Error: favorites requires a type (e.g. favorites:film)")
				os.Exit(1)
			}
			err = swapFavorites(subtype, name1, name2)
		case "people":
			if subtype == "" {
				fmt.Fprintln(os.Stderr, "Error: people requires a type (e.g. people:actor)")
				os.Exit(1)
			}
			err = swapPeople(subtype, name1, name2)
		default:
			cfg, ok := sortOrderTables[prefix]
			if !ok {
				fmt.Fprintf(os.Stderr, "Error: unknown table %q\nValid: %s\n", tableArg, validAliases())
				os.Exit(1)
			}
			err = swapSortOrder(cfg, name1, name2)
		}
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error: %v\n", err)
			os.Exit(1)
		}

	case "set":
		if len(args) < 4 {
			fmt.Fprintln(os.Stderr, "Usage: go run media.go set <table> <name> <position>")
			os.Exit(1)
		}
		name := args[2]
		pos, err := strconv.Atoi(args[3])
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error: position must be a number, got %q\n", args[3])
			os.Exit(1)
		}
		switch prefix {
		case "favorites":
			if subtype == "" {
				fmt.Fprintln(os.Stderr, "Error: favorites requires a type (e.g. favorites:film)")
				os.Exit(1)
			}
			err = setFavorite(subtype, name, pos)
		case "people":
			if subtype == "" {
				fmt.Fprintln(os.Stderr, "Error: people requires a type (e.g. people:actor)")
				os.Exit(1)
			}
			err = setPeople(subtype, name, pos)
		default:
			cfg, ok := sortOrderTables[prefix]
			if !ok {
				fmt.Fprintf(os.Stderr, "Error: unknown table %q\nValid: %s\n", tableArg, validAliases())
				os.Exit(1)
			}
			err = setSortOrder(cfg, name, pos)
		}
		if err != nil {
			fmt.Fprintf(os.Stderr, "Error: %v\n", err)
			os.Exit(1)
		}

	default:
		fmt.Fprintf(os.Stderr, "Error: unknown command %q (use list, swap, or set)\n", command)
		os.Exit(1)
	}
}
