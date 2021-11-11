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
  res.status(200).json(await resp.json())
}
