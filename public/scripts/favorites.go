// ============================================================================
// Favorites Management CLI
// Author: Kris Yotam
// Date: 2026-01-05
// Filename: favorites.go
// Description: CLI tool for managing favorites in media.db.
//              Supports viewing, adding, updating, and removing favorites.
//              Max 4 items per type with positions 1-4.
// Usage: go run favorites.go <command> [args]
// Commands:
//   list [type]          - List all favorites or by type
//   add <type> <pos> <title> <cover> <link> - Add a favorite
//   remove <type> <pos>  - Remove a favorite
//   move <type> <from> <to> - Move favorite position
//   types                - List all favorite types
// ============================================================================

package main

import (
	"database/sql"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	_ "github.com/mattn/go-sqlite3"
)

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type Favorite struct {
	ID       int
	Type     string
	Position int
	Cover    string
	Title    string
	Link     string
}

// ============================================================================
// DATABASE OPERATIONS
// ============================================================================

func getDB() (*sql.DB, error) {
	scriptDir, _ := os.Getwd()
	projectRoot := filepath.Dir(scriptDir)
	if filepath.Base(scriptDir) != "scripts" {
		projectRoot = scriptDir
	}

	dbPath := filepath.Join(projectRoot, "data", "media.db")
	return sql.Open("sqlite3", dbPath)
}

func listFavorites(db *sql.DB, favType string) ([]Favorite, error) {
	var rows *sql.Rows
	var err error

	if favType == "" {
		rows, err = db.Query("SELECT id, type, position, cover, title, link FROM favorites ORDER BY type, position")
	} else {
		rows, err = db.Query("SELECT id, type, position, cover, title, link FROM favorites WHERE type = ? ORDER BY position", favType)
	}
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var favorites []Favorite
	for rows.Next() {
		var f Favorite
		if err := rows.Scan(&f.ID, &f.Type, &f.Position, &f.Cover, &f.Title, &f.Link); err != nil {
			return nil, err
		}
		favorites = append(favorites, f)
	}
	return favorites, nil
}

func addFavorite(db *sql.DB, favType string, position int, title, cover, link string) error {
	if position < 1 || position > 4 {
		return fmt.Errorf("position must be between 1 and 4")
	}

	_, err := db.Exec(
		"INSERT OR REPLACE INTO favorites (type, position, cover, title, link) VALUES (?, ?, ?, ?, ?)",
		favType, position, cover, title, link,
	)
	return err
}

func removeFavorite(db *sql.DB, favType string, position int) error {
	result, err := db.Exec("DELETE FROM favorites WHERE type = ? AND position = ?", favType, position)
	if err != nil {
		return err
	}
	affected, _ := result.RowsAffected()
	if affected == 0 {
		return fmt.Errorf("no favorite found at position %d for type %s", position, favType)
	}
	return nil
}

func moveFavorite(db *sql.DB, favType string, fromPos, toPos int) error {
	if fromPos < 1 || fromPos > 4 || toPos < 1 || toPos > 4 {
		return fmt.Errorf("positions must be between 1 and 4")
	}

	tx, err := db.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// Get source favorite
	var cover, title, link string
	err = tx.QueryRow("SELECT cover, title, link FROM favorites WHERE type = ? AND position = ?", favType, fromPos).
		Scan(&cover, &title, &link)
	if err == sql.ErrNoRows {
		return fmt.Errorf("no favorite found at position %d", fromPos)
	}
	if err != nil {
		return err
	}

	// Delete source
	_, err = tx.Exec("DELETE FROM favorites WHERE type = ? AND position = ?", favType, fromPos)
	if err != nil {
		return err
	}

	// Insert at new position (will replace if exists)
	_, err = tx.Exec("INSERT OR REPLACE INTO favorites (type, position, cover, title, link) VALUES (?, ?, ?, ?, ?)",
		favType, toPos, cover, title, link)
	if err != nil {
		return err
	}

	return tx.Commit()
}

func getTypes(db *sql.DB) ([]string, error) {
	rows, err := db.Query("SELECT DISTINCT type FROM favorites ORDER BY type")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var types []string
	for rows.Next() {
		var t string
		if err := rows.Scan(&t); err != nil {
			return nil, err
		}
		types = append(types, t)
	}
	return types, nil
}

// ============================================================================
// DISPLAY FUNCTIONS
// ============================================================================

