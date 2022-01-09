import { gql } from '@apollo/client'

export const CORE_COLLECTION_FIELDS = gql`
  fragment CoreCollectionFields on collections {
    # metadata
    created_at
    updated_at

    # required
    contract_address

    # opensea collection data
    name
    slug
    image_url
    discord_url
    external_url
    twitter_username

    # stats
    floor_price
    one_day_change
    seven_day_change
    thirty_day_change
    total_volume
    market_cap

    # default false
    is_stats_fetched

    # newly added stats
    one_day_volume
    one_day_sales
    one_day_average_price
    seven_day_volume
    seven_day_sales
    seven_day_average_price
    thirty_day_volume
    thirty_day_sales
    total_sales
    total_supply
    count
    num_owners
    average_price
    num_reports
  }
`

export const CORE_USER_FIELDS = gql`
  fragment CoreUserFields on users {
    ensDomain
    address
    totalAssetCount
    totalCostBasis
    totalValue
  }
`
export const COLLECTIONS_AGGREGATE_COUNT = gql`
  fragment CollectionsAggregateCount on collections_aggregate {
    aggregate {
      count
    }
  }
`
