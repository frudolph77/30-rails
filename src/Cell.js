import React from "react";
import classNames from "classnames";
import "./Cell.css";

export default function Cell(props) {
  const { cell, onClick, isAvailable } = props;
  const classes = classNames([
    "cell",
    cell.type && cell.type.toLowerCase(),
    {
      available: isAvailable,
      border: cell.isBorder,
      bonus: cell.isBonus,
      flipped: cell.flip,
      [`rotated-${cell.rotation}`]: cell.rotation,
      [`track track-${cell.value}`]: cell.type === "TILE"
    }
  ]);

  return (
    <div className={classes} onClick={() => isAvailable && onClick(cell)}>
      {getContent(cell)}
    </div>
  );
}

function getContent(cell) {
  switch (cell.type) {
    case "STATION":
      return (
        <div className="station">
          <div className="circle">{cell.value}</div>
        </div>
      );
    case "MOUNTAIN":
      return emoji("⛰", "mountain");
    case "BONUS":
      return emoji("☆", "bonus");
    case "MINE":
      return emoji("⚒️", "mine");
    default:
      return "";
  }
}

function emoji(img, className) {
  return (
    <span role="img" aria-label={className} className={className}>
      {img}
    </span>
  );
}
