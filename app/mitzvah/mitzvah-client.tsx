"use client"

import { useState, useEffect, useRef } from "react"
import mitzvahData from "@/data/mitzvah.json"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useInView } from "react-intersection-observer"

type MitzvahItem = {
  id: number
  law: string
  scripture: string
}

export function MitzvahClient() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredMitzvah, setFilteredMitzvah] = useState<MitzvahItem[]>(mitzvahData)
  const [bibleVersion, setBibleVersion] = useState("kjv")
  const [displayCount, setDisplayCount] = useState(50)
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px",
  })

  // Filter mitzvah based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMitzvah(mitzvahData)
      setDisplayCount(50) // Reset display count when search query changes
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
    setDisplayCount(50) // Reset display count when search query changes
  }, [searchQuery])

  // Infinite scroll - load more items when the user scrolls to the bottom
  useEffect(() => {
    if (inView) {
      setDisplayCount((prevCount) => {
        const newCount = prevCount + 50
        return Math.min(newCount, filteredMitzvah.length)
      })
    }
  }, [inView, filteredMitzvah.length])

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value)
  }

  function generateBibleUrl(scripture: string) {
    // Map of full book names to their abbreviated forms used by Blue Letter Bible
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
    
    try {
      // Extract the book and reference (chapter:verse)
      const parts = scripture.split(' ')
      let book: string
      let reference: string
      
      if (parts.length === 2) {
        // Simple case like "Exodus 20:2"
        book = parts[0]
        reference = parts[1]
      } else {
        // Handle books with spaces like "1 Samuel 15:22"
        book = parts.slice(0, parts.length - 1).join(' ')
        reference = parts[parts.length - 1]
      }
      
      // Split chapter and verse
      const [chapter, verse] = reference.split(':')
      
      // Get the correct book abbreviation
      const bookAbbr = bookAbbreviations[book] || book.toLowerCase()
      
      // Form the URL in the correct format
      return `https://www.blueletterbible.org/${bibleVersion}/${bookAbbr}/${chapter}/${verse}/`
    } catch (error) {
      console.error("Error parsing scripture reference:", error)
      // Fallback to a search URL if parsing fails
      return `https://www.blueletterbible.org/search/search.cfm?Criteria=${encodeURIComponent(scripture)}`
    }
  }

  // Display only the specified number of items
  const itemsToDisplay = filteredMitzvah.slice(0, displayCount)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by law or scripture..."
            value={searchQuery}
            onChange={handleSearch}
            className="max-w-md w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="bible-version" className="text-sm text-muted-foreground">Bible version:</label>
          <select
            id="bible-version"
            value={bibleVersion}
            onChange={(e) => setBibleVersion(e.target.value)}
            className="border rounded px-2 py-1 text-sm bg-background"
          >
            <option value="kjv">KJV</option>
            <option value="nkjv">NKJV</option>
            <option value="nlt">NLT</option>
            <option value="niv">NIV</option>
            <option value="esv">ESV</option>
            <option value="csb">CSB</option>
            <option value="nasb">NASB20</option>
            <option value="nasb95">NASB95</option>
            <option value="lsb">LSB</option>
            <option value="amp">AMP</option>
            <option value="net">NET</option>
            <option value="rsv">RSV</option>
          </select>
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {displayCount < filteredMitzvah.length ? displayCount : filteredMitzvah.length} of {filteredMitzvah.length} laws
        </div>
      </div>

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
                className={`border-b border-border hover:bg-secondary/50 transition-colors ${index % 2 === 0 ? 'bg-transparent' : 'bg-muted/5'}`}
              >
                <td className="py-2 px-3 align-top font-medium">{item.id}</td>
                <td className="py-2 px-3 align-top">{item.law}</td>
                <td className="py-2 px-3 align-top">
                  <Link 
                    href={generateBibleUrl(item.scripture)} 
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
      
      {/* Intersection observer target - when this is visible, load more rows */}
      {filteredMitzvah.length > displayCount && (
        <div ref={ref} className="h-10 flex items-center justify-center">
          <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      )}
    </div>
  )
} 