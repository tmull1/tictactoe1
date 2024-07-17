import { useState } from 'react';

// Square component represents a single square on the game board
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value} {/* Display the value of the square ('X', 'O', or null) */}
    </button>
  );
}

// Board component represents the game board and handles game logic
function Board({ xIsNext, squares, onPlay }) {
  // Function to handle click events on a square
  function handleClick(i) {
    // If there is already a winner or the square is filled, do nothing
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice(); // Create a copy of the squares array
    // Set the clicked square to 'X' or 'O' based on the current player
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares); // Call the onPlay function with the updated squares array
  }

  const winner = calculateWinner(squares); // Determine if there is a winner
  let status;
  if (winner) {
    status = 'Winner: ' + winner; // Display the winner if there is one
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O'); // Otherwise, display whose turn it is
  }

  return (
    <>
      <div className="status">{status}</div> {/* Display the game status */}
      {/* Render the game board with 3 rows and 3 squares each */}
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

// Main Game component
export default function Game() {
  // State to store the history of moves, initialized with an empty board
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0); // State to store the current move number
  const xIsNext = currentMove % 2 === 0; // Determine if 'X' is the next player
  const currentSquares = history[currentMove]; // Get the current state of the squares

  // Function to handle a play, i.e., when a square is clicked
  function handlePlay(nextSquares) {
    // Update the history with the new move and discard any future moves
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory); // Set the new history
    setCurrentMove(nextHistory.length - 1); // Set the current move to the latest one
  }

  // Function to jump to a specific move in the history
  function jumpTo(nextMove) {
    setCurrentMove(nextMove); // Set the current move to the specified move
  }

  // Create a list of buttons to jump to past moves
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move; // Description for a past move
    } else {
      description = 'Go to game start'; // Description for the start of the game
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button> {/* Button to jump to a specific move */}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} /> {/* Render the Board component */}
      </div>
      <div className="game-info">
        <ol>{moves}</ol> {/* Display the list of move buttons */}
      </div>
    </div>
  );
}

// Function to calculate the winner of the game
function calculateWinner(squares) {
  // Define the possible winning combinations of squares
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  // Check each winning combination to see if there's a winner
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    // If the three squares in a winning combination are the same (and not null), return the winner
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null; // If no winner, return null
}
