import React, { Component } from "react";
import { Observable } from "rxjs";

import { hot } from "react-hot-loader";
import styles from "./App.css";

class App extends Component {
  state = {
    table: {},
    rows: 20,
    columns: 20,
    started: false
  };

  componentDidMount() {
    const { rows, columns } = this.state;
    let obj = {};
    const obs$ = Observable.range(0, rows * columns)
      .bufferCount(columns)
      .map(row =>
        row.reduce((acc, cell) => {
          acc[cell] = Math.random() < 0.6;
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
  startGame = () => {
    this.setState({ ...this.state, started: !this.state.started });
    Observable.interval(500)
      .takeWhile(() => this.state.started)
      .subscribe(() => this.move());
  };
  move = () => {
    const { table, rows, columns } = this.state;
    const tbl = { ...table };
    for (const cell in table) {
      const neighbours = [
        table[+cell + 1],
        table[+cell - 1],
        table[+cell - rows],
        table[+cell + rows]
      ];
      const liveN = neighbours.filter(val => val === true);
      if (table[cell]) {
        if (liveN.length < 2 || liveN.length > 3) {
          tbl[cell] = false;
        }
      } else {
        if (liveN.length === 2 || liveN.length === 3) {
          //tbl[cell] = true;
          if (!table[+cell - 1] && table[+cell - 1] > 0) {
            tbl[+cell - 1] = true;
          } else if (!table[+cell + 1] && table[+cell + 1] < rows * columns) {
            tbl[+cell + 1] = true;
          } else if (table[+cell - rows] && table[+cell - rows] > 0) {
            tbl[+cell - rows] = true;
          } else if (
            table[+cell + rows] &&
            table[+cell + rows] < rows * columns
          ) {
            tbl[+cell + rows] = true;
          }
        }
      }
    }
    this.setState({ ...this.state, table: tbl });
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
    return (
      <div className={styles.cellContainer}>
        {this.genTable()}
        <button onClick={this.startGame}>Start</button>
      </div>
    );
  }
}

export default hot(module)(App);
