"use client"

import { Fragment } from "react"
import { WikiTerm } from "./wiki-term"

interface WikiTermData {
  term: string
  url: string
}

interface WikiTextProps {
  text: string
  terms: WikiTermData[]
}

export function WikiText({ text, terms }: WikiTextProps) {
  // Function to parse text and highlight terms
  const parseText = () => {
    const result = []
    let lastIndex = 0

    // Sort terms by length (descending) to handle overlapping terms correctly
    const sortedTerms = [...terms].sort((a, b) => b.term.length - a.term.length)

    // Find all occurrences of all terms
    const matches = []
    for (const { term, url } of sortedTerms) {
      const regex = new RegExp(`\\b${term}\\b`, "gi")
      let match
      while ((match = regex.exec(text)) !== null) {
        matches.push({
          term,
          url,
          index: match.index,
          length: term.length,
        })
      }
    }

    // Sort matches by index
    matches.sort((a, b) => a.index - b.index)

    // Filter out overlapping matches
    const filteredMatches = []
    let lastEnd = 0
    for (const match of matches) {
      if (match.index >= lastEnd) {
        filteredMatches.push(match)
        lastEnd = match.index + match.length
      }
    }

    // Build result with highlighted terms
    for (const match of filteredMatches) {
      // Add text before the match
      if (match.index > lastIndex) {
        result.push(<Fragment key={`text-${lastIndex}`}>{text.substring(lastIndex, match.index)}</Fragment>)
      }

      // Add the highlighted term
      result.push(
        <WikiTerm key={`term-${match.index}`} term={match.term} url={match.url}>
          {text.substring(match.index, match.index + match.length)}
        </WikiTerm>,
      )

      lastIndex = match.index + match.length
    }

    // Add any remaining text
    if (lastIndex < text.length) {
      result.push(<Fragment key={`text-${lastIndex}`}>{text.substring(lastIndex)}</Fragment>)
    }

    return result
  }

  return <div className="text-lg text-muted-foreground font-light">{parseText()}</div>
}

