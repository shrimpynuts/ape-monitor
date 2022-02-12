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
  const { headerGroups, rows, prepareRow } = useTable<Data>(
    {
      columns,
      defaultColumn: {
        minWidth: 20,
        width: 90,
      },
      data,
    },
    useFilters,
    useSortBy,
    useBlockLayout,
    useResizeColumns,
  ) as TableInstance<any>
  return (
    <div
    // className="sm:rounded-lg mb-2 shadow border border-solid border-gray-300 dark:border-darkblue"
    >
      <table
        style={{
          borderRadius: '0.5rem',
          marginBottom: '0.5rem',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'rgba(209, 213, 219, .9)',
          boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
          margin: '2rem',
        }}
        role="table"
        // className="min-w-full"
      >
        <thead
          style={{ backgroundColor: '#F3F4F6' }}
          // className="bg-gray-100 dark:bg-blackPearl"
        >
          <tr>
            {headerGroups.map((headerGroup, i) => {
              const { key, style } = headerGroup.getHeaderGroupProps()
              return (
                <th
                  // className="flex text-left border-b border-gray-300 dark:border-darkblue text-xs font-bold uppercase text-gray-500 dark:text-white"
                  // {...headerGroup.getHeaderGroupProps()}
                  style={{
                    display: 'flex',
                    width: style?.width || '630px',
                  }}
                  role="row"
                  key={key}
                >
                  {headerGroup.headers.map((c, ii) => {
                    const column = c as unknown as TableColumn<Data>
                    const { key, style } = column.getHeaderProps(column.getSortByToggleProps())
                    return (
                      <div
                        // className="p-2 md:px-4 md:py-3"
                        // {...column.getHeaderProps(column.getSortByToggleProps())}
                        style={{
                          display: 'inline-block',
                          boxSizing: 'border-box',
                          width: style?.width || '100px',
                          position: 'relative',
                          cursor: 'pointer',
                          padding: '0.25rem 0 0.25rem 0',
                          // padding: '2rem 3rem 2rem 3rem',
                        }}
                        key={key}
                      >
                        {column.render('Header')}
                      </div>
                    )
                  })}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody
          style={{ backgroundColor: 'white' }}
          className="bg-white -mb-2 text-gray-500 dark:text-gray-100 dark:bg-blackPearl dark:divide-darkblue"
        >
          {rows.map((row, i) => {
            prepareRow(row)
            const { key, style } = row.getRowProps()
            return (
              <tr
                // className="relative flex select-none hover:bg-gray-100 dark:hover:bg-black transition-all cursor-pointer"
                // {...row.getRowProps()}
                role="row"
                style={{
                  width: style?.width || '100%',
                  display: 'flex',
                }}
                key={key}
              >
                {row.cells.map((cell, ii) => {
                  const { key, style } = cell.getCellProps()
                  return (
                    <td
                      // className="p-2 md:p-4 text-center whitespace-nowrap"
                      key={key}
                      role="cell"
                      style={{
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflowX: 'hidden',
                        padding: '0.75rem 1rem 0.75rem 1rem',
                        width: style?.width || '100%',
                      }}
                    >
                      {cell.render('Cell')}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Table
