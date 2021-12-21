import web3 from 'web3'

import { ICollectionsWithAssets, IAsset, ICollection } from '../../frontend/types'
import { openseaFetchHeaders } from './config'

export const getAssetsForOwner = async (ownerAddress: string) => {
  let totalAssets: any[] = []
  // Infinite loop until all assets are fetched
  while (1) {
    // Construct request url
    const url = `https://api.opensea.io/api/v1/assets?owner=${ownerAddress}&order_direction=desc&offset=${totalAssets.length}&limit=50`
    console.log(`   Making Opensea API Call: ${url}`)

    // Fetch with address and the current offset set to the number of already fetched assets
    const resp = await fetch(url, openseaFetchHeaders)
    const { assets, detail } = await resp.json()

    // This means the request was throttled
    if (detail) {
      console.error(`Opensea assets for owner ${ownerAddress}: ${detail}`)
      throw new Error(detail)
    }

    if (assets) {
      totalAssets = [...totalAssets, ...assets]
      // If we get less than the limit of 50 assets, we know we've fetched everything
      if (assets.length < 50) break
    } else {
      console.error(`Could not fetch assets for endpoint: ${url}`)
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
  console.log(`   Making Opensea API Call: ${url}`)
  const { stats, detail, error } = await fetch(url, openseaFetchHeaders)
    .then((response) => response.json())
    .catch((error) => {
      return { error }
    })

  // This could mean that the collection under this slug no longer exists (404)
  if (error) {
    console.error(`Error fetching stats for slug ${slug}: ${error.toString()}`)
    return null
  }

  // This means the request was throttled
  if (detail) {
    console.error(`\nOpensea collection stats ${slug}: ${detail}\n`)
    throw new Error(`Opensea throttled request for ${slug} (${url})`)
  }
  return stats
}

/**
 * Extracts ICollection's from Opensea assets
 * @param assets Opensea asset data returned from /assets endpoint
 */
export const pruneAndRemoveDuplicateCollections = (
  assets: any[],
): Omit<ICollection, 'updated_at' | 'created_at' | 'is_stats_fetched'>[] => {
  // Create an object where the key is the collection slug and the value is the pruned collection data
  const byCollection = assets.reduce(
    (acc: { [key: string]: Omit<ICollection, 'updated_at' | 'created_at' | 'is_stats_fetched'> }, asset: any) => {
      const { collection } = asset

      // Add the pruned collection to the accumulated object if not already there
      if (!acc[collection.slug]) {
        // Prune the collection
        const prunedCollection: Omit<ICollection, 'updated_at' | 'created_at' | 'is_stats_fetched'> = {
          contract_address: asset.asset_contract.address,
          name: collection.name,
          slug: collection.slug,
          image_url: collection.image_url,
          twitter_username: collection.twitter_username,
          discord_url: collection.discord_url,
          external_url: collection.external_url,
        }
        acc[collection.slug] = prunedCollection
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
      contract_address: asset.asset_contract.address,
      description: asset.description,
      image_url: asset.image_url,
      link: asset.permalink,
      token_id: asset.token_id,
      last_sale: asset.last_sale ? parseFloat(web3.utils.fromWei(asset.last_sale.total_price)) : undefined,
    }
  })
}

/**
 * Takes a contract address and fetches the collection data from opensea
 * @param contractAddress the address of the nft collection
 * @returns a pruned opensea collection
 */
export const fetchOpenseaCollectionFromContractAddress = async (
  contractAddress: string,
): Promise<Omit<ICollection, 'created_at' | 'updated_at' | 'is_stats_fetched'>> => {
  const url = `https://api.opensea.io/api/v1/asset_contract/${contractAddress}`
  console.log(`   Making Opensea API Call: ${url}`)
  const result = await fetch(url).then((res) => res.json())
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
 * Extracts all IAssets from an ICollectionsWithAssets object
 * @param collectionsWithAssets The ICollectionsWithAssets object
 * @returns All IAssets
 */
export const getAllAssetsFromCollections = (collectionsWithAssets: ICollectionsWithAssets) => {
  return Object.values(collectionsWithAssets).reduce((acc: IAsset[], curr) => {
    return [...acc, ...curr.assets]
  }, [])
}
