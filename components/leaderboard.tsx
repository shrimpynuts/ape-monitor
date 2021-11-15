import { useQuery } from '@apollo/client'
import Link from 'next/link'

import { GET_LEADERBOARD } from '../graphql/queries'
import Spinner from './spinner'
import { middleEllipses } from '../lib/util'
import Tooltip from '../components/tooltip'

const SingleLeaderboard = ({ users, loading, title }: { title: string; users: any; loading: boolean }) => {
  return (
    <div
      className="flex flex-1 flex-col p-4 rounded
    bg-gray-50 dark:bg-gray-800"
    >
      <h3 className="border-b border-gray-200 dark:border-gray-700 pb-2 font-bold ">{title}</h3>
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col space-y-2 mt-4">
          {users.map((user: any, i: number) => (
            <Link href={`/${user.ensDomain || user.address}`} key={i}>
              <span className="cursor-pointer">
                #{i + 1}: {user.ensDomain ? user.ensDomain : middleEllipses(user.address, 4, 6, 4)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

const Leaderboard = () => {
  const { data, loading } = useQuery(GET_LEADERBOARD)
  return (
    <div className="text-gray-900 dark:text-gray-300">
      <div className="flex relative space-x-2 items-center justify-center mx-auto text-center w-full">
        <Tooltip text="Contains only users who have connected" />
        <h1 className="text-center relative text-xl font-bold tracking-wide">Ape Leaderboard</h1>
      </div>
      <div className="flex flex-col md:flex-row space-between space-y-4 md:space-y-0 md:space-x-4 mt-4">
        <SingleLeaderboard title="Total Value" users={data?.totalValue} loading={loading} />
        <SingleLeaderboard title="Total Cost Basis" users={data?.totalCostBasis} loading={loading} />
        <SingleLeaderboard title="Total Asset Count" users={data?.totalAssetCount} loading={loading} />
      </div>
    </div>
  )
}

export default Leaderboard
