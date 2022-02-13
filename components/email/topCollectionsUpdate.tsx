import { useMemo } from 'react'
import { CellProps } from 'react-table'
import Moment from 'react-moment'

import { convertNumberToRoundedString } from '../../lib/util'
import { ICollection } from '../../frontend/types'
import Table from './collectionsUpdateTable'
import EthLogo from '../svg/eth-logo'

const DeltaDisplay = ({ delta, denomination }: { delta: number | undefined; denomination: string }) => {
  const hasNoDelta = delta === 0 || delta === undefined
  const color = hasNoDelta ? '' : delta > 0 ? 'green' : 'red'
  const charge = delta && delta > 0 ? '+' : ''
  const deltaString = `${charge}${convertNumberToRoundedString(delta)}${denomination}`
  return (
    <span>
      {hasNoDelta ? <span style={{ color: 'white' }}>-</span> : <span style={{ color }}>{`${deltaString}`}</span>}
    </span>
  )
}

interface IProps {
  topCollections: ICollection[]
}

function CollectionsUpdateTable({ topCollections }: IProps) {
  const columns = useMemo(
    () => [
      {
        Header: `Collection`,
        accessor: 'name',
        Cell: ({ cell: { value, row } }: CellProps<any>) => {
          const slug = row.original.slug
          return (
            <div
              // className="flex items-center space-x-3 overflow-ellipsis"
              style={{ display: 'flex', alignItems: 'center', overflow: 'clip' }}
            >
              <img
                src={row.original.image_url}
                style={{ height: '2rem', width: '2rem', borderRadius: '9999px' }}
                className="collection-image"
              />
              <span
                // className="overflow-ellipsis overflow-hidden"
                style={{ marginLeft: 3 }}
              >
                <a href={`https://opensea.io/collection/${slug}`} target="_blank" rel="noreferrer">
                  {value}
                </a>
              </span>
            </div>
          )
        },
        width: 200,
      },
      {
        Header: `Floor Price`,
        accessor: 'floor_price',
        id: 'floor_price',
        Cell: ({ cell: { value } }: CellProps<any>) => {
          return (
            <div>
              {value !== null && (
                <span
                  // className="flex items-center justify-start space-x-2"
                  style={{ display: 'flex', flexShrink: 0, alignItems: 'center' }}
                >
                  <EthLogo style={{ height: '1rem', width: '1rem' }} />
                  <span style={{ marginLeft: 3 }}>{convertNumberToRoundedString(value)}</span>
                </span>
              )}
            </div>
          )
        },
        disableFilters: true,
      },
      {
        Header: `24hr Volume`,
        accessor: `one_day_volume`,
        id: 'Volume',
        Cell: ({ cell: { value } }: CellProps<any>) => {
          return (
            <div>
              {value !== null && (
                <span
                  style={{ display: 'flex', flexShrink: 0, alignItems: 'center', justifyContent: 'start' }}
                  // className="flex justify-start space-x-2"
                >
                  <EthLogo style={{ height: '1rem', width: '1rem' }} />
                  <span style={{ marginLeft: 3 }}>{convertNumberToRoundedString(value)}</span>
                </span>
              )}
            </div>
          )
        },
        disableFilters: true,
      },
      {
        Header: `24h %`,
        accessor: `one_day_change`,
        Cell: ({ cell: { value } }: CellProps<any>) => {
          return (
            <div
              // className="flex justify-start"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'start' }}
            >
              <span>{value && <DeltaDisplay delta={value} denomination="%" />}</span>
            </div>
          )
        },
        disableFilters: true,
      },
      {
        Header: 'Updated',
        accessor: 'updated_at',
        disableFilters: true,
        Cell: ({ cell: { value } }: CellProps<any>) => {
          return (
            <div
              // className="flex justify-start"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'start' }}
            >
              <Moment fromNow>{value}</Moment>
            </div>
          )
        },
      },
    ],
    [],
  )

  // Sort the collections by floor price by default
  const sortedCollections = topCollections.sort((collectionA, collectionB) => {
    if ((collectionA?.floor_price || 0) > (collectionB?.floor_price || 0)) return -1
    if ((collectionA?.floor_price || 0) < (collectionB?.floor_price || 0)) return 1
    return 0
  })

  return (
    <div className="w-full ">
      <Table columns={columns} data={sortedCollections} />
    </div>
  )
}

export default CollectionsUpdateTable
