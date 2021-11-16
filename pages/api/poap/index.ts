import type { NextApiRequest, NextApiResponse } from 'next'
import { ethers } from 'ethers'
import poap from '../../../lib/poap.json'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const provider = new ethers.providers.JsonRpcProvider('https://dai.poa.network')
  const poapContractAddress = '0x22C1f6050E56d2876009903609a2cC3fEf83B415'
  const poapContract = new ethers.Contract(poapContractAddress, poap.abi, provider)
  console.log(await provider.getNetwork())
  console.log(await provider.getBlockNumber())

  console.log(await poapContract.tokenDetailsOfOwnerByIndex('0x2fe31e981032bfcd71cce70a4ab5e4214f8b4860', 0))

  // https://thegraph.com/hosted-service/subgraph/poap-xyz/poap?query=Example%20query
  // https://app.poap.xyz/scan/liam.eth
  // https://blockscout.com/xdai/mainnet/address/0x22C1f6050E56d2876009903609a2cC3fEf83B415/contracts
  // https://github.com/poap-xyz

  res.status(200).json({ asd: 'sdf' })
}
