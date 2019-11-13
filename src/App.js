import React, { useState } from "react";
import Board, { mapBoard } from "./Board";
import Dice, { getRollResult } from "./Dice";

import "./App.css";

function App() {
  const [rows, setRows] = useState(initRows(6, 6));
  const [selected, setSelected] = useState();
  const [tile, setTile] = useState();

  const min = 0;
  const max = 5;
  const dice = [{ value: selected }, { value: tile }];

  return (
    <div className="App">
      <Board {...{ rows, selected, updateCell }} />
      <Dice dice={dice} roll={rollDice} />
    </div>
  );

  function updateCell({ x, y }) {
    if (rows[x][y].value !== undefined) return;

    setRows(
      mapBoard(rows, (cell, cellX, cellY) => {
        if (selected !== cellX && selected !== cellY) return cell;

        if (cellX === x && cellY === y)
          return { ...cell, value: tile, updated: true };

        if (!cell.updated) return cell;

        const { value, updated, ...rest } = cell;

        return rest;
      })
    );
  }

  function rollDice() {
    setSelected(getRollResult(min, max));
    setTile(getRollResult(min, max));
    setRows(mapBoard(rows, ({ updated, ...cell }) => cell));
  }
}

export default App;

function initBoard() {
  return [
    [{}, {}, {}, { s: 1 }, {}, {}, {}, {}],
    [{}, {}, { m: true }, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, { m: true }, {}, {}],
    [{ s: 2 }, {}, {}, {}, { b: true }, {}, {}, {}],
    [{}, {}, {}, { m: true }, { mine: true }, {}, {}, { s: 4 }],
    [{}, {}, {}, {}, {}, {}, { m: true }, {}],
    [{}, {}, {}, {}, {}, { m: true }, {}, {}],
    [{}, {}, {}, { s: 3 }, {}, {}, {}, {}]
  ].map(setupBoard);
}

function setupBoard(row, x) {
  return row.map((cell, y) => {
    const { s: station, m: mountain, mine } = cell;

    const borders = [0, 7];
    const isBorder = borders.includes(x) || borders.includes(y);
    const isOccupied = isBorder || station > 0 || mountain || mine;
    const type = getType(cell);

    return { x, y, isOccupied, isBorder, type, ...(station && { station }) };
  });
}

function getType(cell) {
  if (cell.m) return "MOUNTAIN";
  if (cell.b) return "BONUS";
  if (cell.mine) return "MINE";
  if (cell.s) return "STATION";
}
