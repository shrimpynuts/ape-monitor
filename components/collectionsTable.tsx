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
        {headerGroups.map((headerGroup) => (
          <div {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((c) => {
              const column = c as unknown as TableColumn<Data>
              return (
                <div {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <div {...column} />
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
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
            <div {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <div {...cell.getCellProps()}>{cell.render('Cell')}</div>
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CollectionsTable({ collections }: { collections: any[] }) {
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
            // disableFilters: true,
          },
          {
            Header: '# Owned',
            accessor: 'assets.length',
            width: 100,
            disableFilters: true,
          },
          {
            Header: 'Links',
            accessor: 'slug',
            Cell: ({ cell: { value } }: CellProps<object>) => (
              <a href={`https://opensea.io/collection/${value}`} target="_blank" rel="noreferrer">
                <img src="/opensea.png" width={18} />
              </a>
            ),
            disableFilters: true,
            width: 100,
          },
        ],
      },
      {
        Header: 'One Day Stats',
        columns: [
          {
            Header: 'Volume',
            accessor: 'stats.one_day_volume',
            Cell: ({ cell: { value } }: CellProps<object>) => <div>{fixedNumber(value)}</div>,
            disableFilters: true,
            width: 100,
          },
          {
            Header: 'Change',
            accessor: 'stats.one_day_change',
            Cell: ({ cell: { value } }: CellProps<object>) => <DeltaDisplay delta={value} denomination="Ξ" />,
            disableFilters: true,
            width: 100,
          },
          {
            Header: 'Sales',
            accessor: 'stats.one_day_sales',
            Cell: ({ cell: { value } }: CellProps<object>) => <div>{fixedNumber(value)}</div>,
            disableFilters: true,
            width: 100,
          },
        ],
      },
    ],
    [],
  )

  return <Table columns={columns} data={collections} />
}

export default CollectionsTable
