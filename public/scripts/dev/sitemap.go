package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"
)

const baseURL = "https://krisyotam.com"

type URLEntry struct {
	Loc        string
	LastMod    string
	ChangeFreq string
	Priority   string
}

// Content item structures
type Essay struct {
	Slug     string `json:"slug"`
	Category string `json:"category"`
	State    string `json:"state"`
}

type EssaysFile struct {
	Essays []Essay `json:"essays"`
}

type Note struct {
	Slug     string `json:"slug"`
	Category string `json:"category"`
	State    string `json:"state"`
}

type Paper struct {
	Slug     string `json:"slug"`
	Category string `json:"category"`
	State    string `json:"state"`
}

type PapersFile struct {
	Papers []Paper `json:"papers"`
}

type Verse struct {
	Slug  string `json:"slug"`
	Type  string `json:"type"`
	State string `json:"state"`
}

type BlogrollEntry struct {
	Slug     string `json:"slug"`
	Category string `json:"category"`
}

type Symbol struct {
	ID string `json:"id"`
}

type SymbolsFile struct {
	Symbols []Symbol `json:"symbols"`
}

type PageEntry struct {
	Path       string `json:"path"`
	ShowStatus string `json:"show-status"`
}

type PageDirectory struct {
	Pages []PageEntry `json:"pages"`
}

type ArtEntry struct {
	Slug string `json:"slug"`
}

type GalleryEntry struct {
	Slug string `json:"slug"`
}

type SequenceEntry struct {
	Slug  string `json:"slug"`
	State string `json:"state"`
}

type NewsletterEntry struct {
	Slug string `json:"slug"`
}

type NewslettersFile struct {
	Newsletters []NewsletterEntry `json:"newsletters"`
}

type ReferEntry struct {
	Slug string `json:"slug"`
}

type SurveyEntry struct {
	Slug string `json:"slug"`
}

type PromptEntry struct {
	Slug     string `json:"slug"`
	Category string `json:"category"`
}

type ReviewEntry struct {
	Slug     string `json:"slug"`
	Category string `json:"category"`
	State    string `json:"state"`
}

type FictionEntry struct {
	Slug     string `json:"slug"`
	Category string `json:"category"`
	State    string `json:"state"`
}

type ProgymnasmataEntry struct {
	Slug     string `json:"slug"`
	Category string `json:"category"`
	State    string `json:"state"`
}

type ResearchEntry struct {
	Slug     string `json:"slug"`
	Category string `json:"category"`
	Year     string `json:"year"`
	State    string `json:"state"`
}

