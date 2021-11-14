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

export const getCollectionStats = async (slug: string) => {
  const resp = await fetch(`https://api.opensea.io/api/v1/collection/${slug}/stats`)
  const { stats } = await resp.json()
  return stats
}

export const getAssetsGroupedByCollectionForOwner = async (ownerAddress: string) => {
  // Get all assets for the given address
  const assets = await getAssetsForOwner(ownerAddress)

  // Group all assets by collection slug
  const byCollection = assets.reduce((acc: any, asset: any) => {
    const slug = asset.collection.slug

    // Prune the asset for data
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
      acc[slug] = { ...collectionData, assets: [prunedAsset] }
    }
    return acc
  }, {})

  // Add stats to byCollections object
  await Promise.all(
    Object.keys(byCollection).map(async (collectionSlug: any) => {
      const stats = await getCollectionStats(collectionSlug)
      byCollection[collectionSlug] = { ...byCollection[collectionSlug], stats }
    }),
  )

  return Object.values(byCollection)
}
