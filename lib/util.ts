import web3 from 'web3'

import { alchemyProvider } from './ethersProvider'
import { IOpenseaData } from '../frontend/types'

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

function getDomainFromURL(url: string) {
  var a = document.createElement('a')
  a.href = url
  return a.hostname
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

export const getOpenseaData: (address: string) => Promise<IOpenseaData> = async (address: string) => {
  const resp = await fetch(`${getServer()}/api/opensea/assets/${address}`)
  const { collections } = await resp.json()
  const totalStats = collections.reduce(
    (acc: any, collection: any) => {
      const numOwned = collection.assets.length
      const { total: singleCostBasis } = getCostBasis(collection)
      const singleValue = collection.stats ? collection.assets.length * collection.stats.floor_price : 0
      const singleOneDayChange = collection.stats ? numOwned * collection.stats.one_day_change : 0
      return {
        totalAssetCount: acc.totalAssetCount + numOwned,
        totalValue: acc.totalValue + singleValue,
        oneDayChange: acc.oneDayChange + singleOneDayChange,
        totalCostBasis: acc.totalCostBasis + singleCostBasis,
      }
    },
    { totalValue: 0, oneDayChange: 0, totalAssetCount: 0, totalCostBasis: 0 },
  )
  return { totalStats, collections }
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
