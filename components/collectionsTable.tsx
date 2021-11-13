import { useState, useEffect, useMemo, useRef, FC } from 'react'
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
import { PlusSmIcon, MinusSmIcon, LinkIcon, ExternalLinkIcon } from '@heroicons/react/solid'
import web3 from 'web3'

import { fixedNumber, getCostBasis } from '../lib/util'
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
      className="px-8 py-2 rounded-sm w-64 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-700"
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
    // TODO: Type the TableInstance<> (defines the type for a row)
  ) as TableInstance<any>

  const [expandedRows, setExpandedRows] = useState<number[]>([])

  // Render the UI for your table
  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden sm:rounded-lg">
            <table {...getTableProps()} className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-850">
                <tr>
                  {headerGroups.map((headerGroup, i) => (
                    <th
                      className="flex px-6 text-left border-b border-gray-200 dark:border-gray-700  text-xs font-medium text-gray-500 dark:text-gray-100 uppercase tracking-wider"
                      {...headerGroup.getHeaderGroupProps()}
                      style={{}}
                      key={i}
                    >
                      {headerGroup.headers.map((c, ii) => {
                        const column = c as unknown as TableColumn<Data>
                        return (
                          <div className="p-2" {...column.getHeaderProps(column.getSortByToggleProps())} key={ii}>
                            {column.render('Header')}
                            <div {...column} />
                            <div className="my-1">{column.canFilter ? column.render('Filter') : null}</div>
                            <ResizerComponent {...column.getResizerProps()} />
                          </div>
                        )
                      })}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-gray-500 dark:text-gray-100 dark:bg-gray-800 dark:divide-gray-700">
                {rows.map((row, i) => {
                  prepareRow(row)
                  const isExpanded = expandedRows.includes(i)
                  return (
                    <>
                      <tr className="relative flex px-6 " {...row.getRowProps()} style={{}} key={i}>
                        <span
                          className="absolute left-2 top-4 cursor-pointer"
                          onClick={() => {
                            // If this row is already expanded, filter it out from the state of expanded row indexes
                            // Otherwise, add it to the state of expanded row indexes
                            if (isExpanded) {
                              setExpandedRows(expandedRows.filter((row) => row !== i))
                            } else {
                              setExpandedRows([...expandedRows, i])
                            }
                          }}
                        >
                          {!isExpanded ? <PlusSmIcon className="h-5 w-5" /> : <MinusSmIcon className="h-5 w-5" />}
                        </span>
                        {row.cells.map((cell, ii) => {
                          return (
                            <td className="px-4 py-2 whitespace-nowrap " {...cell.getCellProps()} key={ii}>
                              {cell.render('Cell')}
                            </td>
                          )
                        })}
                      </tr>
                      {isExpanded && (
                        <table className="table-fixed min-w-full divide-y divide-gray-200 dark:divide-gray-700 ">
                          <thead className="bg-gray-50 dark:bg-gray-850">
                            <tr>
                              <th className="flex px-6 text-left border-b border-gray-200 dark:border-gray-700  text-xs font-medium text-gray-500 dark:text-gray-100 uppercase tracking-wider">
                                <div className="px-4 py-2 w-1/2">Name</div>
                                <div className="px-4 py-2 w-1/4">Cost Basis</div>
                                <div className="px-4 py-2 w-1/4">Opensea</div>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200 text-gray-500 dark:text-gray-100 dark:bg-gray-800 dark:divide-gray-700">
                            {row.original.assets.map((asset: any, i: any) => {
                              return (
                                <tr className="relative flex px-6 " key={i}>
                                  <td className="w-1/2 px-4 py-2">
                                    <div className="flex items-center space-x-4">
                                      <img src={asset.image_thumbnail_url} className="h-8 rounded" />
                                      <span>{asset.name}</span>
                                    </div>
                                  </td>
                                  <td className="w-1/4 px-4 py-2">
                                    {asset.last_sale ? (
                                      <div>
                                        {web3.utils.fromWei(asset.last_sale.total_price)}{' '}
                                        {asset.last_sale.payment_token.symbol}
                                      </div>
                                    ) : (
                                      <div>Minted</div>
                                    )}
                                  </td>
                                  <td className="w-1/4 px-4 py-2">
                                    <div className="flex items-center h-full">
                                      <a href={asset.permalink} target="_blank" rel="noreferrer">
                                        <ExternalLinkIcon className="h-4 w-4" />
                                      </a>
                                    </div>
                                  </td>
                                </tr>
                              )
                            })}

                            <tr className=" relative flex px-6 divide-x divide-gray-200 dark:divide-gray-700"></tr>
                          </tbody>
                        </table>
                      )}
                    </>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function CollectionsTable({ collections }: { collections: any[] }) {
  const timespans = [
    { value: '24h', dataPrefix: 'one_day', display: '1 Day' },
    { value: '7d', dataPrefix: 'seven_day', display: '7 Day' },
    { value: '30d', dataPrefix: 'thirty_day', display: '30 Day' },
  ]
  const [currentTimespan, setCurrentTimespan] = useState(timespans[0])

  const columns = useMemo(
    () => [
      {
        Header: `Collections (${collections.length})`,
        columns: [
          {
            Header: 'Name',
            accessor: 'name',
            width: 300,
            Cell: ({ cell: { value, row } }: CellProps<any>) => (
              <div className="flex space-x-2">
                <img src={row.original.image_url} className="h-8 w-8 rounded" />
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
              <div className="flex space-x-2 items-center">
                <a href={`https://opensea.io/collection/${value}`} target="_blank" rel="noreferrer">
                  <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M16.3333 1.65739C15.726 1.93846 15.0787 2.12478 14.404 2.21524C15.0981 1.778 15.628 1.09092 15.877 0.262775C15.2299 0.66985 14.5152 0.957387 13.7537 1.11785C13.1392 0.427551 12.2633 0 11.3078 0C9.45396 0 7.96147 1.58739 7.96147 3.53337C7.96147 3.81337 7.98396 4.08263 8.03911 4.33887C5.25523 4.19576 2.79198 2.78812 1.13721 0.644001C0.848315 1.17278 0.678859 1.778 0.678859 2.42955C0.678859 3.65287 1.27604 4.73737 2.16621 5.36525C1.62823 5.3545 1.10046 5.18976 0.653333 4.93012C0.653333 4.94087 0.653333 4.95487 0.653333 4.96887C0.653333 6.6855 1.81402 8.11137 3.33609 8.43988C3.06353 8.5185 2.76646 8.55612 2.45817 8.55612C2.24379 8.55612 2.02737 8.54325 1.82423 8.49588C2.25809 9.89475 3.48921 10.9233 4.95303 10.9566C3.8138 11.8967 2.36732 12.4633 0.801352 12.4633C0.526754 12.4633 0.26337 12.4504 0 12.4147C1.48326 13.4239 3.24114 14 5.13687 14C11.2986 14 14.6673 8.61537 14.6673 3.948C14.6673 3.79188 14.6622 3.64113 14.655 3.49137C15.3197 2.99388 15.878 2.37246 16.3333 1.65739Z"
                      fill="#0B99EC"
                    />
                  </svg>
                </a>
                {row.original.external_url && (
                  <a href={row.original.external_url} target="_blank" rel="noreferrer">
                    <LinkIcon className="h-4 w-4" />
                  </a>
                )}
                {row.original.twitter_username && (
                  <a href={`https://twitter.com/${row.original.twitter_username}`} target="_blank" rel="noreferrer">
                    <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M16.3333 1.65739C15.726 1.93846 15.0787 2.12478 14.404 2.21524C15.0981 1.778 15.628 1.09092 15.877 0.262775C15.2299 0.66985 14.5152 0.957387 13.7537 1.11785C13.1392 0.427551 12.2633 0 11.3078 0C9.45396 0 7.96147 1.58739 7.96147 3.53337C7.96147 3.81337 7.98396 4.08263 8.03911 4.33887C5.25523 4.19576 2.79198 2.78812 1.13721 0.644001C0.848315 1.17278 0.678859 1.778 0.678859 2.42955C0.678859 3.65287 1.27604 4.73737 2.16621 5.36525C1.62823 5.3545 1.10046 5.18976 0.653333 4.93012C0.653333 4.94087 0.653333 4.95487 0.653333 4.96887C0.653333 6.6855 1.81402 8.11137 3.33609 8.43988C3.06353 8.5185 2.76646 8.55612 2.45817 8.55612C2.24379 8.55612 2.02737 8.54325 1.82423 8.49588C2.25809 9.89475 3.48921 10.9233 4.95303 10.9566C3.8138 11.8967 2.36732 12.4633 0.801352 12.4633C0.526754 12.4633 0.26337 12.4504 0 12.4147C1.48326 13.4239 3.24114 14 5.13687 14C11.2986 14 14.6673 8.61537 14.6673 3.948C14.6673 3.79188 14.6622 3.64113 14.655 3.49137C15.3197 2.99388 15.878 2.37246 16.3333 1.65739Z"
                        fill="#0B99EC"
                      />
                    </svg>
                  </a>
                )}
                {row.original.discord_url && (
                  <a href={row.original.discord_url} target="_blank" rel="noreferrer">
                    <svg width="19" height="14" viewBox="0 0 19 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M15.6583 1.16052C14.4794 0.623368 13.2151 0.227615 11.8933 0.000950826C11.8693 -0.00342372 11.8452 0.00750851 11.8328 0.0293735C11.6702 0.316529 11.4901 0.691146 11.364 0.985594C9.94231 0.774239 8.52791 0.774239 7.13537 0.985594C7.00923 0.684601 6.82259 0.316529 6.65927 0.0293735C6.64687 0.00823803 6.62283 -0.0026942 6.59875 0.000950826C5.27767 0.226891 4.01346 0.622643 2.83381 1.16052C2.82359 1.1649 2.81484 1.17219 2.80903 1.18166C0.411084 4.73909 -0.245814 8.20908 0.0764379 11.636C0.077896 11.6528 0.0873739 11.6688 0.100497 11.679C1.68259 12.8328 3.21513 13.5332 4.7192 13.9974C4.74327 14.0047 4.76877 13.996 4.78409 13.9763C5.13988 13.4938 5.45704 12.9851 5.72896 12.4501C5.74501 12.4188 5.72969 12.3816 5.69689 12.3692C5.19383 12.1797 4.71482 11.9487 4.25404 11.6863C4.2176 11.6652 4.21468 11.6134 4.24821 11.5887C4.34517 11.5165 4.44216 11.4414 4.53475 11.3656C4.5515 11.3518 4.57484 11.3489 4.59454 11.3576C7.62165 12.73 10.8989 12.73 13.8903 11.3576C13.9099 11.3481 13.9333 11.3511 13.9508 11.3649C14.0434 11.4407 14.1403 11.5165 14.238 11.5887C14.2716 11.6134 14.2694 11.6652 14.2329 11.6863C13.7722 11.9538 13.2931 12.1797 12.7894 12.3685C12.7566 12.3809 12.742 12.4188 12.758 12.4501C13.0358 12.9844 13.3529 13.4931 13.7022 13.9756C13.7167 13.996 13.743 14.0047 13.7671 13.9974C15.2784 13.5332 16.8109 12.8328 18.393 11.679C18.4069 11.6688 18.4156 11.6535 18.4171 11.6368C18.8028 7.67482 17.7711 4.23329 15.6823 1.18238C15.6772 1.17219 15.6685 1.1649 15.6583 1.16052ZM6.18101 9.54938C5.26965 9.54938 4.5187 8.71853 4.5187 7.69815C4.5187 6.67778 5.25508 5.84693 6.18101 5.84693C7.11421 5.84693 7.85789 6.68508 7.8433 7.69815C7.8433 8.71853 7.10692 9.54938 6.18101 9.54938ZM12.3271 9.54938C11.4158 9.54938 10.6648 8.71853 10.6648 7.69815C10.6648 6.67778 11.4012 5.84693 12.3271 5.84693C13.2603 5.84693 14.004 6.68508 13.9894 7.69815C13.9894 8.71853 13.2603 9.54938 12.3271 9.54938Z"
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
        Header: 'Stats',
        columns: [
          {
            Header: `Floor Price (with ${currentTimespan.display} Change)`,
            accessor: 'stats.floor_price',
            Cell: ({ cell: { value, row } }: CellProps<any>) => (
              <div className="flex items-center space-x-2">
                <span>{fixedNumber(value)}Ξ</span>
                <DeltaDisplay delta={row.original.stats[`${currentTimespan.dataPrefix}_change`]} denomination="%" />
              </div>
            ),
            disableFilters: true,
            width: 170,
          },
          {
            Header: `Volume (with ${currentTimespan.display} Volume)`,
            accessor: 'stats.total_volume',
            Cell: ({ cell: { value, row } }: CellProps<any>) => (
              <div className="flex items-center space-x-2">
                <span>{fixedNumber(value)}Ξ</span>
                {row.original.stats[`${currentTimespan.dataPrefix}_volume`] > 0 && (
                  <span className="text-green-600">
                    +{fixedNumber(row.original.stats[`${currentTimespan.dataPrefix}_volume`])}Ξ
                  </span>
                )}
              </div>
            ),
            disableFilters: true,
            width: 170,
          },
          {
            Header: `Cost Basis`,
            accessor: 'assets',
            Cell: ({ cell: { row } }: CellProps<any>) => {
              const costBasis = getCostBasis(row.original)
              return (
                <div className="flex items-center justify-between space-x-2">
                  <span>{`${fixedNumber(costBasis.total)} ${costBasis.symbol}`}</span>
                </div>
              )
            },
            disableFilters: true,
            width: 200,
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
    [currentTimespan],
  )

  return (
    <div>
      <div>
        <div className="flex my-2 px-4 py-1 space-x-2 shadow rounded dark:bg-gray-800 w-min text-gray-500 dark:text-gray-100 ">
          {timespans.map((timespan, i) => {
            const { value } = timespan
            return (
              <button
                key={i}
                className={`cursor-pointer shadow rounded px-4 ${
                  currentTimespan.value === value && 'bg-gray-100 dark:bg-gray-700'
                }`}
                onClick={() => setCurrentTimespan(timespan)}
              >
                <span>{value}</span>
              </button>
            )
          })}
        </div>
      </div>
      <Table columns={columns} data={collections} />
    </div>
  )
}

export default CollectionsTable
