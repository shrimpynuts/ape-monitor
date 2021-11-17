import { useState, useEffect } from 'react'
import { getServer } from '../lib/util'
import Spinner from './spinner'
import { fixedNumber } from '../lib/util'

interface ITradeData {
  [key: string]: any
}

const SingleTrade = ({ trade, title }: { trade: any; title: string }) => {
  var daysHeld = Math.floor(trade.averageHoldTime / 1000 / (3600 * 24))

  return (
    <div>
      <h4 className="text-2xl">{title}</h4>
      <div
        className="mt-2 rounded-xl bg-white dark:bg-blackPearl 
      p-4 drop-shadow-md
      w-80 h-56
      border border-solid border-gray-300 dark:border-darkblue"
      >
        <img src={trade.image_url} className="h-8 w-8 rounded-full" />
        <h3>{trade.name}</h3>
        <div className="flex space-between">
          <span className="flex-1">Volume:</span>
          <span className="flex-1 text-right">{trade.assets.length}</span>
        </div>
        <div className="flex space-between">
          <span className="flex-1">Average Sale Price:</span>
          <span className="flex-1  text-right">{fixedNumber(trade.averageSalePrice)}</span>
        </div>
        <div className="flex space-between">
          <span className="flex-1">Average Buy Price:</span>
          <span className="flex-1 text-right">{fixedNumber(trade.averageBuyPrice)}</span>
        </div>
        <div className="flex space-between">
          <span className="flex-1">Average Hold Time:</span>
          <span className="flex-1 text-right">{daysHeld}</span>
        </div>
        <h3 className="">
          <span className="flex-1">Total Profit:</span>
          <span className="flex-1 text-right">{fixedNumber(trade.totalProfit)}Ξ</span>
        </h3>
      </div>
    </div>
  )
}

export default function Trades({ address }: { address: string }) {
  const [tradeData, setTradeData] = useState<ITradeData>()
  const [loading, setLoading] = useState(true)

  console.log({ tradeData })

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
        <>
          <SingleTrade title="🔥 Best Flip" trade={tradeData.totalTradeStats.bestTrade} />
          <SingleTrade title="😢 Biggest L" trade={tradeData.totalTradeStats.worstTrade} />
        </>
      ) : (
        <Spinner />
      )}
    </>
  )
}
