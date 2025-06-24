export async function getBookByIsbn(isbn13: string) {
    const query = `
      query GetBookByIsbn($isbn13: String!) {
        book(where: {isbn13: $isbn13}) {
          id
          slug
          title
          subtitle
          description
          isbn10
          isbn13
          language
          pageCount
          publishedDate
          publisher
          cover
          authors {
            id
            name
          }
          gradientColors
        }
      }
    `
  
    try {
      const response = await fetch("https://literal.club/graphql/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          variables: { isbn13 },
        }),
      })
  
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
  
      const data = await response.json()
      return data.data.book
    } catch (error) {
      console.error("Error fetching book data:", error)
      return null
    }
  }
  
  export interface Author {
    id: string
    name: string
  }
  
  export interface Book {
    id: string
    slug: string
    title: string
    subtitle?: string
    description?: string
    isbn10?: string
    isbn13: string
    language?: string
    pageCount?: number
    publishedDate?: string
    publisher?: string
    cover?: string
    authors: Author[]
    gradientColors?: string[]
  }
  
  