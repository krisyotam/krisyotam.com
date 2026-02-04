/**
 * ============================================================================
 * Mitzvah Client Component
 * Author: Kris Yotam
 * Description: Client component for displaying and searching the 613 Mitzvot
 *              (commandments). Fetches data from reference.db via API route.
 * ============================================================================
 */

"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useInView } from "react-intersection-observer"
import { CustomSelect, SelectOption } from "@/components/ui/custom-select"

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type MitzvahItem = {
  id: number
  law: string
  scripture: string
}

// ============================================================================
// BIBLE URL GENERATOR
// ============================================================================

const bookAbbreviations: Record<string, string> = {
  "Genesis": "gen",
  "Exodus": "exo",
  "Leviticus": "lev",
  "Numbers": "num",
  "Deuteronomy": "deu",
  "Joshua": "jos",
  "Judges": "jdg",
  "Ruth": "rth",
  "1 Samuel": "1sa",
  "2 Samuel": "2sa",
  "1 Kings": "1ki",
  "2 Kings": "2ki",
  "1 Chronicles": "1ch",
  "2 Chronicles": "2ch",
  "Ezra": "ezr",
  "Nehemiah": "neh",
  "Esther": "est",
  "Job": "job",
  "Psalms": "psa",
  "Proverbs": "pro",
  "Ecclesiastes": "ecc",
  "Song of Solomon": "sng",
  "Isaiah": "isa",
  "Jeremiah": "jer",
  "Lamentations": "lam",
  "Ezekiel": "eze",
  "Daniel": "dan",
  "Hosea": "hos",
  "Joel": "joe",
  "Amos": "amo",
  "Obadiah": "oba",
  "Jonah": "jon",
  "Micah": "mic",
  "Nahum": "nah",
  "Habakkuk": "hab",
  "Zephaniah": "zep",
  "Haggai": "hag",
  "Zechariah": "zec",
  "Malachi": "mal",
  "Matthew": "mat",
  "Mark": "mar",
  "Luke": "luk",
  "John": "jhn",
  "Acts": "act",
  "Romans": "rom",
  "1 Corinthians": "1co",
  "2 Corinthians": "2co",
  "Galatians": "gal",
  "Ephesians": "eph",
  "Philippians": "php",
  "Colossians": "col",
  "1 Thessalonians": "1th",
  "2 Thessalonians": "2th",
  "1 Timothy": "1ti",
  "2 Timothy": "2ti",
  "Titus": "tit",
  "Philemon": "phm",
  "Hebrews": "heb",
  "James": "jas",
  "1 Peter": "1pe",
  "2 Peter": "2pe",
  "1 John": "1jn",
  "2 John": "2jn",
  "3 John": "3jn",
  "Jude": "jud",
  "Revelation": "rev"
}

