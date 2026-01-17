import Image from "next/image";
import "./book.css";

export interface Book {
  title: string;
  author: string;
  cover: string;
  link?: string; // Optional, but recommended for parity
}

interface BooksProps {
  books: Book[];
}

export default function Books({ books }: BooksProps) {
  return (
    <div className="books grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-10 px-5 mb-10">
      {books.map((book) => (
        <a
          key={book.title}
          href={book.link || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="book-link text-sm flex flex-col items-center bg-gray-200 dark:bg-[#333] p-4 text-center no-underline hover:no-underline"
        >
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
          <span className="book-author text-xs mt-1">{book.author}</span>
        </a>
      ))}
    </div>
  );
}
