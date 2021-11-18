import { useState, useEffect } from 'react'
import Image from 'next/image'
import classNames from 'classnames'

import { getServer } from '../lib/util'
import Spinner from './spinner'
import { fixedNumber } from '../lib/util'
import useWeb3Container from '../hooks/useWeb3User'

interface ITradeData {
  [key: string]: any
}

const SingleTrade = ({ trade, title }: { trade: any; title: string }) => {
  var daysHeld = Math.floor(trade.averageHoldTime / 1000 / (3600 * 24))

  const { ethPrice } = useWeb3Container.useContainer()

  const Row: React.FC<{ name: string }> = ({ children, name }) => {
    return (
      <div className="flex space-between font-semibold">
        <span className="flex-1">{name}</span>
        <span className="text-right">
          <span className="flex space-x-1">{children}</span>
        </span>
      </div>
    )
  }

  const EthRow = ({ name, amount }: { name: string; amount: number }) => {
    return (
      <Row name={name}>
        <img src="eth-logo.svg" width="10" />
        <span>{amount}</span>
      </Row>
    )
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  })

  return (
    <div className="w-full">
      <h4 className="text-2xl font-semibold">{title}</h4>
      <div className="mt-2 rounded-xl bg-white dark:bg-blackPearl shadow border border-solid border-gray-300 dark:border-darkblue">
        <div className="p-4">
          <div className="flex justify-center items-center space-x-2 mb-2">
            <img src={trade.image_url} className="h-8 w-8 rounded-full border border-solid border-gray-300" />
            <h3 className="font-bold">{trade.name}</h3>
          </div>
          <Row name="Volume">
            <span className="flex-1 text-right">{trade.assets.length}</span>
          </Row>
          <EthRow name="Sale Price" amount={fixedNumber(trade.averageSalePrice)} />
          <EthRow name="Buy Price" amount={fixedNumber(trade.averageBuyPrice)} />
          <Row name="Hold Time">
            <span className="flex-1 text-right">{daysHeld} days</span>
          </Row>
        </div>
        <div
          className={classNames(
            'w-full py-4 flex items-center justify-center space-x-2 border-t border-solid border-gray-200',
            {
              'text-green-600 dark:text-lightgreen': fixedNumber(trade.totalProfit) > 0,
              'text-red-600 dark:text-lightred': fixedNumber(trade.totalProfit) < 0,
            },
          )}
        >
          {ethPrice !== undefined ? (
            <>
              <span className="text-3xl font-semibold">
                {fixedNumber(trade.totalProfit) > 0 && <>+</>}
                {formatter.format(fixedNumber(trade.totalProfit * ethPrice))}
              </span>
            </>
          ) : (
            <>
              <Image src="eth-logo.svg" alt="eth logo" width="13" />
              <span className="text-3xl font-semibold">{fixedNumber(trade.totalProfit)}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Trades({ address }: { address: string }) {
  const [tradeData, setTradeData] = useState<ITradeData>()
  const [loading, setLoading] = useState(true)

  /**
   * Fetches data from opensea at the /api/opensea endpoint and updates state client-side
   */
  useEffect(() => {
    fetch(`${getServer()}/api/opensea/trades/${address}`)
      .then((resp) => resp.json())
      .then((data) => {
        console.log({ data })
        setTradeData(data)
        setLoading(false)
      })
  }, [address])

  return (
    <>
      {tradeData ? (
        <div className="flex flex-1 space-x-12 m-auto max-w-3xl">
          <SingleTrade title="💰 Best Flip" trade={tradeData.totalTradeStats.bestTrade} />
          <SingleTrade title="🥲 Biggest L" trade={tradeData.totalTradeStats.worstTrade} />
        </div>
      ) : (
        <Spinner />
      )}
    </>
  )
}
