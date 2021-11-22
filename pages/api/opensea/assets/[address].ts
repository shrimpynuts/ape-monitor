import type { NextApiRequest, NextApiResponse } from 'next'
import { getAssetsGroupedByCollectionForOwner, getCollectionStats } from '../../../../lib/opensea'
import { getCostBasis } from '../../../../lib/util'

/**
 * Fetches the collections of the given address using the Opensea API.
 * https://api.opensea.io/api/v1/assets
 */
const request = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Cache-Control', 's-maxage=1800')
  const { address: ownerAddress } = req.query
  if (typeof ownerAddress !== 'string') return res.status(400).json({ error: 'ownerAddress must be given' })

  // Fetch all assets grouped by collection
  console.time(`getAssetsForOwner for ${ownerAddress}`)
  const byCollection = await getAssetsGroupedByCollectionForOwner(ownerAddress)
  console.timeEnd(`getAssetsForOwner for ${ownerAddress}`)

  // Fetch stats and cost basis for each collection and attach it to the collections objects.
  console.time(`all getCollectionStats for ${ownerAddress}`)
  const results = await Promise.all(
    Object.keys(byCollection).map(async (collectionSlug: any) => {
      const collection = byCollection[collectionSlug]
      const stats = await getCollectionStats(collectionSlug)
      return { ...collection, stats, costBasis: getCostBasis(collection) }
    }),
  )
  console.timeEnd(`all getCollectionStats for ${ownerAddress}`)

  res.status(200).json({ collections: results })
}

export default request
