import Image from 'next/image'
import classNames from 'classnames'

import { convertNumberToRoundedString, usdFormatter } from '../lib/util'
import useWeb3Container from '../hooks/useWeb3User'
import { ITradeData } from '../frontend/types'

const SingleHighlightedTrade = ({ trade, title }: { trade: any; title: string }) => {
  if (!trade) return <></>
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

  const EthRow = ({ name, amount }: { name: string; amount: string }) => {
    return (
      <Row name={name}>
        <img src="eth-logo.svg" width="10" />
        <span>{amount}</span>
      </Row>
    )
  }

  return (
    <div className="w-full">
      <h4 className="text-2xl font-semibold">{title}</h4>
      <div className="border-wrapper">
        <div className="mt-2 rounded-xl bg-white dark:bg-blackPearl shadow border border-solid border-gray-300 dark:border-darkblue">
          <div className="p-4">
            <div className="flex justify-center items-center space-x-2 mb-2">
              <img src={trade.image_url} className="h-8 w-8 rounded-full border border-solid border-gray-300" />
              <h3 className="font-bold">{trade.name}</h3>
            </div>
            <Row name="Volume">
              <span className="flex-1 text-right">{trade.assets.length}</span>
            </Row>
            <EthRow name="Sale Price" amount={convertNumberToRoundedString(trade.averageSalePrice)} />
            <EthRow name="Buy Price" amount={convertNumberToRoundedString(trade.averageBuyPrice)} />
            <Row name="Hold Time">
              <span className="flex-1 text-right">{daysHeld} days</span>
            </Row>
          </div>
          <div
            className={classNames(
              'w-full py-4 flex items-center justify-center space-x-2 border-t border-solid border-gray-200 dark:border-darkblue',
              {
                'text-green-600 dark:text-lightgreen': trade.totalProfit > 0,
                'text-red-600 dark:text-lightred': trade.totalProfit < 0,
              },
            )}
          >
            {ethPrice !== undefined ? (
              <>
                <span className="text-3xl font-semibold">
                  {trade.totalProfit > 0 && <>+</>}
                  {usdFormatter.format(trade.totalProfit * ethPrice)}
                </span>
              </>
            ) : (
              <>
                <Image src="eth-logo.svg" alt="eth logo" width="13" />
                <span className="text-3xl font-semibold">{convertNumberToRoundedString(trade.totalProfit)}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface IProps {
  tradeData: ITradeData | undefined
  loading: boolean
}

export default function HighlightedTrades({ tradeData, loading }: IProps) {
  if (loading) return <></>
  return (
    <>
      {tradeData && (
        <div className="flex flex-1 space-x-12 m-auto max-w-3xl">
          <SingleHighlightedTrade title="💰 Best Flip" trade={tradeData.totalTradeStats.bestTrade} />
          <SingleHighlightedTrade title="🥲 Biggest L" trade={tradeData.totalTradeStats.worstTrade} />
        </div>
      )}
    </>
  )
}