func main() {
	// Find project root (go up from public/scripts)
	execPath, _ := os.Getwd()
	projectRoot := execPath

	// If running from public/scripts, go up two levels
	if strings.HasSuffix(execPath, "public/scripts") {
		projectRoot = filepath.Join(execPath, "..", "..")
	}

	dataDir := filepath.Join(projectRoot, "data")
	outputPath := filepath.Join(projectRoot, "public", "sitemap.xml")

	var urls []URLEntry
	today := time.Now().Format("2006-01-02")

	// 1. Add homepage
	urls = append(urls, URLEntry{
		Loc:        baseURL,
		LastMod:    today,
		ChangeFreq: "daily",
		Priority:   "1.0",
	})

	// 2. Static pages from page-directory.json
	pageDir := loadPageDirectory(filepath.Join(dataDir, "page-directory.json"))
	for _, page := range pageDir {
		if page.ShowStatus != "active" || page.Path == "/" {
			continue
		}
		urls = append(urls, URLEntry{
			Loc:        baseURL + page.Path,
			LastMod:    today,
			ChangeFreq: "weekly",
			Priority:   "0.8",
		})
	}

	// 3. Essays
	essays := loadEssays(filepath.Join(dataDir, "essays", "essays.json"))
	for _, e := range essays {
		if e.State == "hidden" || e.Slug == "" {
			continue
		}
		cat := slugify(e.Category)
		urls = append(urls, URLEntry{
			Loc:        fmt.Sprintf("%s/essays/%s/%s", baseURL, cat, e.Slug),
			LastMod:    today,
			ChangeFreq: "monthly",
			Priority:   "0.7",
		})
	}

	// 4. Notes
	notes := loadNotes(filepath.Join(dataDir, "notes", "notes.json"))
	for _, n := range notes {
		if n.State == "hidden" || n.Slug == "" {
			continue
		}
		cat := slugify(n.Category)
		urls = append(urls, URLEntry{
			Loc:        fmt.Sprintf("%s/notes/%s/%s", baseURL, cat, n.Slug),
			LastMod:    today,
			ChangeFreq: "monthly",
			Priority:   "0.6",
		})
	}

	// 5. Papers
	papers := loadPapers(filepath.Join(dataDir, "papers", "papers.json"))
	for _, p := range papers {
		if p.State == "hidden" || p.Slug == "" {
			continue
		}
		cat := slugify(p.Category)
		urls = append(urls, URLEntry{
			Loc:        fmt.Sprintf("%s/papers/%s/%s", baseURL, cat, p.Slug),
			LastMod:    today,
			ChangeFreq: "monthly",
			Priority:   "0.7",
		})
	}

	// 6. Verse
	verses := loadVerses(filepath.Join(dataDir, "verse", "verse.json"))
	for _, v := range verses {
		if v.State == "hidden" || v.Slug == "" {
			continue
		}
		urls = append(urls, URLEntry{
			Loc:        fmt.Sprintf("%s/verse/%s/%s", baseURL, v.Type, v.Slug),
			LastMod:    today,
			ChangeFreq: "monthly",
			Priority:   "0.6",
		})
	}

	// 7. Blogroll
	blogroll := loadBlogroll(filepath.Join(dataDir, "blogroll", "blogroll.json"))
	for _, b := range blogroll {
		if b.Slug == "" {
			continue
		}
		urls = append(urls, URLEntry{
			Loc:        fmt.Sprintf("%s/blogroll/%s", baseURL, b.Slug),
			LastMod:    today,
			ChangeFreq: "monthly",
			Priority:   "0.5",
		})
	}

	// 8. Symbols
	symbols := loadSymbols(filepath.Join(dataDir, "symbols.json"))
	for _, s := range symbols {
		if s.ID == "" {
			continue
		}
		urls = append(urls, URLEntry{
			Loc:        fmt.Sprintf("%s/symbols/%s", baseURL, s.ID),
			LastMod:    today,
			ChangeFreq: "yearly",
			Priority:   "0.4",
		})
	}

	// 9. Art
	artEntries := loadArt(filepath.Join(dataDir, "art"))
	for _, a := range artEntries {
		if a.Slug == "" {
			continue
		}
		urls = append(urls, URLEntry{
			Loc:        fmt.Sprintf("%s/art/%s", baseURL, a.Slug),
			LastMod:    today,
			ChangeFreq: "monthly",
			Priority:   "0.5",
		})
	}

	// 10. Gallery
	galleryEntries := loadGallery(filepath.Join(dataDir, "gallery"))
	for _, g := range galleryEntries {
		if g.Slug == "" {
			continue
		}
		urls = append(urls, URLEntry{
			Loc:        fmt.Sprintf("%s/gallery/%s", baseURL, g.Slug),
			LastMod:    today,
			ChangeFreq: "monthly",
			Priority:   "0.5",
		})
	}

	// 11. Sequences
	sequences := loadSequences(filepath.Join(dataDir, "sequences"))
	for _, s := range sequences {
		if s.State == "hidden" || s.Slug == "" {
			continue
		}
		urls = append(urls, URLEntry{
			Loc:        fmt.Sprintf("%s/sequences/%s", baseURL, s.Slug),
			LastMod:    today,
			ChangeFreq: "monthly",
			Priority:   "0.6",
		})
	}

	// 12. Newsletters
	newsletters := loadNewsletters(filepath.Join(dataDir, "newsletters.json"))
	for _, n := range newsletters {
		if n.Slug == "" {
			continue
		}
		urls = append(urls, URLEntry{
			Loc:        fmt.Sprintf("%s/newsletter/articles/%s", baseURL, n.Slug),
			LastMod:    today,
			ChangeFreq: "monthly",
			Priority:   "0.6",
		})
	}

	// 13. Refer entries
	referEntries := loadRefer(filepath.Join(dataDir, "refer"))
	for _, r := range referEntries {
		if r.Slug == "" {
			continue
		}
		urls = append(urls, URLEntry{
			Loc:        fmt.Sprintf("%s/refer/%s", baseURL, r.Slug),
			LastMod:    today,
			ChangeFreq: "monthly",
			Priority:   "0.4",
		})
	}

	// 14. Reviews
	reviews := loadReviews(filepath.Join(dataDir, "reviews"))
	for _, r := range reviews {
		if r.State == "hidden" || r.Slug == "" {
			continue
		}
		cat := slugify(r.Category)
		urls = append(urls, URLEntry{
			Loc:        fmt.Sprintf("%s/reviews/%s/%s", baseURL, cat, r.Slug),
			LastMod:    today,
			ChangeFreq: "monthly",
			Priority:   "0.6",
		})
	}

	// 15. Fiction
	fiction := loadFiction(filepath.Join(dataDir, "fiction"))
	for _, f := range fiction {
		if f.State == "hidden" || f.Slug == "" {
			continue
		}
		cat := slugify(f.Category)
		urls = append(urls, URLEntry{
			Loc:        fmt.Sprintf("%s/fiction/%s/%s", baseURL, cat, f.Slug),
			LastMod:    today,
			ChangeFreq: "monthly",
			Priority:   "0.6",
		})
	}

	// 16. Progymnasmata
	progym := loadProgymnasmata(filepath.Join(dataDir, "progymnasmata"))
	for _, p := range progym {
		if p.State == "hidden" || p.Slug == "" {
			continue
		}
		cat := slugify(p.Category)
		urls = append(urls, URLEntry{
			Loc:        fmt.Sprintf("%s/progymnasmata/%s/%s", baseURL, cat, p.Slug),
			LastMod:    today,
			ChangeFreq: "monthly",
			Priority:   "0.5",
		})
	}

	// 17. Prompts
	prompts := loadPrompts(filepath.Join(dataDir, "prompts"))
	for _, p := range prompts {
		if p.Slug == "" {
			continue
		}
		cat := slugify(p.Category)
		urls = append(urls, URLEntry{
			Loc:        fmt.Sprintf("%s/prompts/%s/%s", baseURL, cat, p.Slug),
			LastMod:    today,
			ChangeFreq: "monthly",
			Priority:   "0.4",
		})
	}

	// Generate XML
	xml := generateSitemapXML(urls)

	// Write to file
	err := os.WriteFile(outputPath, []byte(xml), 0644)
	if err != nil {
		fmt.Printf("Error writing sitemap: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("Sitemap generated: %s\n", outputPath)
	fmt.Printf("Total URLs: %d\n", len(urls))
}

func slugify(s string) string {
	s = strings.ToLower(s)
	s = strings.ReplaceAll(s, " ", "-")
	s = strings.ReplaceAll(s, "&", "and")
	return s
}

func generateSitemapXML(urls []URLEntry) string {
	var sb strings.Builder
	sb.WriteString(`<?xml version="1.0" encoding="UTF-8"?>`)
	sb.WriteString("\n")
	sb.WriteString(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`)
	sb.WriteString("\n")

	for _, u := range urls {
		sb.WriteString("  <url>\n")
		sb.WriteString(fmt.Sprintf("    <loc>%s</loc>\n", escapeXML(u.Loc)))
		sb.WriteString(fmt.Sprintf("    <lastmod>%s</lastmod>\n", u.LastMod))
		sb.WriteString(fmt.Sprintf("    <changefreq>%s</changefreq>\n", u.ChangeFreq))
		sb.WriteString(fmt.Sprintf("    <priority>%s</priority>\n", u.Priority))
		sb.WriteString("  </url>\n")
	}

	sb.WriteString("</urlset>\n")
	return sb.String()
}

func escapeXML(s string) string {
	s = strings.ReplaceAll(s, "&", "&amp;")
	s = strings.ReplaceAll(s, "<", "&lt;")
	s = strings.ReplaceAll(s, ">", "&gt;")
	return s
}

func loadPageDirectory(path string) []PageEntry {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil
	}
	var pd PageDirectory
	json.Unmarshal(data, &pd)
	return pd.Pages
}

func loadEssays(path string) []Essay {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil
	}
	var ef EssaysFile
	if err := json.Unmarshal(data, &ef); err != nil {
		// Try as array
		var essays []Essay
		json.Unmarshal(data, &essays)
		return essays
	}
	return ef.Essays
}

func loadNotes(path string) []Note {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil
	}
	var notes []Note
	json.Unmarshal(data, &notes)
	return notes
}

func loadPapers(path string) []Paper {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil
	}
	var pf PapersFile
	if err := json.Unmarshal(data, &pf); err != nil {
		var papers []Paper
		json.Unmarshal(data, &papers)
		return papers
	}
	return pf.Papers
}

func loadVerses(path string) []Verse {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil
	}
	var verses []Verse
	json.Unmarshal(data, &verses)
	return verses
}

func loadBlogroll(path string) []BlogrollEntry {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil
	}
	var entries []BlogrollEntry
	json.Unmarshal(data, &entries)
	return entries
}

func loadSymbols(path string) []Symbol {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil
	}
	var sf SymbolsFile
	if err := json.Unmarshal(data, &sf); err != nil {
		return nil
	}
	return sf.Symbols
}

func loadArt(dir string) []ArtEntry {
	return loadSlugEntries(filepath.Join(dir, "art.json"))
}

func loadGallery(dir string) []GalleryEntry {
	entries := loadSlugEntries(filepath.Join(dir, "gallery.json"))
	var result []GalleryEntry
	for _, e := range entries {
		result = append(result, GalleryEntry{Slug: e.Slug})
	}
	return result
}

func loadSequences(dir string) []SequenceEntry {
	data, err := os.ReadFile(filepath.Join(dir, "sequences.json"))
	if err != nil {
		return nil
	}
	var entries []SequenceEntry
	json.Unmarshal(data, &entries)
	return entries
}

func loadNewsletters(path string) []NewsletterEntry {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil
	}
	var nf NewslettersFile
	if err := json.Unmarshal(data, &nf); err != nil {
		var entries []NewsletterEntry
		json.Unmarshal(data, &entries)
		return entries
	}
	return nf.Newsletters
}

func loadRefer(dir string) []ReferEntry {
	entries := loadSlugEntries(filepath.Join(dir, "refer.json"))
	var result []ReferEntry
	for _, e := range entries {
		result = append(result, ReferEntry{Slug: e.Slug})
	}
	return result
}

func loadReviews(dir string) []ReviewEntry {
	data, err := os.ReadFile(filepath.Join(dir, "reviews.json"))
	if err != nil {
		return nil
	}
	var entries []ReviewEntry
	json.Unmarshal(data, &entries)
	return entries
}

func loadFiction(dir string) []FictionEntry {
	data, err := os.ReadFile(filepath.Join(dir, "fiction.json"))
	if err != nil {
		return nil
	}
	var entries []FictionEntry
	json.Unmarshal(data, &entries)
	return entries
}

func loadProgymnasmata(dir string) []ProgymnasmataEntry {
	data, err := os.ReadFile(filepath.Join(dir, "progymnasmata.json"))
	if err != nil {
		return nil
	}
	var entries []ProgymnasmataEntry
	json.Unmarshal(data, &entries)
	return entries
}

func loadPrompts(dir string) []PromptEntry {
	data, err := os.ReadFile(filepath.Join(dir, "prompts.json"))
	if err != nil {
		return nil
	}
	var entries []PromptEntry
	json.Unmarshal(data, &entries)
	return entries
}

type SlugEntry struct {
	Slug string `json:"slug"`
}

func loadSlugEntries(path string) []ArtEntry {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil
	}
	var entries []ArtEntry
	json.Unmarshal(data, &entries)
	return entries
}
