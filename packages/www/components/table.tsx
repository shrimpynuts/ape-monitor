import { useState, useEffect, useRef, FC } from 'react'
import {
  useTable,
  useFilters,
  useSortBy,
  Column,
  UseSortByColumnProps,
  TableInstance,
  UseFiltersColumnProps,
  ColumnInstance,
  useBlockLayout,
  useResizeColumns,
} from 'react-table'

import { ExternalLinkIcon } from '@heroicons/react/solid'

// https://codesandbox.io/s/react-table-typescript-xl7l4

type Data = object

type IProps = {
  columns: Column<Data>[]
  data: Data[]
  isMobile: boolean
  dontIncludeSubrowCostBasis?: boolean
  // JSX Element that replaces the table body if necessary
  // Use for spinner or other displays that take up body
  replaceTableBody?: React.ReactNode

  // If you don't want to allow users to open subrows at all
  dontIncludeSubrows?: boolean
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
      className="hidden md:block px-8 py-2 rounded-sm w-64 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-700"
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

const Table: FC<IProps> = ({
  columns,
  data,
  isMobile,
  replaceTableBody,
  dontIncludeSubrows = false,
  dontIncludeSubrowCostBasis = false,
}) => {
  const defaultColumn = {
    minWidth: 20,
    width: isMobile ? 100 : 200,
    maxWidth: isMobile ? 200 : 300,
    Filter: DefaultColumnFilter,
  }
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, headerGroups, rows, prepareRow } = useTable<Data>(
    {
      columns,
      defaultColumn,
      data,
      initialState: {
        hiddenColumns: isMobile ? ['slug'] : [],
      },
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
    <div className="sm:rounded-lg mb-2 shadow border border-solid border-gray-300 dark:border-darkblue">
      <div className="sm:rounded-lg overflow-x-scroll">
        <table {...getTableProps()} className="min-w-full">
          <thead className="bg-gray-100 dark:bg-blackPearl">
            <tr>
              {headerGroups.map((headerGroup, i) => (
                <th
                  className="flex text-left border-b border-gray-300 dark:border-darkblue text-xs font-bold uppercase text-gray-500 dark:text-white"
                  {...headerGroup.getHeaderGroupProps()}
                  style={{}}
                  key={i}
                >
                  {headerGroup.headers.map((c, ii) => {
                    const column = c as unknown as TableColumn<Data>
                    return (
                      <div
                        className="p-2 md:px-4 md:py-3"
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                        key={ii}
                      >
                        {column.render('Header')}
                        <ResizerComponent {...column.getResizerProps()} />
                      </div>
                    )
                  })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white -mb-2 text-gray-500 dark:text-gray-100 dark:bg-blackPearl dark:divide-darkblue">
            {replaceTableBody ? (
              <tr className="p-32 flex flex-col justify-center items-center space-y-8">
                <td>{replaceTableBody}</td>
              </tr>
            ) : (
              <>
                {rows.map((row, i) => {
                  prepareRow(row)
                  const isExpanded = expandedRows.includes(i)
                  return (
                    <>
                      <tr
                        className="relative flex select-none hover:bg-gray-100 dark:hover:bg-black transition-all cursor-pointer"
                        {...row.getRowProps()}
                        style={{
                          width: '100%',
                        }}
                        key={i}
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
                        {row.cells.map((cell, ii) => {
                          return (
                            <td className="p-2 md:p-4 text-center whitespace-nowrap" {...cell.getCellProps()} key={ii}>
                              {cell.render('Cell')}
                            </td>
                          )
                        })}
                      </tr>
                      {isExpanded && !dontIncludeSubrows && (
                        <table className="select-none table-fixed min-w-full divide-y divide-gray-300 dark:divide-darkblue">
                          <thead className="border-t border-gray-300 dark:border-darkblue bg-gray-100 dark:bg-blackPearl">
                            <tr>
                              <th className="flex px-6 text-left border-gray-300 dark:border-darkblue text-xs font-medium text-gray-500 dark:text-gray-100 uppercase tracking-wider">
                                <div className="px-4 py-2 w-1/2">Name</div>
                                {!dontIncludeSubrowCostBasis && <div className="px-4 py-2 w-1/4">Total Spent</div>}
                                <div className="px-4 py-2 w-1/4">Opensea</div>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-gray-100 divide-y divide-gray-300 dark:divide-darkblue text-gray-500 dark:text-gray-100 dark:bg-blackPearl">
                            {row.original.assets.map((asset: any, i: any) => {
                              return (
                                <tr className="relative flex px-6 " key={i}>
                                  <td className="w-1/2 px-4 py-2">
                                    <div className="flex items-center space-x-4">
                                      <img src={asset.image_url} className="h-8 rounded" />
                                      <span>{asset.name}</span>
                                    </div>
                                  </td>
                                  {!dontIncludeSubrowCostBasis && (
                                    <td className="w-1/4 px-4 py-2">
                                      {asset.last_sale ? <div>{asset.last_sale}Ξ</div> : <div>Minted</div>}
                                    </td>
                                  )}
                                  <td className="w-1/4 px-4 py-2">
                                    <div className="flex items-center h-full">
                                      <a href={asset.link} target="_blank" rel="noreferrer">
                                        <ExternalLinkIcon className="h-4 w-4" />
                                      </a>
                                    </div>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      )}
                    </>
                  )
                })}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Table