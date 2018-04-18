import React, { Component } from "react";
import { Observable } from "rxjs";

import { hot } from "react-hot-loader";
import styles from "./App.css";

class App extends Component {
  state = {
    table: {},
    rows: 10,
    columns: 10
  };

  componentDidMount() {
    const { rows, columns } = this.state;
    let obj = {};
    const obs$ = Observable.range(0, rows * columns)
      .bufferCount(columns)
      .map(row =>
        row.reduce((acc, cell) => {
          acc[cell] = Math.random() < 0.2;
          return acc;
        }, {})
      )
      .take(columns * rows)
      .subscribe(
        n => {
          obj = { ...obj, ...n };
        },
        err => console.error(err),
        () => this.setState(prevState => ({ ...prevState, table: obj }))
      );
  }
  selectHandler = id => {
    const { table } = this.state;
    table[id] = !table[id];
    this.setState({ ...this.state, table });
  };

  genTable = () => {
    const { table, rows } = this.state;
    let counter = 0;
    const res = [];
    const fin = [];
    for (const cell in table) {
      res.push(
        <div
          onClick={() => this.selectHandler(cell)}
          key={cell}
          className={
            table[cell]
              ? [styles.cell, styles.cellSelected].join(" ")
              : styles.cell
          }
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
    return <div className={styles.cellContainer}>{this.genTable()}</div>;
  }
}

export default hot(module)(App);
