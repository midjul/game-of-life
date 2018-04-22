import React, { Component } from "react";
import { Observable } from "rxjs";
import Table from "./components/Table/Table";

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
    this.createTable();
  }
  createTable = () => {
    const { rows, columns } = this.state;
    let obj = {};
    const obs$ = Observable.range(1, rows * columns)
      .bufferCount(columns)
      .map(row =>
        row.reduce((acc, cell) => {
          acc[cell] = Math.random() < 0.15;
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
  };
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
        // console.log("underpopulation and overpopulation", cell);
        tbl[cell] = false;
        continue;
      }
      if (!table[cell] && neighbours === 3) {
        //console.log("reproduction", cell);
        tbl[cell] = true;
        continue;
      }
    }
    this.setState({ ...this.state, table: tbl, gen: this.state.gen + 1 });
  };

  render() {
    const { gen, started, table, rows } = this.state;
    return (
      <div>
        <h3>Generation num:{gen}</h3>

        <Table
          table={table}
          rows={rows}
          cellClickHandler={this.selectHandler}
        />
        <button onClick={this.startGame}>{started ? "Stop" : "Start"}</button>
        <button onClick={this.createTable}>Reset</button>
      </div>
    );
  }
}

export default hot(module)(App);
