import { useState, useEffect } from 'react'
import { getServer } from '../lib/util'
import Spinner from './spinner'

export default function Trades({ address }: { address: string }) {
  const [tradeData, setTradeData] = useState()

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
      })
  }, [address])

  return (
    <div
      className="mx-4 shadow sm:rounded-lg bg-gray-100 dark:bg-gray-850 text-gray-500 dark:text-gray-100
      md:flex-row md:items-center md:divide-x-2 divide-gray-200 dark:divide-gray-700"
    >
      {tradeData ? (
        <div></div>
      ) : (
        <div className="py-8">
          <Spinner />
        </div>
      )}
    </div>
  )
}
