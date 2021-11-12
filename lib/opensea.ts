export const getCollectionsForOwner = async (ownerAddress: string) => {
  const resp = await fetch(`https://api.opensea.io/api/v1/collections?asset_owner=${ownerAddress}&offset=0&limit=300`)
  const collections = await resp.json()
  return collections
}

export const getAssetsForOwner = async (ownerAddress: string) => {
  const resp = await fetch(
    `https://api.opensea.io/api/v1/assets?owner=${ownerAddress}&order_direction=desc&offset=0&limit=50`,
  )
  const { assets } = await resp.json()
  return assets
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
    if (acc[slug]) {
      acc[slug].assets.push(asset)
    } else {
      acc[slug] = { ...asset.collection, assets: [asset] }
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
