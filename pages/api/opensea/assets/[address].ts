import type { NextApiRequest, NextApiResponse } from 'next'
import { ICollection } from '../../../../frontend/types'
import { pruneAndRemoveDuplicateCollections, getAssetsForOwner, pruneAssets } from '../../../../lib/opensea/collections'
import { UPSERT_COLLECTION_WITHOUT_STATS } from '../../../../graphql/mutations'
import client from '../../../../backend/graphql-client'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'

// To use sample/mock data in order not to make opensea /assets fetch, uncomment the two lines below
// import sampleAssets from '../../../../mock/big-opensea-assets.json'
// const { assets } = sampleAssets

// Upserts a collection to our database without updating stats columns
// We use this here because opensea /assets endpoint doesn't give us stats,
// so we don't want to override existing stats data
const upsertCollectionToDB = async (
  collection: Omit<ICollection, 'updated_at' | 'created_at'>,
  client: ApolloClient<NormalizedCacheObject>,
) => {
  console.log(`Upserting collection to db: ${collection.slug}`)
  await client.mutate({
    mutation: UPSERT_COLLECTION_WITHOUT_STATS,
    variables: {
      collection,
    },
  })
}

/**
 * Fetches the collections of the given address using the Opensea API.
 * https://api.opensea.io/api/v1/assets
 */
const request = async (req: NextApiRequest, res: NextApiResponse) => {
  // To cache our own API requests, uncomment the line below
  // res.setHeader('Cache-Control', 's-maxage=1800')

  const { address: ownerAddress } = req.query
  if (typeof ownerAddress !== 'string') return res.status(400).json({ error: 'ownerAddress must be given' })

  try {
    // Fetch all assets from Opensea
    const assets = await getAssetsForOwner(ownerAddress)

    // Separate the collections from the assets
    const collections = pruneAndRemoveDuplicateCollections(assets)

    // Upsert each collection to the db
    collections.forEach((collection) => upsertCollectionToDB(collection, client))

    // Prune Opensea assets into IAsset objects
    const prunedAssets = pruneAssets(assets)

    // Return assets
    return res.status(200).json({ assets: prunedAssets })
  } catch (error) {
    // Return errors
    return res.status(500).json({ error: `Error fetching assets for owner: ${error}` })
  }
}

export default request
