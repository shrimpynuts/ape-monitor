import { gql } from '@apollo/client'
import { CORE_COLLECTION_FIELDS, CORE_USER_FIELDS } from './fragments'

export const GET_LEADERBOARD = gql`
  ${CORE_USER_FIELDS}
  query GetLeaderboard {
    totalAssetCount: users(order_by: { totalAssetCount: desc }, limit: 5) {
      ...CoreUserFields
    }
    totalValue: users(order_by: { totalValue: desc }, limit: 5) {
      ...CoreUserFields
    }
    totalCostBasis: users(order_by: { totalCostBasis: desc }, limit: 5) {
      ...CoreUserFields
    }
  }
`

export const GET_COLLECTION_BY_SLUG = gql`
  ${CORE_COLLECTION_FIELDS}
  query GetCollectionBySlug($slug: String!) {
    collections(where: { slug: { _eq: $slug } }) {
      ...CoreCollectionFields
    }
  }
`
export const GET_MOST_STALE_COLLECTIONS = gql`
  query GetMostStaleCollections {
    collections(order_by: { updated_at: asc }) {
      contract_address
      updated_at
    }
  }
`

export const GET_COLLECTION_BY_CONTRACT_ADDRESS = gql`
  ${CORE_COLLECTION_FIELDS}
  query GetCollectionByContractAddress($contract_address: String!) {
    collections(where: { contract_address: { _eq: $contract_address } }) {
      ...CoreCollectionFields
    }
  }
`

export const GET_TOP_COLLECTIONS = gql`
  ${CORE_COLLECTION_FIELDS}
  query GetTopCollections($lastUpdated: timestamptz!) {
    collections(order_by: { one_day_change: desc_nulls_last }, limit: 30) {
      ...CoreCollectionFields
    }

    totalVolume: collections(order_by: { total_volume: desc_nulls_last }, limit: 10) {
      ...CoreCollectionFields
    }
    floorPrice: collections(order_by: { floor_price: desc_nulls_last }, limit: 10) {
      ...CoreCollectionFields
    }
    marketCap: collections(order_by: { market_cap: desc_nulls_last }, limit: 10) {
      ...CoreCollectionFields
    }
    oneDayChange: collections(
      order_by: { one_day_change: desc_nulls_last }
      limit: 10
      where: { updated_at: { _gte: $lastUpdated } }
    ) {
      ...CoreCollectionFields
    }
  }
`
