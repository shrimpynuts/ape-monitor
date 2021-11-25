import type { NextApiRequest, NextApiResponse } from 'next'
import { getCollectionStats } from '../../../lib/opensea/collections'
import { UPSERT_COLLECTION_WITH_STATS } from '../../../graphql/mutations'
import { GET_MOST_STALE_COLLECTIONS } from '../../../graphql/queries'
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
): Promise<Omit<ICollection, 'created_at' | 'updated_at'>> => {
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

const updateStaleOpenSeaCollection = async ({ contractAddress, i }: { contractAddress: string; i: string }) => {
  if (debug) console.log(`\nUpdating stale collection item ${i} for: ${contractAddress}`)
  try {
    const collection = await fetchOpenseaCollectionFromContractAddress(contractAddress)
    if (debug) console.log(`  Fetching opensea collection stats for ${collection.slug}`)

    // Fetch stats
    const stats = await getCollectionStats(collection.slug)

    // Add stats data to our old collection data
    const collectionWithStats = {
      ...collection,
      floor_price: stats.floor_price,
      one_day_change: stats.one_day_change,
      seven_day_change: stats.seven_day_change,
      thirty_day_change: stats.thirty_day_change,
      total_volume: stats.total_volume,
      market_cap: stats.market_cap,
    }

    // Add collection with stats to our own database
    await addCollectionToDB(collectionWithStats, client)

    // Catches error in case the request for opensea contract_address fails
  } catch (error: any) {
    console.log(error)
  }
}

export async function serialLoopFlow(jobs: any, doJob: Function) {
  for (const job of jobs) {
    await doJob(job)
  }
}

/**
 * Fetches the data for a single collection by its contract address from our database
 */
const request = async (req: NextApiRequest, res: NextApiResponse) => {
  // Fetch the collections object in our DB
  const { data } = await client.query({
    query: GET_MOST_STALE_COLLECTIONS,
  })

  const { collections } = data
  const contractAddreses = collections.map((collection: any, i: number) => {
    return {
      contractAddress: collection.contract_address,
      i,
    }
  })

  await serialLoopFlow(contractAddreses, updateStaleOpenSeaCollection)
  // console.log(`Jobs completed ✅`)
  res.status(200).json({ status: 'hello, world' })
}

export default request
