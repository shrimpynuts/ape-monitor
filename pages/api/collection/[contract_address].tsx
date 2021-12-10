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
  return await client.mutate({
    mutation: UPSERT_COLLECTION_WITH_STATS,
    variables: {
      collection,
    },
  })
}

const fetchOpenseaCollectionFromContractAddress = async (
  contractAddress: string,
): Promise<Omit<ICollection, 'created_at' | 'updated_at' | 'is_stats_fetched'>> => {
  const result = await fetch(`https://api.opensea.io/api/v1/asset_contract/${contractAddress}`).then((res) =>
    res.json(),
  )
  const { collection, detail } = result

  // This means request was throttled
  if (detail) {
    console.error(`Request for opensea asset_contract ${contractAddress}: ${detail}`)
    throw new Error(detail)
  }

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
    // try {
    //   const collection = await fetchOpenseaCollectionFromContractAddress(contractAddress)
    //   if (debug) console.log(`Fetching opensea collection stats for ${contractAddress}/${collection.slug}`)

    //   // Fetch stats
    //   const stats = await getCollectionStats(collection.slug)
    //   if (stats === null) {
    //     // If we get an error fetching stats, just return the collection without the stats
    //     return res.status(200).json(collection)
    //   }

    //   // Add stats data to our old collection data
    //   const collectionWithStats = {
    //     ...collection,
    //     floor_price: stats.floor_price,
    //     one_day_change: stats.one_day_change,
    //     seven_day_change: stats.seven_day_change,
    //     thirty_day_change: stats.thirty_day_change,
    //     total_volume: stats.total_volume,
    //     market_cap: stats.market_cap,
    //   }

    //   // Add collection with stats to our own database
    //   await addCollectionToDB(collectionWithStats, client)

    //   res.status(200).json(collectionWithStats)

    //   // Catches error in case the request for opensea contract_address fails
    // } catch (error: any) {
    //   return res.status(500).json({ error: error.toString() })
    // }
  } else {
    // Grab the desired collection
    const collection = data.collections[0]
    const slug = collection.slug

    // Check if stats data has never been fetched
    const statsWasNeverFetched = collection.floor_price === null || collection.one_day_change === null

    // if (debug && statsWasNeverFetched) console.log(`${slug}: stats have not been fetched, fetching stats`)
    // if (debug && isStaleData) console.log(`${slug}: has not been updated in > 1hr, refetching stats`)

    /**
     * If the data is stale or the stats have never been fetched, refetch stats
     */
    if (statsWasNeverFetched) {
      // Fetch stats
      const stats = await getCollectionStats(slug)

      // If we have an error getting the stats, just return the collection without them
      if (!stats) {
        return res.status(200).json(collection)
      }

      // Add stats data to our old collection data
      const collectionCopy = { ...collection }
      delete collectionCopy.__typename
      const newCollection = {
        ...collectionCopy,
        floor_price: stats.floor_price,
        one_day_change: stats.one_day_change,
        seven_day_change: stats.seven_day_change,
        thirty_day_change: stats.thirty_day_change,
        total_volume: stats.total_volume,
        market_cap: stats.market_cap,
      }

      // Add the data to our database
      // console.log(`adding ${newCollection.slug} with new stats to db`)
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
