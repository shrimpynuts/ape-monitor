import { useMemo } from 'react'
import { CellProps } from 'react-table'
import useMobileDetect from 'use-mobile-detect-hook'
import { useQuery } from '@apollo/client'
import Link from 'next/link'

import { convertNumberToRoundedString, getRankDisplay } from '../lib/util'
import { ICollection } from '../frontend/types'
import DeltaDisplay from './util/deltaDisplay'
import { GET_TOP_COLLECTIONS } from '../graphql/queries'

import TopCollectionsTable from './topCollectionsTable'
import Spinner from './util/spinner'
import Tooltip from './util/tooltip'

interface IProps {}

const SingleTopCollections = ({
  collections,
  loading,
  title,
  accessor,
  denomination,
}: {
  title: string
  collections: ICollection[]
  loading: boolean
  accessor: 'one_day_change' | 'total_volume' | 'market_cap' | 'floor_price'
  denomination: string
}) => {
  return (
    <div
      className="flex flex-1 flex-col p-4 
      rounded-xl bg-white dark:bg-blackPearl border border-solid border-gray-300 dark:border-darkblue py-4 drop-shadow-md"
    >
      <h3 className="border-b border-gray-200 dark:border-gray-700 pb-2 font-bold text-center uppercase tracking-wide text-xs ">
        {title}
      </h3>
      {loading ? (
        <div className="py-8">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col space-y-2 mt-4">
          {collections?.map((collection, i: number) => (
            <div className="flex justify-between " key={i}>
              <div className="flex space-x-4">
                <span className="flex-1 w-4 text-center">{getRankDisplay(i + 1)}</span>
                <Link href={`https://opensea.io/collection/${collection.slug}`} passHref>
                  <a target="_blank" rel="noreferrer">
                    <p className="flex-1 cursor-pointer hover:text-yellow-600 hover:font-bold truncate w-52 md:w-36">
                      <img src={collection.image_url} className="h-8 w-8 rounded-full inline mr-2" />
                      {collection.name}
                    </p>
                  </a>
                </Link>
              </div>
              {accessor === 'one_day_change' ? (
                <span>
                  {collection[accessor] !== undefined && <DeltaDisplay delta={collection[accessor]} denomination="%" />}
                </span>
              ) : (
                <span className="flex-1 text-right">{`${convertNumberToRoundedString(
                  collection[accessor],
                )}${denomination}`}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function TopCollections({}: IProps) {
  const detectMobile = useMobileDetect()
  const isMobile = detectMobile.isMobile()

  const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
  const { data, loading, error } = useQuery(GET_TOP_COLLECTIONS, {
    variables: {
      lastUpdated: yesterday.toUTCString(),
    },
  })

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
        Header: `Floor Price`,
        accessor: 'floor_price',
        id: 'floor_price',
        Cell: ({ cell: { value } }: CellProps<any>) => (
          <div>
            {value ? (
              <span className="flex items-center justify-start space-x-2">
                <img src="/eth-logo.svg" alt="eth logo" width="11" />
                <span>{convertNumberToRoundedString(value)}</span>
              </span>
            ) : (
              ''
            )}
          </div>
        ),
        disableFilters: true,
        width: 120,
      },
      {
        Header: `24h %`,
        accessor: `one_day_change`,
        Cell: ({ cell: { value } }: CellProps<any>) => {
          return (
            <div className="flex justify-start">
              <span>{value && <DeltaDisplay delta={value} denomination="%" />}</span>
            </div>
          )
        },
        disableFilters: true,
        width: 100,
      },
      {
        Header: `7d %`,
        accessor: `seven_day_change`,
        Cell: ({ cell: { value } }: CellProps<any>) => {
          return (
            <div className="flex justify-start">
              <span>{value && <DeltaDisplay delta={value} denomination="%" />}</span>
            </div>
          )
        },
        disableFilters: true,
        width: 100,
      },
      {
        Header: `30d %`,
        accessor: `thirty_day_change`,
        Cell: ({ cell: { value } }: CellProps<any>) => {
          return (
            <div className="flex justify-start">
              <span>{value && <DeltaDisplay delta={value} denomination="%" />}</span>
            </div>
          )
        },
        disableFilters: true,
        width: 100,
      },
      {
        Header: `Volume`,
        accessor: `total_volume`,
        id: 'Volume',
        Cell: ({ cell: { value } }: CellProps<any>) => {
          return (
            <div>
              {value !== null ? (
                <span className="flex justify-start space-x-2">
                  <img src="/eth-logo.svg" alt="eth logo" width="11" />
                  <span>{convertNumberToRoundedString(value)}</span>
                </span>
              ) : (
                ''
              )}
            </div>
          )
        },
        disableFilters: true,
        width: 120,
      },
      {
        Header: `Market Cap`,
        accessor: `market_cap`,
        id: 'Market Cap',
        Cell: ({ cell: { value } }: CellProps<any>) => {
          return (
            <div>
              {value !== null ? (
                <span className="flex justify-start space-x-2">
                  <img src="/eth-logo.svg" alt="eth logo" width="11" />
                  <span>{convertNumberToRoundedString(value)}</span>
                </span>
              ) : (
                ''
              )}
            </div>
          )
        },
        disableFilters: true,
        width: 120,
      },
    ],
    [isMobile],
  )

  // If the trades data is still loading, make the table body a spinner
  let replaceTableBody
  if (loading) {
    replaceTableBody = <Spinner />
  }

  return (
    <div className="w-full text-gray-900 dark:text-gray-300">
      <div className="flex relative space-x-2 items-center justify-center mx-auto text-center w-full mt-8">
        <h1 className="text-center relative text-xl font-bold tracking-wide">Top Collections</h1>
      </div>

      <div className="flex flex-col md:flex-row space-between space-y-4 md:space-y-0 md:space-x-4 mt-4">
        <SingleTopCollections
          title="One Day Change"
          collections={data?.oneDayChange}
          denomination="Ξ"
          accessor={'one_day_change'}
          loading={loading}
        />
        <SingleTopCollections
          title="Total Volume"
          collections={data?.totalVolume}
          denomination="Ξ"
          accessor={'total_volume'}
          loading={loading}
        />
        <SingleTopCollections
          title="Market Cap"
          collections={data?.marketCap}
          denomination="Ξ"
          accessor={'market_cap'}
          loading={loading}
        />
        <SingleTopCollections
          title="Floor Price"
          collections={data?.floorPrice}
          denomination="Ξ"
          accessor={'floor_price'}
          loading={loading}
        />
      </div>

      <div className="flex relative space-x-2 items-center justify-center mx-auto text-center w-full mt-8">
        <Tooltip width={64} text="Based on 24 hour change, above 1000Ξ market cap" />
        <h1 className="text-center relative text-xl font-bold tracking-wide">Trending Collections</h1>
      </div>
      <div className="mt-4">
        <TopCollectionsTable
          columns={columns}
          data={data?.collections || []}
          isMobile={isMobile}
          dontIncludeSubrows
          replaceTableBody={loading && <Spinner />}
        />
      </div>
    </div>
  )
}

export default TopCollections
