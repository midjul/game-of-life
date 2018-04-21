import React, { Component } from "react";
import { Observable } from "rxjs";

import { hot } from "react-hot-loader";
import styles from "./App.css";

class App extends Component {
  state = {
    table: {},
    rows: 40,
    columns: 40,
    started: false,
    gen: 0
  };

  componentDidMount() {
    const { rows, columns } = this.state;
    let obj = {};
    const obs$ = Observable.range(1, rows * columns)
      .bufferCount(columns)
      .map(row =>
        row.reduce((acc, cell) => {
          acc[cell] = Math.random() < 0.25;
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
        table[+cell - rows - 1],
        table[+cell - rows + 1],
        table[+cell + rows],
        table[+cell + rows + 1],
        table[+cell + rows - 1]
      ].filter(val => val === true).length;

      if (table[cell] && (neighbours === 2 || neighbours === 3)) {
        continue;
      }
      if (table[cell] && (neighbours < 2 || neighbours > 3)) {
        // console.log("underpopulation", cell);
        tbl[cell] = false;
      }
      if (!table[cell] && neighbours === 3) {
        //console.log("reproduction", cell);
        tbl[cell] = true;
      }
    }
    this.setState({ ...this.state, table: tbl, gen: this.state.gen + 1 });
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
    const { gen, started } = this.state;
    return (
      <div className={styles.cellContainer}>
        {this.genTable()}
        <button onClick={this.startGame}>{started ? "Stop" : "Start"}</button>
        <button>Reset</button>
        <h3>Generation num:{gen}</h3>
      </div>
    );
  }
}

export default hot(module)(App);
