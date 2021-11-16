import type { NextApiRequest, NextApiResponse } from 'next'
import { getEventsForOwner, getTradesFromEventsForOwner, IOpenSeaEvent } from '../../../../lib/opensea'

/**
 * Fetches the sales of the given address using the Opensea API.
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { address: givenAddress } = req.query
  if (typeof givenAddress !== 'string') return res.status(400).json({ error: 'address must be given' })
  const ownerAddress = givenAddress.toLowerCase()
  const events = await getEventsForOwner(ownerAddress)
  const matches = getTradesFromEventsForOwner(events, ownerAddress)
  res.status(200).json({ matches })
}
