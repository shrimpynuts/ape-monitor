import type { NextApiRequest, NextApiResponse } from 'next'
import {
  getEventsForOwner,
  getTradesByCollectionAndTradeStatsForOwner,
  unbundleEvents,
  getEventsBySuccessfulSalesAndBuys,
} from '../../../../lib/opensea'

/**
 * Fetches the sales of the given address using the Opensea API.
 */
const request = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Cache-Control', 's-maxage=1800')
  const { address: givenAddress } = req.query

  if (typeof givenAddress !== 'string') return res.status(400).json({ error: 'address must be given' })

  // Use lower case address
  const ownerAddress = givenAddress.toLowerCase()

  // Fetch all events
  const events = await getEventsForOwner(ownerAddress)

  // Unbundle events (for buying/selling NFT bundles instead of individual NFTs)
  const unbundledEvents = unbundleEvents(events)

  // Sort events by sales and buys
  const { sales, buys } = getEventsBySuccessfulSalesAndBuys(events, ownerAddress)

  // Parse events and extract data into usable objects
  const { tradesByCollection, totalTradeStats } = getTradesByCollectionAndTradeStatsForOwner(sales, buys)

  res.status(200).json({ tradesByCollection, totalTradeStats })
}

export default request
