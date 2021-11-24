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

export const UPSERT_COLLECTION_WITH_STATS = gql`
  mutation UpsertCollection($collection: collections_insert_input!) {
    insert_collections_one(
      object: $collection
      on_conflict: {
        constraint: collections_slug_key
        update_columns: [floor_price, one_day_change, seven_day_change, thirty_day_change]
      }
    ) {
      id
      updated_at
      slug
      floor_price
      one_day_change
      seven_day_change
      thirty_day_change
    }
  }
`

export const UPSERT_COLLECTION_WITHOUT_STATS = gql`
  mutation UpsertCollection($collection: collections_insert_input!) {
    insert_collections_one(
      object: $collection
      on_conflict: { constraint: collections_contract_address_key, update_columns: [] }
    ) {
      id
      updated_at
      slug
      floor_price
      one_day_change
      seven_day_change
      thirty_day_change
    }
  }
`
