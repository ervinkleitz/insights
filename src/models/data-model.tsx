
import data from './data';
import { ITableState } from '../components/Table';
import * as safe from '@oresoftware/safe-stringify';

/** TYPE DEFINITIONS **/
export interface IData {
  All_Traffic_dest: string
  All_Traffic_src: string;
  sum_bytes: string;
}
/** TYPE DEFINITIONS **/

// Class that would contain methods and properties related to handling
// data for this exercise.
class DataModel {

  private static _instance: DataModel;

  static get instance(): DataModel {
    if (!this._instance) {
      this._instance = new DataModel();
    }
    return this._instance;
  }

  private data: IData[] = [];

  private history: ITableState[] = [];

  constructor() {
    this.data = data;
  }

  getData(): IData[] {
    return this.data;
  }

  storeToHistory(history: ITableState[]) {
    this.history = history;
    this.storeInSession(this.history);
  }

  getHistory() {
    let historyFromSession = window.sessionStorage.hasOwnProperty('insight_history') &&
      window.sessionStorage.getItem('insight_history') &&
      JSON.parse(window.sessionStorage.getItem('insight_history') as string);
    return historyFromSession && historyFromSession.length ? historyFromSession : [];
  }

  deleteHistory() {
    this.history = [];
    this.storeInSession([]);
  }

  private storeInSession(history: ITableState[]) {
    if (window.sessionStorage) {
      window.sessionStorage.setItem('insight_history', safe.stringifyDeep(history));
    }
  }

}

export default DataModel;