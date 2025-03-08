"use client"

import { useState, useEffect } from "react"
import quotesData from "@/data/header-quotes.json"

export function QuoteOfTheDay() {
  const [quote, setQuote] = useState({ text: "", author: "" })

  useEffect(() => {
    if (quotesData?.quotes?.length) {
      const randomIndex = Math.floor(Math.random() * quotesData.quotes.length)
      setQuote(quotesData.quotes[randomIndex])
    }
  }, [])

  return (
    <div className="bg-gray-50 dark:bg-[#121212] border-l-2 border-[#CCAC9F] dark:border-[#232323] p-3 italic min-h-[84px] flex flex-col justify-between">
      <p className="text-gray-800 dark:text-[#fafafa] text-sm">{quote.text}</p>
      <p className="text-right text-gray-600 dark:text-[#a1a1a1] text-sm mt-2">— {quote.author}</p>
    </div>
  )
}

