import { gql } from '@apollo/client'

export const CORE_COLLECTION_FIELDS = gql`
  fragment CoreCollectionFields on collections {
    contract_address
    discord_url
    created_at
    external_url
    floor_price
    image_url
    name
    one_day_change
    seven_day_change
    slug
    thirty_day_change
    twitter_username
    updated_at
    total_volume
    market_cap
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
