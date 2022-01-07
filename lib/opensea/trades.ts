import web3 from 'web3'

import { IOpenSeaEvent } from '../../frontend/types'
import { openseaFetchHeaders } from './config'

/**
 * Fetches the events (buy/sells) for a given address
 */
export const getEventsForOwner = async (ownerAddress: string) => {
  let totalAssetEvents: IOpenSeaEvent[] = []
  const limit = 300
  // Infinite loop until all asset_events are fetched
  while (1) {
    // Construct request url
    const openseaEndpoint = `https://api.opensea.io/api/v1/events?account_address=${ownerAddress}&only_opensea=false&offset=${totalAssetEvents.length}&limit=${limit}`

    // Fetch with address and the current offset set to the number of already fetched asset_events
    const { asset_events } = await fetch(openseaEndpoint, openseaFetchHeaders).then((resp) => resp.json())

    if (asset_events) {
      totalAssetEvents = [...totalAssetEvents, ...asset_events]
      // If we get less than the limit of 50 asset_events, we know we've fetched everything
      if (asset_events.length < limit) break
    } else {
      console.error(`\n\nCould not fetch events for endpoint: ${openseaEndpoint}\n\n`)
      break
    }
  }
  return totalAssetEvents
}

export const unbundleEvent = (bundledEvent: IOpenSeaEvent) => {
  console.warn(`\n\nReached unbundle event!!!\n ${{ bundledEvent }}\n\n`)
  if (bundledEvent.asset_bundle) {
    return bundledEvent.asset_bundle.assets.map((asset: any) => {
      return {
        ...bundledEvent,
        ...asset,
      }
    })
  } else {
    return [bundledEvent]
  }
}

export const unbundleEvents = (events: IOpenSeaEvent[]) => {
  const unbundledEvents = events.reduce((acc: IOpenSeaEvent[], event: IOpenSeaEvent) => {
    if (event.asset_bundle) {
      for (const unbundledEvent of unbundleEvent(event)) {
        acc.push(unbundledEvent)
      }
    } else {
      acc.push(event)
    }
    return acc
  }, [])
  return unbundledEvents
}

export const getEventsBySuccessfulSalesAndBuys = (events: IOpenSeaEvent, ownerAddress: string) => {
  // Filter for successful event_types
  const successfulEvents = events.filter((event: IOpenSeaEvent) => event.event_type === 'successful')

  // Retrieve sales
  const sales = successfulEvents.reduce((acc: any, event: IOpenSeaEvent) => {
    // Trade order is just a unique id to match across sale/buy events
    const tradeOrder = event.asset ? event.asset.permalink : event.asset_bundle.permalink
    if (event.seller && event.seller.address.toLowerCase() === ownerAddress) acc[tradeOrder] = event
    return acc
  }, {})

  // Retrieve buys
  const buys = successfulEvents.reduce((acc: any, event: IOpenSeaEvent) => {
    const tradeOrder = event.asset ? event.asset.permalink : event.asset_bundle.permalink
    if (event.winner_account && event.winner_account.address.toLowerCase() === ownerAddress) acc[tradeOrder] = event
    return acc
  }, {})
  return { sales, buys }
}

/**
 *  Does the data-wrangling work for turning events into usable stats
 * @param events List of events returned from getEventsForOwner
 * @param ownerAddress Owner address of these assets
 * @returns
 */
export const getTradesByCollectionAndTradeStatsForOwner = (
  sales: { [key: string]: IOpenSeaEvent },
  buys: { [key: string]: IOpenSeaEvent },
) => {
  // Retrieve sales that have a matching buy and calculate total stats
  const tradesByCollection = Object.keys(sales).reduce((acc: any, saleId: string) => {
    // Only include trade if there is a matching buy
    if (Object.keys(buys).includes(saleId)) {
      // Fetch matched sale and buy trades
      const sale = sales[saleId]
      const buy = buys[saleId]

      // Fetch sale and buy prices for this asset
      const salePrice = parseFloat(web3.utils.fromWei(sale.total_price))
      const buyPrice = parseFloat(web3.utils.fromWei(buy.total_price))

      // Get profit for this asset
      const profit = salePrice - buyPrice

      // Get sale and buy dates for this asset
      const saleDate = Date.parse(sale.created_date)
      const buyDate = Date.parse(buy.created_date)

      // Get the hold time
      const holdTime = saleDate - buyDate

      // Prepare the asset data
      const prunedAsset = {
        image_thumbnail_url: sale.asset.image_thumbnail_url,
        name: sale.asset.name,
        salePrice,
        buyPrice,
        profit,
        buyDate,
        saleDate,
        holdTime,
      }

      // Fetch collection
      const { collection } = sale.asset

      if (acc[collection.slug]) {
        // If the collection has been seen before, calculate new total stats and add the asset to its array

        // Number of assets traded under this collection so far
        const numAssetsSoFar = acc[collection.slug].assets.length

        // Calculate average sale price
        const averageSalePriceSoFar = acc[collection.slug].averageSalePrice
        const averageSalePrice = (averageSalePriceSoFar * numAssetsSoFar + salePrice) / (numAssetsSoFar + 1)

        // Calculate average buy price
        const averageBuyPriceSoFar = acc[collection.slug].averageBuyPrice
        const averageBuyPrice = (averageBuyPriceSoFar * numAssetsSoFar + buyPrice) / (numAssetsSoFar + 1)

        // Calculate total profit
        const totalProfit = acc[collection.slug].totalProfit + profit

        // Calculate average hold time
        const averageHoldTimeSoFar = acc[collection.slug].averageHoldTime
        const averageHoldTime = (averageHoldTimeSoFar * numAssetsSoFar + holdTime) / (numAssetsSoFar + 1)

        acc[collection.slug] = {
          // Maintain old collection data
          ...acc[collection.slug],
          // Add new asset to array
          assets: [...acc[collection.slug].assets, prunedAsset],
          // Updated stats
          averageSalePrice,
          averageBuyPrice,
          averageHoldTime,
          totalProfit,
        }
      } else {
        // If this is a new collection, prune the data and initialize its object

        // Prepare the collection data
        const prunedCollection = {
          name: collection.name,
          slug: collection.slug,
          image_url: collection.image_url,
        }

        // Calculate total stats
        acc[collection.slug] = {
          ...prunedCollection,
          assets: [prunedAsset],
          totalProfit: profit,
          averageSalePrice: salePrice,
          averageBuyPrice: buyPrice,
          averageHoldTime: holdTime,
        }
      }
    }
    return acc
  }, {})

  // Calculate total stats

  // Calculate best trade based on collection averages
  const maxProfit = Math.max(
    ...Object.values(tradesByCollection).map((collection: any) => Number(collection.totalProfit)),
  )
  const bestTradeCollection = Object.values(tradesByCollection).filter(
    (collection: any) => collection.totalProfit == maxProfit,
  )[0]

  // Calculate worst trade based on collection averages
  const minProfit = Math.min(
    ...Object.values(tradesByCollection).map((collection: any) => Number(collection.totalProfit)),
  )
  const worstTradeCollection = Object.values(tradesByCollection).filter(
    (collection: any) => collection.totalProfit == minProfit,
  )[0]

  // Create total stats object
  const totalTradeStats = {
    bestTrade: bestTradeCollection,
    worstTrade: worstTradeCollection,
  }

  return { tradesByCollection, totalTradeStats }
}