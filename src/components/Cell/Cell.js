import React from "react";
import styles from "./Cell.css";

const cell = ({ table, click, cell }) => (
  <div
    onClick={click}
    key={cell}
    className={
      table[cell] ? [styles.cell, styles.cellSelected].join(" ") : styles.cell
    }
  />
);

export default cell;
