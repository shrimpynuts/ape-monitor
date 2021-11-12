import { useEffect, useMemo, useRef, FC } from 'react'
import {
  useTable,
  useFilters,
  useSortBy,
  Column,
  CellProps,
  UseSortByColumnProps,
  TableInstance,
  UseFiltersColumnProps,
  ColumnInstance,
  useBlockLayout,
  useResizeColumns,
} from 'react-table'
import { GlobeAltIcon, ExternalLinkIcon } from '@heroicons/react/solid'

import { fixedNumber } from '../lib/util'
import DeltaDisplay from './deltaDisplay'

// https://codesandbox.io/s/react-table-typescript-xl7l4

type Data = object

type Props = {
  columns: Column<Data>[]
  data: Data[]
}

interface TableColumn<D extends object = {}>
  extends ColumnInstance<D>,
    UseSortByColumnProps<D>,
    UseFiltersColumnProps<D> {
  getResizerProps: any
}

const useStopPropagationOnClick = <T extends any>(ref: any) => {
  useEffect(() => {
    if (ref.current !== null) {
      ref.current.addEventListener('click', (e: MouseEvent) => e.stopPropagation())
    }
  }, [])
}

const DefaultColumnFilter = ({
  column: { filterValue, preFilteredRows, setFilter },
}: {
  column: TableColumn<Data>
}) => {
  const count = preFilteredRows.length
  const inputRef = useRef<HTMLInputElement>(null)
  useStopPropagationOnClick(inputRef)
  return (
    <input
      ref={inputRef}
      className="px-8 w-64 my-1"
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  )
}

const ResizerComponent: FC = (props) => {
  const ref = useRef<HTMLDivElement>(null)
  useStopPropagationOnClick(ref)
  return (
    <div
      style={{
        display: 'inline-block',
        width: '5px',
        height: '100%',
        position: 'absolute',
        right: '0',
        top: '0',
        transform: 'translateX(50%)',
        zIndex: 1,
      }}
      {...props}
      ref={ref}
    />
  )
}

const defaultColumn = {
  minWidth: 20,
  width: 200,
  maxWidth: 500,
  Filter: DefaultColumnFilter,
}

