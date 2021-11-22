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

export const UPSERT_COLLECTION = gql`
  mutation UpsertCollection($name: String!) {
    insert_collections_one(
      object: { name: $name }
      on_conflict: { constraint: collections_pkey, update_columns: floor_price }
    ) {
      id
      created_at
      updated_at
      name
      floor_price
      slug
    }
  }
`
