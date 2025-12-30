/**
 * List View Header Component
 * @author Kris Yotam
 * @date 2025-12-29
 * @description Header section for list view with name and expandable quote
 */

"use client"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { formatQuoteWithLineBreaks, getNewRandomQuote } from "./utils"

interface ListHeaderProps {
  initialQuote: { text: string; author: string }
}

export function ListHeader({ initialQuote }: ListHeaderProps) {
  const [expandQuote, setExpandQuote] = useState(false)
  const [currentQuote, setCurrentQuote] = useState(initialQuote)
  const [quoteLines, setQuoteLines] = useState<string[]>([])
  const [showMoreQuote, setShowMoreQuote] = useState(false)

  useEffect(() => {
    // Format the quote to check if it needs the "show more" functionality
    const lines = formatQuoteWithLineBreaks(`"${currentQuote.text}" - ${currentQuote.author}`, 75).split('\n');
    setQuoteLines(lines);
    setShowMoreQuote(lines.length > 2);
    setExpandQuote(false);
  }, [currentQuote]);

  const handleGetNewQuote = async () => {
    try {
      const newQuote = await getNewRandomQuote();
      setCurrentQuote(newQuote);
    } catch (error) {
      // Fallback to page reload if API fails
      window.location.reload();
    }
  };

  return (
    <header className="mb-16 pl-8">
      <h1 className="text-4xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Kris Yotam</h1>
      <div className="relative">
        <p
          onClick={handleGetNewQuote}
          className="text-sm font-light italic text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary cursor-pointer transition-colors"
        >
          {showMoreQuote ? (
            expandQuote ? (
              quoteLines.map((line, index) => (
                <span key={index} className="block">
                  {line}
                </span>
              ))
            ) : (
              <>
                <span className="block">{quoteLines[0]}</span>
                <span className="block">{quoteLines[1]}</span>
              </>
            )
          ) : (
            quoteLines.map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))
          )}
        </p>
        {showMoreQuote && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpandQuote(!expandQuote);
            }}
            className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1"
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${expandQuote ? 'rotate-180' : ''}`} />
            <span className="ml-1">{expandQuote ? 'Show less' : 'Show more'}</span>
          </button>
        )}
      </div>
    </header>
  )
}
