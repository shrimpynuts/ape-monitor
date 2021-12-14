import type { NextApiRequest, NextApiResponse } from 'next'
import { GET_COLLECTION_BY_CONTRACT_ADDRESS } from '../../../graphql/queries'
import client from '../../../backend/graphql-client'

/**
 * Fetches the data for a single collection by its contract address from our database
 */
const request = async (req: NextApiRequest, res: NextApiResponse) => {
  const { contract_address: givenAddress } = req.query

  if (typeof givenAddress !== 'string') return res.status(400).json({ error: 'Bad request - address must be given' })

  // Use lower case address
  const contractAddress = givenAddress.toLowerCase()

  // Fetch the collections object in our DB
  const { data } = await client.query({
    query: GET_COLLECTION_BY_CONTRACT_ADDRESS,
    variables: { contract_address: contractAddress },
  })

  // Grab the desired collection
  const collection = data.collections[0]

  // Return cached collection data
  res.status(200).json(collection)
}

export default request
