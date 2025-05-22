// components/book-list.tsx

import { useMemo, useState } from "react";
import { BookCard } from "@/components/book-card"; // Import the new BookCard component
import { Button } from "@/components/ui/button";

// Define types for the books prop
interface BookItemProps {
  isbn: string;
  title: string;
  authors: string[];
  category: string;
  tags: string[];
}

interface BookListProps {
  books: {
    isbn: string; // ISBN
    title: string;
    authors: string[];
    category: string;
    tags: string[];
  }[]; // Book list from the JSON
}

interface BookCardProps {
  key: string;
  isbn: string;
  title: string;
  authors: string[];
  rating: number;
}

export function BookList({ books }: BookListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Dynamically extract categories from the books data
  const categories = useMemo(() => {
    try {
      const categorySet = new Set(books.map((book) => book.category));
      return ["All", ...Array.from(categorySet)].sort((a, b) =>
        a === "All" ? -1 : b === "All" ? 1 : a.localeCompare(b)
      );
    } catch (error) {
      console.error("Error extracting categories: ", error);
      return ["All"]; // Return default category if an error occurs
    }
  }, [books]);

  const filteredBooks = useMemo(() => {
    try {
      return books.filter((book) => {
        const matchesSearch =
          searchQuery === "" ||
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
          book.authors.some((author) => author.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory = activeCategory === "All" || book.category === activeCategory;

        return matchesSearch && matchesCategory;
      });
    } catch (error) {
      console.error("Error filtering books: ", error);
      return []; // Return empty list if error occurs during filtering
    }
  }, [searchQuery, activeCategory, books]);

  return (
    <div className="space-y-6">
      <input
        type="text"
        placeholder="Search books..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border rounded-md"
      />
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === activeCategory ? "default" : "secondary"}
              className={`transition-colors hover:bg-black hover:text-white ${
                category === activeCategory ? "bg-black text-white" : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <BookCard
              key={book.isbn}
              isbn={book.isbn}
              title={book.title}
              authors={book.authors}
              rating={0}
            />
          ))
        ) : (
          <p className="text-center text-muted-foreground py-8 col-span-2">No books found matching your criteria.</p>
        )}
      </div>
    </div>
  );
}
