import { useMemo } from 'react'
import { CellProps } from 'react-table'
import useMobileDetect from 'use-mobile-detect-hook'

import { convertNumberToRoundedString, calculateCostBasis } from '../lib/util'
import { ICollectionsWithAssets } from '../frontend/types'
import DeltaDisplay from './util/deltaDisplay'

import Table from './table'
import Spinner from './util/spinner'
interface IProps {
  collectionsWithAssets: ICollectionsWithAssets
  loading: boolean
}

function CollectionsTable({ collectionsWithAssets, loading }: IProps) {
  // Detect if window is mobile
  const detectMobile = useMobileDetect()
  const isMobile = detectMobile.isMobile()

  const columns = useMemo(
    () => [
      {
        Header: `Collection`,
        accessor: 'collection.name',
        width: isMobile ? 200 : 250,
        Cell: ({ cell: { value, row } }: CellProps<any>) => (
          <div className="flex items-center space-x-3 overflow-ellipsis">
            <img src={row.original.collection.image_url} className="h-8 w-8 rounded-full" />
            <span className="overflow-ellipsis overflow-hidden">{value}</span>
          </div>
        ),
      },
      {
        Header: `Floor Price`,
        accessor: 'collection.floor_price',
        id: 'floor_price',
        Cell: ({ cell: { value } }: CellProps<any>) => (
          <div>
            {value ? (
              <span className="flex items-center justify-start space-x-2">
                <img src="/eth-logo.svg" alt="eth logo" width="11" />
                <span>{convertNumberToRoundedString(value)}</span>
              </span>
            ) : (
              ''
            )}
          </div>
        ),
        disableFilters: true,
        width: 120,
      },
      {
        Header: `24h %`,
        accessor: `collection.one_day_change`,
        Cell: ({ cell: { value } }: CellProps<any>) => {
          return (
            <div className="flex justify-start">
              <span>{value && <DeltaDisplay delta={value} denomination="%" />}</span>
            </div>
          )
        },
        disableFilters: true,
        width: 100,
      },
      {
        Header: `7d %`,
        accessor: `collection.seven_day_change`,
        Cell: ({ cell: { value } }: CellProps<any>) => {
          return (
            <div className="flex justify-start">
              <span>{value && <DeltaDisplay delta={value} denomination="%" />}</span>
            </div>
          )
        },
        disableFilters: true,
        width: 100,
      },
      {
        Header: `30d %`,
        accessor: `collection.thirty_day_change`,
        Cell: ({ cell: { value } }: CellProps<any>) => {
          return (
            <div className="flex justify-start">
              <span>{value && <DeltaDisplay delta={value} denomination="%" />}</span>
            </div>
          )
        },
        disableFilters: true,
        width: 100,
      },
      {
        Header: `Volume`,
        accessor: `collection.total_volume`,
        id: 'Volume',
        Cell: ({ cell: { value } }: CellProps<any>) => {
          return (
            <div>
              {value !== null ? (
                <span className="flex justify-start space-x-2">
                  <img src="/eth-logo.svg" alt="eth logo" width="11" />
                  <span>{convertNumberToRoundedString(value)}</span>
                </span>
              ) : (
                ''
              )}
            </div>
          )
        },
        disableFilters: true,
        width: 120,
      },
      {
        Header: `Total Spent`,
        accessor: 'assets',
        Cell: ({ cell: { row } }: CellProps<any>) => {
          const costBasis = calculateCostBasis(row.original.assets)
          return (
            <div className="flex justify-start space-x-2">
              <img src="/eth-logo.svg" alt="eth logo" width="11" />
              <span>{`${convertNumberToRoundedString(costBasis)}`}</span>
            </div>
          )
        },
        disableFilters: true,
        width: 120,
      },

      {
        Header: isMobile ? '#' : '# Owned',
        accessor: 'assets.length',
        width: isMobile ? '20' : 120,
        disableFilters: true,
        Cell: ({ cell: { value } }: CellProps<any>) => {
          return (
            <div className="flex justify-start space-x-2">
              <span className="text-left">{`${value}`}</span>
            </div>
          )
        },
      },
    ],
    [isMobile],
  )

  // Sort the collections by floor price by default
  const sortedCollections = Object.values(collectionsWithAssets).sort(
    ({ collection: collectionA }, { collection: collectionB }) => {
      if ((collectionA?.floor_price || 0) > (collectionB?.floor_price || 0)) return -1
      if ((collectionA?.floor_price || 0) < (collectionB?.floor_price || 0)) return 1
      return 0
    },
  )

  return (
    <div className="w-full">
      <Table columns={columns} data={sortedCollections} isMobile={isMobile} replaceTableBody={loading && <Spinner />} />
    </div>
  )
}

export default CollectionsTable
