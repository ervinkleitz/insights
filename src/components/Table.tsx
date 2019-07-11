import React from 'react';
import DataModel, { IData } from '../models/data-model';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Prompt from './Prompt';
import History from './History';

/** TYPE DEFINITIONS **/
type IProps = any;

export interface ITableState {
  tableData: IData[];
  pivotBy: string[];
  history: ITableState[];
  pageSize: number;
  modal: {
    isOpen: boolean;
    ipAddress: string;
  }
}
/** TYPE DEFINITIONS **/

const model = DataModel.instance; // Data

class Table extends React.Component<IProps, ITableState> {

  private handlers = {
    setFilter: (filterUsing: string, ipAddress?: string) => undefined,
    openModal: (shouldOpen: boolean) => undefined
  };

  constructor(props: IProps) {
    super(props);

    this.state = {
      tableData: [],
      pivotBy: [],
      history: [],
      pageSize: 10,
      modal: {
        isOpen: false,
        ipAddress: ''
      }
    } as ITableState;

    this.handlers = {
      setFilter: this.setFilter,
      openModal: this.openModal
    }
  }

  loadState = (state: ITableState) => {
    this.setState(state);
  }

  goBackOneState = () => {
    if (this.state.history.length > -1) {
      let history = this.state.history;
      history.pop();
      model.storeToHistory(history);
      if (!history.length) {
        this.loadDefaultState();
      } else {
        this.loadState(this.state.history[this.state.history.length - 1]);
      }
    }
  }

  loadDefaultState = () => {
    this.setState({
      tableData: model.getData(),
      modal: {
        isOpen: false,
        ipAddress: ''
      }
    });
  }

  resetHistory = () => {
    this.setState({ history: [] });
    model.deleteHistory();
  }

  openModal = (shouldOpen: boolean, ipAddress?: string) => {
    let _modal = this.state.modal;
    _modal.isOpen = shouldOpen;
    _modal.ipAddress = ipAddress ? ipAddress : _modal.ipAddress;

    this.setState({ modal: _modal });
    return undefined;
  };

  getTdProps = (state: any, rowInfo: any, column: any) => {
    return {
      onClick: (e: React.MouseEvent, handleOriginal: () => void) => {
        if (handleOriginal) { handleOriginal(); }
        if (rowInfo && rowInfo.original) {
          this.openModal(true, rowInfo.original[column.id]); // Open modal
        }
      }
    }
  }

  setFilter = (filterUsing: string, ipAddress?: string): undefined => {
    let pivotUsingColumn = ''; // the column that was selected in the modal
    let _pivotBy = this.state.pivotBy; // the array of pivot columns for React-table
    let _tableData = this.state.tableData;
    let state = this.state;

    if (filterUsing === 'source') {
      pivotUsingColumn = 'All_Traffic_src';
    } else if (filterUsing === 'destination') {
      pivotUsingColumn = 'All_Traffic_dest';
    } else {
      return undefined; // skipping pivoting around sum_bytes
    }

    // Add column to pivot by
    _pivotBy.push(pivotUsingColumn);

    // Only show data relevant to the selected IP address
    _tableData = _tableData.filter((row: any): boolean => {
      return row[pivotUsingColumn] === (ipAddress ? ipAddress : this.state.modal.ipAddress);
    });

    state.modal.isOpen = false; // Close modal
    state.modal.ipAddress = ''; // Empty selected IP address
    state.history.push(this.state);

    this.setState({
      pivotBy: _pivotBy,
      tableData: _tableData,
      modal: {
        isOpen: false,
        ipAddress: ''
      },
      history: state.history
    }, () => {
      model.storeToHistory(this.state.history);
    });

    return undefined;
  }

  componentDidMount() {
    const history = model.getHistory();
    if (history && history.length) {
      let allStates = history;
      let lastViewedState = Array.from(allStates).pop() as ITableState;
      lastViewedState.history = [lastViewedState];
      this.setState(lastViewedState);
    } else {
      this.loadDefaultState();
    }
  }

  render() {

    const columns = [
      { Header: 'Destination Traffic', accessor: 'All_Traffic_dest', id: 'All_Traffic_dest' },
      { Header: 'Source Traffic', accessor: 'All_Traffic_src', id: 'All_Traffic_src' },
      { Header: 'Sum of Bytes', accessor: 'sum_bytes', id: 'sum_bytes' }
    ];

    return (
      <div>
        <History
          history={this.state.history}
          back={this.goBackOneState}
          reset={this.resetHistory} />

        <ReactTable
          sortable
          filterable
          className='-striped'
          data={this.state.tableData}
          columns={columns}
          pageSize={this.state.pageSize}
          pivotBy={this.state.pivotBy}
          getTdProps={this.getTdProps} />

        <Prompt
          handlers={this.handlers}
          promptProps={this.state.modal} />
      </div>
    )
  }
}

export default Table;