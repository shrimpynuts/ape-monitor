import { useQuery } from '@apollo/client'
import Link from 'next/link'

import { GET_LEADERBOARD } from '../graphql/queries'
import Spinner from './spinner'
import { middleEllipses, fixedNumber } from '../lib/util'
import Tooltip from '../components/tooltip'

const getRankDisplay = (rank: number) => {
  switch (rank) {
    case 1:
      return '🥇'
    case 2:
      return '🥈'
    case 3:
      return '🥉'
    default:
      return `${rank}`
  }
}

const SingleLeaderboard = ({
  users,
  loading,
  title,
  accessor,
  denomination,
}: {
  title: string
  users: any
  loading: boolean
  accessor: string
  denomination: string
}) => {
  return (
    <div
      className="flex flex-1 flex-col p-4 rounded
    bg-gray-50 dark:bg-gray-800"
    >
      <h3 className="border-b border-gray-200 dark:border-gray-700 pb-2 font-bold text-center ">{title}</h3>
      {loading ? (
        <div className="py-8">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col space-y-2 mt-4">
          {users.map((user: any, i: number) => (
            <div className="flex justify-between ">
              <span className="flex-1">{getRankDisplay(i + 1)}</span>
              <Link href={`/${user.ensDomain || user.address}`} key={i}>
                <span className="flex-1 cursor-pointer hover:text-yellow-600 hover:font-bold">
                  {user.ensDomain ? user.ensDomain : middleEllipses(user.address, 4, 6, 4)}
                </span>
              </Link>
              <span className="flex-1 text-right">{`${fixedNumber(user[accessor])}${denomination}`}</span>
            </div>
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
        <Tooltip text="Connect to enter the leaderboard" />
        <h1 className="text-center relative text-xl font-bold tracking-wide">Top Apes</h1>
      </div>
      <div className="flex flex-col md:flex-row space-between space-y-4 md:space-y-0 md:space-x-4 mt-4">
        <SingleLeaderboard
          title="Value"
          users={data?.totalValue}
          denomination="Ξ"
          accessor={'totalValue'}
          loading={loading}
        />
        <SingleLeaderboard
          title="Cost Basis"
          users={data?.totalCostBasis}
          denomination="Ξ"
          accessor={'totalCostBasis'}
          loading={loading}
        />
        <SingleLeaderboard
          title="# of NFTs"
          users={data?.totalAssetCount}
          denomination=""
          accessor={'totalAssetCount'}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default Leaderboard
