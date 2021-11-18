import type { NextApiRequest, NextApiResponse } from 'next'
import { getAssetsGroupedByCollectionForOwner } from '../../../../lib/opensea'

/**
 * Fetches the collections of the given address using the Opensea API.
 * https://api.opensea.io/api/v1/assets
 */
const request = async (req: NextApiRequest, res: NextApiResponse) => {
  const { address: ownerAddress } = req.query
  if (typeof ownerAddress !== 'string') return res.status(400).json({ error: 'ownerAddress must be given' })
  const collections = await getAssetsGroupedByCollectionForOwner(ownerAddress)
  res.status(200).json({ collections })
}

export default request
