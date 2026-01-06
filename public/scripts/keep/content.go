// content.go - TUI tool for browsing content.db
//
// Usage:
//   go run scripts/content.go [command]
//
// Commands:
//   tags        List all tags
//   categories  List all categories
//   types       List content types with counts
//   content     List all content
//   essays      List essays
//   notes       List notes
//   blog        List blog posts
//   papers      List papers
//   verse       List verse
//   reviews     List reviews
//   fiction     List fiction
//   news        List news
//   ocs         List OCs
//   progymnasmata List progymnasmata
//   sequences   List sequences
//   stats       Show database statistics

package main

import (
	"database/sql"
	"fmt"
	"os"
	"strings"
	"text/tabwriter"

	_ "github.com/mattn/go-sqlite3"
)

const dbPath = "../data/content.db"

func main() {
	if len(os.Args) < 2 {
		printUsage()
		os.Exit(1)
	}

	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error opening database: %v\n", err)
		os.Exit(1)
	}
	defer db.Close()

	cmd := strings.ToLower(os.Args[1])

	switch cmd {
	case "tags":
		listTags(db)
	case "categories":
		listCategories(db)
	case "types":
		listTypes(db)
	case "content":
		listContent(db, "")
	case "essays":
		listContent(db, "essays")
	case "notes":
		listContent(db, "notes")
	case "blog":
		listContent(db, "blog")
	case "papers":
		listContent(db, "papers")
	case "verse":
		listContent(db, "verse")
	case "reviews":
		listContent(db, "reviews")
	case "fiction":
		listContent(db, "fiction")
	case "news":
		listContent(db, "news")
	case "ocs":
		listContent(db, "ocs")
	case "progymnasmata":
		listContent(db, "progymnasmata")
	case "sequences":
		listSequences(db)
	case "stats":
		showStats(db)
	default:
		fmt.Fprintf(os.Stderr, "Unknown command: %s\n\n", cmd)
		printUsage()
		os.Exit(1)
	}
}

func printUsage() {
	fmt.Println("content.go - TUI for browsing content.db")
	fmt.Println()
	fmt.Println("Usage: go run scripts/content.go [command]")
	fmt.Println()
	fmt.Println("Commands:")
	fmt.Println("  tags          List all tags")
	fmt.Println("  categories    List all categories")
	fmt.Println("  types         List content types with counts")
	fmt.Println("  content       List all content")
	fmt.Println("  essays        List essays")
	fmt.Println("  notes         List notes")
	fmt.Println("  blog          List blog posts")
	fmt.Println("  papers        List papers")
	fmt.Println("  verse         List verse")
	fmt.Println("  reviews       List reviews")
	fmt.Println("  fiction       List fiction")
	fmt.Println("  news          List news")
	fmt.Println("  ocs           List OCs")
	fmt.Println("  progymnasmata List progymnasmata")
	fmt.Println("  sequences     List sequences")
	fmt.Println("  stats         Show database statistics")
}

func listTags(db *sql.DB) {
	rows, err := db.Query(`
		SELECT t.slug, t.title, COUNT(ct.content_id) as usage
		FROM tags t
		LEFT JOIN content_tags ct ON t.id = ct.tag_id
		GROUP BY t.id
		ORDER BY usage DESC, t.title ASC
	`)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		return
	}
	defer rows.Close()

	w := tabwriter.NewWriter(os.Stdout, 0, 0, 2, ' ', 0)
	fmt.Fprintln(w, "SLUG\tTITLE\tUSAGE")
	fmt.Fprintln(w, "----\t-----\t-----")

	count := 0
	for rows.Next() {
		var slug, title string
		var usage int
		rows.Scan(&slug, &title, &usage)
		fmt.Fprintf(w, "%s\t%s\t%d\n", slug, title, usage)
		count++
	}
	w.Flush()
	fmt.Printf("\nTotal: %d tags\n", count)
}

func listCategories(db *sql.DB) {
	rows, err := db.Query(`
		SELECT c.slug, c.title, c.importance, COUNT(ct.id) as usage
		FROM categories c
		LEFT JOIN content ct ON c.slug = ct.category_slug
		GROUP BY c.id
		ORDER BY usage DESC, c.title ASC
	`)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		return
	}
	defer rows.Close()

	w := tabwriter.NewWriter(os.Stdout, 0, 0, 2, ' ', 0)
	fmt.Fprintln(w, "SLUG\tTITLE\tIMPORTANCE\tUSAGE")
	fmt.Fprintln(w, "----\t-----\t----------\t-----")

	count := 0
	for rows.Next() {
		var slug, title string
		var importance, usage int
		rows.Scan(&slug, &title, &importance, &usage)
		fmt.Fprintf(w, "%s\t%s\t%d\t%d\n", slug, title, importance, usage)
		count++
	}
	w.Flush()
	fmt.Printf("\nTotal: %d categories\n", count)
}

func listTypes(db *sql.DB) {
	rows, err := db.Query(`
		SELECT type, COUNT(*) as count
		FROM content
		GROUP BY type
		ORDER BY count DESC
	`)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		return
	}
	defer rows.Close()

	w := tabwriter.NewWriter(os.Stdout, 0, 0, 2, ' ', 0)
	fmt.Fprintln(w, "TYPE\tCOUNT")
	fmt.Fprintln(w, "----\t-----")

	total := 0
	for rows.Next() {
		var contentType string
		var count int
		rows.Scan(&contentType, &count)
		fmt.Fprintf(w, "%s\t%d\n", contentType, count)
		total += count
	}
	w.Flush()
	fmt.Printf("\nTotal: %d content items\n", total)
}

