import Arweave from 'arweave'
import { ethers } from 'ethers'

import { alchemyProvider } from '../ethersProvider'
import ERC721ABI from '../../lib/ERC721ABI.json'

const CID = require('cids')
const arweave = Arweave.init({})

export async function getTokenURI(contract_address: string, token_id: string) {
  console.log({ contract_address })

  if (contract_address === '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb') {
    console.log('PUNKS!')
  }

  const contract = new ethers.Contract(contract_address, ERC721ABI, alchemyProvider)
  console.log({ contract })
  const tokenURI = await contract.tokenURI(token_id)
  console.log({ tokenURI })
  const owner = await contract.ownerOf(token_id)
  console.log({ owner })

  let [tokenURL, protocol] = await getURLFromURI(tokenURI)
  const other = { tokenURL, protocol }

  console.log({ tokenURI })
  const metadata = await fetch(tokenURL)
    .then((res) => res.json())
    .catch(console.error)

  return { tokenURI, owner, metadata, other }
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
      return [ipfsGetEndpoint + CID, 'ipfs']
    }

    // if (url.pathname.includes('ipfs') || url.pathname.includes('Qm')) {
    //   // /ipfs/QmTtbYLMHaSqkZ7UenwEs9Sri6oUjQgnagktJSnHeWY8iG
    //   let ipfsHash = url.pathname.replace('/ipfs/', '')
    //   return [ipfsGetEndpoint + ipfsHash, 'ipfs']
    // }

    // Check if arweave (arweave in the name or arweave.net)
    if (url.hostname.includes('arweave')) {
      return [arweaveEndpoint + '/' + url.pathname.replace('/', ''), 'arweave']
    }

    // otherwise it's a centralized uri
    return [uri, 'centralized']

    // it's not a url, we keep checking
  } catch (e) {
    // check if IPFS
    if (isIPFSCID(uri)) {
      return [ipfsGetEndpoint + uri, 'ipfs']
    }

    try {
      // could be an arweave tx ID, check it
      await arweave.transactions.get(uri)
      return [arweaveEndpoint + '/' + uri, 'arweave']
    } catch (e) {
      // otherwise we don't know
      return ['', 'undefined']
    }
  }
}
