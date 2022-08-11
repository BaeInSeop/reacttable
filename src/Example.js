import React from "react";
import ReactDataGrid from "react-data-grid";
import PropTypes from "prop-types";
// import NameFormatter from "./NameFormatter";

const {
  Draggable: { RowActionsCell, DropTargetRowContainer },
  DraggableHeader: { DraggableContainer },
  Data: { Selectors },
} = require("react-data-grid-addons");

const RowRenderer = DropTargetRowContainer(ReactDataGrid.Row);

class Example extends React.Component {
  static propTypes = {
    rowKey: PropTypes.string.isRequired,
  };

  static defaultProps = { rowKey: "id" };

  constructor(props, context) {
    super(props, context);

    this.state = {
      rows: this.createRows(50),
      selectedIds: [1, 2],
      _columns: [
        {
          key: "id",
          name: "ID",
          width: 50,
          draggable: true,
          editable: true,
        },
        {
          key: "task",
          name: "Title",
          draggable: true,
          resizable: true,
          editable: true,
        },
        {
          key: "priority",
          name: "Priority",
          draggable: true,
          resizable: true,
          editable: true,
          //   formatter: NameFormatter,
        },
        {
          key: "issueType",
          name: "Issue Type",
          draggable: true,
          resizable: true,
          editable: true,
        },
      ],
    };
  }

  onHeaderDrop = (source, target) => {
    const { _columns } = this.state;
    const stateCopy = Object.assign({}, this.state);
    const columnSourceIndex = _columns.findIndex((i) => i.key === source);
    const columnTargetIndex = _columns.findIndex((i) => i.key === target);

    stateCopy._columns.splice(
      columnTargetIndex,
      0,
      stateCopy._columns.splice(columnSourceIndex, 1)[0]
    );

    const emptyColumns = Object.assign({}, this.state, { _columns: [] });
    this.setState(emptyColumns);

    const reorderedColumns = Object.assign({}, this.state, {
      _columns: stateCopy._columns,
    });
    this.setState(reorderedColumns);
  };

  getRandomDate = (start, end) => {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    ).toLocaleDateString();
  };

  createRows = (numberOfRows) => {
    let rows = [];
    for (let i = 1; i < numberOfRows; i++) {
      rows.push({
        id: i,
        task: "Task " + i,
        complete: Math.min(100, Math.round(Math.random() * 110)),
        priority: ["Critical", "High", "Medium", "Low"][
          Math.floor(Math.random() * 3 + 1)
        ],
        issueType: ["Bug", "Improvement", "Epic", "Story"][
          Math.floor(Math.random() * 3 + 1)
        ],
        startDate: this.getRandomDate(new Date(2015, 3, 1), new Date()),
        completeDate: this.getRandomDate(new Date(), new Date(2016, 0, 1)),
      });
    }
    return rows;
  };

  rowGetter = (i) => {
    const nameandpic = {
      name: "geet",
      imgpath: "kalani",
    };
    const row = Object.assign({}, this.state.rows[i], { nameandpic });
    // return this.state.rows[i];
    return row;
  };

  isDraggedRowSelected = (selectedRows, rowDragSource) => {
    if (selectedRows && selectedRows.length > 0) {
      let key = this.props.rowKey;
      return (
        selectedRows.filter((r) => r[key] === rowDragSource.data[key]).length >
        0
      );
    }
    return false;
  };

  reorderRows = (e) => {
    let selectedRows = Selectors.getSelectedRowsByKey({
      rowKey: this.props.rowKey,
      selectedKeys: this.state.selectedIds,
      rows: this.state.rows,
    });
    let draggedRows = this.isDraggedRowSelected(selectedRows, e.rowSource)
      ? selectedRows
      : [e.rowSource.data];
    let undraggedRows = this.state.rows.filter(function (r) {
      return draggedRows.indexOf(r) === -1;
    });
    let args = [e.rowTarget.idx, 0].concat(draggedRows);
    Array.prototype.splice.apply(undraggedRows, args);
    this.setState({ rows: undraggedRows });
  };

  onRowsSelected = (rows) => {
    this.setState({
      selectedIds: this.state.selectedIds.concat(
        rows.map((r) => r.row[this.props.rowKey])
      ),
    });
  };

  onRowsDeselected = (rows) => {
    let rowIds = rows.map((r) => r.row[this.props.rowKey]);
    this.setState({
      selectedIds: this.state.selectedIds.filter(
        (i) => rowIds.indexOf(i) === -1
      ),
    });
  };

  onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    this.setState((state) => {
      const rows = state.rows.slice();
      for (let i = fromRow; i <= toRow; i++) {
        rows[i] = { ...rows[i], ...updated };
      }
      return { rows };
    });
  };

  render() {
    return (
      <DraggableContainer onHeaderDrop={this.onHeaderDrop}>
        <ReactDataGrid
          enableCellSelection={true}
          rowActionsCell={RowActionsCell}
          columns={this.state._columns}
          rowGetter={this.rowGetter}
          rowsCount={this.state.rows.length}
          minHeight={500}
          onGridRowsUpdated={this.onGridRowsUpdated}
          enableCellSelect={true}
          rowRenderer={<RowRenderer onRowDrop={this.reorderRows} />}
          rowSelection={{
            showCheckbox: true,
            enableShiftSelect: true,
            onRowsSelected: this.onRowsSelected,
            onRowsDeselected: this.onRowsDeselected,
            selectBy: {
              keys: {
                rowKey: this.props.rowKey,
                values: this.state.selectedIds,
              },
            },
          }}
        />
      </DraggableContainer>
    );
  }
}
export default Example;
