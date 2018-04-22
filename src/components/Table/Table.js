import React, { Component } from "react";
import { Observable } from "rxjs";
import Cell from "../Cell/Cell";
import styles from "./Table.css";

class Table extends Component {
  genTable = () => {
    const { table, rows, cellClickHandler } = this.props;
    let counter = 0;
    const res = [];
    const fin = [];
    for (const cell in table) {
      res.push(
        <Cell
          cell={cell}
          table={table}
          key={cell}
          click={() => cellClickHandler(cell)}
        />
      );
    }

    Observable.from(res)
      .bufferCount(rows)
      .map(r => {
        return (
          <div key={Math.random()} className={styles.row}>
            {r}
          </div>
        );
      })
      .subscribe(x => fin.push(x));
    return fin;
  };
  render() {
    return <div className={styles.tableContainer}>{this.genTable()}</div>;
  }
}

export default Table;
