import Moment from 'react-moment'

import { lastUpdated1, lastUpdated2, lastUpdated3 } from '../../pages/admin'

export default function DataPanel({ data }: any) {
  console.log({ data })
  return (
    <div className="w-full md:mx-auto my-8 flex flex-col ">
      <div
        className="md:mx-auto md:w-1/2 my-8 flex flex-col
      sm:rounded-lg mb-2 shadow border border-solid border-gray-300 dark:border-darkblue
      divide-y divide-gray-300 dark:divide-darkblue"
      >
        <div className="flex justify-between p-4 text-3xl font-bold">
          <span>Total</span>
          <span>{data.total.aggregate.count} collections</span>
        </div>
        <div className="flex justify-between p-4">
          <span className="font-mono bg-gray-800 p-1 rounded">one_day_change == null</span>
          <span>{data.one_day_change_null.aggregate.count} collections</span>
        </div>
        <div className="flex justify-between p-4">
          <span className="font-mono bg-gray-800 p-1 rounded">is_stats_fetched == true</span>
          <span>{data.is_stats_fetched_true.aggregate.count} collections</span>
        </div>
        <div className="flex justify-between p-4">
          <span className="font-mono bg-gray-800 p-1 rounded">floor_price == null</span>
          <span>{data.floor_price_null.aggregate.count} collections</span>
        </div>
      </div>

      <div
        className="md:mx-auto md:w-1/2 my-8 flex flex-col
      sm:rounded-lg mb-2 shadow border border-solid border-gray-300 dark:border-darkblue
      divide-y divide-gray-300 dark:divide-darkblue"
      >
        <div className="flex justify-between p-4">
          <span>
            Up-to-date since <Moment fromNow>{lastUpdated1}</Moment>
          </span>
          <span>{data.stale1.aggregate.count} collections</span>
        </div>
        <div className="flex justify-between p-4">
          <span>
            Up-to-date since <Moment fromNow>{lastUpdated2}</Moment>
          </span>
          <span>{data.stale2.aggregate.count} collections</span>
        </div>
        <div className="flex justify-between p-4">
          <span>
            Up-to-date since <Moment fromNow>{lastUpdated3}</Moment>
          </span>
          <span>{data.stale3.aggregate.count} collections</span>
        </div>
      </div>
    </div>
  )
}