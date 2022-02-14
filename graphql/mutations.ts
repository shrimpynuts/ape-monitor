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
        constraint: collections_contract_address_key
        update_columns: [
          floor_price
          one_day_change
          seven_day_change
          thirty_day_change
          total_volume
          market_cap
          is_stats_fetched
          # updated_at
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
          data_fetched_at
        ]
      }
    ) {
      updated_at
    }
  }
`

export const UPSERT_COLLECTION_WITHOUT_STATS = gql`
  mutation UpsertCollection($collection: collections_insert_input!) {
    insert_collections_one(
      object: $collection
      on_conflict: {
        constraint: collections_contract_address_key
        update_columns: [discord_url, updated_at, external_url, image_url, name, slug, twitter_username]
      }
    ) {
      updated_at
    }
  }
`

export const SET_COLLECTION_ERROR_FETCHING = gql`
  mutation SetCollectionErrorFetching($contract_address: String!, $error_fetching: Boolean!) {
    update_collections_by_pk(
      pk_columns: { contract_address: $contract_address }
      _set: { error_fetching: $error_fetching }
    ) {
      error_fetching
    }
  }
`
