import type { NextApiRequest, NextApiResponse } from 'next'
import { getNFTsForOwner } from '../../../backend/moralis'

/**
 * Fetches the data for a single collection by its contract address from our database
 */
const request = async (req: NextApiRequest, res: NextApiResponse) => {
  const nfts = await getNFTsForOwner('0xd6CB70a88bB0D8fB1be377bD3E48e603528AdB54')
  res.status(200).json({ status: nfts })
}

export default request
