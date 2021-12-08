import web3 from 'web3'

import { IAsset, ICollection } from '../../frontend/types'
import { openseaFetchHeaders } from './config'

export const getAssetsForOwner = async (ownerAddress: string) => {
  let totalAssets: any[] = []
  // Infinite loop until all assets are fetched
  while (1) {
    // Construct request url
    const openseaEndpoint = `https://api.opensea.io/api/v1/assets?owner=${ownerAddress}&order_direction=desc&offset=${totalAssets.length}&limit=50`

    // Fetch with address and the current offset set to the number of already fetched assets
    const resp = await fetch(openseaEndpoint, openseaFetchHeaders)
    const { assets, detail } = await resp.json()

    // This means the request was throttled
    if (detail) {
      console.error(`\nOpensea assets for owner ${ownerAddress}: ${detail}\n`)
      throw new Error(detail)
    }

    if (assets) {
      totalAssets = [...totalAssets, ...assets]
      // If we get less than the limit of 50 assets, we know we've fetched everything
      if (assets.length < 50) break
    } else {
      console.error(`Could not fetch events for endpoint: ${openseaEndpoint}\n\n`)
      break
    }
  }
  return totalAssets
}

/**
 * Fetches the collection stats from the opensea API /collection/{slug}/stats endpoint
 */
export const getCollectionStats = async (slug: string) => {
  const url = `https://api.opensea.io/api/v1/collection/${slug}/stats`
  const { stats, detail } = await fetch(url, openseaFetchHeaders).then((response) => response.json())

  // This means the request was throttled
  if (detail) {
    console.error(`\nOpensea collection stats ${slug}: ${detail}\n`)
    return null
  }
  return stats
}

/**
 * Extracts ICollection's from Opensea assets
 * @param assets Opensea asset data returned from /assets endpoint
 */
export const pruneAndRemoveDuplicateCollections = (assets: any[]): Omit<ICollection, 'updated_at' | 'created_at'>[] => {
  // Create an object where the key is the collection slug and the value is the pruned collection data
  const byCollection = assets.reduce(
    (acc: { [key: string]: Omit<ICollection, 'updated_at' | 'created_at'> }, asset: any) => {
      const { token_address } = asset

      // Add the pruned collection to the accumulated object if not already there
      if (!acc[token_address]) {
        // Prune the collection
        const prunedCollection: Omit<ICollection, 'updated_at' | 'created_at'> = {
          contract_address: asset.token_address,
          name: asset.name,
          // slug: collection.slug,
          // image_url: collection.image_url,
          // twitter_username: collection.twitter_username,
          // discord_url: collection.discord_url,
          // external_url: collection.external_url,
        }
        acc[token_address] = prunedCollection
      }

      return acc
    },
    {},
  )
  return Object.values(byCollection)
}

/**
 * Turns Opensea assets into IAsset's
 * @param assets Opensea asset data returned from /assets endpoint
 */
export const pruneAssets = (openseaAssets: any[]): IAsset[] => {
  return openseaAssets.map((asset) => {
    return {
      name: asset.name,
      contract_address: asset.token_address,
      token_id: asset.token_id,
    }
  })
}