const Table: FC<Props> = ({ columns, data }) => {
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, headerGroups, rows, prepareRow } = useTable<Data>(
    {
      columns,
      defaultColumn,
      data,
    },
    useFilters,
    useSortBy,
    useBlockLayout,
    useResizeColumns,
  ) as TableInstance<object>
  // Render the UI for your table
  return (
    <div {...getTableProps()}>
      <div>
        {headerGroups.map((headerGroup, i) => (
          <div {...headerGroup.getHeaderGroupProps()} key={i}>
            {headerGroup.headers.map((c, ii) => {
              const column = c as unknown as TableColumn<Data>
              return (
                <div {...column.getHeaderProps(column.getSortByToggleProps())} key={ii}>
                  {column.render('Header')}
                  <div {...column} />
                  <div className="my-2">{column.canFilter ? column.render('Filter') : null}</div>
                  <ResizerComponent {...column.getResizerProps()} />
                </div>
              )
            })}
          </div>
        ))}
      </div>
      <div>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <div {...row.getRowProps()} key={i}>
              {row.cells.map((cell, ii) => {
                return (
                  <div {...cell.getCellProps()} key={ii}>
                    {cell.render('Cell')}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CollectionsTable({ collections }: { collections: any[] }) {
  console.log({ collections })
  const columns = useMemo(
    () => [
      {
        Header: 'Collection',
        columns: [
          {
            Header: 'Name',
            accessor: 'name',
            width: 300,
            Cell: ({ cell: { value, row } }: CellProps<any>) => (
              <div className="flex space-x-2">
                <img src={row.original.image_url} className="h-8 w-8" />
                <span>{value}</span>
              </div>
            ),
          },
          {
            Header: '# Owned',
            accessor: 'assets.length',
            width: 80,
            disableFilters: true,
          },
          {
            Header: 'Links',
            accessor: 'slug',
            Cell: ({ cell: { value, row } }: CellProps<any>) => (
              <div className="flex space-x-2">
                <a href={`https://opensea.io/collection/${value}`} target="_blank" rel="noreferrer">
                  <img src="/opensea.png" width={18} />
                </a>
                {row.original.external_url && (
                  <a href={row.original.external_url} target="_blank" rel="noreferrer">
                    <GlobeAltIcon className="h-5 w-5" />
                  </a>
                )}
                {row.original.twitter_username && (
                  <a href={`https://twitter.com/${row.original.twitter_username}`} target="_blank" rel="noreferrer">
                    <svg width="21" height="18" viewBox="0 0 21 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M21 2.13093C20.2191 2.49231 19.3869 2.73185 18.5195 2.84816C19.4118 2.286 20.0931 1.40262 20.4133 0.337854C19.5813 0.861236 18.6624 1.23093 17.6833 1.43724C16.8933 0.549708 15.7671 0 14.5385 0C12.1551 0 10.2362 2.04093 10.2362 4.54291C10.2362 4.90291 10.2651 5.24909 10.336 5.57855C6.75673 5.39455 3.58969 3.58473 1.46213 0.828001C1.09069 1.50786 0.872818 2.286 0.872818 3.12371C0.872818 4.69655 1.64062 6.09091 2.78513 6.89818C2.09344 6.88436 1.41487 6.67255 0.84 6.33873C0.84 6.35255 0.84 6.37055 0.84 6.38855C0.84 8.59564 2.33231 10.4289 4.28925 10.8513C3.93882 10.9524 3.55687 11.0007 3.16051 11.0007C2.88487 11.0007 2.60662 10.9842 2.34544 10.9233C2.90326 12.7218 4.48613 14.0442 6.36818 14.0871C4.90345 15.2958 3.04369 16.0242 1.03031 16.0242C0.677255 16.0242 0.338618 16.0076 0 15.9618C1.90705 17.2593 4.16718 18 6.60454 18C14.5267 18 18.858 11.0769 18.858 5.076C18.858 4.87527 18.8515 4.68145 18.8422 4.48891C19.6967 3.84927 20.4145 3.05031 21 2.13093Z"
                        fill="#0B99EC"
                      />
                    </svg>
                  </a>
                )}
                {row.original.discord_url && (
                  <a href={row.original.discord_url} target="_blank" rel="noreferrer">
                    <svg width="24" height="19" viewBox="0 0 24 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M20.019 1.64182C18.5033 0.951192 16.8778 0.442367 15.1784 0.150942C15.1474 0.145317 15.1165 0.159373 15.1006 0.187485C14.8915 0.556685 14.66 1.03834 14.4978 1.41691C12.6699 1.14517 10.8514 1.14517 9.06099 1.41691C8.89881 1.02992 8.65885 0.556685 8.44887 0.187485C8.43293 0.160311 8.40201 0.146255 8.37106 0.150942C6.67252 0.441436 5.0471 0.950261 3.53041 1.64182C3.51728 1.64744 3.50603 1.65682 3.49856 1.669C0.415484 6.24283 -0.429099 10.7042 -0.0147751 15.1104C-0.0129003 15.1319 -0.00071449 15.1525 0.0161587 15.1656C2.05028 16.649 4.02068 17.5495 5.95449 18.1464C5.98544 18.1558 6.01823 18.1446 6.03792 18.1193C6.49537 17.4989 6.90314 16.8449 7.25276 16.157C7.27339 16.1168 7.2537 16.069 7.21153 16.053C6.56473 15.8094 5.94886 15.5123 5.35643 15.175C5.30957 15.1478 5.30582 15.0813 5.34893 15.0494C5.4736 14.9567 5.5983 14.8601 5.71734 14.7627C5.73888 14.7449 5.76889 14.7411 5.79421 14.7524C9.68621 16.5169 13.8998 16.5169 17.7458 14.7524C17.7712 14.7402 17.8012 14.7439 17.8236 14.7617C17.9427 14.8592 18.0674 14.9567 18.193 15.0494C18.2361 15.0813 18.2333 15.1478 18.1864 15.175C17.594 15.5189 16.9781 15.8094 16.3304 16.0521C16.2882 16.068 16.2695 16.1168 16.2901 16.157C16.6472 16.8439 17.055 17.498 17.504 18.1183C17.5228 18.1446 17.5565 18.1558 17.5874 18.1464C19.5306 17.5495 21.501 16.649 23.5351 15.1656C23.553 15.1525 23.5642 15.1328 23.5661 15.1113C24.0619 10.0173 22.7355 5.59252 20.0499 1.66993C20.0434 1.65682 20.0321 1.64744 20.019 1.64182ZM7.83397 12.4275C6.66221 12.4275 5.69671 11.3593 5.69671 10.0473C5.69671 8.73544 6.64348 7.6672 7.83397 7.6672C9.03379 7.6672 9.98995 8.74482 9.97119 10.0473C9.97119 11.3593 9.02442 12.4275 7.83397 12.4275ZM15.7361 12.4275C14.5644 12.4275 13.5989 11.3593 13.5989 10.0473C13.5989 8.73544 14.5456 7.6672 15.7361 7.6672C16.936 7.6672 17.8921 8.74482 17.8734 10.0473C17.8734 11.3593 16.936 12.4275 15.7361 12.4275Z"
                        fill="#5865F2"
                      />
                    </svg>
                  </a>
                )}
              </div>
            ),
            disableFilters: true,
            width: 150,
          },
        ],
      },
      {
        Header: 'Floor Price',
        columns: [
          {
            Header: 'Total Floor Price',
            accessor: 'stats.floor_price',
            Cell: ({ cell: { value } }: CellProps<object>) => <div>{fixedNumber(value)}Ξ</div>,
            disableFilters: true,
            width: 150,
          },
          {
            Header: '1 Day Change',
            accessor: 'stats.one_day_change',
            Cell: ({ cell: { value } }: CellProps<object>) => <DeltaDisplay delta={value} denomination="%" />,
            disableFilters: true,
            width: 150,
          },
        ],
      },
      {
        Header: 'Volume',
        columns: [
          {
            Header: 'Total Volume',
            accessor: 'stats.total_volume',
            Cell: ({ cell: { value } }: CellProps<object>) => <div>{fixedNumber(value)}Ξ</div>,
            disableFilters: true,
            width: 150,
          },
          {
            Header: '1 Day Volume',
            accessor: 'stats.one_day_volume',
            Cell: ({ cell: { value } }: CellProps<object>) => <div>{fixedNumber(value)}Ξ</div>,
            disableFilters: true,
            width: 150,
          },
        ],
      },
      {
        Header: 'Other',
        columns: [
          {
            Header: 'Activity',
            accessor: 'slug',
            width: 20,
            id: 2,
            Cell: ({ cell: { value } }: CellProps<object>) => (
              <a href={`https://opensea.io/collection/${value}?tab=activity`} target="_blank" rel="noreferrer">
                <ExternalLinkIcon className="h-4 w-4" />
              </a>
            ),
            disableFilters: true,
          },
        ],
      },
    ],
    [],
  )

  return <Table columns={columns} data={collections} />
}

export default CollectionsTable
