import type { NextApiRequest, NextApiResponse } from 'next'
import { getCollectionStats } from '../../../lib/opensea/collections'
import { UPSERT_COLLECTION_WITH_STATS } from '../../../graphql/mutations'
import { GET_COLLECTION_BY_CONTRACT_ADDRESS } from '../../../graphql/queries'
import client from '../../../backend/graphql-client'
import { ICollection } from '../../../frontend/types'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'

const debug = true

const addCollectionToDB = async (
  collection: Omit<ICollection, 'updated_at' | 'created_at'>,
  client: ApolloClient<NormalizedCacheObject>,
) => {
  await client.mutate({
    mutation: UPSERT_COLLECTION_WITH_STATS,
    variables: {
      collection,
    },
  })
}

const fetchOpenseaCollectionFromContractAddress = async (
  contractAddress: string,
): Promise<Omit<ICollection, 'created_at' | 'updated_at'>> => {
  const result = await fetch(`https://api.opensea.io/api/v1/asset_contract/${contractAddress}`).then((res) =>
    res.json(),
  )
  const { collection } = result

  const prunedCollection = {
    contract_address: contractAddress,
    name: collection.name,
    slug: collection.slug,
    image_url: collection.image_url,
    twitter_username: collection.twitter_username,
    discord_url: collection.discord_url,
    external_url: collection.external_url,
  }
  return prunedCollection
}

/**
 * Fetches the data for a single collection by its contract address from our database
 */
const request = async (req: NextApiRequest, res: NextApiResponse) => {
  const { contract_address: givenAddress } = req.query

  if (typeof givenAddress !== 'string') return res.status(400).json({ error: 'Bad request - address must be given' })

  // Use lower case address
  const contractAddress = givenAddress.toLowerCase()

  // Fetch the collections object in our DB
  const { data } = await client.query({
    query: GET_COLLECTION_BY_CONTRACT_ADDRESS,
    variables: { contract_address: contractAddress },
  })

  /**
   * If the collection does not exist in our database:
   *    - Fetch the collection data and stats from opensea
   *    - Then store it into our database
   *    - Return the new collection data
   * Otherwise:
   *    - If the collection stats data is stale, fetch and update the stats
   *    - Return our stored collection data
   */
  if (!data || data.collections.length === 0) {
    if (debug) console.log(`Fetching opensea collection for address ${contractAddress}`)

    // Use the contract address to fetch opensea collection data
    const collection = await fetchOpenseaCollectionFromContractAddress(contractAddress)

    if (debug) console.log(`Fetching opensea collection stats for ${contractAddress}/${collection.slug}`)

    // Fetch stats
    const stats = await getCollectionStats(collection.slug)
    if (!stats) return res.status(500).json({ error: 'Could not fetch Opensea data' })

    // Add stats data to our old collection data
    const collectionWithStats = {
      ...collection,
      floor_price: stats.floor_price,
      one_day_change: stats.one_day_change,
      seven_day_change: stats.seven_day_change,
      thirty_day_change: stats.thirty_day_change,
    }

    // Add collection with stats to our own database
    // await addCollectionToDB(collectionWithStats, client)

    res.status(200).json(collectionWithStats)
  } else {
    // Grab the desired collection
    const collection = data.collections[0]
    const slug = collection.slug

    // Determine if data is stale (more than an hour old)
    const ONE_HOUR = 60 * 60 * 1000
    const isStaleData = Date.now() - new Date(collection.updated_at).getTime() > ONE_HOUR

    // Check if stats data has never been fetched
    const statsWasNeverFetched = collection.floor_price === null || collection.one_day_change === null

    // if (debug && statsWasNeverFetched) console.log(`${slug}: stats have not been fetched, fetching stats`)
    // if (debug && isStaleData) console.log(`${slug}: has not been updated in > 1hr, refetching stats`)

    /**
     * If the data is stale or the stats have never been fetched, refetch stats
     */
    if (false) {
      // Fetch stats
      const stats = await getCollectionStats(slug)

      // Add stats data to our old collection data
      const collectionCopy = { ...collection }
      delete collectionCopy.__typename
      const newCollection = {
        ...collectionCopy,
        floor_price: stats.floor_price,
        one_day_change: stats.one_day_change,
        seven_day_change: stats.seven_day_change,
        thirty_day_change: stats.thirty_day_change,
      }

      // Add the data to our database
      await addCollectionToDB(newCollection, client)

      // Return our new collection data
      res.status(200).json(newCollection)
    } else {
      /**
       * If the data is not stale and exists, just return normally
       */
      // Return cached collection data
      res.status(200).json(collection)
    }
  }
}

export default request
