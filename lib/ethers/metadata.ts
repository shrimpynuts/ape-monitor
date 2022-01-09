import Arweave from 'arweave'
import { ethers } from 'ethers'

import { alchemyProvider } from '../ethersProvider'
import ERC721ABI from '../../lib/ERC721ABI.json'

const CID = require('cids')
const arweave = Arweave.init({})

export async function getTokenURI(contract_address: string, token_id: string) {
  const contract = new ethers.Contract(contract_address, ERC721ABI, alchemyProvider)
  const tokenURI = await contract.tokenURI(token_id)
  const owner = await contract.ownerOf(token_id)

  let [imageURIURL, protocol] = await getURLFromURI(tokenURI)
  const other = { imageURIURL, protocol }

  console.log({ tokenURI })
  const metadata = await fetch(tokenURI)
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

export const getURLFromURI = async (uri: string) => {
  try {
    if (!uri) {
      return ['', 'undefined']
    }
    // if correct URI we get the protocol
    let url = new URL(uri)
    // if protocol other IPFS -- get the ipfs hash
    if (url.protocol === 'ipfs:') {
      // ipfs://ipfs/Qm

      let ipfsHash = url.href.replace('ipfs://ipfs/', '')

      return [ipfsGetEndpoint + ipfsHash, 'ipfs']
    }

    if (url.pathname.includes('ipfs') || url.pathname.includes('Qm')) {
      // /ipfs/QmTtbYLMHaSqkZ7UenwEs9Sri6oUjQgnagktJSnHeWY8iG
      let ipfsHash = url.pathname.replace('/ipfs/', '')
      return [ipfsGetEndpoint + ipfsHash, 'ipfs']
    }

    // otherwise we check if arweave (arweave in the name or arweave.net)
    if (url.hostname.includes('arweave')) {
      return [arweaveEndpoint + '/' + url.pathname.replace('/', ''), 'arweave']
    }

    // otherwise it's a centralized uri
    return [uri, 'centralized']
  } catch (e) {
    // it's not a url, we keep checking
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
