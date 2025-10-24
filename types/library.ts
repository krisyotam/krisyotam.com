export interface Author {
  slug: string
  name: string
  fullName: string
  degrees: string[]
  university: string
  currentAffiliation: string
  previousAffiliations: string[]
  fieldOfExpertise: string[]
  notableAchievements: string[]
  bio: string
}

export interface Book {
  id: string
  title: string
  author?: string // author slug for single author
  authors?: string[] // author slugs for multiple authors
  authorName?: string // resolved author name for single author
  authorNames?: string[] // resolved author names for multiple authors
  authorInfo?: Author // resolved author info for single author
  authorsInfo?: Author[] // resolved author info for multiple authors
  series?: string
  edition?: string
  publisher: string
  yearPublished: string
  copyright?: string
  isbn?: string
  isbn10?: string
  isbn13?: string
  coverUrl: string
  classification: string
  subClassification: string
  editors?: string
  editor?: string
}

export interface LibraryData {
  books: Book[]
}

export interface AuthorsData {
  authors: Author[]
}
