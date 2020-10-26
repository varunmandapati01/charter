import React  from "react";
import { useTable, useExpanded, usePagination } from "react-table";

function Table({ columns, data, renderRowSubComponent }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    visibleColumns,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable({
    columns,
    data,
    initialState: { pageIndex: 0, pageSize: 5 },
  },
    useExpanded, usePagination);

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <React.Fragment>
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>

                {row.isExpanded ? (
                  <tr>
                    <td />
                    <td colSpan={visibleColumns.length}>
                      {renderRowSubComponent({ row })}
                    </td>
                  </tr>
                ) : null}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        <div className="container">
          <div className="row">
            <div className="col-3">
              <button className="btn" onClick={() => previousPage()} disabled={!canPreviousPage}>
                Previous
        </button>
            </div>
            <div className="col-6 text-center">
              <span>
                Page{' '}
                <input
                  type="number"
                  defaultValue={pageIndex + 1}
                  onChange={e => {
                    const page = e.target.value ? Number(e.target.value) - 1 : 0
                    gotoPage(page)
                  }}
                />{' '}
         of {pageOptions.length}
              </span>
              {' '}
              <select
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value))
                }}
              >
                {[5, 10, 15, 20].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize} rows
                  </option>
                ))}
              </select>
            </div>
            <div className="col-3">
              <button className="btn" onClick={() => nextPage()} disabled={!canNextPage}>
                Next
        </button>
            </div>
          </div> </div> </div>
    </>
  );
}

export default Table;