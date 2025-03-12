"use client"

import * as Typography from "@/components/typography"
import { BookCard } from "@/components/book-card"
import booksData from "@/data/posts/poems.json"

export default function PoetryBookRecommendations() {
  return (
    <>
      {/* First text section */}
      <div className="text-content">
        <Typography.P>
          Poetry is a timeless art form that captures the beauty of language, emotion, and human experience. Whether you
          are new to poetry or a longtime reader, these selections offer a diverse journey through different eras and
          styles.
        </Typography.P>

        <Typography.H2>Exploring Poetry Through Books</Typography.H2>

        <Typography.P>
          This curated collection includes poetry classics from various movements, each leaving a lasting impact on
          literature. Discover works that have shaped cultures and continue to inspire readers today.
        </Typography.P>

        <Typography.H2>Why Read Poetry?</Typography.H2>

        <Typography.P>
          Poetry allows us to explore language in its most concentrated form. It evokes deep emotions, tells compelling
          stories, and reveals insights about life that can be both personal and universal.
        </Typography.P>
      </div>

      {/* Component section - completely breaks out of the page layout */}
      <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] my-12 py-12">
        <div className="post-component px-4 md:px-8 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {booksData.books.map((book) => (
              <div className="individual-book-card-wrapper" key={book.isbn}>
                <BookCard isbn={book.isbn} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second text section */}
      <div className="text-content">
        <Typography.P>
          Through poetry, we learn to appreciate rhythm, wordplay, and the power of concise storytelling. Whether you're
          seeking inspiration, comfort, or a new perspective, poetry has something to offer.
        </Typography.P>
      </div>
    </>
  )
}