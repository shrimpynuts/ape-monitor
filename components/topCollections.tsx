import { useMemo } from 'react'
import { CellProps } from 'react-table'
import useMobileDetect from 'use-mobile-detect-hook'
import { useQuery } from '@apollo/client'

import { convertNumberToRoundedString, calculateCostBasis } from '../lib/util'
import { ICollection } from '../frontend/types'
import DeltaDisplay from './util/deltaDisplay'
import { GET_TOP_COLLECTIONS } from '../graphql/queries'

import Table from './table'
import Spinner from './util/spinner'

interface IProps {}

function CollectionsTable({}: IProps) {
  // Detect if window is mobile
  const detectMobile = useMobileDetect()
  const isMobile = detectMobile.isMobile()

  const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
  const { data, loading } = useQuery(GET_TOP_COLLECTIONS, {
    variables: {
      lastUpdated: yesterday.toUTCString(),
    },
  })

  const columns = useMemo(
    () => [
      {
        Header: `Collection`,
        accessor: 'name',
        width: isMobile ? 200 : 250,
        Cell: ({ cell: { value, row } }: CellProps<any>) => (
          <div className="flex items-center space-x-3 overflow-ellipsis">
            <img src={row.original.image_url} className="h-8 w-8 rounded-full" />
            <span className="overflow-ellipsis overflow-hidden">{value}</span>
          </div>
        ),
      },
      {
        Header: `Floor Price`,
        accessor: 'floor_price',
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
        accessor: `one_day_change`,
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
        accessor: `seven_day_change`,
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
        accessor: `thirty_day_change`,
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
        accessor: `total_volume`,
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
        Header: `Market Cap`,
        accessor: `market_cap`,
        id: 'Market Cap',
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
    ],
    [isMobile],
  )

  // If the trades data is still loading, make the table body a spinner
  let replaceTableBody
  if (loading) {
    replaceTableBody = <Spinner />
  }

  return (
    <div className="w-full text-gray-900 dark:text-gray-300">
      <div className="flex relative space-x-2 items-center justify-center mx-auto text-center w-full">
        <h1 className="text-center relative text-xl font-bold tracking-wide">Top Collections</h1>
      </div>

      <div className="mt-4">
        <Table
          columns={columns}
          data={data?.collections || []}
          isMobile={isMobile}
          dontIncludeSubrows
          replaceTableBody={loading && <Spinner />}
        />
      </div>
    </div>
  )
}

export default CollectionsTable
