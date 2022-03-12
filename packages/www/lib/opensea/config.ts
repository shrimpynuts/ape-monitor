// This just modularizes the opensea fetch header used in all opensea API fetches

// Fetch opensea API key
const openseaAPIKey = process.env.OPENSEA_API_KEY

// Warn if the opensea API key is not available
if (!openseaAPIKey) console.warn('Cannot find opensea API key (OPENSEA_API_KEY)')

// Construct header object to pass api key to each fetch
export const openseaFetchHeaders = {
  headers: {
    // Attach the opensea API key as a header if it's available
    ...(openseaAPIKey && { 'X-API-KEY': openseaAPIKey }),
  },
}
