import React, { useMemo, useState } from "react";
import faker from "faker";
import styled from "styled-components";
import { useBlockLayout, useResizeColumns, useTable } from "react-table";

// faker.seed(100);

const Tables = () => {
  const Styles = styled.div`
    padding: 1rem;

    .table {
      display: inline-block;
      border-spacing: 0;
      border: 1px solid black;

      .tr {
        :last-child {
          .td {
            border-bottom: 0;
          }
        }
      }

      .th,
      .td {
        margin: 0;
        padding: 0.5rem;
        border-bottom: 1px solid black;
        border-right: 1px solid black;

        ${
          "" /* In this example we use an absolutely position resizer,
       so this is required. */
        }
        position: relative;

        :last-child {
          border-right: 0;
        }

        .resizer {
          display: inline-block;
          background: blue;
          width: 10px;
          height: 100%;
          position: absolute;
          right: 0;
          top: 0;
          transform: translateX(50%);
          z-index: 1;
          ${"" /* prevents from scrolling while dragging on touch devices */}
          touch-action:none;

          &.isResizing {
            background: red;
          }
        }
      }
    }
  `;

  // const columns = useMemo(
  //   () => [
  //     // {
  //     //   // Column 제목
  //     //   // string
  //     //   title: "Type",

  //     //   // 아이템 타입
  //     //   // string, date, icon, react-avatar, etc...
  //     //   dataType: "icon",

  //     //   // Column 가로폭
  //     //   // number,
  //     //   width: 200,

  //     //   // Column 고정
  //     //   // false, true
  //     //   fixed: false,

  //     //   // Column Show / Hide
  //     //   // false, true
  //     //   show: true,
  //     // },
  //     {
  //       title: "Name",
  //       dataType: "string",
  //       width: 350,
  //       fixed: false,
  //       show: true,
  //     },

  //     {
  //       title: "Modify",
  //       dataType: "date",
  //       width: 350,
  //       fixed: false,
  //       show: true,
  //     },
  //   ],
  //   []
  // );

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 30,
      width: 150,
      maxWidth: 400,
    }),
    []
  );

  const columns = useMemo(
    () => [
      {
        accessor: "name",
        Header: "Name",
      },
      {
        accessor: "email",
        Header: "Email",
      },
      {
        accessor: "phone",
        Header: "Phone",
      },
    ],
    []
  );

  const sample = () =>
    Array(53)
      .fill()
      .map(() => ({
        name: faker.name.lastName() + faker.name.firstName(),
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber(),
      }));

  const [data, setData] = useState(sample);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    resetResizing,
  } = useTable(
    { columns, data, defaultColumn },
    useBlockLayout,
    useResizeColumns
  );

  return (
    // <table {...getTableProps()}>
    //   <thead>
    //     {headerGroups.map((headerGroup) => (
    //       <tr {...headerGroup.getHeaderGroupProps()}>
    //         {headerGroup.headers.map((column) => (
    //           <th {...column.getHeaderProps()}>{column.render("Header")}</th>
    //         ))}
    //       </tr>
    //     ))}
    //   </thead>
    //   <tbody {...getTableBodyProps()}>
    //     {rows.map((row) => {
    //       prepareRow(row);
    //       return (
    //         <tr {...row.getRowProps()}>
    //           {row.cells.map((cell) => (
    //             <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
    //           ))}
    //         </tr>
    //       );
    //     })}
    //   </tbody>
    // </table>

    <Styles>
      <div>
        <div {...getTableProps()} className="table">
          <div>
            {headerGroups.map((headerGroup) => (
              <div {...headerGroup.getHeaderGroupProps()} className="tr">
                {headerGroup.headers.map((column) => (
                  <div {...column.getHeaderProps()} className="th">
                    {column.render("Header")}
                    {/* Use column.getResizerProps to hook up the events correctly */}
                    <div
                      {...column.getResizerProps()}
                      className={`resizer ${
                        column.isResizing ? "isResizing" : ""
                      }`}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <div {...row.getRowProps()} className="tr">
                  {row.cells.map((cell) => {
                    return (
                      <div {...cell.getCellProps()} className="td">
                        {cell.render("Cell")}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Styles>
  );
};

export default Tables;
