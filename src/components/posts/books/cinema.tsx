"use client";
import Image from "next/image";
import "./book.css";

export interface CinemaEntry {
  title: string;
  director: string;
  cover: string;
  link?: string;
  order: number;
}

interface CinemaProps {
  books: CinemaEntry[];
}

export default function Cinema({ books }: CinemaProps) {
  return (
    <div className="books grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-10 px-5 mb-10">
      {books.map((book) => (
        <a
          key={book.title + book.order}
          href={book.link || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="book-link text-sm flex flex-col items-center bg-gray-200 dark:bg-[#333] p-4 text-center no-underline hover:no-underline relative"
        >
          {/* Order number in top left, styled for light/dark mode and visually integrated */}
          <span
            className="absolute left-2 top-2 flex items-center justify-center shadow-sm font-mono font-semibold text-xs z-10"
            style={{
              width: 28,
              height: 28,
              background: 'var(--order-badge-bg, #f3f4f6)',
              color: 'var(--order-badge-fg, #222)',
              border: '1.5px solid var(--order-badge-border, #e5e7eb)',
              boxShadow: '0 1px 4px 0 rgba(0,0,0,0.07)',
              borderRadius: 0,
            }}
          >
            {book.order}
          </span>
          <style jsx>{`
            .book-link .absolute.left-2.top-2 {
              background: #f3f4f6;
              color: #222;
              border: 1.5px solid #e5e7eb;
            }
            .dark .book-link .absolute.left-2.top-2 {
              background: #23272e;
              color: #f3f4f6;
              border: 1.5px solid #444;
            }
          `}</style>
          <span className="book-image-container">
            <Image
              src={book.cover}
              alt={book.title}
              fill
              style={{ objectFit: "contain" }}
              className="book-image"
              unoptimized={book.cover?.includes('krisyotam.com')}
            />
          </span>
          <span className="book-title">{book.title}</span>
          <span className="book-author text-xs mt-1">{book.director}</span>
        </a>
      ))}
    </div>
  );
}
