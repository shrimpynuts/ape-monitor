import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchOpenSeaCollections } from '../../../backend/opensea-helpers'
import { serialLoopFlow } from './../../../backend/utils'

/**
 * Fetches the data for a single collection by its contract address from our database
 */
const request = async (req: NextApiRequest, res: NextApiResponse) => {
  let offset = 0
  const calls = []
  while (offset < 30000) {
    let newCall = { offset }
    calls.push(newCall)
    offset += 300
  }

  await serialLoopFlow(calls, fetchOpenSeaCollections)
  await fetchOpenSeaCollections({ offset: 25000 })
  res.status(200).json({ status: 'hello, world' })
}

export default request
