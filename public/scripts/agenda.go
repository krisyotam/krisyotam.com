// -----------------------------------------------------------------------------
// Module:        AgendaSchedulerV1
// File:          agenda.go
// Description:   Generate a daily writing agenda from feed.json using weighted scores
//
//	and output a PDF in /public/agenda with the current date.
//
// Author:        Kris Yotam
// Created:       2025-04-30
// Last Modified: 2025-04-30 10:00:00 (America/Chicago)
// License:       CC-0
//
// Dependencies:
//   - Standard library:
//     – encoding/json
//     – flag
//     – fmt
//     – math
//     – os
//     – path/filepath
//     – sort
//     – time
//   - Third-party modules:
//     – github.com/jung-kurt/gofpdf            // PDF generation
//
// Usage:
//
//	$ go build -o bin/agenda ./cmd/agenda
//	$ ./bin/agenda \
//	    -feed=./data/feed.json \
//	    -dailyMinutes=240 \
//	    -minSlot=15 \
//	    -timeConstant=30
//
// -----------------------------------------------------------------------------
package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"math"
	"os"
	"path/filepath"
	"sort"
	"time"

	"github.com/jung-kurt/gofpdf"
)

var (
	feedPath     string
	dailyMinutes int
	minSlot      int
	timeConstant int
	baseDir      string
)

func init() {
	var err error
	baseDir, err = os.Getwd()
	if err != nil {
		fmt.Fprintln(os.Stderr, "Could not resolve working directory:", err)
		os.Exit(1)
	}

	flag.StringVar(&feedPath, "feed", filepath.Join(baseDir, "data", "blog", "feed.json"), "absolute path to feed.json")
	flag.IntVar(&dailyMinutes, "dailyMinutes", 240, "total minutes available for today")
	flag.IntVar(&minSlot, "minSlot", 15, "minimum minutes per post")
	flag.IntVar(&timeConstant, "timeConstant", 30, "age time constant in days")
}

type Post struct {
	Title      string `json:"title"`
	Status     string `json:"status"`
	Confidence string `json:"confidence"`
	Importance int    `json:"importance"`
	Date       string `json:"date"`
}

type Feed struct {
	Posts []Post `json:"posts"`
}

type Scheduled struct {
	Post
	Score     float64
	Allocated int
}

var statusWeight = map[string]float64{
	"Notes":       0.5,
	"Draft":       0.7,
	"In Progress": 1.0,
}

var confOrder = []string{
	"certain", "highly likely", "likely", "possible",
	"unlikely", "highly unlikely", "remote", "impossible",
}

func parseDate(raw string) (time.Time, error) {
	if t, err := time.Parse("2006-01-02", raw); err == nil {
		return t, nil
	}
	return time.Parse("2006-1-2", raw)
}

func loadFeed(path string) ([]Post, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	var f Feed
	if err := json.Unmarshal(data, &f); err != nil {
		return nil, err
	}
	return f.Posts, nil
}

func computeScore(p Post) float64 {
	if _, ok := statusWeight[p.Status]; !ok {
		return 0
	}
	wI := float64(p.Importance) / 10.0
	wS := statusWeight[p.Status]

	rankC := 0
	for i, v := range confOrder {
		if v == p.Confidence {
			rankC = i
			break
		}
	}
	wC := 1.0 - (float64(rankC)/float64(len(confOrder)-1))*0.8

	date, err := parseDate(p.Date)
	var ageDays float64
	if err == nil {
		ageDays = time.Since(date).Hours() / 24.0
		if ageDays < 0 {
			ageDays = 0
		}
	}
	wA := 1.0 + ageDays/(ageDays+float64(timeConstant))

	return wI * wS * wC * wA
}

func schedule(posts []Post) []Scheduled {
	var sched []Scheduled
	for _, p := range posts {
		score := computeScore(p)
		if score <= 0 {
			continue
		}
		sched = append(sched, Scheduled{Post: p, Score: score})
	}
	sort.Slice(sched, func(i, j int) bool {
		return sched[i].Score > sched[j].Score
	})
	var total float64
	for _, s := range sched {
		total += s.Score
	}
	for i := range sched {
		alloc := int(math.Floor((sched[i].Score/total)*float64(dailyMinutes)/5.0) * 5)
		if alloc < minSlot {
			alloc = minSlot
		}
		sched[i].Allocated = alloc
	}
	return sched
}

func generatePDF(sched []Scheduled) (string, error) {
	outDir := filepath.Join(baseDir, "public", "agenda")
	if err := os.MkdirAll(outDir, 0755); err != nil {
		return "", err
	}
	today := time.Now().Format("2006-01-02")
	outPath := filepath.Join(outDir, fmt.Sprintf("agenda-%s.pdf", today))

	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.AddPage()
	pdf.SetFont("Arial", "B", 16)
	pdf.Cell(0, 10, fmt.Sprintf("Writing Agenda — %s", today))
	pdf.Ln(12)

	pdf.SetFont("Arial", "B", 12)
	pdf.CellFormat(80, 8, "Title", "1", 0, "", false, 0, "")
	pdf.CellFormat(30, 8, "Status", "1", 0, "", false, 0, "")
	pdf.CellFormat(20, 8, "Minutes", "1", 0, "C", false, 0, "")
	pdf.CellFormat(20, 8, "Importance", "1", 0, "C", false, 0, "")
	pdf.CellFormat(40, 8, "Confidence", "1", 0, "", false, 0, "")
	pdf.Ln(-1)

	pdf.SetFont("Arial", "", 12)
	for _, s := range sched {
		pdf.CellFormat(80, 7, s.Title, "1", 0, "", false, 0, "")
		pdf.CellFormat(30, 7, s.Status, "1", 0, "", false, 0, "")
		pdf.CellFormat(20, 7, fmt.Sprintf("%d", s.Allocated), "1", 0, "C", false, 0, "")
		pdf.CellFormat(20, 7, fmt.Sprintf("%d", s.Importance), "1", 0, "C", false, 0, "")
		pdf.CellFormat(40, 7, s.Confidence, "1", 0, "", false, 0, "")
		pdf.Ln(-1)
	}

	if err := pdf.OutputFileAndClose(outPath); err != nil {
		return "", err
	}
	return outPath, nil
}

func main() {
	flag.Parse()

	posts, err := loadFeed(feedPath)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading feed: %v\n", err)
		os.Exit(1)
	}

	sched := schedule(posts)
	outPath, err := generatePDF(sched)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error generating PDF: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("Agenda PDF generated: %s\n", outPath)
}
