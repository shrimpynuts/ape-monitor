import { useMemo } from 'react'
import classNames from 'classnames'
import { CellProps } from 'react-table'
import useMobileDetect from 'use-mobile-detect-hook'

import { convertNumberToRoundedString, usdFormatter } from '../lib/util'
import { ITradeData, IAddressData } from '../frontend/types'
import useWeb3Container from '../hooks/useWeb3User'
import Spinner from './util/spinner'
import Emoji from './util/emoji'
import Table from './table'

interface IProps {
  tradeData: ITradeData | undefined
  loading: boolean
  addressData: IAddressData
}

function TradesTable({ tradeData, loading, addressData }: IProps) {
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

  const trades: any[] = tradeData ? Object.values(tradeData.tradesByCollection) : []

  // If the trades data is still loading, make the table body a spinner
  // Otherwise, if there is no trade data, the table body is text
  // Else, there is no inner, and we display the trades table normally
  let replaceTableBody
  if (loading) {
    replaceTableBody = <Spinner />
  } else if (trades.length === 0) {
    const name = addressData.ensDomain ? addressData.ensDomain : addressData.address
    replaceTableBody = (
      <div className="leading-2">
        <h1 className="text-center mb-2">{name} hasn never sold.</h1>
        <h2 className="text-center">
          <Emoji className="text-4xl cursor-pointer" label="logo" symbol="💎" />
          <Emoji className="text-4xl cursor-pointer" label="logo" symbol="🙌" />
        </h2>
      </div>
    )
  }

  return (
    <div className="w-full">
      <Table
        columns={columns}
        data={trades}
        isMobile={isMobile}
        dontIncludeSubrowCostBasis
        replaceTableBody={replaceTableBody}
      />
    </div>
  )
}

export default TradesTable
