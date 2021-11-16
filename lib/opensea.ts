import { getCostBasis } from './util'

export const getCollectionsForOwner = async (ownerAddress: string) => {
  const resp = await fetch(`https://api.opensea.io/api/v1/collections?asset_owner=${ownerAddress}&offset=0&limit=300`)
  const collections = await resp.json()
  return collections
}

export const getAssetsForOwner = async (ownerAddress: string) => {
  let totalAssets: any[] = []
  // Infinite loop until all assets are fetched
  while (1) {
    // Fetch with address and the current offset set to the number of already fetched assets
    const resp = await fetch(
      `https://api.opensea.io/api/v1/assets?owner=${ownerAddress}&order_direction=desc&offset=${totalAssets.length}&limit=50`,
    )
    const { assets } = await resp.json()
    totalAssets = [...totalAssets, ...assets]

    // If we get less than the limit of 50 assets, we know we've fetched everything
    if (assets.length < 50) break
  }
  return totalAssets
}

export const getCollectionStats = (slug: string) => {
  return fetch(`https://api.opensea.io/api/v1/collection/${slug}/stats`)
}

export const getAssetsGroupedByCollectionForOwner = async (ownerAddress: string) => {
  console.time(`getAssetsForOwner for ${ownerAddress}`)

  // Get all assets for the given address
  const assets = await getAssetsForOwner(ownerAddress)
  console.timeEnd(`getAssetsForOwner for ${ownerAddress}`)

  // Group all assets by collection slug
  const byCollection = assets.reduce((acc: any, asset: any) => {
    const slug = asset.collection.slug

    // Prune the asset data
    const prunedAsset = {
      last_sale: asset.last_sale,
      image_thumbnail_url: asset.image_thumbnail_url,
      name: asset.name,
      permalink: asset.permalink,
      traits: asset.traits,
      external_link: asset.external_link,
      token_metadata: asset.token_metadata,
      listing_date: asset.listing_date,
      top_bid: asset.top_bid,
      description: asset.description,
    }

    if (acc[slug]) {
      acc[slug].assets.push(prunedAsset)
    } else {
      // Store collection data
      const collectionData = asset.collection

      // Prune collection data
      const prunedCollection = {
        name: collectionData.name,
        stats: collectionData.stats,
        slug: collectionData.slug,
        image_url: collectionData.image_url,
        twitter_username: collectionData.twitter_username,
        discord_url: collectionData.discord_url,
        external_url: collectionData.external_url,
      }
      acc[slug] = { ...prunedCollection, assets: [prunedAsset] }
    }
    return acc
  }, {})

  console.time(`all getCollectionStats for ${ownerAddress}`)
  // Add stats and costBasis to byCollections object
  const result = await Promise.all(
    Object.keys(byCollection).map(async (collectionSlug: any) => {
      return getCollectionStats(collectionSlug)
        .then((response) => response.json())
        .then(({ stats }) => {
          const collection = byCollection[collectionSlug]
          return { ...collection, stats, costBasis: getCostBasis(collection) }
        })
    }),
  )
  console.timeEnd(`all getCollectionStats for ${ownerAddress}`)

  return result
}
