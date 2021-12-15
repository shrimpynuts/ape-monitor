import type { NextApiRequest, NextApiResponse } from 'next'
import { getCollectionStats } from '../../../lib/opensea/collections'
import { UPSERT_COLLECTION_WITH_STATS, UPSERT_COLLECTION_WITHOUT_STATS } from '../../../graphql/mutations'
import { GET_MOST_STALE_COLLECTIONS } from '../../../graphql/queries'
import client from '../../../backend/graphql-client'
import { fetchOpenseaCollectionFromContractAddress } from '../../../backend/opensea-helpers'
import { ICollection } from '../../../frontend/types'
import { ApolloClient, DocumentNode, NormalizedCacheObject } from '@apollo/client'

const debug = true
const log = (message?: any) => debug && console.log(message)

const handleUniquenessError = (e: Error) => {
  // If it's a uniqueness constraint on the uniqueness constraint, dismiss the error
  if (!e.toString().includes('key value violates unique constraint "collections_contract_address_key"')) {
    throw Error(`Error when upserting collection to DB: ${e.toString()}`)
  }
}

/**
 * Removes the null key-value pairs from an object
 */
function removeEmpty(obj: any) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null))
}

const upsertCollectionToDB = async (
  mutation: DocumentNode,
  collection: Omit<ICollection, 'updated_at' | 'created_at' | 'is_stats_fetched'>,
  client: ApolloClient<NormalizedCacheObject>,
) => {
  // Remove empty values from collection object before storing
  const collectionToSave = removeEmpty(collection)
  return await client.mutate({ mutation, variables: { collection: collectionToSave } }).catch(handleUniquenessError)
}

const updateCollection = async (givenCollection: ICollection) => {
  const { slug: givenSlug, contract_address } = givenCollection
  // Fetch the basic collection data if never fetched before
  let collection: Omit<ICollection, 'updated_at' | 'created_at' | 'is_stats_fetched'> = givenCollection
  if (!givenSlug) {
    // Get collection data from opensea using contract address
    collection = await fetchOpenseaCollectionFromContractAddress(contract_address)
    console.log('Saving collection without stats')
    // Add the basic collection data to our database without stats
    await upsertCollectionToDB(UPSERT_COLLECTION_WITHOUT_STATS, collection, client)
  }

  if (collection.slug) {
    // Fetch stats
    log(`   Fetching opensea collection stats for ${collection.slug}`)
    const stats = await getCollectionStats(collection.slug)
    if (stats == null) {
      console.error('Could not get stats for collection, getCollectionStats returned null')
      return
    }
    // Add stats data to our old collection data
    const collectionWithStats = {
      ...collection,
      floor_price: stats.floor_price,
      one_day_change: stats.one_day_change,
      seven_day_change: stats.seven_day_change,
      thirty_day_change: stats.thirty_day_change,
      total_volume: stats.total_volume,
      market_cap: stats.market_cap,
      is_stats_fetched: true,
    }

    console.log('Saving collection with stats')
    // Add collection with stats to our own database
    await upsertCollectionToDB(UPSERT_COLLECTION_WITH_STATS, collectionWithStats, client)
  }
}

/**
 * Fetches the data for a single collection by its contract address from our database
 */
const request = async (req: NextApiRequest, res: NextApiResponse) => {
  log(`\n   Job: update-collections started 🚀\n`)
  const startJobDate = new Date().getTime()

  // Number of collections to query from our database each run
  const QUERY_LIMIT = 1000

  // Number of collections to query from opensea each run of this job
  const JOB_LIMIT = 100

  // Fetch the collections object in our DB
  const {
    data: { collections },
  } = await client.query({
    query: GET_MOST_STALE_COLLECTIONS,
    variables: {
      limit: QUERY_LIMIT,
    },
  })

  // Take the top JOB_LIMIT collections in terms of total_volume
  const selectedCollections = collections
    .filter(({ one_day_change }: ICollection) => !one_day_change)
    // Uncomment if you want to filter for a single collection
    // .filter(({ slug }: ICollection) => slug === 'mechanized-abstractions')
    // Sort by the total volume
    // .sort((collectionA: any, collectionB: any) =>
    //   collectionA.total_volume ? collectionB.total_volume - collectionA.total_volume : 1,
    // )
    // Update only LIMIT in a single job
    .slice(0, JOB_LIMIT)

  // Run updateCollection for each collection, while counting how many updates work
  let index = 0
  for (const collection of selectedCollections) {
    try {
      log(`\n🔘 ${index} Updating collection: ${collection.name || collection.contract_address}`)
      await updateCollection(collection)
      index += 1
    } catch (e: any) {
      console.error(e.message)
      break
    }
  }

  const endJobDate = new Date().getTime()
  var durationInSeconds = Math.abs(endJobDate - startJobDate) / 1000

  log(`\n   Job: update-collections completed in ${durationInSeconds}s ✅\n`)
  res
    .status(200)
    .json({ error: false, message: `Successfully fetched ${index} collection(s) in ${durationInSeconds}s` })
}

export default request
