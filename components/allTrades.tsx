import { ITradeData } from '../frontend/types'

import TradesTable from './tradesTable'

interface IProps {
  tradeData: ITradeData | undefined
  loading: boolean
}

export default function AllTrades({ tradeData, loading }: IProps) {
  console.log(tradeData?.tradesByCollection)
  return (
    <>
      {tradeData && (
        <div className="w-full">
          <TradesTable collections={Object.values(tradeData.tradesByCollection)} loading={loading} />
        </div>
      )}
    </>
  )
}
