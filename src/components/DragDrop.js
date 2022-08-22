import React, { useCallback, useEffect, useRef, useState } from "react";
import { Table } from "antd";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ReactDragListView from "react-drag-listview";
import update from "immutability-helper";

import { FcFolder, FcFile } from "react-icons/fc";
import { BsThreeDotsVertical } from "react-icons/bs";

import { Resizable } from "react-resizable";

import { useDropzone } from "react-dropzone";

import moment from "moment";
// import sample from "../folderFiles/sample";

import "./DragDrop.css";

const DraggableBodyRow = ({
  index,
  moveRow,
  className,
  style,

  ...restProps
}) => {
  // console.log("DraggableBodyRow - restProps : ", restProps);
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
        // console.log("item.index : ", item.index, "Index : ", index);
        console.log(
          restProps.children[index].props.record.type === "folder"
            ? "Folder"
            : "File"
        );

        if ("folder" === restProps.children[index].props.record.type) {
          console.log("폴더로 파일 이동");
          // set
        } else {
          // 개체 이동 함수
          // moveRow(item.index, index);
        }
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
    >
      {/* {console.log("restProps : ", restProps)} */}
    </tr>
  );
};

const ResizableTitle = (props) => {
  const {
    onResize,
    onResizeStart,
    onResizeStop,
    width,
    title,
    fixed,
    ...restProps
  } = props;

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
      onResize={!fixed && onResize}
      // onResize={onResize}
      onResizeStart={onResizeStart}
      onResizeStop={onResizeStop}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      {/* {console.log("restProps : ", restProps)} */}
      <th {...restProps}>{/* <span>{title}</span> */}</th>
      {/* {console.log("restProps : ", fixed)} */}
    </Resizable>
  );
};

const DragDrop = ({ files, setFiles, folderPath, setFolderPath }) => {
  const [keyword, setKeyword] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [isResizing, setIsResizing] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState();

  const onDrop = useCallback((acceptedFiles) => {
    console.log("On Drop : ", acceptedFiles);
    return;

    const fs = window.require("fs");
    const dest = `C:\\Sorizava\\Transcription_Tools\\data\\Origin_File\\`;

    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }

    const possibleList = ["mp4", "m4a", "wav", "mp3"];

    // acceptedFiles.map(async (item) => {
    //   const format = item.name
    //     .substring(item.name.lastIndexOf(".") + 1, item.name.length)
    //     .toLowerCase();

    //   if (possibleList.includes(format)) {
    //     fs.copyFileSync(item.path, `${dest}${item.name}`);
    //     const result = await convertToWav(item.name, `${dest}${item.name}`);

    //     if (result) {
    //       refreshFileList();
    //     }
    //   } else {
    //     toast("지원하지 않는 파일 형식입니다.");
    //   }
    // });
  }, []);

  useEffect(() => {
    console.log("isMouseOver : ", isMouseOver);
  }, [isMouseOver]);

  const [columns, setColumns] = useState([
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 150,
      fixed: true,
      render: (text, record) => {
        switch (record.type) {
          case "folder":
            return <FcFolder />;

          case "file":
            return <FcFile />;

          default:
            return;
        }
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 200,
      fixed: false,
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => {
        return (
          <>
            <span
              onMouseEnter={() => setIsMouseOver(record.key)}
              onClick={() =>
                "folder" === record.type && setFolderPath(record.fullpath)
              }
            >
              {record.name}
            </span>
            <span
              className={`item-detail ${record.key}`}
              style={
                parseInt(isMouseOver) === parseInt(record.key)
                  ? { visibility: `visible` }
                  : { visibility: `hidden` }
              }
            >
              <BsThreeDotsVertical />
            </span>
          </>
        );
      },
    },
    {
      title: "Modified",
      dataIndex: "modified",
      key: "modified",
      width: 200,
      fixed: false,
      sorter: (a, b) => a.modified - b.modified,
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      width: 300,
      fixed: false,
      sorter: (a, b) => a.size.localeCompare(b.size),
    },
  ]);
  // const [data, setData] = useState([
  //   {
  //     key: "1",
  //     type: "folder",
  //     name: "Test Folder",
  //     modified: moment().format("YYYY-MM-DD"),
  //     size: 0,
  //   },
  //   {
  //     key: "2",
  //     type: "file",
  //     name: "Tobe",
  //     modified: moment().format("YYYY-MM-DD"),
  //     size: 1821,
  //   },
  //   {
  //     key: "3",
  //     type: "file",
  //     name: "Ssi bal",
  //     modified: moment().format("YYYY-MM-DD"),
  //     size: 17421,
  //   },
  // ]);

  // const [data, setData] = useState(sample.home.files);

  // useEffect(() => {
  //   if (data) {
  //     const list = data.filter((item) => item.name.includes(keyword));
  //     setData(list);
  //   }
  // }, [keyword]);

  // useEffect(() => {
  //   console.log("data : ", data);
  // }, [data]);

  useEffect(() => {
    console.log("isResizing : ", isResizing);
  }, [isResizing]);

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const selectedData = files[dragIndex];
      const moveData = files[hoverIndex];

      // setData(
      //   update(data, {
      //     $splice: [
      //       [dragIndex, 1],
      //       [dragIndex, 0, moveData],
      //       [hoverIndex, 1],
      //       [hoverIndex, 0, selectedData],
      //     ],
      //   })
      // );

      setFiles(
        update(files, {
          $splice: [
            [dragIndex, 1],
            [dragIndex, 0, moveData],
            [hoverIndex, 1],
            [hoverIndex, 0, selectedData],
          ],
        })
      );
    },
    [files]
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
      fixed: column.fixed,
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
  });

  return (
    <>
      <div className="keyword">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
      <div className="container mt-5" {...getRootProps()}>
        {/* <DndProvider backend={HTML5Backend}> */}
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
            dataSource={files}
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
        {/* </DndProvider> */}
      </div>
    </>
  );
};

export default DragDrop;
