import React from "react";
import "./Board.css";

// PUBLIC_INTERFACE
export default function Board({ board, onCellClick, isMyTurn, disabled, winnerLine }) {
  /**
   * Renders the Tic Tac Toe board grid. Highlights winner line (if any).
   * 
   * @param board Array of 9 cells: ["X","","O",...]
   * @param onCellClick function(cellIdx)
   * @param isMyTurn boolean
   * @param disabled boolean, disables interaction if true
   * @param winnerLine array|null, indices of winning line
   */
  return (
    <div className={`ttt-board${disabled ? " disabled" : ""}`}>
      {board.map((cell, idx) => (
        <button
          key={idx}
          className={`ttt-cell${winnerLine && winnerLine.includes(idx) ? " win-cell" : ""}`}
          onClick={() => !disabled && onCellClick(idx)}
          disabled={disabled || cell}
          aria-label={cell ? `Cell ${idx + 1}: ${cell}` : `Cell ${idx + 1}: empty`}
        >
          <span className={cell === "X" ? "cell-x" : cell === "O" ? "cell-o" : ""}>
            {cell || ""}
          </span>
        </button>
      ))}
    </div>
  );
}
