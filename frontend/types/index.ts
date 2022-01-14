export interface ICollection {
  created_at: string
  updated_at: string
  contract_address: string
  is_stats_fetched: boolean
  name?: string
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

  one_day_volume?: number
  one_day_sales?: number
  one_day_average_price?: number
  seven_day_volume?: number
  seven_day_sales?: number
  seven_day_average_price?: number
  thirty_day_volume?: number
  thirty_day_sales?: number
  total_sales?: number
  total_supply?: number
  count?: number
  num_owners?: number
  average_price?: number
  num_reports?: number
}

export interface IOpenseaCollection {
  [key: string]: any
}

export interface IOpenseaAsset {
  [key: string]: any
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

export interface IEvent {
  [key: string]: any
  date: Date
  type: string
  asset: IAsset
  collection: Omit<ICollection, 'created_at' | 'updated_at' | 'is_stats_fetched'>
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

export type ProtocolType = 'IPFS' | 'Arweave' | 'Centralized' | 'Unknown' | 'Pinata (IPFS)' | 'Data'
export interface ITokenData {
  tokenURI?: string // Doesn't exist for cryptopunks
  tokenURL?: string
  protocol?: ProtocolType
  owner?: string // Doesn't exist for cryptopunks
  metadata: { [key: string]: any }

  permanenceColor: string
  permanenceGrade: string
  permanenceDescription: string
}