func printFavorites(favorites []Favorite) {
	if len(favorites) == 0 {
		fmt.Println("No favorites found.")
		return
	}

	currentType := ""
	for _, f := range favorites {
		if f.Type != currentType {
			if currentType != "" {
				fmt.Println()
			}
			currentType = f.Type
			fmt.Printf("=== %s ===\n", strings.ToUpper(f.Type))
		}
		fmt.Printf("  [%d] %s\n", f.Position, f.Title)
		if f.Link != "" {
			fmt.Printf("      Link: %s\n", f.Link)
		}
	}
}

func printUsage() {
	fmt.Println("Favorites Management CLI")
	fmt.Println()
	fmt.Println("Usage: go run favorites.go <command> [args]")
	fmt.Println()
	fmt.Println("Commands:")
	fmt.Println("  list [type]                         - List all favorites or by type")
	fmt.Println("  add <type> <pos> <title> <cover> <link> - Add a favorite")
	fmt.Println("  remove <type> <pos>                 - Remove a favorite")
	fmt.Println("  move <type> <from> <to>             - Move favorite position")
	fmt.Println("  types                               - List all favorite types")
	fmt.Println()
	fmt.Println("Favorite Types: art, ballet, film, meals, music, plays")
	fmt.Println("Position: 1-4 (max 4 per type)")
}

// ============================================================================
// MAIN
// ============================================================================

func main() {
	if len(os.Args) < 2 {
		printUsage()
		os.Exit(0)
	}

	db, err := getDB()
	if err != nil {
		fmt.Printf("Error opening database: %v\n", err)
		os.Exit(1)
	}
	defer db.Close()

	command := os.Args[1]

	switch command {
	case "list":
		favType := ""
		if len(os.Args) > 2 {
			favType = os.Args[2]
		}
		favorites, err := listFavorites(db, favType)
		if err != nil {
			fmt.Printf("Error listing favorites: %v\n", err)
			os.Exit(1)
		}
		printFavorites(favorites)

	case "add":
		if len(os.Args) < 7 {
			fmt.Println("Usage: go run favorites.go add <type> <pos> <title> <cover> <link>")
			os.Exit(1)
		}
		favType := os.Args[2]
		position, err := strconv.Atoi(os.Args[3])
		if err != nil {
			fmt.Printf("Invalid position: %v\n", err)
			os.Exit(1)
		}
		title := os.Args[4]
		cover := os.Args[5]
		link := os.Args[6]

		if err := addFavorite(db, favType, position, title, cover, link); err != nil {
			fmt.Printf("Error adding favorite: %v\n", err)
			os.Exit(1)
		}
		fmt.Printf("Added '%s' to %s at position %d\n", title, favType, position)

	case "remove":
		if len(os.Args) < 4 {
			fmt.Println("Usage: go run favorites.go remove <type> <pos>")
			os.Exit(1)
		}
		favType := os.Args[2]
		position, err := strconv.Atoi(os.Args[3])
		if err != nil {
			fmt.Printf("Invalid position: %v\n", err)
			os.Exit(1)
		}

		if err := removeFavorite(db, favType, position); err != nil {
			fmt.Printf("Error removing favorite: %v\n", err)
			os.Exit(1)
		}
		fmt.Printf("Removed favorite from %s at position %d\n", favType, position)

	case "move":
		if len(os.Args) < 5 {
			fmt.Println("Usage: go run favorites.go move <type> <from> <to>")
			os.Exit(1)
		}
		favType := os.Args[2]
		fromPos, err := strconv.Atoi(os.Args[3])
		if err != nil {
			fmt.Printf("Invalid from position: %v\n", err)
			os.Exit(1)
		}
		toPos, err := strconv.Atoi(os.Args[4])
		if err != nil {
			fmt.Printf("Invalid to position: %v\n", err)
			os.Exit(1)
		}

		if err := moveFavorite(db, favType, fromPos, toPos); err != nil {
			fmt.Printf("Error moving favorite: %v\n", err)
			os.Exit(1)
		}
		fmt.Printf("Moved %s favorite from position %d to %d\n", favType, fromPos, toPos)

	case "types":
		types, err := getTypes(db)
		if err != nil {
			fmt.Printf("Error getting types: %v\n", err)
			os.Exit(1)
		}
		fmt.Println("Favorite Types:")
		for _, t := range types {
			fmt.Printf("  - %s\n", t)
		}

	default:
		fmt.Printf("Unknown command: %s\n", command)
		printUsage()
		os.Exit(1)
	}
}
