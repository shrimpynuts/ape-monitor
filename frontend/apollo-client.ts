import { ApolloClient, InMemoryCache } from '@apollo/client'

const herokuUri = process.env.NEXT_PUBLIC_HEROKU_URI

if (typeof herokuUri === 'undefined' || herokuUri === '') {
  console.error('The NEXT_PUBLIC_HEROKU_URI environment variable is not set, exiting.')
  process.exit(1)
}

const client = new ApolloClient({
  uri: herokuUri,
  cache: new InMemoryCache(),
})

export default client
