import fetch from 'isomorphic-unfetch'
import { ApolloClient, InMemoryCache, ApolloLink, from, HttpLink } from '@apollo/client'
import { onError } from '@apollo/client/link/error'

const cache = new InMemoryCache({
  // Remove __typename from queried objects
  addTypename: false,
})

interface IClientFactory {
  url: string
  accessKey: string
}

export const clientFactory = ({ url, accessKey }: IClientFactory) => {
  // The base hasura URL to send GraphQL requests to
  const httpLink = new HttpLink({
    uri: url,
    fetch: fetch,
  })

  console.log(`
    Backend connected to: ${url}
  `)

  // Error handling for the apollo client
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
      )

    if (networkError) console.log(`[Network error]: ${networkError}`)
  })

  // Middleware to attach the admin secret to requests
  const authLink = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers }: any) => ({
      headers: {
        'x-hasura-admin-secret': `${accessKey}`,
        ...headers,
      },
    }))
    return forward(operation)
  })

  // Finally construct apollo client
  return new ApolloClient({
    cache: cache,
    // Concatinates the constructed links
    link: from([authLink, errorLink, httpLink]),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache',
      },
      query: {
        fetchPolicy: 'no-cache',
      },
    },
  })
}

export default clientFactory
