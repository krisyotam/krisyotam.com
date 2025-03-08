"use client"

import { useState, useEffect } from "react"
import words from "@/data/words.json"

export function WordOfTheDay() {
  const [word, setWord] = useState({ title: "Loading...", type: "", definition: "" })

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * words.length)
    setWord(words[randomIndex])
  }, [])

  return (
    <div className="bg-gray-50 dark:bg-[#121212] border-l-2 border-[#CCAC9F] dark:border-[#232323] p-3">
      <div className="font-normal text-sm text-gray-800 dark:text-[#fafafa] mb-0.5">{word.title}</div>
      <div className="text-gray-600 dark:text-[#a1a1a1] text-sm mb-0.5">{word.type}</div>
      <div className="text-gray-700 dark:text-[#d4d4d4] text-sm">{word.definition}</div>
    </div>
  )
}

