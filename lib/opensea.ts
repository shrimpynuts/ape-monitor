import { getCostBasis } from './util'
export interface IOpenSeaEvent {
  [key: string]: any
}

export const getCollectionsForOwner = async (ownerAddress: string) => {
  const resp = await fetch(`https://api.opensea.io/api/v1/collections?asset_owner=${ownerAddress}&offset=0&limit=300`)
  const collections = await resp.json()
  return collections
}

export const getAssetsForOwner = async (ownerAddress: string) => {
  let totalAssets: any[] = []
  // Infinite loop until all assets are fetched
  while (1) {
    // Fetch with address and the current offset set to the number of already fetched assets
    const resp = await fetch(
      `https://api.opensea.io/api/v1/assets?owner=${ownerAddress}&order_direction=desc&offset=${totalAssets.length}&limit=50`,
    )
    const { assets } = await resp.json()
    totalAssets = [...totalAssets, ...assets]

    // If we get less than the limit of 50 assets, we know we've fetched everything
    if (assets.length < 50) break
  }
  return totalAssets
}

export const getCollectionStats = (slug: string) => {
  return fetch(`https://api.opensea.io/api/v1/collection/${slug}/stats`)
}

export const getAssetsGroupedByCollectionForOwner = async (ownerAddress: string) => {
  console.time(`getAssetsForOwner for ${ownerAddress}`)

  // Get all assets for the given address
  const assets = await getAssetsForOwner(ownerAddress)
  console.timeEnd(`getAssetsForOwner for ${ownerAddress}`)

  // Group all assets by collection slug
  const byCollection = assets.reduce((acc: any, asset: any) => {
    const slug = asset.collection.slug

    // Prune the asset data
    const prunedAsset = {
      last_sale: asset.last_sale,
      image_thumbnail_url: asset.image_thumbnail_url,
      name: asset.name,
      permalink: asset.permalink,
      traits: asset.traits,
      external_link: asset.external_link,
      token_metadata: asset.token_metadata,
      listing_date: asset.listing_date,
      top_bid: asset.top_bid,
      description: asset.description,
    }

    if (acc[slug]) {
      acc[slug].assets.push(prunedAsset)
    } else {
      // Store collection data
      const collectionData = asset.collection

      // Prune collection data
      const prunedCollection = {
        name: collectionData.name,
        stats: collectionData.stats,
        slug: collectionData.slug,
        image_url: collectionData.image_url,
        twitter_username: collectionData.twitter_username,
        discord_url: collectionData.discord_url,
        external_url: collectionData.external_url,
      }
      acc[slug] = { ...prunedCollection, assets: [prunedAsset] }
    }
    return acc
  }, {})

  console.time(`all getCollectionStats for ${ownerAddress}`)
  // Add stats and costBasis to byCollections object
  const result = await Promise.all(
    Object.keys(byCollection).map(async (collectionSlug: any) => {
      return getCollectionStats(collectionSlug)
        .then((response) => response.json())
        .then(({ stats }) => {
          const collection = byCollection[collectionSlug]
          return { ...collection, stats, costBasis: getCostBasis(collection) }
        })
    }),
  )
  console.timeEnd(`all getCollectionStats for ${ownerAddress}`)

  return result
}

/**
 * Fetches the events (buy/sells) for a given address
 */
export const getEventsForOwner = async (ownerAddress: string) => {
  let totalAssetEvents: any[] = []
  const limit = 300
  // Infinite loop until all asset_events are fetched
  while (1) {
    // Fetch with address and the current offset set to the number of already fetched asset_events
    const { asset_events } = await fetch(
      `https://api.opensea.io/api/v1/events?account_address=${ownerAddress}&only_opensea=false&offset=0&limit=${limit}`,
    ).then((resp) => resp.json())
    totalAssetEvents = [...totalAssetEvents, ...asset_events]

    // If we get less than the limit of 50 asset_events, we know we've fetched everything
    if (asset_events.length < limit) break
  }
  return totalAssetEvents
}

export const getTradesFromEventsForOwner = (events: IOpenSeaEvent, ownerAddress: string) => {
  // Filter for successful event_types
  const successfulEvents = events.filter((event: IOpenSeaEvent) => event.event_type === 'successful')

  // Retrieve sales
  const sales = successfulEvents.reduce((acc: any, event: IOpenSeaEvent) => {
    if (event.seller.address === ownerAddress) acc[event.asset.id] = event
    return acc
  }, {})

  // Retrieve buys
  const buys = successfulEvents.reduce((acc: any, event: IOpenSeaEvent) => {
    if (event.winner_account.address === ownerAddress) acc[event.asset.id] = event
    return acc
  }, {})

  // Retrieve sales that have a matching buy
  const matches = Object.keys(sales).reduce((acc: any, saleId: string) => {
    if (Object.keys(buys).includes(saleId)) {
      const sale = sales[saleId]
      const buy = buys[saleId]
      const salePrice = sale.total_price
      const buyPrice = buy.total_price
      const asset = sale.asset
      acc[saleId] = { salePrice, buyPrice, asset }
    }
    return acc
  }, {})

  console.log(`${Object.keys(sales).length} sales`)
  console.log(`${Object.keys(buys).length} buys`)
  console.log(`${Object.keys(matches).length} matches`)
  return matches
}
