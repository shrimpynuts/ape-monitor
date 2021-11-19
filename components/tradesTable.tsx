import { useMemo } from 'react'
import classNames from 'classnames'
import { CellProps } from 'react-table'
import useMobileDetect from 'use-mobile-detect-hook'

import { convertNumberToRoundedString, usdFormatter } from '../lib/util'
import useWeb3Container from '../hooks/useWeb3User'

import Table from './table'

interface IProps {
  collections: any[]
  loading: boolean
}

function TradesTable({ collections, loading }: IProps) {
  if (!collections || collections.length === 0) return <></>

  // Detect if window is mobile
  const detectMobile = useMobileDetect()
  const isMobile = detectMobile.isMobile()
  const { ethPrice } = useWeb3Container.useContainer()
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
        Header: isMobile ? '#' : '# Owned',
        accessor: 'assets.length',
        width: isMobile ? '20' : 100,
        disableFilters: true,
        Cell: ({ cell: { value } }: CellProps<any>) => {
          return (
            <div className="flex justify-start space-x-2">
              <span className="text-left">{`${value}`}</span>
            </div>
          )
        },
      },
      {
        Header: 'Buy Price',
        accessor: 'averageBuyPrice',
        width: 110,
        Cell: ({ cell: { value } }: CellProps<any>) => {
          return (
            <div className="flex justify-start space-x-2">
              <img src="/eth-logo.svg" alt="eth logo" width="11" />
              <span>{`${convertNumberToRoundedString(value)}`}</span>
            </div>
          )
        },
      },
      {
        Header: 'Sell Price',
        accessor: 'averageSalePrice',
        width: 110,
        Cell: ({ cell: { value } }: CellProps<any>) => {
          return (
            <div className="flex justify-start space-x-2">
              <img src="/eth-logo.svg" alt="eth logo" width="11" />
              <span>{`${convertNumberToRoundedString(value)}`}</span>
            </div>
          )
        },
      },
      {
        Header: 'Hold Time',
        accessor: 'averageHoldTime',
        width: 110,
        Cell: ({ cell: { value } }: CellProps<any>) => {
          var daysHeld = Math.floor(value / 1000 / (3600 * 24))
          return (
            <div className="flex justify-start space-x-2">
              <span>{`${daysHeld} days`}</span>
            </div>
          )
        },
      },
      {
        Header: `Total Profit`,
        accessor: 'totalProfit',
        id: 'total_profit_eth',
        Cell: ({ cell: { value } }: CellProps<any>) => {
          return (
            <div className="flex justify-start space-x-2">
              {ethPrice ? (
                <div
                  className={classNames('w-full flex', {
                    'text-green-600 dark:text-lightgreen': value > 0,
                    'text-red-600 dark:text-lightred': value < 0,
                  })}
                >
                  <span className="font-semibold">
                    {value > 0 && <>+</>}
                    {usdFormatter.format(value * ethPrice)}
                  </span>
                </div>
              ) : (
                <>
                  <img src="/eth-logo.svg" alt="eth logo" width="11" />
                  <span>{`${convertNumberToRoundedString(value)}`}</span>
                </>
              )}
            </div>
          )
        },
        disableFilters: true,
        width: 200,
      },
    ],
    [isMobile, ethPrice],
  )

  // sort the collections by floor price by default
  const sortedCollections = collections.sort((collectionA, collectionB) => {
    if ((collectionA.totalProfit || 0) > (collectionB.totalProfit || 0)) {
      return -1
    }

    if ((collectionA.totalProfit || 0) < (collectionB.totalProfit || 0)) {
      return 1
    }

    return 0
  })

  return (
    <div className="w-full">
      <Table
        columns={columns}
        data={sortedCollections}
        isMobile={isMobile}
        loading={loading}
        dontIncludeSubrowCostBasis
      />
    </div>
  )
}

export default TradesTable
