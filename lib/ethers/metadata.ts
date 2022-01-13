import Arweave from 'arweave'
import { ethers } from 'ethers'

import { alchemyProvider } from '../ethersProvider'
import ERC721ABI from '../../lib/ERC721ABI.json'
import CryptopunksAttributesABI from '../../lib/CryptopunksAttributesABI.json'
import { ITokenData } from '../../frontend/types'

const CID = require('cids')
const arweave = Arweave.init({})

const CryptopunkAttributesAddress = '0x16f5a35647d6f03d5d3da7b35409d65ba03af3b2'
const CryptopunkMainAddress = '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb'

export const contractIsPunks = (contract_address: string) => contract_address === CryptopunkMainAddress

export async function getTokenURI(contract_address: string, token_id: string): Promise<ITokenData> {
  console.log({ contract_address })

  if (contractIsPunks(contract_address)) {
    console.log('PUNKS!')
    const contract = new ethers.Contract(CryptopunkAttributesAddress, CryptopunksAttributesABI, alchemyProvider)
    console.log({ token_id, contract })
    const image = await contract.punkImageSvg(parseInt(token_id))
    console.log({ image })
    return {
      metadata: {
        image,
      },
      other: { name: 'Cryptopunk', attributesContract: CryptopunkAttributesAddress },
    }
  } else {
    const contract = new ethers.Contract(contract_address, ERC721ABI, alchemyProvider)
    const tokenURI = await contract.tokenURI(token_id)
    const owner = await contract.ownerOf(token_id)

    let [tokenURL, protocol] = await getURLFromURI(tokenURI)
    const other = { tokenURL, protocol }

    const metadata = await fetch(tokenURL)
      .then((res) => res.json())
      .catch(console.error)

    return { tokenURI, owner, metadata, other }
  }
}

export const ipfsGetEndpoint = 'https://ipfs.io/ipfs/'
export const ipfsLinkEndpoint = 'https://ipfs.io/api/v0/object/get?arg='
export const arweaveEndpoint = 'https://arweave.net'

export const isIPFSCID = (hash: string) => {
  try {
    new CID(hash)
    return true
  } catch (e) {
    return false
  }
}

export const ipfsURItoURL = (uri: string) => {
  let CID = uri.replace('ipfs://', '')
  return ipfsGetEndpoint + CID
}

export const getURLFromURI = async (uri: string) => {
  try {
    let url = new URL(uri)

    // Check for IPFS Protocol
    if (url.protocol === 'ipfs:') {
      // ipfs://ipfs/Qm
      let CID = url.href.replace('ipfs://', '')
      return [ipfsGetEndpoint + CID, 'IPFS']
    }

    // if (url.pathname.includes('ipfs') || url.pathname.includes('Qm')) {
    //   // /ipfs/QmTtbYLMHaSqkZ7UenwEs9Sri6oUjQgnagktJSnHeWY8iG
    //   let ipfsHash = url.pathname.replace('/ipfs/', '')
    //   return [ipfsGetEndpoint + ipfsHash, 'ipfs']
    // }

    // Check if arweave (arweave in the name or arweave.net)
    if (url.hostname.includes('arweave')) {
      return [arweaveEndpoint + '/' + url.pathname.replace('/', ''), 'Arweave']
    }

    // otherwise it's a centralized uri
    return [uri, 'centralized']

    // it's not a url, we keep checking
  } catch (e) {
    // check if IPFS
    if (isIPFSCID(uri)) {
      return [ipfsGetEndpoint + uri, 'IPFS']
    }

    try {
      // could be an arweave tx ID, check it
      await arweave.transactions.get(uri)
      return [arweaveEndpoint + '/' + uri, 'Arweave']
    } catch (e) {
      // otherwise we don't know
      return ['', 'undefined']
    }
  }
}
