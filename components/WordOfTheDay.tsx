/**
 * ============================================================================
 * Word of the Day Component
 * ============================================================================
 * Author: Kris Yotam
 * Description: Displays a random word with its definition
 * Created: 2026-01-04
 * ============================================================================
 */

"use client";

import { useState, useEffect } from "react";

// ============================================================================
// Types
// ============================================================================

interface Word {
  title: string;
  type: string;
  definition: string;
}

// ============================================================================
// Component
// ============================================================================

export function WordOfTheDay() {
  const [word, setWord] = useState<Word>({
    title: "Loading...",
    type: "",
    definition: "",
  });

  useEffect(() => {
    async function fetchWord() {
      try {
        const res = await fetch("/api/word-of-the-day?random=true");
        if (res.ok) {
          const data = await res.json();
          setWord({
            title: data.title,
            type: data.type,
            definition: data.definition,
          });
        }
      } catch (error) {
        console.error("Error fetching word of the day:", error);
      }
    }
    fetchWord();
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-[#121212] border-l-2 border-[#CCAC9F] dark:border-[#232323] p-3">
      <div className="font-normal text-sm text-gray-800 dark:text-[#fafafa] mb-0.5">
        {word.title}
      </div>
      <div className="text-gray-600 dark:text-[#a1a1a1] text-sm mb-0.5">
        {word.type}
      </div>
      <div className="text-gray-700 dark:text-[#d4d4d4] text-sm">
        {word.definition}
      </div>
    </div>
  );
}
