import web3 from 'web3'

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

export function fixedNumber(n: number) {
  return n ? parseFloat(n.toFixed(2)) : 0
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
