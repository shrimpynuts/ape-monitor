import clientFactory from '../lib/client-factory'

const config = {
  url: process.env.NEXT_PUBLIC_HEROKU_URI as string,
  accessKey: process.env.HASURA_GRAPHQL_ADMIN_SECRET as string,
}

if (config.url == undefined) {
  throw `
    🚫 Environment variable NEXT_PUBLIC_HEROKU_URI is missing!
  `
}

if (config.accessKey == undefined) {
  throw `
    🚫 Environment variable HASURA_GRAPHQL_ADMIN_SECRET missing!
  `
}
const client = clientFactory(config)

export default client