func listContent(db *sql.DB, contentType string) {
	query := `
		SELECT type, slug, title, COALESCE(status, '-'), COALESCE(start_date, '-'), state
		FROM content
	`
	args := []interface{}{}

	if contentType != "" {
		query += " WHERE type = ?"
		args = append(args, contentType)
	}
	query += " ORDER BY start_date DESC, title ASC"

	rows, err := db.Query(query, args...)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		return
	}
	defer rows.Close()

	w := tabwriter.NewWriter(os.Stdout, 0, 0, 2, ' ', 0)
	if contentType == "" {
		fmt.Fprintln(w, "TYPE\tSLUG\tTITLE\tSTATUS\tDATE\tSTATE")
		fmt.Fprintln(w, "----\t----\t-----\t------\t----\t-----")
	} else {
		fmt.Fprintln(w, "SLUG\tTITLE\tSTATUS\tDATE\tSTATE")
		fmt.Fprintln(w, "----\t-----\t------\t----\t-----")
	}

	count := 0
	for rows.Next() {
		var ctype, slug, title, status, date, state string
		rows.Scan(&ctype, &slug, &title, &status, &date, &state)

		// Truncate title if too long
		if len(title) > 50 {
			title = title[:47] + "..."
		}

		if contentType == "" {
			fmt.Fprintf(w, "%s\t%s\t%s\t%s\t%s\t%s\n", ctype, slug, title, status, date, state)
		} else {
			fmt.Fprintf(w, "%s\t%s\t%s\t%s\t%s\n", slug, title, status, date, state)
		}
		count++
	}
	w.Flush()

	if contentType == "" {
		fmt.Printf("\nTotal: %d content items\n", count)
	} else {
		fmt.Printf("\nTotal: %d %s items\n", count, contentType)
	}
}

func listSequences(db *sql.DB) {
	rows, err := db.Query(`
		SELECT s.slug, s.title, COALESCE(s.status, '-'), COUNT(sc.id) as posts
		FROM sequences s
		LEFT JOIN sequence_content sc ON s.id = sc.sequence_id
		GROUP BY s.id
		ORDER BY s.title ASC
	`)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		return
	}
	defer rows.Close()

	w := tabwriter.NewWriter(os.Stdout, 0, 0, 2, ' ', 0)
	fmt.Fprintln(w, "SLUG\tTITLE\tSTATUS\tPOSTS")
	fmt.Fprintln(w, "----\t-----\t------\t-----")

	count := 0
	for rows.Next() {
		var slug, title, status string
		var posts int
		rows.Scan(&slug, &title, &status, &posts)

		if len(title) > 50 {
			title = title[:47] + "..."
		}
		fmt.Fprintf(w, "%s\t%s\t%s\t%d\n", slug, title, status, posts)
		count++
	}
	w.Flush()
	fmt.Printf("\nTotal: %d sequences\n", count)
}

func showStats(db *sql.DB) {
	fmt.Println("=== content.db Statistics ===")
	fmt.Println()

	// Basic counts
	var categories, tags, content, sequences int
	db.QueryRow("SELECT COUNT(*) FROM categories").Scan(&categories)
	db.QueryRow("SELECT COUNT(*) FROM tags").Scan(&tags)
	db.QueryRow("SELECT COUNT(*) FROM content").Scan(&content)
	db.QueryRow("SELECT COUNT(*) FROM sequences").Scan(&sequences)

	fmt.Printf("Categories:  %d\n", categories)
	fmt.Printf("Tags:        %d\n", tags)
	fmt.Printf("Content:     %d\n", content)
	fmt.Printf("Sequences:   %d\n", sequences)

	// Content by type
	fmt.Println()
	fmt.Println("Content by type:")
	rows, err := db.Query("SELECT type, COUNT(*) FROM content GROUP BY type ORDER BY COUNT(*) DESC")
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var t string
			var c int
			rows.Scan(&t, &c)
			fmt.Printf("  %-15s %d\n", t, c)
		}
	}

	// Content by state
	fmt.Println()
	fmt.Println("Content by state:")
	rows2, err := db.Query("SELECT state, COUNT(*) FROM content GROUP BY state ORDER BY COUNT(*) DESC")
	if err == nil {
		defer rows2.Close()
		for rows2.Next() {
			var s string
			var c int
			rows2.Scan(&s, &c)
			fmt.Printf("  %-15s %d\n", s, c)
		}
	}

	// Content by status
	fmt.Println()
	fmt.Println("Content by status:")
	rows3, err := db.Query("SELECT COALESCE(status, 'NULL'), COUNT(*) FROM content GROUP BY status ORDER BY COUNT(*) DESC")
	if err == nil {
		defer rows3.Close()
		for rows3.Next() {
			var s string
			var c int
			rows3.Scan(&s, &c)
			fmt.Printf("  %-15s %d\n", s, c)
		}
	}

	// Top tags
	fmt.Println()
	fmt.Println("Top 10 tags:")
	rows4, err := db.Query(`
		SELECT t.title, COUNT(ct.content_id) as usage
		FROM tags t
		JOIN content_tags ct ON t.id = ct.tag_id
		GROUP BY t.id
		ORDER BY usage DESC
		LIMIT 10
	`)
	if err == nil {
		defer rows4.Close()
		for rows4.Next() {
			var t string
			var c int
			rows4.Scan(&t, &c)
			fmt.Printf("  %-25s %d\n", t, c)
		}
	}
}
