// ============================================================================
// Media Database Migration Script
// Author: Kris Yotam
// Date: 2026-01-05
// Filename: media.go
// Description: Migrates media JSON files to SQLite database (media.db).
//              Includes film data, favorites, music playlists, and games.
// Usage: go run media.go
// ============================================================================

package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	_ "github.com/mattn/go-sqlite3"
)

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

// Film types
type FavActor struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Image string `json:"image"`
}

type FavDirector struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Image string `json:"image"`
}

type FavFilmCharacter struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Image string `json:"image"`
	Actor string `json:"actor"`
}

type FavFilmCompany struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Image       string `json:"image"`
	Description string `json:"description"`
}

type FavProducer struct {
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Works       []string `json:"works"`
}

type Movie struct {
	ID            string   `json:"id"`
	Title         string   `json:"title"`
	Year          int      `json:"year"`
	PosterURL     string   `json:"posterUrl"`
	Genres        []string `json:"genres"`
	Runtime       int      `json:"runtime"`
	Director      string   `json:"director"`
	LastWatchedAt string   `json:"last_watched_at"`
	Rating        float64  `json:"rating"`
	Overview      string   `json:"overview"`
	TimesWatched  int      `json:"times_watched"`
}

type WatchedFilm struct {
	ID            int         `json:"id"`
	TmdbID        int         `json:"tmdbId"`
	LetterboxdURL string      `json:"letterboxdUrl"`
	WatchedDate   string      `json:"watchedDate"`
	Name          string      `json:"name"`
	Year          string      `json:"year"`
	Synopsis      string      `json:"synopsis"`
	Poster        string      `json:"poster"`
	Rating        interface{} `json:"rating"` // Can be empty string or number
	Director      []string    `json:"director"`
	Cast          []string    `json:"cast"`
	Studios       []string    `json:"studios"`
	Countries     []string    `json:"countries"`
	Languages     []string    `json:"languages"`
	Genres        []string    `json:"genres"`
	Runtime       string      `json:"runtime"` // e.g. "115 mins"
	ReleaseDate   string      `json:"releaseDate"`
	Budget        int64       `json:"budget"`
	Revenue       int64       `json:"revenue"`
}

// Favorites type
type Favorite struct {
	Cover      string `json:"cover"`
	AlbumCover string `json:"albumCover"` // For music favorites
	Title      string `json:"title"`
	Link       string `json:"link"`
}

// Music type
type MusicPlaylist struct {
	PlaylistName  string `json:"playlist_name"`
	Slug          string `json:"slug"`
	CoverURL      string `json:"cover_url"`
	AmountOfSongs string `json:"amount_of_songs"`
	LastUpdated   string `json:"last_updated"`
	Category      string `json:"category"`
	Tidal         string `json:"tidal"`
	Qobuz         string `json:"qobuz"`
	AppleMusic    string `json:"apple_music"`
	Spotify       string `json:"spotify"`
	Status        string `json:"status"`
}

type MusicData struct {
	Music []MusicPlaylist `json:"music"`
}

// Game types
type GameCharacter struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Game        string `json:"game"`
	Role        string `json:"role"`
	AvatarImage string `json:"avatarImage"`
	Description string `json:"description"`
}

type GameConsole struct {
	ID           string `json:"id"`
	Name         string `json:"name"`
	Manufacturer string `json:"manufacturer"`
	ReleaseDate  string `json:"releaseDate"`
	CoverImage   string `json:"coverImage"`
}

type Game struct {
	ID             string   `json:"id"`
	Name           string   `json:"name"`
	Version        string   `json:"version"`
	ReleaseDate    string   `json:"releaseDate"`
	Console        string   `json:"console"`
	HoursPlayed    int      `json:"hoursPlayed"`
	Genre          []string `json:"genre"`
	CoverImage     string   `json:"coverImage"`
	Developer      string   `json:"developer"`
	Publisher      string   `json:"publisher"`
	Rating         float64  `json:"rating"`
	Favorite       bool     `json:"favorite"`
	FavoriteWeight float64  `json:"favoriteWeight"`
	DateLastPlayed string   `json:"dateLastPlayed"`
}

type GamePlatform struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Company     string `json:"company"`
	ReleaseDate string `json:"releaseDate"`
	CoverImage  string `json:"coverImage"`
	Description string `json:"description"`
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

func toJSON(v interface{}) string {
	if v == nil {
		return "[]"
	}
	data, err := json.Marshal(v)
	if err != nil {
		return "[]"
	}
	return string(data)
}

func readJSON(path string, v interface{}) error {
	data, err := os.ReadFile(path)
	if err != nil {
		return err
	}
	return json.Unmarshal(data, v)
}

// ============================================================================
// MIGRATION FUNCTIONS
// ============================================================================

