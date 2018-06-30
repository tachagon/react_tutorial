import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return ( 
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={"square-" + i}
      />
    );
  }

  renderSquares() {
    let squares = [];

    for (let i = 0; i < 3; i++) {
      let col = [];
      for (let j = 0; j < 3; j++) {
        col.push(this.renderSquare((i * 3) + j));
      }
      squares.push(<div className="board-row" key={"board-row-" + i}>{col}</div>);
    }

    return squares;
  }

  render() {

    return (
      <div>
        {this.renderSquares()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        location: {col: -1, row: -1},
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];

    // Copy squares array.
    // The original array will not be modified.
    const squares = current.squares.slice();

    // Ignore a click if someone has won
    // or if a Square is already filled.
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    // const is constant
    // but if const hold array or object
    // it still can change the data in array or object
    // but it can't re-defined
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        location: {
          ...current.location,
          col: (i%3),
          row: Math.floor(i/3)
        },
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // stap is an item in history
    // move is an index
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + 
        ' (' + step.location.col + ', ' + step.location.row + ')' :
        'Go to game start';
      return(
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            className={this.state.stepNumber === move ? 'bold' : 'normal'}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
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

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}