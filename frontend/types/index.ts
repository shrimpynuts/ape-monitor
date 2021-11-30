export interface ICollection {
  created_at: string
  updated_at: string
  name: string
  contract_address: string
  slug?: string
  twitter_username?: string
  discord_url?: string
  external_url?: string
  image_url?: string
  floor_price?: number
  one_day_change?: number
  seven_day_change?: number
  thirty_day_change?: number
  market_cap?: number
  total_volume?: number
}

export interface IAsset {
  name: string
  contract_address: string
  token_id: string
  description?: string
  image_url?: string
  link?: string

  // Only when fetching assets from Opensea
  last_sale?: number
}

export interface ICollectionsWithAssets {
  [contractAddress: string]: {
    collection: ICollection
    assets: IAsset[]
  }
}

export interface IOpenSeaEvent {
  [key: string]: any
}

export interface IAssetsGroupedByContract {
  [contract_address: string]: IAsset[]
}

export interface ITotalStats {
  oneDayChange: number
  totalValue: number
  totalAssetCount: number
  totalCostBasis: number
}

export interface IAddressData {
  address: string
  ensDomain?: string
  addressFound: boolean
}
export interface ITradeData {
  [key: string]: any
}
