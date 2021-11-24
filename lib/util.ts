import web3 from 'web3'

import { alchemyProvider } from './ethersProvider'
import { ICollection, IAsset, IAssetsGroupedByContract, ICollectionsWithAssets } from '../frontend/types'

/**
 * Inserts middle ellipses into a given string
 * @param str The string to insert ellipses into
 * @param cutoffDecimals The minimum number of chars in string to insert ellipses
 * @param begginingDecimals The number of decimals to begin the result
 * @param endingDecimals The number of decimals to end the result
 * @returns
 */
export function middleEllipses(str: string, cutoffDecimals: number, begginingDecimals: number, endingDecimals: number) {
  if (str.length > cutoffDecimals) {
    return str.substr(0, begginingDecimals) + '...' + str.substr(str.length - endingDecimals, str.length)
  }
  return str
}

export function convertNumberToRoundedString(n: number, decimalPoints?: number) {
  if (!n) return '0'
  const fixedNumber = parseFloat(n.toFixed(decimalPoints !== undefined ? decimalPoints : 2))
  const numberWithCommas = fixedNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return numberWithCommas
}

export function getServer() {
  const domain = window.location.href.split('/').slice(0, 3).join('/')
  return domain
}

export function getCostBasis(collection: any) {
  return collection.assets?.reduce(
    (acc: any, asset: any) => {
      if (asset.last_sale) {
        return {
          total: acc.total + parseFloat(web3.utils.fromWei(asset.last_sale.total_price)),
          symbol: asset.last_sale.payment_token.symbol,
        }
      } else {
        return acc
      }
    },
    {
      total: 0,
      symbol: '',
    },
  )
}

export const getNetworkAddress = async (ensDomain: string) => {
  const networkAddress = await alchemyProvider.resolveName(ensDomain)
  return networkAddress
}

export const getENSDomain = async (address: string) => {
  return await alchemyProvider.lookupAddress(address)
}

export const isENSDomain = (address: string) => address.substr(address.length - 4) === '.eth'

/**
 * Turns an array of IAsset[] into IAssetsGroupedByContract
 */
export const groupAssetsByContractAddress: (assets: IAsset[]) => IAssetsGroupedByContract = (assets) => {
  return assets.reduce((acc: IAssetsGroupedByContract, asset: IAsset) => {
    if (!acc[asset.contract_address]) {
      acc[asset.contract_address] = [asset]
    } else {
      acc[asset.contract_address].push(asset)
    }
    return acc
  }, {})
}

/**
 * Hits our own /api/collections endpoint for all collections
 */
export const fetchAllCollections = async (assets: IAsset[]): Promise<ICollection[]> => {
  // Group the assets by their contract address
  const assetsGroupedByContractAddress: IAssetsGroupedByContract = groupAssetsByContractAddress(assets)

  // Fetch the data for all contracts in parallel
  const collections = await Promise.all(
    Object.values(assetsGroupedByContractAddress).map((assetGroup) => {
      // Just take the first asset in the group to get the contract address
      const asset = assetGroup[0]
      // Hit our own /api/collections endpoint for the collections data
      return fetch(`${getServer()}/api/collection/${asset.contract_address}`).then((r) => r.json())
    }),
  )

  return collections
}

export const groupAssetsWithCollections: (assets: IAsset[], collections: ICollection[]) => ICollectionsWithAssets = (
  assets,
  collections,
) => {
  // Group the assets by their contract address
  const assetsGroupedByContractAddress: IAssetsGroupedByContract = groupAssetsByContractAddress(assets)

  // Group the assets together with their collections
  const collectionsWithAssets = collections.reduce((acc: ICollectionsWithAssets, collection: ICollection) => {
    return {
      ...acc,
      [collection.contract_address]: {
        collection,
        assets: assetsGroupedByContractAddress[collection.contract_address],
      },
    }
  }, {})
  return collectionsWithAssets
}

/**
 * Fetches the next theme that would be toggled to (for next-themes)
 * @returns 'dark' or 'light'
 */
export const getNextTheme = (theme: string | undefined, systemTheme: string | undefined) => {
  if (theme === 'system') {
    return systemTheme === 'light' ? 'dark' : 'light'
  } else {
    return theme === 'light' ? 'dark' : 'light'
  }
}

export function getFormattedDate(date: Date) {
  var year = date.getFullYear()

  var month = (1 + date.getMonth()).toString()
  month = month.length > 1 ? month : '0' + month

  var day = date.getDate().toString()
  day = day.length > 1 ? day : '0' + day

  return month + '/' + day + '/' + year
}

export const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
})
