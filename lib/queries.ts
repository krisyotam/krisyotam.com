import { gql } from "@apollo/client"

export const GET_READING_STATES = gql`
  query myReadingStates {
    myReadingStates {
      id
      status
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
      books(take: 3) {
        id
        cover
        title
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