function generateBibleUrl(scripture: string, bibleVersion: string): string {
  try {
    const parts = scripture.split(' ')
    let book: string
    let reference: string

    if (parts.length === 2) {
      book = parts[0]
      reference = parts[1]
    } else {
      book = parts.slice(0, parts.length - 1).join(' ')
      reference = parts[parts.length - 1]
    }

    const [chapter, verse] = reference.split(':')
    const bookAbbr = bookAbbreviations[book] || book.toLowerCase()

    return `https://www.blueletterbible.org/${bibleVersion}/${bookAbbr}/${chapter}/${verse}/`
  } catch (error) {
    console.error("Error parsing scripture reference:", error)
    return `https://www.blueletterbible.org/search/search.cfm?Criteria=${encodeURIComponent(scripture)}`
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function MitzvahClient() {
  // ---------------------------------------------------------------------------
  // State Management
  // ---------------------------------------------------------------------------
  const [mitzvahData, setMitzvahData] = useState<MitzvahItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredMitzvah, setFilteredMitzvah] = useState<MitzvahItem[]>([])
  const [bibleVersion, setBibleVersion] = useState("kjv")
  const [displayCount, setDisplayCount] = useState(50)
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px",
  })

  // ---------------------------------------------------------------------------
  // Bible Version Options
  // ---------------------------------------------------------------------------
  const bibleVersionOptions: SelectOption[] = [
    { value: "kjv", label: "KJV" },
    { value: "nkjv", label: "NKJV" },
    { value: "nlt", label: "NLT" },
    { value: "niv", label: "NIV" },
    { value: "esv", label: "ESV" },
    { value: "csb", label: "CSB" },
    { value: "nasb", label: "NASB20" },
    { value: "nasb95", label: "NASB95" },
    { value: "lsb", label: "LSB" },
    { value: "amp", label: "AMP" },
    { value: "net", label: "NET" },
    { value: "rsv", label: "RSV" },
  ]

  // ---------------------------------------------------------------------------
  // Data Fetching
  // ---------------------------------------------------------------------------
  useEffect(() => {
    async function fetchMitzvot() {
      try {
        const response = await fetch("/api/reference?type=mitzvot")
        if (!response.ok) throw new Error("Failed to fetch mitzvot")
        const data = await response.json()
        setMitzvahData(data)
        setFilteredMitzvah(data)
      } catch (error) {
        console.error("Error fetching mitzvot:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchMitzvot()
  }, [])

  // ---------------------------------------------------------------------------
  // Search Filtering
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMitzvah(mitzvahData)
      setDisplayCount(50)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = mitzvahData.filter((item) => {
      return (
        item.law.toLowerCase().includes(query) ||
        item.scripture.toLowerCase().includes(query)
      )
    })

    setFilteredMitzvah(filtered)
    setDisplayCount(50)
  }, [searchQuery, mitzvahData])

  // ---------------------------------------------------------------------------
  // Infinite Scroll
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (inView) {
      setDisplayCount((prevCount) => {
        const newCount = prevCount + 50
        return Math.min(newCount, filteredMitzvah.length)
      })
    }
  }, [inView, filteredMitzvah.length])

  // ---------------------------------------------------------------------------
  // Event Handlers
  // ---------------------------------------------------------------------------
  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value)
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  const itemsToDisplay = filteredMitzvah.slice(0, displayCount)

  return (
    <div className="space-y-6">
      {/* Search and Controls Bar */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search by law or scripture..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full h-9 px-3 py-2 border rounded-none text-sm bg-background hover:bg-secondary/50 focus:outline-none focus:bg-secondary/50"
          />
        </div>
        <div className="flex items-center gap-2 whitespace-nowrap">
          <label htmlFor="bible-version" className="text-sm text-muted-foreground">Bible version:</label>
          <CustomSelect
            id="bible-version"
            value={bibleVersion}
            onValueChange={setBibleVersion}
            options={bibleVersionOptions}
            className="text-sm min-w-[140px]"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {displayCount < filteredMitzvah.length ? displayCount : filteredMitzvah.length} of {filteredMitzvah.length} laws
        </div>
      </div>

      {/* Mitzvot Table */}
      <div className="border border-border overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-foreground">
              <th className="py-2 px-3 text-left font-medium w-16">#</th>
              <th className="py-2 px-3 text-left font-medium">Law</th>
              <th className="py-2 px-3 text-left font-medium w-36">Scripture</th>
            </tr>
          </thead>
          <tbody>
            {itemsToDisplay.map((item, index) => (
              <tr
                key={item.id}
                className={`border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer ${index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'}`}
              >
                <td className="py-2 px-3 align-top font-medium">{item.id}</td>
                <td className="py-2 px-3 align-top">{item.law}</td>
                <td className="py-2 px-3 align-top">
                  <Link
                    href={generateBibleUrl(item.scripture, bibleVersion)}
                    target="_blank"
                    className="text-primary hover:underline"
                  >
                    {item.scripture}
                  </Link>
                </td>
              </tr>
            ))}
            {filteredMitzvah.length === 0 && (
              <tr>
                <td colSpan={3} className="py-8 text-center text-muted-foreground">
                  No mitzvah laws found for your search query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Infinite Scroll Loader */}
      {filteredMitzvah.length > displayCount && (
        <div ref={ref} className="h-10 flex items-center justify-center">
          <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      )}
    </div>
  )
}
