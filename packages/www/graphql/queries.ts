import { gql } from '@apollo/client'
import { CORE_COLLECTION_FIELDS, CORE_USER_FIELDS, COLLECTIONS_AGGREGATE_COUNT } from './fragments'

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
  ${CORE_COLLECTION_FIELDS}
  query GetMostStaleCollections($limit: Int!, $offset: Int = 0) {
    collections(
      where: { error_fetching: { _eq: false } }
      order_by: { data_fetched_at: asc_nulls_first }
      limit: $limit
      offset: $offset
    ) {
      ...CoreCollectionFields
    }
  }
`

export const GET_MOST_STALE_COLLECTIONS_WITHOUT_STATS = gql`
  ${CORE_COLLECTION_FIELDS}
  query GetMostStaleCollectionsWithoutStats($limit: Int!, $offset: Int = 0) {
    collections(
      where: { error_fetching: { _eq: false }, _and: { is_stats_fetched: { _eq: false } } }
      order_by: { data_fetched_at: asc_nulls_first }
      limit: $limit
      offset: $offset
    ) {
      ...CoreCollectionFields
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

// downBadCollections: collections(
//   where: { total_volume: { _gt: 100 } }
//   order_by: { one_day_change: asc_nulls_last }
//   limit: 10
// ) {
//   ...CoreCollectionFields
// }

export const GET_TOP_COLLECTIONS = gql`
  ${CORE_COLLECTION_FIELDS}
  query GetTopCollections($lastUpdated: timestamptz!) {
    trendingCollections: collections(
      where: { market_cap: { _gt: 1000 }, floor_price: { _gt: 0.05 } }
      order_by: { one_day_volume: desc_nulls_last }
      limit: 30
    ) {
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

export const GET_TOP_COLLECTIONS_ALERT = gql`
  ${CORE_COLLECTION_FIELDS}
  query GetTopCollections {
    totalVolume: collections(
      order_by: { total_volume: desc_nulls_last }
      where: { floor_price: { _is_null: false }, one_day_volume: { _gt: 10 } }
      limit: 20
    ) {
      ...CoreCollectionFields
    }

    trendingCollections: collections(
      where: { market_cap: { _lt: 10000 }, floor_price: { _gt: 0.05 } }
      order_by: { one_day_volume: desc_nulls_last }
      limit: 10
    ) {
      ...CoreCollectionFields
    }
  }
`

export const GET_COLLECTIONS_ADMIN_STATS = gql`
  ${COLLECTIONS_AGGREGATE_COUNT}
  query GetCollectionsAdminStats(
    $lastUpdated1: timestamptz!
    $lastUpdated2: timestamptz!
    $lastUpdated3: timestamptz!
    $lastUpdated4: timestamptz!
  ) {
    is_stats_fetched_true: collections_aggregate(where: { is_stats_fetched: { _eq: true } }) {
      ...CollectionsAggregateCount
    }
    error_fetching_true: collections_aggregate(where: { error_fetching: { _eq: true } }) {
      ...CollectionsAggregateCount
    }
    floor_price_null: collections_aggregate(where: { floor_price: { _is_null: true } }) {
      ...CollectionsAggregateCount
    }
    one_day_change_null: collections_aggregate(where: { one_day_change: { _is_null: true } }) {
      ...CollectionsAggregateCount
    }
    one_day_volume_null: collections_aggregate(where: { one_day_volume: { _is_null: true } }) {
      ...CollectionsAggregateCount
    }
    data_fetched_at_null: collections_aggregate(where: { data_fetched_at: { _is_null: false } }) {
      ...CollectionsAggregateCount
    }

    slug_null: collections_aggregate(where: { slug: { _is_null: true } }) {
      ...CollectionsAggregateCount
    }
    stale1: collections_aggregate(where: { data_fetched_at: { _gte: $lastUpdated1 } }) {
      ...CollectionsAggregateCount
    }
    stale2: collections_aggregate(where: { data_fetched_at: { _gte: $lastUpdated2 } }) {
      ...CollectionsAggregateCount
    }
    stale3: collections_aggregate(where: { data_fetched_at: { _gte: $lastUpdated3 } }) {
      ...CollectionsAggregateCount
    }
    stale4: collections_aggregate(where: { data_fetched_at: { _gte: $lastUpdated4 } }) {
      ...CollectionsAggregateCount
    }
    total: collections_aggregate {
      ...CollectionsAggregateCount
    }
  }
`

export const GET_COLLECTIONS_AGGREGATE_COUNT = gql`
  query GetCollectionsAggregateCount($where: collections_bool_exp!) {
    test: collections_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`
