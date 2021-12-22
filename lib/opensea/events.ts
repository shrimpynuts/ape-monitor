import web3 from 'web3'

import { ICollection, IEvent, IOpenSeaEvent, IAsset } from '../../frontend/types'
import { openseaFetchHeaders } from './config'
import { pruneAsset } from './collections'

/**
 * Fetches the events (buy/sells) for a given address
 */
export const getEventsForOwner = async (ownerAddress: string) => {
  let totalAssetEvents: IOpenSeaEvent[] = []
  const limit = 300
  // Infinite loop until all asset_events are fetched
  while (1) {
    // Construct request url
    const url = `https://api.opensea.io/api/v1/events?account_address=${ownerAddress}&only_opensea=false&offset=${totalAssetEvents.length}&limit=${limit}`
    console.log(`   Making Opensea API Call: ${url}`)

    // Fetch with address and the current offset set to the number of already fetched asset_events
    const { asset_events } = await fetch(url, openseaFetchHeaders).then((resp) => resp.json())

    if (asset_events) {
      totalAssetEvents = [...totalAssetEvents, ...asset_events]
      // If we get less than the limit of 50 asset_events, we know we've fetched everything
      if (asset_events.length < limit) break
    } else {
      console.error(`Could not fetch events for endpoint: ${url}`)
      break
    }
  }
  return totalAssetEvents
}

export const unbundleEvent = (bundledEvent: IOpenSeaEvent) => {
  console.warn(`Reached unbundle event!!!`)
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
    (collection: any) => collection.totalProfit == maxProfit && collection.totalProfit > 0,
  )[0]

  // Calculate worst trade based on collection averages
  const minProfit = Math.min(
    ...Object.values(tradesByCollection).map((collection: any) => Number(collection.totalProfit)),
  )
  const worstTradeCollection = Object.values(tradesByCollection).filter(
    (collection: any) => collection.totalProfit == minProfit && collection.totalProfit < 0,
  )[0]

  // Create total stats object
  const totalTradeStats = {
    bestTrade: bestTradeCollection,
    worstTrade: worstTradeCollection,
  }

  return { tradesByCollection, totalTradeStats }
}

const getEventFromAddress = (event: IOpenSeaEvent) => {
  return event.from_account.address
}

const getEventToAddress = (event: IOpenSeaEvent) => {
  return event.to_account.address
}

const isEventSeller = (event: IOpenSeaEvent, address: string) => {
  return getEventFromAddress(event).toLowerCase() === address.toLowerCase()
}

const isEventBuyer = (event: IOpenSeaEvent, address: string) => {
  return getEventToAddress(event).toLowerCase() === address.toLowerCase()
}

const getCollectionFromEvent = (
  event: IOpenSeaEvent,
): Omit<ICollection, 'created_at' | 'updated_at' | 'is_stats_fetched'> => {
  return {
    contract_address: event.asset.asset_contract.address,
    name: event.asset.collection.name,
    slug: event.asset.collection.slug,
    image_url: event.asset.collection.image_url,
    twitter_username: event.asset.collection.twitter_username,
    discord_url: event.asset.collection.discord_url,
    external_url: event.asset.collection.external_url,
  }
}

const getAssetFromEvent = (event: IOpenSeaEvent): IAsset => {
  return pruneAsset(event.asset)
}

const getEventType = (event: IOpenSeaEvent): string => {
  return event.event_type
}

export const pruneEvent = (event: IOpenSeaEvent) => {
  const prunedEvent: IEvent = {
    date: event.created_date,
    asset: getAssetFromEvent(event),
    collection: getCollectionFromEvent(event),
    type: getEventType(event),

    // If 'successful' it means this is a sale/buy
    // Retrieve seller/winner data and price
    ...(getEventType(event) === 'successful' && {
      sellerAddress: event.seller.address,
      sellerUsername: event.seller.user?.username,
      buyerAddress: event.winner_account.address,
      buyerUsername: event.winner_account.user?.username,
      price: parseFloat(web3.utils.fromWei(event.total_price)),
    }),

    // If 'transfer', retrieve from/to data
    ...(getEventType(event) === 'transfer' && {
      fromAddress: event.from_account.address,
      fromUsername: event.from_account.user?.username,
      toAddress: event.to_account.address,
      toUsername: event.to_account.user?.username,
    }),
  }
  return prunedEvent
}
