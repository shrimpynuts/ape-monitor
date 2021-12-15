import { alchemyProvider } from './ethersProvider'
import { ICollection, IAsset, IAssetsGroupedByContract, ICollectionsWithAssets } from '../frontend/types'
import toast from 'react-hot-toast'

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

export function convertNumberToRoundedString(n: number | undefined, decimalPoints: number = 2) {
  if (!n) return '0'
  const fixedNumber = parseFloat(n.toFixed(decimalPoints))
  const numberWithCommas = fixedNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return numberWithCommas
}

/** Calculating profile totals */

export function calculateTotalAssetCount(collectionsWithAssets: ICollectionsWithAssets) {
  return Object.values(collectionsWithAssets).reduce((totalAssetCount: number, { assets }) => {
    return totalAssetCount + assets.length
  }, 0)
}

export function calculateTotalCostBasis(collectionsWithAssets: ICollectionsWithAssets) {
  return Object.values(collectionsWithAssets).reduce((totalCostBasis: number, { assets }) => {
    return totalCostBasis + calculateCostBasis(assets)
  }, 0)
}

export function calculateTotalValue(collectionsWithAssets: ICollectionsWithAssets) {
  return Object.values(collectionsWithAssets).reduce((totalValue: number, { assets, collection }) => {
    // If collection value is not null, we multiply the num assets by floor price,
    // otherwise consider this collection's value as 0
    const collectionValue = collection.floor_price ? assets.length * collection.floor_price : 0
    return totalValue + collectionValue
  }, 0)
}

export function calculatePreviousDayTotalValue(collectionsWithAssets: ICollectionsWithAssets) {
  const calculateYesterdaysFloorPrice = (floor_price: number, one_day_change: number | undefined) => {
    one_day_change = one_day_change === undefined ? 0 : one_day_change
    const percentage = one_day_change / 100
    const yesterdaysFloorPrice = floor_price / (percentage + 1)
    return yesterdaysFloorPrice
  }
  return Object.values(collectionsWithAssets).reduce((totalValue: number, { assets, collection }) => {
    // If collection value is not null, we multiply the num assets by floor price,
    // otherwise consider this collection's value as 0

    const collectionValue = collection.floor_price
      ? assets.length * calculateYesterdaysFloorPrice(collection.floor_price, collection.one_day_change)
      : 0
    return totalValue + collectionValue
  }, 0)
}

// TODO: Double check this total change calculation
export function calculateTotalChange(collectionsWithAssets: ICollectionsWithAssets) {
  const totalValue = calculateTotalValue(collectionsWithAssets)
  const previousDayValue = calculatePreviousDayTotalValue(collectionsWithAssets)
  const percentChange = ((previousDayValue - totalValue) / Math.abs(totalValue)) * 100

  if (previousDayValue > totalValue) {
    return percentChange * -1
  } else {
    return percentChange
  }
}

export function calculateCostBasis(assets: IAsset[]) {
  return assets.reduce((acc: number, asset: IAsset) => {
    return asset.last_sale ? acc + asset.last_sale : acc
  }, 0)
}

export function getServer() {
  const domain = window.location.href.split('/').slice(0, 3).join('/')
  return domain
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
  try {
    const collections = await Promise.all(
      Object.values(assetsGroupedByContractAddress).map((assetGroup) => {
        // Just take the first asset in the group to get the contract address
        const asset = assetGroup[0]
        // Hit our own /api/collections endpoint for the collections data
        const collection = fetch(`${getServer()}/api/collection/${asset.contract_address}`)
          .then((r) => r.json())
          .catch((error) => {
            return { error }
          })
        return collection
      }),
    )

    // Filter out the collections that error'ed
    const validResults = collections.filter((result) => !result.error)

    // Log error if collection fails to fetch all collections
    const numCollectionsExpected = Object.keys(assetsGroupedByContractAddress).length
    const numCollectionsFetched = validResults.length

    if (numCollectionsFetched !== numCollectionsExpected) {
      toast.error(`Error: could not fetch ${numCollectionsExpected - numCollectionsFetched} collections!`)
    }

    return validResults
  } catch (e) {
    console.log({ e })
    return []
  }
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

export const getRankDisplay = (rank: number) => {
  switch (rank) {
    case 1:
      return '🥇'
    case 2:
      return '🥈'
    case 3:
      return '🥉'
    default:
      return `${rank}`
  }
}
