import { useState, useEffect } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"

const LITERAL_TOKEN = process.env.LITERAL_TOKEN

const bookUrlMapping: { [key: string]: string } = {
  "The Ode Less Travelled": "https://literal.club/krisyotam/book/the-ode-less-travelled-5iny6",
}

export function CurrentlyReading() {
  const [book, setBook] = useState({
    title: "Loading...",
    author: "Loading...",
    coverImage: "/assets/fallback/fallback_book_cover.svg",
    bookUrl: "#",
  })

  useEffect(() => {
    console.log("useEffect running: Initiating fetchReadingStates");
    fetchReadingStates()
  }, [])

  async function fetchReadingStates() {
    console.log("Fetching reading states...");

    // Ensure token exists before making request
    if (!LITERAL_TOKEN) {
      console.error("Error: LITERAL_TOKEN is missing or invalid.");
      updateBookStateWithError("Authorization token is missing.");
      return;
    }

    const url = "https://literal.club/graphql/"
    const query = `
      query myReadingStates {
        myReadingStates {
          ...ReadingStateParts
          book {
            ...BookParts
          }
        }
      }

      fragment BookParts on Book {
        id
        title
        authors {
          name
        }
        cover
      }

      fragment ReadingStateParts on ReadingState {
        id
        status
        createdAt
      }
    `

    try {
      console.log("Sending request to API...");
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LITERAL_TOKEN}`,
        },
        body: JSON.stringify({ query }),
      })

      // Check if the response is OK
      if (!response.ok) {
        console.error(`Error: HTTP status ${response.status}`);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json()
      console.log("API response received:", data);

      // Handle the response data
      if (data.data?.myReadingStates?.length > 0) {
        const readingBooks = data.data.myReadingStates.filter((state: { book: any }) => state.book);
        console.log("Filtered reading books:", readingBooks);

        if (readingBooks.length > 0) {
          const latestBook = readingBooks.sort(
            (a: { createdAt: string }, b: { createdAt: string }) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )[0].book;
          console.log("Latest book found:", latestBook);
          updateBookState(latestBook)
        } else {
          console.warn("No books currently being read.");
          updateBookStateWithError("No books currently being read");
        }
      } else {
        console.warn("No reading states found.");
        updateBookStateWithError("No books currently being read");
      }
    } catch (error) {
      console.error("Error during API request:", error);
      updateBookStateWithError("Unable to load reading information");
    }
  }

  function updateBookState(book: { title: string; authors: { name: string }[]; cover: string }) {
    const authors = book.authors?.length > 0 ? book.authors.map((author) => author.name).join(", ") : "Unknown author";
    console.log("Updating book state with:", { title: book.title, authors, cover: book.cover });
    setBook({
      title: book.title,
      author: authors,
      coverImage: book.cover || "/assets/fallback/fallback_book_cover.svg",
      bookUrl: bookUrlMapping[book.title] || "https://literal.club/krisyotam/book/unknown-book",
    });
  }

  function updateBookStateWithError(message: string) {
    console.log("Updating book state with error message:", message);
    setBook({
      title: message,
      author: "",
      coverImage: "/assets/fallback/fallback_book_cover.svg",
      bookUrl: "#",
    })
  }

  return (
    <Card className="flex overflow-hidden">
      <div className="w-[100px] h-[100px] bg-muted p-2 flex items-center justify-center overflow-hidden">
        <a href={book.bookUrl} target="_blank" rel="noopener noreferrer" className="relative w-[60px] h-[90px]">
          <Image
            src={book.coverImage || "/placeholder.svg"}
            alt="Book cover"
            fill
            className="object-contain rounded-sm transition-transform duration-300 hover:scale-110"
          />
        </a>
      </div>
      <div className="flex-1 p-4 overflow-hidden flex flex-col justify-center">
        <div className="font-normal text-sm truncate">{book.title}</div>
        <div className="text-gray-600 text-sm truncate">{book.author}</div>
      </div>
    </Card>
  )
}
