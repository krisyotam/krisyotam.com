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
    <div className="bg-gray-50 border-l-2 border-[#CCAC9F] p-3">
      <div className="font-normal text-sm text-gray-800 mb-0.5">{word.title}</div>
      <div className="text-gray-600 text-sm mb-0.5">{word.type}</div>
      <div className="text-gray-700 text-sm">{word.definition}</div>
    </div>
  )
}

