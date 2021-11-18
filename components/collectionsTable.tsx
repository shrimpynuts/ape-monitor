import { useMemo, useCallback } from 'react'
import { CellProps } from 'react-table'
import useMobileDetect from 'use-mobile-detect-hook'

import { fixedNumber, getCostBasis } from '../lib/util'
import { ICollection } from '../pages/[address]'
import DeltaDisplay from './deltaDisplay'

import Table from './table'

/**
 * The possible timespans for opensea price delta data
 */
const timespans = [
  { value: '24h', dataPrefix: 'one_day', display: '24hr' },
  { value: '7d', dataPrefix: 'seven_day', display: '7 Day' },
  { value: '30d', dataPrefix: 'thirty_day', display: '30 Day' },
]

interface IProps {
  collections: ICollection[]
  loading: boolean
}

function CollectionsTable({ collections, loading }: IProps) {
  // Detect if window is mobile
  const detectMobile = useMobileDetect()
  const isMobile = detectMobile.isMobile()

  const costBasisSortType = useCallback(({ values: valuesA }: any, { values: valuesB }: any) => {
    const costBasisA = valuesA.costBasis ? valuesA.costBasis.total : 0
    const costBasisB = valuesB.costBasis ? valuesB.costBasis.total : 0
    return costBasisA > costBasisB ? 1 : -1
  }, [])

  const columns = useMemo(
    () => [
      {
        Header: `Collection`,
        accessor: 'name',
        width: isMobile ? 200 : 250,
        Cell: ({ cell: { value, row } }: CellProps<any>) => (
          <div className="flex items-center pl-2 space-x-3 overflow-ellipsis">
            <img src={row.original.image_url} className="h-8 w-8 rounded-full" />
            <span className="overflow-ellipsis overflow-hidden">{value}</span>
          </div>
        ),
      },
      {
        Header: `Floor Price`,
        accessor: 'stats',
        id: 'floor_price',
        Cell: ({ cell: { value } }: CellProps<any>) => (
          <div>
            {value ? (
              <span className="flex items-center justify-center space-x-2">
                <img src="/eth-logo.svg" alt="eth logo" width="11" />
                <span>{fixedNumber(value.floor_price)}</span>
              </span>
            ) : (
              ''
            )}
          </div>
        ),
        disableFilters: true,
        width: 100,
      },
      {
        Header: `24h %`,
        accessor: `stats.one_day_change`,
        Cell: ({ cell: { value } }: CellProps<any>) => {
          return (
            <div className="flex justify-center">
              <span>{<DeltaDisplay delta={value} denomination="%" />}</span>
            </div>
          )
        },
        disableFilters: true,
        width: 100,
      },
      {
        Header: `7d %`,
        accessor: `stats.seven_day_change`,
        Cell: ({ cell: { value } }: CellProps<any>) => {
          return (
            <div className="flex justify-center">
              <span>{<DeltaDisplay delta={value} denomination="%" />}</span>
            </div>
          )
        },
        disableFilters: true,
        width: 100,
      },
      {
        Header: `30d %`,
        accessor: `stats.thirty_day_change`,
        Cell: ({ cell: { value } }: CellProps<any>) => {
          return (
            <div className="flex justify-center">
              <span>{<DeltaDisplay delta={value} denomination="%" />}</span>
            </div>
          )
        },
        disableFilters: true,
        width: 100,
      },
      {
        Header: `Volume`,
        accessor: 'stats',
        id: 'Volume',
        Cell: ({ cell: { value } }: CellProps<any>) => (
          <div>
            {value ? (
              <span className="flex justify-center space-x-2">
                <img src="/eth-logo.svg" alt="eth logo" width="11" />
                <span>{fixedNumber(value.total_volume)}</span>
              </span>
            ) : (
              ''
            )}
          </div>
        ),
        disableFilters: true,
        width: 100,
      },
      {
        Header: `Total Spent`,
        accessor: 'assets',
        Cell: ({ cell: { row } }: CellProps<any>) => {
          const costBasis = getCostBasis(row.original)
          return (
            <div className="flex justify-center space-x-2">
              <img src="/eth-logo.svg" alt="eth logo" width="11" />
              <span>{`${fixedNumber(costBasis.total)}`}</span>
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
      },
    ],
    [isMobile],
  )

  // sort the collections by floor price by default
  const sortedCollections = collections.sort((collectionA, collectionB) => {
    if ((collectionA.stats?.floor_price || 0) > (collectionB.stats?.floor_price || 0)) {
      return -1
    }

    if ((collectionA.stats?.floor_price || 0) < (collectionB.stats?.floor_price || 0)) {
      return 1
    }

    return 0
  })

  return (
    <div className="w-full">
      <Table columns={columns} data={sortedCollections} isMobile={isMobile} loading={loading} />
    </div>
  )
}

export default CollectionsTable
