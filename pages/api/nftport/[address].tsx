import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * Fetches the sales of the given address using the Opensea API.
 */
const request = async (req: NextApiRequest, res: NextApiResponse) => {
  const { address: givenAddress } = req.query

  console.time('nftport get nfts')
  if (typeof givenAddress !== 'string') return res.status(400).json({ error: 'address must be given' })

  // Use lower case address
  const ownerAddress = givenAddress.toLowerCase()

  let continuation
  let nfts: any[] = []
  while (1) {
    const result: any = await fetch(
      `https://api.nftport.xyz/v0/accounts/${ownerAddress}?chain=ethereum&page_size=50&include=metadata&continuation=${continuation}`,
      {
        headers: {
          Authorization: '68bcdc7b-89f4-4188-9abc-73a0ad9f39a8',
        },
      },
    ).then((r) => r.json())

    nfts = nfts.concat(result.nfts)

    if (result.continuation) {
      continuation = result.continuation
    } else break
  }
  console.timeEnd('nftport get nfts')

  res.status(200).json({ count: nfts.length, nfts })
}

export default request
