import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * Fetches the assets of the given address using the Opensea API.
 * https://api.opensea.io/api/v1/assets
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { address: ownerAddress } = req.query
  const resp = await fetch(
    `https://api.opensea.io/api/v1/assets?owner=${ownerAddress}&order_direction=desc&offset=0&limit=50`,
  )
  const { assets } = await resp.json()
  const byCollection = assets.reduce((acc: any, asset: any) => {
    if (acc[asset.collection.slug]) {
      acc[asset.collection.slug].assets.push(asset)
    } else {
      acc[asset.collection.slug] = { ...asset.collection, assets: [asset] }
    }

    return acc
  }, {})
  res.status(200).json(byCollection)
}
