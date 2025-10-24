import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, from } from "@apollo/client"
import { onError } from "@apollo/client/link/error"

// Error logging link
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}, Operation: ${operation.operationName}`,
      )
    })
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`)
  }
})

// HTTP link with hardcoded endpoint
const httpLink = new HttpLink({
  uri: "https://literal.club/graphql/",
})

// Authentication link
const authLink = new ApolloLink((operation, forward) => {
  // Get the token from environment variable
  const token = process.env.NEXT_PUBLIC_LITERAL_TOKEN

  // Log the operation being performed and token status
  console.log(`Executing GraphQL operation: ${operation.operationName}`)
  console.log(`Token available: ${token ? 'Yes' : 'No'}`)
  if (token) {
    console.log(`Token preview: ${token.substring(0, 20)}...`)
  }

  // Add the token to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  }))

  return forward(operation)
})

// Create the Apollo Client
export const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
    query: {
      fetchPolicy: "network-only",
      errorPolicy: "all",
    },
  },
})

