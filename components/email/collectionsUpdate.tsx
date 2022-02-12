import { useMemo } from 'react'
import { CellProps } from 'react-table'
import Moment from 'react-moment'

import { convertNumberToRoundedString } from '../../lib/util'
import { ICollectionsWithAssets } from '../../frontend/types'
import DeltaDisplay from '../util/deltaDisplay'
import Table from './collectionsUpdateTable'
import EthLogo from '../svg/eth-logo'

interface IProps {
  collectionsWithAssets: ICollectionsWithAssets
}

function CollectionsUpdateTable({ collectionsWithAssets }: IProps) {
  const columns = useMemo(
    () => [
      {
        Header: `Collection`,
        accessor: 'collection.name',
        Cell: ({ cell: { value, row } }: CellProps<any>) => (
          <div
            className="flex items-center space-x-3 overflow-ellipsis"
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <img src={row.original.collection.image_url} className="collection-image" />
            <span className="overflow-ellipsis overflow-hidden" style={{ marginLeft: 3 }}>
              {value}
            </span>
          </div>
        ),
        width: 200,
      },
      {
        Header: `Floor Price`,
        accessor: 'collection.floor_price',
        id: 'floor_price',
        Cell: ({ cell: { value } }: CellProps<any>) => {
          return (
            <div>
              {value !== null && (
                <span className="flex items-center justify-start space-x-2">
                  <EthLogo style={{ height: '1rem', width: '1rem' }} />
                  <span>{convertNumberToRoundedString(value)}</span>
                </span>
              )}
            </div>
          )
        },
        disableFilters: true,
      },
      {
        Header: `Volume`,
        accessor: `collection.total_volume`,
        id: 'Volume',
        Cell: ({ cell: { value } }: CellProps<any>) => {
          return (
            <div>
              {value !== null && (
                <span className="flex justify-start space-x-2">
                  <EthLogo style={{ height: '1rem', width: '1rem' }} />
                  <span>{convertNumberToRoundedString(value)}</span>
                </span>
              )}
            </div>
          )
        },
        disableFilters: true,
      },
      {
        Header: `24h %`,
        accessor: `collection.one_day_change`,
        Cell: ({ cell: { value } }: CellProps<any>) => {
          return (
            <div className="flex justify-start">
              <span>{value && <DeltaDisplay delta={value} denomination="%" />}</span>
            </div>
          )
        },
        disableFilters: true,
      },
      {
        Header: '# Owned',
        accessor: 'assets.length',
        disableFilters: true,
        Cell: ({ cell: { value } }: CellProps<any>) => {
          return (
            <div className="flex justify-start space-x-2">
              <span className="text-left">{`${value}x`}</span>
            </div>
          )
        },
        width: 70,
      },
      {
        Header: 'Since',
        accessor: 'collection.updated_at',
        disableFilters: true,
        Cell: ({ cell: { value } }: CellProps<any>) => {
          return (
            <div className="flex justify-start space-x-2">
              <Moment fromNow>{value}</Moment>
            </div>
          )
        },
      },
    ],
    [],
  )

  // Sort the collections by floor price by default
  const sortedCollections = Object.values(collectionsWithAssets).sort(
    ({ collection: collectionA }, { collection: collectionB }) => {
      if ((collectionA?.floor_price || 0) > (collectionB?.floor_price || 0)) return -1
      if ((collectionA?.floor_price || 0) < (collectionB?.floor_price || 0)) return 1
      return 0
    },
  )

  return (
    <div className="w-full ">
      <Table columns={columns} data={sortedCollections} />
    </div>
  )
}

export default CollectionsUpdateTable
