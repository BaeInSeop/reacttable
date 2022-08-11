import React, { useCallback, useEffect, useRef, useState } from "react";
import { Table } from "antd";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ReactDragListView from "react-drag-listview";
import update from "immutability-helper";

import { FcFolder, FcFile } from "react-icons/fc";

import { Resizable } from "react-resizable";

import "./DragDrop.css";

const DraggableBodyRow = ({
  index,
  moveRow,
  className,
  style,
  ...restProps
}) => {
  console.log("DraggableBodyRow - restProps : ", restProps);
  const ref = useRef();
  const [{ isOver, dropClassName }, drop] = useDrop(
    () => ({
      // accept: "DraggableBodyRow",
      accept: "DraggableBodyRow",
      collect: (monitor) => {
        const { index: dragIndex } = monitor.getItem() || {};
        if (dragIndex === index) {
          return {};
        }
        return {
          isOver: monitor.isOver(),
          dropClassName: dragIndex < index ? "drop-over-down" : "drop-over-up",
        };
      },
      drop: (item) => {
        console.log("item.index : ", item.index, "Index : ", index);
        // moveRow(item.index, index);
      },
    }),
    [index]
  );

  const [, drag] = useDrag(
    () => ({
      type: "DraggableBodyRow",
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [index]
  );
  drop(drag(ref));

  return (
    <tr
      ref={ref}
      className={`${className} ${isOver ? dropClassName : ""}`}
      style={isOver ? { outline: `2px dotted red`, ...style } : { ...style }}
      {...restProps}
    ></tr>
  );
};

const ResizableTitle = (props) => {
  const { onResize, onResizeStart, onResizeStop, width, title, ...restProps } =
    props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      }
      onResize={onResize}
      onResizeStart={onResizeStart}
      onResizeStop={onResizeStop}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      {/* {console.log("restProps : ", restProps)} */}
      <th {...restProps}>{/* <span>{title}</span> */}</th>
    </Resizable>
  );
};

const DragDrop = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [isResizing, setIsResizing] = useState(false);

  const [columns, setColumns] = useState([
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 150,
      render: (text, record) => {
        console.log("Text : ", text, "record :", record);
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 200,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      width: 200,
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: 300,
      sorter: (a, b) => a.address.localeCompare(b.address),
    },
  ]);
  const [data, setData] = useState([
    {
      key: "1",
      type: "folder",
      name: "James",
      age: 26,
      address: "India",
    },
    {
      key: "2",
      type: "file",
      name: "Tobe",
      age: 33,
      address: "Korea",
    },
    {
      key: "3",
      type: "file",
      name: "Ssi bal",
      age: 18,
      address: "Japan",
    },
  ]);

  useEffect(() => {
    console.log("isResizing : ", isResizing);
  }, [isResizing]);

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const selectedData = data[dragIndex];
      const moveData = data[hoverIndex];

      setData(
        update(data, {
          $splice: [
            [dragIndex, 1],
            [dragIndex, 0, moveData],
            [hoverIndex, 1],
            [hoverIndex, 0, selectedData],
          ],
        })
      );
    },
    [data]
  );

  const handleResize =
    (index) =>
    (_, { size }) => {
      const newColumns = [...columns];
      newColumns[index] = { ...newColumns[index], width: size.width };
      setColumns(newColumns);
    };

  const onResizeStart = (e) => {
    e.stopPropagation();
    setIsResizing(true);
  };

  const onResizeStop = (e) => {
    e.stopPropagation();
    setIsResizing(false);
  };

  const mergeColumns = columns.map((col, index) => ({
    ...col,
    onHeaderCell: (column) => ({
      width: column.width,
      title: column.title,
      onResize: handleResize(index),
      onResizeStart: onResizeStart,
      onResizeStop: onResizeStop,
    }),
  }));

  const components = {
    header: {
      cell: ResizableTitle,
    },
    body: {
      row: DraggableBodyRow,
    },
  };

  const dragProps = {
    onDragEnd(fromIndex, toIndex) {
      const dragColumns = [...columns];
      const item = dragColumns.splice(fromIndex - 1, 1)[0];
      dragColumns.splice(toIndex - 1, 0, item);
      setColumns(dragColumns);
    },
    nodeSelector: "th",
    handleSelector: "span",
    ignoreSelector: "react-resizable-handle",
  };

  return (
    <div className="container mt-5">
      <DndProvider backend={HTML5Backend}>
        <ReactDragListView.DragColumn {...dragProps}>
          <Table
            showSorterTooltip={false}
            rowSelection={{
              type: "checkbox",
              selectedRowKeys: selectedRows,
              onChange: (selectedRowKeys, selectedRows) => {
                setSelectedRows(selectedRowKeys);
              },

              getCheckboxProps: (record) => ({
                disabled: record.name === "Disabled User",
                // Column configuration not to be checked
                name: record.name,
              }),
            }}
            bordered
            pagination={false}
            columns={mergeColumns}
            dataSource={data}
            components={components}
            onRow={(record, index) => {
              return {
                onClick: (e) => {
                  setSelectedRows([String(index + 1)]);
                },

                index,
                moveRow,
              };
            }}
            onHeaderRow={(columns, index) => {
              return {
                onContextMenu: (e) => {
                  setIsResizing(false);
                  console.log("된다!!!!!");
                },
              };
            }}
          />
        </ReactDragListView.DragColumn>
      </DndProvider>
    </div>
  );
};

export default DragDrop;
