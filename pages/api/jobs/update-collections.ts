import type { NextApiRequest, NextApiResponse } from 'next'
import { getCollectionStats } from '../../../lib/opensea/collections'
import { UPSERT_COLLECTION_WITH_STATS, UPSERT_COLLECTION_WITHOUT_STATS } from '../../../graphql/mutations'
import { GET_COLLECTION_BY_CONTRACT_ADDRESS } from '../../../graphql/queries'
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
  const { name, slug: givenSlug, updated_at, contract_address } = givenCollection
  log(`\n🔘 Updating collection: ${name || contract_address}`)
  try {
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
  } catch (error: any) {
    console.error(error)
  }
}

/**
 * Fetches the data for a single collection by its contract address from our database
 */
const request = async (req: NextApiRequest, res: NextApiResponse) => {
  log(`\n   Job: update-collections started 🚀\n`)

  // Fetch the collections object in our DB
  const {
    data: { collections },
  } = await client.query({
    query: GET_MOST_STALE_COLLECTIONS,
  })

  // Filter and sort collections for the ones we want to update
  const selectedCollections = collections.slice(0, 3)
  // .filter(({ contract_address }: ICollection) => contract_address === '0x6d2208aac56b97d222092da900a42ed5f1e7e12e')

  // Update each of the selected collections
  let index = 0
  for (const collection of selectedCollections) {
    try {
      await updateCollection(collection)
      index += 1
    } catch (e) {
      console.error(e)
    }
  }

  log(`\n   Job: update-collections completed ✅\n`)
  res.status(200).json({ error: false, message: `Successfully fetched ${index} collection(s)` })
}

export default request
