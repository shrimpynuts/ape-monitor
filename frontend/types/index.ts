export interface ICollection {
  stats: {
    one_day_volume: number
    one_day_change: number
    one_day_sales: number
    one_day_average_price: number
    seven_day_volume: number
    seven_day_change: number
    seven_day_sales: number
    seven_day_average_price: number
    thirty_day_volume: number
    thirty_day_change: number
    thirty_day_sales: number
    thirty_day_average_price: number
    total_volume: number
    total_sales: number
    total_supply: number
    count: number
    num_owners: number
    average_price: number
    num_reports: number
    market_cap: number
    floor_price: number | undefined
  }
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
export interface IOpenseaData {
  collections: ICollection[]
  totalStats: ITotalStats
}

export interface ITradeData {
  [key: string]: any
}