func migrateFavActors(db *sql.DB, dataDir string) error {
	fmt.Println("  Migrating fav_actors...")
	var actors []FavActor
	if err := readJSON(filepath.Join(dataDir, "film", "fav-actors.json"), &actors); err != nil {
		fmt.Printf("    Skipping (file not found)\n")
		return nil
	}

	stmt, err := db.Prepare("INSERT OR REPLACE INTO fav_actors (id, name, image) VALUES (?, ?, ?)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	for _, a := range actors {
		if _, err := stmt.Exec(a.ID, a.Name, a.Image); err != nil {
			return err
		}
	}
	fmt.Printf("    Inserted %d actors\n", len(actors))
	return nil
}

func migrateFavDirectors(db *sql.DB, dataDir string) error {
	fmt.Println("  Migrating fav_directors...")
	var directors []FavDirector
	if err := readJSON(filepath.Join(dataDir, "film", "fav-directors.json"), &directors); err != nil {
		fmt.Printf("    Skipping (file not found)\n")
		return nil
	}

	stmt, err := db.Prepare("INSERT OR REPLACE INTO fav_directors (id, name, image) VALUES (?, ?, ?)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	for _, d := range directors {
		if _, err := stmt.Exec(d.ID, d.Name, d.Image); err != nil {
			return err
		}
	}
	fmt.Printf("    Inserted %d directors\n", len(directors))
	return nil
}

func migrateFavFilmCharacters(db *sql.DB, dataDir string) error {
	fmt.Println("  Migrating fav_film_characters...")
	var characters []FavFilmCharacter
	if err := readJSON(filepath.Join(dataDir, "film", "fav-film-characters.json"), &characters); err != nil {
		fmt.Printf("    Skipping (file not found)\n")
		return nil
	}

	stmt, err := db.Prepare("INSERT OR REPLACE INTO fav_film_characters (id, name, image, actor) VALUES (?, ?, ?, ?)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	for _, c := range characters {
		if _, err := stmt.Exec(c.ID, c.Name, c.Image, c.Actor); err != nil {
			return err
		}
	}
	fmt.Printf("    Inserted %d characters\n", len(characters))
	return nil
}

func migrateFavFilmCompanies(db *sql.DB, dataDir string) error {
	fmt.Println("  Migrating fav_film_companies...")
	var companies []FavFilmCompany
	if err := readJSON(filepath.Join(dataDir, "film", "fav-film-companies.json"), &companies); err != nil {
		fmt.Printf("    Skipping (file not found)\n")
		return nil
	}

	stmt, err := db.Prepare("INSERT OR REPLACE INTO fav_film_companies (id, name, image, description) VALUES (?, ?, ?, ?)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	for _, c := range companies {
		if _, err := stmt.Exec(c.ID, c.Name, c.Image, c.Description); err != nil {
			return err
		}
	}
	fmt.Printf("    Inserted %d companies\n", len(companies))
	return nil
}

func migrateFavProducers(db *sql.DB, dataDir string) error {
	fmt.Println("  Migrating fav_producers...")
	var producers []FavProducer
	if err := readJSON(filepath.Join(dataDir, "film", "fav-producers.json"), &producers); err != nil {
		fmt.Printf("    Skipping (file not found)\n")
		return nil
	}

	stmt, err := db.Prepare("INSERT OR IGNORE INTO fav_producers (name, description, works) VALUES (?, ?, ?)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	for _, p := range producers {
		if _, err := stmt.Exec(p.Name, p.Description, toJSON(p.Works)); err != nil {
			return err
		}
	}
	fmt.Printf("    Inserted %d producers\n", len(producers))
	return nil
}

