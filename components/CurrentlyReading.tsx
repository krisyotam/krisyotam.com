"use client"

import Image from "next/image"
import { Card } from "@/components/ui/card"

// Static book data - update this when you change what you're reading
const CURRENT_BOOK = {
  title: "The Ode Less Travelled",
  author: "Stephen Fry",
  coverImage: "https://assets.literal.club/cover/2/ckuanb7wr363809l56m8h21kn.jpg",
  bookUrl: "https://literal.club/krisyotam/book/the-ode-less-travelled-5iny6",
}

export function CurrentlyReading() {
  return (
    <Card className="flex overflow-hidden h-[100px] dark:bg-[#121212] dark:border-[#232323]">
      <div className="w-[100px] h-[100px] bg-muted dark:bg-[#1a1a1a] p-2 flex items-center justify-center overflow-hidden">
        <a href={CURRENT_BOOK.bookUrl} target="_blank" rel="noopener noreferrer" className="relative w-[60px] h-[90px]">
          <Image
            src={CURRENT_BOOK.coverImage}
            alt="Book cover"
            fill
            className="object-contain rounded-sm transition-transform duration-300 hover:scale-110"
          />
        </a>
      </div>
      <div className="flex-1 p-4 overflow-hidden flex flex-col justify-center">
        <div className="font-normal text-sm truncate dark:text-[#fafafa]">{CURRENT_BOOK.title}</div>
        <div className="text-gray-600 dark:text-[#a1a1a1] text-sm truncate">{CURRENT_BOOK.author}</div>
      </div>
    </Card>
  )
}
