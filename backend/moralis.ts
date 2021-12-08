import Moralis from './moralisFactory'

interface IOwnerNFT {
  token_address: string
  token_id: string
  amount: string
  owner_of: string
  block_number: string
  block_number_minted: string
  contract_type: 'ERC721'
  name: string
  symbol: string
  token_uri: string
  metadata: string
  is_valid: 0 | 1
  syncing: 0 | 1
  synced_at: string
  frozen: number
}

export const getNFTsForOwner = async (address: string) => {
  console.log(`Initializing Moralizing.`)

  console.log(`Calling moralis.`)
  const userEthNFTs = await Moralis.Web3API.account.getNFTs({
    chain: 'eth',
    address,
  })

  console.log(`Moralis Response: \n`)
  return userEthNFTs
}
