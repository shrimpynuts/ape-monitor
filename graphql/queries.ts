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