func migrateMovies(db *sql.DB, dataDir string) error {
	fmt.Println("  Migrating movies...")
	var movies []Movie
	if err := readJSON(filepath.Join(dataDir, "film", "movies.json"), &movies); err != nil {
		fmt.Printf("    Skipping (file not found)\n")
		return nil
	}

	stmt, err := db.Prepare(`INSERT OR REPLACE INTO movies
		(id, title, year, poster_url, genres, runtime, director, last_watched_at, rating, overview, times_watched)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	for _, m := range movies {
		if _, err := stmt.Exec(m.ID, m.Title, m.Year, m.PosterURL, toJSON(m.Genres), m.Runtime, m.Director, m.LastWatchedAt, m.Rating, m.Overview, m.TimesWatched); err != nil {
			return err
		}
	}
	fmt.Printf("    Inserted %d movies\n", len(movies))
	return nil
}

func migrateWatched(db *sql.DB, dataDir string) error {
	fmt.Println("  Migrating watched...")
	var watched []WatchedFilm
	if err := readJSON(filepath.Join(dataDir, "film", "watched.json"), &watched); err != nil {
		fmt.Printf("    Skipping (file not found)\n")
		return nil
	}

	stmt, err := db.Prepare(`INSERT OR REPLACE INTO watched
		(id, tmdb_id, letterboxd_url, watched_date, name, year, synopsis, poster, rating, director, cast, studios, countries, languages, genres, runtime, release_date, budget, revenue)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	for _, w := range watched {
		// Convert rating to string
		ratingStr := ""
		if w.Rating != nil {
			switch v := w.Rating.(type) {
			case string:
				ratingStr = v
			case float64:
				ratingStr = fmt.Sprintf("%.1f", v)
			}
		}
		if _, err := stmt.Exec(w.ID, w.TmdbID, w.LetterboxdURL, w.WatchedDate, w.Name, w.Year, w.Synopsis, w.Poster, ratingStr, toJSON(w.Director), toJSON(w.Cast), toJSON(w.Studios), toJSON(w.Countries), toJSON(w.Languages), toJSON(w.Genres), w.Runtime, w.ReleaseDate, w.Budget, w.Revenue); err != nil {
			return err
		}
	}
	fmt.Printf("    Inserted %d watched films\n", len(watched))
	return nil
}

func migrateFavorites(db *sql.DB, dataDir string) error {
	fmt.Println("  Migrating favorites...")

	favoriteTypes := []string{"art", "ballet", "film", "meals", "music", "plays"}

	stmt, err := db.Prepare("INSERT OR REPLACE INTO favorites (type, position, cover, title, link) VALUES (?, ?, ?, ?, ?)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	totalCount := 0
	for _, favType := range favoriteTypes {
		var favorites []Favorite
		filePath := filepath.Join(dataDir, "favorites", favType+".json")
		if err := readJSON(filePath, &favorites); err != nil {
			fmt.Printf("    Warning: Could not read %s.json: %v\n", favType, err)
			continue
		}

		// Max 4 favorites per type
		limit := 4
		if len(favorites) < limit {
			limit = len(favorites)
		}

		for i := 0; i < limit; i++ {
			f := favorites[i]
			cover := f.Cover
			if cover == "" {
				cover = f.AlbumCover // For music favorites
			}
			position := i + 1
			if _, err := stmt.Exec(favType, position, cover, f.Title, f.Link); err != nil {
				return err
			}
			totalCount++
		}
		fmt.Printf("    Inserted %d %s favorites\n", limit, favType)
	}
	fmt.Printf("    Total favorites: %d\n", totalCount)
	return nil
}

func migrateMusic(db *sql.DB, dataDir string) error {
	fmt.Println("  Migrating music playlists...")
	var musicData MusicData
	if err := readJSON(filepath.Join(dataDir, "music", "music.json"), &musicData); err != nil {
		fmt.Printf("    Skipping (file not found)\n")
		return nil
	}

	stmt, err := db.Prepare(`INSERT OR IGNORE INTO music
		(playlist_name, slug, cover_url, amount_of_songs, last_updated, category, tidal, qobuz, apple_music, spotify, status)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	for _, m := range musicData.Music {
		status := m.Status
		if status == "" {
			status = "active"
		}
		// Convert amount_of_songs string to int
		amountOfSongs := 0
		if m.AmountOfSongs != "" {
			fmt.Sscanf(m.AmountOfSongs, "%d", &amountOfSongs)
		}
		if _, err := stmt.Exec(m.PlaylistName, m.Slug, m.CoverURL, amountOfSongs, m.LastUpdated, m.Category, m.Tidal, m.Qobuz, m.AppleMusic, m.Spotify, status); err != nil {
			return err
		}
	}
	fmt.Printf("    Inserted %d playlists\n", len(musicData.Music))
	return nil
}

func migrateGameCharacters(db *sql.DB, dataDir string) error {
	fmt.Println("  Migrating game_characters...")
	var characters []GameCharacter
	if err := readJSON(filepath.Join(dataDir, "games", "characters.json"), &characters); err != nil {
		return fmt.Errorf("reading characters.json: %w", err)
	}

	stmt, err := db.Prepare("INSERT OR REPLACE INTO game_characters (id, name, game, role, avatar_image, description) VALUES (?, ?, ?, ?, ?, ?)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	for _, c := range characters {
		if _, err := stmt.Exec(c.ID, c.Name, c.Game, c.Role, c.AvatarImage, c.Description); err != nil {
			return err
		}
	}
	fmt.Printf("    Inserted %d game characters\n", len(characters))
	return nil
}

func migrateGameConsoles(db *sql.DB, dataDir string) error {
	fmt.Println("  Migrating game_consoles...")
	var consoles []GameConsole
	if err := readJSON(filepath.Join(dataDir, "games", "consoles.json"), &consoles); err != nil {
		return fmt.Errorf("reading consoles.json: %w", err)
	}

	stmt, err := db.Prepare("INSERT OR REPLACE INTO game_consoles (id, name, manufacturer, release_date, cover_image) VALUES (?, ?, ?, ?, ?)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	for _, c := range consoles {
		if _, err := stmt.Exec(c.ID, c.Name, c.Manufacturer, c.ReleaseDate, c.CoverImage); err != nil {
			return err
		}
	}
	fmt.Printf("    Inserted %d game consoles\n", len(consoles))
	return nil
}

func migrateGames(db *sql.DB, dataDir string) error {
	fmt.Println("  Migrating games...")
	var games []Game
	if err := readJSON(filepath.Join(dataDir, "games", "games.json"), &games); err != nil {
		return fmt.Errorf("reading games.json: %w", err)
	}

	stmt, err := db.Prepare(`INSERT OR REPLACE INTO games
		(id, name, version, release_date, console, hours_played, genres, cover_image, developer, publisher, rating, favorite, favorite_weight, date_last_played)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	for _, g := range games {
		favorite := 0
		if g.Favorite {
			favorite = 1
		}
		if _, err := stmt.Exec(g.ID, g.Name, g.Version, g.ReleaseDate, g.Console, g.HoursPlayed, toJSON(g.Genre), g.CoverImage, g.Developer, g.Publisher, g.Rating, favorite, g.FavoriteWeight, g.DateLastPlayed); err != nil {
			return err
		}
	}
	fmt.Printf("    Inserted %d games\n", len(games))
	return nil
}

func migrateGamePlatforms(db *sql.DB, dataDir string) error {
	fmt.Println("  Migrating game_platforms...")
	var platforms []GamePlatform
	if err := readJSON(filepath.Join(dataDir, "games", "platforms.json"), &platforms); err != nil {
		return fmt.Errorf("reading platforms.json: %w", err)
	}

	stmt, err := db.Prepare("INSERT OR REPLACE INTO game_platforms (id, name, company, release_date, cover_image, description) VALUES (?, ?, ?, ?, ?, ?)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	for _, p := range platforms {
		if _, err := stmt.Exec(p.ID, p.Name, p.Company, p.ReleaseDate, p.CoverImage, p.Description); err != nil {
			return err
		}
	}
	fmt.Printf("    Inserted %d game platforms\n", len(platforms))
	return nil
}

// ============================================================================
// MAIN
// ============================================================================

func main() {
	fmt.Println("============================================================================")
	fmt.Println("Media Database Migration")
	fmt.Println("============================================================================")

	// Paths
	scriptDir, _ := os.Getwd()
	projectRoot := filepath.Dir(scriptDir)
	if filepath.Base(scriptDir) != "scripts" {
		projectRoot = scriptDir
	}

	dataDir := filepath.Join(projectRoot, "data")
	dbPath := filepath.Join(dataDir, "media.db")
	schemaPath := filepath.Join(projectRoot, "scripts", "media-schema.sql")

	fmt.Printf("Project root: %s\n", projectRoot)
	fmt.Printf("Database path: %s\n", dbPath)
	fmt.Printf("Schema path: %s\n", schemaPath)

	// Check if database exists
	if _, err := os.Stat(dbPath); err == nil {
		fmt.Println("Using existing database (will add new tables)...")
	} else {
		fmt.Println("Creating new database...")
	}

	// Open database
	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		fmt.Printf("Error opening database: %v\n", err)
		os.Exit(1)
	}
	defer db.Close()

	// Read and execute schema
	fmt.Println("Creating schema...")
	schema, err := os.ReadFile(schemaPath)
	if err != nil {
		fmt.Printf("Error reading schema: %v\n", err)
		os.Exit(1)
	}

	if _, err := db.Exec(string(schema)); err != nil {
		fmt.Printf("Error executing schema: %v\n", err)
		os.Exit(1)
	}

	// Run migrations
	fmt.Println("\nMigrating data...")

	migrations := []func(*sql.DB, string) error{
		migrateFavActors,
		migrateFavDirectors,
		migrateFavFilmCharacters,
		migrateFavFilmCompanies,
		migrateFavProducers,
		migrateMovies,
		migrateWatched,
		migrateFavorites,
		migrateMusic,
		migrateGameCharacters,
		migrateGameConsoles,
		migrateGames,
		migrateGamePlatforms,
	}

	for _, migrate := range migrations {
		if err := migrate(db, dataDir); err != nil {
			fmt.Printf("Migration error: %v\n", err)
			os.Exit(1)
		}
	}

	fmt.Println("\n============================================================================")
	fmt.Println("Migration complete!")
	fmt.Println("============================================================================")
}
