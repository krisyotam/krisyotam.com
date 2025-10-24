import { gql } from "@apollo/client"

export const GET_READING_STATES = gql`
  query myReadingStates {
    myReadingStates {
      id
      status
      createdAt
      book {
        id
        slug
        title
        subtitle
        authors {
          name
        }
        cover
      }
    }
  }
`

export const GET_SHELVES = gql`
  query getShelvesByProfileId($profileId: String!, $limit: Int!, $offset: Int!) {
    getShelvesByProfileId(profileId: $profileId, limit: $limit, offset: $offset) {
      id
      slug
      title
      description
      profileId
      books(take: 3) {
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
  }
`

export const GET_BOOK_BY_ISBN = gql`
  query GetBookByIsbn($isbn13: String!) {
    book(where: {isbn13: $isbn13}) {
      id
      slug
      title
      subtitle
      authors {
        name
      }
      cover
    }
  }
`

export const GET_BOOK_NOTES = gql`
  query GetBookNotes {
    bookNotes {
      id
      title
      author
      year
      coverImage
      goodreadsLink
      grammar {
        part1
        part2
      }
      logic
      rhetoric
      review
    }
  }
`

export const GET_SHELF_BY_SLUG = gql`
  query getShelfBySlug($shelfSlug: String!) {
    shelf(where: { slug: $shelfSlug }) {
      id
      slug
      title
      description
      books {
        id
        slug
        title
        subtitle
        authors {
          name
        }
        cover
      }
    }
  }
`

