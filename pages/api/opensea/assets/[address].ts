import type { NextApiRequest, NextApiResponse } from 'next'
import { ICollection } from '../../../../frontend/types'
import { pruneAndRemoveDuplicateCollections, getAssetsForOwner, pruneAssets } from '../../../../lib/opensea/collections'
import { UPSERT_COLLECTION_WITHOUT_STATS } from '../../../../graphql/mutations'
import client from '../../../../backend/graphql-client'
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'

// To use sample/mock data in order not to make opensea /assets fetch, uncomment the two lines below
// import sampleAssets from '../../../../mock/small-opensea-assets.json'
// const { assets } = sampleAssets

// Upserts a collection to our database without updating stats columns
// We use this here because opensea /assets endpoint doesn't give us stats,
// so we don't want to override existing stats data
const upsertCollectionToDB = async (
  collection: Omit<ICollection, 'updated_at' | 'created_at'>,
  client: ApolloClient<NormalizedCacheObject>,
) => {
  return client.mutate({
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
    collections.forEach((collection) => {
      // console.log(`Upserting collection to db: ${collection.slug}`)

      upsertCollectionToDB(collection, client).catch((e) => {
        // It's fine if errors on the contract_address unique key, but otherwise, log it
        if (
          !e.toString().includes('unique constraint "collections_contract_address_key"') &&
          !e.toString().includes('unique constraint "collections_slug_key"')
        ) {
          console.error(`Error adding collection ${collection.slug} to DB: ${e}`)
        }
      })
    })

    // Prune Opensea assets into IAsset objects
    const prunedAssets = pruneAssets(assets)

    // Return assets
    return res.status(200).json({ assets: prunedAssets })
  } catch (error) {
    // Return errors
    return res.status(500).json({ error: `Opensea API fetch all NFTs for ${ownerAddress}: ${error}` })
  }
}

export default request
