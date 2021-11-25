import type { NextApiRequest, NextApiResponse } from 'next'

// Make sure nft port api key is available
const apiKey = process.env.NFTPORT_API_KEY
if (!apiKey) {
  console.log('Could not find nftport api key (NFTPORT_API_KEY)')
}

/**
 * Fetches the assets of the given address using nftport.xyz as a data provider
 */
const request = async (req: NextApiRequest, res: NextApiResponse) => {
  const { address: givenAddress } = req.query

  // Cannot fetch without address
  if (typeof givenAddress !== 'string') return res.status(400).json({ error: 'address must be given' })

  // Cannot fetch if api key not available
  if (!apiKey) return res.status(400).json({ error: 'Could not find nftport api key (NFTPORT_API_KEY)' })

  // Use lower case address
  const ownerAddress = givenAddress.toLowerCase()

  // Fetch all nfts
  let continuation
  let nfts: any[] = []
  while (1) {
    // Make a fetch to the nftport API
    const result: any = await fetch(
      `https://api.nftport.xyz/v0/accounts/${ownerAddress}?chain=ethereum&page_size=50&include=metadata&continuation=${continuation}`,
      {
        headers: {
          Authorization: apiKey,
        },
      },
    ).then((r) => r.json())

    // Add the resulting nfts to our list
    nfts = nfts.concat(result.nfts)

    // If continuation property is available, then the user has more nft's to fetch
    // and we need to make another iteration/call
    if (result.continuation) {
      continuation = result.continuation
    } else break
  }

  res.status(200).json({ count: nfts.length, nfts })
}

export default request
