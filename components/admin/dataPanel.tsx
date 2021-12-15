import Moment from 'react-moment'

import { lastUpdated1, lastUpdated2, lastUpdated3, lastUpdated4 } from '../../pages/admin'

const SingleCollectionStatistic = ({ metric, total }: { metric: number; total: number }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="font-light">({metric})</span>
      <span className="font-bold">{((metric / total) * 100).toFixed(2)}%</span>
    </div>
  )
}

export default function DataPanel({ data }: any) {
  const total = data.total.aggregate.count

  const {
    slug_null,
    one_day_change_null,
    error_fetching_true,
    is_stats_fetched_true,
    floor_price_null,
    stale1,
    stale2,
    stale3,
    stale4,
  } = data

  return (
    <div className="w-full md:mx-auto flex flex-col ">
      <div
        className="md:mx-auto md:w-1/2 flex flex-col
      sm:rounded-lg mb-2 shadow border border-solid border-gray-300 dark:border-darkblue
      divide-y divide-gray-300 dark:divide-darkblue"
      >
        <div className="flex justify-between p-4 text-3xl font-bold">
          <span>Total</span>
          <span>{total} collections</span>
        </div>
        <div className="flex justify-between p-4">
          <span className="font-mono bg-gray-800 p-1 rounded">one_day_change == null</span>
          <SingleCollectionStatistic metric={one_day_change_null.aggregate.count} total={total} />
        </div>
        <div className="flex justify-between p-4">
          <span className="font-mono bg-gray-800 p-1 rounded">is_stats_fetched == true</span>
          <SingleCollectionStatistic metric={is_stats_fetched_true.aggregate.count} total={total} />
        </div>
        <div className="flex justify-between p-4">
          <span className="font-mono bg-gray-800 p-1 rounded">floor_price == null</span>
          <SingleCollectionStatistic metric={floor_price_null.aggregate.count} total={total} />
        </div>
        <div className="flex justify-between p-4">
          <span className="font-mono bg-gray-800 p-1 rounded">slug == null</span>
          <SingleCollectionStatistic metric={slug_null.aggregate.count} total={total} />
        </div>
        <div className="flex justify-between p-4">
          <span className="font-mono bg-gray-800 p-1 rounded">error_fetching == true</span>
          <SingleCollectionStatistic metric={error_fetching_true.aggregate.count} total={total} />
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
          <SingleCollectionStatistic metric={stale1.aggregate.count} total={total} />
        </div>
        <div className="flex justify-between p-4">
          <span>
            Up-to-date since <Moment fromNow>{lastUpdated2}</Moment>
          </span>
          <SingleCollectionStatistic metric={stale2.aggregate.count} total={total} />
        </div>
        <div className="flex justify-between p-4">
          <span>
            Up-to-date since <Moment fromNow>{lastUpdated3}</Moment>
          </span>
          <SingleCollectionStatistic metric={stale3.aggregate.count} total={total} />
        </div>
        <div className="flex justify-between p-4">
          <span>
            Up-to-date since <Moment fromNow>{lastUpdated4}</Moment>
          </span>
          <SingleCollectionStatistic metric={stale4.aggregate.count} total={total} />
        </div>
      </div>
    </div>
  )
}
