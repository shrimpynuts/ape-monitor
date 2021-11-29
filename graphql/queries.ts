import { gql } from '@apollo/client'

export const GET_LEADERBOARD = gql`
  query GetLeaderboard {
    totalAssetCount: users(order_by: { totalAssetCount: desc }, limit: 5) {
      ensDomain
      address
      totalAssetCount
      totalCostBasis
      totalValue
    }
    totalValue: users(order_by: { totalValue: desc }, limit: 5) {
      ensDomain
      address
      totalAssetCount
      totalCostBasis
      totalValue
    }
    totalCostBasis: users(order_by: { totalCostBasis: desc }, limit: 5) {
      ensDomain
      address
      totalAssetCount
      totalCostBasis
      totalValue
    }
  }
`

export const GET_COLLECTION_BY_SLUG = gql`
  query GetCollectionBySlug($slug: String!) {
    collections(where: { slug: { _eq: $slug } }) {
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
  query GetCollectionByContractAddress($contract_address: String!) {
    collections(where: { contract_address: { _eq: $contract_address } }) {
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
  }
`
