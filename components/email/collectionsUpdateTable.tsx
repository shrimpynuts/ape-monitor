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

type Data = object

type IProps = {
  columns: Column<Data>[]
  data: Data[]
}

interface TableColumn<D extends object = {}>
  extends ColumnInstance<D>,
    UseSortByColumnProps<D>,
    UseFiltersColumnProps<D> {
  getResizerProps: any
}

const Table = ({ columns, data }: IProps) => {
  const { getTableProps, headerGroups, rows, prepareRow } = useTable<Data>(
    {
      columns,
      defaultColumn: {
        minWidth: 20,
        width: 100,
      },
      data,
    },
    useFilters,
    useSortBy,
    useBlockLayout,
    useResizeColumns,
  ) as TableInstance<any>

  return (
    <div className="outer-table">
      <div className="sm:rounded-lg overflow-x-scroll">
        <table {...getTableProps()} className="min-w-full">
          <thead className="bg-gray-100 dark:bg-blackPearl">
            <tr>
              {headerGroups.map((headerGroup, i) => (
                <th
                  className="flex text-left border-b border-gray-300 dark:border-darkblue text-xs font-bold uppercase text-gray-500 dark:text-white"
                  {...headerGroup.getHeaderGroupProps()}
                  key={i}
                >
                  {headerGroup.headers.map((c, ii) => {
                    const column = c as unknown as TableColumn<Data>
                    return (
                      <div
                        className="p-2 md:px-4 md:py-3"
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                        // style={{
                        //   display: 'inline-block',
                        //   boxSizing: 'border-box',
                        //   width: '100px',
                        //   // padding: '0.5rem',
                        //   padding: '0.75rem 1rem 0.75rem 1rem',
                        // }}
                        key={ii}
                      >
                        {column.render('Header')}
                      </div>
                    )
                  })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody
            style={{ backgroundColor: 'white' }}
            className="bg-white -mb-2 text-gray-500 dark:text-gray-100 dark:bg-blackPearl dark:divide-darkblue"
          >
            {rows.map((row, i) => {
              prepareRow(row)
              const slug = row.original.collection.slug
              console.log(slug)
              return (
                <a
                  className="collection-link"
                  href={`https://opensea.io/collection/${slug}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <tr
                    className="relative flex select-none hover:bg-gray-100 dark:hover:bg-black transition-all cursor-pointer"
                    {...row.getRowProps()}
                    style={{
                      width: '100%',
                      display: 'flex',
                    }}
                    key={i}
                  >
                    {row.cells.map((cell, ii) => {
                      return (
                        <td className="p-2 md:p-4 text-center whitespace-nowrap" {...cell.getCellProps()} key={ii}>
                          {cell.render('Cell')}
                        </td>
                      )
                    })}
                  </tr>
                </a>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Table
