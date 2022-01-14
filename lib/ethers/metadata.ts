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
    default:
      return 'red'
  }
}

const defaultPerformanceDetails = {
  metadata: `This asset is either stored on a centralized provider or there might not be a link between your NFT and the asset on chain. 
Your asset is at great risk of loss if the provider goes out of business, if the issuer stops payment to the storage provider or if the link between
your NFT and the assets breaks (for example, if the link is stored on a centralized website).`,
  image: '',
}

const permanenceDetails: {
  [key in ProtocolType]: {
    metadata: string
    image: string
  }
} = {
  IPFS: {
    metadata: `This NFT's metadata is stored safely on IPFS, a decentralized data provider. This is good!
    However, long term permanence of the asset is not guaranteed. The asset requires ongoing renewal and payment of the storage contract or it will be permanently lost.`,
    image: '',
  },
  Arweave: {
    metadata: `This NFT's metadata is stored safely on Arweave. Arweave is the best long term solution for hosting your data.`,
    image: '',
  },
  ['Pinata (IPFS)']: defaultPerformanceDetails,
  Centralized: defaultPerformanceDetails,
  Unknown: defaultPerformanceDetails,
  Data: {
    metadata: `This NFT's metadata is stored 100% on-chain. This is the best possible scenario!
    As long as the smart contract is not mutated, you can be sure that this data is permanent.
    Furthermore, other smart contracts can access this data to create derivative projects.`,
    image: '',
  },
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
      permanenceColor: 'green',
      permanenceGrade: 'A-',
      permanenceDescription: `Cryptopunks is a unique NFT collection. Because they were created before the ERC-721 standard, each token is not directly linked to any metadata at all.
      The only true verification is stored as a hash of the entire collection of punk images. Read more about the details here: https://github.com/larvalabs/cryptopunks.
      However, as of August 2021, the metadata for each punk has been deployed to its own smart contract (https://www.larvalabs.com/blog/2021-8-18-18-0/on-chain-cryptopunks).`,
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
      const { protocol: imageProtocol } = await getURLFromURI(metadata.image)
      if (
        imageProtocol === 'IPFS' ||
        imageProtocol === 'Pinata (IPFS)' ||
        imageProtocol === 'Arweave' ||
        imageProtocol === 'Data'
      ) {
        permanenceGrade += '+'
      } else {
        permanenceGrade += '-'
      }

      const obj = {
        tokenURI,
        tokenURL,
        owner,
        metadata,
        protocol,
        permanenceColor,
        permanenceGrade,
      }

      // Special cases

      // Both image and metadata are on IPFS
      if (protocol === 'IPFS' || imageProtocol === 'IPFS') {
        return {
          ...obj,
          permanenceDescription: `Both the NFT metadata and image are stored on IPFS. IPFS is indeed a decentralized data provider, so this data cannot change. 
          However, the data isn\t guaranteed to always be persistently available. Read more about it here: https://docs.ipfs.io/concepts/persistence/#persistence-versus-permanence.`,
        }
      }

      // Both image and metadata are on IPFS, pinned by Pinata
      if (protocol === 'Pinata (IPFS)' && imageProtocol === 'Pinata (IPFS)') {
        return {
          ...obj,
          permanenceDescription: `Both the NFT metadata and image are stored on IPFS, and pinned using Pinata. While IPFS alone can't guarantee 
          that the data remains available, Pinata will keep the data pinned (available) as long as Pinata\'s pinning service is paid for.`,
        }
      }

      // Both image and metadata are on Arweave
      if (protocol === 'Arweave' && imageProtocol === 'Arweave') {
        return {
          ...obj,
          permanenceDescription: `Both the NFT metadata and image are stored on Arweave. 
          This is the best permanent solution for hosting data long term, so you can rest assured. Ape away!`,
        }
      }

      // Both image and metadata are on chain
      if (protocol === 'Data' && imageProtocol === 'Data') {
        return {
          ...obj,
          permanenceDescription: `Both the NFT metadata AND image are stored 100% on-chain. This is the best possible scenario!
          As long as the smart contract is not mutated, you can be sure that this data is permanent.
          Furthermore, other smart contracts can access this data to create derivative projects.`,
        }
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
