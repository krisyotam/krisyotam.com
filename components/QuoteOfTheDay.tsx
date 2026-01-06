"use client"

import { useState, useEffect } from "react"

interface Quote {
  text: string;
  author: string;
}

export function QuoteOfTheDay() {
  const [quote, setQuote] = useState<Quote>({ text: "", author: "" })

  useEffect(() => {
    async function fetchRandomQuote() {
      try {
        const response = await fetch('/api/random-quote')
        if (response.ok) {
          const data = await response.json()
          setQuote({ text: data.text || "", author: data.author || "" })
        }
      } catch (error) {
        console.error('Error fetching quote:', error)
      }
    }
    fetchRandomQuote()
  }, [])

  return (
    <div className="bg-gray-50 dark:bg-[#121212] border-l-2 border-[#CCAC9F] dark:border-[#232323] p-3 italic min-h-[84px] flex flex-col justify-between">
      <p className="text-gray-800 dark:text-[#fafafa] text-sm">{quote.text}</p>
      <p className="text-right text-gray-600 dark:text-[#a1a1a1] text-sm mt-2">— {quote.author}</p>
    </div>
  )
}

