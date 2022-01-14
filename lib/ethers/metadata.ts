import Arweave from 'arweave'
import { ethers } from 'ethers'

import { alchemyProvider } from '../ethersProvider'
import ERC721ABI from '../../lib/ERC721ABI.json'
import CryptopunksAttributesABI from '../../lib/CryptopunksAttributesABI.json'
import { ITokenData, ProtocolType } from '../../frontend/types'

const CID = require('cids')
const arweave = Arweave.init({})

const CryptopunkAttributesAddress = '0x16f5a35647d6f03d5d3da7b35409d65ba03af3b2'
const CryptopunkMainAddress = '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb'

export const contractIsPunks = (contract_address: string) => contract_address === CryptopunkMainAddress

const permanenceGradeToColor = (permanenceGrade: string) => {
  switch (permanenceGrade) {
    case 'A':
      return 'green'
    case 'B':
      return 'yellow'
    case 'C':
      return 'red'
    case 'D':
      return 'red'
    case 'F':
      return 'red'
    default:
      return 'white'
  }
}

const defaultPerformanceDetails = {
  metadata: `This asset is either stored on a centralized provider or there might not be a link between your NFT and the asset on chain. 
Your asset is at great risk of loss if the provider goes out of business, if the issuer stops payment to the storage provider or if the link between
your NFT and the assets breaks (for example, if the link is stored on a centralized website).`,
  image: 'fuck',
}

const permanenceDetails: {
  [key in ProtocolType]: {
    metadata: string
    image: string
  }
} = {
  IPFS: {
    metadata: `This NFT's metadata is stored safely on IPFS, a decentralized data provider. This is good!
    However, long term permanence of the asset is not guaranteed. The asset requires ongoing renewal and payment of the storage contract or it will be permanently lost`,
    image: "This NFT's image is stored safely on IPFS.",
  },
  Arweave: defaultPerformanceDetails,
  ['Pinata (IPFS)']: defaultPerformanceDetails,
  Centralized: defaultPerformanceDetails,
  Unknown: defaultPerformanceDetails,
  Data: defaultPerformanceDetails,
}

export async function getTokenData(contract_address: string, token_id: string): Promise<ITokenData> {
  if (contractIsPunks(contract_address)) {
    console.log('PUNKS!')
    const contract = new ethers.Contract(CryptopunkAttributesAddress, CryptopunksAttributesABI, alchemyProvider)
    const image = await contract.punkImageSvg(parseInt(token_id))
    return {
      metadata: {
        image,
      },
      permanenceColor: 'yellow',
      permanenceGrade: 'B',
      permanenceDescription: 'This is because something',
    }
  } else {
    const contract = new ethers.Contract(contract_address, ERC721ABI, alchemyProvider)
    const tokenURI = await contract.tokenURI(token_id)
    const owner = await contract.ownerOf(token_id)

    let { tokenURL, protocol } = await getURLFromURI(tokenURI)

    const metadata = await fetch(tokenURL)
      .then((res) => res.json())
      .catch(console.error)

    if (!metadata) {
      console.log("Couldn't fetch metadata")
    }

    let permanenceGrade
    if (protocol === 'IPFS' || protocol === 'Pinata (IPFS)') {
      permanenceGrade = 'B'
    } else if (protocol === 'Arweave' || protocol === 'Data') {
      permanenceGrade = 'A'
    } else if (protocol === 'Centralized') {
      permanenceGrade = 'F'
    } else {
      permanenceGrade = 'F'
    }

    const permanenceColor = permanenceGradeToColor(permanenceGrade)

    if (metadata?.image) {
      const { protocol } = await getURLFromURI(metadata.image)
      if (protocol === 'IPFS' || protocol === 'Pinata (IPFS)' || protocol === 'Arweave' || protocol === 'Data') {
        permanenceGrade += '+'
      } else {
        permanenceGrade += '-'
      }
    }

    let permanenceDescription = permanenceDetails[protocol].metadata
    permanenceDescription += `\n${permanenceDetails[protocol].image}`

    return {
      tokenURI,
      tokenURL,
      owner,
      metadata,
      protocol,
      permanenceColor,
      permanenceGrade,
      permanenceDescription,
    }
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

export const getURLFromURI = async (uri: string): Promise<{ tokenURL: string; protocol: ProtocolType }> => {
  try {
    let url = new URL(uri)

    console.log(url.hostname)

    // Check for IPFS URL
    if (url.hostname === 'ipfs.io') {
      return { tokenURL: uri, protocol: 'IPFS' }
    }

    // Check for IPFS URI
    if (url.protocol === 'ipfs:') {
      // ipfs://ipfs/Qm
      let CID = url.href.replace('ipfs://', '')
      return { tokenURL: ipfsGetEndpoint + CID, protocol: 'IPFS' }
    }

    // Check for data URI
    if (url.protocol === 'data:') {
      // ipfs://ipfs/Qm
      return { tokenURL: uri, protocol: 'Data' }
    }

    // Check for Pinata (IPFS)
    if (url.href.includes('mypinata.cloud/ipfs')) {
      return { tokenURL: uri, protocol: 'Pinata (IPFS)' }
    }

    // Check if arweave (arweave in the name or arweave.net)
    if (url.hostname.includes('arweave')) {
      return { tokenURL: arweaveEndpoint + '/' + url.pathname.replace('/', ''), protocol: 'Arweave' }
    }

    // otherwise it's a centralized uri
    return { tokenURL: uri, protocol: 'Centralized' }

    // it's not a url, we keep checking
  } catch (e) {
    // check if IPFS
    if (isIPFSCID(uri)) {
      return { tokenURL: ipfsGetEndpoint + uri, protocol: 'IPFS' }
    }

    try {
      // could be an arweave tx ID, check it
      await arweave.transactions.get(uri)
      return { tokenURL: arweaveEndpoint + '/' + uri, protocol: 'Arweave' }
    } catch (e) {
      // otherwise we don't know
      return { tokenURL: uri, protocol: 'Unknown' }
    }
  }
}
