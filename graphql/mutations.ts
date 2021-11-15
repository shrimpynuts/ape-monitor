import { gql } from '@apollo/client'

export const INSERT_USER = gql`
  mutation InsertUser($user: users_insert_input!) {
    insert_users_one(
      object: $user
      on_conflict: {
        constraint: users_address_key
        update_columns: [ensDomain, totalValue, totalCostBasis, totalAssetCount]
      }
    ) {
      totalValue
      totalAssetCount
      totalCostBasis
    }
  }
`
