import type { NextApiRequest, NextApiResponse } from 'next'

const getAssetsForOwner = async (ownerAddress: string) => {
  const resp = await fetch(
    `https://api.opensea.io/api/v1/assets?owner=${ownerAddress}&order_direction=desc&offset=0&limit=50`,
  )
  const { assets } = await resp.json()
  return assets
}

const getCollectionStats = async (slug: string) => {
  const resp = await fetch(`https://api.opensea.io/api/v1/collection/${slug}/stats`)
  const { stats } = await resp.json()
  return stats
}

/**
 * Fetches the assets of the given address using the Opensea API.
 * https://api.opensea.io/api/v1/assets
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { address: ownerAddress } = req.query
  if (typeof ownerAddress !== 'string') return res.status(400).json({ error: 'ownerAddress must be given' })

  // Get all assets for the given address
  const assets = await getAssetsForOwner(ownerAddress)

  // Group all assets by collection slug
  const byCollection = assets.reduce((acc: any, asset: any) => {
    const slug = asset.collection.slug
    console.log({ slug })
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

  res.status(200).json(byCollection)
}
