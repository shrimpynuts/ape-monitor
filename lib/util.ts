import web3 from 'web3'
import { ethers } from 'ethers'

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

export function fixedNumber(n: number, decimalPoints?: number) {
  return n ? parseFloat(n.toFixed(decimalPoints !== undefined ? decimalPoints : 2)) : 0
}

export function getServer() {
  const dev = process.env.NODE_ENV !== 'production'
  const server = dev ? 'http://localhost:3000' : 'https://www.apemonitor.com'
  return server
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
  const etherscanProvider = new ethers.providers.EtherscanProvider()
  return await etherscanProvider.resolveName(ensDomain)
}

export const isENSDomain = (address: string) => address.substr(address.length - 4) === '.eth'

export const getOpenseaData = async (address: string) => {
  const dev = process.env.NODE_ENV !== 'production'
  const server = dev ? 'http://localhost:3000' : 'https://www.apemonitor.com'
  const resp = await fetch(`${server}/api/opensea/${address}`)
  const { collections } = await resp.json()
  const totalStats = collections.reduce(
    (acc: any, collection: any) => {
      const numOwned = collection.assets.length
      const { total: singleCostBasis } = getCostBasis(collection)
      const singleValue = collection.stats ? collection.assets.length * collection.stats.floor_price : 0
      const singleOneDayChange = collection.stats ? numOwned * collection.stats.one_day_change : 0
      return {
        assetsOwned: acc.assetsOwned + numOwned,
        value: acc.value + singleValue,
        oneDayChange: acc.oneDayChange + singleOneDayChange,
        costBasis: acc.costBasis + singleCostBasis,
      }
    },
    { value: 0, oneDayChange: 0, assetsOwned: 0, costBasis: 0 },
  )
  return { totalStats, collections }
}
