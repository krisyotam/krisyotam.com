"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"

// Static book data - update this when you change what you're reading
const CURRENT_BOOK = {
  title: "My Year of Rest and Relaxation",
  author: "Ottessa Moshfegh",
  coverImage: "https://krisyotam.com/doc/media/images/literature/2018-my-year-of-rest-and-relaxation-ottessa-moshfegh.jpg",
}

export function CurrentlyReading() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Card className="flex overflow-hidden h-[100px] dark:bg-[#121212] dark:border-[#232323]">
        <div
          className="w-[100px] h-[100px] bg-muted dark:bg-[#1a1a1a] p-2 flex items-center justify-center overflow-hidden cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="relative w-[60px] h-[90px] flex items-center justify-center">
            {CURRENT_BOOK.coverImage ? (
              <img
                src={CURRENT_BOOK.coverImage}
                alt="Book cover"
                className="max-w-full max-h-full object-contain rounded-sm transition-transform duration-300 hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-muted-foreground/20 rounded-sm flex items-center justify-center">
                <span className="text-xs text-muted-foreground">No cover</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 p-4 overflow-hidden flex flex-col justify-center">
          <div className="font-normal text-sm truncate dark:text-[#fafafa]">{CURRENT_BOOK.title}</div>
          <div className="text-gray-600 dark:text-[#a1a1a1] text-sm truncate">{CURRENT_BOOK.author}</div>
        </div>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="p-0 border-0 bg-transparent max-w-fit [&>button]:hidden">
          {CURRENT_BOOK.coverImage && (
            <img
              src={CURRENT_BOOK.coverImage}
              alt="Book cover"
              className="max-w-[300px] max-h-[450px] object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
